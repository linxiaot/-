// 获取操作日志云函数
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { limit = 50 } = event
  const wxContext = cloud.getWXContext()
  
  try {
    // 获取当前用户的操作日志
    const result = await db.collection('operation_logs')
      .where({
        openid: wxContext.OPENID // 只获取当前用户的日志
      })
      .orderBy('createTime', 'desc') // 按时间倒序
      .limit(limit)
      .get()

    return {
      success: true,
      data: result.data
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
} 