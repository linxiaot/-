// pages/wode/dingdan/dingdan.js
var utils_time = require('../../../utils/time.js') //获取时间等

var openid = wx.getStorageSync('openid')
const db = wx.cloud.database()
Page({

    data: {
        dingdanList: [],
        pageNum: 1,
        isZanWu: false,
        isShowLoading: false,
        isGengDuo: false,
        isHuangye: false,
        isXunwu: false,
        isDel: false,
        isEdit: false,
        isErshou: false,
        isHuzhu: false,
        isBigthings: false,
        isLuntan: false,
        isJiaoyou: false,
        isAdmin: false,
        isShowSlideButton: false,
        fileList: [],
        fabuType: '',
        slideButtons: [{
            // src: '../../../images/shanchu.png', // icon的路径
            type: 'warn',
            text: '删除',
            src: '../../../images/shanchu.png', // icon的路径
        }],
        slideButtons_more: [{
                text: '编辑',
                src: '../../../images/bianji.png', // icon的路径
            },
            {
                text: '下架',
                src: '../../../images/xiajia.png', // icon的路径
            },
            {
                type: 'warn',
                text: '删除',
                src: '../../../images/shanchu.png', // icon的路径
            }
        ],
        slideButtons_more2: [{
                text: '编辑',
                src: '../../../images/bianji.png', // icon的路径
            },
            {
                text: '上架',
                src: '../../../images/xiajia.png', // icon的路径
            },
            {
                type: 'warn',
                text: '删除',
                src: '../../../images/shanchu.png', // icon的路径
            }
        ],
        slideButtons_jianzhi: [{
                text: '下架',
                src: '../../../images/xiajia.png', // icon的路径
            },
            {
                type: 'warn',
                text: '删除',
                src: '../../../images/shanchu.png', // icon的路径
            }
        ],
        slideButtons_jianzhi2: [{
                text: '上架',
                src: '../../../images/xiajia.png', // icon的路径
            },
            {
                type: 'warn',
                text: '删除',
                src: '../../../images/shanchu.png', // icon的路径
            }
        ],
        isXiajia: false,

    },

    toSlideButton(e) {
        console.log('点击滑动按钮', e);
        // console.log('点击删除id', e.currentTarget.dataset.id);
        // console.log('点击删除imagesurllist', e.currentTarget.dataset.imagesurllist);
        var imagesUrlList = e.currentTarget.dataset.imagesurllist
        var isXunren = e.currentTarget.dataset.isxunren
        var isXunwu = e.currentTarget.dataset.isxunwu
        // console.log(isXunren,isXunwu);
        var _id = e.currentTarget.dataset.id
        if (imagesUrlList) {
            var fileList = []
            imagesUrlList.forEach(element => {
                fileList.push(element.imagefileID)
            });
            this.setData({
                fileList,
            })
        }
        if (e.detail.index == 0) { //编辑
            this.setData({
                isEdit: true
            })
            console.log('跳转add页面去编辑');
            var fabuType = this.data.fabuType
            if (fabuType == 'xunwu') {
                console.log('xunwu');
                if (isXunren) {
                    console.log('isXunren');
                    wx.navigateTo({
                        url: '../../add/add?' + '&addType=' + fabuType + '&isXunren=true' + '&isEdit=true' + '&_id=' + _id
                    })
                } else if (isXunwu) {
                    console.log('isXunwu');
                    wx.navigateTo({
                        url: '../../add/add?' + '&addType=' + fabuType + '&isXunwu=true' + '&isEdit=true' + '&_id=' + _id
                    })
                }
            } else {
                wx.navigateTo({
                    url: '../../add/add?' + '&addType=' + fabuType + '&isEdit=true' + '&_id=' + _id
                })
            }
        } else if (e.detail.index == 1) { //下架
            var isXiajia = !e.currentTarget.dataset.xiajia
            this.setData({
                isXiajia: isXiajia,
                showXiajia: true,
                isShowSlideButton: true,
                _id,
            })
        } else if (e.detail.index == 2) { //删除
            this.setData({
                isDel: true,
                isShowSlideButton: true,
                _id,
            })
        }
        // this.setData({
        //     _id,
        // })
    },
    toSlideButton_jianzhi(e) {
        console.log('点击滑动按钮', e.detail);
        var _id = e.currentTarget.dataset.id
        if (e.detail.index == 0) {
            var isXiajia = !e.currentTarget.dataset.xiajia
            console.log(isXiajia);
            this.setData({
                isXiajia: isXiajia,
                showXiajia: true,
                isShowSlideButton: true,
                _id,
            })
        } else if (e.detail.index == 1) {
            this.setData({
                isDel: true,
                isShowSlideButton: true,
                _id,
            })
        }
    },
    toDel(e) {
        // console.log('点击删除id', e.currentTarget.dataset.id);
        // console.log('点击删除imagesurllist', e.currentTarget.dataset.imagesurllist);
        var imagesUrlList = e.currentTarget.dataset.imagesurllist
        var _id = e.currentTarget.dataset.id
        if (imagesUrlList) {
            var fileList = []
            imagesUrlList.forEach(element => {
                fileList.push(element.imagefileID)
            });
            this.setData({
                fileList,
            })
        }
        this.setData({
            isDel: true,
            isShowSlideButton: true,
            _id,
        })
    },
    toDelclose() {
        this.setData({
            isShowSlideButton: false,
            isDel: false,
            isEdit: false,
        })
    },
    tocloseSlideButton() {
        this.setData({
            isShowSlideButton: false,
            isDel: false,
            isEdit: false,
            showXiajia: false,
        })
    },
    toDelConfirm() {
        var _id = this.data._id
        var fabuType = this.data.fabuType
        if (this.data.isHuangye) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('黄页 记录 删除成功', res)
                    wx.cloud.deleteFile({
                        fileList: this.data.fileList,
                        success: res => {
                            console.log('黄页 图片 删除成功', res.fileList)
                        },
                        fail: console.error
                    })
                    this.tapHuangye()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isXunwu) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('寻物 记录 删除成功', res)
                    wx.cloud.deleteFile({
                        fileList: this.data.fileList,
                        success: res => {
                            console.log('寻物 图片 删除成功', res.fileList)
                        },
                        fail: console.error
                    })
                    this.tapXunwu()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isPinche) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('pinche 记录 删除成功', res)
                    this.tapPinche()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isErshou) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('跳蚤市场 记录 删除成功', res)
                    wx.cloud.deleteFile({
                        fileList: this.data.fileList,
                        success: res => {
                            console.log('跳蚤市场 图片 删除成功', res.fileList)
                        },
                        fail: console.error
                    })
                    this.tapErshou()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isHuzhu) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('校园互助 记录 删除成功', res)
                    this.tapHuzhu()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isBigthings) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('[校园大事件] 记录 删除成功', res)
                    wx.cloud.deleteFile({
                        fileList: this.data.fileList,
                        success: res => {
                            console.log('[校园大事件] 图片 删除成功', res.fileList)
                        },
                        fail: console.error
                    })
                    this.tapBigthings()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isLuntan) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('[论坛] 记录 删除成功', res)
                    wx.cloud.deleteFile({
                        fileList: this.data.fileList,
                        success: res => {
                            console.log('[论坛] 图片 删除成功', res.fileList)
                        },
                        fail: console.error
                    })
                    this.tapLuntan()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isJiaoyou) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('[交友] 记录 删除成功', res)
                    wx.cloud.deleteFile({
                        fileList: this.data.fileList,
                        success: res => {
                            console.log('[交友] 图片 删除成功', res.fileList)
                        },
                        fail: console.error
                    })
                    this.tapJiaoyou()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isZufang) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('[租房] 记录 删除成功', res)
                    wx.cloud.deleteFile({
                        fileList: this.data.fileList,
                        success: res => {
                            console.log('[租房] 图片 删除成功', res.fileList)
                        },
                        fail: console.error
                    })
                    this.tapZufang()
                    this.toDelclose()
                })
                .catch(console.error())
        } else if (this.data.isJianzhi) {
            db.collection(fabuType).doc(_id).remove()
                .then(res => {
                    console.log('[兼职] 记录 删除成功', res)

                    this.tapJianzhi()
                    this.toDelclose()
                })
                .catch(console.error())
        }
    },
    toXiajiaConfirm() {
        var _id = this.data._id
        var fabuType = this.data.fabuType
        var isXiajia = this.data.isXiajia
        db.collection(fabuType).doc(_id).update({
                data: {
                    isXiajia: isXiajia
                }
            })
            .then(res => {
                console.log('是否下架 更新 成功', res)
                if (fabuType == 'xunwu') {
                    this.tapXunwu()
                } else if (fabuType == 'pinche') {
                    this.tapPinche()
                } else if (fabuType == 'ershou') {
                    this.tapErshou()
                } else if (fabuType == 'huangye') {
                    this.tapHuangye()
                } else if (fabuType == 'huzhu') {
                    this.tapHuzhu()
                } else if (fabuType == 'luntan') {
                    this.tapLuntan()
                } else if (fabuType == 'jiaoyou') {
                    this.tapJiaoyou()
                } else if (fabuType == 'zufang') {
                    this.tapZufang()
                } else if (fabuType == 'jianzhi') {
                    this.tapJianzhi()
                } else if (fabuType == 'bigthings') {
                    this.tapBigthings()
                }
            })
            .catch(console.error())
        this.setData({
            isShowSlideButton: false,
            showXiajia: false,
        })
    },

    tapHuangye() {
        var fabuType = 'huangye'
        this.setData({
            pageNum: 1,
            isHuangye: true,
            isXunwu: false,
            isPinche: false,
            isErshou: false,
            isHuzhu: false,
            isBigthings: false,
            isLuntan: false,
            isJiaoyou: false,
            isZufang: false,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapXunwu() {
        var fabuType = 'xunwu'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: true,
            isPinche: false,
            isErshou: false,
            isHuzhu: false,
            isBigthings: false,
            isLuntan: false,
            isJiaoyou: false,
            isZufang: false,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapPinche() {
        var fabuType = 'pinche'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: false,
            isPinche: true,
            isErshou: false,
            isBigthings: false,
            isHuzhu: false,
            isLuntan: false,
            isJiaoyou: false,
            isZufang: false,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapErshou() {
        var fabuType = 'ershou'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: false,
            isPinche: false,
            isErshou: true,
            isHuzhu: false,
            isBigthings: false,
            isLuntan: false,
            isJiaoyou: false,
            isZufang: false,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapHuzhu() {
        var fabuType = 'huzhu'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: false,
            isPinche: false,
            isErshou: false,
            isBigthings: false,
            isHuzhu: true,
            isLuntan: false,
            isJiaoyou: false,
            isZufang: false,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapBigthings() {
        var fabuType = 'bigthings'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: false,
            isPinche: false,
            isErshou: false,
            isHuzhu: false,
            isBigthings: true,
            isLuntan: false,
            isJiaoyou: false,
            isZufang: false,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapLuntan() {
        var fabuType = 'luntan'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: false,
            isPinche: false,
            isErshou: false,
            isHuzhu: false,
            isBigthings: false,
            isLuntan: true,
            isJiaoyou: false,
            isZufang: false,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapJiaoyou() {
        var fabuType = 'jiaoyou'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: false,
            isPinche: false,
            isErshou: false,
            isHuzhu: false,
            isBigthings: false,
            isLuntan: false,
            isJiaoyou: true,
            isZufang: false,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapZufang() {
        var fabuType = 'zufang'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: false,
            isPinche: false,
            isErshou: false,
            isHuzhu: false,
            isBigthings: false,
            isLuntan: false,
            isJiaoyou: false,
            isZufang: true,
            isJianzhi: false,
            fabuType,
        })
        this.loadList(fabuType)
    },
    tapJianzhi() {
        var fabuType = 'jianzhi'
        this.setData({
            pageNum: 1,
            isHuangye: false,
            isXunwu: false,
            isPinche: false,
            isErshou: false,
            isHuzhu: false,
            isBigthings: false,
            isLuntan: false,
            isJiaoyou: false,
            isZufang: false,
            isJianzhi: true,
            fabuType,
        })
        this.loadList(fabuType)
    },

    toDetail(e) {
        var _id = e.currentTarget.dataset.id
        var _openid = e.currentTarget.dataset.openid
        var fabuType = this.data.fabuType
        wx.navigateTo({
            url: '../../qiang/huangye/xiangqing2/xiangqing2?' +
                '&detailType=' + fabuType +
                '&_openid=' + _openid +
                '&_id=' + _id
        })
    },

    loadList(fabuType) {
        this.setData({
            dingdanList: []
        })
        db.collection(fabuType).where({
                _openid: openid
            })
            .orderBy('createTime', 'desc')
            .skip(0)
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
                console.log('下载的订单列表为dingdanList：', res.data)
                if (res.data.length == 0) {
                    this.setData({
                        // dingdanList:res.data,
                        isZanWu: true
                    })
                } else {
                    this.setData({
                        dingdanList: res.data,
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },
    loadListmore(fabuType) {
        var dingdanList = this.data.dingdanList
        var pageNum = this.data.pageNum + 1
        db.collection(fabuType).where({
                _openid: openid
            })
            .orderBy('createTime', 'desc')
            .skip((pageNum - 1) * 20)
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
                if (res.data.length == 0) {
                    this.setData({
                        isGengDuo: true,
                        isShowLoading: false
                    })
                } else {
                    res.data.forEach(element => {
                        dingdanList.push(element)
                    });
                    console.log('当前下载 dingdanList 第' + pageNum + '页：', dingdanList)
                    this.setData({
                        dingdanList,
                        pageNum,
                        isShowLoading: false
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    onLoad: function (options) {
        var isAdmin = wx.getStorageSync('isAdmin')
        if (isAdmin) {
            this.setData({
                isAdmin
            })
        }
        this.tapXunwu()

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
        // console.log('编辑成功后传参',that.data.isEditlater);
        var fabuType = this.data.fabuType
        if (that.data.isEditlater) {
            if (fabuType == 'xunwu') {
                this.tapXunwu()
            } else if (fabuType == 'pinche') {
                this.tapPinche()
            } else if (fabuType == 'ershou') {
                this.tapErshou()
            } else if (fabuType == 'huangye') {
                this.tapHuangye()
            } else if (fabuType == 'huzhu') {
                this.tapHuzhu()
            } else if (fabuType == 'luntan') {
                this.tapLuntan()
            } else if (fabuType == 'jiaoyou') {
                this.tapJiaoyou()
            } else if (fabuType == 'zufang') {
                this.tapZufang()
            } else if (fabuType == 'jianzhi') {
                this.tapJianzhi()
            } else if (fabuType == 'bigthings') {
                this.tapBigthings()
            }
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

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            isShowLoading: true
        })
        var fabuType = this.data.fabuType
        // console.log('页面触底');
        console.log('触底更新下一页', fabuType)
        this.loadListmore(fabuType)

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})