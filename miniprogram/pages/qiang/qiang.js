// pages/qiang/qiang.js

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  //跳转到 寻物
  toXunWu:function(){
    wx.navigateTo({
      url: '../qiang/xunwu/xunwu',
    })
  },
  //跳转到 招领
  toZhaoLing:function(){
    wx.navigateTo({
      url: '../qiang/zhaoling/zhaoling',
    })
  },
  //跳转到 拼车
  toPinChe:function(){
    wx.navigateTo({
      url: '../qiang/pinche/pinche',
    })
  },
  //跳转到 兼职
  toJianZhi:function(){
    wx.navigateTo({
      url: '../qiang/jianzhi/jianzhi',
    })
  },
  //跳转到 二手
  toErShou:function(){
    wx.navigateTo({
      url: '../qiang/ershou/ershou',
    })
  },
  //跳转到 互助
  toHuZhu:function(){
    wx.navigateTo({
      url: '../qiang/huzhu/huzhu',
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