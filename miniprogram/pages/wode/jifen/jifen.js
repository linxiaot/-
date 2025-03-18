var utils_banner_zhushuju = require('../../../utils/banner_zhushuju.js')

Page({

  data: {
    jifen: [],
    jifen_total: 0,
    jifen_shuoming: '请设置积分说明的内容',
    jifen_shuoming_list: [''],
    jifen_howget: '请设置如何获取积分的内容',
    jifen_howget_list: [''],
  },

  onLoad: function (options) {
    // console.log('个人主页传参，积分总数：',options.jifen_total);
    // this.setData({
    //   jifen_total: options.jifen_total
    // })

    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
    .get()
    .then(res => {
        console.log('后台主参数 toptipsdaiqu：：', res.data);
        var bannerData = res.data
      this.setData({
        jifen_shuoming: bannerData.jifen_shuoming,
        jifen_shuoming_list: bannerData.jifen_shuoming_list,
        jifen_howget: bannerData.jifen_howget,
        jifen_howget_list: bannerData.jifen_howget_list,
      })
    })
    .catch(err => {
      console.log('后台主参数 toptipsdaiqu：： 失败', err);
    })

  },


  onReady: function () {

  },

  onShow: function () {

    // 查询积分
    var openid = wx.getStorageSync('openid')
    let that = this
    let jifen_total = 0
    wx.cloud.database().collection('user').where({
        _openid: openid
      })
      .get()
      .then(res => {
        let jifen = res.data[0].jifen
        jifen.forEach(element => {
          jifen_total += element.jifen_num
        });
        that.setData({
          jifen: jifen.reverse(), //降序
          jifen_total: jifen_total
        })
        console.log('查询用户数据 [积分]:', jifen);
        // 缓存 积分
        // wx.setStorageSync('jifen', jifen)

      })
      .catch(err => {
        console.log('查询用户数据 [积分] 失败:', err);
      })
    // let jifen = wx.getStorageSync('jifen')
    // this.setData({
    //   jifen: jifen.reverse()
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('页面隐藏');
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})