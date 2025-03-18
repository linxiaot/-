var utils_time = require('../../../../utils/time.js')
var utils_toShouQuan = require('../../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../../wode/ziliao/ziliao'
var app = getApp()
var userOpenid = wx.getStorageSync('openid')
var utils_dingdanhao = require('../../../../utils/dingdanhao.js') //获取订单号

Page({
    data: {
        cartData: {},
        // promotion: 1,
        promotion: 0,
        isCheck: true,
        isConfirm: false,
        inputVal_beizhu: '',

        // 收货地址
        value_name: '',
        value_phone: '',
        value_address: '',
        value_address_jian: '',

        login_ok: false,
        isshowPay: true,
    },
    toChooseAddress() {
        wx.chooseAddress({
            success: (res) => {
                console.log(res);
                var value_address_jian = res.provinceName + res.cityName + res.countyName + res.detailInfo
                var value_address = res.userName + res.telNumber + value_address_jian
                res.value_address = value_address
                res.value_address_jian = value_address_jian
                this.setData({
                    // address: res,
                    value_name: res.userName,
                    value_phone: res.telNumber,
                    value_address,
                    value_address_jian,
                })
                wx.setStorageSync('address_meishi', res)
            },
        })
    },

    toPhoneCall() {
        var phone = this.data.cartData.dianpu.dianpu_phone
        console.log(phone);
        if (phone) {
            wx.makePhoneCall({
                phoneNumber: phone
            })
        }
    },

    inputBeizhu(e) {
        this.setData({
            inputVal_beizhu: e.detail.value
        })
    },
    toPay() {
        this.setData({
            isshowPay: false,
        })
        var cartData = this.data.cartData
        var xd_time = utils_time.formatTime(new Date())
        cartData.xd_time = xd_time

        var promotion = this.data.promotion
        var shijiMoney = cartData.cartPrice - promotion
        var totalFee = shijiMoney * 100
        // var totalFee = 1 //测试1分钱
        cartData.shijiMoney = shijiMoney
        cartData.promotion = promotion
        cartData.beizhu = this.data.inputVal_beizhu
        cartData.address_meishi = {
            value_name: this.data.value_name,
            value_phone: this.data.value_phone,
            value_address_jian: this.data.value_address_jian,
            value_address: this.data.value_address,
        }

        cartData.dd_Status = '1' //支付成功后变为 0 
        // cartData.dd_Status = '0' //支付成功后变为 0 
        cartData.pingjia = {}
        var dingdanhao = utils_dingdanhao.dingdanhaoCreate(new Date())
        cartData.dingdanhao = dingdanhao //订单号
        cartData.tuikuandanhao = ''

        var tuisong_data = {
            meishi_xiadan: true,
            openid: cartData.dianpu.dianpu_openid,

            cartPrice: cartData.cartPrice,
            yonghu_name: this.data.value_name,
            phone: this.data.value_phone,
            xd_time: xd_time,
            meishi_name: this.data.cartData.name + this.data.cartData.describe,

            dianpu_name: cartData.dianpu.dianpu_name,
            dianpu_phone: cartData.dianpu.dianpu_phone,
            userOpenid: userOpenid
        }

        if (this.data.value_address == '' || this.data.value_phone == '' || this.data.value_name == '') {
            wx.showToast({
                icon: 'none',
                title: '收货地址不全',
            })
            return
        }
        var that = this
        wx.requestSubscribeMessage({
            tmplIds: ['1fohPzjqCxszfEOei7BJSv6o0v7me9MIajpNdCFb5s8'], //是否订阅 下单成功通知，顾客
            success: res => {
                console.log(res);
                //生成订单后支付
                wx.showLoading({
                    title: '生成订单'
                })

                wx.cloud.callFunction({
                    // name: 'apayment',
                    name: 'apayment_chongzhi',
                    data: {
                        goodName: '美食',
                        totalFee,
                        dingdanhao,
                        action: 'meishi'
                    },
                    success: res => {
                        console.log('【云函数】apayment成功获取支付参数', res);
                        const payment = res.result.payment

                        wx.cloud.database().collection('meishi').add({
                                data: cartData
                            })
                            .then(res => {
                                console.log(res._id, '[meishi] [新增记录] 成功: ')
                                wx.removeStorageSync('cartData')
                                wx.hideLoading()
                                wx.requestPayment({
                                        ...payment,
                                    })
                                    .then(res => {
                                        console.log('支付pay success', res)
                                        // // setTimeout(() => {
                                        // // wx.hideLoading({
                                        // //     success: (res) => {
                                        // this.setData({
                                        //     isCheck: false,
                                        //     isConfirm: true,
                                        // })
                                        // //     },
                                        // // })
                                        // // }, 1000);
                                        that.close()
                                        //发送订阅消息
                                        wx.cloud.callFunction({
                                                name: 'tuisong_meishi',
                                                data: {
                                                    tuisong_data
                                                }
                                            })
                                            .then(res => {
                                                console.log(res, 'tuisongmeishi成功');
                                            })
                                    })
                                    .catch(err => {
                                        console.error('支付pay fail', err)
                                        wx.showToast({
                                            icon: 'error',
                                            title: '支付失败',
                                        })
                                        this.setData({
                                            isshowPay: true,
                                        })

                                    })
                            })
                            .catch(err => {
                                wx.showToast({
                                    title: '下单失败',
                                })
                                this.setData({
                                    isshowPay: true,
                                })
                                console.error('[数据库] [新增记录] 失败：', err)
                            })

                    },
                    fail: err => {
                        wx.hideLoading()
                        this.setData({
                            isshowPay: true,
                        })
                        console.log('【云函数】apayment失败', err)
                    },
                })

            },
        })


    },
    close() {
        console.log('关闭页面');
        this.cartClear()
        wx.redirectTo({
            url: '../../../shouye/dianpu/dianpu'
        })
        // wx.navigateBack({
        //     delta: 0,
        // })
    },
    cartClear: function () {
        // wx.removeStorageSync('cartData')
        app.globalData.cartData = ''
        this.setData({
            cartList: [],
            cartNumber: 0,
            cartPrice: 0,
            showCart: false
        })
    },
    checkLogin() {
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            this.setData({
                login_ok
            })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },
    onLoad(options) {
        // var dianpu_openid = options.dianpu_openid
        // if (dianpu_openid) {
        //     this.setData({
        //         dianpu_openid,
        //     })
        // }

        // var cartData = wx.getStorageSync('cartData')
        var cartData = app.globalData.cartData
        var address_meishi = wx.getStorageSync('address_meishi')
        if (address_meishi) {
            this.setData({
                value_name: address_meishi.userName,
                value_phone: address_meishi.telNumber,
                value_address_jian: address_meishi.value_address_jian,
                value_address: address_meishi.value_address,
            })
        }
        this.setData({
            cartData,
        })


    },
    onShow() {
        this.checkLogin()
    },


})