var utils_time = require('../../../../utils/time.js')
var utils_dingdanhao = require('../../../../utils/dingdanhao.js') //获取订单号
var utils_toShouQuan = require('../../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../../wode/ziliao/ziliao'
const db = wx.cloud.database()
const _ = db.command

Page({

    data: {
        isAdmin: false,
        isEdit: false,
        choose_list: [],
        input_list: [],
        text_qita: {},
        zhifu: {},

        isShow_tijiao: false,
        _id: '',

    },
    onInput_zhifu_title(e) {
        var zhifu = this.data.zhifu
        zhifu.zhifu_title = e.detail.value
        this.setData({
            zhifu
        })
    },
    onInput_zhifu_text(e) {
        console.log(e);
        var zhifu = this.data.zhifu
        var index = e.currentTarget.dataset.index
        zhifu.text_list[index] = e.detail.value
        this.setData({
            zhifu
        })
    },
    onInput_zhifu_price(e) {
        // console.log(e);
        var zhifu = this.data.zhifu
        var index = e.currentTarget.dataset.index
        zhifu.price_list[index] = e.detail.value
        this.setData({
            zhifu
        })
    },
    onInput_choose_items(e) {
        // console.log(e);
        var choose_list = this.data.choose_list
        var index = e.currentTarget.dataset.index
        var item_index = e.currentTarget.dataset.item_index
        choose_list[index].choose_items_list[item_index] = e.detail.value
        this.setData({
            choose_list
        })
    },
    onInput_choose_title(e) {
        var choose_list = this.data.choose_list
        var index = e.currentTarget.dataset.index
        choose_list[index].choose_title = e.detail.value
        this.setData({
            choose_list
        })
    },
    onInput_input_text(e) {
        var input_list = this.data.input_list
        var index = e.currentTarget.dataset.index

        input_list[index].input_text = e.detail.value
        this.setData({
            input_list
        })
    },
    onInput_input_title(e) {
        var input_list = this.data.input_list
        var index = e.currentTarget.dataset.index

        input_list[index].input_title = e.detail.value
        this.setData({
            input_list
        })
    },
    onInput_text_title(e) {
        var text_qita = this.data.text_qita
        text_qita.text_title = e.detail.value
        this.setData({
            text_qita
        })
    },

    onInput_text_items(e) {
        var text_qita = this.data.text_qita
        var index = e.currentTarget.dataset.index
        text_qita.text_list[index] = e.detail.value
        this.setData({
            text_qita
        })
    },
    toAdd_zhifu_items(e) {
        // console.log(e,'添加 toAdd_zhifu_items');
        var zhifu = this.data.zhifu
        var addzhifu_items_id = zhifu.price_list.length
        zhifu.price_list[addzhifu_items_id] = ''
        zhifu.text_list[addzhifu_items_id] = ''
        this.setData({
            zhifu,
        })
    },
    todel_zhifu_items(e) {
        // console.log(e, '删除 todel_zhifu_items');
        var zhifu = this.data.zhifu
        var delzhifu_index = e.currentTarget.dataset.index
        zhifu.price_list.splice(delzhifu_index, 1)
        zhifu.text_list.splice(delzhifu_index, 1)
        this.setData({
            zhifu
        })
    },
    toCheck_zhifu(e) {
        // console.log(e,'toCheck_zhifu');
        var zhifu = this.data.zhifu
        zhifu.isOpen_zhifu = !zhifu.isOpen_zhifu
        this.setData({
            zhifu,
        })
    },
    toAdd_choose_items(e) {
        // console.log(e,'添加 toAdd_choose_items');
        var choose_list = this.data.choose_list
        var addchoose_id = e.currentTarget.dataset.index
        var addchoose_items_id = choose_list[addchoose_id].choose_items_list.length
        choose_list[addchoose_id].choose_items_list[addchoose_items_id] = ['']
        this.setData({
            choose_list,
        })
    },
    todel_choose_items(e) {
        // console.log(e, '删除 todel_choose_items');
        var choose_list = this.data.choose_list
        var delchoose_index = e.currentTarget.dataset.index
        var delchoose_item_index = e.currentTarget.dataset.item_index
        choose_list[delchoose_index].choose_items_list.splice(delchoose_item_index, 1)
        this.setData({
            choose_list
        })
    },
    toAdd_choose(e) {
        // console.log(e,'添加choose');
        var choose_list = this.data.choose_list
        var addchoose_id = choose_list.length
        choose_list[addchoose_id] = {
            choose_title: '',
            choose_items_list: [''],
        }
        this.setData({
            choose_list,
        })
    },
    todel_choose(e) {
        // console.log(e,'删除choose');
        var del_index = e.currentTarget.dataset.index
        var choose_list = this.data.choose_list
        choose_list.splice(del_index, 1)
        this.setData({
            choose_list
        })
    },

    toAdd_input(e) {
        // console.log(e,'添加input');
        // var addNum_input = this.data.addNum_input + 1
        var input_list = this.data.input_list
        var addinput_id = input_list.length
        input_list[addinput_id] = {
            input_text: '',
            input_title: '',
        }
        this.setData({
            input_list,
        })
    },
    todel_input(e) {
        var del_index = e.currentTarget.dataset.index
        var input_list = this.data.input_list
        input_list.splice(del_index, 1)
        this.setData({
            input_list
        })
    },
    toAdd_text(e) {
        // console.log(e,'添加text');
        var text_qita = this.data.text_qita
        var text_list = text_qita.text_list
        var addtext_id = text_list.length
        text_list[addtext_id] = ''
        this.setData({
            text_qita,
        })
    },
    todel_text(e) {
        var del_index = e.currentTarget.dataset.index
        var text_qita = this.data.text_qita
        var text_list = text_qita.text_list
        text_list.splice(del_index, 1)
        this.setData({
            text_qita,
        })
    },

    onEdit_start() {
        this.setData({
            isEdit: true
        })
    },
    onEdit_close() {
        this.setData({
            isEdit: false
        })
        this.loadData(this.data._id)
    },
    // 对象变数组
    objtoarr(dictObject) {
        var createArr = []
        for (let i in dictObject) {
            createArr.push(dictObject[i]);
        }
        return createArr
    },
    onEdit_end(e) {
        wx.showLoading({
            title: '上传中..',
        })
        console.log(e.detail.value, 'submit用户填写的数据');
        var submitData = e.detail.value

        var kong_checked = false
        for (let i in submitData) {
            if (submitData[i] == '' || submitData[i] == null) {
                kong_checked = true
            }
        }
        if (kong_checked) {

            wx.showToast({
                title: '有选项为空',
                icon: 'error'
            })
            return
        } else {


            var xd_time = utils_time.formatTime(new Date())
            var text_qita = this.data.text_qita
            var input_list = this.data.input_list
            var choose_list = this.data.choose_list
            var _id = this.data._id
            var zhifu = this.data.zhifu
            zhifu.choose_price = 0
            zhifu.choose_text = ''
            choose_list.forEach(element => {
                element.choose_text = ''
            });

            var submitData_arr = this.objtoarr(submitData)
            console.log(submitData_arr, 'submitData_arr');

            // 描述
            text_qita.text_title = submitData['edit_title']
            for (let index = 0; index < text_qita.text_list.length; index++) {
                var i = 'edit_text_' + index
                text_qita.text_list[index] = submitData[i]
            }
            // 输入框
            for (let index = 0; index < input_list.length; index++) {
                input_list[index].input_title = submitData['edit_input_title_' + index]
                input_list[index].input_text = submitData['edit_input_palceholder_' + index]
                // console.log(element);
            }
            // 选择框
            for (let index = 0; index < choose_list.length; index++) {
                choose_list[index].choose_title = submitData['edit_choose_title_' + index]
                for (let index2 = 0; index2 < choose_list[index].choose_items_list.length; index2++) {
                    choose_list[index].choose_items_list[index2] = submitData['edit_choose_title_'+index+'_item_' + index2]
                }
            }
            // 支付选项
            zhifu.isOpen_zhifu = submitData.edit_zhifu_isOpen
            zhifu.zhifu_title = submitData.edit_zhifu_title
            for (let index = 0; index < zhifu.text_list.length; index++) {
                zhifu.text_list[index] = submitData['edit_zhifu_text_' + index]
            }
            for (let index = 0; index < zhifu.price_list.length; index++) {
                zhifu.price_list[index] = submitData['edit_zhifu_price_' + index]
            }

            // // 描述
            // for (let index = 0; index < text_qita.text_list.length; index++) {
            //     text_qita.text_list[index] = submitData_arr[index + 1]
            //     // console.log(element);
            // }
            // // 输入框
            // var text_list_length = text_qita.text_list.length
            // for (let index = 0; index < input_list.length; index++) {
            //     input_list[index].input_title = submitData_arr[1 + text_list_length + index * 2]
            //     input_list[index].input_text = submitData_arr[1 + text_list_length + 1 + index * 2]
            //     // console.log(element);
            // }
            // // 选择框
            // var input_list_length = input_list.length * 2
            // var choose_list_length = 0
            // for (let index = 0; index < choose_list.length; index++) {
            //     if (index > 0) {
            //         var choose_items_list_length = choose_list[index - 1].choose_items_list.length + 1
            //     } else {
            //         var choose_items_list_length = 0
            //     }
            //     choose_list[index].choose_title = submitData_arr[1 + text_list_length + input_list_length + choose_items_list_length]
            //     for (let index2 = 0; index2 < choose_list[index].choose_items_list.length; index2++) {
            //         choose_list[index].choose_items_list[index2] = submitData_arr[1 + text_list_length + input_list_length + choose_items_list_length + 1 + index2]
            //     }
            //     const element = choose_list[index]
            //     choose_list_length += element.choose_items_list.length + 1
            // }
            // // 支付选项
            // var qian_length = 1 + text_list_length + input_list_length + choose_list_length
            // zhifu.isOpen_zhifu = submitData.edit_zhifu_isOpen
            // zhifu.zhifu_title = submitData_arr[qian_length + 1]
            // for (let index = 0; index < zhifu.text_list.length; index++) {
            //     zhifu.text_list[index] = submitData_arr[qian_length + 1 + index + 1]
            // }
            // for (let index = 0; index < zhifu.price_list.length; index++) {
            //     zhifu.price_list[index] = submitData_arr[qian_length + 1 + zhifu.text_list.length + index + 1]
            // }

            this.setData({
                text_qita,
                zhifu,
                input_list,
                choose_list,

            })
            var nickName = wx.getStorageSync('userinfo').nickName

            wx.cloud.callFunction({
                name: 'banner',
                data: {
                    qita_data: {
                        text_qita,
                        zhifu,
                        input_list,
                        choose_list,
                        nickName,
                        xd_time,
                    },
                    _id,
                    action: 'banner_qita',
                }
            }).then(res => {
                console.log(res.result.stats);
                wx.showToast({
                    title: '上传成功',
                    icon: 'none'
                })
                this.setData({
                    isEdit: false
                })
            })
        }

    },
 
    toChoose(e) {
        // console.log(e.detail.value, 'toChoose携带值为');
        console.log(e, 'toChoose携带值为');
        var pickerIndex = e.currentTarget.dataset.index
        var choose_list = this.data.choose_list
        var choose_text = choose_list[pickerIndex].choose_items_list[e.detail.value]
        choose_list[pickerIndex].choose_text = choose_text
        this.setData({
            choose_list,
        })
    },
    toChoose_zhifu(e) {
        console.log(e, 'toChoose_zhifu');
        // var pickerIndex = e.currentTarget.dataset.index
        var zhifu = this.data.zhifu
        var choose_text = zhifu.text_list[e.detail.value]
        var choose_price = zhifu.price_list[e.detail.value]
        zhifu.choose_text = choose_text
        zhifu.choose_price = choose_price
        this.setData({
            zhifu,
        })
    },
    checkKong(dictObject) {

        for (let i in dictObject) {
            if (dictObject[i] = '') {
                return false

            }
            createArr.push(dictObject[i]);
        }
    },

    toTijiao(e) {
        this.closeConfirm()
        wx.showLoading({
            title: '提交中..',
        })
        var submitData = e.detail.value
        var dingdanhao = utils_dingdanhao.dingdanhaoCreate(new Date()) //订单号
        var text_title = this.data.text_qita.text_title
        var zhifu = this.data.zhifu
        var totalFee = Number(zhifu.choose_price) * 100
        submitData.text_title = text_title
        var nickName = wx.getStorageSync('userinfo').nickName
        if (nickName == undefined) {
            // nickName = '未获取到昵称'
            utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
            wx.hideLoading()
            return
        }
        submitData.nickName = nickName
        // submitData.nickName = wx.getStorageSync('userinfo').nickName
        submitData.qitaResdata = this.data.qitaResdata
        submitData.xd_time = utils_time.formatTime(new Date())
        submitData.dingdanhao = dingdanhao
        console.log(submitData, 'form提交数据');
        var kong_checked = false
        for (let i in submitData) {
            if (submitData[i] == '' || submitData[i] == null) {
                kong_checked = true
            }
        }
        if (kong_checked == true) {
            wx.showToast({
                title: '选项未填或未选',
                icon: 'error'
            })
            return
        }
        if (zhifu.isOpen_zhifu) {
            submitData.dd_Status = '1'
            submitData.choose_price = Number(zhifu.choose_price)
            wx.cloud.database().collection('qita').add({
                    data: submitData
                })
                .then(res => {
                    console.log(res._id, '提交成功');
                    // 微信支付*********************
                    // var totalFee = 1 // 测试使用
                    text_title = text_title.slice(0, 40)
                    // var totalFee = heji_money * 100 // 支付金额,最小1，单位分
                    wx.cloud.callFunction({
                            name: 'apayment',
                            data: {
                                goodName: text_title,
                                totalFee,
                                dingdanhao,
                                action: 'xiadan_qita'
                            },
                        })
                        .then(res => {
                            wx.hideLoading()
                            console.log('【云函数】apayment成功参数', res);

                            const payment = res.result.payment
                            wx.requestPayment({
                                    ...payment,
                                })
                                .then(res => {
                                    console.log('支付pay success', res)
                                    wx.navigateBack({
                                        delta: 0,
                                    })
                                    wx.showToast({
                                        title: '提交成功',
                                    })

                                })
                                .catch(err => {
                                    console.error('支付pay fail', err)
                                })

                        })
                        .catch(err => {
                            wx.hideLoading()
                            console.log('【云函数】apayment失败', err)
                        })


                })
                .catch(err => {
                    wx.hideLoading()
                    console.log(err);
                })

        } else { //不需要支付，直接提交，订单状态为0
            submitData.dd_Status = '0'
            submitData.choose_price = 0
            submitData.picker_zhifu = ''
            submitData.zf_time = ''
            submitData.tuikuandanhao = ''
            wx.cloud.database().collection('qita').add({
                    data: submitData
                })
                .then(res => {
                    console.log(res._id, '提交成功');
                    console.log('不需要支付');
                    wx.navigateBack({
                        delta: 0,
                    })
                    wx.showToast({
                        title: '提交成功',
                    })
                })
                .catch(err => {
                    wx.hideLoading()
                    console.log(err);
                })
        }

    },
    openConfirm() {
        this.setData({
            isShow_tijiao: true
        })
    },
    closeConfirm() {
        this.setData({
            isShow_tijiao: false
        })
    },
    onInput(e) {
        // console.log(e);
        var val_input = e.detail.value
        this.setData({
            val_input,
        })
    },
    loadData(_id) {
        db.collection('banner_qita').doc(_id).get().then(res => {
                console.log(res.data, '后台其他版块设置下载');
                var qitaResdata = res.data
                var input_list = res.data.input_list
                var choose_list = res.data.choose_list
                var text_qita = res.data.text_qita
                var zhifu = res.data.zhifu
                this.setData({
                    input_list,
                    choose_list,
                    text_qita,
                    zhifu,
                    qitaResdata,
                    _id,
                })
            })
            .catch(err => {
                console.log(err);
            })
    },

    onLoad: function (options) {
        console.log(options);
        if (options) {
            var _id = options._id
            var isEdit = JSON.parse(options.isEdit)
            this.setData({
                isEdit
            })
            this.loadData(_id)
        }



        // db.collection('banner_qita').where({}).orderBy('xd_time', 'desc').get().then(res => {
        //         console.log(res.data[0], '后台其他版块设置下载');
        //         var qitaResdata = res.data[0]
        //         var input_list = res.data[0].input_list
        //         var choose_list = res.data[0].choose_list
        //         var text_qita = res.data[0].text_qita
        //         var zhifu = res.data[0].zhifu
        //         // var bannerqita_id = res.data[0]._id
        //         this.setData({
        //             input_list,
        //             choose_list,
        //             text_qita,
        //             zhifu,
        //             qitaResdata,
        //         })
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })

        var isAdmin = wx.getStorageSync('isAdmin')
        if (isAdmin) {
            this.setData({
                isAdmin,
            })
        }

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