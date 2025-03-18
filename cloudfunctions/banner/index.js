// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xmf-0g87mzf198205ada'
})

const _ = cloud.database().command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event);
  if (event.action == 'toptips') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          text: event.text,
          isToptips: event.isToptips
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'Toptips_text') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          text: event.text,
          // isToptips:event.isToptips
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'toShixiang') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          shiXiang_1: event.shiXiang_1,
          shiXiang_2: event.shiXiang_2,
          shiXiang_3: event.shiXiang_3,
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'toXuanzq') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          isXzq_1: event.isXzq_1,
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'toTongzhi') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          isTongzhi: event.isTongzhi,
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'tongzhi_text') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          text_tongzhi: event.text_tongzhi,
          // isToptips:event.isToptips
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'toOpen_sd_Didian') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          beixuan_sd_Didian: event.beixuan_sd_Didian,
          sdSusheList: event.sdSusheList,
          sdLoudongList_all: event.sdLoudongList_all,
          wxhao: event.wxhao,
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'guanggao') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: event.data_guanggao
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'paotuiOpen') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          isPaotuiOpen: event.isPaotuiOpen
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'xiadanClose') {
    return await cloud.database().collection('banner').doc(event._id)
      .update({
        data: {
          xiadan: event.xiadan
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'duanxin') {
    return await cloud.database().collection('banner').doc('toptipsdaiqu')
      .update({
        data: {
          duanxin: event.duanxin_list,
        }
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'qita') {
    return await cloud.database().collection('banner').doc('qita0001')
      .update({
        data: event.qita_data
        // data: _.set({
        //   event.qita_data
        // })
      })
      .then(res => {
        console.log('[云函数] [qita0001] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [qita0001] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'banner_qita') {
    return await cloud.database().collection('banner_qita').doc(event._id)
      .update({
        data: event.qita_data
        // data: _.set({
        //   event.qita_data
        // })
      })
      .then(res => {
        console.log('[云函数] [qita0001] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [qita0001] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'banner_qita_del') {
    return await cloud.database().collection('banner_qita').doc(event._id)
      .remove()
      .then(res => {
        console.log(' 删除 成功：', res)
        return res
      })
      .catch(err => {
        console.log('删除 失败：', err)
        return err
      })
  }
  if (event.action == 'fasong_beizhu') {
    return await cloud.database().collection('banner').doc('toptipsdaiqu')
      .update({
        data: {
          xiaoxi_list: event.xiaoxi_list
        }
      })
      .then(res => {
        console.log('[云函数] [fasong_beizhu] 更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('[云函数] [fasong_beizhu] 更新 失败：', err)
        return err
      })
  }
  if (event.action == 'updateDatas') { //更新任意数据
    return await cloud.database().collection(event.tableName).doc(event.id)
      .update({
        data: event.datas
      })
      .then(res => {
        console.log('更新 成功：', res)
        return res
      })
      .catch(err => {
        console.log('更新 失败：', err)
        return err
      })
  }

}