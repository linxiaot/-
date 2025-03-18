// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xmf-0g87mzf198205ada'
})
const db = cloud.database()
const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  if (event.jifen) {
    return await cloud.database().collection('user').doc(event.id)
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
  if (event.getphone) {
    var res = await cloud.getOpenData({
      list: [event.cloudID]
    })
    return res
  }
  if (event.dingyue) {
    return await cloud.database().collection('user').doc(event.id)
      // return await cloud.database().collection('user').doc(event.openid)
      .update({
        data: {
          // dingyue: _.addToSet(event.dingyue),
          dingyue: _.push(event.dingyue),
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
  if (event.kebiao) {
    return await cloud.database().collection('kebiao').where({
        _openid: event.openid
      })
      .get()
      .then(res => {
        console.log('[云函数] [yonghu][kebiao] 查询 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [yonghu][kebiao] 查询 失败：', err)
        return err
      })
  }
  if (event.lookuserinfo) {
    return await cloud.database().collection('user').where({
        _openid: event._openid
      })
      // return await cloud.database().collection('user').doc(event._openid)
      .get()
      .then(res => {
        console.log('lookuserinfo 成功：', res)
        return res
      })
      .catch(err => {
        console.log('lookuserinfo 失败：', err)
        return err
      })
  }
  if (event.qiandaoData) {
    return await cloud.database().collection('user').doc(event.qiandaoData.id)
      .update({
        data: {
          qiandao: event.qiandaoData.qiandao,
          jifen: _.addToSet(event.qiandaoData.jifen),
        }
      })
      .then(res => {
        console.log('[积分,qiandao] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[积分,qiandao] 更新 失败：', err)
        return err
      })
  }
  if (event.chongzhi) {
    // console.log('充值记录添加成功');
    var _openid = event._openid
    var totalFee_m = event.totalFee / 100
    var dingdanhao = event.dingdanhao
    var xd_time = event.xd_time
    var money_fengmi = 0
    console.log(totalFee_m);
    db.collection('banner').doc('toptipsdaiqu').get().then(res => {
      var chongzhi_moneylist = res.data.chongzhi_moneylist
      console.log(chongzhi_moneylist);
      chongzhi_moneylist.forEach(element => {
        console.log(element.money);
        
        if (element.money == totalFee_m) {
          money_fengmi = element.money_fengmi
        }
      });
      console.log(money_fengmi);
      db.collection('user').where({
        _openid,
      }).get().then(res => {
        var id = res.data[0]._id
        var balance_res = res.data[0].balance
        // 充值记录
        var balance_jilu = {
          jilu_name: '充值',
          // jilu_num: totalFee,
          jilu_num: money_fengmi,
          jilu_time: xd_time
        }
        // var balance = totalFee + balance_res
        var balance = money_fengmi + balance_res
        db.collection('user').doc(id)
          .update({
            data: {
              balance,
              balance_jilu: _.addToSet(balance_jilu),
            }
          })
          .then(res2 => {
            console.log('[余额记录] 更新 成功：', res2.stats.updated)
            db.collection('chongzhi').where({
                dingdanhao,
              }).update({
                data: {
                  dd_Status: '0'
                }
              }).then(res3 => {
                console.log('[充值订单状态] 更新 成功：', res3.stats.updated)
              })
              .catch(err3 => {
                console.log('[充值订单状态] 更新 失败：', err3)

              })
          })
          .catch(err2 => {
            console.log('[余额记录] 更新 失败：', err2)
          })


      })
    })

  }
}