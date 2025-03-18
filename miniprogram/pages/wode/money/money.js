var utils_time = require('../../../utils/time.js') //获取时间等
var utils_dingdanhao = require('../../../utils/dingdanhao.js') //获取订单号

Page({
 
    data: {
        balance: '',
        balance_jilu: '',
        isYue: true,
        isChongzhi: false,
        chongzhiMoney: '',
        moneylist: [],
        phoNum: '',
        money_fengmi: '',
        // chongzhi_shuoming: '充值优惠更多哦！',
        chongzhi_shuoming_list: [],
    },

    tapMoney(e) {
        // console.log(e);
        var id = e.currentTarget.dataset.index
        var item = e.currentTarget.dataset.item
        var chongzhiMoney = item.money
        var money_fengmi = item.money_fengmi
        var moneylist = this.data.moneylist
        for (let index = 0; index < moneylist.length; index++) {
            const element = moneylist[index];
            if (id == index) {
                element.checked = true
            } else {
                element.checked = false
            }
        }
        this.setData({
            chongzhiMoney,
            money_fengmi,
            moneylist,
        })
    },

    async toChongzhigetPho(e) {

        var totalFee = this.data.chongzhiMoney * 100
        // var totalFee = 5 //测试
        var userinfo = wx.getStorageSync('userinfo')
        var xd_time = utils_time.formatTime(new Date())
        var dingdanhao = utils_dingdanhao.dingdanhaoCreate(new Date()) //订单号
        var id = wx.getStorageSync('id')
        const _ = wx.cloud.database().command
        // var phoNum = this.data.phoNum
        // 积分记录
        var balance_jilu = {
            jilu_name: '充值',
            jilu_num: this.data.money_fengmi,
            jilu_time: xd_time
        }
        var balance = this.data.money_fengmi + this.data.balance

        if (e.detail.cloudID) {
            var res = await wx.cloud.callFunction({
                name: 'yonghu',
                data: {
                    getphone: true,
                    cloudID: e.detail.cloudID,
                }
            })
            console.log(res);
            var phoNum = res.result.list[0].data.purePhoneNumber

        } else {
            return
        }

        wx.cloud.callFunction({
            // name: 'apayment',
            name: 'apayment_chongzhi',
            data: {
                goodName: '充值',
                totalFee,
                dingdanhao,
                // action: 'xiadan'
                action: 'chongzhi_'
            },
            success: res => {

                console.log('【云函数】apayment成功参数', res);
                const payment = res.result.payment
                //生成订单后支付
                wx.showLoading({
                    title: '生成订单'
                })
                wx.cloud.database().collection('chongzhi').add({
                        data: {
                            xd_time, //下单时间
                            nickName: userinfo.nickName,
                            phoNum,
                            yizhifu: this.data.chongzhiMoney,
                            money_fengmi: this.data.money_fengmi,
                            dingdanhao, 
                            tuikuandanhao: '',
                            dd_Status: '1' //支付回调后更新为 ‘0’
                        },
                    })
                    .then(res => {
                        wx.hideLoading()
                        console.log('[chongzhi] [新增记录] 成功: ', res._id)
                        wx.requestPayment({
                                ...payment,
                            })
                            .then(res => {
                                console.log('支付pay success', res)
                                setTimeout(() => {
                                    this.loadJilu()
                                    this.tapYue()

                                }, 1000);
                            })
                            .catch(err => {
                                console.error('支付pay fail', err)
                                wx.showToast({
                                    icon: 'error',
                                    title: '支付失败',
                                })
                            })
                    })
                    .catch(err => {
                        wx.showToast({
                            title: '下单失败',
                        })
                        console.error('[数据库] [新增记录] 失败：', err)
                    })


            },
            fail: err => {
                wx.hideLoading()
                console.log('【云函数】apayment失败', err)
            },
        })
    },
    toChongzhi(e) {
        //生成订单后支付
        wx.showLoading({
            title: '生成订单'
        })
        var totalFee = this.data.chongzhiMoney * 100
        // var totalFee = 1 //测试
        var userinfo = wx.getStorageSync('userinfo')
        var xd_time = utils_time.formatTime(new Date())
        var dingdanhao = utils_dingdanhao.dingdanhaoCreate(new Date()) //订单号
        var id = wx.getStorageSync('id')
        const _ = wx.cloud.database().command
        var phoNum = this.data.phoNum
        // 积分记录
        var balance_jilu = {
            jilu_name: '充值',
            jilu_num: this.data.money_fengmi,
            jilu_time: xd_time
        }
        var balance = this.data.money_fengmi + this.data.balance

        wx.cloud.callFunction({
            // name: 'apayment',
            name: 'apayment_chongzhi',
            data: {
                goodName: '充值',
                totalFee,
                dingdanhao,
                // action: 'xiadan'
                // action: 'chongzhi'
                action: 'chongzhi_'//测试用
            },
            success: res => {
                console.log('【云函数】apayment成功参数', res);
                const payment = res.result.payment

                wx.cloud.database().collection('chongzhi').add({
                        data: {
                            xd_time, //下单时间
                            nickName: userinfo.nickName,
                            phoNum,
                            yizhifu: this.data.chongzhiMoney,
                            money_fengmi: this.data.money_fengmi,
                            dingdanhao,
                            tuikuandanhao: '',
                            dd_Status: '1' //支付回调后更新为 ‘0’
                        },
                    })
                    .then(res => {
                        wx.hideLoading()
                        console.log('[chongzhi] [新增记录] 成功: ', res._id)
                        wx.requestPayment({
                                ...payment,
                            })
                            .then(res => {
                                console.log('支付pay success', res)
                                setTimeout(() => {
                                    this.loadJilu()
                                    this.tapYue()

                                }, 1000);
                            })
                            .catch(err => {
                                console.error('支付pay fail', err)
                                wx.showToast({
                                    icon: 'error',
                                    title: '支付失败',
                                })
                            })
                    })
                    .catch(err => {
                        wx.showToast({
                            title: '下单失败',
                        })
                        console.error('[数据库] [新增记录] 失败：', err)
                    })


            },
            fail: err => {
                wx.hideLoading()
                console.log('【云函数】apayment失败', err)
            },
        })
    },

    tapYue() {
        this.setData({
            isYue: true,
            isChongzhi: false,
        })
    },
    tapChongzhi() {
        this.setData({
            isChongzhi: true,
            isYue: false,
        })
    },
    jingqueJiage(heji_money) {
        var heji_money_a = String(heji_money).slice(0, String(heji_money).indexOf('.'))
        var heji_money_len = heji_money_a.length + 2
    
        var heji_money_last = Number((heji_money).toPrecision(heji_money_len))
        return heji_money_last
    },
    
    
    // 计算钱包余额，蜂蜜值
    count_total(balance_jilu){
        var balance = balance_jilu.reduce(function (accumulator, currentValue) {
          // return accumulator + currentValue.jilu_num;
          return accumulator + (currentValue.jilu_num * 100); // 20250314 减少浮点数运算误差累计
        }, 0)
        balance = balance / 100
        balance = this.jingqueJiage(balance)
        return balance
      },

    loadJilu() {
        var _id = wx.getStorageSync('id')
        // 获取提醒 地点选择列表 等
        wx.cloud.database().collection('user').doc(_id)
            .get()
            .then(res => {
                console.log('获取用户余额及记录：：', res.data);

                var balance_jilu = res.data.balance_jilu.reverse()

                // var balance = balance_jilu.reduce(function (accumulator, currentValue) {
                //     // return accumulator + currentValue.jilu_num;
                //     return accumulator + (currentValue.jilu_num * 100); // 20250314 减少浮点数运算误差累计
                // }, 0)
                // balance = balance / 100
                // balance = this.jingqueJiage(balance)
                var balance = this.count_total(balance_jilu)

                console.log(balance,'balance是');
                this.setData({
                    balance,
                    balance_jilu,
                    phoNum: res.data.userPhoneNumber
                })
            })
            .catch(err => {
                console.log('后台主参数 toptipsdaiqu：： 失败', err);
            })
    },

    onLoad: function (options) {
        if (options.isChongzhi) {
            this.tapChongzhi()
        }
        this.loadJilu()

        // 获取提醒 地点选择列表 等
        wx.cloud.database().collection('banner').doc('toptipsdaiqu')
            .get()
            .then(res => {
                console.log('后台主参数 toptipsdaiqu：：', res.data);
                var moneylist = res.data.chongzhi_moneylist
                // var chongzhi_shuoming = res.data.chongzhi_shuoming
                var chongzhi_shuoming_list = res.data.chongzhi_shuoming_list
                var chongzhiMoney = moneylist[0].money
                var money_fengmi = moneylist[0].money_fengmi
                this.setData({
                    moneylist,
                    chongzhiMoney,
                    // chongzhi_shuoming,
                    chongzhi_shuoming_list,
                    money_fengmi,
                })
            })
            .catch(err => {
                console.log('后台主参数 toptipsdaiqu：： 失败', err);
            })

    },


    onReady: function () {

    },


    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})