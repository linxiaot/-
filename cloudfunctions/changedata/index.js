// 云函数入口文件
const cloud = require('wx-server-sdk')

// request
const request = require('request-promise')

cloud.init({
  env: 'xmf-0g87mzf198205ada'
})


// 20230920 取消该接口 cloud.openapi.uniformMessage===================
// const gzhDataMsg = {}
// const miniproData = {}
// miniproData.appid = 'wxaad7b42349d83506'
// miniproData.page = 'pages/wode/dingdan/dingdan?isDaiqu=true'

// gzhDataMsg.appid = 'wx83be857ba915fcc5'
// gzhDataMsg.miniprogram = miniproData

// function tuisongFwh1(gzhOpenid, templateId, msgData) {
//   gzhDataMsg.templateId = templateId
//   gzhDataMsg.data = msgData
//   try {
//     cloud.openapi.uniformMessage.send({

//         "touser": gzhOpenid,
//         'mpTemplateMsg': gzhDataMsg

//       })
//       .then(res => {
//         console.log('gzh提醒：成功', res);
//         return res
//       })
//       .catch(err => {
//         console.log('gzh提醒：失败', err);
//         return err
//       })
//   } catch (err) {
//     console.log(err);
//   }
// }
// 20230920 取消该接口 cloud.openapi.uniformMessage===================



async function tuisongFwh(gzhOpenid, templateId, msgData, access_token) {
  // 20230924 使用原公众号模板消息
  var gzhDataMsg = {}
  var miniproData = {}
  miniproData.appid = 'wxaad7b42349d83506'
  miniproData.page = 'pages/wode/dingdan/dingdan?isDaiqu=true'

  // gzhDataMsg.appid = 'wx83be857ba915fcc5'
  gzhDataMsg.miniprogram = miniproData
  gzhDataMsg.template_id = templateId
  gzhDataMsg.data = msgData
  gzhDataMsg.touser = gzhOpenid
  gzhDataMsg = JSON.stringify(gzhDataMsg)
  console.log('gzhDataMsg:', gzhDataMsg);

  try {
    // 公众号发送模板消息
    var url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`
    var res = await request({
      url: url,
      method: 'POST',
      json: true,
      form: gzhDataMsg,

    })
    console.log('gzh发送模板消息：成功', res);

  } catch (err) {
    console.log('gzh发送模板消息：失败', err);

  }
}

async function get_access_token() {

  // 服务公众号参数
  var appid = 'wx83be857ba915fcc5'
  var appsecret = 'f40727f930ac0c8e5684f7af4017c35d'

  // 当前调用在有效期2小时内不消耗调用次数
  var url = `https://api.weixin.qq.com/cgi-bin/stable_token`
  var res = await request({
    url: url,
    method: 'post',
    json: true,
    form: JSON.stringify({
      "grant_type": "client_credential",
      "appid": appid,
      "secret": appsecret
    }),
  })
  console.log('get_access_token', res);
  // // return res
  // var access_token = res.access_token
  return res.access_token
}


var db = cloud.database()
var _ = db.command


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('wxContext:', wxContext);
  console.log('event', event);

  if (event.dd_Status) { //改变跑腿的状态为已完成
    event.idArr.forEach(element => {
      var _id = element
      cloud.database().collection(event.collection_name)
        .doc(_id)
        .update({
          data: {
            dd_Status: event.dd_Status,
          }
        })
        .then(res => {
          console.log('改变状态' + _id + event.dd_Status, +'成功', res);
        })
        .catch(err => {
          console.log('改变状态' + _id + event.dd_Status, +'失败', err);
        })
    });
  }
  // 改变状态
  if (event.action == 'changeStatus') {
    var changeData = event.changeData
    var timeName = changeData.timeName
    changeData.idArr.forEach(element => {
      var _id = element
      cloud.database().collection(changeData.collection_name)
        .doc(_id)
        .update({
          data: {
            dd_Status: changeData.dd_Status,
            [timeName]: changeData.gx_time
          }
        })
        .then(res => {
          console.log('改变状态' + _id + changeData.dd_Status, +'成功', res);
        })
        .catch(err => {
          console.log('改变状态' + _id + changeData.dd_Status, +'失败', err);
        })
    });
  }
  // 改变状态
  if (event.action == 'changeStatus_zhifu') {
    var changeData = event.changeData
    var timeName = changeData.timeName
    var dingdanhao = changeData.dingdanhao
    cloud.database().collection(changeData.collection_name)
      .where({
        dingdanhao,
      })
      .update({
        data: {
          dd_Status: changeData.dd_Status,
          [timeName]: changeData.gx_time,
          tuikuandanhao: changeData.tuikuandanhao,
        }
      })
      .then(res => {
        console.log('改变状态' + dingdanhao + '成功', res.stats.updated);
      })
      .catch(err => {
        console.log('改变状态' + dingdanhao + '失败', err);
      })

  }
  // 改变状态+评价
  if (event.action == 'changeStatus_pingjia') {
    var changeData = event.changeData
    // var timeName = changeData.timeName
    changeData.idArr.forEach(element => {
      var _id = element
      cloud.database().collection(changeData.collection_name)
        .doc(_id)
        .update({
          data: {
            dd_Status: changeData.dd_Status,
            // [timeName]: changeData.gx_time,
            pingjia: changeData.pingjia,
            // pingjia_fenshu:changeData.pingjia_fenshu,
          }
        })
        .then(res => {
          console.log('改变状态+评价' + _id + changeData.dd_Status, +'成功', res);
        })
        .catch(err => {
          console.log('改变状态+评价' + _id + changeData.dd_Status, +'失败', err);
        })
    });
  }
  // 改变状态 美食退款申请
  if (event.action == 'changeStatus_meishi') {
    var changeData = event.changeData
    var timeName = changeData.timeName
    var dingdan_id = changeData.dingdan_id
    cloud.database().collection(changeData.collection_name)
      .doc(dingdan_id)
      .update({
        data: {
          dd_Status: changeData.dd_Status,
          [timeName]: changeData.gx_time
        }
      })
      .then(res => {
        console.log('改变状态' + dingdan_id + changeData.dd_Status, +'成功', res);
        var openid = changeData.dianpu_openid //商家的openid
        cloud.openapi.subscribeMessage.send({
            touser: openid,
            page: 'pages/shangjia/shangjia',
            data: {
              // 订单编号
              character_string1: {
                value: changeData.dingdanhao
              },
              // 订单内容
              thing2: {
                value: changeData.dingdan_neirong
              },
              // 订单金额
              amount3: {
                value: changeData.shijiMoney
              },
              // 申请时间
              time6: {
                value: changeData.gx_time
              },
              // 备注
              thing7: {
                value: changeData.beizhu_tuisong
              },
            },
            templateId: '-G6RVeu03oB7Lcapnq4YXj5AME_RnuRoR6rZy3uyKdo', //退款申请通知
            // "miniprogramState": 'developer'
          })
          .then(res => {
            console.log('退款通知：成功', res);
            //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
            cloud.database().collection('user')
              .where({
                _openid: openid //商家的openid
              })
              .update({
                data: {
                  dingyue: _.shift() //删除数组的第一个元素
                }
              })
              .then(res => {
                console.log('dingyue 删除数组,成功', res);
              })
              .catch(err => {
                console.log('dingyue 删除数组,失败', err);
              })
          })
          .catch(err => {
            console.log('退款通知,发送失败', err);
          })
      })
      .catch(err => {
        console.log('改变状态' + dingdan_id + changeData.dd_Status, +'失败', err);
      })

  }
  // 改变状态 美食 商家提现
  if (event.action == 'changeStatus_tixian') {
    var changeData = event.changeData
    // var dingdan_id = changeData.dingdan_id
    changeData.dingdanid_list.forEach(element => {
      var dingdan_id = element._id
      cloud.database().collection('meishi')
        .doc(dingdan_id)
        .update({
          data: {
            // dd_Status: changeData.dd_Status,
            isTixian: true,
            tx_time: changeData.xd_time
          }
        })
        .then(res => {
          console.log('改变状态' + dingdan_id, +'成功', res);
          // var openid = changeData.dianpu_openid  //商家的openid
          // cloud.openapi.subscribeMessage.send({
          //     touser: openid, 
          //     page: 'pages/shangjia/shangjia',
          //     data: {
          //       // 订单编号
          //       character_string1:{value:changeData.dingdanhao},
          //       // 订单内容
          //       thing2:{value:changeData.dingdan_neirong},
          //       // 订单金额
          //       amount3:{value:changeData.shijiMoney},
          //       // 申请时间
          //       time6:{value:changeData.xd_time},
          //       // 备注
          //       thing7:{value:changeData.beizhu_tuisong},
          //     },
          //     templateId: '-G6RVeu03oB7Lcapnq4YXj5AME_RnuRoR6rZy3uyKdo', //退款申请通知
          //     // "miniprogramState": 'developer'
          //   })
          //   .then(res => {
          //     console.log('退款通知：成功', res);
          //     //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
          //     cloud.database().collection('user')
          //       .where({
          //         _openid: openid //商家的openid
          //       })
          //       .update({
          //         data: {
          //           dingyue: _.shift() //删除数组的第一个元素
          //         }
          //       })
          //       .then(res => {
          //         console.log('dingyue 删除数组,成功', res);
          //       })
          //       .catch(err => {
          //         console.log('dingyue 删除数组,失败', err);
          //       })
          //   })
          //   .catch(err => {
          //     console.log('退款通知,发送失败', err);
          //   })
        })
        .catch(err => {
          console.log('改变状态' + dingdan_id + '失败', err);
        })
    });
  }
  // 改变状态&发送消息 代取  // 不再使用
  if (event.action == 'changeStatus_daiqu') { //变更订阅消息模板，之后可删除
    var changeData = event.changeData
    changeData.go_daiqu_list.forEach(element => {
      var _id = element._id
      var _openid = element._openid
      cloud.database().collection(changeData.collection_name)
        .doc(_id)
        .update({
          data: {
            dd_Status: changeData.dd_Status,
            wc_time: changeData.gx_time
          }
        })
        .then(res => {
          console.log('改变状态daiqu' + _id + changeData.dd_Status, +'成功', res);
          // 送达消息通知
          cloud.openapi.subscribeMessage.send({
              // touser: event.openid,
              touser: _openid,
              page: 'pages/wode/dingdan/dingdan?isDaiqu=true',

              // 取件码{{character_string1.DATA}}
              // 终点{{thing5.DATA}}
              // 订单状态{{phrase3.DATA}}
              // 送达时间{{date2.DATA}}
              // 备注信息{{thing8.DATA}}
              data: {
                character_string1: {
                  value: element.qh_Ma
                }, //取件码
                thing5: {
                  value: element.sd_Didian
                }, //终点
                phrase3: {
                  value: '包裹已送达'
                }, //订单状态
                date2: {
                  value: changeData.gx_time
                }, //送达时间
                thing8: {
                  value: changeData.beizhu_tuisong
                }, //备注信息

              },
              templateId: 'vSKKPYBVtwLL3ZymuTI8gKDmltOKq56cNh0iHjaBC0E', //快递代取送达通知
              // "miniprogramState": 'developer'
            })
            .then(res => {
              console.log('快递代取送达通知：成功', _id, res);
            })
            .catch(err => {
              console.log('下快递代取送达通知,发送失败', _id, err);
            })
          // return res

        })
        .catch(err => {
          console.log('改变状态daiqu' + _id + changeData.dd_Status, +'失败', err);
        })
    });
  }
  // 改变状态&发送消息 代取
  if (event.action == 'changeStatus_daiqu_new') {

    var resToken = await cloud.database().collection('banner').doc('token').get()
    var access_token = resToken.data.access_token

    var changeData = event.changeData
    if (!changeData.gonghao) {
      changeData.gonghao = '无工号'
    }
    console.log('go_daiqu_list的数量', changeData.go_daiqu_list.length);
    changeData.go_daiqu_list.forEach(element => {
      var _id = element._id
      var _openid = element._openid
      cloud.database().collection(changeData.collection_name)
        .doc(_id)
        .update({
          data: {
            dd_Status: changeData.dd_Status,
            wc_time: changeData.gx_time,
            beizhu_tuisong: changeData.beizhu_tuisong,
            gonghao:changeData.gonghao
          }
        })
        .then(res => {
          console.log('改变状态daiqu成功:', res);
          console.log('_id:', _id);
          console.log('changeData:', changeData);
          // 送达消息通知
          cloud.openapi.subscribeMessage.send({
              // touser: event.openid,
              touser: _openid,
              page: 'pages/wode/dingdan/dingdan?isDaiqu=true',

              // 取件码{{thing1.DATA}}
              // 终点{{thing2.DATA}}
              // 订单状态{{phrase3.DATA}}
              // 送达时间{{time4.DATA}}
              // 备注信息{{thing5.DATA}}
              data: {
                thing1: {
                  value: (element.qh_Ma).slice(0, 20)
                }, //取件码
                thing2: {
                  value: element.sd_Didian
                }, //终点
                phrase3: {
                  value: '包裹已送达'
                }, //订单状态
                time4: {
                  value: changeData.gx_time
                }, //送达时间
                thing5: {
                  value: changeData.beizhu_tuisong
                }, //备注信息

              },
              // templateId: 'vSKKPYBVtwLL3ZymuTI8gKDmltOKq56cNh0iHjaBC0E', //快递代取送达通知
              templateId: 'bypgXdjPrl2xb57P00ZZxYoY0d7LKQ4ymGGMkwjHAdk', //代取已送达通知
              // "miniprogramState": 'developer'
            })
            .then(res => {
              console.log('快递代取送达通知：成功', _id, res);
            })
            .catch(err => {
              console.log('下快递代取送达通知,发送失败', _id, err);
              // 送达消息通知
              console.log('再发送一次');
              cloud.openapi.subscribeMessage.send({
                  // touser: event.openid,
                  touser: _openid,
                  page: 'pages/wode/dingdan/dingdan?isDaiqu=true',

                  // 取件码{{thing1.DATA}}
                  // 终点{{thing2.DATA}}
                  // 订单状态{{phrase3.DATA}}
                  // 送达时间{{time4.DATA}}
                  // 备注信息{{thing5.DATA}}
                  data: {
                    thing1: {
                      value: (element.qh_Ma).slice(0, 20)
                    }, //取件码
                    thing2: {
                      value: element.sd_Didian
                    }, //终点
                    phrase3: {
                      value: '包裹已送达'
                    }, //订单状态
                    time4: {
                      value: changeData.gx_time
                    }, //送达时间
                    thing5: {
                      value: changeData.beizhu_tuisong
                    }, //备注信息

                  },
                  // templateId: 'vSKKPYBVtwLL3ZymuTI8gKDmltOKq56cNh0iHjaBC0E', //快递代取送达通知
                  templateId: 'bypgXdjPrl2xb57P00ZZxYoY0d7LKQ4ymGGMkwjHAdk', //代取已送达通知
                  // "miniprogramState": 'developer'
                })
                .then(res => {
                  console.log('快递代取送达通知：成功', _id, res);
                })
                .catch(err => {
                  console.log('下快递代取送达通知,发送失败', _id, err);
                })
            })
          // return res


          var msgData = {}
          // 收件人
          msgData.thing18 = {
            value: (element.qh_Ma).slice(0, 20)
          }
          // 目的地
          msgData.thing3 = {
            value: element.sd_Didian
          }
          // 订单状态
          msgData.phrase5 = {
            value: '包裹已送达'
          }
          // 到达时间
          msgData.time4 = {
            value: changeData.gx_time
          }
          // 到达地点
          msgData.thing7 = {
            value: changeData.beizhu_tuisong
          }

          var gzhOpenid = element.gzhOpenid
          if (gzhOpenid) { // 用户下单已携带gzhOpenid
            console.log('gzhOpenid 已携带');
            // tuisongFwh1(gzhOpenid, 'gOESUCnm8rpjwohyy2-nQEZ1FmEhh8SeUo6keAOMe-k', msgData) // 货物到达目的地通知
            tuisongFwh(gzhOpenid, 'gOESUCnm8rpjwohyy2-nQEZ1FmEhh8SeUo6keAOMe-k', msgData, access_token) // 货物到达目的地通知

          }


        })
        .catch(err => {
          console.log('改变状态daiqu' + _id + changeData.dd_Status, +'失败', err);
        })
    });
  }
  // 代取 变更为取件中 
  if (event.action == 'changeStatus_daiqu_qujianzhong') {

    var changeData = event.changeData
    changeData.go_daiqu_list.forEach(element => {
      var _id = element._id
      // var _openid = element._openid
      cloud.database().collection(changeData.collection_name)
        .doc(_id)
        .update({
          data: {
            dd_Status: changeData.dd_Status,
            qujian_time: changeData.gx_time
          }
        })
        .then(res => {
          console.log('取件中变更成功dd_Status=2:', res);
          console.log('_id:', _id);
          console.log('changeData:', changeData);

        })
        .catch(err => {
          console.log('改变状态daiqu' + _id + changeData.dd_Status, +'失败', err);
        })
    });
  }

  // 改变状态&发送消息 代取
  if (event.action == 'changeStatus_paisong_zc') {
    var {
      go_daiqu_list,
      collection_name,
      changeData,

    } = event
    var liuzhuanName = '装车扫描上传'


    var resToken = await cloud.database().collection('banner').doc('token').get()
    var access_token = resToken.data.access_token


    if (event.action2 == '一键装车') { // 获取多个派送区域的数据 数组组装
      var {
        dateEnd,
        dateStart,
        // dd_Status,
        xd_time_name,
        paisongList
      } = event
      // var paisongqu = []
      // paisongList.forEach(element => {
      //   paisongqu.push({$regex:element})
      // });
      var chaxunList = []

      for (let index = 0; index < paisongList.length; index++) {
        const element = paisongList[index];

        var whereData = {
          [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
          // dd_Status: _.eq('0').or(_.eq('6')),
          // dd_Status: _.or([_.eq('0'),_.eq('2')]), // 待处理0，拒退6，取件中2
          dd_Status: '2', // 待处理0，拒退6，取件中2
          sd_Didian: {
            $regex: element
          }
          // sd_Didian:_.or([{$regex:'金翰林公寓'},{$regex:'琴湖'}]),
          // sd_Didian:_.or([{$regex:'金翰林'},{$regex:'琴湖'}]),
          // sd_Didian:{$regex:'金翰林公寓'}
          // sd_Didian:_.or(paisongqu)
          // dd_Status,
          // gonghao,
          // dd_Status: _.or([_.eq('7'), _.eq('3'), _.eq('8')]) // 已装车7,已送达
        }
        console.log('whereData', whereData);
        var res_count = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').count()
        console.log('总数', res_count.total);
        var pageNum = Math.ceil(res_count.total / 100) //向上取整
        // var chaxunList = []
        for (let index = 0; index < pageNum; index++) {
          var res = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').skip(index * 100).get()
          res.data.forEach(element => {
            // element.dingdanhaoSlice = element.dingdanhao.slice(-3)
            // element.sd_Didian = element.sd_Didian.replace('金翰林公寓：','金-')
            chaxunList.push(element)
          });
        }

      }

      // return chaxunList
      console.log('chaxunList', chaxunList.length);
      // return chaxunList.length
      go_daiqu_list = chaxunList
      collection_name = 'daiqu'
      liuzhuanName = '一键装车上传'
    }

    // 添加记录 unshift 添加到数组首位
    changeData.liuzhuan = _.unshift({
      name: liuzhuanName,
      time: changeData.zc_time,
      gonghao: changeData.gonghao,
    })

    // 获取idList
    var idList = []

    console.log('go_daiqu_list的数量', go_daiqu_list.length);
    go_daiqu_list.forEach(element => {
      idList.push(element._id) // 查询tuikuan中的订单

      var _id = element._id
      cloud.database().collection(collection_name) // changedata
        .doc(_id)
        .update({
          // data: {
          //   dd_Status: changeData.dd_Status,
          //   wc_time: changeData.gx_time,
          //   beizhu_tuisong: changeData.beizhu_tuisong
          // }
          data: changeData
        })
        .then(res => {
          console.log('改变状态daiqu成功:', res);
          console.log('_id:', _id);
          console.log('changeData:', changeData);

          // 发送公众号消息 =======
          var msgData = {}
          // 运单号
          msgData.character_string1 = {
            value: (element.qh_Ma).slice(0, 20)
          }
          // // 预计送达时间
          // msgData.time5 = {
          //   value: changeData.gx_time
          // }
          // 快递员
          msgData.thing4 = {
            value: '订单已装车派送中'
          }

          var gzhOpenid = element.gzhOpenid
          if (gzhOpenid) { // 用户下单已携带gzhOpenid
            console.log('gzhOpenid 已携带');
            // tuisongFwh(gzhOpenid, 'gOESUCnm8rpjwohyy2-nQEZ1FmEhh8SeUo6keAOMe-k', msgData, access_token) // 货物到达目的地通知
            tuisongFwh(gzhOpenid, 'I5VRIAlShtuZpufcFC2pmGlp3otHDcrtHzviHbzwr3o', msgData, access_token) // 包裹派送通知
          }

        })
        .catch(err => {
          console.log('派送装车失败', err);
          // console.log('派送装车失败', event);
        })
    });

    // 查询tuikuan集合中是否有订单，筛选出来 拒绝退款
    console.log('idList:', idList);
    var resT = await db.collection('tuikuan').where({
      daiqu_id: _.in(idList),
      isJutui: _.neq(true),
      isYunxu_tuikuan: false
    }).get()
    console.log('tuikuan是否有resT', resT);
    // var go_tuikuan_list = []
    // if (resT.data.length) {
    //   for (let index = 0; index < resT.data.length; index++) {
    //     const itemT = resT.data[index];
    //     go_daiqu_list.forEach(element => {
    //       if (itemT.daiqu_id == element._id) {
    //         go_tuikuan_list.push(element)
    //       }
    //     });
    //   }
    //   console.log('需要操作退款go_tuikuan_list',go_tuikuan_list);
    // }

    var go_tuikuan_list = resT.data
    if (go_tuikuan_list.length !== 0) {
      // 操作拒退
      var resT2 = await cloud.callFunction({
        name: 'apaytuikuan',
        data: {
          go_tuikuan_list,
          go_tuikuan_list_0: [], // 未微信支付的，代码上好像没有区别
          action: 'tuikuan_jutui',
        }
      })
      console.log('apaytuikuan云函数resT2', resT2);
    }

    return go_daiqu_list.length
  }


  // 改变订单状态为0，发送投柜信息，送达通知
  if (event.action == 'changeStatus_paisong_tg') {
    var {
      go_daiqu_list,
      collection_name,
      changeData,
      action2,
    } = event
    var resToken = await cloud.database().collection('banner').doc('token').get()
    var access_token = resToken.data.access_token

    console.log('go_daiqu_list的数量', go_daiqu_list.length);
    go_daiqu_list.forEach(element => {
      if (action2 == '连扫') { // 用于订单更新
        changeData.songdaInfo = element.songdaInfo
        changeData.guitiDatas = element.guitiDatas
      }
      var _id = element._id
      cloud.database().collection(collection_name)
        .doc(_id)
        .update({
          // data: {
          //   dd_Status: changeData.dd_Status,
          //   wc_time: changeData.gx_time,
          //   beizhu_tuisong: changeData.beizhu_tuisong
          // }
          data: changeData
        })
        .then(res => {
          console.log('改变状态daiqu成功:', res);
          console.log('_id:', _id);
          console.log('changeData:', changeData);

          // 发送订阅消息
          // 送达消息通知
          var thing5value = changeData.songdaInfo.replace('，密码如下', `密码：${changeData.guitiDatas.mima}`)
          if (action2 == '补差价') {
            thing5value = changeData.songdaInfo
          }
          if (action2 == '连扫') {
            thing5value = element.songdaInfo.replace('，密码如下', `密码：${element.guitiDatas.mima}`)
          }

          var _openid = element._openid
          cloud.openapi.subscribeMessage.send({
              // touser: event.openid,
              touser: _openid,
              page: 'pages/wode/dingdan/dingdan?isDaiqu=true',
              data: {
                thing1: {
                  value: (element.qh_Ma).slice(0, 20)
                }, //取件码
                thing2: {
                  value: (element.sd_Didian).slice(0, 20)
                }, //终点
                phrase3: {
                  value: '包裹已送达'
                }, //订单状态
                time4: {
                  value: changeData.wc_time
                }, //送达时间
                thing5: {
                  value: (thing5value).slice(0, 20)

                }, //备注信息

              },
              // templateId: 'vSKKPYBVtwLL3ZymuTI8gKDmltOKq56cNh0iHjaBC0E', //快递代取送达通知
              templateId: 'bypgXdjPrl2xb57P00ZZxYoY0d7LKQ4ymGGMkwjHAdk', //代取已送达通知
              // "miniprogramState": 'developer'
            })
            .then(res => {
              console.log('快递代取送达通知：成功', _id, res);
            })
            .catch(err => {
              console.log('下快递代取送达通知,发送失败', _id, err);
              // 送达消息通知
              console.log('再发送一次');
              cloud.openapi.subscribeMessage.send({
                  // touser: event.openid,
                  touser: _openid,
                  page: 'pages/wode/dingdan/dingdan?isDaiqu=true',
                  data: {
                    thing1: {
                      value: (element.qh_Ma).slice(0, 20)
                    }, //取件码
                    thing2: {
                      value: (element.sd_Didia).slice(0, 20)
                    }, //终点
                    phrase3: {
                      value: '包裹已送达'
                    }, //订单状态
                    time4: {
                      value: changeData.wc_time
                    }, //送达时间
                    thing5: {
                      value: (thing5value).slice(0, 20)
                    }, //备注信息

                  },
                  // templateId: 'vSKKPYBVtwLL3ZymuTI8gKDmltOKq56cNh0iHjaBC0E', //快递代取送达通知
                  templateId: 'bypgXdjPrl2xb57P00ZZxYoY0d7LKQ4ymGGMkwjHAdk', //代取已送达通知
                  // "miniprogramState": 'developer'
                })
                .then(res => {
                  console.log('快递代取送达通知：成功', _id, res);
                })
                .catch(err => {
                  console.log('下快递代取送达通知,发送失败', _id, err);
                })
            })
          // return res


          // 发送消息
          var gzhOpenid = element.gzhOpenid
          if (gzhOpenid) { // 用户下单已携带gzhOpenid
            console.log('gzhOpenid 已携带');
            if (action2 == '补差价') {
              // // 计费规则  // thing 20个以内字符
              // msgData.thing11 = {
              //   value: '需要补差，请私聊客服微信'
              // }
              // tuisongFwh(gzhOpenid, 'QMUyu-uOgwXYLC0rwnDO86YNJT4b_dSdPG9rwldudac', msgData, access_token) // 取件通知 含计费规则
              var msgData = {}
              // 收件人
              msgData.thing18 = {
                value: (element.qh_Ma).slice(0, 20)
              }
              // 目的地
              msgData.thing3 = {
                value: element.sd_Didian
              }
              // 订单状态
              msgData.phrase5 = {
                value: '包裹已送达'
              }
              // 到达时间
              msgData.time4 = {
                value: changeData.wc_time
              }
              // 到达地点
              msgData.thing7 = {
                value: changeData.songdaInfo
              }

              tuisongFwh(gzhOpenid, 'gOESUCnm8rpjwohyy2-nQEZ1FmEhh8SeUo6keAOMe-k', msgData, access_token) // 货物到达目的地通知

            } else {
              var thing2value = changeData.songdaInfo
              var character_string6value = changeData.guitiDatas.mima
              if (action2 == '连扫') {
                thing5value = element.songdaInfo
                character_string6value = element.guitiDatas.mima
              }
              var msgData = {}
              // 包裹名称   thing 20个以内字符
              msgData.thing10 = {
                value: (element.qh_Ma).slice(0, 20)
              }
              // 取件地址
              msgData.thing2 = {
                value: thing2value
              }
              // 取件码  //character_string6:: 32位以内数字、字母或符号
              msgData.character_string6 = {
                value: character_string6value
              }
              tuisongFwh(gzhOpenid, 'QMUyu-uOgwXYLC0rwnDO8x2wgRcq3vdt0t_LO66AJeA', msgData, access_token) // 取件通知 含取件码

            }
          }

        })
        .catch(err => {
          console.log('投柜失败', err);
          // console.log('投柜失败', event);
        })

      // if (action2 == '补差价') {
      //   console.log('补差登记');
      //   var {
      //     gonghaoid,
      //     go_daiqu_list
      //   } = event
      //   var addData = {
      //     _openid: wxContext.OPENID,
      //     gonghaoid,
      //   }
      //   for (let index = 0; index < go_daiqu_list.length; index++) {
      //     const element = go_daiqu_list[index];
      //     addData.dingdanDatas = element
      //     db.collection('bucha').add({
      //       data: addData,
      //     }).
      //     then(res => {
      //       console.log('补差登记成功',res);
      //     }).
      //     catch(err => {
      //       console.log('补差登记失败',err);
      //     })
      //   }
      // }
    });
  }


  // 改变状态 寄件后台
  if (event.action == 'changeStatus_jijian') {
    var changeData = event.changeData
    changeData.go_jijian_list.forEach(element => {
      var _id = element._id
      // var isYiqu = element.isYiqu
      // if (isYiqu == true) {
      //   isYiqu = false
      // } else {
      //   isYiqu = true
      // }
      cloud.database().collection(changeData.collection_name)
        .doc(_id)
        .update({
          data: {
            isYiqu: changeData.isYiqu,
            yq_time: changeData.gx_time
          }
        })
        .then(res => {
          console.log('改变状态jijian已取' + _id + '成功', res);

        })
        .catch(err => {
          console.log('改变状态jijian已取' + _id + '失败', err);
        })
    });
  }
}