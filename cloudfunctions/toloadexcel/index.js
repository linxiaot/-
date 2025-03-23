// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
var db = cloud.database()
var _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    var res_count = await db.collection('daiqu').where({
        xd_time: _.lte(event.dateEnd).gte(event.dateStart),
        // dd_Status: '0'
        // dd_Status: _.eq('0').or(_.eq('6'))
        dd_Status: _.or([_.eq('0'), _.eq('2'), _.eq('6')]), //包含拒退的订单, 取件中的
        tenant_id: event.tenant_id
    }).orderBy('xd_time', 'desc').count()
    console.log('有多少数量', res_count.total);
    var pageNum = Math.ceil(res_count.total / 100) //向上取整
    var chaxunList = []
    for (let index = 0; index < pageNum; index++) {
        var res = await db.collection('daiqu').where({
            xd_time: _.lte(event.dateEnd).gte(event.dateStart),
            // dd_Status: '0'
            // dd_Status: _.eq('0').or(_.eq('6')) //包含拒退的订单
            dd_Status: _.or([_.eq('0'), _.eq('2'), _.eq('6')]), //包含拒退的订单, 取件中的
            tenant_id: event.tenant_id
            // dd_Status: _.or([_.eq('0'), _.eq('2'), _.eq('6'), _.eq('7')]) //包含拒退的订单, 取件中的,7已装车
        }).orderBy('xd_time', 'desc').skip(index * 100).get()
        res.data.forEach(element => {
            // element.dingdanhaoYuan = element.dingdanhao
            // element.dingdanhao = element.dingdanhao.slice(-3)
            // // element.dingdanhao = element.dingdanhao.slice(-4,-1)
            element.dingdanhaoSuo = element.dingdanhao.slice(-3)

            chaxunList.push(element)
        });
    }
    console.log('chaxunList长度', chaxunList.length);

    var res_excel = await cloud.callFunction({
        name: 'toexcel',
        data: {
            isDaiqu: true,
            // chaxunList: res.data
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