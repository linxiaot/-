
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init('xmf-0g87mzf198205ada')

// 云函数入口函数
exports.main = async (event, context) => {
  const _ = cloud.database().command
  if (event.isDaiqu) {
    return await cloud.database().collection('daiqu').where({
      xd_time: _.lte(event.dateEnd).gte(event.dateStart),
      dd_Status:'0'
      })
      .orderBy('xd_time', 'desc')
      // .skip((event.pageNum - 1) * 20)
      .skip(event.pageNum * 100)
      .get() 
      .then(res => {
        console.log('[云函数] [daiqu] 查询 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [daiqu] 查询 失败：', err)
        return err
      })
  } else if (event.isCountDaiqu) { //查询总数
    return await cloud.database().collection('daiqu').where({
        xd_time: _.lte(event.dateEnd).gte(event.dateStart)
      })
      .count()
      .then(res => {
        console.log('[云函数] [daiqu]count 查询 成功：', res)
        return res.total
      })
      .catch(err => {
        console.log('[云函数] [daiqu]count 查询 失败：', err)
        return err
      })
  } else if (event.isCountDaiqu == false) {
    return await cloud.database().collection('jijian').where({
      xd_time: _.lte(event.dateEnd).gte(event.dateStart),
      dd_Status: _.lt('3'),
      
      })
      .count()
      .then(res => {
        console.log('[云函数] [jijian]count 查询 成功：', res)
        return res.total
      })
      .catch(err => {
        console.log('[云函数] [jijian]count 查询 失败：', err)
        return err
      })
  } else if (event.isDaiqu == false){
    return await cloud.database().collection('jijian').where({
      xd_time: _.lte(event.dateEnd).gte(event.dateStart),
      dd_Status: _.lt('3'),
      })
      .orderBy('xd_time', 'desc')
      // .skip((event.pageNum - 1) * 20)
      .get()
      .then(res => {
        console.log('[云函数] [jijian] 查询 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [jijian] 查询 失败：', err)
        return err
      })
  }
}