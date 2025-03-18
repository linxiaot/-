// pages/campus/campus.js
const app = getApp()

Page({
  data: {
    campusList: [],
    selectedCampus: null
  },

  onLoad: function() {
    // 检查是否已经选择过校区
    const selectedCampus = wx.getStorageSync('selectedCampus')
    if (selectedCampus) {
      this.setData({
        selectedCampus
      })
    }
    
    // 从云数据库获取校区列表
    this.fetchCampusList()
  },

  // 获取校区列表
  fetchCampusList: function() {
    wx.showLoading({
      title: '加载中',
    })
    
    const db = wx.cloud.database()
    db.collection('tenant').get()
      .then(res => {
        console.log('获取校区列表成功', res.data)
        if (res.data && res.data.length > 0) {
          this.setData({
            campusList: res.data
          })
          
          // 如果没有选择过校区，默认选择第一个
          if (!this.data.selectedCampus && res.data.length > 0) {
            const firstCampus = res.data[0]
            this.setData({
              selectedCampus: firstCampus
            })
          }
        } else {
          wx.showToast({
            title: '暂无校区数据',
            icon: 'none'
          })
        }
      })
      .catch(err => {
        console.error('获取校区列表失败：', err)
        wx.showToast({
          title: '获取校区列表失败',
          icon: 'none'
        })
      })
      .finally(() => {
        wx.hideLoading()
      })
  },

  // 选择校区
  selectCampus: function(e) {
    const campus = e.currentTarget.dataset.campus
    this.setData({
      selectedCampus: campus
    })
    
    // 保存选择的校区到本地存储
    wx.setStorageSync('selectedCampus', campus)
    wx.setStorageSync('currentTenantId', campus._id)
    
    // 同步tenant_id到系统，使用code字段作为tenant_id
    if (campus.code) {
      wx.setStorageSync('tenant_id', campus.code)
      console.log('选择校区已同步tenant_id:', campus.code)
    }
    
    // 更新全局数据
    app.globalData.currentTenant = campus
    
    // 跳转到主页面
    wx.switchTab({
      url: '/pages/shouye/shouye'
    })
  }
}) 