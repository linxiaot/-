// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数
exports.main = async(event, context) => {
  if (event.isDaiqu) {
    try {
      let userdata = event.chaxunList
      // let {userdata} = event.chaxunList
      //1,定义excel表格名
      let dataCVS = 'daiqu.xlsx'
      //2，定义存储数据的
      let alldata = [];
      //表属性 名称
      let row = ['取货码', '姓名', '手机号', '快递点', '送达地点', '昵称', '下单时间']; 
      alldata.push(row);
  
      for (let key in userdata) {
        let arr = [];
        arr.push(userdata[key].qh_Ma);
        arr.push(userdata[key].kd_Name);
        arr.push(userdata[key].kd_PhoNum);
        arr.push(userdata[key].kd_Dian);
        arr.push(userdata[key].sd_Didian);
        arr.push(userdata[key].nickName);
        arr.push(userdata[key].xd_time);
        // arr.push(userdata[key].dd_Status);
        // arr.push(userdata[key]._id);
        // arr.push(userdata[key]._openid);
        alldata.push(arr)
      }
      //3，把数据保存到excel里
      var buffer = await xlsx.build([{
        name: "mySheetName",
        data: alldata
      }]);
      //4，把excel文件保存到云存储里
      return await cloud.uploadFile({
        cloudPath: dataCVS,
        fileContent: buffer, //excel二进制文件
      })
  
    } catch (e) {
      console.error('代取订单生成 失败',e)
      return e
    }
  }else {
    try {
      let userdata = event.chaxunList
      // let {userdata} = event.chaxunList
      //1,定义excel表格名
      let dataCVS = 'jijian.xlsx'
      //2，定义存储数据的
      let alldata = [];
      //表属性 名称
      let row = ['取件地点','姓名','手机号','详细地址', '取件时间', '重量', '昵称', '下单时间']; 
      alldata.push(row);
  
      for (let key in userdata) {
        let arr = [];
        arr.push(userdata[key].JJ_Didian);
        arr.push(userdata[key].JJ_Name);
        arr.push(userdata[key].JJ_PhoNum);
        arr.push(userdata[key].mdd);
        arr.push(userdata[key].qujTime);
        arr.push(userdata[key].JJ_weight);
        arr.push(userdata[key].nickName);
        arr.push(userdata[key].xd_time);
        // arr.push(userdata[key].dd_Status);
        // arr.push(userdata[key]._id);
        // arr.push(userdata[key]._openid);
        alldata.push(arr)
      }
      //3，把数据保存到excel里
      var buffer = await xlsx.build([{
        name: "寄件订单",
        data: alldata
      }]);
      //4，把excel文件保存到云存储里
      return await cloud.uploadFile({
        cloudPath: dataCVS,
        fileContent: buffer, //excel二进制文件
      })
    } catch (e) {
      console.error('寄件订单生成 失败',e)
      return e
    }
  }
}