// pages/qiang/huangye/xiangqing2/xiangqing2.js
var utils_time = require('../../../../utils/time.js') //获取时间等
var utils_toShouQuan = require('../../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../../wode/ziliao/ziliao'
var audioCIAC = wx.createInnerAudioContext()
const db = wx.cloud.database()
const _ = db.command
var app = getApp()
var todayNianyueri = app.globalData.todayNianyueri
Page({

    data: {

        isPlay: false,
        duration: '00:00',
        currentTime: '00:00',
        percent: 0,
        audioShowed: false,
        audio: '',

        _id: '',
        detailType: '',
        isXunwu: '',
        isXunren: '',
        isPinche: '',
        name: '',
        jianjie: '',
        phone: '',
        address: '',
        isHege: '',
        createTime: '',
        srcList: [],
        isShowliuyan: false,
        isShowjiaohu: false,
        inputVal_liuyan: '',
        liuyanList: [],
        jiaohuIndex: '',
        // isDisabled:true,
        // openid:'',
        _openid: '',
        userOpenid: '',
        dianzanIndex: '',
        isLike: false,
        isDianzan: false,
        nickName: '',
        avatarUrl: '',
        dianzanNum: '',
        liaotianList: [],
        inputVal_liaotian: '',
        haveLiaotian: false,
        video_fileid: ''
    },

    toYulanImage(e) {
        console.log('预览图片', e);
        var current = e.currentTarget.dataset.src
        var urls = e.currentTarget.dataset.list

        wx.previewImage({
            current, // 当前显示图片的http链接
            urls, // 需要预览的图片http链接 列表
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

    audioStart() {
        audioCIAC.seek(0)
    },
    audioStop() {
        audioCIAC.stop()
        this.setData({
            isPlay: false,
        })
    },

    toLookuserinfo() {
        var _openid = this.data._openid
        console.log(this.data._openid);
        wx.navigateTo({
            url: '../../../wode/ziliao/ziliao?' +
                '_openid=' + _openid +
                '&isLookuserinfo=true'
        })
    },
    toPhoneCall() {
        var phone = this.data.phone
        if (this.data.phone) {
            wx.makePhoneCall({
                phoneNumber: phone
            })
        }
    },
    setTitletext(searchType) {
        var searchTypelist = ['xunwu', 'huangye', 'pinche', 'ershou', 'huzhu', 'bigthings', 'luntan', 'jiaoyou', 'zufang', 'jianzhi']
        var titlelist = ['失物招领', '黄页', '校园拼车', '跳蚤市场', '校园互助', '校园大事件', '论坛', '交友', '租房', '兼职']
        for (let index = 0; index < searchTypelist.length; index++) {
            const element = searchTypelist[index];
            if (searchType == element) {
                wx.setNavigationBarTitle({
                    title: titlelist[index],
                })
            }
        }
    },

    openContact() {
        var userOpenid = this.data.userOpenid
        var login_ok = wx.getStorageSync('login_ok')
        if (this.data._openid == userOpenid) {
            wx.showToast({
                icon: 'none',
                title: '不能和自己聊天',
            })
            return
        }
        if (login_ok) {
            if (!this.data.haveLiaotian) {
                var createTime = utils_time.formatTime(new Date())
                var userinfo = wx.getStorageSync('userinfo')
                console.log('没有聊天记录,开始创建。。。');
                db.collection('liaotian').add({
                        data: {
                            // userOpenid,
                            duifOpenid: this.data._openid,
                            duifNickName: this.data.nickName,
                            duifAvatarUrl: this.data.avatarUrl,
                            nickName: userinfo.nickName,
                            avatarUrl: userinfo.avatarUrl,
                            createTime,
                            liaotianList: [],
                            isLahei: false,
                            laheiOpenid: '',
                            // text:this.data.inputVal_liaotian
                        }
                    })
                    .then(res => {
                        console.log('初次创建聊天', res._id);
                        var liaotian_id = res._id
                        this.setData({
                            liaotian_id,
                        })
                        wx.navigateTo({
                            url: '../../../liaotian/liaotian?liaotian_id=' + liaotian_id,
                        })
                    })
            } else {
                console.log('已经有聊天记录,无需 创建', this.data.liaotian_id);
                wx.navigateTo({
                    url: '../../../liaotian/liaotian?liaotian_id=' +
                        this.data.liaotian_id +
                        '&_id=' + this.data._id +
                        '&detailType=' + this.data.detailType
                })
            }
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },
    inputliaotian(e) {
        this.setData({
            inputVal_liaotian: e.detail.value
        })
    },

    toDelliuyan(e) {
        console.log('点击删除留言 delliuyIndex', e);
        var _id = this.data._id
        var detailType = this.data.detailType
        // var delliuyIndex=e.currentTarget.dataset.index
        var liuyan_val = e.currentTarget.dataset.liuyan_val
        var floor = e.currentTarget.dataset.floor
        var delliuyIndex = e.currentTarget.dataset.jiaohuindex
        wx.cloud.callFunction({
                name: 'liuyan',
                data: {
                    isDelLiuyan: true,
                    _id,
                    detailType,
                    floor,
                    delliuyIndex,
                    liuyan_val,
                    // jiaohuIndex
                }
            })
            .then(res => {
                console.log('删除留言 成功 res', res);
                this.loadLiuyan(detailType, _id)
            })
            .catch(err => {
                console.log('删除留言 失败 err', err);

            })
    },

    toLike() {
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            console.log('点赞······');
            var isLike = this.data.isLike == true ? false : true
            this.setData({
                isLike
            })
            var userId = wx.getStorageSync('id')
            var openid = wx.getStorageSync('openid')
            var _id = this.data._id
            var dianzanTime = utils_time.formatTime(new Date())
            var detailType = this.data.detailType
            var dianzan = {
                dianzanTime: dianzanTime,
                openid: openid,
                isLike,
            }
            wx.cloud.callFunction({
                    name: 'liuyan',
                    data: {
                        like_new: true,
                        _id,
                        detailType,
                        dianzan,
                        isDianzan: this.data.isDianzan, //是否点赞过
                        dianzanIndex: this.data.dianzanIndex,
                        isLike,
                        userId,
                        todayNianyueri,
                        nowTime:dianzanTime,
                    }
                })
                .then(res => {
                    console.log('点赞 成功 res', res);
                    this.loadLiuyan(detailType, _id)

                })
                .catch(err => {
                    console.log('点赞 失败 err', err);

                })

        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面

        }

    },

    toJiaohu(e) {
        console.log('点击交互时携带的值index', e.currentTarget.dataset.index);
        // console.log('点击交互时携带的值index', e);
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            this.setData({
                isShowjiaohu: true,
                jiaohuIndex: e.currentTarget.dataset.index,
                nickName: e.currentTarget.dataset.nickname,
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
    openLiuyan() {
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            this.setData({
                isShowliuyan: true,
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
        var _id = this.data._id
        var detailType = this.data.detailType
        var userinfo = wx.getStorageSync('userinfo')
        var openid = wx.getStorageSync('openid')
        var userId = wx.getStorageSync('id')
        var avatarUrl = userinfo.avatarUrl
        var nickName = userinfo.nickName
        var liuyanTime = utils_time.formatTime(new Date())
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
                                // setTimeout(() => {
                                this.setData({
                                    inputVal_liuyan: '',
                                })
                                this.onShow()
                                // }, 0);

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
                        wx.pageScrollTo({
                            scrollTop: 99999
                        })
                    } else if (isShowjiaohu) {
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
                                this.onShow()
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
                        var dianzanNum = 0
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('详情xiangqing2 [onLoad] 开始传参');
        var detailType = options.detailType
        var _id = options._id
        var _openid = options._openid
        this.setTitletext(detailType)
        this.setData({
            _id,
            _openid,
            detailType,
        })
        // this.setData({
        //     detailType,
        // })
        if (detailType == 'huangye') {
            console.log('huangye传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    var srcList = []
                    res.data.imagesUrlList.forEach(element => {
                        if (element !== 'undefined') {
                            srcList.push(element.imagetempFileURL)
                        }
                    });

                    var jianjie = res.data.jianjie
                    var nameLength = res.data.name.length + 1
                    var jianjieLength = res.data.jianjie.length
                    jianjie = jianjie.slice(nameLength, jianjieLength)
                    this.setData({
                        _id,
                        name: res.data.name,
                        jianjie,
                        phone: res.data.phone,
                        address: res.data.address,
                        isHege: res.data.isHege,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        detailType,
                        srcList,
                    })
                })
        } else if (detailType == 'xunwu') {

            console.log('xunwu 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    console.log('下载：：：：', res.data);
                    var srcList = []
                    res.data.imagesUrlList.forEach(element => {
                        if (element !== 'undefined') {
                            srcList.push(element.imagetempFileURL)
                        }
                    });
                    var jianjie = res.data.jianjie
                    var nameLength = res.data.name.length + 1
                    var jianjieLength = res.data.jianjie.length
                    jianjie = jianjie.slice(nameLength, jianjieLength)
                    this.setData({
                        _id,
                        name: res.data.name,
                        lianxi: res.data.lianxi,
                        didian: res.data.didian,
                        shijian: res.data.shijian,
                        jianjie,
                        avatarUrl: res.data.avatarUrl,
                        nickName: res.data.nickName,
                        createTime: res.data.createTime,
                        detailType,
                        srcList,
                        isXunwu: res.data.isXunwu,
                        isXunren: res.data.isXunren,
                        isXiajia: res.data.isXiajia,
                    })
                })

        } else if (detailType == 'pinche') {
            console.log('pinche 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {

                    var jianjie = res.data.jianjie
                    var xingchLength = res.data.xingch.length + 1
                    var jianjieLength = res.data.jianjie.length
                    jianjie = jianjie.slice(xingchLength, jianjieLength)

                    this.setData({
                        xingch: res.data.xingch,
                        jianjie,
                        lianxi: res.data.lianxi,
                        personNum: res.data.personNum,
                        // isHege: res.data.isHege,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        isXiajia: res.data.isXiajia,

                        detailType,
                        _id,
                        shijian: res.data.shijian,
                        // isLike: res.data.isLike,
                    })
                })
        } else if (detailType == 'ershou') {
            console.log('ershou 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    console.log('下载：：：：', res.data);
                    var srcList = []
                    res.data.imagesUrlList.forEach(element => {
                        if (element !== 'undefined') {
                            srcList.push(element.imagetempFileURL)
                        }
                    });
                    this.setData({
                        _openid: res.data._openid,
                        jianjie: res.data.jianjie,
                        jiage: res.data.jiage,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        detailType,
                        _id,
                        srcList,
                        isXiajia: res.data.isXiajia,
                    })
                })
        } else if (detailType == 'huzhu') {
            console.log('huzhu 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    console.log('下载：：：：', res.data);
                    this.setData({
                        _openid: res.data._openid,
                        jianjie: res.data.jianjie,
                        lianxi: res.data.lianxi,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        detailType,
                        _id,
                        isXiajia: res.data.isXiajia,
                    })
                })
        } else if (detailType == 'bigthings') {
            console.log('bigthings 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    var srcList = []
                    res.data.imagesUrlList.forEach(element => {
                        if (element !== 'undefined') {
                            srcList.push(element.imagetempFileURL)
                        }
                    });

                    var jianjie = res.data.jianjie
                    // var nameLength = res.data.name.length + 1
                    // var jianjieLength = res.data.jianjie.length
                    // jianjie = jianjie.slice(nameLength, jianjieLength)
                    this.setData({
                        _id,
                        // address: res.data.address,
                        isHege: res.data.isHege,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        detailType,
                        isXiajia: res.data.isXiajia,

                        name: res.data.name,
                        jianjie,
                        video_fileid: res.data.video_fileid,
                        srcList,
                        audio: res.data.audio,
                    })
                })
        } else if (detailType == 'luntan') {
            console.log('luntan 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    console.log('下载：：：：', res.data);
                    var srcList = []
                    res.data.imagesUrlList.forEach(element => {
                        if (element !== 'undefined') {
                            srcList.push(element.imagetempFileURL)
                        }
                    });
                    this.setData({
                        _openid: res.data._openid,
                        jianjie: res.data.jianjie,
                        // jiage: res.data.jiage,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        detailType,
                        _id,
                        srcList,
                        isXiajia: res.data.isXiajia,
                    })
                })
        } else if (detailType == 'jiaoyou') {
            console.log('jiaoyou 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    console.log('下载：：：：', res.data);
                    var srcList = []
                    res.data.imagesUrlList.forEach(element => {
                        if (element !== 'undefined') {
                            srcList.push(element.imagetempFileURL)
                        }
                    });
                    this.setData({
                        _openid: res.data._openid,
                        jianjie: res.data.jianjie,
                        // jiage: res.data.jiage,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        detailType,
                        _id,
                        srcList,
                        isXiajia: res.data.isXiajia,
                    })
                })
        } else if (detailType == 'zufang') {
            console.log('zufang 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    console.log('下载：：：：', res.data);
                    var srcList = []
                    res.data.imagesUrlList.forEach(element => {
                        if (element !== 'undefined') {
                            srcList.push(element.imagetempFileURL)
                        }
                    });
                    this.setData({

                        name: res.data.name,
                        huxing: res.data.huxing,
                        mianji: res.data.mianji,
                        louceng: res.data.louceng,
                        zujin: res.data.zujin,
                        jianjie: res.data.jianjie,
                        phone: res.data.phone,
                        lianxiren: res.data.lianxiren,
                        sheshi: res.data.sheshi,
                        isXiajia: res.data.isXiajia,

                        _openid: res.data._openid,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        detailType,
                        _id,
                        srcList,
                    })
                })
        } else if (detailType == 'jianzhi') {
            console.log('jianzhi 传递的参数是：', options);
            var _id = options._id
            db.collection(detailType).doc(_id).get()
                .then(res => {
                    console.log('下载：：：：', res.data);
                    this.setData({
                        name: res.data.name,
                        personNum: res.data.personNum,
                        leixing: res.data.leixing,
                        xinzi: res.data.xinzi,
                        lianxiren: res.data.lianxiren,
                        phone: res.data.phone,
                        address: res.data.address,
                        jianjie: res.data.jianjie,
                        isXiajia: res.data.isXiajia,

                        _openid: res.data._openid,
                        createTime: res.data.createTime,
                        nickName: res.data.nickName,
                        avatarUrl: res.data.avatarUrl,
                        detailType,
                        _id,
                    })
                })
        }
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
        // console.log('_openid', this.data._openid);
        var detailType = this.data.detailType
        var _id = this.data._id
        this.loadLiuyan(detailType, _id)
        var login_ok = wx.getStorageSync('login_ok')
        var userOpenid = wx.getStorageSync('openid')
        if (login_ok) {
            this.setData({
                userOpenid,
            })
            // 查询是否有聊天记录
            // console.log('----openid', this.data._openid);
            db.collection('liaotian')
                .where(
                    _.or([{
                            _openid: userOpenid, //当前用户
                            duifOpenid: this.data._openid
                        },
                        // {
                        //     _openid: this.data._openid,//创建者
                        // }
                        {
                            _openid: this.data._openid,
                            duifOpenid: userOpenid
                        }
                    ])
                )
                .get()
                .then(res => {
                    console.log('是否有聊天记录：：', res);
                    if (res.data.length !== 0) {
                        //有聊天记录
                        if (res.data[0]._openid == userOpenid || res.data[0].duifOpenid == userOpenid) {
                            this.setData({
                                haveLiaotian: true,
                                liaotian_id: res.data[0]._id
                            })
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                })
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
        this.audioStop()
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})