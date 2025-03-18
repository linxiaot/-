var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
Page({
  // mixins: [require('../../mixin/themeChanged')],
  data: {
    erShouList: [],

    pageNum: 1,
  },
  // 搜索框
  toSearch() {
    console.log('跳转搜索页');
    wx.navigateTo({
      url: '../../search/search?' +
        '&searchType=ershou'
    })
  },

  loadErshou() {
    var tenant_id = wx.getStorageSync('tenant_id')
    wx.cloud.database().collection('ershou')
      .where({
        isHege: true,
        tenant_id: tenant_id // 添加租户ID过滤
      })
      .orderBy('isXiajia', 'asc')
      .orderBy('isZhiding', 'desc')
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        console.log('二手列表数据res', res.data);
        this.setData({
          erShouList: res.data
        })
      })
      .catch(console.error)
  },

  toPaixu() {
    let {
      erShouList
    } = this.data
    erShouList.reverse()
    this.setData({
      erShouList
    })
  },


  // 列表详情
  toDetail(e) {
    var index = e.currentTarget.dataset.index
    // console.log(e);
    var erShouList = this.data.erShouList
    var _id = erShouList[index]._id
    var _openid = erShouList[index]._openid
    wx.navigateTo({
      url: '../huangye/xiangqing2/xiangqing2?' +
        '&detailType=' + 'ershou' +
        '&_openid=' + _openid +
        '&_id=' + _id
    })
    // console.log(_id);

  },


  toAdd() {
    console.log('跳转添加页');
    var login_ok = wx.getStorageSync('login_ok')
    if (login_ok) {
      wx.navigateTo({
        url: '../../add/add?' + '&addType=ershou'
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
    this.loadErshou()
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

    var erShouList = this.data.erShouList
    var pageNum = this.data.pageNum + 1
    var tenant_id = wx.getStorageSync('tenant_id')
    console.log('页面触底');
    wx.cloud.database().collection('ershou')
      .where({
        isHege: true,
        tenant_id: tenant_id // 添加租户ID过滤
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
            erShouList.push(element)
          });
          console.log('当前下载erShouList第' + pageNum + '页：', erShouList)
          this.setData({
            erShouList,
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