// 云函数入口文件
const cloud = require('wx-server-sdk')

// request
const request = require('request-promise')




cloud.init({
  env: 'xmf-0g87mzf198205ada'
})
const _ = cloud.database().command

// 原统一下发接口无法再使用
// const gzhDataMsg = {}
// const miniproData = {}
// miniproData.appid = 'wxaad7b42349d83506'
// miniproData.page = 'pages/wode/dingdan/dingdan?isDaiqu=true'

// gzhDataMsg.appid = 'wx83be857ba915fcc5'
// gzhDataMsg.miniprogram = miniproData


// function tuisongFwh(gzhOpenid, templateId, msgData) {
//   gzhDataMsg.templateId = templateId
//   gzhDataMsg.data = msgData
//   try {
//     cloud.openapi.uniformMessage.send({

//         "touser": gzhOpenid,
//         'mpTemplateMsg': gzhDataMsg

//       })
//       .then(res => {
//         console.log('gzh提醒：成功', res);
//         return res
//       })
//       .catch(err => {
//         console.log('gzh提醒：失败', err);
//         return err
//       })
//   } catch (err) {
//     console.log(err);
//   }
// }


async function tuisongFwh(gzhOpenid, templateId, msgData, access_token) {
  // 20230924 使用原公众号模板消息
  var gzhDataMsg = {}
  var miniproData = {}
  miniproData.appid = 'wxaad7b42349d83506'
  miniproData.page = 'pages/wode/dingdan/dingdan?isDaiqu=true'

  // gzhDataMsg.appid = 'wx83be857ba915fcc5'
  gzhDataMsg.miniprogram = miniproData
  gzhDataMsg.template_id = templateId
  gzhDataMsg.data = msgData
  gzhDataMsg.touser = gzhOpenid
  gzhDataMsg = JSON.stringify(gzhDataMsg)
  console.log('gzhDataMsg:', gzhDataMsg);

  try {
    // 公众号发送模板消息
    var url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`
    var res = await request({
      url: url,
      method: 'POST',
      json: true,
      form: gzhDataMsg,

    })
    console.log('gzh发送模板消息：成功', res);
  } catch (err) {
    console.log('gzh发送模板消息：失败', err);
  }
}



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('event', event);
  if (event.isDaiqu) {
    // 公众号发送模板消息 前先获取access_token
    var resToken = await cloud.database().collection('banner').doc('token').get()
    var access_token = resToken.data.access_token

    cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        // touser:_openid,
        page: 'pages/wode/dingdan/dingdan?isDaiqu=true',

        // 服务项目// {{phrase7.DATA}}// 订单名称// {{thing8.DATA}}// 收件人// {{name3.DATA}}// 下单时间// {{time2.DATA}}
        data: {
          // 服务项目
          phrase7: {
            value: '代取快递'
          },
          // 订单名称
          thing8: {
            value: '取货码：' + (event.qh_Ma).slice(0, 16)
          },
          // 收件人
          name3: {
            value: event.kd_Name
          },
          // 下单时间
          time2: {
            value: event.xd_time
          },

        },
        templateId: 'x7c0P8kcAQQBP5YKHMfHJsdDgnBjdG-f9jGE2aJCkAE', //下单成功提醒
        // "miniprogramState": 'developer'
      })
      .then(res => {
        console.log('下单成功提醒：成功', res);
      })
      .catch(err => {
        console.log('下单成功提醒,发送失败', err);
      })
    // return res


    var msgData = {}
    // 服务项目
    msgData.thing1 = {
      value: '取货码：' + (event.qh_Ma).slice(0, 16)
    }
    // 客户姓名
    msgData.thing2 = {
      value: event.kd_Name
    }
    // 下单时间
    msgData.time18 = {
      value: event.xd_time
    }
    var gzhOpenid = event.gzhOpenid
    if (!gzhOpenid) { //没上传
      console.log('没上传gzhOpenid');
      var res = await cloud.database().collection('union')
        .where({
          unionid: wxContext.UNIONID
        })
        .get()
      console.log('查询用户 union 记录数量', res.data.length, res)
      if (res.data.length !== 0) {
        gzhOpenid = res.data[0].gzhOpenid
        // tuisongFwh(gzhOpenid, 'ajE3hoZUtW1mAW2f60L1x6kIgxEPtcipJYA7Amk_dso', msgData)


        tuisongFwh(gzhOpenid, 'ajE3hoZUtW1mAW2f60L1x6kIgxEPtcipJYA7Amk_dso', msgData, access_token)


      }

    } else {
      console.log('已上传gzhOpenid');
      // tuisongFwh(gzhOpenid, 'ajE3hoZUtW1mAW2f60L1x6kIgxEPtcipJYA7Amk_dso', msgData)
      tuisongFwh(gzhOpenid, 'ajE3hoZUtW1mAW2f60L1x6kIgxEPtcipJYA7Amk_dso', msgData, access_token)

    }

  }


  if (event.isJijian) {
    // 公众号发送模板消息 前先获取access_token
    var resToken = await cloud.database().collection('banner').doc('token').get()
    var access_token = resToken.data.access_token

    if (event.action == '已取消') {
      var beizhu = '主动取消订单'
    } else {
      var beizhu = '请耐心等待小蜜蜂上门..'
    }
    var action = '(' + event.action + ')'
    cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        // touser:_openid,
        page: 'pages/wode/dingdan/dingdan?isJijian=true',

        // 服务项目// {{phrase7.DATA}}// 订单名称// {{thing8.DATA}}// 收件人// {{name3.DATA}}// 下单时间// {{time2.DATA}}
        data: {
          // 预约项目
          thing11: {
            value: '预约代寄' + action
          },
          // 预约时间
          date2: {
            value: event.qujDate
          },
          // 预约时段
          thing13: {
            value: event.qujTime
          },
          // 备注
          thing4: {
            value: beizhu
          },

        },
        // templateId: 'bf2y5hj6lUmAM4pSknPtR8RDtckRaRpOXFlsz6Uha9E', //预约成功通知
        templateId: 'bf2y5hj6lUmAM4pSknPtR0MuSbo3w1Bsh1qt1Z1DasM', //预约成功通知
        // "miniprogramState": 'developer'
      })
      .then(res => {
        console.log('下单成功提醒：成功', res);
      })
      .catch(err => {
        console.log('下单成功提醒,发送失败', err);
      })
    // return res

    var msgData = {}
    // 预约项目
    msgData.thing18 = {
      value: '预约代寄' + action
    }
    // 预约时间
    msgData.time23 = {
      value: event.qujDate
    }
    var gzhOpenid = event.gzhOpenid
    if (!gzhOpenid) { //没上传
      console.log('没上传gzhOpenid');
      var res = await cloud.database().collection('union')
        .where({
          unionid: wxContext.UNIONID
        })
        .get()
      console.log('查询用户 union 记录数量', res.data.length, res)
      if (res.data.length !== 0) {
        gzhOpenid = res.data[0].gzhOpenid
        // tuisongFwh(gzhOpenid, '_LIx-uWcJx-GpOM9Dg_zl1CY27Ecvx-NCspZt_4jTQk', msgData) //预约成功通知
        tuisongFwh(gzhOpenid, '_LIx-uWcJx-GpOM9Dg_zl1CY27Ecvx-NCspZt_4jTQk', msgData, access_token) //预约成功通知

      }

    } else {
      console.log('已上传gzhOpenid');
      // tuisongFwh(gzhOpenid, '_LIx-uWcJx-GpOM9Dg_zl1CY27Ecvx-NCspZt_4jTQk', msgData)
      tuisongFwh(gzhOpenid, '_LIx-uWcJx-GpOM9Dg_zl1CY27Ecvx-NCspZt_4jTQk', msgData, access_token) //预约成功通知

    }


  }
  if (event.isPaotui) {
    cloud.openapi.subscribeMessage.send({
        touser: event.openid,
        page: 'pages/wode/dingdan/dingdan?isPaotui=true',

        // 服务项目// {{phrase7.DATA}}// 订单名称// {{thing8.DATA}}// 收件人// {{name3.DATA}}// 下单时间// {{time2.DATA}}
        data: {
          // 服务项目
          phrase7: {
            value: '跑腿'
          },
          // 订单名称
          thing8: {
            value: event.xuqiu_slice
          },
          // 收件人
          name3: {
            value: event.paotui_name
          },
          // 下单时间
          time2: {
            value: event.xd_time
          },

        },
        templateId: 'x7c0P8kcAQQBP5YKHMfHJsdDgnBjdG-f9jGE2aJCkAE', //下单成功提醒
        // "miniprogramState": 'developer'
      })
      .then(res => {
        console.log('下单成功提醒：成功', res);
      })
      .catch(err => {
        console.log('下单成功提醒,发送失败', err);
      })
    // return res
  }
  if (event.isTuikuan_daiqu) {
    cloud.database().collection('banner').doc('adminopenidlist0001').get()
      .then(res => {
        var openidList = res.data.openidList
        openidList.forEach(element => {
          var openid = element.openid
          cloud.openapi.subscribeMessage.send({
              touser: openid, //仅发送给指定 管理员openid 用户申请退款
              // touser:_openid,
              page: 'pages/xuanzq/xuanzq',
              data: {
                // 预约项目
                thing3: {
                  value: '退款申请:' + (event.qh_Ma).slice(0, 15)
                },
                // 预约时间段
                character_string10: {
                  value: '-'
                },
                // 预约地点
                thing15: {
                  value: event.sd_Didian
                },
                // 预约人
                thing9: {
                  value: event.kd_Name
                },
                // 电话
                phone_number13: { //状态
                  value: event.kd_PhoNum
                },
              },
              templateId: 'WgZ1KHx64XOYlQEzwmjiXIBdSA_-iKaih6Hhli8rH_Y', //预约提醒
              // "miniprogramState": 'developer'
            })
            .then(res => {
              console.log('退款：成功', element.nickname, res);
              //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
              cloud.database().collection('user')
                .where({
                  _openid: openid //管理员的openid
                })
                .update({
                  data: {
                    dingyue: _.shift() //删除数组的第一个元素
                  }
                })
                .then(res => {
                  console.log('dingyue 删除数组,成功', res);
                })
                .catch(err => {
                  console.log('dingyue 删除数组,失败', err);
                })
            })
            .catch(err => {
              console.log('退款通知,发送失败', element.nickname, err);
            })

        })
      })
      .catch(err => {
        console.log('查管理员列表失败');
      })
  }
  if (event.isTuikuan_meishi) {

    var openid = event.openid //商家的openid
    cloud.openapi.subscribeMessage.send({
        touser: openid,
        page: 'pages/shangjia/shangjia',
        data: {
          // 订单编号
          character_string1: {
            value: dingdanhao
          },
          // 订单内容
          thing2: {
            value: dingdanhao
          },
          // 订单金额
          amount3: {
            value: dingdanhao
          },
          // 申请时间
          time6: {
            value: dingdanhao
          },
          // 备注
          thing7: {
            value: dingdanhao
          },
        },
        templateId: '-G6RVeu03oB7Lcapnq4YXj5AME_RnuRoR6rZy3uyKdo', //退款申请通知
        // "miniprogramState": 'developer'
      })
      .then(res => {
        console.log('退款通知：成功', res);
        //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
        cloud.database().collection('user')
          .where({
            _openid: openid //商家的openid
          })
          .update({
            data: {
              dingyue: _.shift() //删除数组的第一个元素
            }
          })
          .then(res => {
            console.log('dingyue 删除数组,成功', res);
          })
          .catch(err => {
            console.log('dingyue 删除数组,失败', err);
          })
      })
      .catch(err => {
        console.log('退款通知,发送失败', element.nickname, err);
      })



  }
  if (event.isTixian_meishi) { //提现申请提醒
    cloud.database().collection('banner').doc('adminopenidlist0001').get()
      .then(res => {
        var openidList = res.data.openidList
        openidList.forEach(element => {
          var openid = element.openid
          cloud.openapi.subscribeMessage.send({
              touser: openid, //仅发送给指定 管理员openid 用户申请退款
              // touser:_openid,
              page: 'pages/xuanzq/xuanzq',
              data: {
                // 预约项目
                thing3: {
                  value: '提现申请:' + '¥' + event.val_tixian
                },
                // 预约时间段
                character_string10: {
                  value: '-'
                },
                // 预约地点
                thing15: {
                  value: '无'
                },
                // 预约人
                thing9: {
                  value: event.value_name
                },
                // 电话
                phone_number13: { //状态
                  value: event.value_phone
                },
              },
              templateId: 'WgZ1KHx64XOYlQEzwmjiXIBdSA_-iKaih6Hhli8rH_Y', //预约提醒
              // "miniprogramState": 'developer'
            })
            .then(res => {
              console.log('提现申请提醒成功', element.nickname, res);
              //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
              cloud.database().collection('user')
                .where({
                  _openid: openid //管理员的openid
                })
                .update({
                  data: {
                    dingyue: _.shift() //删除数组的第一个元素
                  }
                })
                .then(res => {
                  console.log('dingyue 删除数组,成功', res);
                })
                .catch(err => {
                  console.log('dingyue 删除数组,失败', err);
                })
            })
            .catch(err => {
              console.log('提现申请通知,发送失败', element.nickname, err);
            })

        })
      })
      .catch(err => {
        console.log('查管理员列表失败');
      })
  }

// 问题件推送到 指定区域 的管理员微信
  if (event.isWenti) {  
    var {datas} = event
    // 公众号发送模板消息 前先获取access_token
    var resToken = await cloud.database().collection('banner').doc('token').get()
    var access_token = resToken.data.access_token

    var res_openid = await cloud.database().collection('banner').doc('adminopenidlist0002').get()  // 公众号openid
    var openidList = res_openid.data.openidList

    for (let index = 0; index < openidList.length; index++) {
      const gzhOpenid = openidList[index].gzhOpenid;
      const quyu = openidList[index].quyu   //管理员负责的区域

      // 发送公众号消息================
      var msgData = {}
      // 订单号
      msgData.character_string2 = {
        value: datas._id
      }
      // 异常原因
      msgData.thing4 = {
        // value: datas.qh_Ma
        value: (datas.wt_yuanyin).slice(0,20)
      }
      // 公司名称
      msgData.thing8 = {
        value: (datas.kd_Name+datas.kd_PhoNum).slice(0,20)
      }
      // 订单派送司机
      msgData.thing9 = {
        // value: '工号：'+datas.gonghao
        value: ('取货码：'+datas.qh_Ma).slice(0,20)

      }
      // 订单城市
      msgData.thing10 = {
        value: (datas.sd_Didian).slice(0,20)
      }

      if (datas.sd_Didian.indexOf(quyu)!==-1||datas.kd_Dian.indexOf(quyu)!==-1) {
        console.log('quyu按：',quyu);
        // tuisongFwh(gzhOpenid, 'ajE3hoZUtW1mAW2f60L1x6kIgxEPtcipJYA7Amk_dso', msgData, access_token) // 下单成功通知
        tuisongFwh(gzhOpenid, 'QIbpzsbwO96yEnJkxrNHnO-I21KGFNkUvYyzGR7fVjU', msgData, access_token) // 订单异常通知
      }
      if (quyu == '全部') {
        console.log('quyu按全部发送：',quyu);

        tuisongFwh(gzhOpenid, 'QIbpzsbwO96yEnJkxrNHnO-I21KGFNkUvYyzGR7fVjU', msgData, access_token) // 订单异常通知
        
      }



    }


  }

}