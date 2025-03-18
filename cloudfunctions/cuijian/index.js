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
    // miniproData.page = 'pages/wode/dingdan/dingdan?isDaiqu=true'
    miniproData.page = 'pages/wode/dingdan/dingdan'

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

            // 增加记录
            console.log('增加记录');
            // 需要liuzhuanName cx_time gonghao
            addLiuzhuan('daiqu', _id, '发送催提信息', time, gonghao)


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


}