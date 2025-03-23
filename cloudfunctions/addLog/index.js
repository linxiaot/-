// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { content } = event

  try {
    const result = await db.collection('operation_logs').add({
      data: {
        _openid: wxContext.OPENID,
        content,
        createTime: db.serverDate()
      }
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