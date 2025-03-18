// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init('xmf-0g87mzf198205ada')
const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {

    if (event.action == 'update') {
        return await cloud.database().collection('liaotian').doc(event._id)
            .update({
                data: {
                    liaotianList: _.push(event.liaotian),
                    paixuTime:event.paixuTime
                }
            })
            .then(res => {
                console.log('[云函数] [talk] 更新 成功：', res)
                return res
            })
            .catch(err => {
                console.log('[云函数] [talk] 更新 失败：', err)
                return err
            })
    }
    if (event.action == 'lahei') {
        return await cloud.database().collection('liaotian').doc(event._id)
            .update({
                data: {
                    isLahei: event.isLahei,
                    laheiOpenid: event.laheiOpenid,
                }
            })
            .then(res => {
                console.log('[云函数] [talk] lahei 成功：', res)
                return res
            })
            .catch(err => {
                console.log('[云函数] [talk] lahei 失败：', err)
                return err
            })
    }
}