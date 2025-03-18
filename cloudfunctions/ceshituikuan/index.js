// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()

    if (event.action == '退款') {
        console.log('开始退款');
        var {
          total_fee,
          refund_fee,
          out_trade_no,
          out_refund_no,
        } = event
        // cloud.cloudPay.refund({
        //     // "total_fee": total_fee, //支付金额
        //     "refund_fee": refund_fee, //退款金额
        //     "out_refund_no": out_refund_no, //退款单号
        //     "out_trade_no": out_trade_no, //商户订单号
        //     "sub_mch_id": "1612648921", //***商户号
        //     "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
        //     "functionName": "pay_cb" //结果通知回调云函数名
        //   })
        //   .then(res => {
        //     console.log('退款完成', res);
        //     return res
        //   })
        //   .catch(err => {
        //     console.log('退款失败', err);
        //     return err
        //   })
    
        var res = await cloud.cloudPay.refund({
            "total_fee": total_fee, //支付金额
            "refund_fee": refund_fee, //退款金额
            "out_trade_no": out_trade_no, //商户订单号
            "out_refund_no": out_refund_no, //退款单号
            "sub_mch_id": "1612648921", //***商户号
            "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
            "functionName": "pay_cb" //结果通知回调云函数名
          })
          .then(res => {
            console.log('退款 发起成功：', res);
            // return res
          })
          .catch(err => {
            console.log('退款 发起失败：', err);
            return err
          })
          return res
      }
}