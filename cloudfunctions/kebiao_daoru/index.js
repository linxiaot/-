// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
var db = cloud.database()
var $ = db.command.aggregate
var _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    var _openid = event.openid
    var add_time = event.add_time
    var banji = event.banji
    // var res_del = await db.collection('kebiao').where({
    //     data: {
    //         _openid: event.openid
    //     }
    // }).remove()

    // var resIndexOfCP = await db.collection('kebiao_datas')
    //     .aggregate()
    //     .project({
    //         aStrIndex: $.indexOfCP(['$banji', '2021国际经济与贸易[1]班'])
    //     })
    //     // .skip(index * 20)
    //     .end()
    // var idArr = []
    // for (let index = 0; index < resIndexOfCP.list.length; index++) {
    //     const element = resIndexOfCP.list[index];
    //     if (element.aStrIndex != -1) {
    //         idArr.push(element._id)

    //         var res2 = await db.collection('kebiao_datas').doc(element._id).get()
    //         var res3 = await db.collection('kebiao').add({
    //             data: {
    //                 _openid,
    //                 add_time,
    //                 zhouJi: res2.data.zhouJi,
    //                 diJiJie: res2.data.diJiJie,
    //                 gongJiJie: res2.data.gongJiJie,
    //                 keChName: res2.data.keChName,
    //                 teacher: res2.data.teacher,
    //                 diDian: res2.data.diDian,
    //                 diJiZhou: res2.data.diJiZhou,
    //             }
    //         })
    //         console.log(res3);
    //     }
    // };
    // return idArr
    var res_del = await db.collection('kebiao').where({
            _openid: event.openid
    }).remove()

    var res2 = await db.collection('kebiao_datas').where({
        banji: _.elemMatch(_.eq(banji))
    }).get()
    console.log('res2', res2);
    
    for (let index = 0; index < res2.data.length; index++) {
        const element = res2.data[index];

        var res3 = await db.collection('kebiao').add({
            data: {
                _openid,
                add_time,
                banji,
                zhouJi: element.zhouJi,
                diJiJie: element.diJiJie,
                gongJiJie: element.gongJiJie,
                keChName: element.keChName,
                teacher: element.teacher,
                diDian: element.diDian,
                diJiZhou: element.diJiZhou,
            }
        })
        console.log(res3);
    };
    return res2
}