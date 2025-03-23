const logger = {
  /**
   * 记录操作日志
   * @param {string} operation - 操作类型（如：create, update, delete等）
   * @param {string} content - 操作内容描述
   * @param {string} module - 操作模块（如：代取, 寄件等）
   * @param {string} result - 操作结果
   */
  async log(operation, content, module, result = 'success') {
    try {
      const res = await wx.cloud.callFunction({
        name: 'operationLog',
        data: {
          operation,
          content,
          module,
          result
        }
      })
      return res.result
    } catch (err) {
      console.error('记录操作日志失败:', err)
      return {
        success: false,
        error: err
      }
    }
  },

  // 预设一些常用的操作类型
  operations: {
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    QUERY: 'query',
    SUBMIT: 'submit'
  },

  // 预设模块名称
  modules: {
    PROXY_PICKUP: '代取',
    PARCEL: '寄件',
    AD: '广告',
    REFUND: '退款',
    OTHER: '其他'
  }
}

module.exports = logger 