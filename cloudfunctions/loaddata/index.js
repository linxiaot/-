// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xmf-0g87mzf198205ada'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.loaddataType == 'zufang') {
    return await cloud.database().collection(event.loaddataType).where(
        event.where
      )
      .orderBy('xd_time', 'desc')
      // .skip((event.pageNum - 1) * 20)
      //   .skip(event.pageNum * 100)
      .get()
      .then(res => {
        console.log('[云函数] ', event.loaddataType, '成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] ', event.loaddataType, '失败：', err)
        return err
      })
  }
  if (event.loaddataType == 'tuikuan_jilu') {
    var res_count = await db.collection('tuikuan').where({
        isYunxu_tuikuan: true,
        tenant_id: event.tenant_id
      })
      .orderBy('xd_time', 'desc')
      .count()
    console.log('有多少数量', res_count.total);
    if (res_count.total >= 100) {
      res_count.total = 100
    }
    var pageNum = Math.ceil(res_count.total / 100) //向上取整
    var chaxunList = []
    for (let index = 0; index < pageNum; index++) {
      var res = await db.collection('tuikuan').where({
          isYunxu_tuikuan: true,
          tenant_id: event.tenant_id
        })
        .orderBy('xd_time', 'desc')
        .skip(index * 100)
        .get()
      res.data.forEach(element => {
        chaxunList.push(element)
      });
    }
    console.log('chaxunList长度', chaxunList.length);
    return chaxunList

    // return await cloud.database().collection('tuikuan').where({
    //     isYunxu_tuikuan: true,
    //   })
    //   .skip(event.tuikuan_pageNum * 100)
    //   // .skip((index * 20)+100*(tuikuan_pageNum-1))
    //   // .skip((event.pageNum - 1) * 20)
    //   .orderBy('tk_time', 'desc')
    //   .get()
    //   .then(res => {
    //     console.log('下载退款记录成功：', res)
    //     return res.data
    //   })
    //   .catch(err => {
    //     console.log('下载退款记录失败：', err)
    //     return err
    //   })
  }
}