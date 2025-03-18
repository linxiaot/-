// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})

const _ = cloud.database().command

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 云函数入口函数
exports.main = async (event, context) => {
    var date = new Date()
    var nowday = date.getDate()
    if (nowday > 2) {
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate() - 2
        var yesterday2 = [year, month, day].map(formatNumber).join('-')

    } else if (nowday < 2) {
        var num = 2 - nowday
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

        var yesterday2 = data.endDate
    }
    if (nowday == 2) {
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

        var yesterday2 = data.endDate
    }

    return await cloud.database().collection('daiqu')
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
                cloud.database().collection('daiqu')
                    .where({
                        // dd_Status: _.neq('3') // 状态  ！=3  的推送消息
                        dd_Status: '0'
                    })
                    .skip(index * 100)
                    .get()
                    .then(res => {
                        console.log('查询 [daiqu] 未完成的订单：', res.data.length);

                        res.data.forEach(element => {
                            if (element.xd_time < yesterday2) {
                            // if (element.xd_time < '2021-06-30') {
                                var _id = element._id
                                console.log('代取下单大于2天的id', _id);
                                // 改变状态
                                cloud.database().collection('daiqu')
                                    .doc(_id)
                                    .update({
                                        data: {
                                            dd_Status: '3', //推送成功后 改状态为 3
                                        }
                                    })
                                    .then(res => {
                                        console.log('代取 改变状态3 成功',_id, res.stats.updated)
                                    })
                                    .catch(err => {
                                        console.log('代取 改变 失败',_id, err);
                                    })
                            }
                        });

                    })
                    .catch(err => {
                        console.log(err);
                    })

            }
            var res_return = {
                'date': date,
                'yesterday2': yesterday2,
                'pageNum': pageNum
            }
            console.log(res_return);
            return res_return
        })

}