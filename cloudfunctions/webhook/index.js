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
const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  var _id = event.actionFilter._id
  // var yundanNum = event.payload.yundanNum
  cloud.database().collection('jijian')
    .doc(_id)
    .update({
      data: {
        dd_Status: '2' //cms后台监听更新后，状态为 1改2 需要下发消息
      }
    })
    .then(res => {
      console.log('云函数 webhook，更新订单状态：', res.stats.updated);

      cloud.database().collection('jijian').doc(_id).get().then(res => {
        var _openid = res.data._openid
        cloud.database().collection('banner').doc('toptipsdaiqu').get().then(resBanner => {
          if (resBanner.data.jifen.isuse_songjifen_jijian == true) {
            var val_jifen_jijian = resBanner.data.jifen.val_jifen_jijian
            var jifen_jijian = {
              jifen_name: '寄件完成',
              jifen_num: val_jifen_jijian,
              jifen_time: getXd_time()
            }

            cloud.database().collection('user').where({
              _openid
            }).get().then(resUser => {
              var userId = resUser.data[0]._id
              cloud.database().collection('user').doc(userId)
                .update({
                  data: {
                    // jifen: event.jifen,
                    jifen: _.addToSet(jifen_jijian),
                  }
                })
                .then(res => {
                  console.log('[云函数] [积分] 更新 成功：', res)
                  // return res
                })
                .catch(err => {
                  console.log('[云函数] [积分] 更新 失败：', err)
                  // return err
                })
            })

          }

        })
      })

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