// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env:'xmf-0g87mzf198205ada'
  })
const _ = cloud.database().command

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 云函数入口函数
exports.main = async (event, context) => {
// 当前触发器每天0点0分0秒触发
  
  var date = new Date()
  var nowday = date.getDate()
  if (nowday > 7) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate() - 7
    var yesterday7 = [year, month, day].map(formatNumber).join('-')

  } else if (nowday < 7) {
    var num = 7 - nowday
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

    var yesterday7 = data.endDate
  }
  if (nowday == 7) {
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

    var yesterday7 = data.endDate
  }
  // return await cloud.database().collection('jijian')
  cloud.database().collection('jijian')
    .where({
      // dd_Status: _.neq('3') // 状态  ！=3  的推送消息
      dd_Status: '1' // 状态  ！=4  的推送消息
    })
    .get()
    .then(res => {
      console.log('查询 [寄件] 未完成的订单：', res.data.length);
      console.log('date::', date, 'yesterday7::', yesterday7);
      res.data.forEach(element => {
        if (element.xd_time < yesterday7) {
          var _id = element._id
          console.log('每条记录的id', _id);
          // 改变状态
          cloud.database().collection('jijian')
            .doc(_id)
            .update({
              data: {
                dd_Status: '3', //推送成功后 改状态为 3
              }
            })
            .then(res => {
              console.log('改变状态3 成功', res);
            })
            .catch(err => {
              console.log('改变状态3 失败', err);
            })
        }
      });
      // return {'date':date,'yesterday7':yesterday7}
      // return res.data
    })
    .catch(err => {
      console.log(err);
    })
  cloud.database().collection('paotui')
    .where({
      dd_Status: '1'
    })
    .get()
    .then(res => {
      console.log('查询 [paotui] 未完成的订单：', res.data.length);
      console.log('date::', date, 'yesterday7::', yesterday7);
      res.data.forEach(element => {
        // if (element.xd_time < '2021-06-30') {
        if (element.xd_time < yesterday7) {
          var _id = element._id
          console.log('每条记录的id', _id);
          // 改变状态
          cloud.database().collection('paotui')
            .doc(_id)
            .update({
              data: {
                dd_Status: '3', //改状态为 3
              }
            })
            .then(res => {
              console.log('改变状态3 成功', res);
            })
            .catch(err => {
              console.log('改变状态3 失败', err);
            })
        }
      });
      // return {'date':date,'yesterday7':yesterday7}
      // return res.data
    })
    .catch(err => {
      console.log(err);
    })


    // 定期清理用来识别取货码的图片文件夹
    // cloud.dele


}