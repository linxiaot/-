// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    console.log(event);
    var dingdanhao = event.outTradeNo
    // cloud.database().collection('daiqu').where({
    //         dingdanhao,
    //     })
    //     .update({
    //         data: {
    //             dd_Status: '0' //已支付为0，未支付为1
    //         }
    //     })
    //     .then(res=>{
    //         console.log('更新状态 0 成功',res);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

    // 优化支付后，仅更新 dingdanhao 相同的第一条数据
    db.collection('daiqu').where({
        dingdanhao,
    }).get()
    .then(res=>{
        console.log('查询用户订单',res);
        db.collection('daiqu').doc(res.data[0]._id).update({
            data:{
                dd_Status:'0'
            }
        })
        .then(res=>{
            console.log('更新订单状态为已支付',res);
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err=>{
        console.log(err);
    })

    var resBack = {
        errcode: 0,
        errmsg: ''
    }
    return resBack
}