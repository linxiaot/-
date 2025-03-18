// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})

function randomString(len) {
    len = len || 32;
    var zifuAll = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    var maxPos = zifuAll.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += zifuAll.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
// 云函数入口函数
exports.main = async (event, context) => {
    if (event.action == 'fenzhang_add') { //添加 分账方
        var receiver = {
            "type": "PERSONAL_SUB_OPENID",
            // "account": "ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4",
            "account": event.dianpu_openid,
            "relation_type": "PARTNER"
        }
        receiver = JSON.stringify(receiver)
        var nonce_str = randomString(32)
        const res = await cloud.cloudPay.profitSharingAddReceiver({
            "sub_mch_id": "1612648921",
            "sub_appid": "wxaad7b42349d83506",
            "nonce_str": nonce_str, //n3k0c2p2e023asf31k2t4k3x022c0d0 随机字符串
            "receiver": receiver
        })
        console.log(res);
        if (res.resultCode == "SUCCESS") {
            var res2 = cloud.database().collection('shangjia').doc(event.dianpu_id).update({
                data: {
                    isFenzhang: true
                }
            })
            console.log(res2, 'isFenzhang');
            return res2
        }
        if (res.resultCode == "FAIL") {
            var errCodeDes = res.errCodeDes
            return {
                errCodeDes
            }
        }
    }
    if (event.action == 'fenzhang_del') { //删除 分账方
        var receiver = {
            "type": "PERSONAL_SUB_OPENID",
            // "account": "ok1Nu5EpcW0USpiSlVB2Ww9m4ZW41",
            "account": event.dianpu_openid,
            "relation_type": "PARTNER"
        }
        receiver = JSON.stringify(receiver)
        var nonce_str = randomString(32)
        const res = await cloud.cloudPay.profitSharingRemoveReceiver({
            "sub_mch_id": "1612648921",
            "sub_appid": "wxaad7b42349d83506",
            "nonce_str": nonce_str, //n3k0c2p2e023asf31k2t4k3x022c0d0 随机字符串
            "receiver": receiver
        })
        console.log(res);
        if (res.resultCode == "SUCCESS") {
            var res2 = cloud.database().collection('shangjia').doc(event.dianpu_id).update({
                data: {
                    isFenzhang: false
                }
            })
            console.log(res2, 'isFenzhang');
            return res2
        }
        if (res.resultCode == "FAIL") {
            var errCodeDes = res.errCodeDes
            return {
                errCodeDes
            }
        }
    }
    if (event.action == 'fenzhang_danci') { //请求单次分账
        var receivers = [{
            "type": "PERSONAL_SUB_OPENID",
            "account": "ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4",
            "amount": 297,
            "description": "分到个人"
        }]
        receivers = JSON.stringify(receivers)

        const res = await cloud.cloudPay.profitSharing({
            "sub_mch_id": "1612648921",
            "sub_appid": "wxaad7b42349d83506",
            "nonce_str": "n3k0c2p2e023asf31k2t4k3x022c0d0", //随机字符串
            "transaction_id": "4200001230202111077848107855", //微信订单号
            "out_order_no": "F2021117102659163625201988191", //商户分账单号
            "receivers": receivers
        })
        return res

    }
    if (event.action == 'fenzhang_tuikuan') { //分账回退目前仅支持分账方类型为：商户
        var receivers = [{
            "type": "PERSONAL_SUB_OPENID",
            "account": "ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4",
            "amount": 297,
            "description": "分到个人"
        }]
        receivers = JSON.stringify(receivers)

        const res = await cloud.cloudPay.profitSharingReturn({
            "sub_mch_id": "1612648921",
            "sub_appid": "wxaad7b42349d83506",
            "nonce_str": "n3k0c2p2e023asf31e2t4k3x022c0d0", //随机字符串
            // "order_id": "30000702062021110721320918967", //微信分账单号
            "out_order_no": "F2021117102659163625201988191", //商户分账单号
            "out_return_no": "4200001230202111077848107855", //商户回退单号
            "return_account_type": "PERSONAL_SUB_OPENID", //回退方类型
            "return_account": "ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4", //回退方账号
            "return_amount": 297, //回退金额
            "description": '用户退款',
        })
        return res

    }
}