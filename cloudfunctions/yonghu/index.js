// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.jifen) {
    return await cloud.database().collection('user').doc(event.id)
    // return await cloud.database().collection('user').doc(event._openid)
      .update({
        data: {
          // jifen: event.jifen,
          jifen: _.addToSet(event.jifen),
        }
      })  
      .then(res => {
        console.log('[云函数] [积分] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [积分] 更新 失败：', err)
        return err
      }) 
  }
  if (event.dingyue) {
    return await cloud.database().collection('user').doc(event.id)
    // return await cloud.database().collection('user').doc(event.openid)
      .update({
        data: {
          dingyue: _.addToSet(event.dingyue),
        }
      })  
      .then(res => {
        console.log('[云函数] [yonghu][dingyue] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [yonghu][dingyue] 更新 失败：', err)
        return err
      }) 
  }
}