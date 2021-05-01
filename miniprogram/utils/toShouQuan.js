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

module.exports = {
  toShouQuan: toShouQuan
}