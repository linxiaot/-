// pages/qiang/pinche/pinche.js
let login_ok = wx.getStorageSync('login_ok')
// 从缓存数据重获取 信息 用户是否登录
let userinfo = wx.getStorageSync('userinfo')
let openid = wx.getStorageSync('openid')
// let pincheRen = {}


Page({

  data: {

    avatarUrl: '../../../images/user-unlogin.png',
    nickName: '张三',
    disabled: false,
    phoneNumber: '19999999999',
    // nowNum: 0
  },

  // 拼车变数 图像被选中
  toPinChe(e) {
    console.log('点击拼车 获取的数据', e)
    // 判断用户是否登录
    this.checkLogin()
    //  获取 nowNum 和 needNum 及 id
    let id= e.currentTarget.id
    let pinche = e.currentTarget.dataset.pinche
    let pincheRen = pinche.pincheRen
    let imageUrl = this.data.imageUrl
    let needNum = pinche.pincheNum.needNum
    // let login_ok = true//先写死了
    this.setData({
      nowNum: pinche.pincheRen.length,
    })
    let nowNum = this.data.nowNum
    if (pincheRen){
      console.log('pincheRen = ',pincheRen);
    }
    if (nowNum < needNum && login_ok == true) {
      this.setData({
        nowNum: this.data.nowNum + 1,
      })
      //
      // 云函数 更新 拼车人数
      // 云函数 新增 拼车人信息
      // console.log('缓存中的 姓名 是：',userinfo.nickName);
      let pincheRen_item = {}
      pincheRen_item.avatarUrl = userinfo.avatarUrl
      pincheRen_item.nickName = userinfo.nickName
      pincheRen_item.phoneNumber = this.data.phoneNumber
      pincheRen.push(pincheRen_item)
     
      console.log('组合后的拼车人信息：',pincheRen)
      wx.cloud.callFunction({
          name: 'pinche',
          data: { 
            id: e.currentTarget.id,
            pincheNum: {
              nowNum: this.data.nowNum,
            },
            pincheRen: pincheRen
          }
        })
        .then(res => {
          console.log('云函数 更新 拼车信息 成功', res)
          // 即时更新 云端数据 列表渲染到前端
          wx.cloud.database().collection('pinche').get({
            success: res => {
              console.log('云数据 请求成功 拼车列表：', res.data)
              this.setData({
                pincheList: res.data,
              })
            }
          })
        })
        .catch(err => {
          console.log('云函数 更新 拼车人数 失败', err)
        })

    }

  },
  // 判断用户是否登录
  checkLogin() {
    if (login_ok) {
      console.log('缓存数据 获取成功 用户已登录', userinfo)
    } else {
      console.log('缓存数据 userinfo 不存在 需授权')
      wx.showToast({
        icon: 'error',
        title: '请先授权登陆',
        duration:1000
      })
      wx.navigateTo({
        url: '../../wode/ziliao/ziliao',
      })
    }
  },

  onShow: function () {

    // 云端 下载 拼车信息

    wx.cloud.database().collection('pinche').get({
      success: res => {
        console.log('[页面显示] [云数据] 请求成功 拼车列表：', res.data)
        this.setData({
          pincheList: res.data
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})