function onInput(e) {
  console.log(e);
  const {
    value   //系统字段 value 不能改
  } = evt.detail;
  this.setData({
    value_kd_PhoNum:value,
    showClearBtn: !!value.length,
    isWaring: false,
  });
}


module.exports = {
  onInput: onInput
}