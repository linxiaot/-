// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('pinche').doc(event.id)
    .update({
      data: {
        pincheNum: event.pincheNum,
        pincheRen: event.pincheRen
      }
    })
    .then(res => {
      console.log('[云函数] 拼车人数 更新 成功：', res)
      return res
    })
    .catch(err => {
      console.log('[云函数] 拼车人数 更新 失败：', err)
      return err
    })


}