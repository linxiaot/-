var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
Page({

    data: { 
        zufangList: [],
        // zufangList_length: 1,
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
        quyuList: [{
            text: "东坡村",
            checked: false
        }, {
            text: "北斗村"
        }, {
            text: "南阳村"
        }, {
            text: "教师公寓"
        }, {
            text: "东门"
        }, {
            text: "润玉桃李"
        }],
        zujinList: [{
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
        zujinSelected: null,
        huxingSelected: null,
        selectedNumb: 0,
        zonghePaixu: '租金排序',
        shaixuanList: [],
        keyword_quyu: [],
        isShaixuan: false,

    }, 

    quyuShaixuan(zufangList, keyword_quyu) {
        // var zufangList = this.data.zufangList
        var keyword_quyu = this.data.keyword_quyu
        var shaixuanList = []
        zufangList.forEach(element2 => {
            keyword_quyu.forEach(element => {
                if (element2.name.includes(element)) {
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
    zujinShaixuan(zufangList, zujinSelected) {
        var shaixuanList = []
        var zujinList = this.data.zujinList
        var zujinSelected = this.data.zujinSelected
        // var zufangList = this.data.zufangList
        var num1 = Number(zujinList[zujinSelected].num1)
        var num2 = Number(zujinList[zujinSelected].num2)
        zufangList.forEach(element => {
            var zujin = Number(element.zujin)
            if (zujin > num1 && zujin < num2) {
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
    huxingShaixuan(zufangList, huxingSelected) {
        var shaixuanList = []
        var index = this.data.huxingSelected
        var huxingSelected = this.data.huxingList[index].text
        console.log('户型选择：：',huxingSelected);
        zufangList.forEach(element => {
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
        //     var zufangList = res.result.data
        // })
        var zufangList = this.data.zufangList
        var keyword_quyu = this.data.keyword_quyu
        var zujinSelected = this.data.zujinSelected
        var huxingSelected = this.data.huxingSelected
        if (keyword_quyu.length !== 0) {
            this.quyuShaixuan(zufangList, keyword_quyu)
        }
        if (zujinSelected !== null) {
            this.zujinShaixuan(zufangList, zujinSelected)
        }
        if (huxingSelected !== null) {
            this.huxingShaixuan(zufangList, huxingSelected)
        }
        if (keyword_quyu.length !== 0 && zujinSelected !== null) {
            var shaixuanList1 = this.quyuShaixuan(zufangList, keyword_quyu)
            this.zujinShaixuan(shaixuanList1, zujinSelected)
        }
        if (keyword_quyu.length !== 0 && huxingSelected !== null) {
            var shaixuanList1 = this.quyuShaixuan(zufangList, keyword_quyu)
            this.huxingShaixuan(shaixuanList1, huxingSelected)
        }
        if (zujinSelected !== null && huxingSelected !== null) {
            var shaixuanList1 = this.zujinShaixuan(zufangList, zujinSelected)
            this.huxingShaixuan(shaixuanList1, huxingSelected)
        }
        
    },
    clearSelectedNumb: function () {
        var quyuList = this.data.quyuList
        quyuList.forEach(element => {
            element.checked = false
        });
        this.setData({
            shaixuanList: [],
            keyword_quyu: [],
            quyuList,
            zujinSelected: null,
            huxingSelected: null,
            selectedNumb: 0,
            isShaixuan: false
        })
    },

    quyuSelected: function (e) {

        var index = e.currentTarget.dataset.index;
        var quyuList = this.data.quyuList;
        quyuList[index].checked = !quyuList[index].checked;
        this.setData({
            isShaixuan: false,
            quyuList,
            selectedNumb: this.data.selectedNumb + (quyuList[index].checked ? 1 : -1)
        })

        var keyword_quyu = []
        quyuList.forEach(element1 => {
            if (element1.checked) {
                console.log('已选择区域：：', index, element1.text);
                keyword_quyu.push(element1.text)
            }
        });
        this.setData({
            keyword_quyu
        })
    },
    zujinSelected: function (e) {
        var index = e.currentTarget.dataset.index;
        var keyword_zujin = this.data.zujinList[index]
        console.log('租金选择：：', index, keyword_zujin);
        var zujinSelected = this.data.zujinSelected
        if (zujinSelected != index) {
            this.setData({
                zujinSelected: index,
                selectedNumb: this.data.selectedNumb + (zujinSelected == null ? 1 : 0)
            })
        } else {
            this.setData({
                zujinSelected: null,
                isShaixuan: false,
                selectedNumb: this.data.selectedNumb - 1
            })
        }
    },
    huxingSelected: function (e) {
        var index = e.currentTarget.dataset.index;
        // var keyword_zujin = this.data.zujinList[index]
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
                '&searchType=zufang'
        })
    },

    loadZufang() { 
        this.setData({
            zufangList: [],
            pageNum: 1
        })
        wx.cloud.database().collection('zufang')
            .where({
                isHege: true,
            })
            .orderBy('isXiajia', 'asc')
            .orderBy('isZhiding', 'desc')
            .orderBy('createTime', 'desc')
            // .skip(0)
            .get() //获取根据查询条件筛选后的集合数据  
            .then(res => {
                console.log('下载的订单列表 zufangList 为：', res.data)
                if (res.data.length !== 0) {
                    this.setData({
                        zufangList: res.data,
                        // zufangList_length: res.data.length
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
            zufangList
        } = this.data
        var index = e.currentTarget.dataset.index
        if (index == 0) { //租金最高
            zufangList.sort(function (a, b) {
                return b.zujin - a.zujin
            });
            this.setData({
                zufangList,
                zonghePaixu: this.data.sortList[index].sort
            })
        } else if (index == 1) { //租金最低
            zufangList.sort(function (a, b) {
                return a.zujin - b.zujin
            });
            this.setData({
                zufangList,
                zonghePaixu: this.data.sortList[index].sort
            })
        }
    },


    // 列表详情
    toDetail(e) {
        var _id = e.currentTarget.dataset.id
        var _openid = e.currentTarget.dataset.openid
        wx.navigateTo({
            url: '../../qiang/huangye/xiangqing2/xiangqing2?' +
                '&detailType=' + 'zufang' +
                '&_openid=' + _openid +
                '&_id=' + _id
        })
    },


    toFabu() {
        console.log('跳转添加页');
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            wx.navigateTo({
                url: '../../add/add?' + '&addType=zufang'
            })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },


    onLoad: function (options) {
        // console.log('onLoad');

    },

    onShow: function () {
        console.log('onShow');
        this.loadZufang()
    },

    onReachBottom: function () {
        this.setData({
            isShowLoading: true
        })
        var zufangList = this.data.zufangList
        var pageNum = this.data.pageNum + 1
        console.log('页面触底');
        if (this.data.isPinche) {
            wx.cloud.database().collection('zufang').where({
                    isHege: true,
                    isPinche: true
                })
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
                            zufangList.push(element)
                        });
                        console.log('当前下载pincheList第' + pageNum + '页：', zufangList)
                        this.setData({
                            zufangList,
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

    onShareAppMessage: function () {

    }
})