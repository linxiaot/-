// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'xmf-0g87mzf198205ada'
})

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function formatTimeMeifuhao(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('')
}

const db = cloud.database();

//操作excel用的类库
const xlsx = require('node-xlsx');

// 云函数入口函数 
exports.main = async(event, context) => {
  var nowTime = formatTimeMeifuhao(new Date())
  if (event.isDaiqu == true) {
    try {
      console.log(nowTime);
      let userdata = event.chaxunList
      // let {userdata} = event.chaxunList
      //1,定义excel表格名
      let dataCVS = 'zzzguanli/daiquNew/daiqu'+ nowTime +'.xlsx'
      //2，定义存储数据的
      let alldata = [];
      //表属性 名称
      // let row = ['取货码', '姓名', '手机号', '快递点', '送达地点', '昵称', '下单时间']; 
      // let row = ['快递点', '取货码', '姓名', '送达地点', '手机号', '下单人', '下单时间','备注']; 
      let row = ['条码1','条码2','订单尾号', '快递点', '取货码', '姓名', '送达地点', '手机号', '下单人', '下单时间','备注']; 
      alldata.push(row);
  
      for (let key in userdata) {
        let arr = [];
        var sd_Didian = userdata[key].sd_Didian
        sd_Didian = sd_Didian.replace('金翰林公寓：','金-')
        sd_Didian = sd_Didian.replace('琴湖公寓：','琴-')
        sd_Didian = sd_Didian.replace('西湖公寓：','西湖-')
        sd_Didian = sd_Didian.replace('兴湘宿舍：','兴-')
        sd_Didian = sd_Didian.replace('苑宿舍：','-')
        sd_Didian = sd_Didian.replace('-栋','')
        sd_Didian = sd_Didian.replace(/北青中兴.*/g,'北青中兴')
        sd_Didian = sd_Didian.replace(/南门.*/g,'南门')
        sd_Didian = sd_Didian.replace(/一教.*/g,'一教')
        sd_Didian = sd_Didian.replace('办公楼区域','')

        arr.push(userdata[key]._id);//条码  生成二维码
        arr.push(userdata[key]._id); // 打印到其它位置
        arr.push(userdata[key].dingdanhaoSuo); // 订单后缩写，后3位
        arr.push(userdata[key].kd_Dian);
        arr.push(userdata[key].qh_Ma);
        arr.push(userdata[key].kd_Name);
        // arr.push(userdata[key].sd_Didian);
        arr.push(sd_Didian);
        arr.push(userdata[key].kd_PhoNum);
        arr.push(userdata[key].nickName);
        arr.push(userdata[key].xd_time);
        arr.push(userdata[key].beizhu);
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
    // try {
    //   console.log(nowTime);
    //   let userdata = event.chaxunList
    //   // let {userdata} = event.chaxunList
    //   //1,定义excel表格名
    //   let dataCVS = 'zzzguanli/daiqu/daiqu'+ nowTime +'.xlsx'
    //   //2，定义存储数据的
    //   let alldata = [];
    //   //表属性 名称
    //   // let row = ['取货码', '姓名', '手机号', '快递点', '送达地点', '昵称', '下单时间']; 
    //   // let row = ['快递点', '取货码', '姓名', '送达地点', '手机号', '下单人', '下单时间','备注']; 
    //   let row = ['订单尾号', '快递点', '取货码', '姓名', '送达地点', '手机号', '下单人', '下单时间','备注']; 
    //   alldata.push(row);
  
    //   for (let key in userdata) {
    //     let arr = [];
    //     var sd_Didian = userdata[key].sd_Didian
    //     sd_Didian = sd_Didian.replace('金翰林公寓：','金-')
    //     sd_Didian = sd_Didian.replace('琴湖公寓：','琴-')
    //     sd_Didian = sd_Didian.replace('西湖公寓：','西湖-')
    //     sd_Didian = sd_Didian.replace('兴湘宿舍：','兴-')
    //     sd_Didian = sd_Didian.replace('苑宿舍：','-')
    //     sd_Didian = sd_Didian.replace('-栋','')
    //     sd_Didian = sd_Didian.replace(/北青中兴.*/g,'北青中兴')
    //     sd_Didian = sd_Didian.replace(/南门.*/g,'南门')

    //     arr.push(userdata[key].dingdanhao);
    //     arr.push(userdata[key].kd_Dian);
    //     arr.push(userdata[key].qh_Ma);
    //     arr.push(userdata[key].kd_Name);
    //     // arr.push(userdata[key].sd_Didian);
    //     arr.push(sd_Didian);
    //     arr.push(userdata[key].kd_PhoNum);
    //     arr.push(userdata[key].nickName);
    //     arr.push(userdata[key].xd_time);
    //     arr.push(userdata[key].beizhu);
    //     // arr.push(userdata[key]._id);
    //     // arr.push(userdata[key]._openid);
    //     alldata.push(arr)
    //   }
    //   //3，把数据保存到excel里
    //   var buffer = await xlsx.build([{
    //     name: "mySheetName",
    //     data: alldata
    //   }]);
    //   //4，把excel文件保存到云存储里
    //   return await cloud.uploadFile({
    //     cloudPath: dataCVS,
    //     fileContent: buffer, //excel二进制文件
    //   })
  
    // } catch (e) {
    //   console.error('代取订单生成 失败',e)
    //   return e
    // }
  }
  else if (event.isDaiqu == false) {
    try {
      let userdata = event.chaxunList
      // let {userdata} = event.chaxunList
      //1,定义excel表格名
      let dataCVS = 'zzzguanli/jijian/jijian'+ nowTime +'.xlsx'
      //2，定义存储数据的
      let alldata = [];
      //表属性 名称
      let row = ['取件地点','姓名','手机号','详细地址', '取件日期', '取件时间', '重量', '昵称', '下单时间']; 
      alldata.push(row);
  
      for (let key in userdata) {
        let arr = [];
        arr.push(userdata[key].JJ_Didian);
        arr.push(userdata[key].JJ_Name);
        arr.push(userdata[key].JJ_PhoNum);
        arr.push(userdata[key].mdd);
        arr.push(userdata[key].qujDate);
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
  if (event.isCsvin==true) {
     //通过event获取到调用云函数的函数传递过来的参数
     let fileID = event.fileID
     console.log("传递过来的fileID为", fileID)
 
     //通过获取到的文件ID下载位于云存储的数据
     const res = await cloud.downloadFile({
         fileID: fileID,
     })
     const buffer = res.fileContent;
 
     //用来存储所有的添加数据操作
     const tasks = []
     var sheets = xlsx.parse(buffer);
 
     sheets.forEach(function (sheet) {
         for (var rowId in sheet['data']) {
             var row = sheet['data'][rowId]; //第几行数据
             if (rowId > 0 && row) { //第一行是表格标题，所有我们要从第2行开始读
                 //3，把解析到的数据存到excelList数据表里
                 const promise = db.collection('kebiao_datas')
                     .add({
                         data: {
                             _id: row[0], //姓名
                             diDian: row[1], //年龄
                             diJiJie: row[2], //地址
                             diJiZhou: row[3],
                             gongJiJie: row[4],
                             keChName: row[5],
                             teacher: row[6],
                             zhouJi: row[7],
 
                         }
                     })
                 tasks.push(promise)
             }
         }
     });
     // 等待所有数据添加完成
     let result = await Promise.all(tasks).then(res => {
         return res
     }).catch(function (err) {
         return err
     })
     return result
  }
  if (event.action == 'daiqudingdan') {
    try {
      console.log(nowTime);
      let userdata = event.chaxunList
      // let {userdata} = event.chaxunList
      //1,定义excel表格名
      let dataCVS = 'zzzguanli/daiquNew/daiqu'+ nowTime +'.xlsx'
      //2，定义存储数据的
      let alldata = [];
      //表属性 名称
      // let row = ['取货码', '姓名', '手机号', '快递点', '送达地点', '昵称', '下单时间']; 
      // let row = ['快递点', '取货码', '姓名', '送达地点', '手机号', '下单人', '下单时间','备注']; 
      let row = ['条码','订单尾号', '快递点', '取货码', '姓名', '送达地点', '手机号', '下单人', '下单时间','备注']; 
      alldata.push(row);
  
      for (let key in userdata) {
        let arr = [];
        var sd_Didian = userdata[key].sd_Didian
        sd_Didian = sd_Didian.replace('金翰林公寓：','金-')
        sd_Didian = sd_Didian.replace('琴湖公寓：','琴-')
        sd_Didian = sd_Didian.replace('西湖公寓：','西湖-')
        sd_Didian = sd_Didian.replace('兴湘宿舍：','兴-')
        sd_Didian = sd_Didian.replace('苑宿舍：','-')
        sd_Didian = sd_Didian.replace('-栋','')
        sd_Didian = sd_Didian.replace(/北青中兴.*/g,'北青中兴')
        sd_Didian = sd_Didian.replace(/南门.*/g,'南门')

        arr.push(userdata[key]._id);
        arr.push(userdata[key].dingdanhao);
        arr.push(userdata[key].kd_Dian);
        arr.push(userdata[key].qh_Ma);
        arr.push(userdata[key].kd_Name);
        // arr.push(userdata[key].sd_Didian);
        arr.push(sd_Didian);
        arr.push(userdata[key].kd_PhoNum);
        arr.push(userdata[key].nickName);
        arr.push(userdata[key].xd_time);
        arr.push(userdata[key].beizhu);
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
  }

}