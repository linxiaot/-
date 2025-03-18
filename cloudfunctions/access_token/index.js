// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request-promise')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境




// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log(wxContext);


    // 服务公众号参数
    var appid = 'wx83be857ba915fcc5'
    var appsecret = 'f40727f930ac0c8e5684f7af4017c35d'

    // 每次调用消耗1次
    // 获取token
    var url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${appsecret}`
    var res = await request({
        url: url,
        method: 'get',
    })
    console.log('res', res);

    // var gxTime = formatTime(new Date());
    // var res2 = await cloud.database().collection('banner').doc('token').update({
    //     data: {
    //         access_token: res.access_token,
    //         gxTime: res.access_token
    //     }
    // })
    // console.log('res2', res2);
    return res

    // request({
    //     url: url,
    //     method: 'get', 
    // }).then(res=>{
    //     console.log('get_access_token', res);
    //     var gxTime = formatTime(new Date());
    //     cloud.database().collection('banner').doc('token').update({
    //         data: {
    //             access_token: res.access_token,
    //             gxTime: gxTime
    //         }
    //     }).then(res2 => {
    //         console.log('更新access_token成功：', res2);
    //     }).catch(err => {
    //         console.log('更新access_token失败：', err);

    //     })

    //     return res.access_token

    // }).catch(err=>{
    //     console.log('请求过程中发生错误：', err);
    // })




}