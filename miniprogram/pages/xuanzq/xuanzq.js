// pages/xuanzq/xuanzq.js
// var dateStart= this.data.date1+ ' ' +this.data.time1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chaxunList: [],
    pageNum: 1,
    url: '',
    dateStart: '',
    dateEnd: '',
    date1: '--日期--',
    time1: '--时间--',
    date2: '--日期--',
    time2: '--时间--',
    isChaxun_Daiqu: true,
    showLoading: false,
    isAdmin: false,
    isDaiqu: true,
    isJijian: false,
  },

  tapDaiqu() {
    this.setData({
      isDaiqu: true,
      isJijian: false,
      isChaxun_Daiqu: true,
      chaxunList:[]
    })
  },
  tapJijian() {
    this.setData({
      isDaiqu: false,
      isJijian: true,
      isChaxun_Daiqu: true,
      chaxunList:[]
    })
  },

  toGuanli() {
    let isAdmin = wx.getStorageSync('isAdmin')
    if (isAdmin) {
      this.setData({
        isAdmin: isAdmin
      })
    } else {
      wx.showToast({
        icon: 'error',
        title: '非管理员',
      })
    }
  },

  bindDateChange_1: function (e) {
    this.setData({
      date1: e.detail.value,
      isChaxun_Daiqu: true,
    })
  },
  bindTimeChange_1: function (e) {
    this.setData({
      isChaxun_Daiqu: true,
      time1: e.detail.value
    })
  },
  bindDateChange_2: function (e) {
    this.setData({
      isChaxun_Daiqu: true,
      date2: e.detail.value
    })
  },
  bindTimeChange_2: function (e) {
    this.setData({
      isChaxun_Daiqu: true,
      time2: e.detail.value
    })
  },

  toChaxun() {
    let that = this
    let dateStart = this.data.date1 + ' ' + this.data.time1
    let dateEnd = this.data.date2 + ' ' + this.data.time2
    let isDaiqu = this.data.isDaiqu
    this.setData({
      showLoading: true,
    })
    wx.cloud.callFunction({
      name: 'tochaxun',
      data: {
        dateStart: dateStart,
        dateEnd: dateEnd,
        isDaiqu: isDaiqu,
      },
      success: res => {
        console.log('[云函数] [tochaxun] 返回的数据: ', res.result.data)
        if (res.result.data.length == 0) {
          that.setData({
            isChaxun_Daiqu: true,
            showLoading: false,
          })
          wx.showToast({
            title: '查询结果为空',
          })
        } else {
          that.setData({
            chaxunList: res.result.data,
            isChaxun_Daiqu: false,
            showLoading: false,
          })
        }
      },
      fail: err => {
        console.log('[云函数] [tochaxun] 返回 失败: ', err)
        wx.showToast({
          title: '未查询到信息',
        })
        that.setData({
          showLoading: false,
          isChaxun_Daiqu: true,
        })
      }
    })
  },

  toExcel() { 
    let that = this
    let isDaiqu = this.data.isDaiqu
    this.setData({
      showLoading: true,
    })
    wx.cloud.callFunction({
      name: 'toexcel',
      data: {
        isDaiqu: isDaiqu,
        chaxunList: that.data.chaxunList
      },
      success: res => {
        console.log('[云函数] [excel] 返回的数据: ', res)
        wx.cloud.getTempFileURL({
          fileList: [res.result.fileID],
          success: res => {
            // get temp file URL
            console.log('文件的下载链接 url 是：', res.fileList[0].tempFileURL)
            that.setData({
              url: res.fileList[0].tempFileURL,
              showLoading: false,
              isChaxun_Daiqu: true,
            })
          },
          fail: err => {
            console.log('文件下载地址url 失败', err)
            // handle error
            that.setData({
              showLoading: false,
              isChaxun_Daiqu: true,
            })
          }
        })
      },
      fail: e => {
        console.log('[云函数] [excel] 返回的数据: ', e)
        that.setData({
          showLoading: false,
        })
      },
    })
  },
  toUrlcopy() {
    wx.setClipboardData({
      data: this.data.url,
      success(res) {
        console.log('用户点击，成功复制微信号', res);
      }
    })
  },
  toUrlcopy() {
    wx.setClipboardData({
      data: this.data.url,
      success(res) {
        console.log('用户点击，成功复制微信号', res);
      }
    })
  },


  // onReachBottom: function () {
  //   this.setData({
  //     isShowLoading: true
  //   })
  //   var chaxunList = this.data.chaxunList
  //   var pageNum = this.data.pageNum + 1

  //   let that = this
  //   let dateStart = this.data.date1 + ' ' + this.data.time1
  //   let dateEnd = this.data.date2 + ' ' + this.data.time2

  //   console.log('页面触底');
  //   if (this.data.isDaiqu) {

  //     wx.cloud.callFunction({
  //       name: 'tochaxun',
  //       data: {
  //         pageNum: pageNum,
  //         dateStart: dateStart,
  //         dateEnd: dateEnd,
  //       },
  //       success: res => {
  //         console.log('当前查询信息第' + pageNum + '页：', chaxunList)
  //         res.result.data.forEach(element => {
  //           chaxunList.push(element)
  //         });
  //         that.setData({
  //           chaxunList: chaxunList,
  //           // isChaxun_Daiqu:false,
  //           isShowLoading: false,
  //           pageNum: pageNum,
  //         })
  //         if (res.result.data.length == 0) {
  //           this.setData({
  //             isGengDuo: true
  //           })
  //         }

  //       },
  //       fail: err => {
  //         console.log('[云函数] [tochaxun] 返回 失败: ', err)
  //         that.setData({
  //           isShowLoading: false,
  //           // isChaxun_Daiqu:true,
  //         })
  //       },
  //     })
  //   }

  // },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let isAdmin = wx.getStorageSync('isAdmin')
    // if (isAdmin) {
    //   this.setData({
    //     isAdmin:false,
    //   })
    // }
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