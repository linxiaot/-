// pages/talklist/talklist.js

const db = wx.cloud.database()
const _ = db.command
var talkWatcher = null
var openid = wx.getStorageSync('openid')

Page({
    data: {

        isSeachlist: false,
        num_lianxiren: 0,
        num_liaotianjilu: 0,

        friendsList: [],
        openid,
        avatarUrl: '',
        isNewmessage: false,
        newMesnum: 0,
        liaotian_id: '',
        slideButtons_more: [{
            text: '屏蔽',
            src: '../../../images/xiajia.png', // icon的路径
        }, {
            text: '置顶',
            src: '../../../images/xiajia.png', // icon的路径
        }, {
            type: 'warn',
            text: '删除',
            src: '../../../images/shanchu.png', // icon的路径
        }],

        _id: '',
        isLahei: false,
        index: '',

        // isZhiding_haoyou: false,
        showZhiding: false,
        isZhiding: false,
        zhidinglist: [],

        deletelist: [],
        isDel: false,
        showDel: false,
    },

    toShow_search(e) {
        // console.log('toShow_search',e);
        var friendsList = this.data.friendsList
        var index_show = e.currentTarget.dataset.index
        var user = e.currentTarget.dataset.user
        // console.log(index_show);
        if (user.isShow_search == undefined) {
            user.isShow_search = false
        }
        friendsList.forEach((element, index) => {
            if (index_show == index) {
                element.isShow_search = !user.isShow_search
            } else {
                element.isShow_search = false
            }
        });
        this.setData({
            friendsList,
        })
    },

    input_search(e) {
        console.log(e);
        var isSeachlist = this.data.isSeachlist
        var inputVal_search = e.detail.value
        var friendsList = this.data.friendsList
        if (inputVal_search !== '') {
            var num_lianxiren = 0
            var num_liaotianjilu = 0
            friendsList.forEach(element_friend => {

                // 搜索的 聊天记录
                var searchlist_textLiaot = []
                element_friend.liaotianList.forEach((element, index) => {
                    // var hunheStr = element.textLiaot + element.createTime
                    var hunheStr = element.textLiaot
                    if (hunheStr.includes(inputVal_search)) {
                        element.searchIndex = index
                        searchlist_textLiaot.push(element)
                        num_liaotianjilu++
                    }
                });
                element_friend.searchlist_textLiaot = searchlist_textLiaot

                // 搜索的 联系人
                if (element_friend._openid == openid) {
                    if (element_friend.duifNickName.includes(inputVal_search)) {
                        element_friend.isShow_search_lianxiren = true
                        num_lianxiren++
                    } else {
                        element_friend.isShow_search_lianxiren = false
                    }
                } else if (element_friend.duifOpenid == openid) {
                    if (element_friend.nickName.includes(inputVal_search)) {
                        element_friend.isShow_search_lianxiren = true
                        num_lianxiren++
                    } else {
                        element_friend.isShow_search_lianxiren = false
                    }
                }
            });
            isSeachlist = true //是否展示搜索结果
        } else {
            isSeachlist = false
            num_lianxiren = 0
            num_liaotianjilu = 0
        }
        this.setData({
            friendsList,
            isSeachlist,
            num_lianxiren,
            num_liaotianjilu,
        })
    },

    toLiaotian(e) {
        var user = e.currentTarget.dataset.user
        var liaotian_id = user._id
        var isZhiding = user.isZhiding
        var isShow_search_lianxiren = user.isShow_search_lianxiren
        var index = e.currentTarget.dataset.index
        // console.log(isZhiding);
        if (isZhiding == undefined) {
            isZhiding = false
        }

        if (this.data.isSeachlist == true) { //搜索时
            if (isShow_search_lianxiren == true) {
                wx.navigateTo({
                    url: '../liaotian/liaotian?' +
                        'liaotian_id=' + liaotian_id +
                        '&isZhiding=' + isZhiding
                })
            } else {
                var searchIndex = user.searchlist_textLiaot[index].searchIndex //待展开
                wx.navigateTo({
                    url: '../liaotian/liaotian?' +
                        'liaotian_id=' + liaotian_id +
                        '&isZhiding=' + isZhiding +
                        '&searchIndex=' + searchIndex
                })
            }

        } else { //未搜索时
            wx.navigateTo({
                url: '../liaotian/liaotian?' +
                    'liaotian_id=' + liaotian_id +
                    '&isZhiding=' + isZhiding
            })
            this.setDot(liaotian_id, false)
        }

    },

    toShowSlideButtons(e) {
        console.log(e);
        var isLahei = e.currentTarget.dataset.lahei
        var isZhiding = e.currentTarget.dataset.zhiding
        var isDel = e.currentTarget.dataset.isDel
        if (isLahei == false && isZhiding == undefined) {
            var lahei_text = '屏蔽'
            var zhiding_text = '置顶'
        } else if (isLahei == true && isZhiding == undefined) {
            var lahei_text = '取消屏蔽'
            var zhiding_text = '置顶'
        } else if (isLahei == false && isZhiding == true) {
            var lahei_text = '屏蔽'
            var zhiding_text = '取消置顶'
        } else if (isLahei == true && isZhiding == true) {
            var lahei_text = '取消屏蔽'
            var zhiding_text = '取消置顶'
        }
        var slideButtons_more = [{
            text: lahei_text,
        }, {
            text: zhiding_text,
        }, {
            text: '删除',
            type: 'warn',
        }, ]
        this.setData({
            slideButtons_more,
        })
    },

    toSlideButton(e) {
        console.log('点击滑动按钮', e.detail);
        var _id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.index
        console.log('index', index);
        if (e.detail.index == 0) {
            var isLahei = e.currentTarget.dataset.lahei
            console.log('isLahei：：', isLahei);
            this.setData({
                isLahei,
                showLahei: true,
                isShowSlideButton: true,
                _id,
                index
            })
        } else if (e.detail.index == 1) { //置顶
            var isZhiding = e.currentTarget.dataset.zhiding
            this.setData({
                showZhiding: true,
                isZhiding,
                isShowSlideButton: true,
                _id,
                index,
            })
        } else if (e.detail.index == 2) {
            var isDel = e.currentTarget.dataset.delete
            this.setData({
                showDel: true,
                isDel,
                isShowSlideButton: true,
                _id,
                index,
            })
        }
    },

    toLaheiConfirm() {
        var laheiOpenid = this.data.friendsList[this.data.index].laheiOpenid
        // var openid = this.data.openid
        if (laheiOpenid == openid || laheiOpenid == '') {
            var _id = this.data._id
            var isLahei = !this.data.isLahei
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

                    // wx.navigateBack({
                    //     delta: 0,
                    // })
                    this.onLoad()
                })
                .catch(err => {
                    console.log(err)
                })
            this.setData({
                isShowSlideButton: false,
                showLahei: false,
            })
        } else {
            console.log('laheiOpenid', this.data.friendsList.laheiOpenid);
            wx.showToast({
                icon: 'none',
                title: '对方屏蔽，无法操作',
            })
            this.setData({
                isShowSlideButton: false,
                showLahei: false,
            })
            // return
        }

    },
    toZhidingConfirm() {
        // console.log('置顶');
        var friendsList = this.data.friendsList
        var index = this.data.index
        var isZhiding = this.data.isZhiding
        var zhidinglist = this.data.zhidinglist
        var userid = wx.getStorageSync('id')
        var _openid = friendsList[index]._openid
        var duifOpenid = friendsList[index].duifOpenid
        if (openid == _openid) {
            var duifOpenid = duifOpenid
        }
        if (openid == duifOpenid) {
            var duifOpenid = _openid
        }
        if (isZhiding == true) {
            var zhidingIndex = zhidinglist.indexOf(duifOpenid)
            zhidinglist.splice(zhidingIndex, 1)
            friendsList[index].isZhiding = false
            // isZhiding = false
        } else {
            friendsList[index].isZhiding = true
            zhidinglist.push(duifOpenid)
            // isZhiding = true
        }

        this.setData({
            zhidinglist,
            friendsList,
            // isZhiding,
        })

        db.collection('user').doc(userid)
            .update({
                data: {
                    // zhidinglist: _.push(duifOpenid)
                    zhidinglist,
                }
            })
            .then(res => {
                console.log('置顶/取消置顶 成功', res);
                this.onLoad()
            })
            .catch(err => {
                console.log('置顶/取消置顶 失败', err);
            })
        this.setData({
            isShowSlideButton: false,
            showZhiding: false,
        })
    },
    toDelConfirm() {
        var friendsList = this.data.friendsList
        var index = this.data.index
        var isDel = this.data.isDel
        var deletelist = this.data.deletelist
        var userid = wx.getStorageSync('id')
        var _openid = friendsList[index]._openid
        var duifOpenid = friendsList[index].duifOpenid
        if (openid == _openid) {
            var duifOpenid = duifOpenid
        }
        if (openid == duifOpenid) {
            var duifOpenid = _openid
        }
        if (isDel == true) {
            var del_index = deletelist.indexOf(duifOpenid)
            deletelist.splice(del_index, 1)
            friendsList[index].isDel = false
        } else {
            friendsList[index].isDel = true
            deletelist.push(duifOpenid)
        }

        this.setData({
            deletelist,
            friendsList
        })

        db.collection('user').doc(userid)
            .update({
                data: {
                    // deletelist: _.push(duifOpenid)
                    deletelist,
                }
            })
            .then(res => {
                console.log('删除 成功', res);
                this.setData({
                    isShowSlideButton: false,
                    showDel: false,
                })
            })
            .catch(err => {
                console.log('删除 失败', err);
            })
    },

    tocloseSlideButton() {
        this.setData({
            isShowSlideButton: false,
            isDel: false,
            isEdit: false,
            showLahei: false,
            showZhiding: false,
        })
    },



    // 设置新消息红点
    setDot(liaotian_id, isNewmessage) {
        var friendsList = this.data.friendsList
        friendsList.forEach(element => {
            if (element._id == liaotian_id) {
                element.isNewmessage = isNewmessage
            }
        });
        // friendsList.sort(function (a, b) {
        //     console.log('1111111');
        //     return b.liaotianList[b.liaotianList.length - 1].createTime - a.liaotianList[a.liaotianList.length - 1].createTime
        // });
        this.setData({
            friendsList,
        })
    },


    loadLiaotian() {
        // var liaotianIndex = wx.getStorageSync('liaotianIndex')
        wx.showLoading({})
        var watchLiaotian = wx.getStorageSync('watchLiaotian')
        db.collection('liaotian')
            .where(
                _.or([{
                        _openid: openid,
                    },
                    {
                        duifOpenid: openid
                    }
                ]),
            )
            .orderBy('paixuTime', 'desc')
            .get()
            .then(res => {
                console.log('下载聊天数据：：', res.data);
                // console.log('watchLiaotian', watchLiaotian);
                var friendsList = res.data
                watchLiaotian.forEach(element => {
                    var liaotianIndex = element.liaotianIndex
                    var isNewmessage = element.isNewmessage
                    friendsList.forEach((element, index) => {
                        if (element._id == liaotianIndex) {
                            element.isNewmessage = isNewmessage
                            friendsList.splice(index, 1)
                            friendsList.unshift(element)
                        }

                    });
                });
                // 置顶
                var zhidinglist = this.data.zhidinglist
                if (zhidinglist !== undefined) {
                    if (zhidinglist.length > 0) {
                        friendsList.forEach(element => {
                            var _openid = element._openid
                            var duifOpenid = element.duifOpenid
                            if (openid == _openid) {
                                var duifOpenid = duifOpenid
                            }
                            if (openid == duifOpenid) {
                                var duifOpenid = _openid
                            }
                            zhidinglist.forEach(item => {
                                if (item == duifOpenid) {
                                    element.isZhiding = true
                                    // element.zhiding_text = '取消置顶'
                                }
                            });
                        });
                    }
                }
                // 删除
                var deletelist = this.data.deletelist
                if (deletelist !== undefined) {
                    if (deletelist.length > 0) {
                        friendsList.forEach(element => {
                            var _openid = element._openid
                            var duifOpenid = element.duifOpenid
                            if (openid == _openid) {
                                var duifOpenid = duifOpenid
                            }
                            if (openid == duifOpenid) {
                                var duifOpenid = _openid
                            }
                            deletelist.forEach(item => {
                                if (item == duifOpenid) {
                                    element.isDel = true
                                }
                            });
                        });
                    }
                }

                this.setData({
                    friendsList,
                    deletelist,
                })
                wx.hideLoading({})

            })
            .catch(err => {
                console.log(err);
            })
    },

    //从详情返回聊天列表页面传参
    returnPre: function () {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            isNewmessage: false,
        })
        // console.log(this.data.liaotian_id);
        // wx.navigateBack({
        //   delta: 1,
        // })
    },

    qufuhao(createTime) {
        var createTime_new = createTime.slice(0, 4) + createTime.slice(5, 7) + createTime.slice(8, 10) + createTime.slice(11, 13) + createTime.slice(14, 16) + createTime.slice(17, 19)

        console.log('createTime', createTime_new);
        return createTime_new
    },

    paixu(friendsList) {

        friendsList.sort(function (a, b) {
            var createTime_a = this.qufuhao(a.liaotianList[a.liaotianList.length - 1].createTime)
            var createTime_b = this.qufuhao(b.liaotianList[b.liaotianList.length - 1].createTime)
            return createTime_a - createTime_b
            // return a.liaotianList[a.liaotianList.length - 1].createTime - b.liaotianList[b.liaotianList.length - 1].createTime
        });
        this.setData({
            friendsList
        })
        // return friendsList
    },


    onLoad: function (options) {

        var userid = wx.getStorageSync('id')
        db.collection('user').doc(userid)
            .get()
            .then(res => {
                console.log('下载用户信息 成功', res);
                var zhidinglist = res.data.zhidinglist
                if (zhidinglist) {
                    this.setData({
                        zhidinglist: res.data.zhidinglist
                    })
                }
                var deletelist = res.data.deletelist
                if (deletelist) {
                    this.setData({
                        deletelist: res.data.deletelist
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        this.loadLiaotian(openid)

        var that = this
        talkWatcher = db.collection('liaotian').where(

                _.or([{
                        _openid: openid,
                    },
                    {
                        duifOpenid: openid
                    }
                ]),

            )
            .watch({
                onChange: function (snapshot) {
                    //只打印变动的信息
                    // console.log('监听talk::', snapshot)
                    if (snapshot.docChanges.length != 0) {
                        console.log('监听成功：：', snapshot.docChanges)
                        if (snapshot.docChanges[0].updatedFields) {
                            var friendsList = that.data.friendsList
                            var deletelist = that.data.deletelist
                            if (snapshot.docChanges[0].docId) {
                                friendsList.forEach((element, index) => {
                                    if (element._id == snapshot.docChanges[0].docId) {
                                        element.isNewmessage = true //加红点提示新消息
                                        element.liaotianList = snapshot.docChanges[0].doc.liaotianList
                                        friendsList.splice(index, 1)
                                        friendsList.unshift(element)
                                        //显示 删除的好友
                                        if (deletelist.length > 0) {
                                            var _openid = element._openid
                                            var duifOpenid = element.duifOpenid
                                            if (openid == _openid) {
                                                console.log(1);
                                                var duifOpenid = duifOpenid
                                            }
                                            if (openid == duifOpenid) {
                                                console.log(2);
                                                var duifOpenid = _openid
                                            }
                                            var deleteIndex = deletelist.indexOf(duifOpenid)
                                            // console.log(deleteIndex);
                                            deletelist.splice(deleteIndex, 1)
                                            element.isDel = false
                                            // console.log(deletelist);
                                            db.collection('user').doc(userid)
                                                .update({
                                                    data: {
                                                        deletelist,
                                                    }
                                                })
                                                .then(res => {
                                                    console.log('更新deletelist成功', res.stats.updated);
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                })
                                        }
                                    }
                                });
                                that.setData({
                                    friendsList,
                                    deletelist,
                                })
                            }

                            that.onShow()
                        }

                    }
                },
                onError: function (err) {
                    console.error('the watch closed because of error', err)
                }
            })


    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this
        var liaotian_id = that.data.liaotian_id
        // var liaotianIndex = wx.getStorageSync('liaotianIndex')
        if (liaotian_id) {
            console.log('下一页返回传参', liaotian_id);
            // setDot(that.data.liaotian_id,false)
            var friendsList = this.data.friendsList
            friendsList.forEach(element => {
                if (element._id == liaotian_id) {
                    element.isNewmessage = false
                }
            });

            // // 删除
            // var deletelist = this.data.deletelist
            // if (deletelist !== undefined) {
            //     if (deletelist.length > 0) {
            //         friendsList.forEach(element => {
            //             var _openid = element._openid
            //             var duifOpenid = element.duifOpenid
            //             if (openid == _openid) {
            //                 var duifOpenid = duifOpenid
            //             }
            //             if (openid == duifOpenid) {
            //                 var duifOpenid = _openid
            //             }
            //             deletelist.forEach(item => {
            //                 if (item == duifOpenid) {
            //                     element.isDel = true
            //                 }
            //             });
            //         });
            //     }
            // }


            this.setData({
                friendsList,
                liaotian_id: ''
            })
            var watchLiaotian = wx.getStorageSync('watchLiaotian')
            var watchLiaotianNew = []
            watchLiaotian.forEach(element => {
                if (element.liaotianIndex !== liaotian_id) {
                    watchLiaotianNew.push(element)
                }
            });
            wx.setStorageSync('watchLiaotian', watchLiaotianNew)
            // this.loadLiaotian()
        }

    },


    onHide: function () {

    },

    onUnload: function () {
        console.log('页面卸载')
        //监听器销毁
        talkWatcher.close()
        // this.returnPre()
        wx.setStorageSync('isNewmessage', false)
    },


    onPullDownRefresh: function () {

    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    }
})