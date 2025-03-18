// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const {
        _openid
    } = wxContext.OPENID
    var {
        action
    } = event
    console.log('event:', event);
    // return {
    //     event,
    //     openid: wxContext.OPENID,
    //     appid: wxContext.APPID,
    //     unionid: wxContext.UNIONID,
    // }
    if (action == '微信支付') {
        console.log(action);
        // 1. 批量生成订单
        // 2. 回传订单号
        // 3. 上传支付系统生成预定单
        
        var {
            dingdanList
        } = event
        var _idList = []
        for (let index = 0; index < dingdanList.length; index++) {
            const element = dingdanList[index];
            // element._openid = _openid
            var resAdd = db.collection('daiqu').add({
                data: element,
            })
            _idList.push((await resAdd)._id)
        }
        return _idList

    }
    if (action == '其他支付') {
        console.log(action);
        var {
            dingdanList
        } = event
        var _idList = []
        for (let index = 0; index < dingdanList.length; index++) {
            const element = dingdanList[index];
            // element._openid = _openid
            var resAdd = db.collection('daiqu').add({
                data: element,
            })
            _idList.push((await resAdd)._id)
        }
        return _idList
    }
}