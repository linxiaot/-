// pages/qiang/bigthings/bigthings.js
// pages/qiang/xunwu/xunwu.js
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
var utils_time = require('../../../utils/time.js')
var audioCIAC = wx.createInnerAudioContext()
var app = getApp()
var todayNianyueri = app.globalData.todayNianyueri

const {
    formatshifenmiao
} = require('../../../utils/time.js')
var today = utils_time.formatnianyueri(new Date())
Page({
    // mixins: [require('../../mixin/themeChanged')],
    data: {
        index: '',
        _id: '',
        jiaohuIndex: '',
        inputVal_liuyan: '',
        isShowliuyan: false,
        isShowjiaohu: false,

        categoryHeight: [],
        dianzanIndex: 0,
        detailType: 'bigthings',
        isLike: false,
        isAdmin: false,
        openid: '',
        oneButton: [{
            text: '退出播放'
        }],

        bigthingsList: [],
        shaixuan_list: [],
        // isPinche: true,
        pageNum: 1,
        isMuted: true,
        autoplay: true,
        shaixuan_riqi: today,
        // shaixuan_riqi2: '2021-08-24',
        shaixuan_riqi2: today,
        isRiqi: false,

        xuanxiangShowed: false,
        inputShowed: false,
        inputVal: "",

        // audioAction: {
        //     method: 'pause'
        // },

        isPlay: false,
        duration: '00:00',
        currentTime: '00:00',
        percent: 0,
        audioShowed: false,
        audio: '',

    },

    openLiuyan(e) {
        var _id = e.currentTarget.dataset.id
        var index = e.currentTarget.dataset.index
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            this.setData({
                isShowliuyan: true,
                _id,
                index,
            })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },

    closeLiuyan() {
        this.setData({
            isShowliuyan: false,
            isShowjiaohu: false,
        })
    },

    toJiaohu(e) {
        console.log('点击交互时携带的值index', e.currentTarget.dataset.index);
        console.log('点击交互时携带的值list_index', e.currentTarget.dataset.list_index);
        // console.log('点击交互时携带的值index', e);
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            this.setData({
                isShowjiaohu: true,
                jiaohuIndex: e.currentTarget.dataset.index,
                nickName: e.currentTarget.dataset.nickname,
                _id: e.currentTarget.dataset.id,
                index: e.currentTarget.dataset.list_index,
            })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }

    },
    bindinput_liuyan(e) {
        var inputVal_liuyan = e.detail.value
        this.setData({
            inputVal_liuyan,
        })
    },
    toTijiao_liuyan() {
        // var {liuyan,_id,detailType} = this.data
        var isShowliuyan = this.data.isShowliuyan
        var isShowjiaohu = this.data.isShowjiaohu
        var jiaohuIndex = this.data.jiaohuIndex
        var inputVal_liuyan = this.data.inputVal_liuyan
        var detailType = 'bigthings'
        var userinfo = wx.getStorageSync('userinfo')
        var openid = wx.getStorageSync('openid')
        var userId = wx.getStorageSync('id')
        var avatarUrl = userinfo.avatarUrl
        var nickName = userinfo.nickName
        var liuyanTime = utils_time.formatTime(new Date())
        var _id = this.data._id

        var liuyan = {
            nickName: nickName,
            avatarUrl: avatarUrl,
            value: inputVal_liuyan,
            liuyanTime: liuyanTime,
            openid: openid,
            jiaohu: []
        }
        var jiaohu = {
            nickName: nickName,
            avatarUrl: avatarUrl,
            value: inputVal_liuyan,
            liuyanTime: liuyanTime,
            openid: openid,
            jiaohuIndex: jiaohuIndex,
        }

        // if (detailType == 'xunwu') {
        console.log(_id, );
        console.log(inputVal_liuyan, );


        // 安全检查
        var content = inputVal_liuyan
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

                    if (isShowliuyan) {
                        wx.cloud.callFunction({
                                name: 'liuyan',
                                data: {
                                    _id,
                                    liuyan,
                                    detailType,
                                    isShowliuyan_new: isShowliuyan,
                                    userId,
                                    todayNianyueri,
                                    nowTime:liuyanTime,
                                }
                            })
                            .then(res => {
                                console.log('留言成功res', res);
                                wx.showToast({
                                    icon: 'none',
                                    title: '提交成功',
                                })
                                this.setData({
                                    inputVal_liuyan: '',
                                })

                                this.loadData()
                                var scrollTop = this.data.categoryHeight[this.data.index]
                                setTimeout(() => {
                                    wx.pageScrollTo({
                                        scrollTop,
                                        duration: 0,
                                    })
                                }, 800);


                            })
                            .catch(err => {
                                console.log('留言失败 err', err);
                                wx.showToast({
                                    icon: 'error',
                                    title: '提交失败',
                                })
                            })
                        this.setData({
                            isShowliuyan: false,
                        })

                    } else if (isShowjiaohu) {
                        console.log(1);
                        console.log(jiaohu);
                        wx.cloud.callFunction({
                                name: 'liuyan',
                                data: {
                                    _id,
                                    jiaohu,
                                    detailType,
                                    jiaohuIndex,
                                    isShowjiaohu
                                }
                            })
                            .then(res => {
                                console.log('留言成功res', res);
                                wx.showToast({
                                    icon: 'none',
                                    title: '提交成功',
                                })

                                this.setData({
                                    inputVal_liuyan: '',
                                })
                                this.loadData()
                                var scrollTop = this.data.categoryHeight[this.data.index]
                                setTimeout(() => {
                                    wx.pageScrollTo({
                                        scrollTop,
                                        duration: 0,
                                    })
                                }, 800);

                            })
                            .catch(err => {
                                console.log('留言失败 err', err);
                                wx.showToast({
                                    icon: 'error',
                                    title: '提交失败',
                                })
                            })
                        this.setData({
                            isShowjiaohu: false,
                        })
                    }

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

    },

    loadLiuyan(detailType, _id) {
        var userOpenid = wx.getStorageSync('openid')
        db.collection(detailType).doc(_id).get()
            .then(res => {
                // this.setData({
                //     _openid: res.data._openid
                // })
                console.log('下载单条记录成功，获取[留言]列表', res);
                if (res.data.liuyan) {
                    this.setData({
                        liuyanList: res.data.liuyan,
                    })
                }
                if (res.data.dianzan) {
                    if (res.data.dianzan.length !== 0) {
                        var dianzanNum = ''
                        var dianzan = res.data.dianzan
                        for (let index = 0; index < dianzan.length; index++) {
                            const element = dianzan[index];
                            if (element.openid == userOpenid) {
                                this.setData({
                                    isLike: element.isLike,
                                    isDianzan: true,
                                    dianzanIndex: index,
                                })
                            } else {
                                console.log('没有点赞记录···');
                            }
                            if (element.isLike) {
                                dianzanNum += 1
                            }
                        }
                        this.setData({
                            dianzanNum,
                        })
                    }
                }
            })
            .catch(console.error())
    },


    toLike(e) {
        console.log(e);
        var login_ok = wx.getStorageSync('login_ok')
        var item = e.currentTarget.dataset.item
        var index = e.currentTarget.dataset.index
        console.log(index);

        var isLike = item.isLike == true ? false : true
        var openid = wx.getStorageSync('openid')
        var userId = wx.getStorageSync('id')
        var _id = e.currentTarget.dataset.id
        var dianzanTime = utils_time.formatTime(new Date())
        var detailType = 'bigthings'
        var dianzan = {
            dianzanTime: dianzanTime,
            openid: openid,
            isLike,
        }
        if (login_ok) {
            console.log('点赞······');

            // 点赞后分两步：1.存在data中
            var bigthingsList = this.data.bigthingsList
            var element = bigthingsList[index]
            if (element.dianzan.length !== 0) { // 有点赞记录
                // console.log(item.dianzanIndex);
                if (item.dianzanIndex !== undefined) { //点过赞
                    console.log(2);
                    var dianzanNum = element.dianzanNum
                    if (isLike == true) {
                        dianzanNum += 1
                    } else {
                        dianzanNum -= 1
                    }
                    element.dianzanNum = dianzanNum
                    element.isLike = isLike
                    // element.isDianzan = true
                    // element.dianzanIndex = element.dianzan.length
                    // element.dianzan.push(dianzan)
                    element.dianzan[item.dianzanIndex] = dianzan
                    this.setData({
                        bigthingsList,
                    })
                } else { //没点过赞
                    var dianzanNum = element.dianzanNum
                    element.dianzanNum = dianzanNum + 1
                    element.isDianzan = true
                    element.isLike = isLike
                    element.dianzanIndex = element.dianzan.length
                    element.dianzan.push(dianzan)
                    this.setData({
                        bigthingsList,
                    })
                }
            } else { //没有任何点赞记录时点赞
                console.log('没有任何点赞记录');
                var dianzanNum = 1
                element.isDianzan = true

                element.dianzanNum = dianzanNum
                element.isLike = isLike
                element.dianzanIndex = element.dianzan.length
                element.dianzan.push(dianzan)
                this.setData({
                    bigthingsList,
                })
            }

            // 点赞后分两步：2.上传服务器            
            wx.cloud.callFunction({
                    name: 'liuyan',
                    data: {
                        like_new: true,
                        _id,
                        detailType,
                        dianzan,
                        isDianzan: item.isDianzan, //是否点赞过
                        // isDianzan: false, //是否点赞过
                        dianzanIndex: item.dianzanIndex,
                        isLike,
                        userId,
                        todayNianyueri,
                        nowTime:dianzanTime,
                    }
                })
                .then(res => {
                    console.log('点赞 成功 res', res);

                    // this.loadData()
                    // var scrollTop =this.data.categoryHeight[index]
                    // setTimeout(() => {
                    //     wx.pageScrollTo({
                    //         scrollTop,
                    //         duration: 0,
                    //       })
                    // }, 800);

                })
                .catch(err => {
                    console.log('点赞 失败 err', err);
                })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },

    toYulanImage(e) {
        console.log('预览图片', e);
        var current = e.currentTarget.dataset.src
        var list = e.currentTarget.dataset.list
        var urls = []
        list.forEach(element => {
            urls.push(element.imagetempFileURL)
        });
        wx.previewImage({
            current, // 当前显示图片的http链接
            urls, // 需要预览的图片http链接 列表
        })
    },

    chaxunJiedian() {
        return new Promise((resolve) => {
            // 查询节点信息
            var categoryHeight = []
            wx.createSelectorQuery()
                .selectAll('.pengyq')
                .boundingClientRect(res => {
                    console.log('节点信息', res);
                    var top = res[0].top
                    res.forEach((element, i) => {
                        // var height_item = element.top - top
                        var height_item = element.top
                        categoryHeight.push(height_item)
                    });
                    this.setData({
                        categoryHeight,
                    })
                })
                .exec()
            resolve()
        })
    },
    onLoad: function (options) {

        var isAdmin = wx.getStorageSync('isAdmin')
        // var openid = wx.getStorageSync('openid')
        if (isAdmin) {
            this.setData({
                isAdmin,
                // openid,
            })
        }
        this.loadData()
        // this.chaxunJiedian()
    },

    toShowAudio(e) {
        var audio = e.currentTarget.dataset.audio
        this.setData({
            audioShowed: true,
            audio,
            percent: 0,
            currentTime: '00:00',
        })
        this.audioPlay()
    },
    toCloseAudio() {
        this.audioStop()
        this.setData({
            audioShowed: false,
        })
    },

    formatTime(time) {
        var minute = Math.floor(time / 60) % 60;
        var second = Math.floor(time) % 60
        return (minute < 10 ? '0' + minute : minute) + ':' +
            (second < 10 ? '0' + second : second)
    },

    audioPlay(e) {
        // audioCIAC.destroy()
        // var audioCIAC = wx.createInnerAudioContext()
        audioCIAC.src = this.data.audio.fileid
        audioCIAC.onPlay(res => {
            audioCIAC.onTimeUpdate(res => {
                // console.log(res);
                this.setData({
                    duration: this.formatTime(audioCIAC.duration),
                    currentTime: this.formatTime(audioCIAC.currentTime),
                    percent: audioCIAC.currentTime / audioCIAC.duration * 100
                })
            })
        })
        setTimeout(() => {
            audioCIAC.play()
        }, 800);

        this.setData({
            isPlay: true,
        })
    },
    audioPause(e) {
        // audioCIAC.src = e.currentTarget.dataset.src
        audioCIAC.pause()
        this.setData({
            isPlay: false,
        })
    },
    audio14() {
        audioCIAC.seek(14)
    },
    audioTuodong(e) {
        // console.log(e);
        var percent = e.detail.value
        var currentTime = this.formatTime(percent / 100 * audioCIAC.duration)
        audioCIAC.seek(percent)
        this.setData({
            currentTime
        })
    },
    audioStart() {
        audioCIAC.seek(0)
    },
    audioStop() {
        audioCIAC.stop()
        this.setData({
            isPlay: false,
        })
    },

    showXuanxiang(e) {
        this.setData({
            xuanxiangShowed: !this.data.xuanxiangShowed
        })
    },

    // 搜索框
    showSearch() {
        // console.log('跳转搜索页');
        // wx.navigateTo({
        //     url: '../../search/search?' +
        //         '&searchType=bigthings'
        // })
    },
    goSearch() {
        var searchword = this.data.inputVal
        var shaixuan_list = []
        if (searchword !== '') {
            wx.cloud.callFunction({
                name: 'search',
                data: {
                    searchType: 'bigthings_pyq',
                    searchword,
                },
                success: res => {
                    res.result.forEach(element => {
                        if (element.isHege) {
                            shaixuan_list.push(element)
                        }
                    });
                    this.setData({
                        shaixuan_list,
                        isShaixuan: true,
                    })
                    console.log(res);
                }
            })
        } else {
            wx.showToast({
                icon: 'none',
                title: '请输入搜索词',
            })
        }
    },

    qingkong_shaixuan() {
        this.setData({
            isShaixuan: false,
            shaixuan_list: []
        })
    },

    toSearchInput: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
        this.qingkong_shaixuan()
    },
    clearInput: function () {
        this.setData({
            inputVal: ""
        });
        this.qingkong_shaixuan()
    },

    // 时间选择器
    bindDateChange: function (e) {
        console.log('生日 选择改变，携带值为', e.detail.value)
        var shaixuan_riqi = e.detail.value
        var shaixuan_riqi2 = this.data.shaixuan_riqi2
        var bigthingsList = this.data.bigthingsList
        var shaixuan_list = []

        bigthingsList.forEach(element => {
            // if (element.createTime.includes(shaixuan_riqi)) {
            //     shaixuan_list.push(element)
            // }
            // var riqi_element = element.createTime.slice(0,10).split('-').join('')
            var riqi_element = element.createTime.slice(0, 10)
            if (riqi_element >= shaixuan_riqi) {
                if (riqi_element <= shaixuan_riqi2) {
                    shaixuan_list.push(element)
                }
            }
        });
        this.setData({
            shaixuan_riqi,
            shaixuan_list,
            isShaixuan: true,
        })
    },

    bindDateChange2: function (e) {
        console.log('生日 选择改变，携带值为', e.detail.value)
        var shaixuan_riqi = this.data.shaixuan_riqi
        var shaixuan_riqi2 = e.detail.value
        var bigthingsList = this.data.bigthingsList
        var shaixuan_list = []
        bigthingsList.forEach(element => {
            var riqi_element = element.createTime.slice(0, 10)
            if (riqi_element >= shaixuan_riqi) {
                if (riqi_element <= shaixuan_riqi2) {
                    shaixuan_list.push(element)
                }
            }
        });
        this.setData({
            shaixuan_riqi2,
            shaixuan_list,
            isShaixuan: true,
        })
    },

    toRiqi() {
        this.setData({
            isRiqi: !this.data.isRiqi,
            shaixuan_list: [],
            isShaixuan: false,
        })
    },

    // 全屏
    bind_quanping(e) {
        console.log(e);
        if (e.detail.fullScreen) {
            this.setData({
                isMuted: false,
            })
        } else(
            this.setData({
                isMuted: true
            })
        )
    },

    loadData() {
        var userOpenid = wx.getStorageSync('openid')
        this.setData({
            bigthingsList: [],
            pageNum: 1
        })
        wx.cloud.database().collection('bigthings')
            .where({
                isHege: true,
                isXiajia: false,
            })
            .orderBy('isXiajia', 'asc')
            .orderBy('isZhiding', 'desc')
            .orderBy('createTime', 'desc')
            // .skip(0)
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
                console.log('下载的订单列表 bigthingsList 为：', res.data)
                if (res.data.length !== 0) {
                    res.data.forEach(element => {
                        if (element.dianzan.length !== 0) {
                            var dianzanNum = 0
                            var dianzan = element.dianzan
                            for (let index = 0; index < dianzan.length; index++) {
                                const element2 = dianzan[index];
                                if (element2.openid == userOpenid) {
                                    element.isDianzan = true //有我的点赞记录
                                    element.dianzanIndex = index
                                    element.isLike = element2.isLike
                                } else {
                                    element.isDianzan = false //没我的点赞记录
                                }
                                if (element2.isLike) {
                                    dianzanNum += 1
                                }
                            }
                            element.dianzanNum = dianzanNum
                        } else {
                            element.isDianzan = false
                            // console.log('没有点赞记录···');
                        }
                    });
                    this.setData({
                        bigthingsList: res.data,
                    })
                }
                // this.chaxunJiedian()
            })
            .catch(err => {
                console.error(err)
            })
    },

    zhunbeiAudio(bigthingsList) {
        for (let index = 0; index < bigthingsList.length; index++) {
            const element = bigthingsList[index];
            if (element.audio) {
                element.audio.audioCIAC = 'audioCIAC_' + index
            }
        }
        this.setData({
            bigthingsList: bigthingsList,
        })

    },

    toPaixu() {
        let {
            bigthingsList
        } = this.data
        bigthingsList.reverse()
        this.setData({
            bigthingsList
        })
    },

    // 列表详情
    toDetail(e) {
        var _id = e.currentTarget.dataset.id
        var _openid = e.currentTarget.dataset.openid
        wx.navigateTo({
            url: '../huangye/xiangqing2/xiangqing2?' +
                '&detailType=' + 'bigthings' +
                '&_openid=' + _openid +
                '&_id=' + _id
        })
    },


    toFabu() {
        console.log('跳转添加页');
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            wx.navigateTo({
                url: '../../add/add?' + '&addType=bigthings'
            })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },

    onReady: function () {
        // console.log('onReady');

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log('onShow');
        var that = this
        if (that.data.isAddLater) {
            this.loadData()
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.loadData()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            isShowLoading: true
        })
        var bigthingsList = this.data.bigthingsList
        var pageNum = this.data.pageNum + 1
        console.log('页面触底');

        wx.cloud.database().collection('bigthings').where({
                isHege: true,
                isXiajia: false,
            })
            .orderBy('isXiajia', 'asc')
            .orderBy('isZhiding', 'desc')
            .orderBy('createTime', 'desc')
            .skip((pageNum - 1) * 20)
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
                if (res.data.length == 0) {
                    this.setData({
                        isGengDuo: true,
                    })
                } else {

                    res.data.forEach(element => {
                        if (element.dianzan.length !== 0) {
                            var dianzanNum = 0
                            var dianzan = element.dianzan
                            for (let index = 0; index < dianzan.length; index++) {
                                const element2 = dianzan[index];
                                if (element2.openid == userOpenid) {
                                    element.isDianzan = true //有点赞记录
                                    element.dianzanIndex = index
                                    element.isLike = element2.isLike
                                } else {
                                    element.isDianzan = false //没我的点赞记录
                                }
                                if (element2.isLike) {
                                    dianzanNum += 1
                                }
                            }
                            element.dianzanNum = dianzanNum
                        } else {
                            element.isDianzan = false
                            // console.log('没有点赞记录···');
                        }
                        bigthingsList.push(element)
                    });

                    console.log('当前下载pincheList第' + pageNum + '页：', bigthingsList)
                    this.setData({
                        bigthingsList,
                        pageNum,
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })

        setTimeout(() => {
            this.setData({
                isShowLoading: false
            })
        }, 300);

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})