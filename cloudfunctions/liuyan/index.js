// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init('xmf-0g87mzf198205ada')
const _ = cloud.database().command

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

var nowTime = formatTime(new Date())
// 云函数入口函数
exports.main = async (event, context) => {
    // if (event.detailType == 'xunwu' && event.isShowliuyan) {
    if (event.isShowliuyan) { //可删除
        cloud.database().collection(event.detailType).doc(event._id)
            .update({
                data: {
                    // dingyue: _.addToSet(event.dingyue),
                    liuyan: _.push(event.liuyan),
                }
            })
            .then(res => {
                console.log('[云函数] [liuyan] 更新 成功：', res)
            })
            .catch(err => {
                console.log('[云函数] [liuyan] 更新 失败：', err)
            })
    } else if (event.isShowliuyan_new) {
        cloud.database().collection('banner').doc('toptipsdaiqu')
            .get()
            .then(res => {
                console.log('后台主参数 toptipsdaiqu：：', res.data);
                var jifen_num = res.data.jifen.val_jifen_pinglun

                cloud.database().collection(event.detailType).doc(event._id)
                    .update({
                        data: {
                            liuyan: _.push(event.liuyan),
                        }
                    })
                    .then(res => {
                        console.log('[云函数] [liuyan] 更新 成功：', res)

                        //查询今天有没有 评论
                        cloud.database().collection('user').doc(event.userId)
                            .get()
                            .then(res => {
                                console.log('查询成功', res);
                                // 如果今天没有 评论 则更新 评论 时间
                                if (res.data.datePinglun !== event.todayNianyueri) {
                                    //加积分
                                    var jifen = {
                                        jifen_name: '当日评论',
                                        jifen_num,
                                        jifen_time: event.nowTime
                                    }
                                    cloud.database().collection('user').doc(event.userId)
                                        .update({
                                            data: {
                                                datePinglun: event.todayNianyueri,
                                                jifen: _.addToSet(jifen)
                                            }
                                        })
                                        .then(res => {
                                            console.log('评论 日期更新成功', res);

                                        })
                                        .catch(err => {
                                            console.log('评论 日期更新失败', err);
                                        })
                                }
                            })
                            .catch(err => {
                                console.log('查询失败', err);
                            })


                    })
                    .catch(err => {
                        console.log('[云函数] [liuyan] 更新 失败：', err)
                    })

            })
            .catch(err => {
                console.log('后台主参数 toptipsdaiqu：： 失败', err);
            })
    } else if (event.isShowjiaohu) {
        var jiaohu = 'liuyan.' + event.jiaohuIndex + '.jiaohu'
        return await cloud.database().collection(event.detailType).doc(event._id)
            .update({
                data: {
                    [jiaohu]: _.push(event.jiaohu),
                }
            })
            .then(res => {
                console.log('[云函数] [jiaohu] 更新 成功：', res)
                return res
            })
            .catch(err => {
                console.log('[云函数] [jiaohu] 更新 失败：', err)
                return err
            })
    } else if (event.like) { //可删除
        if (event.isDianzan) {
            console.log(1);
            var dianzan = 'dianzan.' + event.dianzanIndex + '.isLike'
            cloud.database().collection(event.detailType).doc(event._id)
                .update({
                    data: {
                        // isLike: event.isLike,
                        // dianzan: _.push(event.dianzan),
                        [dianzan]: event.isLike
                    }
                })
                .then(res => {
                    console.log('[云函数] [like] 更新 成功：', res)
                })
                .catch(err => {
                    console.log('[云函数] [like] 更新 失败：', err)

                })
        } else {
            console.log(2);
            cloud.database().collection(event.detailType).doc(event._id)
                .update({
                    data: {
                        // isLike: event.isLike,
                        dianzan: _.push(event.dianzan),
                    }
                })
                .then(res => {
                    console.log('[云函数] [like] 更新 成功：', res)
                })
                .catch(err => {
                    console.log('[云函数] [like] 更新 失败：', err)
                })
        }
    } else if (event.isDelLiuyan) {
        if (event.floor == 0) {
            var liuyan = 'liuyan'
        } else if (event.floor == 1) {
            var liuyan = 'liuyan.' + event.delliuyIndex + '.jiaohu'
        }
        return await cloud.database().collection(event.detailType).doc(event._id)
            .update({
                data: {
                    [liuyan]: _.pull({
                        value: event.liuyan_val
                    })
                }
            })
            .then(res => {
                console.log('[云函数] [isDelLiuyan] 更新 成功：', res)
                return res
            })
            .catch(err => {
                console.log('[云函数] [isDelLiuyan] 更新 失败：', err)
                return err
            })
    } else if (event.like_new) {
        cloud.database().collection('banner').doc('toptipsdaiqu')
            .get()
            .then(res => {
                console.log('后台主参数 toptipsdaiqu：：', res.data);
                var jifen_num = res.data.jifen.val_jifen_dianzan
                if (event.isDianzan) {
                    console.log(1);
                    var dianzan = 'dianzan.' + event.dianzanIndex + '.isLike'
                    cloud.database().collection(event.detailType).doc(event._id)
                        .update({
                            data: {
                                [dianzan]: event.isLike
                            }
                        })
                        .then(res => {
                            console.log('[云函数] [like_new] 更新 成功：', res)
                            if (event.isLike == true) {
                                //查询今天有没有点赞
                                cloud.database().collection('user').doc(event.userId)
                                    .get()
                                    .then(res => {
                                        console.log('查询成功', res);
                                        // 如果今天没有点赞 则更新点赞时间
                                        if (res.data.dateDianzan !== event.todayNianyueri) {
                                            //加积分
                                            var jifen = {
                                                jifen_name: '当日点赞',
                                                jifen_num,
                                                jifen_time: event.nowTime
                                            }
                                            cloud.database().collection('user').doc(event.userId)
                                                .update({
                                                    data: {
                                                        dateDianzan: event.todayNianyueri,
                                                        jifen: _.addToSet(jifen)
                                                    }
                                                })
                                                .then(res => {
                                                    console.log('点赞日期更新成功', res);

                                                })
                                                .catch(err => {
                                                    console.log('点赞日期更新失败', err);
                                                })
                                        }
                                    })
                                    .catch(err => {
                                        console.log('查询失败', err);
                                    })
                            }

                        })
                        .catch(err => {
                            console.log('[云函数] [like_new] 更新 失败：', err)

                        })
                } else { //没有点过赞 无法定位index
                    console.log(2);
                    cloud.database().collection(event.detailType).doc(event._id)
                        .update({
                            data: {
                                // isLike: event.isLike,
                                dianzan: _.push(event.dianzan),
                            }
                        })
                        .then(res => {
                            console.log('[云函数] [like_new] 更新 成功：', res)
                            if (event.isLike == true) {
                                //查询今天有没有点赞
                                cloud.database().collection('user').doc(event.userId)
                                    .get()
                                    .then(res => {
                                        console.log('查询成功', res);
                                        // 如果今天没有点赞 则更新点赞时间
                                        if (res.data.dateDianzan !== event.todayNianyueri) {
                                            //加积分
                                            var jifen = {
                                                jifen_name: '当日点赞',
                                                jifen_num,
                                                jifen_time: event.nowTime
                                            }
                                            cloud.database().collection('user').doc(event.userId)
                                                .update({
                                                    data: {
                                                        dateDianzan: event.todayNianyueri,
                                                        jifen: _.addToSet(jifen)
                                                    }
                                                })
                                                .then(res => {
                                                    console.log('点赞日期更新成功', res);

                                                })
                                                .catch(err => {
                                                    console.log('点赞日期更新失败', err);
                                                })
                                        }
                                    })
                                    .catch(err => {
                                        console.log('查询失败', err);
                                    })
                            }
                        })
                        .catch(err => {
                            console.log('[云函数] [like_new] 更新 失败：', err)
                        })
                }
            })
            .catch(err => {
                console.log('后台主参数 toptipsdaiqu：： 失败', err);
            })
    } else if (event.isZiliaoPercent) {
        //查询 ziliaopercent 是否达到100% 过
        cloud.database().collection('user').doc(event.userId)
            .get()
            .then(res => {
                console.log('查询成功', res);
                var isZiliaoPercent = res.data.isZiliaoPercent
                if (isZiliaoPercent !== true) {

                    //加积分
                    cloud.database().collection('banner').doc('toptipsdaiqu')
                        .get()
                        .then(res => {
                            console.log('后台主参数 toptipsdaiqu：：', res.data);
                            var jifen_num = res.data.jifen.val_jifen_ziliaopercent
                            var jifen = {
                                jifen_name: '个人资料完整度100%',
                                jifen_num,
                                jifen_time: event.nowTime
                            }
                            cloud.database().collection('user').doc(event.userId)
                                .update({
                                    data: {
                                        jifen: _.addToSet(jifen),
                                        isZiliaoPercent: event.isZiliaoPercent,
                                    }
                                })
                                .then(res => {
                                    console.log('积分成功', res);

                                })
                                .catch(err => {
                                    console.log('积分失败', err);
                                })
                        })
                        .catch(err => {
                            console.log('后台主参数 toptipsdaiqu：： 失败', err);
                        })

                }

            })
            .catch(err => {
                console.log('查询失败', err);
            })
    }
}