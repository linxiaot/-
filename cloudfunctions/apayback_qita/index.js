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
        name: 'changedata',
        data: {
            action: 'changeStatus_zhifu',
            changeData: {
                timeName:'zf_time',
                dd_Status:'0',
                collection_name: 'qita', //其他
                gx_time:getXd_time(),
                dingdanhao: event.outTradeNo,
                tuikuandanhao:'T'+event.transactionId, 
            }
        }
    })
    .then(res => {
        console.log('订单状态更新成功', res.stats.updated);
    })
    .catch(err => {
        console.log(err);
    })

    return resBack
}