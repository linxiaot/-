// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xmf-0g87mzf198205ada'
})
const _ = cloud.database().command
// 云函数入口函数 推送寄件给管理员
exports.main = async (event, context) => {
  // var openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4', 'ok1Nu5FRZw31wWyRGYGnn0b5UeSw', 'ok1Nu5FCGiBJxXopIb_LnH3G-ypY']

  var res_openid = await cloud.database().collection('banner').doc('adminopenidlist0001').get()
  var openidList = res_openid.data.openidList

  cloud.database().collection('jijian').where({
    dd_Status: _.lt('3'),
    tenant_id: event.tenant_id
  })
    .count()
    .then(res => {
      console.log('[云函数] [jijian]count 查询 成功：', res.total)
      // return res.total //目前总数173
      var pageNum = Math.ceil(res.total / 100) //向上取整
      for (let index = 0; index < pageNum; index++) {
        cloud.database().collection('jijian')
          .where({
            dd_Status: _.lt('3'),
            tenant_id: event.tenant_id
          })
          .skip(index * 100)
          .get()
          .then(res => {

            console.log('查询 [寄件] 未完成的订单：', res.data.length);
            res.data.forEach(element => {
              // 状态0的需要下发 [寄件预约已下单]
              if (element.dd_Status == '0') {
                // if (element.dd_Status == '4') {
                console.log(element._id);
                // 管理员openid列表
                // let openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4', 'ok1Nu5FRZw31wWyRGYGnn0b5UeSw', 'ok1Nu5FCGiBJxXopIb_LnH3G-ypY']
                // let openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4']
                var _id = element._id
                // var _openid = element._openid
                if (!element.qujDate) {
                  element.qujDate = ''
                }
                var qujTime = element.qujTime + '|' + element.qujDate
                var JJ_Didian = element.JJ_Didian
                var JJ_Name = element.JJ_Name
                var JJ_PhoNum = element.JJ_PhoNum
                var isXiugai = element.isXiugai
                if (!isXiugai) {
                  isXiugai = ''
                } else {
                  isXiugai = '(' + isXiugai + ')'
                }
                openidList.forEach(item => {
                  var openid = item.openid
                  // console.log('每条记录的id',_id);
                  cloud.openapi.subscribeMessage.send({
                      touser: openid, //仅发送给指定 管理员openid
                      // touser:_openid,
                      page: 'pages/xuanzq/xuanzq',
                      data: {
                        // 预约项目
                        thing3: {
                          value: '寄件预约' + isXiugai
                        },
                        // 预约时间段
                        character_string10: {
                          value: qujTime
                        },
                        // 预约地点
                        thing15: {
                          value: JJ_Didian
                        },
                        // 预约人
                        thing9: {
                          value: JJ_Name
                        },
                        // 电话
                        phone_number13: { //状态
                          value: JJ_PhoNum
                        },
                      },
                      templateId: 'WgZ1KHx64XOYlQEzwmjiXIBdSA_-iKaih6Hhli8rH_Y', //预约提醒
                      // "miniprogramState": 'developer'
                    })
                    .then(res => {
                      console.log('预约提醒：成功',item.nickname, res);
                    })
                    .catch(err => {
                      console.log('预约提醒,发送失败',item.nickname, err);
                    })
                  //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
                  cloud.database().collection('user')
                    // .doc(' -id')
                    .where({
                      _openid: openid //管理员的openid
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

                });

                // 改变推送状态 0-1
                cloud.database().collection('jijian')
                  .doc(_id)
                  .update({
                    data: {
                      dd_Status: '1', //推送成功后 改状态为 1
                    }
                  })
                  .then(res => {
                    console.log('改变状态1 成功', res);

                  })
                  .catch(err => {
                    console.log('推送状态 0改1 失败', err);
                  })
              }
              // 状态2的需要下发 [已寄出]
              if (element.dd_Status == '2') {
                var _id = element._id
                var _openid = element._openid
                var yundanNum = element.yundanNum
                var company = element.company
                // console.log('每条记录的id',_id);
                // 推送消息给用户
                cloud.openapi.subscribeMessage.send({
                    // touser: 'ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4',
                    touser: _openid,
                    page: 'pages/wode/dingdan/dingdan?isJijian=true',
                    data: {
                      phrase3: { //状态
                        value: '已寄出'
                      },
                      name9: { //快递公司
                        value: company
                      },
                      character_string10: { // 运单号
                        value: yundanNum
                      },
                    },
                    templateId: 'C0_vnn8_qAuO0uvzTqCsXasoGQroLsCOA9a1VMyKW0w', //物流状态提醒
                    // "miniprogramState": 'developer'
                  })
                  .then(res => {
                    console.log('[已寄出] 提醒：成功', res);

                  })
                  .catch(err => {
                    console.log('[已寄出] 提醒,失败', err);
                  })

                // 改变状态
                cloud.database().collection('jijian')
                  .doc(_id)
                  .update({
                    data: {
                      dd_Status: '3', //推送成功后 改状态为 3
                    }
                  })
                  .then(res => {
                    console.log('改变状态3 成功', res);
                  })

                //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
                cloud.database().collection('user')
                  // .doc(' -id')
                  .where({
                    _openid: _openid
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
              }
              // 状态2的需要下发 [已取消]
              if (element.dd_Status == '4') {
                // if (element.dd_Status == '4') {
                console.log(element._id);
                // 管理员openid列表
                // let openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4', 'ok1Nu5FRZw31wWyRGYGnn0b5UeSw', 'ok1Nu5FCGiBJxXopIb_LnH3G-ypY']
                // let openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4']
                var _id = element._id
                // var _openid = element._openid
                if (!element.qujDate) {
                  element.qujDate = ''
                }
                var qujTime = element.qujTime + '|' + element.qujDate
                var JJ_Didian = element.JJ_Didian
                var JJ_Name = element.JJ_Name
                var JJ_PhoNum = element.JJ_PhoNum
                openidList.forEach(item => {
                  var openid = item.openid
                  // console.log('每条记录的id',_id);
                  cloud.openapi.subscribeMessage.send({
                      touser: openid, //仅发送给指定 管理员openid
                      // touser:_openid,
                      page: 'pages/xuanzq/xuanzq',
                      data: {
                        // 预约项目
                        thing3: {
                          value: '取消寄件'
                        },
                        // 预约时间段
                        character_string10: {
                          value: qujTime
                        },
                        // 预约地点
                        thing15: {
                          value: JJ_Didian
                        },
                        // 预约人
                        thing9: {
                          value: JJ_Name
                        },
                        // 电话
                        phone_number13: { //状态
                          value: JJ_PhoNum
                        },
                      },
                      templateId: 'WgZ1KHx64XOYlQEzwmjiXIBdSA_-iKaih6Hhli8rH_Y', //预约提醒
                      // "miniprogramState": 'developer'
                    })
                    .then(res => {
                      console.log('取消预约提醒：成功', res);
                    })
                    .catch(err => {
                      console.log('取消预约提醒,发送失败', err);
                    })
                  //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
                  cloud.database().collection('user')
                    // .doc(' -id')
                    .where({
                      _openid: openid //管理员的openid
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

                });

                // 改变推送状态 0-1
                cloud.database().collection('jijian')
                  .doc(_id)
                  .update({
                    data: {
                      dd_Status: '5', //推送成功后 改状态为 5
                    }
                  })
                  .then(res => {
                    console.log('改变状态5 成功', res);

                  })
                  .catch(err => {
                    console.log('推送状态 4改5 失败', err);
                  })
              }
            });
            // return res
          })
          .catch(err => {
            console.log(err);
          })
      }
      // return res
      // return { '总数': res.total, 'pageNum':pageNum }
    })
    .catch(err => {
      console.log('[云函数] [jijian]count 查询 失败：', err)
      return err
    })


  // 跑腿
  cloud.database().collection('paotui').where({
      dd_Status: _.neq('3')
    })
    .count()
    .then(res => {
      console.log('[云函数] [paotui]count 查询 成功：', res.total)
      var pageNum = Math.ceil(res.total / 100) //向上取整
      for (let index = 0; index < pageNum; index++) {
        cloud.database().collection('paotui')
          .where({
            dd_Status: _.neq('3') // 状态  ！=3  的推送消息
          })
          .skip(index * 100)
          .get()
          .then(res => {

            console.log('查询 [paotui] 未完成的订单：', res.data.length);
            res.data.forEach(element => {
              // 状态0的需要下发 [寄件预约已下单]
              if (element.dd_Status == '0') {
                // if (element.dd_Status == '4') {
                console.log('状态0', element._id);
                // 管理员openid列表
                // let openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4', 'ok1Nu5FRZw31wWyRGYGnn0b5UeSw', 'ok1Nu5FCGiBJxXopIb_LnH3G-ypY']
                // let openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4']

                var _id = element._id
                var xxDizhi = element.xxDizhi
                var xxDizhi_slice = ''
                xxDizhi_slice = xxDizhi.slice(0, 20)
                var paotui_name = element.paotui_name
                var phone = element.phone
                openidList.forEach(item => {
                  var openid = item.openid
                  // console.log('每条记录的id',_id);
                  cloud.openapi.subscribeMessage.send({
                      touser: openid, //仅发送给指定 管理员openid
                      // touser:_openid,
                      page: 'pages/xuanzq/xuanzq',
                      data: {
                        // 预约项目
                        thing3: {
                          value: '跑腿预约'
                        },
                        // 预约时间段
                        character_string10: {
                          value: '-'
                        },
                        // 预约地点
                        thing15: {
                          value: xxDizhi_slice
                        },
                        // 预约人
                        thing9: {
                          value: paotui_name
                        },
                        // 电话
                        phone_number13: { //状态
                          value: phone
                        },
                      },
                      templateId: 'WgZ1KHx64XOYlQEzwmjiXIBdSA_-iKaih6Hhli8rH_Y', //预约提醒
                      // "miniprogramState": 'developer'
                    })
                    .then(res => {
                      console.log('预约提醒：成功', res);
                    })
                    .catch(err => {
                      console.log('预约提醒,发送失败', err);
                    })
                  //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
                  cloud.database().collection('user')
                    // .doc(' -id')
                    .where({
                      _openid: openid //管理员的openid
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

                });

                // 改变推送状态 0-1
                cloud.database().collection('paotui')
                  .doc(_id)
                  .update({
                    data: {
                      dd_Status: '1', //推送成功后 改状态为 1
                    }
                  })
                  .then(res => {
                    console.log('改变状态1 成功', res);

                  })
                  .catch(err => {
                    console.log('推送状态 0改1 失败', err);
                  })
              }
              // if (element.dd_Status == '0') {
              if (element.dd_Status == '4') {
                console.log('状态4', element._id);
                // 管理员openid列表
                // let openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4', 'ok1Nu5FRZw31wWyRGYGnn0b5UeSw', 'ok1Nu5FCGiBJxXopIb_LnH3G-ypY']
                // let openidList = ['ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4']

                var _id = element._id
                var xxDizhi = element.xxDizhi
                var xxDizhi_slice = ''
                xxDizhi_slice = xxDizhi.slice(0, 20)
                var paotui_name = element.paotui_name
                var phone = element.phone
                openidList.forEach(element => {
                  var openid = element.openid
                  // console.log('每条记录的id',_id);
                  cloud.openapi.subscribeMessage.send({
                      touser: openid, //仅发送给指定 管理员openid
                      // touser:_openid,
                      page: 'pages/xuanzq/xuanzq',
                      data: {
                        // 预约项目
                        thing3: {
                          value: '跑腿预约（取消）'
                        },
                        // 预约时间段
                        character_string10: {
                          value: '-'
                        },
                        // 预约地点
                        thing15: {
                          value: xxDizhi_slice
                        },
                        // 预约人
                        thing9: {
                          value: paotui_name
                        },
                        // 电话
                        phone_number13: { //状态
                          value: phone
                        },
                      },
                      templateId: 'WgZ1KHx64XOYlQEzwmjiXIBdSA_-iKaih6Hhli8rH_Y', //预约提醒
                      // "miniprogramState": 'developer'
                    })
                    .then(res => {
                      console.log('预约取消提醒：成功', res);
                    })
                    .catch(err => {
                      console.log('预约取消提醒,发送失败', err);
                    })
                  //删除 user 中 dingyue 数组中的一个元素，消耗一次订阅
                  cloud.database().collection('user')
                    // .doc(' -id')
                    .where({
                      _openid: openid //管理员的openid
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

                });

                // 改变推送状态 4-5
                cloud.database().collection('paotui')
                  .doc(_id)
                  .update({
                    data: {
                      dd_Status: '5', //推送成功后 改状态为 5
                    }
                  })
                  .then(res => {
                    console.log('改变状态5 成功', res);

                  })
                  .catch(err => {
                    console.log('推送状态 4改5 失败', err);
                  })
              }
            });
            // return res
          })
          .catch(err => {
            console.log(err);
          })
      }
      // return res
      // return { '总数': res.total, 'pageNum':pageNum }
    })
    .catch(err => {
      console.log('[云函数] [paotui]count 查询 失败：', err)
      return err
    })

}