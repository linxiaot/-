var openid = wx.getStorageSync('openid')

Page({

  data: {
    login_ok: false,
    avatarUrl: '',
    // 未登录头像
    Url: 'https://xmf-0g87mzf198205ada-1305629196.tcloudbaseapp.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%85%8D%E7%BD%AE%E5%9B%BE%E7%89%87/touxiang.png?sign=10dbd2f842a9b3fcdb865ca28974d60d&t=1618579789',
    jifen_total: 0,
    guanliUrl: '../xuanzq/xuanzq',
    tips: '请稍后', 
    showLoading: false,
    animated: true

  },
  toZiliao: function () {
    wx.navigateTo({
      url: '../wode/ziliao/ziliao',
    })
  },
  toJifen() {
    let jifen_total = this.data.jifen_total
    wx.navigateTo({
      url: '../wode/jifen/jifen?jifen_total=' + jifen_total,
    })
  },
  toRefresh: function () {
    console.log('点击刷新');
    this.setData({
      showLoading: true
    })
    // wx.startPullDownRefresh()
    // 查询积分
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
          jifen_total: jifen_total,
          // 结束刷新
          showLoading: false
        })
        console.log('[点击刷新] 查询用户数据 [积分] 成功:', jifen);
        // 缓存 积分
        wx.setStorageSync('jifen', jifen)

      })
      .catch(err => {
        console.log('[点击刷新] 查询用户数据 [积分] 失败:', err);
      })

  },

  onShow: function () {
    // let openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var login_ok = wx.getStorageSync('login_ok')
    if (openid && userinfo) {
      console.log('onshow 用户有登陆');
      this.setData({
        login_ok: login_ok,
        nickName: userinfo.nickName,
        avatarUrl: userinfo.avatarUrl
      })
    } else {
      this.setData({
        login_ok: false,
        // avatarUrl: '../wode/user-unlogin.png'
      })
    }

  },
  // 在线获取积分
  onLoad: function (options) {
    console.log('页面加载');
    // 查询积分
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
          jifen_total: jifen_total
        })
        console.log('查询用户数据 [积分]:', jifen);
        // 缓存 积分
        // wx.setStorageSync('jifen', jifen)

      })
      .catch(err => {
        console.log('查询用户数据 [积分] 失败:', err);
      })
  },

  toDingyue() {
    var id = wx.getStorageSync('id')
    // var openid = wx.getStorageSync('openid')
    var templateId = 'C0_vnn8_qAuO0uvzTqCsXasoGQroLsCOA9a1VMyKW0w'//物流状态
    // var templateId = 'sEx2DfBJQhWRum4C2TMC4dvEp9D-ZK9CmtsTVzDmBM4'//订单状态提醒
    var dingyue = {
      templateId:templateId,
      times:5
    }
    wx.requestSubscribeMessage({
      tmplIds: [templateId,'sEx2DfBJQhWRum4C2TMC4dvEp9D-ZK9CmtsTVzDmBM4'],
      success(res) {
        console.log('用户点击订阅消息，获得信息：',res);
        // 在数据库中更新订阅条数
        wx.cloud.callFunction({
          name: 'yonghu',
          data: {
            // openid: openid,
            id: id,
            dingyue: dingyue
          }
        })
        .then(res => {
          console.log('[云函数] [yonghu][dingyue] 更新 成功几条：', res.result.stats.updated)
        })
        .catch(err => {
          console.log('[云函数] [yonghu][dingyue] 更新 失败：', err)
        })
      }
    })
  },
  toTuisong() {
    wx.cloud.callFunction({
      name: 'tuisong',
      data: {
      }
    })
    .then(res => {
      console.log('tuisong', res)
      // console.log('webhook.openid:', res.result.data[0]._openid)
    })
  },
  towebhook() {
    wx.cloud.callFunction({
      name: 'webhook',
      data: {
      }
      
    })
    .then(res => {
      console.log('webhook', res)
      // console.log('webhook.openid:', res.result.data[0]._openid)
    })

  },
  toJianting(){
    const _ = wx.cloud.database().command
    wx.cloud.database().collection('jijian').where({
      // _openid: 'ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4' // 填入当前用户 openid
      _id: _.exists(true)
    })
    .watch({
      onChange: function (snapshot) {
        console.log('[寄件] 有更新snapshot', snapshot)
        wx.cloud.callFunction({
          name:'tuisong'
        })
      },
      onError: function (err) {
        console.error('监听函数因错误而停止', err)
      }
    })
  }
})