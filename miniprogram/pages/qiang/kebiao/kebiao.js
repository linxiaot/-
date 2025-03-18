// pages/qiang/kebiao/kebiao.js
var utils_time = require('../../../utils/time.js'); //获取时间等
const toShouQuan = require('../../../utils/toShouQuan.js');
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
var db = wx.cloud.database()
var $ = db.command.aggregate
Page({

    data: {
        tianjiakuang_zhou: 0,
        tianjiakuang_jie: 0,
        keshiObj: {
            zhou: [1, 2, 3, 4, 5, 6, 7],
            jie: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        },


        isShow_jiban: false,
        jibanList: ['2020材料化学1班', '2020材料化学2班'],
        // res_banji: '',

        zhouChooseIndex: '',
        kebiaoArr: [{ // 未登陆前的展示
                diDian: "湘大",
                diJiJie: 5,
                diJiZhou: [1, 2, 3, 10],
                gongJiJie: 1,
                keChName: '蜜蜂校园帮',
                teacher: '全体员工',
                zhouJi: 4,
            },
            {
                diDian: "一教3022",
                diJiJie: 3,
                diJiZhou: [1, 2, 3, 4, 10],
                gongJiJie: 2,
                keChName: '恐龙时代的毁灭',
                teacher: '生物学家',
                zhouJi: 2,
            },
            {
                diDian: "一教3022",
                diJiJie: 5,
                diJiZhou: [2, 3, 4, 5, 10],
                gongJiJie: 2,
                keChName: '人的本性',
                teacher: '心理学家',
                zhouJi: 3,
            },
            {
                diDian: "一教3022",
                diJiJie: 1,
                diJiZhou: [2, 3, 4, 5, 10],
                gongJiJie: 2,
                keChName: '人的本性',
                teacher: '心理学家',
                zhouJi: 3,
            },
            {
                diDian: "一教3022",
                diJiJie: 7,
                diJiZhou: [6, 7, 8, 9, 10],
                gongJiJie: 2,
                keChName: '化学实验论',
                teacher: '化学专家',
                zhouJi: 4,
            },
            {
                diDian: "一教3022",
                diJiJie: 1,
                diJiZhou: [7, 8, 9, 10],
                gongJiJie: 2,
                keChName: '量子力学的研究',
                teacher: '物理教授',
                zhouJi: 5,
            },
            {
                diDian: "一教3022",
                diJiJie: 11,
                diJiZhou: [8, 9, 11, 10],
                gongJiJie: 2,
                keChName: '自然语言处理',
                teacher: 'AI学博士',
                zhouJi: 6,
            },
            {
                diDian: "一教3022",
                diJiJie: 1,
                diJiZhou: [9, 11, 12, 10],
                gongJiJie: 2,
                keChName: '云服务器创建',
                teacher: '计算机研究员',
                zhouJi: 7,
            },
        ],
        kebiaoArrNew: [],
        colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
        biaoti_dijijie_list: [{
                name: '1',
                time1: '08:00',
                time2: '08:45'
            },
            {
                name: '2',
                time1: '08:55',
                time2: '09:40'
            },
            {
                name: '3',
                time1: '10:10',
                time2: '10:55'
            },
            {
                name: '4',
                time1: '11:05',
                time2: '11:50'
            },
            {
                name: '5',
                time1: '14:30',
                time2: '15:15'
            },
            {
                name: '6',
                time1: '15:25',
                time2: '16:10'
            },
            {
                name: '7',
                time1: '16:40',
                time2: '17:25'
            },
            {
                name: '8',
                time1: '17:35',
                time2: '18:20'
            },
            {
                name: '9',
                time1: '19:30',
                time2: '20:15'
            },
            {
                name: '10',
                time1: '20:25',
                time2: '21:10'
            },
            {
                name: '11',
                time1: '21:40',
                time2: '22:25'
            },
            {
                name: '12',
                time1: '22:35',
                time2: '23:20'
            },
        ],
        isShow: false,
        // 开发 编辑时开启
        // isShowAdd: true,
        // dialog3: true,//第几周选择框是否显示
        // isAdd: true,

        isShowAdd: false, // 添加课程弹出框
        dialog3: false, //第几周选择框是否显示
        isAdd: false, // 是否 添加或编辑
        isGengduo: false, // 是否 更多

        isAddDJZ: false,
        isEdit: false,
        tapNum: '',
        id: '',
        login_ok: false,
        // 单选 双选 全选 清空
        isDanzhou: false,
        isShuangzhou: false,
        isQuanxuan: false,
        isClear: false,

        // 是否本周
        // feibenzhou:'',
        benzhou: '',
        // isFeiBenzhou:false,

        iamgeUrl_unchoose: '../../../images/danxuanweixuan.png',
        iamgeUrl_choosed: '../../../images/danxuanxuanzhong.png',

        value_keChName: '',
        value_diJiZhou: '-选择-',
        value_zhouJi: '-选择-',
        value_diJiJie: '-选择-',
        value_gongJiJie: '-选择-',
        value_diDian: '',
        value_teacher: '',
        value_addDiJiZhou: '-选择-',
        value_congJiJie: '-选',
        value_daoJiJie: '择-',

        diJiZhou: 10,
        zhouJi: '',
        diJiJie: '',
        gongJiJie: '',
        keChName: '',
        teacher: '',
        diDian: '',
        // 第几周列表
        // ceshilist: ['第01周', '第02周', '第03周'],
        diJiZhouList: ['第01周', '第02周', '第03周', '第04周', '第05周', '第06周', '第07周', '第08周', '第09周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周', '第20周'],
        diJiZhouListPicker: ['第01周', '第02周', '第03周', '第04周', '第05周', '第06周', '第07周', '第08周', '第09周', '第10周', '第11周', '第12周', '第13周', '第14周', '第15周', '第16周', '第17周', '第18周', '第19周', '第20周'],
        diJiZhouListNew: [{
                value: '第01周',
            },
            {
                value: '第02周',
            },
            {
                value: '第03周',
            },
            {
                value: '第04周',
            },
            {
                value: '第05周',
            },
            {
                value: '第06周',
            },
            {
                value: '第07周',
            },
            {
                value: '第08周',
            },
            {
                value: '第09周',
            },
            {
                value: '第10周',
            },
            {
                value: '第11周',
            },
            {
                value: '第12周',
            },
            {
                value: '第13周',
            },
            {
                value: '第14周',
            },
            {
                value: '第15周',
            },
            {
                value: '第16周',
            },
            {
                value: '第17周',
            },
            {
                value: '第18周',
            },
            {
                value: '第19周',
            },
            {
                value: '第20周',
            }
        ],

        // 学校周历
        zhouLiArr: [],
        // zhouLiArr: [{
        //         month: '9',
        //         day: [1, 2, 3, 4, 5, 6, 7],
        //         daymore: ['09/01', '09/02', '09/03', '09/04', '09/05', '09/06', '09/07']
        //     },
        //     {
        //         month: '9',
        //         day: [8, 9, 10, 11, 12, 13, 14],
        //         daymore: ['09/08', '09/09', '09/10', '09/11', '09/12', '09/13', '09/14']
        //     },
        //     {
        //         month: '9',
        //         day: [15, 16, 17, 18, 19, 20, 21],
        //         daymore: ['09/15', '09/16', '09/17', '09/18', '09/19', '09/20', '09/21']
        //     },
        //     {
        //         month: '9',
        //         day: [22, 23, 24, 25, 26, 27, 28],
        //         daymore: ['09/22', '09/23', '09/24', '09/25', '09/26', '09/27', '09/28']
        //     },
        //     {
        //         month: '10',
        //         day: [29, 30, 31, 1, 2, 3, 4],
        //         daymore: ['09/29', '09/30', '09/31', '10/01', '10/02', '10/03', '10/04']
        //     },
        //     {
        //         month: '10',
        //         day: [5, 6, 7, 8, 9, 10, 11],
        //         daymore: ['10/05', '10/06', '10/07', '10/08', '10/09', '10/10', '10/11']
        //     },
        //     {
        //         month: '10',
        //         day: [12, 13, 14, 15, 16, 17, 18],
        //         daymore: ['10/12', '10/13', '10/14', '10/15', '10/16', '10/17', '10/18']
        //     },
        //     {
        //         month: '10',
        //         day: [19, 20, 21, 22, 23, 24, 25],
        //         daymore: ['10/19', '10/20', '10/21', '10/22', '10/23', '10/24', '10/25']
        //     },
        //     {
        //         month: '11',
        //         day: [26, 27, 28, 29, 30, 1, 2],
        //         daymore: ['10/26', '10/27', '10/28', '10/29', '10/30', '11/01', '11/02']
        //     },
        //     {
        //         month: '11',
        //         day: [3, 4, 5, 6, 7, 8, 9],
        //         daymore: ['11/03', '11/04', '11/05', '11/06', '11/07', '11/08', '11/09']
        //     },
        //     {
        //         month: '11',
        //         day: [10, 11, 12, 13, 14, 15, 16],
        //         daymore: ['11/10', '11/11', '11/12', '11/13', '11/14', '11/15', '11/16']
        //     },
        //     {
        //         month: '11',
        //         day: [17, 18, 19, 20, 21, 22, 23],
        //         daymore: ['11/17', '11/18', '11/19', '11/20', '11/21', '11/22', '11/23']

        //     },
        //     {
        //         month: '11',
        //         day: [24, 25, 26, 27, 28, 29, 30],
        //         daymore: ['11/24', '11/25', '11/26', '11/27', '11/28', '11/29', '11/30']
        //     },
        //     {
        //         month: '12',
        //         day: [31, 1, 2, 3, 4, 5, 6],
        //         daymore: ['11/31', '12/01', '12/02', '12/03', '12/04', '12/05', '12/06']
        //     },
        //     {
        //         month: '12',
        //         day: [7, 8, 9, 10, 11, 12, 13],
        //         daymore: ['12/07', '12/08', '12/09', '12/10', '12/11', '12/12', '12/13']
        //     },
        //     {
        //         month: '12',
        //         day: [14, 15, 16, 17, 18, 19, 20],
        //         daymore: ['12/14', '12/15', '12/16', '12/17', '12/18', '12/19', '12/20']
        //     },
        //     {
        //         month: '12',
        //         day: [21, 22, 23, 24, 25, 26, 27],
        //         daymore: ['12/21', '12/22', '12/23', '12/24', '12/25', '12/26', '12/27']
        //     },
        //     {
        //         month: '1',
        //         day: [28, 29, 30, 1, 2, 3, 4],
        //         daymore: ['12/28', '12/29', '12/30', '01/01', '01/02', '01/03', '01/04']
        //     },
        //     {
        //         month: '1',
        //         day: [5, 6, 7, 8, 9, 10, 11],
        //         daymore: ['01/05', '01/06', '01/07', '01/08', '01/09', '01/10', '01/11']
        //     },
        //     {
        //         month: '1',
        //         day: [12, 13, 14, 15, 16, 17, 18],
        //         daymore: ['01/12', '01/13', '01/14', '01/15', '01/16', '01/17', '01/18']
        //     },
        //     {
        //         month: '1',
        //         day: [19, 20, 21, 22, 23, 24, 25],
        //         daymore: ['01/19', '01/20', '01/21', '01/22', '01/23', '01/24', '01/25']
        //     },
        // ],
        week: {},
        dayArr: [],
        zhouJiList: [{
            id: 1,
            name: '周一'
        }, {
            id: 2,
            name: '周二'
        }, {
            id: 3,
            name: '周三'
        }, {
            id: 4,
            name: '周四'
        }, {
            id: 5,
            name: '周五'
        }, {
            id: 6,
            name: '周六'
        }, {
            id: 7,
            name: '周日'
        }],
        diJiJieList: [{
            id: 1,
            name: '第1节'
        }, {
            id: 2,
            name: '第2节'
        }, {
            id: 3,
            name: '第3节'
        }, {
            id: 4,
            name: '第4节'
        }, {
            id: 5,
            name: '第5节'
        }, {
            id: 6,
            name: '第6节'
        }, {
            id: 7,
            name: '第7节'
        }, {
            id: 8,
            name: '第8节'
        }, {
            id: 9,
            name: '第9节'
        }, {
            id: 10,
            name: '第10节'
        }, {
            id: 11,
            name: '第11节'
        }, {
            id: 12,
            name: '第12节'
        }],
        gongJiJieList: [{
            id: 1,
            name: '上1节'
        }, {
            id: 2,
            name: '上2节'
        }, {
            id: 3,
            name: '上3节'
        }, {
            id: 4,
            name: '上4节'
        }],

        // 新从几节到第几节
        multiIndex: [],
        multiArray: [
            ['从1节', '从2节', '从3节', '从4节', '从5节', '从6节', '从7节', '从8节', '从9节', '从10节', '从11节', '从12节', ],
            ['到第1节', '到第2节', '到第3节', '到第4节', '到第5节', '到第6节', '到第7节', '到第8节', '到第9节', '到第10节', '到第11节', '到第12节']
        ],
        congJiJieList: [
            '从1节', '从2节', '从3节', '从4节', '从5节', '从6节', '从7节', '从8节', '从9节', '从10节', '从11节', '从12节',
            // ['到第1节','到第2节','到第3节','到第4节','到第5节','到第6节','到第7节','到第8节','到第9节','到第10节','到第11节','到第12节',]
        ],
        daoJiJieList: [
            ['到第1节', '到第2节', '到第3节', '到第4节', '到第5节', '到第6节', '到第7节', '到第8节', '到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第2节', '到第3节', '到第4节', '到第5节', '到第6节', '到第7节', '到第8节', '到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第3节', '到第4节', '到第5节', '到第6节', '到第7节', '到第8节', '到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第4节', '到第5节', '到第6节', '到第7节', '到第8节', '到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第5节', '到第6节', '到第7节', '到第8节', '到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第6节', '到第7节', '到第8节', '到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第7节', '到第8节', '到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第8节', '到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第9节', '到第10节', '到第11节', '到第12节'],
            ['到第10节', '到第11节', '到第12节'],
            ['到第11节', '到第12节'],
            ['到第12节']
        ],

        toDiJiZhou_e: '',
        utils_month: '',
        utils_day: '',

        image_url: '',
        // imageMode:'scaleToFill',//缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满image元素
        imageMode: 'scaleToFill', //缩放模式，宽度不变，高度自动变化，保持原图宽高比不变
        // aspectFit	缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。	
        // aspectFill	缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。	
        // widthFix	缩放模式，宽度不变，高度自动变化，保持原图宽高比不变	
        // heightFix	缩放模式，高度不变，宽度自动变化，保持原图宽高比不变


        showDijizhou: false,
    },


    toJiban_daoru(e) {
        this.setData({
            isShow_jiban: false,
        });
        // var val_jiban = e.currentTarget.dataset.item
        // var banji = this.data.res_banji + val_jiban
        var banji = e.currentTarget.dataset.item
        console.log(banji);
        //开始导入课表
        var openid = wx.getStorageSync('openid')
        var add_time = utils_time.formatTime(new Date())
        var that = this
        wx.showModal({
            title: '提示',
            content: '导入前原数据将被清空，是否继续？',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.showLoading({
                        title: '导入中..',
                    })
                    that.setData({
                        isGengduo: false
                    })
                    wx.cloud.callFunction({
                            name: 'kebiao_daoru',
                            data: {
                                openid,
                                add_time,
                                banji,
                            }
                        })
                        .then(res => {
                            console.log('导入成功', res);
                            wx.showToast({
                                icon: 'success',
                                title: '导入成功',
                            })
                            that.onShow()
                        })
                        .catch(err => {
                            wx.showToast({
                                icon: 'error',
                                title: '导入失败',
                            })
                            console.log('导入失败', err);
                        })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    async openDaoru() { // 选择几班
        var login_ok = wx.getStorageSync('login_ok')
        if (!login_ok) {
            console.log('用户未登陆，想要添加课表 不成功')
            wx.showToast({
                icon: 'none',
                title: '未登陆',
            })
            utils_toShouQuan.toShouQuan(url)
        } else {
            var id = wx.getStorageSync('id')
            var res_banji = await wx.cloud.database().collection('user').doc(id).get()
            var banji = res_banji.data.banji
            var nianji = res_banji.data.nianji


            // var res_jiban = await db.collection('kebiao_datas').aggregate().project({
            //     aStrIndex: $.indexOfCP(['$daorulaiyuan', xingzheng_banji]),
            //     banji:1,
            //     daorulaiyuan:1,
            //     })
            //     // .skip(index * 20)
            //     .end()
            // console.log(res_jiban);
            // res_jiban.list.forEach(element => {
            //     element.banji.forEach(banji_item => {
            //         if (jibanList.indexOf(banji_item) == -1) {
            //             jibanList.push(banji_item) 
            //         }
            //     })
            // });
            // console.log('jibanList:::',jibanList);

            if (banji == '' || nianji == '') {
                
                utils_toShouQuan.toZiliao_buquan(url) //跳转到授权登录页面 不全资料
                return
            } else if (banji != '' && nianji != '') {
                // var jibanList = []
                // for (let index = 1; index < 6; index++) {
                //     var item = nianji + banji + index + '班'
                //     jibanList.push(item)
                // }
                var xingzheng_banji = nianji + banji
                console.log(xingzheng_banji);
                
                wx.showLoading({})
                var jibanList = []
                var res_jiban = await wx.cloud.database().collection('banner').doc('daorukebiaobanjixuanze0001').get()
                console.log(res_jiban);
                res_jiban.data.banjiArr.forEach(element => {
                    if (element.indexOf(xingzheng_banji) !== -1) {
                        if (element.indexOf('(') !== -1) {
                            element = element + ')'
                        }
                        jibanList.push(element)
                    }
                });
                console.log('jibanList:::', jibanList);
                wx.hideLoading({})
                this.setData({
                    // res_banji,
                    jibanList,
                })
                this.openJiban()
            }
        }
    },

    closeJiban() {
        this.setData({
            isShow_jiban: false,
        });
    },
    openJiban: function () { //选择几班
        this.setData({
            isShow_jiban: true
        });
    },



    // 获取周历 生成对象
    getZhouli(startDate, num_jizhou) {
        // 天数 数组计算
        var jige5 = Math.floor(num_jizhou / 5) // 19/5=3.8
        var yushu_jizhou = num_jizhou % 5 // 19%5=4
        var zhouLiArr = []
        for (let i = 0; i < jige5; i++) { // 几个5周
            for (let j = 0; j < 5; j++) { //每5周 生成1次
                var startDate_after7 = utils_time.formatGetZhouli(startDate, j * 7).tomorrows
                // console.log(j, startDate_after7);
                var item = this.getZhouli_tianshu(startDate_after7)
                zhouLiArr.push(item)
            }
            startDate = utils_time.formatGetZhouli(startDate_after7, 7).tomorrows
        }

        for (let j = 0; j < yushu_jizhou; j++) { //余下几周 生成1次
            var startDate_after7 = utils_time.formatGetZhouli(startDate, j * 7).tomorrows
            // console.log(j, startDate_after7);
            var item = this.getZhouli_tianshu(startDate_after7)
            zhouLiArr.push(item)
        }

        console.log('zhouLiArr---', zhouLiArr);
        this.setData({
            zhouLiArr,
        })
        // return zhouLiArr
    },

    getZhouli_tianshu(startDate) { // 获取1周7天的日历
        // var startDate = '2021-09-13'
        var month_dayArr = []
        var dayArr = []
        for (let i = 0; i < 7; i++) {
            var zhouLiArr_item = utils_time.formatGetZhouli(startDate, i)
            month_dayArr.push(zhouLiArr_item.month_day)
            dayArr.push(zhouLiArr_item.day_item)
            var month = zhouLiArr_item.month
        }
        // console.log('------month_dayArr', month_dayArr);
        // console.log('------dayArr', dayArr);
        var item = {
            month: month,
            day: dayArr,
            daymore: month_dayArr,
        }
        // console.log('item',item);
        return item
    },





    // 从几节到第几节
    bindMultiPickerColumnChange: function (e) {
        // console.log(e);
        // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
        var data = {
            multiArray: this.data.multiArray,
            multiIndex: this.data.multiIndex
        };
        let multiArray = this.data.multiArray
        let daoJiJieList = this.data.daoJiJieList
        if (e.detail.column == 0) {
            let daoJiJieArr = daoJiJieList[e.detail.value]
            multiArray.splice(1, 1, daoJiJieArr)
        }
        data.multiIndex[e.detail.column] = e.detail.value;
        this.setData(data);
    },

    bindMultiPickerChange: function (e) {
        console.log('点击确定后选择器的值：', e.detail.value);
        var multiIndex = e.detail.value
        let multiArray = this.data.multiArray
        var value_congJiJie = multiArray[0][multiIndex[0]]
        var value_daoJiJie = multiArray[1][multiIndex[1]]
        var diJiJie = e.detail.value[0] + 1
        var gongJiJie = e.detail.value[1] + 1
        this.setData({
            value_congJiJie,
            value_daoJiJie,
            diJiJie,
            gongJiJie,
        })
        console.log('value_congJiJie，value_daoJiJie携带值为：', value_congJiJie, value_daoJiJie)
        // 保存 送达地点 到缓存
        // wx.setStorageSync('multiIndex', multiIndex)
        // wx.setStorageSync('multiArray', multiArray)
    },

    showDijizhou() {
        this.setData({
            showDijizhou: !this.data.showDijizhou
        })
    },

    toDiJiZhou(e) {
        console.log('toDiJiZhou', e);
        console.log('第几周 用户选择的索引是：', e.currentTarget.dataset);
        var index = e.currentTarget.dataset
        // console.log('第几周 用户选择的索引是：', e.detail.value);
        // 根据第几周的选择 改变 每周的课表 
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            var kebiaoArr = wx.getStorageSync('kebiaoArr')
        } else {
            var kebiaoArr = wx.getStorageSync('juli_kebiaoArr')
        }
        var kebiaoArrNew = []
        var diJiZhou = Number(e.currentTarget.dataset.index) + 1
        // week = {month:'3',day:[22, 23, 24, 25, 26, 27, 28]},
        var week = this.data.zhouLiArr[e.currentTarget.dataset.index]
        var dayArr = week.day
        var daymoreArr = week.daymore
        var month = week.month

        kebiaoArr.forEach(element => {
            // console.log(diJiZhou);
            let diJiZhouArr = element.diJiZhou
            if (diJiZhouArr.includes(diJiZhou)) {
                kebiaoArrNew.push(element)
            }
        });
        this.setData({
            value_diJiZhou: this.data.diJiZhouList[e.currentTarget.dataset.index],
            diJiZhou: diJiZhou,
            kebiaoArr: kebiaoArrNew,
            // week:week,
            dayArr: dayArr,
            daymoreArr: daymoreArr,
            month: month,
            // zhouChooseIndex:e.currentTarget.dataset.index
            // toDiJiZhou_e: e,
        })
        // 保存给编辑删除添加后用
        wx.setStorageSync('diJiZhou', diJiZhou)
    },


    bindchangeDijizh(e) {
        // console.log('bindchangeDijizh', e);
        // console.log('bindchangeDijizh', e.detail.x);
        let diJiZhou = this.data.diJiZhou - 1
        let touchX = e.detail.x

        if (touchX < -8 && touchX > -8.3) {
            console.log('touch 左移 第几周 +1 X<100');
            diJiZhou += 1
            // e.currentTarget.dataset.index
            let e = {
                currentTarget: {
                    dataset: {
                        index: diJiZhou
                    }
                }
            }
            this.toDiJiZhou(e)
        } else if (touchX < -8.3 && touchX > -8.6) {
            console.log('touch 左移 第几周 +1 X<100');
            diJiZhou += 1
            let e = {
                currentTarget: {
                    dataset: {
                        index: diJiZhou
                    }
                }
            }
            this.toDiJiZhou(e)
        }

        if (touchX > 8 && touchX < 8.3) {
            console.log('touch 右移 第几周 -1  X>200');
            diJiZhou -= 1
            let e = {
                currentTarget: {
                    dataset: {
                        index: diJiZhou
                    }
                }
            }
            this.toDiJiZhou(e)
        }

    },
    toGengduo() {
        this.setData({
            isGengduo: true,
        })
    },

    // 去裁剪后添加
    toChangeImage() {

        wx.navigateTo({
            url: '../../imageEdit/imageEdit',
        })

        this.setData({
            isGengduo: false,
        })
    },
    chumo() {
        this.setData({
            tianjiakuang_zhou: 0,
            tianjiakuang_jie: 0,
        })
    },

    toshow_tianjiakuang(e) {
        console.log(e.currentTarget.dataset);
        var tianjiakuang_zhou = e.currentTarget.dataset.item_zhou
        var tianjiakuang_jie = e.currentTarget.dataset.item_jie
        this.setData({
            // isShowAdd: true,
            // isAdd: true,
            // isGengduo: false,
            tianjiakuang_zhou,
            tianjiakuang_jie,
        })
    },
    toAdd_tianjiakuang(e) {
        console.log(e.currentTarget.dataset);

        var zhouJiList = this.data.zhouJiList
        var index = e.currentTarget.dataset.item_zhou - 1
        var value_zhouJi = zhouJiList[index].name
        var zhouJi = zhouJiList[index].id
        var diJiJie = e.currentTarget.dataset.item_jie
        
        var value_congJiJie = '从'+diJiJie+'节'
        var value_daoJiJie = '到第'+diJiJie+'节'
        var gongJiJie = 1
        var value_addDiJiZhou = [this.data.diJiZhou]
        this.setData({
            isShowAdd: true,
            isAdd: true,
            isGengduo: false,

            diDian: '',
            teacher:'',
            keChName:'',
            value_diDian:'',
            value_keChName:'',
            value_teacher:'',

            zhouJi,
            value_zhouJi,
            value_congJiJie,
            value_daoJiJie,
            diJiJie,
            gongJiJie,
            value_addDiJiZhou,
        })
    },

    toAdd() {
        this.setData({
            diDian: '',
            teacher:'',
            keChName:'',
            value_diDian:'',
            value_keChName:'',
            value_teacher:'',
            zhouJi:'',
            value_zhouJi:'-选择-',
            value_congJiJie:'-选',
            value_daoJiJie:'择-',
            diJiJie:'',
            gongJiJie:'',
            value_addDiJiZhou: '-选择-',
            
            isShowAdd: true,
            isAdd: true,
            isGengduo: false,
        })
    },
    close: function () {
        this.setData({
            dialog3: false
        });
    },
    // 打开第几周的选择
    open3() {
        this.setData({
            dialog3: true
        });
    },
    ok3(e) {
        console.log('用户选好了第几周：', e);
        this.setData({
            dialog3: false
        });
    },
    checkboxChange(e) {
        console.log('checkbox发生change事件，携带value值为：', e.detail.value)
        // console.log('checkbox发生change事件，携带value值为：', e)
        let value_addDiJiZhou_string = e.detail.value.sort(function (a, b) {
            return a - b
        });
        let value_addDiJiZhou = []
        value_addDiJiZhou_string.forEach(element => {
            value_addDiJiZhou.push(Number(element))
        });
        this.setData({
            value_addDiJiZhou,
            isClear: false,
        })
        if (e.detail.value == []) {
            this.setData({
                value_addDiJiZhou: '-选择-'
            })
        }
    },

    todjzhAddEdit(e) {
        console.log('添加第几周 弹出框checkbox', e);
        this.setData({
            dialog3: true
        });
        // 设置第几周checkbox的原始值
        var value_addDiJiZhou = this.data.value_addDiJiZhou
        if (value_addDiJiZhou !== '-选择-') {
            value_addDiJiZhou.forEach(index => {
                index -= 1
                let element_checked = 'diJiZhouListNew[' + index + '].checked'
                this.setData({
                    [element_checked]: true
                })
            });
        }
    },

    toAddConfirm() {
        // 课程名称 是否填写
        if (this.data.value_keChName.length < 1 || this.data.value_keChName == null) {
            wx.showToast({
                icon: 'none',
                title: '课名未填',
            })
            return
        }
        // 星期 是否填写
        if (this.data.zhouJi == '-选择-') {
            wx.showToast({
                icon: 'none',
                title: '星期未选',
            })
            return
        }

        // 哪几节 是否选择
        if (this.data.value_congJiJie == '-选' || this.data.value_congJiJie == '择-') {
            wx.showToast({
                icon: 'none',
                title: '哪几节未选',
            })
            return
        }
        // 第几周 是否选择
        if (this.data.value_addDiJiZhou == '-选择-') {
            wx.showToast({
                icon: 'none',
                title: '第几周未选',
            })
            return
        }
        var login_ok = wx.getStorageSync('login_ok')
        if (!login_ok) {
            console.log('用户未登陆，想要添加课表 不成功')
            wx.showToast({
                icon: 'none',
                title: '未登陆',
            })
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        } else {
            wx.cloud.database().collection('kebiao').add({
                    data: {
                        zhouJi: this.data.zhouJi,
                        diJiJie: this.data.diJiJie,
                        gongJiJie: this.data.gongJiJie,
                        keChName: this.data.value_keChName,
                        teacher: this.data.value_teacher,
                        diDian: this.data.value_diDian,
                        diJiZhou: this.data.value_addDiJiZhou,
                    }
                })
                .then(res => {

                    this.setData({
                        isShowAdd: false,
                        isAdd: false,
                        // kebiaoArr,
                    })

                    this.onShow()
                })
                .catch(err => {
                    console.log('kebiao 添加 失败：', err);
                })

        }
    },
    toKeBiaoDetail(e) {
        console.log('打开课表详情的id：', e.currentTarget.id);
        this.setData({
            isShow: true,
            id: e.currentTarget.id
        })

    },
    toMask() {
        // console.log(e);
        this.setData({
            isShow: false
        })
    },
    toMaskgengduo() {
        // console.log(e);
        this.setData({
            isGengduo: false
        })
    },

    toCancel() {
        // 如果当前是编辑状态，退出后，把数据清空，这样添加时没有数据
        if (this.data.isEdit) {
            this.setData({
                value_keChName: '',
                // value_diJiZhou: '-选择-',
                value_zhouJi: '-选择-',
                value_congJiJie: '-选',
                value_daoJiJie: '择-',
                // value_diJiJie: '-选择-',
                // value_gongJiJie: '-选择-',
                value_diDian: '',
                value_teacher: '',
                value_addDiJiZhou: '-选择-',
            })
        }
        // 所有状态关闭
        this.setData({
            isShowAdd: false,
            isAdd: false,
            isEdit: false,
        })
    },

    // -------------------------
    // 输入框状态  课程名称
    onInput_keChName(evt) {
        // console.log(evt);
        const {
            value //系统字段 value 不能改
        } = evt.detail;
        this.setData({
            value_keChName: value,
            showClearBtn_keChName: !!value.length,
        });
    },
    onClear_keChName() {
        this.setData({
            value_keChName: '',
            showClearBtn_keChName: false,
        });
    },
    // 输入框状态  老师
    onInput_teacher(evt) {
        // console.log(evt);
        const {
            value //系统字段 value 不能改
        } = evt.detail;
        this.setData({
            value_teacher: value,
            showClearBtn_teacher: !!value.length,
        });
    },
    onClear_teacher() {
        this.setData({
            value_teacher: '',
            showClearBtn_teacher: false,
        });
    },
    // 输入框状态  地点
    onInput_diDian(evt) {
        // console.log(evt);
        const {
            value //系统字段 value 不能改
        } = evt.detail;
        this.setData({
            value_diDian: value,
            showClearBtn_diDian: !!value.length,
        });
    },
    onClear_diDian() {
        this.setData({
            value_diDian: '',
            showClearBtn_diDian: false,
        });
    },
    // ---------------------------------

    // 星期几的选择
    openAndroid: function () {
        this.setData({
            showAndroidDialog: true
        });
    },
    tanChuSheet(e) {
        console.log('点击弹出式菜单,用户选的星期是：', e.currentTarget.dataset.name, e.currentTarget.dataset.id)
        // currentTarget.id

        this.setData({
            showAndroidDialog: false,
            zhouJi: e.currentTarget.dataset.id,
            value_zhouJi: e.currentTarget.dataset.name
        });
    },

    // // 第几节 的选择
    // openAndroid1: function () {
    //     this.setData({
    //         showAndroidDialog1: true
    //     });
    // },
    // tanChuSheet1(e) {
    //     console.log('点击弹出式菜单,用户选择的 第几节是：', e.currentTarget.dataset.name, e.currentTarget.dataset.id)
    //     // currentTarget.id
    //     this.setData({
    //         showAndroidDialog1: false,
    //         diJiJie: e.currentTarget.dataset.id,
    //         value_diJiJie: e.currentTarget.dataset.name
    //     });
    // },

    // // 共几节 的选择
    // openAndroid2: function () {
    //     this.setData({
    //         showAndroidDialog2: true
    //     });
    // },
    // tanChuSheet2(e) {
    //     console.log('点击弹出式菜单,用户选择的 共几节 是：', e.currentTarget.dataset.name, e.currentTarget.dataset.id)
    //     // currentTarget.id
    //     this.setData({
    //         showAndroidDialog2: false,
    //         gongJiJie: e.currentTarget.dataset.id,
    //         value_gongJiJie: e.currentTarget.dataset.name
    //     });
    // },
    toEdit() {
        if (this.data.login_ok) {
            console.log('点击编辑', this.data.id);
            console.log('点击编辑', this.data.kebiaoArr[this.data.id]);
            var id = this.data.id
            var kebiaoArr = this.data.kebiaoArr
            // 点击详情后 查看到的数据 对象
            this.setData({
                isShowAdd: true,
                isEdit: true,
                // 设置当前需要编辑的默认值
                value_zhouJi: this.data.zhouJiList[kebiaoArr[id].zhouJi - 1].name,
                value_congJiJie: this.data.congJiJieList[kebiaoArr[id].diJiJie - 1],
                value_daoJiJie: this.data.daoJiJieList[kebiaoArr[id].diJiJie - 1][kebiaoArr[id].gongJiJie - 1],
                // value_diJiJie: this.data.diJiJieList[kebiaoArr[id].diJiJie-1].name,
                // value_gongJiJie: this.data.gongJiJieList[kebiaoArr[id].gongJiJie-1].name,
                value_keChName: kebiaoArr[id].keChName,
                value_diDian: kebiaoArr[id].diDian,
                value_teacher: kebiaoArr[id].teacher,
                value_addDiJiZhou: kebiaoArr[id].diJiZhou,
                // 设置为原始值 
                zhouJi: kebiaoArr[id].zhouJi,
                diJiJie: kebiaoArr[id].diJiJie,
                gongJiJie: kebiaoArr[id].gongJiJie,
            })
            // 设置第几周checkbox的原始值
            for (let index = 0; index < this.data.diJiZhouListNew.length; index++) {
                // const element = this.data.diJiZhouListNew[index];
                if (kebiaoArr[id].diJiZhou.includes(index + 1)) {
                    console.log('index', index);
                    let element_checked = 'diJiZhouListNew[' + index + '].checked'
                    this.setData({
                        [element_checked]: true
                    })
                }
            }

        } else {
            console.log('用户未登陆，想要 编辑 不成功')
            wx.showToast({
                icon: 'none',
                title: '未登陆',
            })
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }

    },
    // 编辑 提交 课表详情
    toEdit_comfirm() {
        wx.showLoading({
            title: '提交中',
        })
        // 当前第几周对应的课表
        let kebiaoArr = this.data.kebiaoArr
        // 用户点击的 id
        let id = this.data.id
        // 用户点击的id 对应的 _id
        let _id = kebiaoArr[id]._id
        wx.cloud.database().collection('kebiao').doc(_id)
            .update({
                data: {
                    zhouJi: this.data.zhouJi,
                    diJiJie: this.data.diJiJie,
                    gongJiJie: this.data.gongJiJie,
                    keChName: this.data.value_keChName,
                    teacher: this.data.value_teacher,
                    diDian: this.data.value_diDian,
                    diJiZhou: this.data.value_addDiJiZhou,
                }
            })
            .then(res => {

                wx.hideLoading()
                console.log('编辑课程 提交成功：', res.stats);
                this.toCancel()
                this.onShow()
            })
            .catch(err => {
                wx.hideLoading()
                console.log('编辑课程 提交 失败：', err);
            })
    },
    toDele() {
        let that = this
        wx.showModal({
            title: '确定删除？',
            // content: '这是一个模态弹窗',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    //   调用删除函数
                    that.toDeleConfirm()
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    // 删除课表
    toDeleConfirm() {
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            wx.showLoading({
                title: '删除中',
            })
            // 当前第几周对应的课表
            let kebiaoArr = this.data.kebiaoArr
            // 用户点击的 id
            let id = this.data.id
            // 用户点击的id 对应的 _id
            let _id = kebiaoArr[id]._id
            let diJiZhouArr = kebiaoArr[id].diJiZhou
            // 比如第10周：10
            let diJiZhou = this.data.diJiZhou
            // 删除后的 新第几周 数组
            let diJiZhouArrNew = []
            diJiZhouArr.forEach(element => {
                if (element != diJiZhou) {
                    diJiZhouArrNew.push(element)
                }
            });
            console.log('_id', _id);
            console.log('diJiZhouArrNew', diJiZhouArrNew);
            // 云端 更新当前第几周数组
            if (diJiZhouArrNew.length > 0) {
                wx.cloud.database().collection('kebiao').doc(_id)
                    .update({
                        data: {
                            diJiZhou: diJiZhouArrNew
                        }
                    })
                    .then(res => {
                        console.log('删除成功', res);
                        // 刷新页面
                        // this.onLoad(wx.getStorageSync('diJiZhou'))
                        this.onShow()
                        wx.hideLoading()
                    })
                    .catch(err => {
                        console.log('删除失败', err);
                        wx.hideLoading()
                    })
            } else {
                // console.log(diJiZhouArrNew);
                wx.cloud.database().collection('kebiao').doc(_id)
                    .remove()
                    .then(res => {
                        console.log('diJiZhouArrNew为空，删除成功', res);
                        // 刷新页面
                        // this.onLoad(wx.getStorageSync('diJiZhou'))
                        this.onShow()
                        wx.hideLoading()
                    })
                    .catch(err => {
                        console.log('diJiZhouArrNew为空，删除失败', err);
                        wx.hideLoading()
                    })
            }
        } else {
            console.log('用户未登陆，想要 删除 不成功')
            wx.showToast({
                icon: 'none',
                title: '未登陆',
            })
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },
    // 返回本周
    toBenZhou() {
        wx.removeStorageSync('diJiZhou')
        // this.onLoad()
        this.onShow()
    },

    // 单双全选 选择
    toDanZhou() {
        this.setData({
            isDanzhou: true,
            isShuangzhou: false,
            isQuanxuan: false,
            isClear: false,
        })
        // 先 清空
        var e = {
            detail: {
                'value': []
            }
        }
        this.checkboxChange(e)
        for (let index = 0; index < this.data.diJiZhouListNew.length; index++) {
            let element = 'diJiZhouListNew[' + index + '].checked'
            this.setData({
                [element]: false
            })
        }
        // 再 单周
        var e = {
            detail: {
                'value': ['1', '3', '5', '7', '9', '11', '13', '15', '17', '19']
            }
        }
        this.checkboxChange(e)
        for (let index = 0; index < this.data.diJiZhouListNew.length; index++) {
            if ([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].includes(index)) {
                let element = 'diJiZhouListNew[' + index + '].checked'
                this.setData({
                    [element]: true
                })
            }
        }
    },
    toShuangzh() {
        this.setData({
            isDanzhou: false,
            isShuangzhou: true,
            isQuanxuan: false,
            isClear: false,
        })
        // 先 清空
        var e = {
            detail: {
                'value': []
            }
        }
        this.checkboxChange(e)
        for (let index = 0; index < this.data.diJiZhouListNew.length; index++) {
            let element = 'diJiZhouListNew[' + index + '].checked'
            this.setData({
                [element]: false
            })
        }
        // 再 双周
        var e = {
            detail: {
                'value': ['2', '4', '6', '8', '10', '12', '14', '16', '18', '20']
            }
        }
        this.checkboxChange(e)
        for (let index = 0; index < this.data.diJiZhouListNew.length; index++) {
            if ([1, 3, 5, 7, 9, 11, 13, 15, 17, 19, ].includes(index)) {
                let element = 'diJiZhouListNew[' + index + '].checked'
                this.setData({
                    [element]: true
                })
            }
        }
    },
    toQuanxuan() {
        this.setData({
            isDanzhou: false,
            isShuangzhou: false,
            isQuanxuan: true,
            isClear: false,
        })
        // 先 清空
        var e = {
            detail: {
                'value': []
            }
        }
        this.checkboxChange(e)
        for (let index = 0; index < this.data.diJiZhouListNew.length; index++) {
            let element = 'diJiZhouListNew[' + index + '].checked'
            this.setData({
                [element]: false
            })
        }
        // 再 全选
        var e = {
            detail: {
                'value': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20']
            }
        }
        this.checkboxChange(e)
        for (let index = 0; index < this.data.diJiZhouListNew.length; index++) {
            let element = 'diJiZhouListNew[' + index + '].checked'
            this.setData({
                [element]: true
            })
        }
    },
    toClear() {
        this.setData({
            isDanzhou: false,
            isShuangzhou: false,
            isQuanxuan: false,
            isClear: true,
            value_addDiJiZhou: '-选择-'
        })
        // 先 清空
        // var e = { detail: { 'value': [] } }//选那几周对应的id数组
        // this.checkboxChange(e)
        for (let index = 0; index < this.data.diJiZhouListNew.length; index++) {
            let element = 'diJiZhouListNew[' + index + '].checked'
            this.setData({
                [element]: false
            })
        }
    },


    onLoad: function (options) {
        // // 获取提醒 地点选择列表 等
        // wx.cloud.database().collection('banner').doc('kebiao0001')
        //     .get()
        //     .then(res => {
        //         console.log('后台主参数 kebiao0001', res.data);
        //         var xiaoli_date = res.data.xiaoli_date
        //         var xiaoli_zhoushu = res.data.xiaoli_zhoushu
        //         this.getZhouli(xiaoli_date, xiaoli_zhoushu)
        //     })
        //     .catch(err => {
        //         console.log('后台主参数 toptipsdaiqu：： 失败', err);
        //     })
        var xiaoli_date = options.xiaoli_date
        var xiaoli_zhoushu = Number(options.xiaoli_zhoushu)

        console.log(xiaoli_date, xiaoli_zhoushu);
        this.getZhouli(xiaoli_date, xiaoli_zhoushu)

        var login_ok = wx.getStorageSync('login_ok')
        if (!login_ok) {
            wx.setStorageSync('juli_kebiaoArr', this.data.kebiaoArr)
        } else {
            this.setData({
                login_ok,
            })
        }

        // 暂时不用
        // var diJiZhou = wx.getStorageSync('diJiZhou')
        // if (diJiZhou) {
        //     var kebiaoArrNew = []

        //     var login_ok = wx.getStorageSync('login_ok')
        //     if (login_ok) {
        //         wx.cloud.callFunction({
        //             name: 'yonghu',
        //             data: {
        //                 kebiao: true,
        //                 _openid: wx.getStorageSync('openid')
        //             }
        //         })
        //         wx.cloud.database().collection('kebiao')
        //             .get()
        //             .then(res => {
        //                 console.log('已登陆，下载数据 成功', res);
        //                 wx.setStorageSync('kebiaoArr', res.data)
        //                 res.data.forEach(element => {
        //                     let diJiZhouArr = element.diJiZhou
        //                     if (diJiZhouArr.includes(diJiZhou)) {
        //                         kebiaoArrNew.push(element)
        //                         // console.log(kebiaoArrNew);
        //                     }
        //                 });
        //                 this.setData({
        //                     value_diJiZhou: this.data.diJiZhouList[diJiZhou - 1],
        //                     kebiaoArr: kebiaoArrNew,
        //                 })
        //                 console.log('目前缓存 第几周：', diJiZhou);
        //                 // console.log('dayArr',dayArr);
        //             })
        //             .catch(err => {
        //                 console.log('已登陆，下载数据 失败', err);
        //             })
        //     }
        // } else {
        //     // 判断当前是第几周
        //     // 确定当前是第几周
        //     for (let index = 0; index < this.data.zhouLiArr.length; index++) {
        //         const element = this.data.zhouLiArr[index];
        //         if (element.month == utils_month && element.day.includes(utils_day)) {
        //             // console.log(index);
        //             var diJiZhou = index + 1
        //             this.setData({
        //                 diJiZhou: diJiZhou,
        //                 value_diJiZhou: this.data.diJiZhouList[diJiZhou - 1],
        //             })
        //         }
        //     }
        //     var week = this.data.zhouLiArr[diJiZhou - 1]
        //     var dayArr = week.day
        //     var month = week.month
        //     this.setData({
        //         dayArr: dayArr,
        //         month: month,
        //     })
        //     var kebiaoArrNew = []
        //     // 判断登陆，获取数据
        //     var login_ok = wx.getStorageSync('login_ok')
        //     if (login_ok) {
        //         wx.cloud.database().collection('kebiao')
        //             .get()
        //             .then(res => {
        //                 console.log('已登陆，下载数据 成功', res);
        //                 wx.setStorageSync('kebiaoArr', res.data)
        //                 res.data.forEach(element => {
        //                     let diJiZhouArr = element.diJiZhou
        //                     if (diJiZhouArr.includes(diJiZhou)) {
        //                         kebiaoArrNew.push(element)
        //                         // console.log(kebiaoArrNew);
        //                     }
        //                 });
        //                 this.setData({
        //                     // value_diJiZhou: this.data.diJiZhouList[diJiZhou - 1],
        //                     kebiaoArr: kebiaoArrNew,
        //                 })
        //                 console.log('当前是第几周：', diJiZhou);
        //             })
        //             .catch(err => {
        //                 console.log('已登陆，下载数据 失败', err);
        //             })
        //     }
        // }
    },


    onReady: function () {
        var kebiaoImageUrl = wx.getStorageSync('kebiaoImageUrl')
        var id = wx.getStorageSync('id')
        if (kebiaoImageUrl) {
            this.setData({
                image_url: kebiaoImageUrl
            })
        } else {
            if (this.data.login_ok) {
                wx.cloud.database().collection('user').doc(id)
                    .get()
                    .then(res => {
                        console.log('查询课表背景图链接', res);
                        let kbImageUrl = res.data.kebiaoImageUrl
                        if (kbImageUrl) {
                            this.setData({
                                image_url: kbImageUrl
                            })
                        }
                    })
            }
        }
    },

    onShow: function () {

        // console.log('监听页面显示');
        // 高亮显示当前 星期 和日期
        var utils_month = utils_time.formatMonth(new Date())
        var utils_day = utils_time.formatDay(new Date())
        this.setData({
            utils_month,
            utils_day,
        })
        // console.log('监听页面显示utils_month', utils_month);
        // console.log('监听页面显示utils_day', utils_day);

        // for (let index = 0; index < this.data.zhouLiArr.length; index++) {
        //     const element = this.data.zhouLiArr[index];
        //     if (element.month == utils_month && element.day.includes(utils_day)) {
        //         // console.log(index);
        //         var diJiZhou = index + 1
        //         this.setData({
        //             diJiZhou: diJiZhou,
        //             value_diJiZhou: this.data.diJiZhouList[diJiZhou - 1],
        //         })
        //     }
        // }
        // var week = this.data.zhouLiArr[diJiZhou - 1]
        // var dayArr = week.day
        // var month = week.month
        // this.setData({
        //     dayArr: dayArr,
        //     month: month,
        // })

        var diJiZhou = wx.getStorageSync('diJiZhou')

        if (utils_month < 10) {
            console.log(111111);
            var riqi_month = '0' + String(utils_month)
        } else {
            var riqi_month = String(utils_month)
        }
        if (utils_day < 10) {
            var riqi_day = '0' + String(utils_day)
        } else {
            var riqi_day = String(utils_day)
        }
        var riqi = riqi_month + '/' + riqi_day
        console.log(riqi);
        if (diJiZhou) {
            // 有缓存第几周diJiZhou
            var kebiaoArrNew = []

            var login_ok = wx.getStorageSync('login_ok')
            var openid = wx.getStorageSync('openid')
            if (login_ok) {
                wx.removeStorageSync('juli_kebiaoArr') //如果登陆的 删除演示举例用的 课表
                let that = this
                wx.cloud.callFunction({
                        name: 'yonghu',
                        data: {
                            kebiao: true,
                            openid,
                        }
                    })
                    .then(res => {
                        // wx.cloud.database().collection('kebiao')
                        //     .get()
                        //     .then(res => {
                        console.log('diJiZhou已登陆，云函数 yonghu 下载数据 成功', res.result.data);
                        wx.setStorageSync('kebiaoArr', res.result.data)
                        res.result.data.forEach(element => {
                            let diJiZhouArr = element.diJiZhou
                            if (diJiZhouArr.includes(diJiZhou)) {
                                kebiaoArrNew.push(element)
                                // console.log(kebiaoArrNew);
                            }
                        });
                        that.setData({
                            value_diJiZhou: that.data.diJiZhouList[diJiZhou - 1],
                            kebiaoArr: kebiaoArrNew,
                            login_ok,
                        })
                        console.log('目前缓存 第几周：', diJiZhou);
                        // console.log('dayArr',dayArr);
                    })
                    .catch(err => {
                        console.log('diJiZhou已登陆，云函数 yonghu 下载数据 失败', err);
                    })
            }
        } else {
            // 判断当前是第几周
            // 没有缓存 第几周 则显示当前日期对应的 第几周
            var zhouLiArr = this.data.zhouLiArr
            // var riqi = '0' + String(utils_month) + '/' + utils_day
            console.log(riqi);
            for (let index = 0; index < zhouLiArr.length; index++) {
                const element = zhouLiArr[index];
                // if (element.month == utils_month && element.day.includes(utils_day)) {
                if (element.daymore.includes(riqi)) {
                    // console.log(index);
                    var diJiZhou = index + 1
                    console.log('1111', diJiZhou);
                    // this.data.diJiZhouList.splice(index, 1, '本周')
                    // this.data.diJiZhouListPicker[index] = this.data.diJiZhouListPicker[index]+'(本周)'
                    let diJiZhouListNew = this.data.diJiZhouListNew
                    let diJiZhouListPickerNew = [] //对本周标记处理
                    let diJiZhouListPicker = this.data.diJiZhouList
                    for (let index2 = 0; index2 < diJiZhouListPicker.length; index2++) {
                        const element2 = diJiZhouListPicker[index2];
                        if (index2 == index) {
                            // diJiZhouListPickerNew.push(element2 + '（本周）')
                            diJiZhouListNew[index2].showBenzhou = true
                        } else {
                            diJiZhouListNew[index2].showBenzhou = false
                            // diJiZhouListPickerNew.push(element2)
                        }
                    }
                    this.setData({
                        diJiZhou: diJiZhou,
                        value_diJiZhou: this.data.diJiZhouList[diJiZhou - 1],
                        benzhou: this.data.diJiZhouList[diJiZhou - 1], //非本周显示
                        // diJiZhouListPicker: diJiZhouListPickerNew,
                        diJiZhouListNew,
                    })

                }
            }
            console.log(diJiZhou);
            var week = zhouLiArr[diJiZhou - 1]
            var dayArr = week.day
            var daymoreArr = week.daymore
            var month = week.month
            this.setData({
                dayArr: dayArr,
                daymoreArr: daymoreArr,
                month: month,
            })

            var kebiaoArrNew = []
            // 判断登陆，获取数据
            var login_ok = wx.getStorageSync('login_ok')
            if (login_ok) {
                wx.removeStorageSync('juli_kebiaoArr') //如果登陆的 删除演示举例用的 课表
                let that = this
                var openid = wx.getStorageSync('openid')
                wx.cloud.callFunction({
                        name: 'yonghu',
                        data: {
                            kebiao: true,
                            openid: openid
                        }
                    })
                    .then(res => {
                        // console.log('云函数 yonghu 获取：', res);
                        // })
                        // wx.cloud.database().collection('kebiao')
                        //     .get()
                        //     .then(res => {
                        console.log('已登陆，云函数 yonghu 下载数据 成功', res.result.data);
                        wx.setStorageSync('kebiaoArr', res.result.data)
                        res.result.data.forEach(element => {
                            let diJiZhouArr = element.diJiZhou
                            if (diJiZhouArr.includes(diJiZhou)) {
                                kebiaoArrNew.push(element)
                                // console.log(kebiaoArrNew);
                            }
                        });
                        that.setData({
                            // value_diJiZhou: this.data.diJiZhouList[diJiZhou - 1],
                            kebiaoArr: kebiaoArrNew,
                            login_ok,
                        })
                        console.log('当前是第几周：', diJiZhou);
                    })
                    .catch(err => {
                        console.log('已登陆，云函数 yonghu 下载数据 失败', err);
                    })
            }
        }

        var kebiaoImageUrl = wx.getStorageSync('kebiaoImageUrl')
        if (kebiaoImageUrl) {
            this.setData({
                image_url: kebiaoImageUrl
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // 页面隐藏，删除第几周 返回当前 周
        console.log('页面隐藏，删除缓存diJiZhou');
        wx.removeStorageSync('diJiZhou')
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log(1);
        var db = wx.cloud.database()
        var _ = db.command
        const $ = db.command.aggregate
        db.collection('kebiao_datas').where({
                banji: _.elemMatch(_.eq('2021国际经济与贸易1班'))
                // banji: ['2022国际经济与贸易2班']
            }).get()
            .then(res => {
                console.log('res', res);
            })
            .catch(err => {
                console.log('err', err);
            })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})