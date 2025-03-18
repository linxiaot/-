// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}



function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}


// 云函数入口函数
exports.main = async (event, context) => {
    console.log('更新token');

    var res_token = await cloud.callFunction({
        name: 'access_token',
        data: {

        }
    })
    console.log('res_token', res_token);
    for (let index = 0; index < 200; index++) {
        setTimeout(() => {  
            console.log(index);  
          }, 1 * 1000); // 设置延迟时间为i秒 
        if ((res_token.result.access_token.length>2)) {
            
            var gxTime = formatTime(new Date());
            var res = await cloud.database().collection('banner').doc('token').update({
                data: {
                    access_token: res_token.result.access_token,
                    gxTime: gxTime
                }
            })
            console.log('res',res);
            break
        }
        
        
    }
    return {
        res_token,
        res
    }
    // .then(res => {
    //     console.log('更新access_token成功：', res);
    //     return {
    //         res_token,
    //         res
    //     }
    // })
    // .catch(err2 => {
    //     console.log('更新access_token失败：', err2);
    // })

    // cloud.callFunction({
    //         name: 'access_token',
    //         data:{}
    //     }).then(res => {
    //         console.log('获取token成功', res);
    //         return res
    //         var gxTime = formatTime(new Date());
    //         // cloud.database().collection('banner').doc('token').update({
    //         //         data: {
    //         //             access_token: res.access_token,
    //         //             gxTime: gxTime
    //         //         }
    //         //     })
    //         //     .then(res2 => {
    //         //         console.log('更新access_token成功：', res2);
    //         //         return {res,res2}
    //         //     })
    //         //     .catch(err2 => {
    //         //         console.log('更新access_token失败：', err2);
    //         //     })
    //     })
    //     .catch(err => {
    //         console.log('获取token成功', err);
    //     })
}