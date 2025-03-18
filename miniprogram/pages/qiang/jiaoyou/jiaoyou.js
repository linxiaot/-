// pages/qiang/jiaoyou/jiaoyou.js
// pages/qiang/xunwu/xunwu.js
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
Page({
    // mixins: [require('../../mixin/themeChanged')],
    data: {
        jiaoyouList: [],
        // isPinche: true,
        pageNum: 1,


    },

    // 搜索框
    toSearch() {
        console.log('跳转搜索页');
        wx.navigateTo({
            url: '../../search/search?' +
                '&searchType=jiaoyou'
        })
    },

    loadJiaoyou() {
        this.setData({
            jiaoyouList: [],
            pageNum: 1
        })
        wx.cloud.database().collection('jiaoyou')
            .where({
                isHege: true,
            })
            .orderBy('isXiajia', 'asc')
            .orderBy('isZhiding', 'desc')
            .orderBy('createTime', 'desc')
            // .skip(0)
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
                console.log('下载的订单列表 jiaoyouList 为：', res.data)
                if (res.data.length !== 0) {
                    this.setData({
                        jiaoyouList: res.data,
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    toPaixu() {
        let {
            jiaoyouList
        } = this.data
        jiaoyouList.reverse()
        this.setData({
            jiaoyouList
        })
    },

    // 列表详情
    toDetail(e) {
        var _id = e.currentTarget.dataset.id
        var _openid = e.currentTarget.dataset.openid
        wx.navigateTo({
            url: '../huangye/xiangqing2/xiangqing2?' +
            '&detailType=' + 'jiaoyou' +
            '&_openid=' + _openid +
            '&_id=' + _id
        })
    },


    toFabu() {
        console.log('跳转添加页');
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            wx.navigateTo({
                url: '../../add/add?' + '&addType=jiaoyou'
            })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },

    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        // console.log('onLoad');

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        // console.log('onReady');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log('onShow');
        this.loadJiaoyou()
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            isShowLoading: true
        })
        var jiaoyouList = this.data.jiaoyouList
        var pageNum = this.data.pageNum + 1
        console.log('页面触底');
        if (this.data.isPinche) {
            wx.cloud.database().collection('jiaoyou').where({
                    isHege: true,
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
                            jiaoyouList.push(element)
                        });
                        console.log('当前下载jiaoyouList第' + pageNum + '页：', jiaoyouList)
                        this.setData({
                            jiaoyouList,
                            pageNum,
                        })
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }
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