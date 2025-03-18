// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})


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
var resBack = {
    errcode: 0,
    errmsg: ''
}
// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event);
    cloud.callFunction({
        name: 'yonghu',
        data: {
            chongzhi: true,
            _openid: event.userInfo.openId,
            totalFee: event.totalFee,
            dingdanhao: event.outTradeNo, 
            xd_time : getXd_time(),
        }
    })
    return resBack
}