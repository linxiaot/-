// 环境共享4.cloudbase_auth 云函数，在使用共享环境之前，需要保证资源方拥有 cloudbase_auth 云函数，用于鉴权调用方的身份并制定相关权限。

// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境



// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 跨账号调用时，由此拿到来源方小程序/公众号 AppID
  console.log(wxContext.FROM_APPID)
  // 跨账号调用时，由此拿到来源方小程序/公众号的用户 OpenID
  console.log(wxContext.FROM_OPENID)
  // 跨账号调用、且满足 unionid 获取条件时，由此拿到同主体下的用户 UnionID
  console.log(wxContext.FROM_UNIONID)

  return {
    errCode: 0,
    errMsg: '',
    auth: ''
  }
}