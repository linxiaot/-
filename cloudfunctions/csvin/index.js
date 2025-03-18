// 云函数入口文件,引入需要的模块
// 编写的代码将excel文件的内容插入到云数据库
const cloud = require('wx-server-sdk');
cloud.init({
    env: 'xmf-0g87mzf198205ada'
})
const db = cloud.database();

var xlsx = require('node-xlsx');

exports.main = async (event, context) => {
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