// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境


var db = cloud.database()
var _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    console.log('event', event);
    var {
        pageNum800,
        meiyeNum
    } = event
    meiyeNum = meiyeNum/100
    var whereData = {
        xd_time: _.lte(event.dateEnd).gte(event.dateStart),
        dd_Status: _.or([_.eq('0'), _.eq('2'), _.eq('6')]) //包含拒退的订单, 取件中的
        // dd_Status: _.or([_.eq('0'), _.eq('2'), _.eq('6'), _.eq('3')]) //包含拒退的订单, 取件中的   测试
    }
    console.log('whereData',whereData);

    var res_count = await db.collection('daiqu').where(whereData).orderBy('xd_time', 'desc').count()
    console.log('订单数量：', res_count.total);

    // var pageNum = Math.ceil(res_count.total / 100) //向上取整
    // var pages = Math.ceil(800 / 100) //向上取整
    var chaxunList = []
    // for (let index = (pageNum800 - 1) * 7; index < pageNum800 * 7; index++) {
    for (let index = (pageNum800 - 1) * meiyeNum; index < pageNum800 * meiyeNum; index++) {
        // for (let index = 0; index < 8; index++) {
        var res = await db.collection('daiqu').where(whereData).orderBy('xd_time', 'desc').skip(index * 100).get()
        res.data.forEach(element => {
            element.dingdanhaoSuo = element.dingdanhao.slice(-3)
            chaxunList.push(element)
        });
    }
    console.log('chaxunList长度', chaxunList.length);

    var res_excel = await cloud.callFunction({
        name: 'toexcel',
        data: {
            // isDaiqu: true,// 旧的
            action: 'daiqudingdan', // 下载新的订单
            chaxunList,
        }
    })
    var res_url = await cloud.getTempFileURL({
        fileList: [res_excel.result.fileID],
    })
    var url = res_url.fileList[0].tempFileURL
    console.log('文件的下载链接 url 是：', url)
    return {
        url: url,
        chaxunList: chaxunList,
        count: res_count.total,
    }

}