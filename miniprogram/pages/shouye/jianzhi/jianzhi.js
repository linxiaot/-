var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
Page({
 
    data: {
        jianzhiList: [],
        // isPinche: true,
        pageNum: 1,
        mask1Hidden: true,
        mask2Hidden: true,
        listHidden:false, 

        sortList: [{
            sort: "租金高-低",
            image: "",
        }, {
            sort: "租金低-高",
            image: "",
        }],
        leixingList: [{
            text: "日结兼职",
            checked: false
        }, {
            text: "短期兼职"
        }, {
            text: "全职"
        }],
        xinziList: [{
            text: "0-500元",
            num1: 0,
            num2: 500
        }, {
            text: "500-1000元",
            num1: 500,
            num2: 1000
        }, {
            text: "1000-1500元",
            num1: 1000,
            num2: 1500
        }, {
            text: "1500-2000元",
            num1: 1500,
            num2: 2000
        }, {
            text: "2000元以上",
            num1: 2000,
            num2: 10000
        }],
        huxingList: [{
            text: "1室",
            checked: false
        }, {
            text: "2室"
        }, {
            text: "3室"
        }, {
            text: "4室"
        }, {
            text: "5室"
        }],
        xinziSelected: null,
        huxingSelected: null,
        selectedNumb: 0,
        zonghePaixu: '薪资排序',
        shaixuanList: [],
        keyword_leixing: [],
        isShaixuan: false,
    },

    
    leixingShaixuan(jianzhiList, keyword_leixing) {
        // var jianzhiList = this.data.jianzhiList
        var keyword_leixing = this.data.keyword_leixing
        var shaixuanList = []
        jianzhiList.forEach(element2 => {
            keyword_leixing.forEach(element => {
                if (element2.leixing.includes(element)) {
                    shaixuanList.push(element2)
                }
            });
        });
        if (shaixuanList.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '没有筛选结果',
            })
        }
        this.setData({
            isShaixuan: true,
            shaixuanList,
        })
        return shaixuanList
    },
    xinziShaixuan(jianzhiList, xinziSelected) {
        var shaixuanList = []
        var xinziList = this.data.xinziList
        var xinziSelected = this.data.xinziSelected
        // var jianzhiList = this.data.jianzhiList
        var num1 = Number(xinziList[xinziSelected].num1)
        var num2 = Number(xinziList[xinziSelected].num2)
        jianzhiList.forEach(element => {
            var xinzi = Number(element.xinzi)
            if (xinzi > num1 && xinzi < num2) {
                shaixuanList.push(element)
            }
        });
        if (shaixuanList.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '没有筛选结果',
            })
        }
        this.setData({
            shaixuanList,
            isShaixuan: true,
        })
        return shaixuanList
    },
    huxingShaixuan(jianzhiList, huxingSelected) {
        var shaixuanList = []
        var index = this.data.huxingSelected
        var huxingSelected = this.data.huxingList[index].text
        console.log('户型选择：：',huxingSelected);
        jianzhiList.forEach(element => {
            if (element.huxing.includes(huxingSelected)) {
                shaixuanList.push(element)
            }
        });
        if (shaixuanList.length == 0) {
            wx.showToast({
                icon: 'none',
                title: '没有筛选结果',
            })
        }
        this.setData({
            shaixuanList,
            isShaixuan: true,
        })
        return shaixuanList
    },


    // 筛选
    finish() {

        // wx.cloud.callFunction({
        //     name: 'loaddata',
        //     data: {
        //         loaddataType:'zufang',
        //         where: {
        //             isHege:true
        //         },

        //     }
        // }).then(res => {
        //     console.log('云函数[loaddata]下载数据：', res.result.data);
        //     var jianzhiList = res.result.data
        // })
        var jianzhiList = this.data.jianzhiList
        var keyword_leixing = this.data.keyword_leixing
        var xinziSelected = this.data.xinziSelected
        var huxingSelected = this.data.huxingSelected
        if (keyword_leixing.length !== 0) {
            this.leixingShaixuan(jianzhiList, keyword_leixing)
        }
        if (xinziSelected !== null) {
            this.xinziShaixuan(jianzhiList, xinziSelected)
        }
        if (huxingSelected !== null) {
            this.huxingShaixuan(jianzhiList, huxingSelected)
        }
        if (keyword_leixing.length !== 0 && xinziSelected !== null) {
            var shaixuanList1 = this.leixingShaixuan(jianzhiList, keyword_leixing)
            this.xinziShaixuan(shaixuanList1, xinziSelected)
        }
        if (keyword_leixing.length !== 0 && huxingSelected !== null) {
            var shaixuanList1 = this.leixingShaixuan(jianzhiList, keyword_leixing)
            this.huxingShaixuan(shaixuanList1, huxingSelected)
        }
        if (xinziSelected !== null && huxingSelected !== null) {
            var shaixuanList1 = this.xinziShaixuan(jianzhiList, xinziSelected)
            this.huxingShaixuan(shaixuanList1, huxingSelected)
        }
        
    },
    clearSelectedNumb: function () {
        var leixingList = this.data.leixingList
        leixingList.forEach(element => {
            element.checked = false
        });
        this.setData({
            shaixuanList: [],
            keyword_leixing: [],
            leixingList,
            xinziSelected: null,
            huxingSelected: null,
            selectedNumb: 0,
            isShaixuan: false
        })
    },

    leixingSelected: function (e) {

        var index = e.currentTarget.dataset.index;
        var leixingList = this.data.leixingList;
        leixingList[index].checked = !leixingList[index].checked;
        this.setData({
            isShaixuan: false,
            leixingList,
            selectedNumb: this.data.selectedNumb + (leixingList[index].checked ? 1 : -1)
        })

        var keyword_leixing = []
        leixingList.forEach(element1 => {
            if (element1.checked) {
                console.log('已选择区域：：', index, element1.text);
                keyword_leixing.push(element1.text)
            }
        });
        this.setData({
            keyword_leixing
        })
    },
    xinziSelected: function (e) {
        var index = e.currentTarget.dataset.index;
        var keyword_xinzi = this.data.xinziList[index]
        console.log('租金选择：：', index, keyword_xinzi);
        var xinziSelected = this.data.xinziSelected
        if (xinziSelected != index) {
            this.setData({
                xinziSelected: index,
                selectedNumb: this.data.selectedNumb + (xinziSelected == null ? 1 : 0)
            })
        } else {
            this.setData({
                xinziSelected: null,
                isShaixuan: false,
                selectedNumb: this.data.selectedNumb - 1
            })
        }
    },
    huxingSelected: function (e) {
        var index = e.currentTarget.dataset.index;
        // var keyword_xinzi = this.data.xinziList[index]
        // console.log('户型选择：：', index);
        var huxingSelected = this.data.huxingSelected
        if (huxingSelected != index) {
            this.setData({
                huxingSelected: index,
                selectedNumb: this.data.selectedNumb + (huxingSelected == null ? 1 : 0)
            })
        } else {
            this.setData({
                huxingSelected: null,
                isShaixuan: false,
                selectedNumb: this.data.selectedNumb - 1
            })
        }
    },

    // 搜索框
    toSearch() {
        console.log('跳转搜索页');
        wx.navigateTo({
            url: '../../search/search?' +
                '&searchType=jianzhi'
        })
    },

    loadJianzhi() {
        this.setData({
            jianzhiList: [],
            pageNum: 1
        })
        var tenant_id = wx.getStorageSync('tenant_id')
        wx.cloud.database().collection('jianzhi')
            .where({
                isHege: true,
                tenant_id: tenant_id
            })
            .orderBy('isXiajia', 'asc')
            .orderBy('isZhiding', 'desc')
            .orderBy('createTime', 'desc')
            .get()
            .then(res => {
                console.log('下载的订单列表 jianzhiList 为：', res.data)
                if (res.data.length !== 0) {
                    this.setData({
                        jianzhiList: res.data,
                    })
                }
            })
            .catch(err => {
                console.error(err)
            })
    },

    showPaixu() {
        this.setData({
            mask1Hidden: false,
            mask2Hidden: true,
            listHidden:true,
        })
    },
    showShaixuan() {
        this.setData({
            mask1Hidden: true,
            mask2Hidden: false,
            listHidden:true,
        })
    },
    close() {
        this.setData({
            mask1Hidden: true,
            mask2Hidden: true,
            listHidden:false,
        })
    },

    toPaixu(e) { 
        console.log(e);
        var {
            jianzhiList
        } = this.data
        var index = e.currentTarget.dataset.index
        if (index == 0) { //时间排序
            jianzhiList.sort(function (a, b) {
                return b.xinzi - a.xinzi
            });
            this.setData({
                jianzhiList,
                zonghePaixu: this.data.sortList[index].sort
            })
        } else if (index == 1) { //薪资最低
            jianzhiList.sort(function (a, b) {
                return a.xinzi - b.xinzi
            });
            this.setData({
                jianzhiList,
                zonghePaixu: this.data.sortList[index].sort
            })
        }
    },

    // toPaixu() {
    //     let {
    //         jianzhiList
    //     } = this.data
    //     jianzhiList.reverse()
    //     this.setData({
    //         jianzhiList
    //     })
    // },

    // 列表详情
    toDetail(e) {
        var _id = e.currentTarget.dataset.id
        var _openid = e.currentTarget.dataset.openid
        wx.navigateTo({
            url: '../../qiang/huangye/xiangqing2/xiangqing2?' +
            '&detailType=' + 'jianzhi' +
            '&_openid=' + _openid +
            '&_id=' + _id
        })
    },


    toFabu() {
        console.log('跳转添加页');
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            wx.navigateTo({
                url: '../../add/add?' + '&addType=jianzhi'
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
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        console.log('onShow');
        this.loadJianzhi()
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            isShowLoading: true
        })
        var jianzhiList = this.data.jianzhiList
        var pageNum = this.data.pageNum + 1
        var tenant_id = wx.getStorageSync('tenant_id')
        console.log('页面触底');
        if (this.data.isPinche) {
            wx.cloud.database().collection('jianzhi').where({
                    isHege: true,
                    isPinche: true,
                    tenant_id: tenant_id
                })
                .orderBy('createTime', 'desc')
                .skip((pageNum - 1) * 20)
                .get()
                .then(res => {
                    if (res.data.length == 0) {
                        this.setData({
                            isGengDuo: true,
                        })
                    } else {
                        res.data.forEach(element => {
                            jianzhiList.push(element)
                        });
                        console.log('当前下载pincheList第' + pageNum + '页：', jianzhiList)
                        this.setData({
                            jianzhiList,
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