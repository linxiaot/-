// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var _id = event.actionFilter._id
  // var yundanNum = event.payload.yundanNum
  // cloud.database().collection('jijian')
  return await cloud.database().collection('jijian')
    .where({
      // _id:'79550af260868455113bde0f231c3b67'
      _id: _id
    })
    .update({
      data:{
        dd_Status:'1'//cms后台监听更新后，改状态为1 需要下发消息
      }
    })
    .then(res => {
      console.log('云函数 webhook，更新订单状态：', res.stats.updated);
      // var _openid = res.data[0]._openid
      // var yundanNum = res.data[0].yundanNum
      // console.log('jichushuju 新建成功',_openid);
      // console.log('jichushuju 新建成功',yundanNum);
      // try {
      //   cloud.database().collection('jichushuju')
      //     .add({
      //       data: {
      //         _openid: _openid,
      //         company: '中通快递',
      //         // yundanNum: 'yundanNum',
      //         yundanNum: yundanNum,
      //       }
      //     })
      //     .then(res=>{
      //       console.log('jichushuju 新建成功');
      //     })
      // } catch (err) {
      //   console.log(err);
      //   // return err
      // }
      // // console.log();
      // return res
    })

}