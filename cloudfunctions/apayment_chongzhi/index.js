// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})

// 云函数入口函数
exports.main = async (event, context) => {
    // if (event.action == 'chongzhi') {
    if (event.action == 'chongzhi_') {
        const res = await cloud.cloudPay.unifiedOrder({
            "body": event.goodName, //商品描述    
            "outTradeNo": event.dingdanhao, //订单号
            "spbillCreateIp": "127.0.0.1", //终端IP
            "subMchId": "1612648921", //***商户号
            "totalFee": event.totalFee, //支付的金额，单位是分
            "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
            "functionName": "apayback_chongzhi", //结果通知回调云函数名
        })
        return res
    }
    if (event.action == 'meishi') {
        const res = await cloud.cloudPay.unifiedOrder({
            "body": event.goodName, //商品描述    
            "outTradeNo": event.dingdanhao, //订单号
            "spbillCreateIp": "127.0.0.1", //终端IP
            "subMchId": "1612648921", //***商户号
            "totalFee": event.totalFee, //支付的金额，单位是分
            "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
            "functionName": "apayback_meishi", //结果通知回调云函数名
            // "profit_sharing": "Y", //是否指定服务商分账
        })
        return res
    }

}