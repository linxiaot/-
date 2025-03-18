

function sysInfo() {
    wx.getSystemInfo({
        success: (res) => {
            // console.log(res);
            return res
        },
    })
}

  
module.exports = {
    sysInfo: sysInfo,
  }