const logger = require('../../utils/logger')

Page({
  data: {
    startTime: '2025-03-21 18:00',
    endTime: '2025-03-22 14:00'
  },

  // 查询操作
  async onQuery() {
    await logger.log(
      logger.operations.QUERY,
      '查询代取订单',
      logger.modules.PROXY_PICKUP
    )
    // 执行查询逻辑
  },

  // 提交寄件通知
  async onSubmitNotification() {
    await logger.log(
      logger.operations.SUBMIT,
      '提交寄件通知',
      logger.modules.PROXY_PICKUP
    )
    // 执行提交通知逻辑
  },

  // 更新时间
  async onUpdateTime(newStartTime, newEndTime) {
    await logger.log(
      logger.operations.UPDATE,
      `更新时间范围：${newStartTime} - ${newEndTime}`,
      logger.modules.PROXY_PICKUP
    )
    // 执行更新时间逻辑
  },

  // 查看日志
  onViewLogs() {
    wx.navigateTo({
      url: '/pages/logs/index'
    })
  }
}) 