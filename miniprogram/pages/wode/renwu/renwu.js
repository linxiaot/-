// pages/wode/renwu/renwu.js
var utils_time = require('../../../utils/time.js') //获取时间等

Page({
    data: {
        isQiandao: false,
        isDianzan: false,
        isPinglun: false,
        isZiliaoPercent: false,
        ziliaoPercent:0,
        qiangFabu_num: 0,
    },

    toComplete_ziliao() {
        wx.navigateTo({
          url: '../ziliao/ziliao',
        })
    },
    toComplete_dianzan() {
        wx.switchTab({
          url: '../../shouye/shouye',
        })
    },
    toComplete_pinglun() {
        wx.switchTab({
            url: '../../qiang/qiang',
        })
    },
    toComplete_qiandao() {
        wx.navigateBack({
            delta: 0,
        })
    },
    toComplete_qiang() {
        wx.switchTab({
            url: '../../qiang/qiang',
        })
    },

    checke() { // 查询积分详情，其中发布获得的积分种类
        var dateQiandao = utils_time.formatnianyueri(new Date())
        var id = wx.getStorageSync('id')
        var qiangFabu_num = this.data.qiangFabu_num
        var jifen_name_list = []
        var qiangFabu_num_list = []
        wx.cloud.database().collection('user').doc(id)
            .get()
            .then(res => {
                console.log('user：：', res.data);
                // 签到任务
                if (dateQiandao == res.data.qiandao.dateQiandao) {
                    this.setData({
                        isQiandao: true,
                    })
                }
                // 点赞任务
                if (dateQiandao == res.data.dateDianzan) {
                    this.setData({
                        isDianzan: true,
                    })
                }
                // 评论任务
                if (dateQiandao == res.data.datePinglun) {
                    this.setData({
                        isPinglun: true,
                    })
                }
                //资料完整度
                var ziliaoPercent = res.data.ziliaoPercent
                if (ziliaoPercent == 100) {
                    this.setData({
                        isZiliaoPercent : true
                    })
                }

                // 发布任务
                var jifenList = res.data.jifen
                // if (typeof(jifenList)=='object') {
                //     jifenList = [jifenList]
                //   }
                jifenList.forEach(element => {
                    var jifen_time = element.jifen_time.slice(0, 10)
                    // if (jifen_time == '2021-04-26') {
                    if (jifen_time == dateQiandao) {
                        console.log(element.jifen_name);
                        jifen_name_list.push(element.jifen_name)
                    }
                });
                // console.log(jifen_name_list.includes('代取'));
                if (jifen_name_list.includes('黄页发布')) {
                    qiangFabu_num_list.push(1)
                }
                if (jifen_name_list.includes('失物招领发布')) {
                    qiangFabu_num_list.push(1)
                }
                if (jifen_name_list.includes('拼车发布')) {
                    qiangFabu_num_list.push(1)
                }
                if (jifen_name_list.includes('跳蚤市场发布')) {
                    qiangFabu_num_list.push(1)
                }
                if (jifen_name_list.includes('校园互助发布')) {
                    qiangFabu_num_list.push(1)
                }
                // var values = [1,2,3,4,5];
                var qiangFabu_num = qiangFabu_num_list.reduceRight(function (prev, cur, index, array) {
                    return prev + cur;
                }, 0); //数组一开始加了一个初始值10,可以不设默认0
                console.log(qiangFabu_num); //25
                this.setData({
                    qiangFabu_num,
                    ziliaoPercent,
                })

            })
            .catch(err => {
                console.error(err);
            })
    },

    onLoad: function (options) {
        this.checke()
        // this.checkeQiandao()
    },


    onReady: function () {

    },


    onShow: function () {

    },

    onHide: function () {

    },


    onUnload: function () {

    },


    onPullDownRefresh: function () {

    },


    onReachBottom: function () {

    },


    onShareAppMessage: function () {

    }
})