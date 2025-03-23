const app = getApp()

Page({
  data: {
    logs: [],
    loading: false
  },

  onLoad() {
    this.fetchLogs()
  },

  // 获取日志记录
  async fetchLogs() {
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({
        name: 'getLogs',
        data: {
          limit: 50  // 最多显示最近50条记录
        }
      })
      
      if (res.result && res.result.data) {
        // 处理时间格式
        const logs = res.result.data.map(log => ({
          ...log,
          createTime: new Date(log.createTime).toLocaleString(),
        }))
        this.setData({ logs })
      }
    } catch (err) {
      wx.showToast({
        title: '获取日志失败',
        icon: 'none'
      })
      console.error('获取日志失败:', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  // 下拉刷新
  async onPullDownRefresh() {
    await this.fetchLogs()
    wx.stopPullDownRefresh()
  }
}) 