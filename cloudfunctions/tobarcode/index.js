// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

const barcodeJs = require('barcode-js');
const JsBarcode = require('jsbarcode');

// 云函数入口函数
exports.main = async (event, context) => {
    // const wxContext = cloud.getWXContext()

    // return {
    //     event,
    //     openid: wxContext.OPENID,
    //     appid: wxContext.APPID,
    //     unionid: wxContext.UNIONID,
    // }

    // const text = event.text; // 获取输入的文本  
    // const barcode = barcodeJs.getBarcode(text, 'code128'); // 生成Code 128类型的条形码  
    // // return {  
    // //   code: 200,  
    // //   message: '生成条形码成功',  
    // //   data: {  
    // //     barcodeImage: barcode.dataURI  
    // //   }  
    // // }; 
    // return barcode


    // let code = barcodeJs.create('code128', '123456789'); 
    // return code
    const text = event.text; // 传入的条形码数据
    const type = event.type || 'code128'; // 条形码类型，默认为 code128
    const options = event.options || {}; // 其他条形码选项，如宽度、高度等
    const buffer = barcodeJs(type, text, options).toBuffer()
    return buffer


    // // const canvas = createCanvas(400, 200); // 创建一个画布
    // // const ctx = canvas.getContext('2d');

    // const text = event.text; // 从传入的参数中获取条形码文本
    // var barcode = JsBarcode(text); // 生成条形码

    // // const base64Image = canvas.toDataURL('image/png'); // 将画布转换为 base64 图片

    // return {
    //     barcode: barcode
    // };
}