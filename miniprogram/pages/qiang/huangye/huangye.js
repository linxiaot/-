// pages/qiang/huangye/huangye.js
var utils_time = require('../../../utils/time.js') //获取时间等
Page({
  // mixins: [require('../../mixin/themeChanged')],
  data: {
    inputShowed: false,
    inputVal: "",

    guangGaoList: [],
    bannerOpen_shouye : true,
    bannerOpen_shouye_ad: false,
    
    huangYeList: [],
    isTijiao: false,
    isHuangyehidden: false,
    inputNum: 0,
    pageNum: 1,

    mask1Hidden: true,
    mask2Hidden: true,
    listHidden: false,
    isShaixuan: false,

    leibieList: [{
      text: "美食",
      checked: false
    }, {
      text: "开锁/换锁/修锁"
    }, {
      text: "保洁清洗"
    }, {
      text: "鲜花绿植"
    }, {
      text: "管道疏通/清洗"
    }, {
      text: "生活配送"
    }, {
      text: "其他"
    }],
    leibieSelected: null,
    selectedNumb: 0,
    shaixuanList: [],

  },

  leibieShaixuan(huangYeList, leibieSelected) {
    var shaixuanList = []
    var index = this.data.leibieSelected
    var leibieSelected = this.data.leibieList[index].text
    console.log('类别选择：：', leibieSelected);
    huangYeList.forEach(element => {
      if (element.leibie.includes(leibieSelected)) {
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

  leibieSelected: function (e) {
    var index = e.currentTarget.dataset.index;
    // var keyword_xinzi = this.data.xinziList[index]
    // console.log('户型选择：：', index);
    var leibieSelected = this.data.leibieSelected
    if (leibieSelected != index) {
      this.setData({
        leibieSelected: index,
        selectedNumb: this.data.selectedNumb + (leibieSelected == null ? 1 : 0)
      })
    } else {
      this.setData({
        leibieSelected: null,
        isShaixuan: false,
        selectedNumb: this.data.selectedNumb - 1
      })
    }
  },

  // 筛选
  finish() {
    var huangYeList = this.data.huangYeList
    var leibieSelected = this.data.leibieSelected
    if (leibieSelected !== null) {
      this.leibieShaixuan(huangYeList, leibieSelected)
    }
  },
  clearSelectedNumb: function () {
    var leibieList = this.data.leibieList
    leibieList.forEach(element => {
      element.checked = false
    });
    this.setData({
      shaixuanList: [],
      leibieSelected: null,
      selectedNumb: 0,
      isShaixuan: false
    })
  },

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


  toSearch() {
    console.log('跳转搜索页');
    wx.navigateTo({
      url: '../../search/search?' + '&searchType=huangye'
    })
  },


  // 列表详情
  toHangyeDetail(e) {
    console.log('黄页', e);
    var _id = e.currentTarget.dataset.id
    var _openid = e.currentTarget.dataset.openid
    wx.navigateTo({
      url: './xiangqing2/xiangqing2?' +
        '&detailType=' + 'huangye' +
        '&_openid=' + _openid +
        '&_id=' + _id
    })
  },

  bindinputJianjie(e) {
    // console.log(e.detail.value);
    // console.log(e.detail.cursor);
    this.setData({
      inputNum: e.detail.cursor
    })
  },

  toTijiao() {
    wx.navigateTo({
      url: '../../add/add?addType=huangye',
    })
  },


  // 生命周期函数--监听页面加载
  onLoad: function (options) {

    
    // 获取广告src
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数banner：：', res.data);
        var guangGaoList = res.data.shouyeBanner
        var bannerOpen_shouye = res.data.bannerOpen_shouye
        var bannerOpen_shouye_ad = res.data.bannerOpen_shouye_ad

        this.setData({
          guangGaoList,
          bannerOpen_shouye,
          bannerOpen_shouye_ad,
        })
      })
      .catch(err => {
        console.error(err);
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
    const _ = wx.cloud.database().command
    var tenant_id = wx.getStorageSync('tenant_id')
    wx.cloud.database().collection('huangye')
      .where({
        isHege: true,
        tenant_id: tenant_id
      })
      .orderBy('isXiajia', 'asc')
      .orderBy('isZhiding', 'desc')
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        console.log('黄页列表数据res', res.data);
        this.setData({
          huangYeList: res.data
        })
      })
      .catch(console.error)
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
    var huangYeList = this.data.huangYeList
    var pageNum = this.data.pageNum + 1
    var tenant_id = wx.getStorageSync('tenant_id')
    console.log('页面触底');
    wx.cloud.database().collection('huangye').where({
        isHege: true,
        tenant_id: tenant_id
      })
      .orderBy('isXiajia', 'asc')
      .orderBy('isZhiding', 'desc')
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
            huangYeList.push(element)
          });
          console.log('当前下载订单列表第' + pageNum + '页：', huangYeList)
          this.setData({
            huangYeList,
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
    }, 1000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})