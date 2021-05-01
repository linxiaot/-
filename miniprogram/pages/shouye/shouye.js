// pages/shouye/shouye.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //小蜜蜂的头像
    url:'https://xmf-0g87mzf198205ada-1305629196.tcloudbaseapp.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%85%8D%E7%BD%AE%E5%9B%BE%E7%89%87/%E5%B0%8F%E8%9C%9C%E8%9C%82%E4%BB%A3%E5%8F%96%E5%A4%B4%E5%83%8F.jpg?sign=a9a428a209628155f18a9c1d5398e427&t=1618578669',
    
    url_2:'https://xmf-0g87mzf198205ada-1305629196.tcloudbaseapp.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%85%8D%E7%BD%AE%E5%9B%BE%E7%89%87/xiaomifeng.png?sign=40491ed53b44b741a37b2b634d977410&t=1618583872'
    
  },
  //跳转到代取下单
  toDaiQu:function(){
    wx.navigateTo({
      url: '../shouye/daiqu/daiqu',
    })
  },
  //跳转到寄走下单
  toJiZou:function(){
    wx.navigateTo({
      url: '../shouye/jizou/jizou',
    })
  },
  //跳转到美食
  toMeiShi:function(){
    wx.navigateTo({
      url: '../shouye/meishi/meishi',
    })
  },
  // 显示二维码图片
  erWeima(){
    wx.previewImage({
      current: this.data.url_2, // 当前显示图片的http链接
      urls: [this.data.url_2] // 需要预览的图片http链接列表
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})