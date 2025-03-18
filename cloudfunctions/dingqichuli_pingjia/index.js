// 每日对店铺评分进行更新

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
const db = cloud.database()
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
    /*
    1.获取店铺列表
    
    2.分店铺查评分
    3.更新到每个店铺
    */
    
    //    1.获取店铺列表
    var res_dianpu = await db.collection('shangjia').where({}).get()
    console.log(res_dianpu.data.length, 'res_dianpu数量');
    for (let index = 0; index < res_dianpu.data.length; index++) {
        const element = res_dianpu.data[index];
        var dianpu_id = element._id

        // 2.分店铺查评分
        db.collection('meishi')
            .aggregate()
            .match({
                dianpu: {
                    dianpu_id: dianpu_id
                }
            })
            .group({
                _id: dianpu_id,
                average: $.avg('$pingjia.pingjia_fenshu')
            })
            .end()
            .then(res => {
                var xingji_fenshu = res.list[0].average
                var res_id = res.list[0]._id
                // 3.更新到每个店铺
                db.collection('shangjia').doc(res_id).update({
                        data: {
                            xingji: xingji_fenshu
                        }
                    })
                    .then(res2 => {
                        console.log(res2.stats.updated, res_id, xingji_fenshu,new Date(), 'xingji_fenshu更新成功');
                    })

            })
    }
}