// pages/wode/dingdan/dingdan.js
var openid = wx.getStorageSync('openid')
Page({

  data: {
    dingdanList: [],
    dingdanListJJchuli: [],
    dingdanListJJyijichu: [],
    pageNum: 1,
    isZanWu: false,
    isShowLoading: false,
    isGengDuo: false,
    isDaiqu: true,
    isJijian: false,
    isChuli: true,
    chuliNum: '',
    jichuNum: '',


  },

  tapDaiqu() {
    this.setData({
      isDaiqu: true,
      isJijian: false,
      // 点击 代取 的时候 寄件 的列表要清空
      dingdanListJJchuli: [],
      dingdanListJJyijichu: [],
    })
    wx.cloud.database().collection('daiqu').where({
        _openid: openid
      })
      .orderBy('xd_time', 'desc')
      .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 daiqu 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            // dingdanList:res.data,
            isZanWu: true
          })
        } else {
          this.setData({
            dingdanList: res.data,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },

  tapJijian() {
    this.setData({
      isDaiqu: false,
      isJijian: true,
      dingdanList: [] // 点击 寄件 的时候 代取的列表要清空
    })
    wx.cloud.database().collection('jijian').where({
        _openid: openid
      })
      .orderBy('xd_time', 'desc')
      .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 jijian 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            // dingdanList:res.data,
            isZanWu: true
          })
        } else {
          var dingdanList = res.data
          var dingdanListJJchuli = this.data.dingdanListJJchuli
          var dingdanListJJyijichu = this.data.dingdanListJJyijichu
          dingdanList.forEach(element => {
            if (element.yundanNum == '' || element.yundanNum == null) {
              dingdanListJJchuli.push(element)
            } else {
              dingdanListJJyijichu.push(element)
            }
          });
          this.setData({
            dingdanListJJchuli,
            chuliNum:dingdanListJJchuli.length,
            dingdanListJJyijichu
          })
          console.log('处理中的订单列表：', dingdanListJJchuli);
          console.log('已寄出的订单列表：', dingdanListJJyijichu);

        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  // 寄件 处理中
  toChuli() {
    this.setData({
      isChuli: true
    })
  },
  toYijichu() {
    this.setData({
      isChuli: false
    })
  },

  toXiangQing(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var isJijian = this.data.isJijian
    var isChuli = this.data.isChuli
    var isDaiqu = this.data.isDaiqu
    if (isDaiqu) {
      console.log('用户点击 [代取] 绑定的数据', e)
      var dingdanList = this.data.dingdanList
      var xd_time = dingdanList[index].xd_time
      var kd_Dian = dingdanList[index].kd_Dian
      var kd_Name = dingdanList[index].kd_Name
      var kd_PhoNum = dingdanList[index].kd_PhoNum
      var qh_Ma = dingdanList[index].qh_Ma
      var sd_Didian = dingdanList[index].sd_Didian
      var isDaiqu = this.data.isDaiqu
      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&kd_Dian=' + kd_Dian +
          '&kd_Name=' + kd_Name +
          '&kd_PhoNum=' + kd_PhoNum +
          '&qh_Ma=' + qh_Ma +
          '&sd_Didian=' + sd_Didian +
          '&xd_time=' + xd_time +
          '&isDaiqu=' + isDaiqu
      })
    }
    if (isChuli) {
      console.log('用户点击 [处理中] 绑定的数据', e)
      var dingdanListJJchuli = this.data.dingdanListJJchuli
      var xd_time = dingdanListJJchuli[index].xd_time
      var JJ_weight = dingdanListJJchuli[index].JJ_weight
      var JJ_Name = dingdanListJJchuli[index].JJ_Name
      var JJ_PhoNum = dingdanListJJchuli[index].JJ_PhoNum
      var qujTime = dingdanListJJchuli[index].qujTime
      var mdd = dingdanListJJchuli[index].mdd
      var JJ_Didian = dingdanListJJchuli[index].JJ_Didian
      var yundanNum = dingdanListJJchuli[index].yundanNum
      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&JJ_weight=' + JJ_weight +
          '&JJ_Name=' + JJ_Name +
          '&JJ_PhoNum=' + JJ_PhoNum +
          '&qujTime=' + qujTime +
          '&JJ_Didian=' + JJ_Didian +
          '&yundanNum=' + yundanNum +
          '&mdd=' + mdd +
          '&xd_time=' + xd_time +
          '&isJijian=' + isJijian +
          '&isChuli=' + isChuli
      })
    }
    if (!isChuli) {
      console.log('用户点击 [已寄出] 绑定的数据', e)
      var dingdanListJJyijichu = this.data.dingdanListJJyijichu
      var xd_time = dingdanListJJyijichu[index].xd_time
      var JJ_weight = dingdanListJJyijichu[index].JJ_weight
      var JJ_Name = dingdanListJJyijichu[index].JJ_Name
      var JJ_PhoNum = dingdanListJJyijichu[index].JJ_PhoNum
      var qujTime = dingdanListJJyijichu[index].qujTime
      var mdd = dingdanListJJyijichu[index].mdd
      var JJ_Didian = dingdanListJJyijichu[index].JJ_Didian
      var yundanNum = dingdanListJJyijichu[index].yundanNum
      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&JJ_weight=' + JJ_weight +
          '&JJ_Name=' + JJ_Name +
          '&JJ_PhoNum=' + JJ_PhoNum +
          '&qujTime=' + qujTime +
          '&JJ_Didian=' + JJ_Didian +
          '&yundanNum=' + yundanNum +
          '&mdd=' + mdd +
          '&xd_time=' + xd_time +
          '&isJijian=' + isJijian +
          '&isChuli=' + isChuli
      })
    }
  },

  onLoad: function (options) {
    if (options.isJijian) {
      console.log(options.isJijian);
      this.tapJijian()
    } else {
      this.tapDaiqu()
    }
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
    console.log('页面显示');

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
    var dingdanList = this.data.dingdanList
    var pageNum = this.data.pageNum + 1
    console.log('页面触底');
    if (this.data.isDaiqu) {
      wx.cloud.database().collection('daiqu').where({
          _openid: openid
        })
        .orderBy('xd_time', 'desc')
        .skip((pageNum - 1) * 20)
        .get() //获取根据查询条件筛选后的集合数据  
        .then(res => {
          if (res.data.length == 0) {
            this.setData({
              isGengDuo: true,
              isShowLoading: false
            })
          } else {
            res.data.forEach(element => {
              dingdanList.push(element)
            });
            console.log('当前下载订单列表第' + pageNum + '页：', dingdanList)
            this.setData({
              dingdanList,
              pageNum,
              isShowLoading: false
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
    if (this.data.isJijian) {
      wx.cloud.database().collection('jijian').where({
          _openid: openid
        })
        .orderBy('xd_time', 'desc')
        .skip((pageNum - 1) * 20)
        .get() //获取根据查询条件筛选后的集合数据  
        .then(res => {
          console.log('是否成功');
          if (res.data.length == 0) {
            console.log('res.data.length == 0');
            this.setData({
              isGengDuo: true,
              isShowLoading: false,
            })
          } else {
            console.log('res.data.length ！= 0');
            var dingdanListJJchuli = this.data.dingdanListJJchuli
            var dingdanListJJyijichu = this.data.dingdanListJJyijichu
            res.data.forEach(element => {
              if (element.yundanNum == '' || element.yundanNum == null) {
                dingdanListJJchuli.push(element)
              } else {
                dingdanListJJyijichu.push(element)
              }
            });
            console.log('当前下载订单列表第' + pageNum + '页：', res.data)
            this.setData({
              pageNum,
              isShowLoading: false,
              dingdanListJJchuli,
              chuliNum:dingdanListJJchuli.length,
              dingdanListJJyijichu,
            })
            console.log('处理中的订单列表：', dingdanListJJchuli);
            console.log('已寄出的订单列表：', dingdanListJJyijichu);
          }
        })
        .catch(err => {
          console.error(err)
        })
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})