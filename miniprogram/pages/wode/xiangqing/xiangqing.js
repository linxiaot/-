Page({

  data: {
    // 代取订单参数
    kd_Dian: '',
    kd_Name: '',
    kd_PhoNum: '',
    qh_Ma: '',
    sd_Didian: '',
    xd_time: '',
    isDaiqu: false,

    // 寄件订单参数
    JJ_weight: '',
    JJ_Name: '',
    JJ_PhoNum: '',
    qujTime: '',
    JJ_Didian: '',
    mdd: '',
    isJijian: false,
    isChuli: false,

  },

  onLoad: function (options) {
    console.log('页面加载 准备传参');
    
    if (options.isDaiqu) {
      console.log('代取 订单传递的参数是：', options);
      this.setData({
        kd_Dian: options.kd_Dian,
        kd_Name: options.kd_Name,
        kd_PhoNum: options.kd_PhoNum,
        qh_Ma: options.qh_Ma,
        sd_Didian: options.sd_Didian,
        xd_time: options.xd_time,
        isDaiqu: options.isDaiqu,
      })
    }
    if (options.isJijian) {
      console.log('寄件 订单传递的参数是：', options);
      this.setData({
        JJ_weight: options.JJ_weight,
        JJ_Name: options.JJ_Name,
        JJ_PhoNum: options.JJ_PhoNum,
        JJ_Didian: options.JJ_Didian,
        qujTime: options.qujTime,
        yundanNum: options.yundanNum,
        mdd: options.mdd,
        xd_time: options.xd_time,
        isJijian: options.isJijian,
        isChuli: options.isChuli,
      })
    }
  },
  // 点我复制到剪贴板
  toCopy() {
    wx.setClipboardData({
      data: this.data.yundanNum,
      success(res) {
        console.log('用户点击，成功复制微信号', res);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})