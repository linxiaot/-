// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const request = require('request-promise')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})


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


function updateDatas(tablename, whereData, updateData) {
  cloud.database().collection(tablename).where(whereData).update({
      data: updateData
    })
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })
}



/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {
  console.log(event)
  // console.log(context)

  // 可执行其他自定义逻辑
  // console.log 的内容可以在云开发云函数调用日志查看

  // 获取 WX Context (微信调用上下文)，包括 OPENID、APPID、及 UNIONID（需满足 UNIONID 获取条件）等信息
  const wxContext = cloud.getWXContext()
  console.log('wxContext:', wxContext);


  /*
  若FROM_APPID存在，说明关注|取关了公众号 调用了消息推送
  根据 FROM_UNIONID 更新 FROM_OPENID ，

  原小程序用户先重新登陆
  再关注公众号即可绑定新的参数uinonid，gzhOpenid


  当前流程：
  用户关注公众号将新增记录到union集合
  生成uionid和 gzhOpenid 记录
  同时更新user中的unionid对应的 gzhOpenid
  如果 user 中没有，则不更新

  如果登陆小程序，则查询是否有uionid对应的 gzhOpenid,更新到user
  
  用户总是提示关注公众号，则需取关后重新关注


  */

  if (wxContext.FROM_APPID) { //公众号调用
    // if (wxContext.FROM_UNIONID) { //公众号调用 取关时FROM_UNIONID为空
    if (event.Event == 'subscribe') { //公众号调用 关注subscribe
      console.log('公众号用户 关注');
      var unionid = wxContext.FROM_UNIONID
      if (unionid == '') {
        console.log('用户的unionid 未从cloud.getWXContext()获取');
        // 主动获取公众号 openid 对应的 unionid oQTTs6dGk2svgin4M3ZkFhnn_CR8
        // var gzhOpenid = 'oWfLu6sars193VYX9XXWIaoQixfA'
        var gzhOpenid = wxContext.FROM_OPENID
        var resToken = await cloud.database().collection('banner').doc('token').get()
        var access_token = resToken.data.access_token
        var url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${gzhOpenid}&lang=zh_CN`
        var res = await request({
          url: url,
          // method: 'GET',
          // json: true,
          // form: gzhDataMsg,

        })
        console.log('通过用户的 gzhOpenid 获取 unionid', res);
        var resJson = JSON.parse(res)
        unionid = resJson.unionid
      }

      // 
      // 判断用户是否注册
      cloud.database().collection('union')
        .where({
          // unionid: wxContext.FROM_UNIONID,
          unionid,
        })
        .get()
        .then(res => {
          console.log('查询用户 union 记录数量', res.data.length, res)
          if (res.data.length == 0) {
            console.log('union未注册')

            console.log('添加到union')

            // 添加信息到union   
            cloud.database().collection('union').add({
                data: {
                  unionid: wxContext.FROM_UNIONID,
                  unionid,
                  gzhOpenid: wxContext.FROM_OPENID,
                }
              })
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
              })

            // 更新到user
            console.log('更新到user')
            cloud.database().collection('user').where({ // 不管用户是否在小程序端注册 都尝试更新
                // unionid: wxContext.FROM_UNIONID
                unionid,
              }).update({
                data: {
                  gzhOpenid: wxContext.FROM_OPENID
                }
              })
              .then(res => {
                console.log(res);
              })
              .catch(err => {
                console.log(err);
              })
          } else if (res.data.length !== 0) {
            console.log('union 已注册 无需新增')
            // cloud.database().collection('user').where({
            //     unionid: wxContext.FROM_UNIONID
            //   }).update({
            //     data: {
            //       gzhOpenid: wxContext.FROM_OPENID
            //     }
            //   })
            //   .then(res => {
            //     console.log(res);
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   })
          }
        })
    } else {
      console.log('公众号用户 取消关注');
    }

  } else { // 小程序调用  wxContext.FROM_OPENID 始终是空
    var gzhOpenid = null
    var res = await cloud.database().collection('union')
      .where({
        unionid: wxContext.UNIONID
        // unionid: wxContext.FROM_UNIONID
      }).get()
    console.log('小程序用户调用', res);
    // console.log('res',res);  
    if (res.data.length > 0) {
      gzhOpenid = res.data[0].gzhOpenid
    }


    // ====== 未升级最新版本前使用 =============================
    // user中有没有unionid
    var xcxopenid = wxContext.OPENID
    var xcxunionid = wxContext.UNIONID
    console.log('xcxopenid,xcxunionid', xcxopenid, xcxunionid);
    var res2 = await cloud.database().collection('user')
      .where({ // 有没有小程序用户
        _openid: xcxopenid
      }).get()

    console.log('user:res2', res2);
    if (res2.data.length > 0) { //有小程序用户
      if (!res2.data[0].gzhOpenid) { //没有gzhOpenid
        console.log('user中 gzhOpenid 没,需更新 union,gzhOpenid');
        updateDatas('user', {
          _openid: xcxopenid
        }, {
          gzhOpenid: gzhOpenid,
          unionid: xcxunionid,
        })
      } else { // 有 gzhOpenid
        console.log('user中 gzhOpenid 有');

      }

    }
    // ====== 未升级最新版本前使用 ==========================




    return {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
      env: wxContext.ENV,
      gzhOpenid,

    }
  }






  // // 判断用户是否注册
  // cloud.database().collection('user')
  //   .where({
  //     unionid: wxContext.FROM_UNIONID
  //   })
  //   .get()
  //   .then(res => {
  //     console.log('查询用户 openid 记录数量', res.data.length, res)
  //     if (res.data.length == 0) {
  //       console.log('[判断注册] 未注册')
  //       // 调用函数时，传入new Date()参数，返回值是日期和时间
  //       var zhuceTime = formatTime(new Date());

  //       // 未注册 则新增数据 to 云端 user
  //       cloud.database().collection('user').add({
  //         data: {
  //           nickName: '微信用户gzh',
  //           userPhoneNumber: '',
  //           city: '',
  //           gender: '',
  //           province: '',
  //           avatarUrl: '',
  //           jifen: [{
  //             jifen_name: '注册',
  //             jifen_num: 10,
  //             jifen_time: zhuceTime
  //           }], //首次注册积分初始值
  //           zhuceTime: zhuceTime,
  //           isYonghu: false,
  //           isAdmin: false,
  //           isShangjia: false,

  //           birthday: '',
  //           nianji: '',
  //           xueyuan: '',
  //           banji: '',
  //           xuehao: '',

  //           kebiaoImageUrl: '',
  //           qiandao: {},
  //           balance: 0,
  //           balance_jilu: [],

  //           unionid: wxContext.FROM_UNIONID,
  //           gzhOpenid: wxContext.FROM_OPENID
  //         },
  //         success: res => {
  //           console.log('注册数据 新增 成功', res)

  //         },
  //         fail: err => {
  //           console.log('注册数据 新增 失败', err)

  //         },

  //       })

  //     } else if (res.data.length !== 0) {
  //       console.log('[判断注册] 已注册 无需新增', res.data)
  //       // if (!res.data[0].unionid) {
  //       cloud.database().collection('user').doc(res.data[0]._id)
  //         .update({
  //           data: {
  //             // unionid: wxContext.FROM_UNIONID,
  //             gzhOpenid: wxContext.FROM_OPENID
  //           }
  //         })
  //         .then(res => {
  //           console.log(res);
  //         })
  //         .catch(err => {
  //           console.log(err);
  //         })
  //       // }

  //     }
  //   })










}