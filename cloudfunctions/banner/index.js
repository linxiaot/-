// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const _ = cloud.database().command
  if (event.action == 'toptips') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data:{
          text:event.text,
          isToptips:event.isToptips
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 查询 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 查询 失败：', err)
        return err
      })
    }
  if (event.action == 'Toptips_text') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data:{
          text:event.text,
          // isToptips:event.isToptips
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 查询 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 查询 失败：', err)
        return err
      })
    }
  if (event.action == 'toShixiang') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data:{
          shiXiang_1:event.shiXiang_1,
          shiXiang_2:event.shiXiang_2,
          shiXiang_3:event.shiXiang_3,
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 查询 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 查询 失败：', err)
        return err
      })
    }
  if (event.action == 'toXuanzq') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data:{
          isXzq_1:event.isXzq_1,
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 查询 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 查询 失败：', err)
        return err
      })
    }
}