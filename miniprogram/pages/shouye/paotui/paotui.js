var utils_time = require('../../../utils/time.js') //获取时间等
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
Page({

    data: {
        disabledXiadan: false,
        isXiadan: false,
        value_xuqiu: '',
        value_name: '',
        value_phone: '',
        xxDizhi: '',
        // address: '选择地址',
    },

    toChooseAddress() {
        wx.chooseAddress({
            success: (res) => {
                console.log(res);
                res.xxDizhi = res.provinceName + res.cityName + res.countyName + res.detailInfo
                this.setData({
                    // address: res,
                    value_name: res.userName,
                    value_phone: res.telNumber,
                    xxDizhi: res.provinceName + res.cityName + res.countyName + res.detailInfo,
                })
                wx.setStorageSync('address', res)
            },
        })
    },


    // 是否 [弹出] 提示框  用户是否填好空 校验
    openConfirm: function () {
        if (this.data.value_xuqiu == '') {
            wx.showToast({
                icon: 'none',
                title: '需求未填',
            })
            return
        }
        if (this.data.value_name == '' || this.data.value_phone == '' || this.data.xxDizhi == '') {
            wx.showToast({
                icon: 'none',
                title: '委托人信息不全',
            })
            return
        }
        // if (this.data.value_phone == '') {
        //     wx.showToast({
        //         icon: 'none',
        //         title: '手机号码未填',
        //     })
        //     return
        // }

        // 判断用户是否微信登陆
        var login_ok = wx.getStorageSync('login_ok')
        if (login_ok) {
            this.setData({
                isShowconfirm: true,
            })
        } else {
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
        }
    },
    toCloseconfirm() {
        this.setData({
            isShowconfirm: false,
        })
    },
    toConfirm() {
        this.setData({
            isShowconfirm: false,
            disabledXiadan: true,
        })
        var xd_time = utils_time.formatTime(new Date())
        var userinfo = wx.getStorageSync('userinfo')
        var openid = wx.getStorageSync('openid')
        var id = wx.getStorageSync('id')
        var jifen = {
            jifen_name: '跑腿',
            jifen_num: 10,
            jifen_time: xd_time
        }
        var templateId = 'x7c0P8kcAQQBP5YKHMfHJsdDgnBjdG-f9jGE2aJCkAE' //下单成功通知

        var paotui_name = this.data.value_name
        var xuqiu = this.data.value_xuqiu
        var xuqiu_slice = ''
        xuqiu_slice = xuqiu.slice(0,20)
        wx.requestSubscribeMessage({
                tmplIds: [templateId],
            })
            .then(res => {
                console.log('用户点击订阅消息，获得信息：', res);
                wx.cloud.database().collection('paotui').add({
                    data: {
                        paotui_name,
                        phone: this.data.value_phone,
                        xuqiu,
                        xxDizhi: this.data.xxDizhi,
                        xd_time: xd_time,
                        nickName: userinfo.nickName,
                        dd_Status:'0'
                    }
                }).then(res => {
                    console.log('跑腿提交成功：：', res._id)
                    this.setData({
                        isXiadan: true,
                    })

                    wx.cloud.callFunction({
                            name: 'yonghu',
                            data: {
                                id: id,
                                jifen: jifen
                            }
                        })
                        .then(res => {
                            console.log('[云函数] [积分] 更新 成功几条：', res.result.stats.updated)
                            // 积分缓存 更新
                            wx.setStorageSync('jifen', jifen)


                            // 推送下单成功提醒
                            
                            wx.cloud.callFunction({
                                    name: 'tuisongxiadannew',
                                    data: {
                                        isPaotui: true,
                                        paotui_name:paotui_name,
                                        xuqiu_slice:xuqiu_slice,
                                        xd_time: xd_time,
                                        openid: openid,
                                    }
                                })
                                .then(res => {
                                    console.log('[代取下单] 提醒推送 成功', res)
                                })
                                .catch(err => {
                                    console.log('[代取下单] 提醒推送 失败：', err)
                                })
                        })
                        .catch(err => {
                            console.log('[云函数] [积分] 更新 失败：', err)
                        })
                }).catch(err => {
                    console.log('跑腿提交失败：：', err)
                })
            })
    },
    // 输入框状态 需求
    onInput_xuqiu(e) {
        var {
            value
        } = e.detail;
        this.setData({
            value_xuqiu: value,
            showClearBtn_xuqiu: !!value.length,
        });
    },
    onClear_xuqiu() {
        console.log('clear');
        this.setData({
            value_xuqiu: '',
            showClearBtn_xuqiu: false,
        });
    },
    // 输入框状态 姓名
    onInput_name(e) {
        var {
            value
        } = e.detail;
        this.setData({
            value_name: value,
            showClearBtn_name: !!value.length,
            isWaring_name: false,
        });
    },
    onClear_name() {
        this.setData({
            value_name: '',
            showClearBtn_name: false,
            isWaring_name: false,
        });
    },
    // 输入框状态 电话
    onInput_phone(e) {
        var {
            value
        } = e.detail;
        this.setData({
            value_phone: value,
            showClearBtn_phone: !!value.length,
            isWaring_phone: false,
        });
    },
    onClear_phone() {
        this.setData({
            value_phone: '',
            showClearBtn_phone: false,
            isWaring_phone: false,
        });
    },

    toDingdan() {
        wx.navigateTo({
            url: '../../wode/dingdan/dingdan?isPaotui=true'
        })
    },
    toShouye() {
        wx.switchTab({
            url: '../shouye'
        })
    },


    onLoad: function (options) {
        var address = wx.getStorageSync('address')
        if (address) {
            this.setData({
                xxDizhi: address.xxDizhi,
                value_name: address.userName,
                value_phone: address.telNumber,
            })
        }
    },

    onReady: function () {

    },

    onShow: function () {

    },
    onShareAppMessage: function () {

    }

})