// 操作日志云函数
const cloud = require('wx-server-sdk')
const logger = require('../../utils/logger')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { 
    operation, // 操作类型
    content,   // 操作内容
    module,    // 操作模块
    result     // 操作结果
  } = event

  const wxContext = cloud.getWXContext()
  
  try {
    // 记录操作日志
    const logData = {
      openid: wxContext.OPENID,        // 操作者openid
      unionid: wxContext.UNIONID,      // 操作者unionid
      operation: operation,            // 操作类型
      content: content,                // 操作内容
      module: module,                  // 操作模块
      result: result,                  // 操作结果
      ip: event.userInfo.clientIP,     // 操作者IP
      createTime: db.serverDate(),     // 操作时间
      appid: wxContext.APPID          // 小程序APPID
    }

    const result = await db.collection('operation_logs').add({
      data: logData
    })

    return {
      success: true,
      data: result
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
} 