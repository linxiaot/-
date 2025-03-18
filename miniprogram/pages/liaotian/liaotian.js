var utils_time = require('../../utils/time.js') //获取时间等
const db = wx.cloud.database()
const _ = db.command
var openid = wx.getStorageSync('openid')
var liaotianWatcher = null
Page({
    data: {
        searchIndex:'',
        messages: [], // 聊天记录
        msg: '', // 当前输入
        scrollTop: 0, // 页面的滚动值
        socketOpen: false, // websocket是否打开
        lastId: '', // 最后一条消息的ID
        isFirstSend: true, // 是否第一次发送消息(区分历史和新加)
        liaotianList: [],
        resdataList: [],
        _openid: '',
        duifNickName: '',
        duifAvatarUrl: '',
        duifOpenid: '',
        inputVal_liaotian: '',
        isFocus: false,
        openid,
        liaotian_id: '',
        isLahei: false,
        laheiOpenid: '',
        _id: '',
        resGoods: '',
        isShowMenu: false,
        isZhiding: false,
        zhidinglist: [],
        deletelist: [],
    },

    toCopy(e) {
        // console.log(e);
        var data = e.currentTarget.dataset.val_copy
        wx.setClipboardData({
            data,
            success(res) {
                console.log('用户点击，成功复制', data);
            }
        })
    },

    toShowMenu() {
        this.setData({
            isShowMenu: !this.data.isShowMenu
        })
    },

    toLahei() {
        var that = this
        wx.showModal({
            cancelColor: 'cancelColor',
            confirmColor: 'confirmColor',
            showCancel: true,
            title: '屏蔽',
            content: '无法发送和接收此用户信息',
            success(res) {
                var laheiOpenid = that.data.laheiOpenid
                var openid = that.data.openid
                if (res.confirm) {
                    console.log('用户点击确定')

                    if (laheiOpenid == openid || laheiOpenid == '') {
                        var _id = that.data.liaotian_id
                        var isLahei = !that.data.isLahei
                        if (isLahei) {
                            var laheiOpenid = openid
                        } else {
                            var laheiOpenid = ''
                        }
                        wx.cloud.callFunction({
                                name: 'talk',
                                data: {
                                    action: 'lahei',
                                    _id,
                                    isLahei,
                                    laheiOpenid,
                                }
                            })
                            .then(res => {
                                console.log('[云函数talk] lahei 成功：：', res);

                                wx.navigateBack({
                                    delta: 0,
                                })
                            })
                            .catch(err => {
                                console.log(err)
                            })

                    } else {
                        console.log('laheiOpenid', this.data.friendsList.laheiOpenid);
                        wx.showToast({
                            icon: 'none',
                            title: '对方屏蔽，无法操作',
                        })

                    }

                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            },
        })

    },
    toZhiding() {
        var resdataList = this.data.resdataList
        var zhidinglist = this.data.zhidinglist
        var isZhiding = this.data.isZhiding
        var userid = wx.getStorageSync('id')
        var _openid = resdataList._openid
        var duifOpenid = resdataList.duifOpenid
        if (openid == _openid) {
            var duifOpenid = duifOpenid
        }
        if (openid == duifOpenid) {
            var duifOpenid = _openid
        }
        if (isZhiding == true) {
            console.log(1);
            var zhidingIndex = zhidinglist.indexOf(duifOpenid)
            zhidinglist.splice(zhidingIndex, 1)
        } else {
            console.log(2);
            zhidinglist.push(duifOpenid)
        }
        console.log(zhidinglist);
        db.collection('user').doc(userid)
            .update({
                data: {
                    zhidinglist,
                }
            })
            .then(res => {
                console.log('置顶 成功', res.stats.updated);
                setTimeout(() => {
                    this.returnPre_onload()
                }, 300);
            })
            .catch(err => {
                console.log('置顶 失败', err);
            })
    },
    toDel() {
        var resdataList = this.data.resdataList
        var deletelist = this.data.deletelist
        var userid = wx.getStorageSync('id')
        var _openid = resdataList._openid
        var duifOpenid = resdataList.duifOpenid
        if (openid == _openid) {
            var duifOpenid = duifOpenid
        }
        if (openid == duifOpenid) {
            var duifOpenid = _openid
        }
        deletelist.push(duifOpenid)
        console.log(deletelist);
        db.collection('user').doc(userid)
            .update({
                data: {
                    deletelist,
                }
            })
            .then(res => {
                console.log('删除 成功', res);
                this.returnPre_onload()
            })
            .catch(err => {
                console.log('删除 失败', err);
            })
    },


    returnPre_onload() {
        var pages = getCurrentPages(); //当前页面
        var beforePage = pages[pages.length - 2]; //前一页
        beforePage.onLoad(); // 执行前一个页面的onLoad方法
        wx.navigateBack({
            delta: 1
        });
    },


    onFocusTap() {
        console.log('onFocusTap');
        this.setData({
            isFocus: true
        })
    },
    onBlur() {
        console.log('onBlur');
        this.setData({
            isFocus: false
        })
    },
    // 输入
    onInput(e) {
        this.setData({
            inputVal_liaotian: e.detail.value
        })
    },

    // 发送消息
    toSend() {
        if (this.data.isLahei) {
            wx.showToast({
                title: '已屏蔽，无法联系',
                icon: 'none',
            })
            return;
        } else {

            var inputVal_liaotian = this.data.inputVal_liaotian;
            if (inputVal_liaotian == '') {
                wx.showToast({
                    title: '请输入内容',
                    icon: 'none',
                })
                return;
            }

            var createTime = utils_time.formatTime(new Date())
            var userinfo = wx.getStorageSync('userinfo')
            var openid = wx.getStorageSync('openid')
            var liaotian = {
                userOpenid: openid,
                userNickName: userinfo.nickName,
                userAvatarUrl: userinfo.avatarUrl,
                // duifOpenid: this.data.duifOpenid,
                // duifNickName: this.data.duifNickName,
                // duifAvatarUrl: this.data.duifAvatarUrl,
                textLiaot: inputVal_liaotian,
                createTime,
            }

            // 安全检查
            var content = inputVal_liaotian
            wx.cloud.callFunction({
                name: 'anquancheck',
                data: {
                    action: 'msgCheck',
                    openid,
                    content,
                },
                success: res => {
                    console.log('安全检查结果：', res);
                    if (res.result.result.suggest == 'pass') {

                        this.setData({
                            inputVal_liaotian: ''
                        })
                        wx.cloud.callFunction({
                                name: 'talk',
                                data: {
                                    action: 'update',
                                    _id: this.data.liaotian_id,
                                    liaotian,
                                    paixuTime: createTime
                                }
                            })
                            .then(res => {
                                console.log('[云函数talk]聊天发送成功：：', res);
                                // this.onShow()

                            })
                            .catch(err => {
                                console.log(err)
                            })

                    } else {
                        wx.showToast({
                            title: '发布内容违规',
                            duration: 1000,
                            icon: 'error',
                            mask: true,
                        })
                        this.setData({
                            isDisabled: false,
                        })
                    }
                },
                fail: err => {
                    console.log('失败', err);
                }
            })

        }
    },
    //自动发送 商品信息
    toSendAuto(_id, detailType) {
        if (this.data.isLahei) {
            wx.showToast({
                title: '已屏蔽，无法联系',
                icon: 'none',
            })
            return;
        } else {
            // var inputVal_liaotian = this.data.inputVal_liaotian;

            var createTime = utils_time.formatTime(new Date())
            var userinfo = wx.getStorageSync('userinfo')
            var openid = wx.getStorageSync('openid')
            var liaotian = {
                userOpenid: openid,
                userNickName: userinfo.nickName,
                userAvatarUrl: userinfo.avatarUrl,
                createTime,
                textLiaot: '发布的相关信息..',
                goods_id: _id,
                isSendAuto: true,
                detailType: detailType,
            }

            var that = this
            wx.cloud.callFunction({
                    name: 'talk',
                    data: {
                        action: 'update',
                        _id: this.data.liaotian_id,
                        liaotian,
                        paixuTime: createTime
                    }
                })
                .then(res => {
                    console.log('[自动发送] 聊天成功：：', res);
                    // db.collection(detailType).doc(_id)
                    //     .get()
                    //     .then(res => {
                    //         console.log('resGoods', res);
                    //         that.setData({
                    //             resGoods: res
                    //         })
                    //     })
                    //     .catch(err => {
                    //         console.log(err)
                    //     })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    },




    // 下载 聊天信息
    loadMes(searchIndex) {
        var that = this
        db.collection('liaotian').doc(this.data.liaotian_id).get()
            .then(res => {
                console.log('下载聊天信息', res.data);

                if (res.data._openid == openid) {
                    var titleText = res.data.duifNickName
                } else {
                    var titleText = res.data.nickName
                }
                wx.setNavigationBarTitle({
                    title: titleText,
                });

                // 下载商品信息
                var liaotianList = res.data.liaotianList
                for (let index = 0; index < liaotianList.length; index++) {
                    const element = liaotianList[index];
                    if (element.isSendAuto) {
                        var _id = element.goods_id
                        var detailType = element.detailType
                        db.collection(detailType).doc(_id)
                            .get()
                            .then(res => {
                                console.log('resGoods', res);
                                if (detailType == 'ershou') {
                                    liaotianList[index].goodsInfo = {
                                        imagetempFileURL: res.data.imagesUrlList[0].imagetempFileURL,
                                        jiage: res.data.jiage,
                                        createTime: res.data.createTime,
                                    }
                                } else if (detailType == 'pinche') {
                                    liaotianList[index].goodsInfo = {
                                        xingch: res.data.xingch,
                                        shijian: res.data.shijian,
                                    }
                                } else if (detailType == 'huzhu') {
                                    liaotianList[index].goodsInfo = {
                                        jianjie: res.data.jianjie,
                                        createTime: res.data.createTime,
                                    }
                                }
                                that.setData({
                                    liaotianList,
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                // element.isSendAuto = false
                                // that.setData({
                                //     liaotianList,
                                // })
                            })
                    } else {
                        that.setData({
                            liaotianList,
                        })
                    }

                }

                that.setData({
                    _openid: res.data._openid, //聊天创建人
                    // liaotianList,
                    duifNickName: res.data.duifNickName,
                    duifAvatarUrl: res.data.duifAvatarUrl,
                    duifOpenid: res.data.duifOpenid,
                    isLahei: res.data.isLahei,
                    laheiOpenid: res.data.laheiOpenid,
                    resdataList: res.data
                })

                if (searchIndex !== undefined) {
                    console.log('searchIndex', searchIndex);
                    this.scrollto_searchIndex(searchIndex)
                } else {
                    var idNum = liaotianList.length - 1
                    this.scrollto_searchIndex(idNum)
                }

            })
    },

    //返回页面传参
    returnPre: function () {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            liaotian_id: this.data.liaotian_id,
        })
        console.log(this.data.liaotian_id);
        // wx.navigateBack({
        //   delta: 1,
        // })
    },

    //页面滑动到搜索的 聊天记录
    scrollto_searchIndex(searchIndex) {
        var selector = '#the-' + searchIndex
        wx.pageScrollTo({
            selector,
        })
    },

    onLoad(options) {
        var searchIndex = options.searchIndex
        console.log('searchIndex',searchIndex);
        if (searchIndex !== undefined) {
            this.setData({
                searchIndex,
            })
        } else {
            this.setData({
                searchIndex:-1,
            })
        }
        //下载用户信息
        var userid = wx.getStorageSync('id')
        db.collection('user').doc(userid)
            .get()
            .then(res => {
                console.log('下载用户信息 成功', res);
                // 置顶
                var zhidinglist = res.data.zhidinglist
                if (zhidinglist !== undefined) {
                    this.setData({
                        zhidinglist: res.data.zhidinglist
                    })
                }
                //删除
                var deletelist = res.data.deletelist
                if (deletelist !== undefined) {
                    this.setData({
                        deletelist: res.data.deletelist
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })

        //------------
        var liaotian_id = options.liaotian_id
        var isZhiding = JSON.parse(options.isZhiding)
        this.setData({
            isZhiding,
            liaotian_id,
        })
        var that = this
        liaotianWatcher = db.collection('liaotian').doc(liaotian_id)
            .watch({
                onChange: function (snapshot) {
                    //只打印变动的信息
                    if (snapshot.docChanges.length != 0) {
                        console.log('监听成功::', snapshot.docChanges)

                        that.loadMes(searchIndex)

                    }
                },
                onError: function (err) {
                    console.error('the watch closed because of error', err)
                }
            })
        var detailType = options.detailType
        var _id = options._id
        if (detailType) {
            this.toSendAuto(_id, detailType)
        }

    },
    onShow() {
        this.returnPre()
    },
    //事件处理函数
    onReady() {

    },
    onHide() {
        this.returnPre()
    },

    onUnload() {
        console.log('卸载页面')
        //监听器销毁
        liaotianWatcher.close()

    },

    // 延迟页面向顶部滑动
    delayPageScroll() {
        const messages = this.data.messages;
        const length = messages.length;
        const lastId = messages[length - 1].id;
        setTimeout(() => {
            this.setData({
                lastId
            });
        }, 300);
    },

    // 聚焦
    onFocus() {
        this.setData({
            scrollTop: 9999999
        });
    },

})