// pages/wode/wode.js
var utils_time = require('../../../utils/time.js') //获取时间等


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: '',
    nickName: '',
    city: '',
    gender: '',
    province: '',
    avatarUrl: '',
    //未登陆时的头像
    Url: 'https://xmf-0g87mzf198205ada-1305629196.tcloudbaseapp.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%85%8D%E7%BD%AE%E5%9B%BE%E7%89%87/touxiang.png?sign=10dbd2f842a9b3fcdb865ca28974d60d&t=1618579789',
    openid: '',
    login_ok: false,
    isAdmin: false,
    isShangjia: false,
    isYonghu: false,
    jifen: [],
    zhuceTime: '',
    userPhoneNumber: ''

  },

  //点击授权登陆 注册
  onGetUserInfo: function () {
    // console.log('点击授权登陆')
    // 弹窗询问是否授权
    wx.getUserProfile({
      desc: '用于完善会员资料', //必填 描述信息
      success: (res) => {
        console.log('userInfo获取成功', res.userInfo)
        wx.showLoading({
          title: '正在登陆',
          mask: true,
        })
        // 赋值
        this.setData({
          userinfo: res.userInfo,
          nickName: res.userInfo.nickName,
          city: res.userInfo.city,
          gender: res.userInfo.gender,
          province: res.userInfo.province,
          avatarUrl: res.userInfo.avatarUrl
        })
        // 获取 openid
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result.openid)
            // 保存到本地 openid
            this.setData({
              openid: res.result.openid
            })

            let openid = this.data.openid
            let nickName = this.data.nickName
            let city = this.data.city
            let gender = this.data.gender
            let province = this.data.province
            let avatarUrl = this.data.avatarUrl
            // let jifen = this.data.jifen //积分
            let userinfo = this.data.userinfo
            let userPhoneNumber = this.data.userPhoneNumber
            let isShangjia = this.data.isShangjia
            let isAdmin = this.data.isAdmin
            let isYonghu = this.data.isYonghu

            // 判断用户是否注册
            wx.cloud.database().collection('user')
              .where({
                _openid: openid
              })
              .get()
              .then(res => {
                console.log('查询用户 openid 记录数量', res.data.length, res)
                if (res.data.length == 0) {
                  console.log('[判断注册] 未注册')
                  // 调用函数时，传入new Date()参数，返回值是日期和时间
                  var zhuceTime = utils_time.formatTime(new Date());
                  // this.setData({
                  //   zhuceTime: zhuceTime
                  // })
                  // 未注册 则新增数据 to 云端 user
                  wx.cloud.database().collection('user').add({
                    data: {
                      nickName: nickName,
                      userPhoneNumber: userPhoneNumber,
                      city: city,
                      gender: gender,
                      province: province,
                      avatarUrl: avatarUrl,
                      jifen: [{
                        jifen_name: '注册',
                        jifen_num: 10,
                        jifen_time: zhuceTime
                      }], //首次注册积分初始值
                      zhuceTime: zhuceTime,
                      isYonghu: isYonghu,
                      isAdmin: isAdmin,
                      isShangjia: isShangjia,
                    },
                    success: res => {
                      console.log('注册数据 新增 成功', res)
                      // 保存到本地
                      wx.setStorageSync('userinfo', userinfo)
                      // 保存到本地 openid
                      wx.setStorageSync('openid', openid)
                      // 保存到本地 _id
                      wx.setStorageSync('id', res._id)
                      // 缓存 登陆状态为
                      wx.setStorageSync('login_ok', true)
                      // 缓存 积分
                      wx.setStorageSync('jifen', jifen)
                      // 缓存 商家身份
                      wx.setStorageSync('isShangjia', isShangjia)
                      // 缓存 管理员身份
                      wx.setStorageSync('isAdmin', isAdmin)
                      setTimeout(function () {
                        wx.hideLoading()
                      }, 300)
                    },
                    fail: err => {
                      console.log('注册数据 新增 失败', err)
                      setTimeout(function () {
                        wx.hideLoading()
                      }, 300)
                    },

                  })

                } else {
                  console.log('[判断注册] 已注册 无需新增', res.data)
                  wx.cloud.database().collection('user').doc(res.data[0]._id)
                    .update({
                      data: {
                        nickName: nickName,
                        city: city,
                        gender: gender,
                        province: province,
                        avatarUrl: avatarUrl,
                        userPhoneNumber: userPhoneNumber,
                      },
                      success: res => {
                        console.log('注册数据 更新 成功几条：', res.stats.updated, res)
                        setTimeout(function () {
                          wx.hideLoading()
                        }, 300)
                      },
                      fail: err => {
                        console.log('注册数据 更新 失败', err)
                        setTimeout(function () {
                          wx.hideLoading()
                        }, 300)
                      }
                    })
                  // 如果已经注册，直接缓存用户信息
                  wx.setStorageSync('userinfo', userinfo)
                  // 保存到本地 openid
                  wx.setStorageSync('openid', openid)
                  // 保存到本地 id
                  wx.setStorageSync('id', res.data[0]._id)
                  // 缓存 登陆状态为
                  wx.setStorageSync('login_ok', true)
                  // 缓存 管理员
                  wx.setStorageSync('isAdmin', res.data[0].isAdmin)
                  // 缓存 商家
                  wx.setStorageSync('isShangjia', res.data[0].isShangjia)
                  // 缓存 积分
                  wx.setStorageSync('jifen', res.data[0].jifen)
                  this.setData({
                    jifen: res.data[0].jifen
                  })
                }

              })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
            setTimeout(function () {
              wx.hideLoading()
            }, 300)
          }
        })
        // wx.showToast({
        //   title: '登陆成功',
        // })
        this.setData({
          login_ok: true
        })

      },
      fail: err => {
        console.log('用户授权登陆 失败', err)
        setTimeout(function () {
          wx.hideLoading()
        }, 300)
        this.setData({
          login_ok: false
        })
        wx.showToast({
          icon: 'error',
          title: '未授权注册失败',
        })
      }
    })
  },
  // 退出登陆 清除缓存
  onRemoveStorage() {
    try {
      wx.clearStorageSync()
      this.setData({
        login_ok: false
      })
      console.log('清除缓存 成功')
    } catch (e) {
      console.log('清除缓存 失败', e)
    }
    // wx.removeStorage({
    //   key: 'openid',
    //   success: res => {
    //     console.log('清除缓存openid 成功', res)
    //     this.setData({
    //       login_ok: false
    //     })
    //   },
    //   fail: err => {
    //     console.log('清除缓存openid 失败', err)
    //   }
    // })
    // wx.removeStorage({
    //   key: 'userinfo',
    //   success: res => {
    //     console.log('清除缓存 userinfo 成功', res)
    //     this.setData({
    //       login_ok: false
    //     })
    //   },
    //   fail: err => {
    //     console.log('清除缓存 userinfo 失败', err)
    //   }
    // })
    // wx.removeStorage({
    //   key: 'login_ok',
    //   success: res => {
    //     console.log('清除缓存 login_ok 成功', res)
    //     this.setData({
    //       login_ok: false
    //     })
    //   },
    //   fail: err => {
    //     console.log('清除缓存 login_ok 失败', err)
    //   }
    // })
    // wx.removeStorage({
    //   key: 'jifen',
    //   success: res => {
    //     console.log('清除缓存 jifen 成功', res)
    //     this.setData({
    //       login_ok: false
    //     })
    //   },
    //   fail: err => {
    //     console.log('清除缓存 jifen 失败', err)
    //   }
    // })
    // wx.removeStorage({
    //   key: 'id',
    //   success: res => {
    //     console.log('清除缓存 id 成功', res)
    //     this.setData({
    //       login_ok: false
    //     })
    //   },
    //   fail: err => {
    //     console.log('清除缓存 id 失败', err)
    //   }
    // })
    // this.setData({
    //   avatarUrl: '../user-unlogin.png',
    // })


  },
  getPhoneNumber(e) {
    console.log('获取电话号码', e)
  },
  inputPhoneNumber(e) {
    this.setData({
      userPhoneNumber: e.detail.value
    })
    // console.log('填入的手机号码：',e.detail.value)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // // 调用函数时，传入new Date()参数，返回值是日期和时间
    // var timeNow = utils_time.formatTime(new Date());
    // // 再通过setData更改Page()里面的data，动态更新页面的数据
    // this.setData({
    //   timeNow: timeNow
    // })

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
    let openid = wx.getStorageSync('openid')
    let userinfo = wx.getStorageSync('userinfo')
    if (openid && userinfo) {
      if (userinfo.gender == '1') {
        this.setData({
          gender: '男'
        })
      }
      if (userinfo.gender == '0') {
        this.setData({
          gender: '女'
        })
      }
      this.setData({
        login_ok: true,
        nickName: userinfo.nickName,
        avatarUrl: userinfo.avatarUrl,
        // gender: userinfo.gender,
        province: userinfo.province,
        // zhuceTime: userinfo.zhuceTime,
      })
    } else {
      this.setData({
        login_ok: false
      })
    }
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