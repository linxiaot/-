// old gai=========================================================================
// /*
// 云函数入口文件
const cloud = require('wx-server-sdk')
// request
const request = require('request-promise')
cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
const db = cloud.database()
const _ = cloud.database().command




function getXd_time() {
    var date = new Date()

    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours() + 8
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function jingqueJiage(heji_money) {
    var heji_money_a = String(heji_money).slice(0, String(heji_money).indexOf('.'))
    var heji_money_len = heji_money_a.length + 2

    var heji_money_last = Number((heji_money).toPrecision(heji_money_len))
    return heji_money_last
}

function tuiFengmi(id, balance, balance_jilu) {
    cloud.database().collection('user').doc(id)
        .update({
            data: {
                balance,
                balance_jilu: _.push([balance_jilu]),
            }
        })
        .then(res => {
            console.log('[余额] 更新 成功几条：', res)

        })
        .catch(err => {
            console.log('[余额] 更新 失败：', err)
        })
}
// function tuiFengmi(id, balance, balance_jilu) {
//     cloud.database().collection('user').doc(id)
//         .update({
//             data: {
//                 balance,
//                 balance_jilu: _.addToSet(balance_jilu),
//             }
//         })
//         .then(res => {
//             console.log('[余额] 更新 成功几条：', res)
//         })
//         .catch(err => {
//             console.log('[余额] 更新 失败：', err)
//         })
// }

function tuiJifen(id, jifen) {
    cloud.database().collection('user').doc(id)
        .update({
            data: {
                jifen: _.addToSet(jifen),
            }
        })
        .then(res => {
            console.log('[积分] 更新 成功几条：', res)
        })
        .catch(err => {
            console.log('[积分] 更新 失败：', err)
        })
}

async function tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, gzhOpenid, tuikuan_reason, qh_ma, isjutui = false, bohuiyy = '快递已被取出，请耐心等候派送', ishebing = false) {
    // if (ishebing) {
    //     var tuikuan_beizhu = '合并付订单快递已被取出，请耐心等候派送'
    // }
    cloud.openapi.subscribeMessage.send({
            touser: openid,
            // touser:_openid,
            page: 'pages/wode/dingdan/dingdan?isTuikuan_daiqu=true',

            data: {
                // 订单编号
                character_string1: {
                    value: dingdanhao
                },
                // 退款金额
                amount2: {
                    value: dingdan_money
                },
                // 申请时间
                time3: {
                    value: tk_time
                },
                // 退款结果
                phrase4: {
                    value: tuikuan_result
                },
                // 备注
                thing5: {
                    value: (ishebing ? '合并付订单快递已被取出，请耐心等候派送' : tuikuan_beizhu).slice(0, 20)
                },

            },
            templateId: 'm0LiKsNOZMH1b8QKUqAioeACYUp4G7yiCwIM-q1C6_Q', //退款结果通知
        })
        .then(res => {
            console.log('退款提醒：成功', res);
        })
        .catch(err => {
            console.log('退款提醒,发送失败', err);
        })

    if (!isjutui) { // 已退款通知
        // var msgData = {}
        // // 订单号
        // msgData.character_string1 = {
        //     value: dingdanhao
        // }
        // // 退款金额
        // msgData.amount2 = {
        //     value: dingdan_money
        // }
        // // 退款时间
        // msgData.time4 = {
        //     value: tk_time
        // }
        // // 服务名称
        // msgData.thing6 = {
        //     value: tuikuan_beizhu.slice(0, 20)
        // }

        // // var gzhOpenid = event.gzhOpenid
        // if (gzhOpenid) {
        //     console.log('有gzhOpenid');
        //     // 公众号发送模板消息 前先获取access_token
        //     var resToken = await cloud.database().collection('banner').doc('token').get()
        //     var access_token = resToken.data.access_token
        //     tuisongFwh(gzhOpenid, '2LUXA0MIh_snXhI4SDQJwEdXEoePD_zV9YROUFF11ws', msgData, access_token) // 退款成功通知
        // }

        var msgData = {}
        // 订单编号
        msgData.character_string12 = {
            value: dingdanhao
        }
        // 订单金额
        msgData.amount8 = {
            value: dingdan_money
        }
        // 退款时间
        msgData.time7 = {
            value: tk_time
        }
        // 商品名称 取货码
        msgData.thing18 = {
            value: qh_ma.slice(0, 20)
        }
        // 退款项目 退款原因
        msgData.thing11 = {
            value: tuikuan_reason.slice(0, 20)
        }

        // var gzhOpenid = event.gzhOpenid
        if (gzhOpenid) {
            console.log('有gzhOpenid');
            // 公众号发送模板消息 前先获取access_token
            var resToken = await cloud.database().collection('banner').doc('token').get()
            var access_token = resToken.data.access_token
            // 改为 新的退款通知
            tuisongFwh(gzhOpenid, 'ffgu9hF3QgNxdFAtMp2E8XTLi6ZK845tywYS2fZjHnU', msgData, access_token) // 退款成功通知

        }


    } else { // 拒退
        console.log('拒退通知');

        var msgData = {}
        // 订单号
        msgData.character_string1 = {
            value: dingdanhao
        }
        // 商品名称
        msgData.thing2 = {
            value: tuikuan_beizhu.slice(0, 20)
        }
        // 退款金额
        msgData.amount3 = {
            value: dingdan_money
        }

        // 驳回原因
        msgData.thing4 = {
            value: bohuiyy
        }


        if (gzhOpenid) {
            console.log('有gzhOpenid');
            // 公众号发送模板消息 前先获取access_token
            var resToken = await cloud.database().collection('banner').doc('token').get()
            var access_token = resToken.data.access_token
            // tuisongFwh(gzhOpenid, 'Eq6J0UQJNn3xP_J2eTmGR8BzS4cUCQjqwKB4A12jw08', msgData, access_token)   //退款失败通知
            tuisongFwh(gzhOpenid, '5r2rVFjTtGRGhDbYNOM4iG_sFG2-7jywj6J2Ekszkxk', msgData, access_token) // 退款驳回通知

        }

    }
    // if (isjutui == 'quxiao') { // 订单取消提醒
    //     console.log('合并付订单取消提醒');

    //     var msgData = {}

    //     // 商品名称 放取货码
    //     msgData.thing2 = {
    //         value: tuikuan_beizhu.slice(0, 20)
    //     }
    //     // 服务项目   
    //     msgData.thing15 = {
    //         value: '此订单为合并支付，请联系客服退款'
    //     }
    //     // 取消原因  
    //     msgData.thing5 = {
    //         value: tuikuan_beizhu.slice(0, 20)
    //     }

    //     // 订单金额
    //     msgData.amount13 = {
    //         value: dingdan_money
    //     }
    //     // 取消时间
    //     msgData.time4 = {
    //         value: tk_time
    //     }


    //     // 订单金额
    //     // {{amount13.DATA}}
    //     // 取消时间
    //     // {{time4.DATA}}

    //     if (gzhOpenid) {
    //         console.log('有gzhOpenid');
    //         // 公众号发送模板消息 前先获取access_token
    //         var resToken = await cloud.database().collection('banner').doc('token').get()
    //         var access_token = resToken.data.access_token
    //         tuisongFwh(gzhOpenid, 'xes8-ni3ncdF8MYADgWCONJFaFj8UBlmXoCbpnN_k1s', msgData, access_token) // 订单取消提醒

    //     }

    // }
}


// 取消合并支付 微信支付时使用
async function tuikuantongzhiQx(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, gzhOpenid, qh_Ma, wxPaisong) {
    var teshuyuanyin = '此订单为合并支付，请联系客服退款'
    if (wxPaisong) {
        teshuyuanyin = `请联系客服${wxPaisong}退款`
        if (teshuyuanyin.length > 20) {
            teshuyuanyin = '此订单为合并支付，请联系客服退款'
        }
    }
    cloud.openapi.subscribeMessage.send({
            touser: openid,
            // touser:_openid,
            page: 'pages/wode/dingdan/dingdan?isTuikuan_daiqu=true',

            data: {
                // 商品名称
                thing5: {
                    value: qh_Ma.slice(0, 20)
                },
                // 订单内容
                thing6: {
                    value: teshuyuanyin
                },
                // 退款说明
                thing3: {
                    value: tuikuan_beizhu.slice(0, 20)
                },
                // 退款金额
                amount1: {
                    value: dingdan_money
                },
                // 退款时间
                time2: {
                    value: tk_time
                },

            },
            templateId: 'mRJHY7kPgaD5v4JH2DOs9YYUXSf7fFKOIBc7UXPdyiI', //退款通知  新
        })
        .then(res => {
            console.log('退款提醒：成功', res);
        })
        .catch(err => {
            console.log('退款提醒,发送失败', err);
        })



    console.log('合并付订单取消提醒');

    var msgData = {}

    // 商品名称 放取货码
    msgData.thing2 = {
        value: qh_Ma.slice(0, 20)
    }
    // 服务项目   
    msgData.thing15 = {
        value: teshuyuanyin
    }
    // 取消原因  
    msgData.thing5 = {
        value: tuikuan_beizhu.slice(0, 20)
    }

    // 订单金额
    msgData.amount13 = {
        value: dingdan_money
    }
    // 取消时间
    msgData.time4 = {
        value: tk_time
    }

    if (gzhOpenid) {
        console.log('有gzhOpenid');
        // 公众号发送模板消息 前先获取access_token
        var resToken = await cloud.database().collection('banner').doc('token').get()
        var access_token = resToken.data.access_token
        tuisongFwh(gzhOpenid, 'xes8-ni3ncdF8MYADgWCONJFaFj8UBlmXoCbpnN_k1s', msgData, access_token) // 订单取消提醒
    }

}

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



// 生成退款订单
function getid(tuikuanList, beizhu_tuisong_quxiao) {

    var addDatas = {
        daiqu_id: tuikuanList.daiqu_id, //原始订单的_id
        kd_Name: tuikuanList.kd_Name,
        kd_PhoNum: tuikuanList.kd_PhoNum,
        qh_Ma: tuikuanList.qh_Ma,
        sd_Didian: tuikuanList.sd_Didian,

        xd_time: tuikuanList.xd_time,
        tk_time: tuikuanList.tk_time,
        isYunxu_tuikuan: tuikuanList.isYunxu_tuikuan,

        // dingdanhao: tuikuanList.dingdanhaoYuan,
        dingdanhao: tuikuanList.dingdanhao,
        tuikuandanhao: tuikuanList.tuikuandanhao,
        yizhifu: tuikuanList.yizhifu,
        refund_fee: tuikuanList.refund_fee,
        yizhifu_fengmi: tuikuanList.yizhifu_fengmi,
        yizhifu_jifen: tuikuanList.yizhifu_jifen,
        dingdan_money: tuikuanList.dingdan_money,
        user_id: tuikuanList.user_id,
        value_tkyy: beizhu_tuisong_quxiao,

        gzhOpenid: tuikuanList.gzhOpenid,
        _openid: tuikuanList._openid
    }
    if (addDatas.yizhifu == 0) { // 支付的金额为零 直接取消订单
        addDatas.tuikuandanhao = ''
    }
    return addDatas

}


// 四舍五入
function sswr(num, w) {

    // return (Number(numStr)).toFixed(w)
    return Number(num.toFixed(w))

}

// 云函数入口函数
exports.main = async (event, context) => {
    console.log('apaytuikuan', event);
    if (event.action == 'chaxundingdan') { //查询支付后的订单详情
        const res = await cloud.cloudPay.queryOrder({
            "out_trade_no": event.dingdanhao, //商户订单号
            "sub_mch_id": "1612648921", //***商户号
        })
        console.log(res);
        return res
    }
    if (event.action == 'chaxuntuikuan') { //查询退款情况
        const res = await cloud.cloudPay.queryRefund({
            "out_trade_no": event.dingdanhao, //订单号
            "sub_mch_id": "1612648921", //***商户号
        })
        console.log(res);
        return res
    }
    // if (event.action == 'chaxundingdanMore') { //查询支付后的订单详情
    //     for (let index = 0; index < event.quxiaoList.length; index++) {
    //         var element = array[index];
    //         var res = await cloud.cloudPay.queryOrder({
    //             "out_trade_no": element.dingdanhaoYuan, //商户订单号
    //             "sub_mch_id": "1612648921", //***商户号
    //         })
    //         var tuikuandanhao = res.transactionId
    //         element.tuikuandanhao = tuikuandanhao
    //         chaxunList.push(element)
    //     }

    //     event.action = 'ceshi'
    //     // return chaxunList
    // }
    // if (event.action == 'ceshi') {
    //     console.log('测试');
    //     event.action = 'success'

    // }
    // if (event.action == 'success') {
    //     console.log('测试成功');
    // }

    if (event.action == 'quxiaodingdan') {
        var {
            go_tuikuan_list,
            go_tuikuan_list_0,
            beizhu_tuisong_quxiao
        } = event

        if (go_tuikuan_list.length > 0) {
            var listNew = []
            for (let index = 0; index < go_tuikuan_list.length; index++) {
                var element = go_tuikuan_list[index];
                var out_trade_no = element.dingdanhao

                var res = await cloud.cloudPay.queryOrder({
                    // "out_trade_no": element.dingdanhaoYuan, //商户订单号
                    "out_trade_no": out_trade_no, //商户订单号
                    "sub_mch_id": "1612648921", //***商户号
                })
                console.log('queryOrder',res);

                element.tuikuandanhao = res.transactionId
                element.tk_time = getXd_time()
                element.refund_fee = element.yizhifu
                element.daiqu_id = element._id
                element.isYunxu_tuikuan = false

                var addRes = await db.collection('tuikuan').add({
                    data: getid(element, beizhu_tuisong_quxiao)
                }) //提交退款订单
                element._id = addRes._id
                console.log('quxiaodingdan', addRes);
                // 需要生成退款订单

                listNew.push(element)
            }
            go_tuikuan_list = listNew
        }
        if (go_tuikuan_list_0.length > 0) { // 未使用微信支付的订单列表
            var listNew = []
            for (let index = 0; index < go_tuikuan_list_0.length; index++) {
                var element = go_tuikuan_list_0[index];
                // var res = await cloud.cloudPay.queryOrder({
                //     "out_trade_no": element.dingdanhaoYuan, //商户订单号
                //     "sub_mch_id": "1612648921", //***商户号
                // })

                // element.tuikuandanhao = res.transactionId
                element.tk_time = getXd_time()
                element.refund_fee = element.yizhifu
                element.daiqu_id = element._id
                element.isYunxu_tuikuan = false

                var {
                    dindgan_fengmi,
                    dingdan_jifen,
                    dingdanhao
                } = element

                // 若是合并付中的订单
                if (dingdanhao.indexOf('D') !== -1) {

                    //  后续将按单订单积分和蜂蜜退款 =========================
                    element.yizhifu_fengmi = dindgan_fengmi
                    element.yizhifu_jifen = dingdan_jifen
                }

                var addRes = await db.collection('tuikuan').add({
                    data: getid(element, beizhu_tuisong_quxiao)
                }) //提交退款订单
                element._id = addRes._id
                console.log('quxiaodingdan', addRes);

                // 需要生成退款订单
                listNew.push(element)
            }
            go_tuikuan_list_0 = listNew
        }
        console.log('go_tuikuan_list', go_tuikuan_list);
        console.log('go_tuikuan_list_0', go_tuikuan_list_0);

        // 微信退款
        if (go_tuikuan_list.length !== 0 && go_tuikuan_list_0.length == 0) {
            console.log('去微信退款quxiaodingdan');
            event.action = 'tuikuan'
        }
        // 其余退款
        if (go_tuikuan_list.length == 0 && go_tuikuan_list_0.length !== 0) {
            console.log('去其他退款quxiaodingdan');
            event.action = 'tuikuan_qita'

        }
        // 微信+其余退款
        if (go_tuikuan_list.length !== 0 && go_tuikuan_list_0.length !== 0) {
            console.log('去多种退款quxiaodingdan');
            event.action = 'tuikuan_duozhong'

        }

    }


    if (event.action == 'tuikuan') {
        console.log('去微信退款', event);
        var go_tuikuan_list = event.go_tuikuan_list
        go_tuikuan_list.forEach(element => {
            var total_fee = sswr(element.yizhifu * 100, 0)
            var refund_fee = sswr(element.refund_fee * 100, 0)
            var out_trade_no = element.dingdanhao
            var out_refund_no = element.tuikuandanhao
            var _id = element._id // 新增退款中的订单id
            var daiqu_id = element.daiqu_id
            var user_id = element.user_id
            // var yizhifu_fengmi = Number(element.yizhifu_fengmi)
            var yizhifu_jifen = Number(element.yizhifu_jifen)

            var openid = element._openid
            var dingdanhao = element.dingdanhao // 若是合并付订单被取消，订单号会含D，其他均无
            var dingdan_money = element.dingdan_money + '元'
            var xd_time = getXd_time()
            var tk_time = element.tk_time
            var tuikuan_result = '已通过' //5个以内汉字
            var tuikuan_beizhu = '取货码:' + element.qh_Ma //20个字
            var value_tkyy = element.value_tkyy
            if (event.beizhu_tuisong_quxiao) { // 取消订单时
                tuikuan_result = '订单已取消'
                tuikuan_beizhu = ('取货码:' + element.qh_Ma + '|' + event.beizhu_tuisong_quxiao).slice(0, 20)
                // tuikuan_beizhu = '退款原因请查看：退款订单列表'
                // dingdanhao = element.dingdanhaoYuan
                // out_trade_no = dingdanhao
                value_tkyy = event.beizhu_tuisong_quxiao
            }
            console.log('element.tuikuandanhao', element.tuikuandanhao);

            // 若是合并付中的订单 微信支付订单被取消，不退微信，直接后续  =====多订单=====
            if (dingdanhao.indexOf('D') !== -1) {

                console.log('微信支付订单被取消，不退微信，直接后续');
                if (yizhifu_jifen !== 0) {

                    var jifen = {
                        jifen_name: '订单退款',
                        jifen_num: yizhifu_jifen,
                        jifen_time: xd_time
                    }
                    tuiJifen(user_id, jifen)
                }

                cloud.database().collection('tuikuan').doc(_id)
                    .update({
                        data: {
                            isYunxu_tuikuan: true,
                            tytuikuan_time: xd_time,
                        }
                    })
                    .then(res1 => {
                        console.log('已退款，改变isYunxu_tuikuan成功：：', res1);
                        cloud.database().collection('daiqu').doc(daiqu_id)
                            .update({
                                data: {
                                    dd_Status: '5',
                                    tytuikuan_time: xd_time,
                                    value_tkyy,
                                }
                            })
                            .then(res2 => {
                                console.log('退款中 变为 已退款 成功', res2)
                                // 改为特殊通知，订单已被取消请联系客服退款
                                // tuikuan_beizhu = ('取货码:' + element.qh_Ma + '|' + event.beizhu_tuisong_quxiao).slice(0, 20)
                                // tuikuan_beizhu = ('取货码:' + element.qh_Ma + '|请联系客服退款').slice(0, 20)

                                tuikuantongzhiQx(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, event.beizhu_tuisong_quxiao, element.gzhOpenid, '取货码:' + element.qh_Ma, element.wxPaisong)
                            })
                            .catch(err => {
                                console.log(err);
                            })


                    })
                    .catch(err => {
                        console.log(err);
                    })



            } else {
                cloud.cloudPay.refund({
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
                        if (res.resultCode == "SUCCESS") {
                            console.log('退款成功');
                            if (yizhifu_jifen !== 0) {

                                var jifen = {
                                    jifen_name: '订单退款',
                                    jifen_num: yizhifu_jifen,
                                    jifen_time: xd_time
                                }
                                tuiJifen(user_id, jifen)
                            }

                            cloud.database().collection('tuikuan').doc(_id)
                                .update({
                                    data: {
                                        isYunxu_tuikuan: true,
                                        tytuikuan_time: xd_time,
                                    }
                                })
                                .then(res1 => {
                                    console.log('已退款，改变isYunxu_tuikuan成功：：', res1);

                                    if (element.dingdanList) {
                                        console.log('合并支付订单，更新状态5');
                                        for (let index = 0; index < element.dingdanList.length; index++) {
                                            const element2 = element.dingdanList[index];
                                            cloud.database().collection('daiqu').doc(element2._id)
                                                .update({
                                                    data: {
                                                        dd_Status: '5',
                                                        tytuikuan_time: xd_time,
                                                        value_tkyy,
                                                    }
                                                })
                                                .then(res2 => {
                                                    console.log('订单 变为 已退款 成功', res2)
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                })
                                        }
                                        // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu.slice(0, 16) + '，等多个', element.gzhOpenid)
                                        tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu.slice(0, 16) + '，等多个', element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma+'，等多个')
                                    } else {

                                        cloud.database().collection('daiqu').doc(daiqu_id)
                                            .update({
                                                data: {
                                                    dd_Status: '5',
                                                    tytuikuan_time: xd_time,
                                                    value_tkyy,
                                                }
                                            })
                                            .then(res2 => {
                                                console.log('退款中 变为 已退款 成功', res2)

                                                // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)
                                                tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma)


                                            })
                                            .catch(err => {
                                                console.log(err);
                                            })
                                    }

                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        } else {
                            var refundInfo = {
                                "total_fee": total_fee, //支付金额
                                "refund_fee": refund_fee, //退款金额
                                "out_trade_no": out_trade_no, //商户订单号
                                "out_refund_no": out_refund_no, //退款单号
                                "sub_mch_id": "1612648921", //***商户号
                                "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
                                "functionName": "pay_cb" //结果通知回调云函数名
                            }
                            console.log('退款 失败:', refundInfo);

                        }
                    })
                    .catch(err => {
                        console.log('退款 发起失败：', err);
                        // return err
                        // 添加退款结果到退款订单详情中
                        cloud.database().collection('tuikuan').doc(_id)
                        .update({
                            data: {
                                res_tkTime: xd_time,
                                res_tk: err.Error,
                            }
                        })
                        .then(res3 => {
                            console.log('退款失败原因更新到退款订单中：', res3)
                        })
                        .catch(err => {
                            console.log('退款失败原因更新失败：',err);
                        })
                    })

            }
        });

    }
    if (event.action == 'tuikuan_qita') {
        console.log('去其他退款tuikuan_qita');
        var go_tuikuan_list_0 = event.go_tuikuan_list_0
        for (let index = 0; index < go_tuikuan_list_0.length; index++) {
            const element = go_tuikuan_list_0[index];

            // }
            // go_tuikuan_list_0.forEach(element => {
            var xd_time = getXd_time()
            var user_id = element.user_id
            var tuikuan_id = element._id
            var yizhifu_fengmi = element.yizhifu_fengmi
            var yizhifu_jifen = element.yizhifu_jifen
            var daiqu_id = element.daiqu_id

            var openid = element._openid
            var dingdanhao = element.dingdanhao
            var dingdan_money = element.dingdan_money + '元'
            var tk_time = element.tk_time
            var tuikuan_result = '已通过' //5个以内汉字
            var tuikuan_beizhu = '取货码:' + element.qh_Ma //20个字
            var value_tkyy = element.value_tkyy
            if (event.beizhu_tuisong_quxiao) { // 取消订单时
                tuikuan_result = '订单已取消'
                tuikuan_beizhu = ('取货码:' + element.qh_Ma + '|' + event.beizhu_tuisong_quxiao).slice(0, 20)
                // tuikuan_beizhu = '退款原因请查看：退款订单列表'

                // dingdanhao = element.dingdanhaoYuan
                value_tkyy = event.beizhu_tuisong_quxiao
            }

            var jifen = {
                jifen_name: '订单退款',
                jifen_num: yizhifu_jifen,
                jifen_time: xd_time
            }
            var balance_jilu = {
                jilu_name: '订单退款',
                jilu_num: yizhifu_fengmi,
                jilu_time: xd_time
            }
            //锚点
            var res = await cloud.database().collection('user').doc(user_id)
                .get()
            // .then(res => {
            console.log('chaBalance成功')
            // var balance = res.data.balance + yizhifu_fengmi
            // var balance_100 = balance * 100
            // var balance = (balance_100 / 100).toPrecision(2)
            // if (balance == 0.0) {
            //     var balance = 0
            // }
            var balance_0 = res.data.balance + yizhifu_fengmi
            var balance = jingqueJiage(balance_0)
            console.log(balance, 'balance::');
            // 判断支付方式
            if (yizhifu_fengmi == 0 && yizhifu_jifen !== 0) {
                tuiJifen(user_id, jifen)
            } else if (yizhifu_fengmi !== 0 && yizhifu_jifen == 0) {
                tuiFengmi(user_id, balance, balance_jilu)
            } else if (yizhifu_fengmi !== 0 && yizhifu_jifen !== 0) {
                tuiJifen(user_id, jifen)
                tuiFengmi(user_id, balance, balance_jilu)
            }
            var res1 = await cloud.database().collection('tuikuan').doc(tuikuan_id)
                .update({
                    data: {
                        isYunxu_tuikuan: true,
                        tytuikuan_time: xd_time
                    }
                })
            if (element.dingdanList) {
                console.log('合并支付订单，更新状态5');
                // var idList = []
                for (let index = 0; index < element.dingdanList.length; index++) {
                    const element2 = element.dingdanList[index];

                    cloud.database().collection('daiqu').doc(element2._id)
                        .update({
                            data: {
                                dd_Status: '5',
                                tytuikuan_time: xd_time,
                                value_tkyy,
                            }
                        })
                        .then(res2 => {
                            console.log('退款中 变为 已退款 成功', res2)
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
                // console.log('idList', idList);
                // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu.slice(0, 16) + '，等多个', element.gzhOpenid)
                tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu.slice(0, 16) + '，等多个', element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma+'，等多个')
            } else {
                var res2 = await cloud.database().collection('daiqu').doc(daiqu_id)
                    .update({
                        data: {
                            dd_Status: '5',
                            tytuikuan_time: xd_time,
                            value_tkyy,
                        }
                    })
                console.log('退款中 变为 已退款 成功', res2)
                // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid)
                tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma)
            }

        }
    }
    if (event.action == 'tuikuan_duozhong') { // 合并订单不能在此处修改
        console.log('去多种退款');
        // 微信支付
        var go_tuikuan_list = event.go_tuikuan_list
        // for (let index = 0; index < go_tuikuan_list.length; index++) {
        //     const element = go_tuikuan_list[index];

        go_tuikuan_list.forEach(element => {
            var total_fee = sswr(element.yizhifu * 100, 0)
            var refund_fee = sswr(element.refund_fee * 100, 0)
            var out_trade_no = element.dingdanhao
            var out_refund_no = element.tuikuandanhao
            var _id = element._id
            var daiqu_id = element.daiqu_id
            var user_id = element.user_id
            // var yizhifu_fengmi = Number(element.yizhifu_fengmi)
            var yizhifu_jifen = Number(element.yizhifu_jifen)

            var openid = element._openid
            var dingdanhao = element.dingdanhao
            var dingdan_money = element.dingdan_money + '元'
            var tk_time = element.tk_time
            var xd_time = getXd_time()
            var tuikuan_result = '已通过' //5个以内汉字
            var tuikuan_beizhu = '取货码:' + element.qh_Ma //20个字
            var value_tkyy = element.value_tkyy
            if (event.beizhu_tuisong_quxiao) { // 取消订单时
                tuikuan_result = '订单已取消'
                tuikuan_beizhu = ('取货码:' + element.qh_Ma + '|' + event.beizhu_tuisong_quxiao).slice(0, 20)
                // tuikuan_beizhu = '退款原因请查看：退款订单列表'
                // dingdanhao = element.dingdanhaoYuan
                // out_trade_no = dingdanhao
                value_tkyy = event.beizhu_tuisong_quxiao
            }
            cloud.cloudPay.refund({
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
                    if (res.resultCode == "SUCCESS") {
                        if (yizhifu_jifen !== 0) {

                            var jifen = {
                                jifen_name: '订单退款',
                                jifen_num: yizhifu_jifen,
                                jifen_time: xd_time
                            }
                            tuiJifen(user_id, jifen)
                        }

                        cloud.database().collection('tuikuan').doc(_id)
                            .update({
                                data: {
                                    isYunxu_tuikuan: true,
                                    tytuikuan_time: xd_time
                                }
                            })
                            .then(res1 => {
                                console.log('已退款，改变isYunxu_tuikuan成功：：', res1);

                                cloud.database().collection('daiqu').doc(daiqu_id)
                                    .update({
                                        data: {
                                            dd_Status: '5',
                                            tytuikuan_time: xd_time,
                                            value_tkyy,
                                        }
                                    })
                                    .then(res2 => {
                                        console.log('退款中 变为 已退款 成功', res2)
                                        // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)
                                        
                                        // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid)
                                        tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma)



                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                })
                .catch(err => {
                    console.log('退款 发起失败：', err);
                })
        });
        // }

        // 多种退款 其他支付
        var go_tuikuan_list_0 = event.go_tuikuan_list_0
        // for (let index = 0; index < go_tuikuan_list_0.length; index++) {
        //     const element = go_tuikuan_list_0[index];

        go_tuikuan_list_0.forEach(element => {
            var user_id = element.user_id
            var tuikuan_id = element._id
            var yizhifu_fengmi = element.yizhifu_fengmi
            var yizhifu_jifen = element.yizhifu_jifen
            var daiqu_id = element.daiqu_id

            var openid = element._openid
            var dingdanhao = element.dingdanhao
            var dingdan_money = element.dingdan_money + '元'
            var tk_time = element.tk_time
            var xd_time = getXd_time()
            var tuikuan_result = '已通过' //5个以内汉字
            var tuikuan_beizhu = '取货码:' + element.qh_Ma //20个字
            var value_tkyy = element.value_tkyy
            if (event.beizhu_tuisong_quxiao) { // 取消订单时
                tuikuan_result = '订单已取消'
                tuikuan_beizhu = ('取货码:' + element.qh_Ma + '|' + event.beizhu_tuisong_quxiao).slice(0, 20)
                // tuikuan_beizhu = '退款原因请查看：退款订单列表'
                // dingdanhao = element.dingdanhaoYuan
                value_tkyy = event.beizhu_tuisong_quxiao
            }

            var jifen = {
                jifen_name: '订单退款',
                jifen_num: yizhifu_jifen,
                jifen_time: xd_time
            }
            var balance_jilu = {
                jilu_name: '订单退款',
                jilu_num: yizhifu_fengmi,
                jilu_time: xd_time
            }
            cloud.database().collection('user').doc(user_id)
                .get()
                .then(res => {
                    console.log('chaBalance', res)
                    var balance = res.data.balance + yizhifu_fengmi
                    if (yizhifu_fengmi == 0 && yizhifu_jifen !== 0) {
                        tuiJifen(user_id, jifen)
                    } else if (yizhifu_fengmi !== 0 && yizhifu_jifen == 0) {
                        tuiFengmi(user_id, balance, balance_jilu)
                    } else if (yizhifu_fengmi !== 0 && yizhifu_jifen !== 0) {
                        tuiJifen(user_id, jifen)
                        tuiFengmi(user_id, balance, balance_jilu)
                    }
                    cloud.database().collection('tuikuan').doc(tuikuan_id)
                        .update({
                            data: {
                                isYunxu_tuikuan: true,
                                tytuikuan_time: xd_time
                            }
                        })
                        .then(res1 => {

                            cloud.database().collection('daiqu').doc(daiqu_id)
                                .update({
                                    data: {
                                        dd_Status: '5',
                                        tytuikuan_time: xd_time,
                                        value_tkyy,
                                    }
                                })
                                .then(res2 => {
                                    console.log('退款中 变为 已退款 成功', res2)
                                    // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)

                                    // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid)
                                    tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma)



                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                        })

                })
                .catch(err => {
                    console.log('chaBalance 失败：', err)
                })

        });
    }

    // }
    if (event.action == 'tuikuan_jutui') {
        console.log('拒绝退款');
        var go_tuikuan_list = event.go_tuikuan_list
        var go_tuikuan_list_0 = event.go_tuikuan_list_0

        if (go_tuikuan_list.length !== 0) {
            console.log('go_tuikuan_list');
            // for (let index = 0; index < go_tuikuan_list.length; index++) {
            //     const element = go_tuikuan_list[index];

            go_tuikuan_list.forEach(element => {
                var tuikuan_id = element._id
                var daiqu_id = element.daiqu_id

                var openid = element._openid
                var dingdanhao = element.dingdanhao
                var dingdan_money = element.dingdan_money + '元'
                var tk_time = element.tk_time
                var xd_time = getXd_time()

                var tuikuan_result = '未通过' //5个以内汉字
                var tuikuan_beizhu = '快递已被取出,不支持退款,请耐心等待送达' //20个字

                cloud.database().collection('tuikuan').doc(tuikuan_id)
                    .update({
                        data: {
                            isYunxu_tuikuan: true,
                            isJutui: true,
                            jt_time: xd_time,
                        }
                    })
                    .then(res1 => {


                        if (element.dingdanList) {
                            console.log('合并支付订单，更新状态5');
                            for (let index = 0; index < element.dingdanList.length; index++) {
                                const element2 = element.dingdanList[index];
                                cloud.database().collection('daiqu').doc(element2._id)
                                    .update({
                                        data: {
                                            dd_Status: '6',
                                            jt_time: xd_time,
                                        }
                                    })
                                    .then(res2 => {
                                        console.log('订单 变为 拒绝退款 成功', res2)
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }
                            // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, '合并订单中快递已被取出，请耐心等候派送', element.gzhOpenid, true)
                            tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, (element.qh_Ma).slice(0, 17) + '等多个', element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma+'，等多个', true, '合并付订单快递已被取出，请耐心等候派送', true)
                        } else {
                            cloud.database().collection('daiqu').doc(daiqu_id)
                                .update({
                                    data: {
                                        dd_Status: '6',
                                        jt_time: xd_time,
                                    }
                                })
                                .then(res2 => {
                                    console.log('退款中 变为 拒绝退款 成功', res2)

                                    // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)
                                    tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma, true)

                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }




                        // cloud.database().collection('daiqu').doc(daiqu_id)
                        //     .update({
                        //         data: {
                        //             dd_Status: '6',
                        //             jt_time: xd_time,
                        //         }
                        //     })
                        //     .then(res2 => {
                        //         console.log('退款中 变为 拒绝退款 成功', res2)

                        //         tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)

                        //     })
                        //     .catch(err => {
                        //         console.log(err);
                        //     })
                    })
                    .catch(err => {
                        console.log(err);
                    })

            });
            // }

        }
        if (go_tuikuan_list_0.length !== 0) {
            console.log('go_tuikuan_list_0');
            // for (let index = 0; index < go_tuikuan_list_0.length; index++) {
            //     const element = go_tuikuan_list_0[index];

            go_tuikuan_list_0.forEach(element => {
                var tuikuan_id = element._id
                var daiqu_id = element.daiqu_id

                var openid = element._openid
                var dingdanhao = element.dingdanhao
                var dingdan_money = element.dingdan_money + '元'
                var tk_time = element.tk_time
                var xd_time = getXd_time()
                var tuikuan_result = '未通过' //5个以内汉字
                var tuikuan_beizhu = '快递已被取出,不支持退款,请耐心等待送达' //20个字

                cloud.database().collection('tuikuan').doc(tuikuan_id)
                    .update({
                        data: {
                            isYunxu_tuikuan: true,
                            isJutui: true,
                            jt_time: xd_time,
                        }
                    })
                    .then(res1 => {
                        if (element.dingdanList) {
                            console.log('合并支付订单，更新状态5');
                            for (let index = 0; index < element.dingdanList.length; index++) {
                                const element2 = element.dingdanList[index];
                                cloud.database().collection('daiqu').doc(element2._id)
                                    .update({
                                        data: {
                                            dd_Status: '6',
                                            jt_time: xd_time,
                                        }
                                    })
                                    .then(res2 => {
                                        console.log('订单 变为 拒绝退款 成功', res2)
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    })
                            }
                            // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, '合并订单中快递已被取出，请耐心等候派送', element.gzhOpenid, true)
                            tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, (element.qh_Ma).slice(0, 17) + '等多个', element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma+'，等多个', true, '合并付订单快递已被取出，请耐心等候派送', true)

                        } else {
                            cloud.database().collection('daiqu').doc(daiqu_id)
                                .update({
                                    data: {
                                        dd_Status: '6',
                                        jt_time: xd_time,
                                    }
                                })
                                .then(res2 => {
                                    console.log('退款中 变为 拒绝退款 成功', res2)

                                    // tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)
                                    tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu, element.gzhOpenid, value_tkyy, '取货码:'+element.qh_Ma, true)

                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        }
                        // cloud.database().collection('daiqu').doc(daiqu_id)
                        //     .update({
                        //         data: {
                        //             dd_Status: '6',
                        //             jt_time: xd_time,
                        //         }
                        //     })
                        //     .then(res2 => {
                        //         console.log('退款中 变为 拒绝退款 成功', res2)
                        //         tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)
                        //     })
                        //     .catch(err => {
                        //         console.log(err);
                        //     })
                    })
                    .catch(err => {
                        console.log(err);
                    })



            });
            // }

        }

    }
    if (event.action == 'tuikuan_jutui_meishi') {
        console.log('拒绝退款');
        var go_tuikuan_list = event.go_tuikuan_list
        var go_tuikuan_list_0 = event.go_tuikuan_list_0

        if (go_tuikuan_list.length !== 0) {
            go_tuikuan_list.forEach(element => {
                var tuikuan_id = element._id
                var daiqu_id = element.daiqu_id

                var openid = element._openid
                var dingdanhao = element.dingdanhao
                var dingdan_money = element.dingdan_money + '元'
                var tk_time = element.tk_time
                var xd_time = getXd_time()

                var tuikuan_result = '未通过' //5个以内汉字
                var tuikuan_beizhu = '快递已被取出,不支持退款,请耐心等待送达' //20个字

                cloud.database().collection('tuikuan').doc(tuikuan_id)
                    .update({
                        data: {
                            isYunxu_tuikuan: true,
                            isJutui: true,
                            jt_time: xd_time,

                        }
                    })
                    .then(res1 => {
                        cloud.database().collection('daiqu').doc(daiqu_id)
                            .update({
                                data: {
                                    dd_Status: '6',
                                    jt_time: xd_time,

                                }
                            })
                            .then(res2 => {
                                console.log('退款中 变为 拒绝退款 成功', res2)

                                tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)

                            })
                            .catch(err => {
                                console.log(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                    })

            });
        }
        if (go_tuikuan_list_0.length !== 0) {
            go_tuikuan_list_0.forEach(element => {
                var tuikuan_id = element._id
                var daiqu_id = element.daiqu_id

                var openid = element._openid
                var dingdanhao = element.dingdanhao
                var dingdan_money = element.dingdan_money + '元'
                var tk_time = element.tk_time
                var xd_time = getXd_time()
                var tuikuan_result = '未通过' //5个以内汉字
                var tuikuan_beizhu = '快递已被取出,不支持退款,请耐心等待送达' //20个字

                cloud.database().collection('tuikuan').doc(tuikuan_id)
                    .update({
                        data: {
                            isYunxu_tuikuan: true,
                            isJutui: true,
                            jt_time: xd_time,
                        }
                    })
                    .then(res1 => {
                        cloud.database().collection('daiqu').doc(daiqu_id)
                            .update({
                                data: {
                                    dd_Status: '6',
                                    jt_time: xd_time,
                                }
                            })
                            .then(res2 => {
                                console.log('退款中 变为 拒绝退款 成功', res2)
                                tuikuantongzhi(openid, dingdanhao, dingdan_money, tk_time, tuikuan_result, tuikuan_beizhu)
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                    })



            });
        }

    }
    if (event.action == 'tuikuan_meishi') {
        console.log('去微信退款,meishi');
        var go_tuikuan_list = event.go_tuikuan_list
        var tytuikuan_time = event.tytuikuan_time

        go_tuikuan_list.forEach(element => {
            // element.shijiMoney = 0.001  // 测试用
            // var total_fee = 1
            // var refund_fee = 1
            var total_fee = sswr(element.shijiMoney * 100, 0)
            var refund_fee = sswr(element.shijiMoney * 100, 0)
            var out_trade_no = element.dingdanhao
            var out_refund_no = element.tuikuandanhao
            var _id = element._id

            // 订阅消息 参数
            var openid = element._openid
            var dingdanhao = element.dingdanhao
            var shijiMoney = element.shijiMoney + '元'
            var tk_time = element.tk_time
            // var xd_time = getXd_time()
            var tuikuan_result = '已通过' //5个以内汉字
            var tuikuan_beizhu = '退款金额将原路返回支付账户，请留意' //20个字

            cloud.cloudPay.refund({
                    "total_fee": total_fee, //支付金额
                    "refund_fee": refund_fee, //退款金额
                    "out_trade_no": out_trade_no, //商户订单号
                    "out_refund_no": out_refund_no, //退款单号
                    "sub_mch_id": "1612648921", //***商户号
                    "envId": "xmf-0g87mzf198205ada", //结果通知回调云函数环境
                    "functionName": "apayback_tuikuan" //结果通知回调云函数名
                })
                .then(res => {
                    console.log('退款 发起成功：', res);
                    if (res.resultCode == "SUCCESS") {

                        cloud.database().collection('meishi').doc(_id)
                            .update({
                                data: {
                                    dd_Status: '5',
                                    tytuikuan_time: tytuikuan_time,
                                    tk_errCodeDes: ''
                                }
                            })
                            .then(res => {
                                console.log('退款中 变为 已退款 成功', res.stats.updated)

                                tuikuantongzhi(openid, dingdanhao, shijiMoney, tk_time, tuikuan_result, tuikuan_beizhu)

                            })
                            .catch(err => {
                                console.log(err);
                            })

                    }
                    if (res.resultCode == "FAIL") {
                        cloud.database().collection('meishi').doc(_id)
                            .update({
                                data: {
                                    tk_errCodeDes: res.errCodeDes,
                                    tytuikuan_time: tytuikuan_time,
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
                    console.log('退款 发起失败：', err);
                })
        });

    }
}