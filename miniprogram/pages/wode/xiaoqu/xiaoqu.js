const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    tenantList: [],
    currentTenantId: 'd32b57ff67d908a5000e2dc05cea1825'
  },

  onLoad: function () {
    this.getTenantList()
    // 从本地存储获取当前选择的校区
    const currentTenantId = wx.getStorageSync('currentTenantId') || ''
    this.setData({
      currentTenantId
    })
  },

  getTenantList: function() {
    wx.showLoading({
      title: '加载中',
    })
    
    // 从云数据库获取校区列表
    db.collection('tenant').get().then(res => {
      console.log('获取校区列表成功', res.data)
      this.setData({
        tenantList: res.data
      })
      
      // 如果没有选择过校区，默认选择第一个
      if (!this.data.currentTenantId && res.data.length > 0) {
        this.setData({
          currentTenantId: res.data[0]._id
        })
        wx.setStorageSync('currentTenantId', res.data[0]._id)
        app.globalData.currentTenant = res.data[0]
      } else {
        // 找到当前校区的完整信息
        const currentTenant = res.data.find(item => item._id === this.data.currentTenantId)
        if (currentTenant) {
          app.globalData.currentTenant = currentTenant
        }
      }
      
      wx.hideLoading()
    }).catch(err => {
      console.error('获取校区列表失败', err)
      wx.hideLoading()
      wx.showToast({
        title: '获取校区列表失败',
        icon: 'none'
      })
    })
  },

  selectXiaoqu: function (e) {
    const tenantId = e.currentTarget.dataset.id
    
    // 找到当前选择的校区完整信息
    const selectedTenant = this.data.tenantList.find(item => item._id === tenantId)
    if (!selectedTenant) return
    
    this.setData({
      currentTenantId: tenantId
    })
    
    // 保存选择的校区到本地存储
    wx.setStorageSync('currentTenantId', tenantId)
    
    // 更新全局数据
    app.globalData.currentTenant = selectedTenant
    
    // 同步tenant_id到旧系统，使用code字段作为tenant_id
    if (selectedTenant.code) {
      wx.setStorageSync('tenant_id', selectedTenant.code)
      console.log('校区切换已同步tenant_id:', selectedTenant.code)
    }
    
    // 显示成功提示
    wx.showToast({
      title: '校区切换成功',
      icon: 'success',
      duration: 2000
    })
    
    // 返回上一页
    setTimeout(() => {
      wx.navigateBack()
    }, 2000)
  }
}) 