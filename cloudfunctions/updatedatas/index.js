// 云函数入口文件
const cloud = require('wx-server-sdk')

// request
const request = require('request-promise')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 增加一条流转信息
function addLiuzhuan(tablename, id, name, time, gonghao) {

    var data = {
        liuzhuan: _.unshift({
            name,
            time,
            gonghao,
        })
    }
    var res = db.collection(tablename).doc(id).update({
        data
    })
    console.log('添加流转data', data);
    console.log('添加流转res', res);
    // return res
}

async function tuisongFwh(gzhOpenid, templateId, msgData, access_token) {
    // 20230924 使用原公众号模板消息
    var gzhDataMsg = {}
    var miniproData = {}
    miniproData.appid = 'wxaad7b42349d83506'
    miniproData.page = 'pages/wode/dingdan/dingdan?isDaiqu=true'

    // gzhDataMsg.appid = 'wx83be857ba915fcc5'
    gzhDataMsg.miniprogram = miniproData
    gzhDataMsg.template_id = templateId
    gzhDataMsg.data = msgData
    gzhDataMsg.touser = gzhOpenid
    gzhDataMsg = JSON.stringify(gzhDataMsg)
    console.log('gzhDataMsg:', gzhDataMsg);

    try {
        // 公众号发送模板消息
        var url = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${access_token}`
        var res = await request({
            url: url,
            method: 'POST',
            json: true,
            form: gzhDataMsg,

        })
        console.log('gzh发送模板消息：成功', res);

    } catch (err) {
        console.log('gzh发送模板消息：失败', err);

    }
}

// 云函数入口函数               ==== 主要在派送工具中使用
exports.main = async (event, context) => {
    console.log('event', event);
    const wxContext = cloud.getWXContext()
    console.log('wxContext', wxContext);
    // return {
    //     event,
    //     openid: wxContext.OPENID,
    //     appid: wxContext.APPID,
    //     unionid: wxContext.UNIONID,
    // }

    var {
        action
    } = event
    if (action == 'updatedoc') {
        var {
            tablename,
            id,
            data,
            action2,
            liuzhuanName,
            gx_time,
            gonghao
        } = event
        // 增加记录
        if (action2 == '增加记录') {
            console.log('增加记录');
            // 需要liuzhuanName gx_time gonghao
            data.liuzhuan = _.unshift({
                name: liuzhuanName,
                time: gx_time,
                gonghao,
            })
        }
        var res = await db.collection(tablename).doc(id).update({
            data
        })
        console.log(res);
        return res
    }
    if (action == 'setdoc') {
        var {
            tablename,
            id,
            data
        } = event
        var res0 = await db.collection(tablename).doc(id).get()
        var res0data = res0.data
        delete res0data._id
        res0data.choosePaisongqu = data.choosePaisongqu
        var array = Object.keys(data)
        for (let index = 0; index < array.length; index++) {
            const key = array[index];
            res0data[key] = data[key]

        }
        console.log('updatedatas', res0data);
        var res = await db.collection(tablename).doc(id).set({
            data: res0data
        })

        return res
    }

    if (action == 'chaxun') {
        var {
            tablename,
            id,
            cx_time,
            gonghao,
            liuzhuanName,
            action2
        } = event
        // 增加记录
        if (action2 == '增加记录') {
            console.log('增加记录');
            // 需要liuzhuanName cx_time gonghao
            addLiuzhuan(tablename, id, liuzhuanName, cx_time, gonghao)

        }
        var res = await db.collection(tablename).doc(id).get()
        console.log('chaxun', res);
        return res
    }
    if (action == 'chaxunMore') {
        var {
            tablename,
            // id,
            cx_time,
            gonghao,
            liuzhuanName,
            action2,
            kd_PhoNum
        } = event
        // // 增加记录
        // if (action2 == '增加记录') {
        //     console.log('增加记录');
        //     // 需要liuzhuanName cx_time gonghao
        //     addLiuzhuan(tablename, id, liuzhuanName, cx_time, gonghao)

        // }
        // var res = await db.collection(tablename).doc(id).get()
        // console.log('chaxun', res);
        // return res


        var whereData = {
            // [`${xd_time_name}`]: _.lte(dateEnd).gte(dateStart),
            // dd_Status,
            // gonghao,
            // dd_Status: _.eq('0').or(_.eq('6'))
            // dd_Status: _.or([_.eq('7'), _.eq('2'), _.eq('8'),_.eq('6'),_.eq('0'),_.eq('3'),_.eq('4'),_.eq('5')]), // 待处理2，已装车7,已送达3,问题建8
            dd_Status: _.or([_.eq('7'), _.eq('2'), _.eq('8'), _.eq('6'), _.eq('0')]), // 待处理2，已装车7,已送达3,问题建8
            kd_PhoNum: {
                $regex: kd_PhoNum
            }
        }

        var chaxunList = await db.collection('daiqu').where(whereData).orderBy('xd_time', 'desc').limit(20).get()
        console.log('chaxun', chaxunList);

        return chaxunList

        // var res_count = await db.collection('daiqu').where(whereData).orderBy('xd_time', 'desc').count()
        // console.log('总数', res_count.total);
        // var pageNum = Math.ceil(res_count.total / 100) //向上取整
        // var chaxunList = []
        // for (let index = 0; index < pageNum; index++) {
        //     var res = await db.collection('daiqu').where(whereData).orderBy('xd_time', 'desc').skip(index * 100).get()
        //     res.data.forEach(element => {
        //         // element.dingdanhaoSlice = element.dingdanhao.slice(-3)
        //         // element.sd_Didian = element.sd_Didian.replace('金翰林公寓：','金-')
        //         chaxunList.push(element)
        //     });
        // }
        // return chaxunList



    }



    if (action == 'cuiti') { // 发送催提信息
        // 获取token
        var resToken = await cloud.database().collection('banner').doc('token').get()
        var access_token = resToken.data.access_token
        var {
            tablename,
            id,
            time,
            gonghao,
            liuzhuanName,
            action2
        } = event

        // 增加记录
        console.log('增加记录');
        // 需要liuzhuanName cx_time gonghao
        addLiuzhuan(tablename, id, liuzhuanName, time, gonghao)

        // 获取订单信息
        var dingdan = await cloud.database().collection('daiqu').doc(id).get()
        console.log('dingdan', dingdan);
        var {
            gzhOpenid,
            qh_Ma,
            beizhu_tuisong,
            songdaInfo,
            guitiDatas,
        } = dingdan.data
        if (songdaInfo) {
            if (songdaInfo.indexOf('密码如下') !== -1) {
                if (!guitiDatas) {
                    var mima = ''
                } else {
                    var mima = guitiDatas.mima
                }
                songdaInfo = songdaInfo.replace('，密码如下', '，密：') + mima
            }
        }
        var qujianMsg = beizhu_tuisong ? beizhu_tuisong : songdaInfo

        // 发送公众号消息 =======



        var msgData = {}
        // 快递公司
        msgData.thing4 = {
            value: (qh_Ma).slice(0, 20)
        }
        // 取件地址
        msgData.thing2 = {
            value: qujianMsg.slice(0, 20)
        }
        // 滞留时长
        msgData.thing7 = {
            value: '等你很久了，请速来取！'
        }



        if (gzhOpenid) { // 用户下单已携带gzhOpenid
            console.log('gzhOpenid 已携带');
            tuisongFwh(gzhOpenid, 'EhyCh9ma_vzmVF9qVevETXlcIP_96v1roiNl7iRz3nM', msgData, access_token) // 快递滞留提醒
        } else {
            console.log('此用户未关注公众号，无gzhOpenid');
        }


        return dingdan
    }
    if (action == 'cuitiList') { // 发送催提信息
        // 获取token
        var resToken = await cloud.database().collection('banner').doc('token').get()
        var access_token = resToken.data.access_token

        var {
            cuitiList,
            time,
            gonghao,
        } = event

        for (let index = 0; index < cuitiList.length; index++) {
            const element = cuitiList[index];
            var {
                gzhOpenid,
                qh_Ma,
                beizhu_tuisong,
                songdaInfo,
                guitiDatas,
                _id,
            } = element

            // // 增加记录
            // console.log('增加记录');
            // // 需要liuzhuanName cx_time gonghao
            // addLiuzhuan('daiqu', _id, '发送催提信息', time, gonghao)


            if (songdaInfo) {
                if (songdaInfo.indexOf('密码如下') !== -1) {
                    if (!guitiDatas) {
                        var mima = ''
                    } else {
                        var mima = guitiDatas.mima
                    }
                    songdaInfo = songdaInfo.replace('，密码如下', '，密：') + mima
                }
            }
            var qujianMsg = beizhu_tuisong ? beizhu_tuisong : songdaInfo

            // 发送公众号消息 =======


            var msgData = {}
            // 快递公司
            msgData.thing4 = {
                value: (qh_Ma).slice(0, 20)
            }
            // 取件地址
            msgData.thing2 = {
                value: qujianMsg.slice(0, 20)
            }
            // 滞留时长
            msgData.thing7 = {
                value: '等你很久了，请速来取！'
            }



            if (gzhOpenid) { // 用户下单已携带gzhOpenid
                console.log('gzhOpenid 已携带');
                tuisongFwh(gzhOpenid, 'EhyCh9ma_vzmVF9qVevETXlcIP_96v1roiNl7iRz3nM', msgData, access_token) // 快递滞留提醒
            } else {
                console.log('此用户未关注公众号，无gzhOpenid');
            }
        }

    }

    if (action == 'bucha') {
        var {
            go_daiqu_list,
            gonghaoid,
            buchajiage,
            
            dd_Status,
            wc_time,
            gonghao,
            songdaInfo,
            guitiDatas,
        } = event
        // var addData = {
        //     _openid : wxContext.OPENID,
        //     gonghaoid,
        //     gonghao,
        //     buchajiage
        // }
        for (let index = 0; index < go_daiqu_list.length; index++) {
            const element = go_daiqu_list[index];
            // addData.dingdanDatas = element
            var addData = element
            addData.gonghaoid = gonghaoid
            addData.buchajiage = buchajiage
            addData.dd_Status = dd_Status //取件中 用户无法申请退款
            addData.wc_time = wc_time
            addData.gonghao = gonghao
            addData.songdaInfo = songdaInfo
            addData.guitiDatas = guitiDatas
            // addData 中直接使用的订单数据，_id也一样
            db.collection('bucha').add({
                data: addData,
            })
        }
        return 'success'
    }


}