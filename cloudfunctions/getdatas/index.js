// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

var db = cloud.database()
var _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log('wxContext', wxContext);
    console.log('event', event);

    var {
        action
    } = event

    // 获取所有数据
    if (action == 'getall') {
        var {
            dateEnd,
            dateStart,
            dd_Status,
            xd_time_name,
            gonghao
        } = event
        var whereData = {
            [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            dd_Status,
            gonghao,
            tenant_id: event.tenant_id,
            // dd_Status: _.eq('0').or(_.eq('6'))
            // dd_Status: _.or([_.eq('7'), _.eq('3'), _.eq('8')]) // 已装车7,已送达
        }
        if (event.action2 == '含拒退订单') {
            whereData.dd_Status = _.eq(dd_Status).or(_.eq('6'))
            console.log('含拒退订单whereData', whereData);
        }
        var res_count = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').count()
        console.log('总数', res_count.total);
        var pageNum = Math.ceil(res_count.total / 100) //向上取整
        var chaxunList = []
        for (let index = 0; index < pageNum; index++) {
            var res = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').skip(index * 100).get()
            res.data.forEach(element => {
                // element.dingdanhaoSlice = element.dingdanhao.slice(-3)
                // element.sd_Didian = element.sd_Didian.replace('金翰林公寓：','金-')
                chaxunList.push(element)
            });
        }
        return chaxunList

    }
    // 获取所有数据  分页
    if (action == 'getallfenyebucha') {
        console.log('getallfenyebucha');
        var {
            dateEnd,
            dateStart,
            // dd_Status,
            xd_time_name,
            gonghao,
            pageNum
        } = event
        var whereData = {
            [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            // dd_Status,
            gonghao,
            tenant_id: event.tenant_id,
            // dd_Status: _.eq('0').or(_.eq('6'))
            // dd_Status: _.or([_.eq('7'), _.eq('3'), _.eq('8')]) // 已装车7,已送达
        }
        if (event.action2 == '含拒退订单') {
            whereData.dd_Status = _.eq(dd_Status).or(_.eq('6'))
            console.log('含拒退订单whereData', whereData);
        }

        var res = await db.collection('bucha').where(whereData).orderBy(xd_time_name, 'desc').skip((pageNum - 1) * 100).get()


        console.log(res);
        return res.data

    }

    // 获取所有数据  分页
    if (action == 'getallfenye') {
        var {
            dateEnd,
            dateStart,
            dd_Status,
            xd_time_name,
            gonghao,
            pageNum
        } = event
        var whereData = {
            [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            dd_Status,
            gonghao,
            tenant_id: event.tenant_id,
            // dd_Status: _.eq('0').or(_.eq('6'))
            // dd_Status: _.or([_.eq('7'), _.eq('3'), _.eq('8')]) // 已装车7,已送达
        }
        if (event.action2 == '含拒退订单') {
            whereData.dd_Status = _.eq(dd_Status).or(_.eq('6'))
            console.log('含拒退订单whereData', whereData);
        }

        var res = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').skip((pageNum - 1) * 100).get()


        return res.data

    }
    // 获取所有数据  总数
    if (action == 'getalltotalnew') {
        var {
            dateEnd,
            dateStart,
            // dd_Status,
            xd_time_name,
            gonghao,

        } = event
        var whereData = {
            [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            // dd_Status,
            gonghao,
            tenant_id: event.tenant_id,
            // dd_Status: _.eq('0').or(_.eq('6'))
            // dd_Status: _.or([_.eq('7'), _.eq('3'), _.eq('8')]) // 已装车7,已送达
        }

        // var res_count = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').count()
        var res_count = await db.collection('bucha').where(whereData).count()
        console.log('总数', res_count.total);
        // var pageNum = Math.ceil(res_count.total / 100) //向上取整
        // var chaxunList = []
        // for (let index = 0; index < pageNum; index++) {
        //     var res = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').skip(index * 100).get()
        //     res.data.forEach(element => {
        //         // element.dingdanhaoSlice = element.dingdanhao.slice(-3)
        //         // element.sd_Didian = element.sd_Didian.replace('金翰林公寓：','金-')
        //         chaxunList.push(element)
        //     });
        // }
        // return res_count.total

        var res = await db.collection('bucha').aggregate()
            .match(whereData)
            .group({
                _id: null,
                //   // shopName:'$shopName',
                //   counts: _.aggregate.sum(1),  
                buchaSum: _.aggregate.sum('$buchajiage'),

            })
            // .orderBy('shopName', 'asc')
            // .orderBy(xd_time_name, 'desc') // 降序
            // .limit(100)
            // .skip((pageNum - 1) * 100)
            .end()
        console.log('buchaSum', res);

        return {
            buchaSum: res,
            counts: res_count.total
        }
    }
    // 获取所有数据  总数
    if (action == 'getalltotal') {
        var {
            dateEnd,
            dateStart,
            dd_Status,
            xd_time_name,
            gonghao
        } = event
        var whereData = {
            [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            dd_Status,
            gonghao,
            tenant_id: event.tenant_id,
            // dd_Status: _.eq('0').or(_.eq('6'))
            // dd_Status: _.or([_.eq('7'), _.eq('3'), _.eq('8')]) // 已装车7,已送达
        }
        // var res_count = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').count()
        var res_count = await db.collection('daiqu').where(whereData).count()
        console.log('总数', res_count.total);
        // var pageNum = Math.ceil(res_count.total / 100) //向上取整
        // var chaxunList = []
        // for (let index = 0; index < pageNum; index++) {
        //     var res = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').skip(index * 100).get()
        //     res.data.forEach(element => {
        //         // element.dingdanhaoSlice = element.dingdanhao.slice(-3)
        //         // element.sd_Didian = element.sd_Didian.replace('金翰林公寓：','金-')
        //         chaxunList.push(element)
        //     });
        // }
        return res_count.total
    }
    // 获取 数据,分组
    if (action == 'getalltotal_fenzu') {
        var {
            dateEnd,
            dateStart,
            dd_Status,
            xd_time_name,
            gonghao
        } = event
        var whereData = {
            [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            dd_Status,
            gonghao,
            tenant_id: event.tenant_id,
            // dd_Status: _.eq('0').or(_.eq('6'))
            // dd_Status: _.or([_.eq('7'), _.eq('3'), _.eq('8')]) // 已装车7,已送达
        }
        // var res_count = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').count()
        // console.log('总数', res_count.total);

        // return res_count.total

        return await db.collection('daiqu').aggregate()
            .match(whereData)
            .group({
                _id: '$sd_Didian',
                // shopName:'$shopName',
                counts: _.aggregate.sum(1),
                sd_Didian: _.aggregate.push('$sd_Didian'),

            })
            // .orderBy('shopName', 'asc')
            // .orderBy('creatTime', 'desc') // 降序
            .limit(100)
            // .skip((pageNum - 1) * 20)
            .end()


    }
    // 获取用户在柜体中的包裹
    if (action == 'getWhere') {
        var {
            dateEnd,
            dateStart,
            kd_Name,
            xd_time_name,
        } = event
        var whereData = {
            [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            dd_Status: '3',
            kd_Name,
            tenant_id: event.tenant_id,
            // dd_Status: _.eq('0').or(_.eq('6'))
            // dd_Status: _.or([_.eq('7'), _.eq('3'), _.eq('8')]) // 已装车7,已送达
        }
        var res = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').get()
        console.log('res', res.data);
        // var pageNum = Math.ceil(res_count.total / 100) //向上取整
        // var chaxunList = []
        // for (let index = 0; index < pageNum; index++) {
        //     var res = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').skip(index * 100).get()
        //     res.data.forEach(element => {
        //         // element.dingdanhaoSlice = element.dingdanhao.slice(-3)
        //         // element.sd_Didian = element.sd_Didian.replace('金翰林公寓：','金-')
        //         chaxunList.push(element)
        //     });
        // }
        return res.data
    }
    // 获取用户在柜体中的包裹
    if (action == 'getWhereDiandian') {
        var {
            dateEnd,
            dateStart,
            sd_Didian,
            xd_time_name,
        } = event
        var whereData = {
            [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            // dd_Status:'3',
            // kd_Name,
            tenant_id: event.tenant_id,
            // dd_Status: _.eq('0').or(_.eq('6'))
            dd_Status: _.or([_.eq('7'), _.eq('0'), _.eq('2'), _.eq('8')]), // 待处理2，已装车7,已送达3,问题建8
            sd_Didian: {
                $regex: sd_Didian
            }
        }
        var res_count = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').count()
        console.log('总数 res_count.total', res_count.total);
        var pageNum = Math.ceil(res_count.total / 100) //向上取整

        var chaxunList = []
        for (let index = 0; index < pageNum; index++) {
            var res = await db.collection('daiqu').where(whereData).orderBy(xd_time_name, 'desc').skip(index * 100).get()
            res.data.forEach(element => {
                // element.dingdanhaoSlice = element.dingdanhao.slice(-3)
                // element.sd_Didian = element.sd_Didian.replace('金翰林公寓：','金-')
                chaxunList.push(element)
            });
        }
        return chaxunList
    }

    // 下载文件夹中的声音文件的下载地址
    if (action == 'getMp3') {
        var fileList = []
        for (let index = 0; index < 20; index++) {
            fileList.push(`cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/guimenmp3/${index+1}hao.mp3`)
            // var fileID = `cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/guimenmp3/${index+1}hao.mp3`
            // var res = await cloud.downloadFile({fileID})
            // fileidList.push(res)
        }
        var res = await cloud.getTempFileURL({
            fileList: fileList,
        })
        //   return res.fileList
        console.log('res', res);
        return res.fileList
    }


}