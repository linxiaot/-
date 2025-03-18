// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
const _ = cloud.database().command
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
    if (event.action == 'fenzhang') { //立即分账 订单已完成
        var res_fenzhang = await cloud.database().collection('banner').doc('meishidata0001').get()
        var fenzhang_bili = res_fenzhang.data.fenzhang_bili//后台分账比例
        var fenzhang_list = event.fenzhang_list
        var songda_time = event.songda_time

        fenzhang_list.forEach(element => {

            var amount_fenzhang = element.shijiMoney * 100 * 0.99 * fenzhang_bili
            var amount = Math.ceil(amount_fenzhang)
            var fenzhang_amount = amount / 100
            var out_order_no = element.dingdanhao
            var transaction_id = element.tuikuandanhao

            var _id = element._id
            // 订阅消息 参数
            var dianpu_openid = element.dianpu.dianpu_openid
            var receivers = [{
                "type": "PERSONAL_SUB_OPENID",
                "account": dianpu_openid,
                "amount": amount,
                // 描述：string(80)
                "description": "订单金额" + element.shijiMoney + '元' + "订单号" + out_order_no
            }]
            receivers = JSON.stringify(receivers)
            var nonce_str = randomString(32)
            cloud.cloudPay.profitSharing({
                    "sub_mch_id": "1612648921",
                    "sub_appid": "wxaad7b42349d83506",
                    "nonce_str": nonce_str, //n3k0c2p2e023asf31k2t4k3x022c0d0 随机字符串
                    "transaction_id": transaction_id, //微信订单号
                    "out_order_no": out_order_no, //商户分账单号
                    "receivers": receivers
                })
                .then(res => {
                    console.log('分账 发起成功：', res);
                    if (res.resultCode == "SUCCESS") {

                        cloud.database().collection('meishi').doc(_id)
                            .update({
                                data: {
                                    dd_Status: '3',
                                    songda_time,
                                    fz_errCodeDes: '',
                                    fenzhang_amount,
                                    fenzhang_bili: fenzhang_bili,
                                }
                            })
                            .then(res => {
                                console.log('变为 已送达 成功', res.stats.updated)

                            })
                            .catch(err => {
                                console.log(err);
                            })

                    }
                    if (res.resultCode == "FAIL") {
                        cloud.database().collection('meishi').doc(_id)
                            .update({
                                data: {
                                    fz_errCodeDes: res.errCodeDes,
                                }
                            })
                            .then(res => {
                                console.log('错误描述同步成功::', res.stats.updated, res.errCodeDes)
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                })
                .catch(err => {
                    console.log('分账 发起失败：', err);
                })
        });

    }
}