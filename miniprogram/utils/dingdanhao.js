function dingdanhaoCreate(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    var shijianchuo = date.getTime()
    var suijiNum = ''
    // 6位随机数
    for (var i = 0; i < 2; i++) {
        suijiNum += Math.floor(Math.random() * 10);
    }
    var dingdanhao = 'F' + year + month + day + hour + minute + second + shijianchuo + suijiNum
    return dingdanhao

}

module.exports = {
    dingdanhaoCreate: dingdanhaoCreate,
}