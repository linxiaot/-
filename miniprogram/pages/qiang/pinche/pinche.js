// pages/qiang/xunwu/xunwu.js 
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
var utils_time = require('../../../utils/time.js')
var nowday = utils_time.formatTime(new Date())

Page({
    // mixins: [require('../../mixin/themeChanged')],
    data: {
        pincheList: [],
        isPinche: true,
        pageNum: 1,
        // isRiqi: false,
        isShaixuan: false,
        shaixuan_list: [],
        shaixuan_riqi: ''

    },

    // 时间选择器
    bindDateChange: function (e) {
        console.log('日期选择改变，携带值为', e.detail.value)
        var shaixuan_riqi = e.detail.value.slice(5, 7) + '月' + e.detail.value.slice(8, 10) + '日'
        var pincheList = this.data.pincheList
        var shaixuan_list = []
        // shaixuan_riqi.splice(2, 1)
        console.log(shaixuan_riqi);
        pincheList.forEach(element => {
            if (element.shijian.includes(shaixuan_riqi)) {
                shaixuan_list.push(element)
            }
            // var riqi_element = element.createTime.slice(0,10).split('-').join('')
            // var riqi_element = element.createTime.slice(0, 10)
            // if (riqi_element >= shaixuan_riqi) {
            //     if (riqi_element <= shaixuan_riqi2) {
            //         shaixuan_list.push(element)
            //     }
            // }
        });
        this.setData({
            shaixuan_riqi,
            shaixuan_list,
            isShaixuan: true, 
        })
    },
    toRiqi() {
        this.setData({
            // isRiqi: !this.data.isRiqi,
            shaixuan_list: [],
            isShaixuan: false,
            shaixuan_riqi: ''
        })
    },
    // 搜索框
    toSearch() {
        console.log('跳转搜索页');
        wx.navigateTo({
            url: '../../search/search?' +
                '&searchType=pinche' +
                '&isPinche=true'
        })
    },
    checkGuoqi(resList) {
        resList.forEach(element => {
            var shijian = element.shijian
            var yue_index = shijian.indexOf('月') + 1
            var ri_index = shijian.indexOf('日') + 1
            var month = shijian.slice(0, yue_index - 1)
            // console.log(month);
            var day = shijian.slice(yue_index, ri_index - 1)
            nowday = nowday.slice(0, 10)
            var year = nowday.slice(0, 4)
            
            if (Number(month) < 10) {
                month = '0' + Number(month)
                // console.log(month,'月份');
            }
            var element_riqi = element.createTime.slice(0, 4) + '-' + month + '-' + day
            console.log('element_riqi < nowday',element_riqi,'>>',nowday);
            if (element_riqi < nowday) {
                element.isGuoqi = true
            }
        });
        return resList
    },

    loadPinche() {

        // this.setData({
        //     pincheList: [],
        //     pageNum: 1
        // })
        wx.cloud.database().collection('pinche')
            .where({
                isHege: true,
            })
            .orderBy('isXiajia', 'asc')
            .orderBy('isZhiding', 'desc')
            .orderBy('createTime', 'desc')
            // .skip(0)
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
                console.log('下载的订单列表 pincheList 为：', res.data)
                if (res.data.length !== 0) {
                    res.data = this.checkGuoqi(res.data)
                    this.setData({
                        pincheList: res.data,
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    toPaixu() {
        let {
            pincheList
        } = this.data
        pincheList.reverse()
        this.setData({
            pincheList
        })
    },

    // 列表详情
    toDetail(e) {
        var _id = e.currentTarget.dataset.id
        var _openid = e.currentTarget.dataset.openid
        wx.navigateTo({
            url: '../huangye/xiangqing2/xiangqing2?' +
                '&detailType=' + 'pinche' +
                '&_openid=' + _openid +
                '&_id=' + _id
        })
    },


    toFabu() {
        console.log('跳转添加页');
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            wx.navigateTo({
                url: '../../add/add?' + '&addType=pinche'
            })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },

    // 生命周期函数--监听页面加载
    onLoad: function (options) {
        console.log('onLoad');

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log('onReady');
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log('onShow');

        this.loadPinche()
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
        var pincheList = this.data.pincheList
        var pageNum = this.data.pageNum + 1
        console.log('页面触底');
        if (this.data.isPinche) {
            wx.cloud.database().collection('pinche').where({
                    isHege: true,
                    // isPinche: true
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
                        res.data = this.checkGuoqi(res.data)

                        res.data.forEach(element => {
                            pincheList.push(element)
                        });
                        console.log('当前下载pincheList第' + pageNum + '页：', pincheList)
                        this.setData({
                            pincheList,
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