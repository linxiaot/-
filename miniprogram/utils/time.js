function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatTimeMeifuhao(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatMonth(date) {
  var month = date.getMonth() + 1
  return month
}

function formatDay(date) {
  var day = date.getDate()
  return day
}

function formatshifenmiao(date) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [hour, minute, second].map(formatNumber).join(':')
}

function formatnianyueri(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatnianyueriYesterday7(date) {//7天前的日期
  // var date = new Date()
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
  return yesterday7
}
function formatnianyueriYesterday(date) {
  var day = date.getDate()
  if (day !== 1) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate() - 1
    var yesterday = [year, month, day].map(formatNumber).join('-')

  } else {
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

    var yesterday = data.endDate
  }
  return yesterday;
  // return data;
  // return [year, month, day].map(formatNumber).join('-')
}

function formatnianyueriTomorrow(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  // var day = date.getDate() + 1
  //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
  var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  //若是闰年，二月最后一天是29号
  if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
    daysInMonth[2] = 29;
  }

  if (day !== daysInMonth[month]) { //不是最后一天
    day++
  } else {
    if (month == 12) {
      year = date.getFullYear() + 1;
      month = 1;
    } else {
      month = month + 1
    }
    day = 1
    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }

  }
  var tomorrow = [year, month, day].map(formatNumber).join('-')

  return tomorrow;

}

function formatnianyueriTomorrow2(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate() + 1
  return [year, month, day].map(formatNumber).join('-')
}

function formatGetZhouli(date, num_day) { //计算从date开始几天 num_day后的日期

  var year = date.slice(0, 4) * 1
  var month = date.slice(5, 7) * 1
  var day = date.slice(8, 10) * 1
  // console.log(year,month,day);
  //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
  var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  //若是闰年，二月最后一天是29号
  if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
    daysInMonth[2] = 29;
  }

  // if (num_day < daysInMonth[month + 1] && num_day > daysInMonth[month]) {
  //   num_day = num_day - daysInMonth[month]
  // }
  // if (num_day < daysInMonth[month + 1] + daysInMonth[month] && num_day > daysInMonth[month]) {
  //   num_day = num_day - daysInMonth[month]
  // }




  if (day + num_day < daysInMonth[month]) {
    day += num_day
    // var day_item = day
  } else if (day + num_day == daysInMonth[month]) {
    day = daysInMonth[month]
  } else {
    day = num_day - (daysInMonth[month] - day)
    if (day == 0) {
      day = daysInMonth[month]
    }
    if (month == 12) {
      year += 1;
      month = 1;
    } else {
      month += 1
    }
  }
  var day_item = day
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }
  var tomorrow = [year, month, day].join('/')
  var tomorrows = [year, month, day].join('-')
  var month_day = tomorrow.slice(5, 10)
  var zhouLiArr_item = {
    month: String(Number(month)),
    month_day: month_day,
    day_item: day_item,
    tomorrows: tomorrows,
  }
  return zhouLiArr_item

}


function lastMonthDate(Nowdate) {

  // var Nowdate = new Date();
  var vYear = Nowdate.getFullYear();
  var vMon = Nowdate.getMonth() + 1;
  var vDay = Nowdate.getDate();
  //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
  var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
  if (vMon == 1) {
    vYear = Nowdate.getFullYear() - 1;
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
  return data;
}

module.exports = {
  formatTime: formatTime,
  formatTimeMeifuhao: formatTimeMeifuhao,
  formatMonth: formatMonth,
  formatDay: formatDay,
  formatshifenmiao: formatshifenmiao,
  formatnianyueri: formatnianyueri,
  formatnianyueriYesterday: formatnianyueriYesterday,
  formatnianyueriYesterday7: formatnianyueriYesterday7,
  formatnianyueriTomorrow: formatnianyueriTomorrow,
  // formatnianyueriTomorrow2: formatnianyueriTomorrow2,
  formatGetZhouli: formatGetZhouli,
  lastMonthDate,
}