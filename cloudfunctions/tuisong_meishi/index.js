// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
  })
  const _ = cloud.database().command

// 云函数入口函数
exports.main = async (event, context) => {
    if (event.tuisong_data.meishi_xiadan) {
        cloud.openapi.subscribeMessage.send({  // 新订单通知商家
            touser: event.tuisong_data.openid,
            // touser:_openid,
            page: 'pages/shangjia/shangjia',

            data: {
              // 订单商品
              thing6: {
                value: (event.tuisong_data.meishi_name).slice(0,20)
              },
              // 订单价格
              amount4: {
                value: '¥'+event.tuisong_data.cartPrice
              },
              // 下单用户
              thing3: {
                value: (event.tuisong_data.yonghu_name).slice(0,20)
              },
              // 联系人手机号
              phone_number10: {
                value: event.tuisong_data.phone
              },
              // 下单时间
              time5: {
                value: event.tuisong_data.xd_time
              },
            },
            templateId: 'OgFUv0zi6LpzrnWT8-bNZIvY5WDupxYhN8GV1FgPp5o', //新订单通知商家
            // "miniprogramState": 'developer'
          })
          .then(res => {
            console.log('新订单通知商家：成功', res);
            // console.log(event.tuisong_data,'tuisong_data');
          })
          .catch(err => {
            console.log('新订单通知商家,发送失败', err);
          })
        cloud.openapi.subscribeMessage.send({  // 新订单通知 顾客
            touser: event.tuisong_data.userOpenid,
            // touser:_openid,
            page: 'pages/wode/dingdan/dingdan?isMeishi=true',

            data: {
              // 商户名
              thing3: {value: (event.tuisong_data.dianpu_name).slice(0,20)},
              // 下单产品
              thing8: {value: (event.tuisong_data.meishi_name).slice(0,20)},
              // 订单状态
              phrase4: {value: '已支付'},
              // 下单时间
              date2: {value: event.tuisong_data.xd_time},
              // 温馨提示
              thing10: {value: '待出餐后将及时配送，请耐心等待'},
              // thing10: {value: ('请耐心等待出餐'+event.tuisong_data.dianpu_phone).slice(0,20)},
            },
            templateId: '1fohPzjqCxszfEOei7BJSv6o0v7me9MIajpNdCFb5s8', //下单成功通知，顾客
            // "miniprogramState": 'developer'
          })
          .then(res => {
            console.log('下单成功通知：成功', res);
            // console.log(event.tuisong_data,'tuisong_data');
          })
          .catch(err => {
            console.log('下单成功通知,发送失败', err);
          })
      }
}