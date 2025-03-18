// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
  // 四舍五入
function sswr(num,w){

    // return (Number(numStr)).toFixed(w)
    return Number(num.toFixed(w))
    
  }
// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event:',event);

    if (event.action == 'xiadan') {
        const res = await cloud.cloudPay.unifiedOrder({
            "body": event.goodName, //商品描述    
            "outTradeNo": event.dingdanhao, //订单号
            "spbillCreateIp": "127.0.0.1", //终端IP
            "subMchId": "1612648921", //***商户号
            "totalFee": sswr(event.totalFee,0), //支付的金额，单位是分
            "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
            "functionName": "apayback", //结果通知回调云函数名

        })
        return res
    }
    if (event.action == 'xiadan_qita') {//测试用
        const res = await cloud.cloudPay.unifiedOrder({
            "body": event.goodName, //商品描述    
            "outTradeNo": event.dingdanhao, //订单号
            "spbillCreateIp": "127.0.0.1", //终端IP
            "subMchId": "1612648921", //***商户号
            "totalFee": sswr(event.totalFee,0), //支付的金额，单位是分
            "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
            "functionName": "apayback_qita", //结果通知回调云函数名

        })
        return res
    }
    if (event.action == 'xiadan_duodingdan') {// 多订单
        const res = await cloud.cloudPay.unifiedOrder({
            "body": event.goodName, //商品描述    
            "outTradeNo": event.dingdanhao, //订单号
            "spbillCreateIp": "127.0.0.1", //终端IP
            "subMchId": "1612648921", //***商户号
            "totalFee": sswr(event.totalFee,0), //支付的金额，单位是分
            "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
            "functionName": "apaybacknew", //结果通知回调云函数名

        })
        return res
    }

}