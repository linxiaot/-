function toShouQuan(url) {
  wx.showModal({
    title: '提示:未注册',
    content: '请先微信授权注册登陆',
    success(res) {
      if (res.confirm) {
        console.log('[授权登陆] 用户点击确定')
        wx.navigateTo({
          // url: '../../wode/ziliao/ziliao',
          url,
        })
      } else if (res.cancel) {
        console.log('[授权登陆] 用户点击取消')
      }
    }
  })
}
function toZiliao_buquan(url) {
  wx.showModal({
    title: '缺少班级信息',
    content: '请补全个人资料中“年级、学院、班级”后，再尝试导入',
    confirmText: '前往',
    success(res) {
      if (res.confirm) {
        wx.navigateTo({
          // url: '../../wode/ziliao/ziliao',
          url,
        })
      } else if (res.cancel) {
        console.log('[授权登陆] 用户点击取消')
      }
    }
  })
}

module.exports = {
  toShouQuan: toShouQuan,
  toZiliao_buquan: toZiliao_buquan
}