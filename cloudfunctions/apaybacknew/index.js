// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})

// 云函数入口函数
// 多订单支付回传
exports.main = async (event, context) => {
    console.log(event);
    // 在returnCode 和result_code都为SUCCESS的时候有返回outTradeNo
    var dingdanhao = event.outTradeNo
    if (dingdanhao) {
        var res = await cloud.database().collection('daiqu').where({
                // 支付上传的订单号是不含D的,支付后，把含D的订单更新为0
                dingdanhao: {
                    $regex: dingdanhao
                },
            })
            .update({
                data: {
                    dd_Status: '0' //已支付为0，未支付为1
                }
            })
        console.log('更新完成', res);
        var resBack = {
            errcode: 0,
            errmsg: ''
        }
        return resBack
    }
}