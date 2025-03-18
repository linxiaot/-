// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xmf-0g87mzf198205ada'
})

// 云函数入口函数
exports.main = async (event, context) => {
  if (event.action == 'imageCheck') {
    var resList = []
    for (let index = 0; index < event.deleteFileList.length; index++) {
      const fileID = event.deleteFileList[index];
      var res = await cloud.downloadFile({
        fileID,
      })
      var buffer = res.fileContent
      var result = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: 'image/png',
          value: buffer
        }
      })
      console.log(result);
      resList.push(result)
    }
    return resList
    // console.log(result);

  }
  if (event.action == 'msgCheck') {
    try {
      const result = await cloud.openapi.security.msgSecCheck({
        "openid": event.openid,
        "scene": 1,
        "version": 2,
        "content": event.content
      })
      return result
    } catch (err) {
      return err
    }
  }
}