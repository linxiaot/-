// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const _ = cloud.database().command
  if (event.isDaiqu) {
    return await cloud.database().collection('daiqu').where({
        xd_time: _.lte(event.dateEnd).gte(event.dateStart)
      })
      .orderBy('xd_time', 'desc')
      // .skip((event.pageNum - 1) * 20)
      .get()
      .then(res => {
        console.log('[云函数] [excel] 查询 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [excel] 查询 失败：', err)
        return err
      })
    } else {
      return await cloud.database().collection('jijian').where({
          xd_time: _.lte(event.dateEnd).gte(event.dateStart)
        })
        .orderBy('xd_time', 'desc')
        // .skip((event.pageNum - 1) * 20)
        .get()
        .then(res => {
          console.log('[云函数] [excel] 查询 成功：', res)
          return res
        })
        .catch(err => {
          console.log('[云函数] [excel] 查询 失败：', err)
          return err
        })
      
  }
}