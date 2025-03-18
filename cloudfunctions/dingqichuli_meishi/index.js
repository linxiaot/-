// 云函数入口文件

// 取消的定时器

// "triggers": [
//     {
//       "name": "chufaqi_dingqichuli_meishi",
//       "type": "timer",
//       "config": "*/60 0-1 0,12 * * * *"
//     }
//   ]



const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
const dbCollection_meishi = cloud.database().collection('meishi')
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

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 云函数入口函数
exports.main = async (event, context) => {
    var date = new Date()
    var nowday = date.getDate()
    var year = date.getFullYear()
    var month = date.getMonth() + 1

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var songda_time = [year, month, nowday].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    if (nowday > 1) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate() - 1
        var yesterday1 = [year, month, day].map(formatNumber).join('-')

    } else if (nowday < 1) {
        var num = 1 - nowday
        var vYear = date.getFullYear();
        var vMon = date.getMonth() + 1;
        var vDay = date.getDate();
        //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
        var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        if (vMon == 1) {
            vYear = date.getFullYear() - 1;
            vMon = 12;
        } else {
            vMon = vMon - 1;
        }
        //若是闰年，二月最后一天是29号
        if (vYear % 4 == 0 && vYear % 100 != 0 || vYear % 400 == 0) {
            daysInMonth[2] = 29;
        }
        if (daysInMonth[vMon] < vDay) {
            vDay = daysInMonth[vMon];
        }
        if (vDay < 10) {
            vDay = "0" + vDay;
        }
        if (vMon < 10) {
            vMon = "0" + vMon;
        }
        var data = {};
        var yearBegin = vYear;
        var monthBegin = vMon;
        var dayBegin = '01';
        var day = new Date(vYear, vMon, 0).getDate(); // 当前月份天数
        var yearEnd = vYear;
        var monthEnd = vMon;
        var dayEnd = day - num;
        var startDate = yearBegin + '-' + monthBegin + '-' + dayBegin;
        var endDate = yearEnd + '-' + monthEnd + '-' + dayEnd;
        data.startDate = startDate;
        data.endDate = endDate;

        var yesterday1 = data.endDate
    }
    if (nowday == 1) {
        var vYear = date.getFullYear();
        var vMon = date.getMonth() + 1;
        var vDay = date.getDate();
        //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
        var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        if (vMon == 1) {
            vYear = date.getFullYear() - 1;
            vMon = 12;
        } else {
            vMon = vMon - 1;
        }
        //若是闰年，二月最后一天是29号
        if (vYear % 4 == 0 && vYear % 100 != 0 || vYear % 400 == 0) {
            daysInMonth[2] = 29;
        }
        if (daysInMonth[vMon] < vDay) {
            vDay = daysInMonth[vMon];
        }
        if (vDay < 10) {
            vDay = "0" + vDay;
        }
        if (vMon < 10) {
            vMon = "0" + vMon;
        }
        var data = {};
        var yearBegin = vYear;
        var monthBegin = vMon;
        var dayBegin = '01';
        var day = new Date(vYear, vMon, 0).getDate(); // 当前月份天数
        var yearEnd = vYear;
        var monthEnd = vMon;
        var dayEnd = day;
        var startDate = yearBegin + '-' + monthBegin + '-' + dayBegin;
        var endDate = yearEnd + '-' + monthEnd + '-' + dayEnd;
        data.startDate = startDate;
        data.endDate = endDate;

        var yesterday1 = data.endDate
    }

    var res_fenzhang = await cloud.database().collection('banner').doc('meishidata0001').get()
    var fenzhang_bili = res_fenzhang.data.fenzhang_bili//后台分账比例

    return await dbCollection_meishi
        .where({
            dd_Status: '0'
        })
        .count()
        .then(res => {
            console.log('符合状态0的订单数量', res.total);
            // var pageNum = Math.ceil(res.total / 1000) //向上取整
            var pageNum = 5
            for (let index = 0; index < pageNum; index++) {
                console.log('当前index', index);
                dbCollection_meishi
                    .where({
                        // dd_Status: _.neq('3') // 状态  ！=3  的推送消息
                        dd_Status: '0'
                    })
                    .skip(index * 100)
                    .get()
                    .then(res => {
                        console.log('查询 [meishi] 未完成的订单：', res.data.length);

                        res.data.forEach(element => {
                            if (element.xd_time < yesterday1) {
                            // if (element.xd_time < '2021-06-30') {
                                var _id = element._id
                                console.log('代取下单大于1天的id::', _id);
                                // 改变状态
                                // var fenzhang_list = event.fenzhang_list
                                // fenzhang_list.forEach(element => {
                        
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
                        
                                                dbCollection_meishi.doc(_id)
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
                                                dbCollection_meishi.doc(_id)
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
                                // });


                            }
                        });

                    })
                    .catch(err => {
                        console.log(err);
                    })

            }
            var res_return = {
                'date': date,
                'yesterday1': yesterday1,
                'pageNum': pageNum
            }
            console.log(res_return);
            return res_return
        })

}