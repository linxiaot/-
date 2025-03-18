// 云函数入口文件
const cloud = require('wx-server-sdk')
var AipOcrClient = require("baidu-aip-sdk").ocr;

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境


// 设置APPID/AK/SK
var APP_ID = "43419932";
var API_KEY = "H282ConqqZGVhDIautnG1klS";
var SECRET_KEY = "6cxVPNoUG2zkoHzTDMbroSFN5PHGUOzE";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);


// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    console.log('event', event);
    console.log('wxContext', wxContext);

    if (event.action == 'quhuomaOcr') {   //  QPS10  每秒同时支持10个连接
        var url = event.url
        // var url = "https://786d-xmf-0g87mzf198205ada-1305629196.tcb.qcloud.la/quhuoma2.jpg?sign=d52a0863fbce949ad3be215512e07e79&t=1700544934";
        // var url = "https://786d-xmf-0g87mzf198205ada-1305629196.tcb.qcloud.la/quhuomaOcr/ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4.jpg";

        // // 调用通用文字识别, 图片参数为远程url图片
        var res = await client.generalBasicUrl(url)
        console.log(res);
        return res
    }

    if (event.action == 'quhuomaOcr_bendi') {   // 不方便使用
        var fs = require('fs');
        var image = fs.readFileSync(event.imgUrl).toString("base64");
        var image = event.imgUrl.toString("base64")
        // client.generalBasic(image).then(function (result) {
        //     console.log(JSON.stringify(result));
        // }).catch(function (err) {
        //     // 如果发生网络错误
        //     console.log(err);
        // });
        // 调用通用文字识别, 图片参数为本地图片
        var res = await client.generalBasic(image)
        console.log(res);
        return res
    }

}