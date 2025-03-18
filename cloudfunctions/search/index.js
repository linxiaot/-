// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})

// 云函数入口函数

exports.main = async (event, context) => {
    const _ = cloud.database().command
    const $ = cloud.database().command.aggregate
    var searchTypelist = [
        'xunwu',
        'huangye',
        'pinche',
        'ershou',
        'bigthings',
        'zufang',
        'jianzhi',
        'huzhu',
        'shangjia',
        // 'qita',
    ]
    var hunheSearchList = [{
            name: 'xunwu',
            hunheSearch: ["$name", "$jianjie"]
        },
        {
            name: 'huangye',
            hunheSearch: ["$name", "$jianjie", "$address"]
        },
        {
            name: 'pinche',
            hunheSearch: ["$xingch", "$shijian", "$personNum"]
        },
        {
            name: 'ershou',
            hunheSearch: ["$name", "$jianjie"]
        },
        {
            name: 'bigthings',
            hunheSearch: ["$name", "$jianjie"]
        },
        {
            name: 'zufang',
            hunheSearch: ["$name", "$huxing", "$louceng", "$jianjie"]
        },
        {
            name: 'jianzhi',
            hunheSearch: ["$name", "$xinzi", "$shiduan", "$jianjie"]
        },
        {
            name: 'huzhu',
            hunheSearch: ["$jianjie", "$lianxi"]
        },
        {
            name: 'shangjia',
            hunheSearch: ["$name", "$qisong"]
        },
        // {
        //     name: 'qita',
        //     hunheSearch: ["$picker_0", "$picker_1", "$picker_2", "$text_title","$picker_zhifu","$input_0","$input_1","$input_2","$input_3","$input_4"]
        // },
    ]

    if (event.searchType == 'daiqu' || event.searchType == 'jijian' || event.searchType == 'paotui'|| event.searchType == 'qita') {
        //订单搜索
        var db = cloud.database().collection(event.searchType)
        return await db.where({
            _openid: event._openid,
            dd_Status:_.neq('1')
            })
            .get()
            .then(res => {
                console.log('订单 搜索成功', res);
                return res.data
            })
            .catch(console.error())

        //  else if (event.searchType == 'zufang') {
        //     var db = cloud.database().collection(event.searchType)
        //     var res_count = await db.where({
        //             isXiajia: false
        //         })
        //         .count()
        //     var pageNum = Math.ceil(res_count.total / 20) //向上取整
        //     for (let index = 0; index < pageNum; index++) {
        //         const resultHunhe = await db.aggregate().project({
        //                 isHege: 1,
        //                 hunheSearch: ["$name", "$huxing", "$louceng", "$jianjie"]
        //             })
        //             .skip(index * 20)
        //             .end()
        //         var result = []
        //         resultHunhe.list.forEach(element => {
        //             var elementHunhe = element.hunheSearch.join('')
        //             if (elementHunhe.includes(event.searchword) && element.isHege) {
        //                 result.push(element)
        //             }
        //         });
        //     }

        //     return result
        // } else if (event.searchType == 'pinche') {
        //     var db = cloud.database().collection(event.searchType)
        //     var res_count = await db.where({
        //             isXiajia: false
        //         })
        //         .count()
        //     var pageNum = Math.ceil(res_count.total / 20) //向上取整
        //     for (let index = 0; index < pageNum; index++) {
        //         const resultHunhe = await db.aggregate().project({
        //                 isHege: 1,
        //                 hunheSearch: ["$xingch", "$shijian", "$personNum"]
        //             })
        //             .skip(index * 20)
        //             .end()
        //         var result = []
        //         resultHunhe.list.forEach(element => {
        //             var elementHunhe = element.hunheSearch.join('')
        //             if (elementHunhe.includes(event.searchword) && element.isHege) {
        //                 result.push(element)
        //             }
        //         });
        //     }
        //     return result
        // } else if (event.searchType == 'jianzhi') {
        //     var db = cloud.database().collection(event.searchType)
        //     var res_count = await db.where({
        //             isXiajia: false
        //         })
        //         .count()
        //     var pageNum = Math.ceil(res_count.total / 20) //向上取整
        //     for (let index = 0; index < pageNum; index++) {
        //         const resultHunhe = await db.aggregate()
        //             .project({
        //                 isHege: 1,
        //                 hunheSearch: ["$name", "$xinzi", "$shiduan", "$jianjie"]
        //             })
        //             .skip(index * 20)
        //             .end()
        //         var result = []
        //         resultHunhe.list.forEach(element => {
        //             var elementHunhe = element.hunheSearch.join('')
        //             if (elementHunhe.includes(event.searchword) && element.isHege) {
        //                 result.push(element)
        //             }
        //         });
        //     }
        //     console.log('搜索兼职成功', resultHunhe);
        //     return result
        // } else if (event.searchType == 'huangye') {
        //     var db = cloud.database().collection(event.searchType)
        //     var res_count = await db.where({
        //             isXiajia: false
        //         })
        //         .count()
        //     var pageNum = Math.ceil(res_count.total / 20) //向上取整
        //     for (let index = 0; index < pageNum; index++) {

        //         const resultHunhe = await db.aggregate().project({
        //                 isHege: 1,
        //                 hunheSearch: ["$name", "$jianjie", "$address"]
        //             })
        //             .skip(index * 20)
        //             .end()
        //         var result = []
        //         resultHunhe.list.forEach(element => {
        //             var elementHunhe = element.hunheSearch.join('')
        //             if (elementHunhe.includes(event.searchword) && element.isHege) {
        //                 result.push(element)
        //             }
        //         });

        //     }
        //     console.log('搜索黄页成功', resultHunhe);
        //     return result
    } else if (event.searchType == 'shouye') {

        var resultList = []

        for (let index = 0; index < searchTypelist.length; index++) {
            var result = []
            var resultList_item = {}
            var searchType = searchTypelist[index];
            var hunheSearch = hunheSearchList[index].hunheSearch;

            var db = cloud.database().collection(searchType)
            var res_count = await db.where({
                    isXiajia: false
                })
                .count()

            var pageNum = Math.ceil(res_count.total / 20) //向上取整

            for (let index = 0; index < pageNum; index++) {
                var resultHunhe = await db.aggregate().project({
                        isHege: 1,
                        hunheSearch,
                        // hunheSearch: ["$jianjie"]
                    })
                    .skip(index * 20)
                    .end()

                resultHunhe.list.forEach(element => {
                    var elementHunhe = element.hunheSearch.join('')
                    if (elementHunhe.includes(event.searchword) && element.isHege) {
                        result.push(element)
                    }
                });
                console.log('搜索 ' + searchType + ' 成功resultHunhe', resultHunhe);
                resultList_item.searchType = searchType
                resultList_item.result = result
                resultList.push(resultList_item)
            }
        }
        return resultList

    } else if (event.searchType == 'xunwu') { // xunwu

        var db = cloud.database().collection(event.searchType)
        var res_count = await db.where({
                isXiajia: false
            })
            .count()
        console.log(res_count.total);
        var pageNum = Math.ceil(res_count.total / 20) //向上取整
        var result = []
        for (let index = 0; index < pageNum; index++) {

            var db = cloud.database().collection(event.searchType)
            const resultIndexOfCP = await db.aggregate().project({
                    aStrIndex: $.indexOfCP(['$jianjie', event.searchword])
                })
                .skip(index * 20)
                .end()
            var idArr = []
            resultIndexOfCP.list.forEach(element => {
                if (element.aStrIndex != -1) {
                    idArr.push(element._id)
                }
            });
            var res = await cloud.database().collection(event.searchType)
                .where({
                    _id: _.in(idArr)
                })
                .skip(index * 20)
                .get()

            console.log('搜索 ' + event.searchType + 'res', res);
            res.data.forEach(element => {
                result.push(element)
            });
        }
        return result

    } else if (event.searchType == 'huangye' || event.searchType == 'pinche' || event.searchType == 'ershou' || event.searchType == 'bigthings' || event.searchType == 'zufang' || event.searchType == 'jianzhi' || event.searchType == 'huzhu') {
        var index = searchTypelist.indexOf(event.searchType)
        var hunheSearch = hunheSearchList[index].hunheSearch
        var db = cloud.database().collection(event.searchType)
        var res_count = await db.where({
                isXiajia: false
            })
            .count()
        console.log(res_count.total);
        var pageNum = Math.ceil(res_count.total / 20) //向上取整
        var result = []
        for (let index = 0; index < pageNum; index++) {
            const resultHunhe = await db.aggregate().project({
                    isHege: 1,
                    hunheSearch,
                })
                .skip(index * 20)
                .end()
            resultHunhe.list.forEach(element => {
                var elementHunhe = element.hunheSearch.join('')
                if (elementHunhe.includes(event.searchword) && element.isHege) {
                    result.push(element)
                }
            });

        }
        console.log('搜索 ' + event.searchType + ' 成功resultHunhe', resultHunhe);
        return result

    }else if (event.searchType == 'shangjia') {
        var index = searchTypelist.indexOf(event.searchType)
        var hunheSearch = hunheSearchList[index].hunheSearch
        var db = cloud.database().collection(event.searchType)
        var res_count = await db.where({
            isDianpuOpen: true
            })
            .count()
        console.log(res_count.total);
        var pageNum = Math.ceil(res_count.total / 20) //向上取整
        var result = []
        for (let index = 0; index < pageNum; index++) {
            const resultHunhe = await db.aggregate().project({
                    // isHege: 1,
                    name: 1,
                    qisong: 1,
                    foodList_zhiding: 1,
                    zhaopaiUrl: 1,
                    hunheSearch,
                })
                .skip(index * 20)
                .end()
            resultHunhe.list.forEach(element => {
                var elementHunhe = element.hunheSearch.join('')
                // if (elementHunhe.includes(event.searchword) && element.isHege) {
                if (elementHunhe.includes(event.searchword)) {
                    result.push(element)
                }
            });

        }
        console.log('搜索 ' + event.searchType + ' 成功resultHunhe', resultHunhe);
        return result
    }
    if (event.searchType == 'bigthings_pyq') {
        var hunheSearch = ["$name", "$jianjie"]
        var db = cloud.database().collection('bigthings')
        var res_count = await db.where({
                isXiajia: false
            })
            .count()
        console.log(res_count.total);
        var pageNum = Math.ceil(res_count.total / 20) //向上取整
        var result = []
        for (let index = 0; index < pageNum; index++) {

            const resultIndexOfCP = await db.aggregate().project({
                    aStrIndex: $.indexOfCP(['$jianjie', event.searchword])
                })
                .skip(index * 20)
                .end()
            var idArr = []
            resultIndexOfCP.list.forEach(element => {
                if (element.aStrIndex != -1) {
                    idArr.push(element._id)
                }
            });
            var res = await db.where({
                    _id: _.in(idArr)
                })
                .skip(index * 20)
                .get()

            console.log('搜索 ' + event.searchType + 'res', res);
            res.data.forEach(element => {
                result.push(element)
            });
        }
        return result
    }
    if (event.searchType == 'gzhOpenid') {
        var db = cloud.database().collection('union')
        return db.where({
            unionid:event.unionid
        }).get()
        .then(res=>{
            console.log('有数据',res);
        })
        .catch(err=>{
            console.log('无数据',err);
        })
    }

}