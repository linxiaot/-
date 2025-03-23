const app = getApp()

Page({
  data: {
    logList: []
  },

  onLoad: function () {
    console.log('日志页面加载')
    this.getLogList()
  },

  getLogList: function () {
    console.log('开始获取日志列表')
    const db = wx.cloud.database()
    const _ = db.command
    const openid = wx.getStorageSync('openid')
    console.log('当前用户openid:', openid)
    
    db.collection('operation_logs')
      .where({
        _openid: openid
      })
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        console.log('获取日志成功:', res.data)
        const logList = res.data.map(item => {
          return {
            ...item,
            createTime: this.formatTime(item.createTime)
          }
        })
        this.setData({
          logList
        })
      })
      .catch(err => {
        console.error('获取日志失败：', err)
        wx.showToast({
          title: '获取日志失败',
          icon: 'none'
        })
      })
  },

  formatTime: function (date) {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hour = d.getHours()
    const minute = d.getMinutes()
    const second = d.getSeconds()

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
}) 