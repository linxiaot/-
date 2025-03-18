// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
const db = cloud.database()
const _ = db.command

function jingqueJiage(heji_money) {
    var heji_money_a = String(heji_money).slice(0, String(heji_money).indexOf('.'))
    var heji_money_len = heji_money_a.length + 2

    var heji_money_last = Number((heji_money).toPrecision(heji_money_len))
    return heji_money_last
}

//********仅作为后台操作 */

// 云函数入口函数
exports.main = async (event, context) => {
    if (event.action == 'chongzhi_1') {
        return await db.collection('user').where({
                balance_jilu: _.elemMatch({
                    jilu_num: _.eq(1),
                    jilu_name: '充值'
                })
            })
            .get()
            .then(res => {
                // console.log(res.data);
                // return res
                for (let index = 0; index < res.data.length; index++) {
                    const element = res.data[index];

                    // 开始处理
                    if (element._openid !== 'ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4') {
                    //  将1替换为0.01  1，balance -1 + 0.01
                    // 2.记录改1为0.01
                    // 进行修复处理 
                    console.log(element.balance, '异常余额');
                    element.balance_jilu.forEach(element1 => {
                        if (element1.jilu_num == 1) {
                            element1.jilu_num = 0.01
                        }
                    });
                    element.balance = element.balance_jilu.reduce(function (accumulator, currentValue) {
                        return accumulator + currentValue.jilu_num;
                    }, 0)

                    element.balance = jingqueJiage(element.balance)
                    console.log(element.balance, 'balance是');
                    console.log(element.balance_jilu, 'balance_jilu 是');
                    // return res
                    // return element.balance_jilu

                    // dic.balance_new = element.balance

                    db.collection('user').doc(element._id)
                        .update({
                            data: {
                                balance_jilu: element.balance_jilu,
                                balance: element.balance,
                                yc_time: '2020-01-06 22:36:00',
                                yc_text:'支付1分，充值了1元：充值26笔，支付了0.26，消费了5笔2元共10元，当前（-9.74元），已修改'
                            }
                        })
                        .then(res => {
                            console.log('更新成功jifen', res.stats.updated);
                            // 方便查看记录
                            var dic = {
                                _id: element._id,
                                _openid: element._openid,
                                nickName: element.nickName,
                                balance_new: element.balance,
                            }
                            console.log(dic);
                        })

                    }
                }
            })
    }
    if (event.action == 'chongzhi_3000') {
        return await db.collection('user').where({
                balance_jilu: _.elemMatch({
                    jilu_num: _.eq(3000)
                })
            })
            .get()
            .then(res => {
                // console.log(res.data);
                for (let index = 0; index < res.data.length; index++) {
                    const element = res.data[index];

                    // 开始处理
                    // if (element._openid == 'ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4') {
                    //  将3000替换为35  1，balance -3000 + 35
                    //2.记录改3000为35
                    //进行修复处理 
                    console.log(element.balance, '异常余额');
                    element.balance_jilu.forEach(element1 => {
                        if (element1.jilu_num == 3000) {
                            element1.jilu_num = 35
                        }
                    });
                    element.balance = jingqueJiage(element.balance - 3000 + 35)
                    // dic.balance_new = element.balance
                    // console.log(element.balance_jilu);
                    db.collection('user').doc(element._id)
                        .update({
                            data: {
                                balance_jilu: element.balance_jilu,
                                balance: element.balance
                            }
                        })
                        .then(res => {
                            console.log('更新成功jifen', res.stats.updated);
                            // 方便查看记录
                            var dic = {
                                _id: element._id,
                                _openid: element._openid,
                                nickName: element.nickName,
                                balance_new: element.balance,
                            }
                            console.log(dic);
                        })

                    // }
                }
            })
    }
    // 查询 积分 抵扣同时 蜂蜜值 也被扣的用户数量
    if (event.action == 'chongzhi_fushu') {
        return await db.collection('user').where({
            balance: _.lt(0),
            // balance_jilu: _.elemMatch({
            //     // jilu_num: _.eq(-2),
            //     jilu_num: _.lt(-2),
            // }),
            // jifen: _.elemMatch({
            //     jifen_num: _.eq(-200)
            // }),
            // balance_duokou2_time:_.exists(true)  //查看结果
        })
        .get()
        .then(res => {
            console.log(res.data);
            return res.data
            // var resNewlist = []
            // for (let index = 0; index < res.data.length; index++) {
            //     const element = res.data[index];
                
            //     var balance_duokou2_time = []
            //     var jifen = element.jifen
            //     var balance_jilu = element.balance_jilu
            //     jifen.forEach((element_jifen, i_jifen) => {
            //       balance_jilu.forEach((element_jilu,i_jilu) => {
            //         if (element_jilu.jilu_time == element_jifen.jifen_time && element_jilu.jilu_num == -2) {
            //           balance_duokou2_time.push(element_jilu.jilu_time)
            //           element_jilu.jilu_num = 0
            //           element.balance_duokou2_time = balance_duokou2_time
            //         }
            //       });
            //     });
            //     if (element.balance_duokou2_time) {
            //       resNewlist.push(element)
            //     }
            //     // // 多扣的蜂蜜值更新为 0   当前已处理：时间2022-04-24 21:17 
            //     // db.collection('user').doc(element._id)
            //     // // db.collection('user').doc("17453ede609323da07a417da19b98b4c")//43个
            //     // .update({
            //     //     data: {
            //     //         balance_jilu: element.balance_jilu,
            //     //         balance_duokou2_time:element.balance_duokou2_time,
            //     //     }
            //     // })
            //     // .then(res => {
            //     //     console.log('更新成功jifen', res.stats.updated);
            //     //     // 方便查看记录
            //     //     var dic = {
            //     //         _id: element._id,
            //     //         _openid: element._openid,
            //     //         nickName: element.nickName,
            //     //         balance_new: element.balance,
            //     //     }
            //     //     console.log(dic);
            //     // })
                
            // }
            // return resNewlist
        })
    }
    // 查询 积分 抵扣同时 蜂蜜值 也被扣的用户数量
    if (event.action == 'chongzhi_fushu_chuli') {
        return await db.collection('user').where({
            balance_jilu: _.elemMatch({
                jilu_num: _.eq(-2),
            }),
            jifen: _.elemMatch({
                jifen_num: _.eq(-200)
            }),
            balance:-2
            // balance_duokou2_time:_.exists(true)  //查看结果
        })
        .get()
        .then(res => {
            console.log(res.data);
            // return res.data

            var resNewlist = []
            for (let index = 0; index < res.data.length; index++) {
                const element = res.data[index];
                
                var balance_duokou2_time = []
                var jifen = element.jifen
                var balance_jilu = element.balance_jilu
                jifen.forEach((element_jifen, i_jifen) => {
                  balance_jilu.forEach((element_jilu,i_jilu) => {
                    if (element_jilu.jilu_time == element_jifen.jifen_time && element_jilu.jilu_num == -2) {
                      balance_duokou2_time.push(element_jilu.jilu_time)
                      element_jilu.jilu_num = 0
                      element.balance_duokou2_time = balance_duokou2_time
                    }
                  });
                });
                if (element.balance_duokou2_time) {
                  resNewlist.push(element)
                }
                // 多扣的蜂蜜值更新为 0   当前已处理：时间2022-05-06 11:21
                db.collection('user').doc(element._id)
                // db.collection('user').doc("17453ede609323da07a417da19b98b4c")//43个
                .update({
                    data: {
                        balance:0,//查询处理的为 balance：-2  
                        balance_jilu: element.balance_jilu,
                        balance_duokou2_time:element.balance_duokou2_time,
                    }
                })
                .then(res => {
                    console.log('更新成功jifen', res.stats.updated);
                    // 方便查看记录
                    var dic = {
                        _id: element._id,
                        _openid: element._openid,
                        nickName: element.nickName,
                        balance_new: element.balance,
                    }
                    console.log(dic);
                })
                
            }
            return resNewlist
        })
    }
}