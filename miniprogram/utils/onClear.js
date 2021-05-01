function onClear(value_kd_PhoNum) {
  this.setData({
    value_kd_PhoNum: '',
    showClearBtn: false,
    isWaring: false,
  });
}

module.exports = {
  onClear: onClear
}