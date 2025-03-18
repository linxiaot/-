const db = wx.cloud.database()
var xingjisrc1 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing1.png'
var xingjisrc2 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing2.png'
var xingjisrc3 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing3.png'
var utils_time = require('../../../utils/time.js')
// var app = getApp()
Page({

  data: {

    categoryList: {
      pageone: [{
        name: "美食",
        src: "https://gw.alicdn.com/tfs/TB1fcOKXkCy2eVjSZSyXXXukVXa-183-144.png?getAvatar=1"
      }, {
        name: "甜点饮品",
        src: "https://gw.alicdn.com/tfs/TB11tFkr7L0gK0jSZFxXXXWHVXa-183-144.png?getAvatar=1"
      }, {
        name: "超市",
        src: "https://gw.alicdn.com/tfs/TB1FucwVwHqK1RjSZFgXXa7JXXa-183-144.png?getAvatar=1"
      }, {
        name: "正餐",
        src: "https://cube.elemecdn.com/7/d8/a867c870b22bc74c87c348b75528djpeg.jpeg?x-oss-process=image/format,webp/resize,w_90,h_90,m_fixed"
      }, {
        name: "生鲜果蔬",
        src: "https://gw.alicdn.com/tfs/TB11tFkr7L0gK0jSZFxXXXWHVXa-183-144.png?getAvatar=1"
      }, {
        name: "全部商家",
        src: "https://gw.alicdn.com/tfs/TB1nBktVxTpK1RjSZR0XXbEwXXa-183-144.png?getAvatar=1"
      }, {
        name: "商家配送",
        src: "https://gw.alicdn.com/tfs/TB1DaMyVpzqK1RjSZFoXXbfcXXa-185-144.png?getAvatar=1"
      }, {
        name: "蜜蜂配送",
        src: "https://gw.alicdn.com/tfs/TB1tikBVAPoK1RjSZKbXXX1IXXa-183-144.png?getAvatar=1"
      }],

    },

    shangjiaList: [],
    guangGaoList: [],

    // 筛选
    mask1Hidden: true,
    mask2Hidden: true,
    listHidden: false,

    sortList: [{
      sort: "起送价最低",
      image: "",
    }, {
      sort: "评价最高",
      image: "",
    }, {
      sort: "配送最快",
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
    zonghePaixu: '综合排序',
    shaixuanList: [],
    keyword_quyu: [],
    isShaixuan: false,

    foodList_zhiding: [],
    pageNum: 1,

    isNoMore: false,
    timeSys: '',
  },
  toxiuxi_tongzhi() {
    wx.showToast({
      title: '店铺休息中..',
      icon: 'none'
    })
  },

  totiaozhuan_image(e) {
    // var index = e.currentTarget.dataset.index
    this.toDianpu(e)
  },
  loadmore_dianpu() {
    var pageNum = this.data.pageNum + 1
    var shangjiaList = this.data.shangjiaList
    wx.showLoading({
      title: 'loading',
    })
    db.collection('shangjia').where({
        isDianpuOpen: true
      })
      // .orderBy('xd_time', 'desc')
      .skip((pageNum - 1) * 20)
      .get()
      .then(res => {
        wx.hideLoading({})
        if (res.data.length == 0) {
          this.setData({
            isNoMore: true
          })
        } else {
          res.data.forEach(element => {
            element.xingji_list = this.showXingji(element.xingji)
            element.isYingye = this.checkYingye(element.peisongTime)
            shangjiaList.push(element)
          });
          this.setData({
            shangjiaList,
            pageNum,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })

  },


  toDetail_meishi(e) {
    var index_a = e.currentTarget.dataset.index_a
    var index_b = e.currentTarget.dataset.index_b
    var _id = e.currentTarget.dataset.id
    console.log(_id, index_a, index_b);

    wx.navigateTo({
      url: '../../shangjia/sjmeishidetail/sjmeishidetail?_id=' + _id +
        '&isDetail_meishi=true' +
        '&index_a=' + index_a +
        '&index_b=' + index_b,
    })
  },

  // 筛选排序等
  showPaixu() {
    this.setData({
      mask1Hidden: false,
      mask2Hidden: true,
      listHidden: true,
    })
  },
  showShaixuan() {
    this.setData({
      mask1Hidden: true,
      mask2Hidden: false,
      listHidden: true,
    })
  },
  close() {
    this.setData({
      mask1Hidden: true,
      mask2Hidden: true,
      listHidden: false,
    })
  },

  toPaixu(e) {
    console.log(e);
    var shangjiaList = this.data.shangjiaList
    var index = e.currentTarget.dataset.index
    if (index == 0) { //起送价最低
      shangjiaList.sort(function (a, b) {
        return a.qisong - b.qisong
      });

    } else if (index == 1) { //评价最高
      shangjiaList.sort(function (a, b) {
        return b.xingji - a.xingji
      });
    } else if (index == 2) { //配送最快
      shangjiaList.sort(function (a, b) {
        return a.peisongShijian - b.peisongShijian
      });
    }
    var sortList = this.data.sortList
    sortList.forEach((element, i) => {
      if (i == index) {
        element.checked = true
      } else {
        element.checked = false
      }
    });
    this.setData({
      shangjiaList,
      sortList,
    })
  },

  // 搜索
  // 去搜索页
  toSearch() {
    console.log('跳转搜索页');
    wx.navigateTo({
      url: '../../search/search?' +
        '&searchType=shangjia'
    })
  },
  showInput: function () {
    this.setData({
      isInputShowed: true,
      isShowKong: false,
      searchResultList: []
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      isInputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.showInput()
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  // // 广告
  // toYulanImage(e) {
  //   console.log('预览图片', e);
  //   var current = e.currentTarget.dataset.src
  //   wx.previewImage({
  //     current, // 当前显示图片的http链接
  //     urls: this.data.yulanImageList // 需要预览的图片http链接 列表
  //   })
  // },

  // 展开店铺 去下单
  toDianpu(e) {
    // console.log(e);
    var _id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../meishi/meishi?_id=' + _id,
    })
  },

  showXingji(fenshu) {
    var xingji_list = [xingjisrc1, xingjisrc1, xingjisrc1, xingjisrc1, xingjisrc1]
    for (let index = 0; index < xingji_list.length; index++) {
      if (index < fenshu) {
        xingji_list[index] = xingjisrc2
      }
    }
    return xingji_list
  },

  checkYingye(peisongTime) {
    var time1 = peisongTime.time1
    var time2 = peisongTime.time2
    var timeSys = this.data.timeSys
    if (timeSys > time1 && timeSys < time2) {
      var isYingye = true
    }
    return isYingye
  },

  onLoad: function (options) {

    // 获取广告src
    db.collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数banner：：', res.data);
        var guangGaoList = res.data.shouyeBanner_meishi
        var bannerOpen_shouye = res.data.bannerOpen_shouye
        var bannerOpen_shouye_ad = res.data.bannerOpen_shouye_ad
        // var yulanImageList = []
        // for (let index = 0; index < guangGaoList.length; index++) {
        //   const element = guangGaoList[index];
        //   db.collection('shangjia').doc(element.dianpu_id)
        //     .get()
        //     .then(res => {
        //       var peisongTime = res.data.peisongTime
        //       element.isYingye = this.checkYingye(peisongTime)
        //     })
        // }
        guangGaoList.forEach(element => {
          // yulanImageList.push(element.src)
          db.collection('shangjia').doc(element.dianpu_id)
            .get()
            .then(res => {
              console.log(res,'查询peisongtime');
              var peisongTime = res.data.peisongTime
              element.isYingye = this.checkYingye(peisongTime)
              this.setData({guangGaoList})
            })

        });
        this.setData({
          // yulanImageList,
          // guangGaoList,
          bannerOpen_shouye,
          bannerOpen_shouye_ad,
        })
      })
      .catch(err => {
        console.error(err);
      })

    db.collection('shangjia').where({
        isDianpuOpen: true
      }).get()
      .then(res => {
        console.log(res.data, '下载商家数据');
        if (res.data.length !== 0) {
          res.data.forEach(element => {
            element.xingji_list = this.showXingji(element.xingji)
            element.isYingye = this.checkYingye(element.peisongTime)
          });
          this.setData({
            shangjiaList: res.data
          })
        }
      })
      .catch(err => {})
  },

  onShareAppMessage: function () {

  },
  onShow: function () {
    console.log('onshow');
    // wx.removeStorageSync('cartData')
    // app.globalData.cartData = ''
    this.showXingji()
    var timeSys = utils_time.formatTime(new Date()).slice(11, 16)
    console.log(timeSys, 'timeSys');
    this.setData({
      timeSys
    })
  },
  onReachBottom() {
    this.loadmore_dianpu()
  },

})