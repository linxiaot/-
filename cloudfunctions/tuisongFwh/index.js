// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise')

cloud.init({
  env: 'xmf-0g87mzf198205ada'
}) // 使用当前云环境

async function tuisongFwh(gzhOpenid, templateId, msgData, access_token, pagePath) {

  // 20230924 使用原公众号模板消息
  var gzhDataMsg = {}
  var miniproData = {}
  miniproData.appid = 'wxaad7b42349d83506'
  // miniproData.page = 'pages/wode/dingdan/dingdan?isDaiqu=true'
  miniproData.pagePath = pagePath

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
    return res

  } catch (err) {
    console.log('gzh发送模板消息：失败', err);
    return err

  }
}

const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('tuisongfwh:', event);
  const wxContext = cloud.getWXContext()
  console.log('wxContext', wxContext);
  // return wxContext
  var {
    OPENID,
    UNIONID
  } = wxContext


  // jifen数组异常，为object，查询此数据后变更为数组list   可用====
  var res = await db.collection('user')
    .aggregate()
    // .group({
    //   _id:'$_id',
    //   jifen: $.push('$jifen')
    // })
    .project({
      // totalJifen: $.gt([$.size('$jifen'),50])
      isarr: $.isArray('$jifen'),
    })
    .match({
      isarr: _.eq(false)
    })
    .limit(100)
    .end()

  // console.log(res);
  // console.log(res.list);
  var idList = []

  res.list.forEach(element => {
    idList.push(element._id)
  });
  console.log(idList);
  res2 = await db.collection('user').where({
      _id: _.in(idList)
    })
    .get()

  // res2.data.forEach(element => {
  //   jifenObject = element.jifen
  //   jifenArr = [jifenObject]
  //   // db.collection('user').doc('7027b65465897d3104ba25104be529bd')
  //   db.collection('user').doc(element._id)
  //     .update({
  //       data: {
  //         jifen: _.set(jifenArr),
  //       }
  //     })
  //     .then(res3=>{
  //       console.log(element._id);
  //     })
  //     .catch(err=>{
  //       console.log('shibai',element._id);
  //     })
  // });

  return {
    idList,
    res2
  }



  // // 测试主动获取公众号 openid 对应的 unionid oQTTs6dGk2svgin4M3ZkFhnn_CR8
  // var gzhOpenid = 'oWfLu6sars193VYX9XXWIaoQixfA'
  // var resToken = await cloud.database().collection('banner').doc('token').get()
  // var access_token = resToken.data.access_token
  // // var url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`
  // var url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${gzhOpenid}&lang=zh_CN`
  // var res = await request({ 
  //   url: url,
  //   method: 'GET',
  //   // json: true,
  //   // form: gzhDataMsg,

  // })
  // console.log('获取 unionid', res);
  // var unionid = JSON.parse(res)
  // // 
  // return unionid



  // // 测试时推送公众号消息==================
  // var {
  //   gzhOpenid,pagePath
  // } = event
  // var resToken = await cloud.database().collection('banner').doc('token').get()
  // var access_token = resToken.data.access_token

  // var msgData = {}
  // // 收件人
  // msgData.thing18 = {
  //   value: 'sasd'
  // }
  // // 目的地
  // msgData.thing3 = {
  //   value: '目的地'
  // }
  // // 订单状态
  // msgData.phrase5 = {
  //   value: '包裹已送达'
  // }
  // // 到达时间
  // msgData.time4 = {
  //   value: '2023-11-01'
  // }
  // // 到达地点
  // msgData.thing7 = {
  //   value: '到达地点'
  // }

  // var res = tuisongFwh(gzhOpenid, 'gOESUCnm8rpjwohyy2-nQEZ1FmEhh8SeUo6keAOMe-k', msgData, access_token,pagePath) // 货物到达目的地通知
  // return res

  // // 测试部分退款 ========================
  // if (event.action == '退款') {
  //   console.log('开始退款');
  //   var {
  //     total_fee,
  //     refund_fee,
  //     out_trade_no,
  //     out_refund_no,
  //   } = event

  //   cloud.cloudPay.refund({
  //       "total_fee": total_fee, //支付金额
  //       "refund_fee": refund_fee, //退款金额
  //       "out_trade_no": out_trade_no, //商户订单号
  //       "out_refund_no": out_refund_no, //退款单号
  //       "sub_mch_id": "1612648921", //***商户号
  //       "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
  //       "functionName": "pay_cb" //结果通知回调云函数名
  //     })
  //     .then(res => {
  //       console.log('退款 发起成功：', res);
  //     })
  //     .catch(err => {
  //       console.log('退款 发起失败：', err);
  //     })
  // }

  // // 测试合单支付  邀请制，没办法自助申请
  // if (event.action == '合单支付') {
  //   console.log('开始退款');
  //   var {
  //     total_fee,
  //     refund_fee,
  //     out_trade_no,
  //     out_refund_no,
  //   } = event

  //   // cloud.cloudPay.refund({
  //   //     "total_fee": total_fee, //支付金额
  //   //     "refund_fee": refund_fee, //退款金额
  //   //     "out_trade_no": out_trade_no, //商户订单号
  //   //     "out_refund_no": out_refund_no, //退款单号
  //   //     "sub_mch_id": "1612648921", //***商户号
  //   //     "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
  //   //     "functionName": "pay_cb" //结果通知回调云函数名
  //   //   })
  //   //   .then(res => {
  //   //     console.log('退款 发起成功：', res);
  //   //   })
  //   //   .catch(err => {
  //   //     console.log('退款 发起失败：', err);
  //   //   })
  //   var hedanDatas = {
  //     "combine_out_trade_no": "20150806125346",
  //     "combine_mchid": "1612648921",
  //     "combine_appid": "wxd678efh567hg6787",
  //     "sub_orders": [
  //       {
  //       "mchid": "1612648921",
  //       "attach": "蜂蜂校园",
  //       "amount": {
  //         "total_amount": 1.5,
  //         "currency": "CNY"
  //       },
  //       "out_trade_no": "F2023111495334169992681497202F0",
  //       "description": "代取快递"
  //     },
  //   ],
  //     "combine_payer_info": {
  //       "openid": "ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4"
  //     },
  //     // "notify_url": "https://yourapp.com/notify"
  //     "notify_url": "pay_cb"

  //   }

  //   var url = `https://api.mch.weixin.qq.com/v3/combine-transactions/jsapi`
  //   var res = await request({
  //     url: url,
  //     method: 'POST',
  //     json: true,
  //     form: hedanDatas,
  //   })
  //   console.log('测试合单支付', res);



  // }

}