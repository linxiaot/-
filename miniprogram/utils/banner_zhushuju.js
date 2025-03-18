function bannerData() {
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
    .get()
    .then(res => {
        console.log('后台主参数 toptipsdaiqu：：', res.data);
        var bannerResData = res.data
      return bannerResData
    })
    .catch(err => {
      console.log('后台主参数 toptipsdaiqu：： 失败', err);
    })
}

  
module.exports = {
    bannerData: bannerData,
  }