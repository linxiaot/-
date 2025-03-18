// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
const db = cloud.database()
const _ = db.command

//********仅作为后台操作 */

// 云函数入口函数
exports.main = async (event, context) => {
    var resList = []
    db.collection('user').where({
            qiandao: ''
        })
        .count()
        .then(res => {
            console.log('qiandao为空的数量', res.total);
            // var pageNum = Math.ceil(res.total / 500) //向上取整
            var pageNum = 1
            for (let index = 0; index < pageNum; index++) {
                db.collection('user').where({
                        qiandao: ''
                    })
                    .limit(1000)
                    .orderBy('zhuceTime', 'desc')
                    // .skip(index * 500)
                    .get()
                    .then(res => {
                        // console.log('res.data.length', res.data.length);
                        res.data.forEach(element => {
                            if (element.qiandao == "") {
                                // console.log('qiandao', element.nickName, element._id);
                                db.collection('user').doc(element._id)
                                    .update({
                                        data: {
                                            qiandao: _.set({
                                                dateQiandao: '',
                                                numQiandao: 0
                                            }),
                                        }
                                    })
                                    .then(res => {
                                        // console.log(res);
                                        console.log('qiandao 成功', element.nickName, element._id);
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        console.log('qiandao 失败', element.nickName, element._id);
                                    })
                            }
                            // if (element.balance_jilu == undefined) {
                            //     db.collection('user').doc(element._id)
                            //     .update({
                            //         data: {
                            //             // balance: 0,
                            //             // balance_jilu: []
                            //         }
                            //     })
                            //     .then(res => {
                            //             console.log('balance_jilu 成功', element.nickName, element._id);
                            //         })
                            //         .catch(err => {
                            //             console.log('balance_jilu 失败', element.nickName, element._id);
                            //         })
                            // }
                            // if (element.birthday == undefined) {
                            //     console.log('birthday', element.nickName, element._id);
                            //     db.collection('user').doc(element._id)
                            //         .update({
                            //             data: {
                            //                 birthday: '',
                            //                 nianji: '',
                            //                 xueyuan: '',
                            //                 banji: '',
                            //                 xuehao: '',
                            //             }
                            //         })
                            //         .then(res => {
                            //             console.log('birthday 成功', element.nickName, element._id);
                            //         })
                            //         .catch(err => {
                            //             console.log('birthday 失败', element.nickName, element._id);
                            //         })
                            // }
                            // if (element.kebiaoImageUrl == undefined) {
                            //     console.log('kebiaoImageUrl', element.nickName, element._id);
                            //     db.collection('user').doc(element._id)
                            //         .update({
                            //             data: {
                            //                 kebiaoImageUrl: '',
                            //             }
                            //         })
                            //         .then(res => {
                            //             console.log('kebiaoImageUrl 成功', element.nickName, element._id);
                            //         })
                            //         .catch(err => {
                            //             console.log('kebiaoImageUrl 失败', element.nickName, element._id);
                            //         })
                            // }

                        });
                    })
            }

        })
    db.collection('user').where({
            qiandao: _.eq({
                dateQiandao: '',
                numQiandao: 0
            }),
            jifen: {
                jifen_name: '签到'
            }

        })
        .count()
        .then(res => {
            console.log('签到不成功数量', res.total);
            // var pageNum = Math.ceil(res.total / 500) //向上取整
            var pageNum = 1
            for (let index = 0; index < pageNum; index++) {
                db.collection('user').where({
                        qiandao: _.eq({
                            dateQiandao: '',
                            numQiandao: 0
                        }),
                        jifen: {
                            jifen_name: '签到'
                        }
                    })
                    .limit(1000)
                    .orderBy('zhuceTime', 'desc')
                    // .skip(index * 500)
                    .get()
                    .then(res => {
                        // console.log(res.data.length);
                        res.data.forEach(element => {
                            // console.log('签到失败的', element.nickName, element._id);
                            var jifentimelist = []
                            element.jifen.forEach(element => {
                                if (element.jifen_name == '签到') {
                                    var date = element.jifen_time.slice(0, 10)
                                    jifentimelist.push(date)
                                }
                            });
                            var newArr = []
                            jifentimelist.forEach((element) => {
                                if (newArr.indexOf(element) == -1) {
                                    newArr.push(element)
                                }
                            });
                            if (newArr.length !== jifentimelist.length) {
                                console.log('签到失败,重复签到', element.nickName, element._id);

                                //进行修复处理 删除重复的
                                var newArr_jifen = []
                                var resdatajifen = []
                                element.jifen.forEach(element => {
                                    if (element.jifen_name == '签到') {
                                        var date = element.jifen_time.slice(0, 10)
                                        if (newArr_jifen.indexOf(date) == -1) {
                                            newArr_jifen.push(date)
                                            resdatajifen.push(element)
                                        }
                                    } else {
                                        resdatajifen.push(element)
                                    }
                                });
                                console.log(resdatajifen);
                                db.collection('user').doc(element._id)
                                    .update({
                                        data: {
                                            jifen: resdatajifen
                                        }
                                    })
                                    .then(res => {
                                        console.log('更新成功jifen', res.stats.updated);
                                    })
                            }
                        });
                    })
            }
        })
    // db.collection('user').doc('17453ede6083c2e003db3448635d7ea9')
    //     .get()
    //     .then(res => {
    //         console.log('获取自己的资料成功');
    //         //进行修复处理 删除重复的
    //         // res.data.forEach(element => {
    //         var newArr_jifen = []
    //         var resdatajifen = []
    //         res.data.jifen.forEach((element, index) => {
    //             if (element.jifen_name == '签到') {
    //                 var date = element.jifen_time.slice(0, 10)
    //                 if (newArr_jifen.indexOf(date) == -1) {
    //                     newArr_jifen.push(date)
    //                     resdatajifen.push(element)
    //                 }
    //             } else {
    //                 resdatajifen.push(element)
    //             }
    //         });
    //         console.log(resdatajifen);
    //         // db.collection('user').doc(element._id)
    //         db.collection('user').doc('17453ede6083c2e003db3448635d7ea9')
    //             .update({
    //                 data: {
    //                     jifen: resdatajifen
    //                 }
    //             })
    //             .then(res => {
    //                 console.log('更新成功', res);
    //             })
    //         // })
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

}