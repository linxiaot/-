// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  cloud.database().collection('jijian')
  // cloud.database().collection('jichushuju')
    .where({
      // _id: _.exists(true)
      // dd_Status:'1'  // 状态为1的推送消息
      dd_Status:_.lt(3)  // 状态  小于3  的推送消息
    })
    .get()
    .then(res => {
      console.log('查询 [寄件] 成功： ', res);
      // console.log('查询 [jichushuju] 成功： ', res);
      res.data.forEach(element => {
        if (dd_Status == '1') {
          var _id = element._id
          var _openid = element._openid
          var yundanNum = element.yundanNum
          // var company = element.company
          // console.log('每条记录的id',_id);
          // console.log('每条记录的_openid',_openid);
          // console.log('每条记录的 yundanNum',yundanNum);
          cloud.openapi.subscribeMessage.send({
            // touser: 'ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4',
            touser:_openid,
            page: 'pages/wode/dingdan/dingdan?isJijian=true',
            data: {
              phrase3: { //状态
                value: '已寄出'
              },
              name9: { //快递公司
                value: 'company'
              },
              character_string10: { // 运单号
                value: yundanNum
              },
            },
            templateId: 'C0_vnn8_qAuO0uvzTqCsXasoGQroLsCOA9a1VMyKW0w',//物流状态提醒
            // "miniprogramState": 'developer'
          })
          .then(res=>{
            console.log('推送后的结果：成功', res);
            cloud.database().collection('jijian')
            .doc(_id)
            .update({
              data:{
                dd_Status:'2',//推送成功后 改状态为 2
              }
            })
          })
          .catch(err=>{
            console.log('推送后的结果,失败', err);
          })
        
        }
      });
      // return res
    })
    .catch(err=>{
      console.log(err);
    })

}