const db = wx.cloud.database()
const _ = db.command
var sjdingdanWatcher = null
var audioCIAC = wx.createInnerAudioContext()
audioCIAC.src = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/蜂蜂校园来新订单了.m4a'
var utils_time = require('../../utils/time.js') //获取时间等
// var _openid = wx.getStorageSync('openid')
var xingjisrc1 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing1.png'
var xingjisrc2 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing2.png'
var xingjisrc3 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing3.png'

Page({

    data: {

        isnomore: false,
        jiesuan_pageNum: 1,
        dingdanid_list: [],
        jiesuan_list: [],
        fuwu_percent: 0.1,
        val_tixian: 0,
        dingdan_tixian: 0,
        isjieusuan_mingxi: false,
        isjieusuan_tixian: false,
        nameList: [{
            text: '订单管理',
            checked: true
        }, {
            text: '我的店铺'
        }, {
            text: '我的商品'
        }, {
            text: '结算',
            checked: false
        }],
        nameList_dingdan: [{
            text: '新订单',
            checked: true,
            name: 'newOrder_List'
        }, {
            text: '已出餐',
            name: 'chucan_List'
        }, {
            text: '已送达',
            name: 'songda_List'
        }, {
            text: '退款',
            name: 'tuikuan_List',
            // red_dot_num:30
        }, {
            text: '全部',
            name: 'shangjiaDingdanList'
        }],

        isDetail_dianpu: false,
        isShenqing: false,
        isDenglu: false,
        showZhuce: true,
        isDianpu: false,
        isfood: false,

        // 编辑 临时处理
        // isDenglu: true,
        // showZhuce: true,
        // isfood: true,
        // isDianpu: true,

        value_gonggao: '',
        value_peisongTime: {
            time1: '-请选择-',
            time2: '-请选择-',
        },
        value_peisongFuwu: '由商家提供服务',
        value_peisongShijian: '',
        value_phone: '',
        value_dizhi: '',
        value_name: '',
        zhaopaiUrl: {
            imagefileID: '',
            imagetempFileURL: '',
        },
        tempFilePath_zhaopai: '',
        addNum1: 0,
        addNum2: 0,
        _id: '',
        foodList: [],
        files: [],
        deleteFileList: [],

        isZhiding_food: false,
        foodList_zhiding: [],

        value_qisong: 0,

        isDingdan: true,
        searchlist: [],
        xuanze_num: 0,
        isQuanxuan: false,
        shangjiaDingdanList: [],
        go_tuikuan_list: [],
        go_tuikuan_list_0: [],

        isshowGengduo: false,

        chucan_List: [],
        songda_List: [],
        tuikuan_List: [],
        newOrder_List: [],
        showlist: [],
        showlist_danxuan: [],
        nameList_dingdan_index: 0,
        isDianpuOpen: false,
        inputVal_search: '',
        isSearch: false,
        isShangjia: false,

        pingjia_list: ['差', '一般', '不错', '很满意', '强烈推荐'],
        xingji: 5,
        xingji_list: [xingjisrc2, xingjisrc2, xingjisrc2, xingjisrc2, xingjisrc2], //评价总分展示使用
        dingyue_total: 0,

        kouweiList: ['微辣', '偏甜']
    },
    toTixian() {
        var xd_time = utils_time.formatTime(new Date())
        var val_tixian = this.data.val_tixian
        var value_name = this.data.value_name.slice(0, 20)
        var value_phone = this.data.value_phone
        var fuwu_percent = this.data.fuwu_percent
        var dingdan_tixian = this.data.dingdan_tixian
        var dianpu_phone = this.data.value_phone
        var dianpu_dizhi = this.data.value_dizhi
        var dianpu_name = this.data.value_name
        var dingdanid_list = this.data.dingdanid_list
        var that = this
        wx.showModal({
            title: '提示',
            content: '每周仅可提现一次',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.showLoading({
                        title: '提交中..',
                    })
                    wx.cloud.callFunction({
                            name: 'changedata',
                            data: {
                                action: 'changeStatus_tixian',
                                changeData: {
                                    xd_time,
                                    dingdanid_list,
                                }
                            }
                        })
                        .then(res => {
                            console.log(res, '订单状态改变成功：：');
                            db.collection('jiesuan').add({
                                    data: {
                                        xd_time,
                                        isJiesuan: false,
                                        val_tixian,
                                        dingdan_tixian,
                                        fuwu_percent,
                                        dianpu_phone,
                                        dianpu_dizhi,
                                        dianpu_name,
                                        dingdanid_list,
                                    }
                                })
                                .then(res => {
                                    console.log(res._id, '提现申请成功');
                                    // 通知管理员
                                    // 推送下单成功提醒
                                    wx.cloud.callFunction({
                                            name: 'tuisongxiadannew',
                                            data: {
                                                isTixian_meishi: true,
                                                val_tixian,
                                                value_name,
                                                value_phone,
                                            }
                                        })
                                        .then(res => {
                                            console.log('[代取下单] 提醒推送 成功', res)
                                            wx.showToast({
                                                title: '申请成功',
                                                icon: 'none'
                                            })
                                            that.setData({
                                                val_tixian: 0,
                                                dingdan_tixian: 0
                                            })
                                            that.loadDingdan()
                                            that.showMingxi()
                                        })
                                        .catch(err => {
                                            console.log('[代取下单] 提醒推送 失败：', err)
                                        })

                                })
                                .catch(err => {
                                    console.log('提现申请失败');
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            wx.hideLoading({})
                        })



                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    showMingxi() {
        console.log('show明细');
        this.setData({
            isjieusuan_mingxi: true,
            isjieusuan_tixian: false,
        })
        var _openid = wx.getStorageSync('openid')
        db.collection('jiesuan').where({
                _openid,
            })
            .orderBy('xd_time', 'desc')
            .get()
            .then(res => {
                console.log(res.data, '下载结算明细');
                db.collection('banner').doc('meishidata0001').get()
                    .then(res2 => {
                        this.setData({
                            jiesuan_list: res.data,
                            fuwu_percent: res2.data.fuwu_percent
                        })

                    })
            })
            .catch(err => {
                console.log(err);
            })
    },
    jingqueJiage(heji_money) {
        var heji_money_a = String(heji_money).slice(0, String(heji_money).indexOf('.'))
        var heji_money_len = heji_money_a.length + 2

        var heji_money_last = Number((heji_money).toPrecision(heji_money_len))
        return heji_money_last
    },

    showTixian() {
        console.log('show提现');
        var shangjiaDingdanList = this.data.shangjiaDingdanList
        var fuwu_percent = this.data.fuwu_percent
        var yesterday7 = utils_time.formatnianyueriYesterday7(new Date())

        var dingdanid_list = []
        shangjiaDingdanList.forEach(element => {
            if (element.dd_Status == '3' && !element.isTixian && element.xd_time <= yesterday7) {
                // if (element.dd_Status == '3' && !element.isTixian) {
                var element_tixian = {
                    _id: element._id,
                    shijiMoney: element.shijiMoney
                }
                dingdanid_list.push(element_tixian)
            }
        });
        var val_tixian = dingdanid_list.reduce(function (accumulator, currentValue) {
            return accumulator + currentValue.shijiMoney;
        }, 0)
        var dingdan_tixian = val_tixian
        val_tixian = dingdan_tixian * (1 - fuwu_percent)
        val_tixian = this.jingqueJiage(val_tixian)
        this.setData({
            isjieusuan_mingxi: false,
            isjieusuan_tixian: true,
            dingdan_tixian,
            val_tixian,
            dingdanid_list,
        })
    },

    tochooseText(e) {
        var index = e.currentTarget.dataset.index
        var val_kouwei = this.data.kouweiList[index]
        var category_id = e.currentTarget.dataset.category_id

        var food_id = e.currentTarget.dataset.food_id
        var foodList = this.data.foodList
        var foodList_item = foodList[category_id].food[food_id]
        var kouwei = foodList_item.foodDetail.kouwei
        if (kouwei == undefined) {
            kouwei = ''
        }
        foodList_item.foodDetail.kouwei = kouwei + val_kouwei
        this.setData({
            foodList,
        })
    },

    goDingyue() {
        var id = wx.getStorageSync('id')
        // var openid = wx.getStorageSync('openid')
        var templateId = 'OgFUv0zi6LpzrnWT8-bNZIvY5WDupxYhN8GV1FgPp5o' // 新订单通知
        var templateId2 = '-G6RVeu03oB7Lcapnq4YXj5AME_RnuRoR6rZy3uyKdo' //退款申请通知
        var dingyue = {
            templateId: templateId,
            name: '新订单通知'
        }
        let that = this
        wx.requestSubscribeMessage({
            tmplIds: [templateId, templateId2],
            success(res) {
                console.log('商家 点击订阅消息：', res);
                // 在数据库中更新订阅条数
                wx.cloud.callFunction({
                        name: 'yonghu',
                        data: {
                            // openid: openid,
                            id: id,
                            dingyue: dingyue
                        }
                    })
                    .then(res => {
                        console.log('[云函数] [yonghu][dingyue] 更新 成功几条：', res.result.stats.updated)
                        wx.cloud.database().collection('user').doc(id)
                            .get()
                            .then(res => {
                                console.log('新订单通知 统计 成功', res);
                                let dingyue = res.data.dingyue
                                let dingyue_total = 0
                                dingyue.forEach(element => {
                                    if (element.name == '新订单通知') {
                                        dingyue_total += 1
                                    }
                                });
                                that.setData({
                                    dingyue_total,
                                })
                            })
                            .catch(err => {
                                console.log('新订单通知 统计失败', err);
                            })

                    })
                    .catch(err => {
                        console.log('[云函数] [yonghu][dingyue] 更新 失败：', err)
                    })
            }
        })
    },
    showXingji(fenshu) {
        var xingji_list = [xingjisrc1, xingjisrc1, xingjisrc1, xingjisrc1, xingjisrc1]
        for (let index = 0; index < xingji_list.length; index++) {
            if (index < fenshu) {
                xingji_list[index] = xingjisrc2
            }
        }
        return xingji_list
    },

    input_search(e) {
        // console.log(e, 'input_search');
        var searchlist = []
        var inputVal_search = e.detail.value
        var showlist = this.data.showlist
        // 先做判断 是否包含搜索关键词
        var searchNum = showlist.length
        // showlist.forEach(element => {
        //     searchNum++

        // });
        showlist.forEach(element => {
            var hunheStr = element.address_meishi.value_name +
                element.address_meishi.value_phone +
                element.address_meishi.value_address_jian +
                element.xd_time
            console.log(hunheStr.includes(inputVal_search));
            if (hunheStr.includes(inputVal_search)) {
                searchlist.push(element)
                searchNum--
            } else {
                searchNum++
            }
        });
        if (searchNum == showlist.length * 2) {
            searchlist = []
        }
        this.setData({
            searchlist,
            isSearch: true,
        })
        // this.quxiaoQuanxuan()
    },
    changeDianpuOpen() {
        this.setData({
            isDianpuOpen: !this.data.isDianpuOpen
        })
    },
    goDel() {
        console.log('删除');
        var showlist_danxuan = this.data.showlist_danxuan
        var dd_Status = '10'
        var content_text = '确认删除吗？'
        var timeName = 'del_time'
        var gx_time = utils_time.formatTime(new Date())
        this.change_dd_Status(dd_Status, content_text, timeName, gx_time, showlist_danxuan)
    },
    goJutuikuan() {
        console.log('拒绝退款');
        var showlist_danxuan = this.data.showlist_danxuan
        var dd_Status = '6'
        var content_text = '确认拒绝退款吗？'
        var timeName = 'jjtuikuan_time'
        var gx_time = utils_time.formatTime(new Date())
        this.change_dd_Status(dd_Status, content_text, timeName, gx_time, showlist_danxuan)
    },
    goTuikuan() {
        console.log('点击退款');
        var showlist_danxuan = this.data.showlist_danxuan
        var gx_time = utils_time.formatTime(new Date())
        this.change_dd_Status_tuikuan(gx_time, showlist_danxuan)
    },
    goChucan() {
        console.log('出餐');
        var showlist_danxuan = this.data.showlist_danxuan
        var dd_Status = '2'
        var content_text = '确认出餐吗？'
        var timeName = 'chucan_time'
        var gx_time = utils_time.formatTime(new Date())
        this.change_dd_Status(dd_Status, content_text, timeName, gx_time, showlist_danxuan)
    },
    goSongda() {
        console.log('送达');
        var showlist_danxuan = this.data.showlist_danxuan
        var gx_time = utils_time.formatTime(new Date())
        // this.change_dd_Status_songda_fenzhang(gx_time, showlist_danxuan)
        var dd_Status = '3'
        var content_text = '确认送达吗？'
        var timeName = 'songda_time'
        this.change_dd_Status(dd_Status, content_text, timeName, gx_time, showlist_danxuan)
    },
    // 改变订单状态
    change_dd_Status(dd_Status, content_text, timeName, gx_time, showlist_danxuan) {

        if (showlist_danxuan.length == 0) {
            wx.showToast({
                title: '选择为空',
                icon: 'none',
            })
        } else {
            var that = this
            wx.showModal({
                title: '提示',
                content: content_text,
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        wx.showLoading({
                            title: '提交中..',
                        })
                        var idArr = []
                        showlist_danxuan.forEach(element => {
                            idArr.push(element._id)
                        });
                        wx.cloud.callFunction({
                                name: 'changedata',
                                data: {
                                    action: 'changeStatus',
                                    changeData: {
                                        timeName,
                                        dd_Status,
                                        collection_name: 'meishi', //美食
                                        gx_time,
                                        idArr,
                                    }
                                }
                            })
                            .then(res => {
                                console.log('提交成功：：', res);
                                wx.showToast({
                                    icon: 'none',
                                    title: '操作完成',
                                })
                                that.loadDingdan()
                            })
                            .catch(err => {
                                console.log(err);
                                wx.hideLoading({})
                            })

                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    // 改变订单状态 - 分账-送达
    change_dd_Status_songda_fenzhang(gx_time, showlist_danxuan) {
        var timeout = showlist_danxuan.length * 500
        if (timeout < 1) {
            timeout = 1
        }
        if (showlist_danxuan.length == 0) {
            wx.showToast({
                title: '选择为空',
                icon: 'none',
            })
        } else {
            var that = this
            wx.showModal({
                title: '提示',
                content: '确认送达吗？',
                success(res) {
                    if (res.confirm) {
                        wx.showLoading({
                            title: '提交中..',
                        })
                        console.log('点击送达，去分账');

                        wx.cloud.callFunction({
                                name: 'apayfenzhang',
                                data: {
                                    fenzhang_list: showlist_danxuan,
                                    songda_time: gx_time,
                                    action: 'fenzhang',
                                }
                            })
                            .then(res => {
                                console.log(res, 'fenzhang成功');
                                wx.showToast({
                                    icon: 'none',
                                    title: '操作完成',
                                })

                                setTimeout(() => {
                                    that.loadDingdan()
                                }, timeout);

                            })
                            .catch(err => {
                                console.log(err);
                                wx.hideLoading({})
                            })



                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    // 改变订单状态 - 退款
    change_dd_Status_tuikuan(gx_time, showlist_danxuan) {
        var timeout = showlist_danxuan.length * 500
        if (timeout < 1) {
            timeout = 1
        }
        if (showlist_danxuan.length == 0) {
            wx.showToast({
                title: '选择为空',
                icon: 'none',
            })
        } else {
            var that = this
            wx.showModal({
                title: '提示',
                content: '同意退款后将原路退回到顾客账户，确定退款吗？',
                success(res) {
                    if (res.confirm) {
                        wx.showLoading({
                            title: '退款中..',
                        })
                        console.log('去微信退款');

                        wx.cloud.callFunction({
                                name: 'apaytuikuan',
                                data: {
                                    go_tuikuan_list: showlist_danxuan,
                                    tytuikuan_time: gx_time,
                                    action: 'tuikuan_meishi',
                                }
                            })
                            .then(res => {
                                console.log('退款成功：：', res);

                                setTimeout(() => {
                                    wx.showToast({
                                        icon: 'none',
                                        title: '退款完成',
                                    })
                                    that.loadDingdan()
                                }, timeout);

                            })
                            .catch(err => {
                                console.log(err);
                                wx.hideLoading({})
                            })

                        // var idArr = []
                        // showlist_danxuan.forEach(element => {
                        //     idArr.push(element._id)
                        // });
                        // wx.cloud.callFunction({
                        //         name: 'changedata',
                        //         data: {
                        //             action: 'changeStatus',
                        //             changeData: {
                        //                 timeName,
                        //                 dd_Status,
                        //                 collection_name: 'meishi', //美食
                        //                 gx_time,
                        //                 idArr,
                        //             }
                        //         }
                        //     })
                        //     .then(res => {
                        //         console.log('提交成功：：', res);
                        //         wx.showToast({
                        //             icon: 'none',
                        //             title: '操作完成',
                        //         })
                        //         that.loadDingdan()
                        //     })
                        //     .catch(err => {
                        //         console.log(err);
                        //         wx.hideLoading({})
                        //     })

                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },

    // 点我复制
    toCopy(e) {
        console.log(e);
        var data = e.currentTarget.dataset.value
        wx.setClipboardData({
            data,
            success(res) {
                console.log('用户点击，成功复制', res);
            }
        })
    },
    toshowGengduo(e) {
        var index = e.currentTarget.dataset.index
        var isshowGengduo = e.currentTarget.dataset.isshowgengduo
        console.log('isshowGengduo', isshowGengduo);
        var showlist = this.data.showlist
        showlist[index].isshowGengduo = !isshowGengduo
        this.setData({
            showlist,
        })
    },

    checkboxChange_danxuan_neworder(e) { //单选 新
        console.log('选中...', e.detail.value);
        var value_array = e.detail.value
        var showlist = this.data.showlist
        var showlist_danxuan = []
        value_array.forEach(element => {
            var index = Number(element)
            var item = showlist[index]
            showlist_danxuan.push(item)
        });
        this.setData({
            showlist_danxuan,
            xuanze_num: value_array.length
        })
        console.log('showlist_danxuan...', showlist_danxuan);
    },
    checkbox_Quanxuan_neworder() { //全选 新
        var searchlist = this.data.searchlist
        if (searchlist.length !== 0) {
            var showlist = searchlist
        } else {
            var showlist = this.data.showlist
        }
        var isQuanxuan = this.data.isQuanxuan
        this.setData({
            isQuanxuan: !isQuanxuan
        })
        if (isQuanxuan != true) {
            var value_list = []
            for (let index = 0; index < showlist.length; index++) {
                value_list.push(String(index))
                if (searchlist.length !== 0) {
                    var element = 'searchlist[' + index + '].checked'
                } else {
                    var element = 'showlist[' + index + '].checked'
                }
                this.setData({
                    [element]: true
                })
            }
            var e = {
                detail: {
                    'value': value_list
                }
            }
            this.checkboxChange_danxuan_neworder(e)
        } else {
            var e = {
                detail: {
                    'value': []
                }
            }
            this.checkboxChange_danxuan_neworder(e)
            for (let index = 0; index < showlist.length; index++) {
                if (searchlist.length !== 0) {
                    var element = 'searchlist[' + index + '].checked'
                } else {
                    var element = 'showlist[' + index + '].checked'
                }
                this.setData({
                    [element]: false
                })
            }
        }
    },
    quxiaoQuanxuan_neworder() {
        var searchlist = this.data.searchlist
        var showlist = this.data.showlist
        var e = {
            detail: {
                'value': []
            }
        }
        this.checkboxChange_danxuan_neworder(e)
        for (let index = 0; index < searchlist.length; index++) {
            var element = 'searchlist[' + index + '].checked'
            this.setData({
                [element]: false,
            })
        }
        for (let index = 0; index < showlist.length; index++) {
            var element = 'showlist[' + index + '].checked'
            this.setData({
                [element]: false,
            })
        }
        this.setData({
            isQuanxuan: false
        })
    },

    // checkboxChange_danxuan_tk(e) {
    //     console.log('选的退款：', e.detail.value);
    //     var value_array = e.detail.value
    //     var shangjiaDingdanList = this.data.shangjiaDingdanList
    //     var go_tuikuan_list = []
    //     var go_tuikuan_list_0 = []
    //     value_array.forEach(element => {
    //         var index = Number(element)
    //         var item = shangjiaDingdanList[index]
    //         if (item.refund_fee == 0) { //没有用微信支付
    //             go_tuikuan_list_0.push(shangjiaDingdanList[index])
    //         } else {
    //             go_tuikuan_list.push(shangjiaDingdanList[index])
    //         }
    //     });
    //     this.setData({
    //         go_tuikuan_list,
    //         go_tuikuan_list_0,
    //         xuanze_num: value_array.length
    //     })
    //     console.log('选的退款go_tuikuan_list：', go_tuikuan_list);
    //     console.log('选的退款go_tuikuan_list_0：', go_tuikuan_list_0);

    // },
    // checkbox_Quanxuan() {
    //     var searchlist = this.data.searchlist
    //     if (searchlist.length !== 0) {
    //         var shangjiaDingdanList = searchlist
    //     } else {
    //         var shangjiaDingdanList = this.data.shangjiaDingdanList
    //     }
    //     var isQuanxuan = this.data.isQuanxuan
    //     this.setData({
    //         isQuanxuan: !isQuanxuan
    //     })
    //     if (!isQuanxuan) {
    //         var value_list = []
    //         for (let index = 0; index < shangjiaDingdanList.length; index++) {
    //             value_list.push(String(index))
    //             if (searchlist.length !== 0) {
    //                 var element = 'searchlist[' + index + '].checked'
    //             } else {
    //                 var element = 'shangjiaDingdanList[' + index + '].checked'
    //             }
    //             this.setData({
    //                 [element]: true
    //             })
    //         }
    //         var e = {
    //             detail: {
    //                 'value': value_list
    //             }
    //         }
    //         this.checkboxChange_danxuan_tk(e)
    //     } else {
    //         var e = {
    //             detail: {
    //                 'value': []
    //             }
    //         }
    //         this.checkboxChange_danxuan_tk(e)
    //         for (let index = 0; index < shangjiaDingdanList.length; index++) {
    //             if (searchlist.length !== 0) {
    //                 var element = 'searchlist[' + index + '].checked'
    //             } else {
    //                 var element = 'shangjiaDingdanList[' + index + '].checked'
    //             }
    //             this.setData({
    //                 [element]: false
    //             })
    //         }
    //     }
    // },
    // quxiaoQuanxuan() {
    //     var searchlist = this.data.searchlist
    //     var shangjiaDingdanList = this.data.shangjiaDingdanList
    //     var e = {
    //         detail: {
    //             'value': []
    //         }
    //     }
    //     this.checkboxChange_danxuan_tk(e)
    //     for (let index = 0; index < searchlist.length; index++) {
    //         var element = 'searchlist[' + index + '].checked'
    //         this.setData({
    //             [element]: false,
    //         })
    //     }
    //     for (let index = 0; index < shangjiaDingdanList.length; index++) {
    //         var element = 'shangjiaDingdanList[' + index + '].checked'
    //         this.setData({
    //             [element]: false,
    //         })
    //     }
    //     this.setData({
    //         isQuanxuan: false
    //     })
    // },


    async loadDingdan() {
        wx.showLoading({
            title: '加载中..',
        })
        var _openid = wx.getStorageSync('openid')
        var res_shangjia = await db.collection('shangjia').where({
            _openid: _openid
        }).get()
        if (res_shangjia.data[0] == undefined) {
            wx.showToast({
                title: '暂无店铺数据',
                icon: 'none'
            })
            return
        }
        var dianpu_id = res_shangjia.data[0]._id
        var res_count = await db.collection('meishi').where({
                dianpu: {
                    dianpu_id,
                }
            })
            .count()
        console.log('shangjia订单数量  ：：', res_count.total);
        var shangjiaDingdanList = []
        var pageNum = Math.ceil(res_count.total / 20) //向上取整
        // console.log(pageNum);
        // 订单
        var chucan_List = []
        var songda_List = []
        var tuikuan_List = []
        var newOrder_List = []
        // var tuikuan_List_s4 = []
        // var tuikuan_List_s56 = []
        for (let index = 0; index < pageNum; index++) {
            var res = await db.collection('meishi').where({
                    dianpu: {
                        dianpu_id,
                    },
                    dd_Status: _.neq('10')
                })
                .skip(index * 20)
                .orderBy('xd_time', 'desc')
                .get()
            console.log('shangjiaDingdanList ：：', res.data);
            res.data.forEach(element => {
                element.xingji_list = this.showXingji(element.pingjia.pingjia_fenshu)
                shangjiaDingdanList.push(element)
                if (element.dd_Status == '0') {
                    newOrder_List.push(element)
                } else if (element.dd_Status == '2') {
                    chucan_List.push(element)
                } else if (element.dd_Status == '4') {
                    tuikuan_List.push(element)
                    // } else if (element.dd_Status == '4') {
                    //     tuikuan_List_s4.push(element)
                    // } else if (element.dd_Status == '5' || element.dd_Status == '6') {
                    //     tuikuan_List_s56.push(element)
                } else if (element.dd_Status == '3' || element.dd_Status == '7') { //已送达和已评价
                    songda_List.push(element)
                }
            });
        }
        // var tuikuan_List = tuikuan_List_s4.concat(tuikuan_List_s56)
        chucan_List = chucan_List.reverse()
        newOrder_List = newOrder_List.reverse()

        this.setData({
            shangjiaDingdanList,
            chucan_List,
            songda_List,
            tuikuan_List,
            newOrder_List,
            // showlist: newOrder_List,
        })
        var e = {
            detail: {
                index: this.data.nameList_dingdan_index
            }
        }
        this.tochangeItem_dingdan(e)
        this.quxiaoQuanxuan_neworder()
        wx.hideLoading({
            success: (res) => {},
        })

    },
    tochangeXiajia(e) {
        console.log(e);
        var foodList = this.data.foodList
        var category_id = e.currentTarget.dataset.category_id
        var food_id = e.currentTarget.dataset.food_id
        var isXiajia_food = e.currentTarget.dataset.isxiajia_food
        if (isXiajia_food == undefined) {
            isXiajia_food = false
        }
        var xiajiaFood = foodList[category_id].food[food_id]

        xiajiaFood.category_id = category_id
        xiajiaFood.isXiajia_food = !isXiajia_food
        // 下架需要取消置顶
        if (xiajiaFood.isZhiding_food == true) {
            // xiajiaFood.isZhiding_food = false
            e.currentTarget.dataset.iszhiding_food = true
            this.tochangeZhiding(e)
        }
        this.setData({
            foodList,
        })
    },
    tochangeZhiding(e) {
        console.log(e);
        var foodList = this.data.foodList
        var category_id = e.currentTarget.dataset.category_id
        var food_id = e.currentTarget.dataset.food_id
        var isZhiding_food = e.currentTarget.dataset.iszhiding_food
        if (isZhiding_food == undefined) {
            isZhiding_food = false
        }
        var zhidingFood = foodList[category_id].food[food_id]

        zhidingFood.category_id = category_id
        zhidingFood.isZhiding_food = !isZhiding_food

        var foodList_zhiding = this.data.foodList_zhiding
        if (foodList_zhiding.length < 3 && isZhiding_food == false) {
            foodList_zhiding.push(zhidingFood)
            this.setData({
                foodList,
                foodList_zhiding,
            })
            console.log(foodList_zhiding);
        } else if (isZhiding_food == true) {
            for (let index = 0; index < foodList_zhiding.length; index++) {
                const element = foodList_zhiding[index];
                if (element.category_id == category_id && element.id == food_id) {
                    foodList_zhiding.splice(index, 1)
                }
            }
            this.setData({
                foodList,
                foodList_zhiding,
            })

        }
    },


    tochangeItem(e) {
        var index = e.detail.index
        var nameList = this.data.nameList
        nameList.forEach((element, i) => {
            if (index == i) {
                element.checked = true
            } else {
                element.checked = false
            }
        });
        console.log(index, 'tochangeItem被点击');
        if (index == 0) {
            this.loadDingdan()
            // console.log('开始下载商家订单');
        }
        if (index == 1) { // 店铺
            // this.tapDianpu()
            var xingji = this.data.xingji
            var xingji_list = this.showXingji(xingji)
            this.setData({
                xingji_list,
                // xingji
            })
        }
        if (index == 2) {
            // this.tapFood()
        }
        if (index == 3) {
            this.showMingxi()
        }

        this.setData({
            nameList
        })
    },
    tochangeItem_dingdan(e) {
        var index = e.detail.index
        var nameList_dingdan = this.data.nameList_dingdan
        var showlist = []
        nameList_dingdan.forEach((element, i) => {
            if (index == i) {
                element.checked = true
            } else {
                element.checked = false
            }
        });
        if (index == 0) {
            console.log(index, '被点击');
            showlist = this.data.newOrder_List
        }
        if (index == 1) {
            showlist = this.data.chucan_List
            console.log(index, '被点击');
        }
        if (index == 2) {
            console.log(index, '被点击');
            showlist = this.data.songda_List
        }
        if (index == 3) {
            console.log(index, '被点击');
            showlist = this.data.tuikuan_List
        }
        if (index == 4) {
            console.log(index, '被点击');
            showlist = this.data.shangjiaDingdanList
        }

        this.setData({
            nameList_dingdan,
            nameList_dingdan_index: index,
            showlist,
            showlist_danxuan: [],
            searchlist: [],
            inputVal_search: '',
            xuanze_num: 0,
            isSearch: false,
        })
        this.quxiaoQuanxuan_neworder()
    },

    tapDianpu() {
        console.log('tapDianpu');
    },
    tapFood() {
        console.log('tapFood');
    },
    // toDianpu() {
    //     this.setData({
    //         isDianpu: !this.data.isDianpu
    //     })
    // },
    // tofood() {
    //     this.setData({
    //         isfood: !this.data.isfood
    //     })
    // },

    // 删除分类
    toDel_category(e) {
        
        var category_id = e.currentTarget.dataset.category_id
        console.log(category_id,'删除category_id')
        var foodList = this.data.foodList
        if (foodList.length == 1) {
            wx.showToast({
                title: '无法删除更多',
                icon:'none'
            })
            return
        }
        var deleteFileList = this.data.deleteFileList
        foodList[category_id].food.forEach(element => {
            var imagefileID = element.imageUrl.imagefileID
            if (imagefileID !== '') {
                console.log('待删除的 imagefileID', imagefileID);
                deleteFileList.push(imagefileID)
            }
        });

        foodList.splice(category_id, 1)
        this.setData({
            foodList,
            deleteFileList,
        })
    },
    // 删除 food
    toDel_food(e) {
        var category_id = e.currentTarget.dataset.category_id
        var food_id = e.currentTarget.dataset.food_id
        console.log(category_id, food_id)
        var foodList = this.data.foodList

        var deleteFileList = this.data.deleteFileList
        var imagefileID = foodList[category_id].food[food_id].imageUrl.imagefileID
        if (imagefileID !== '') {
            console.log('待删除的 imagefileID', imagefileID);
            deleteFileList.push(imagefileID)
        }

        foodList[category_id].food.splice(food_id, 1)
        this.setData({
            foodList,
            deleteFileList,
        })
    },



    // 选择图片 上传文件
    chooseImage: function (e) {
        var imagefileID = this.data.zhaopaiUrl.imagefileID
        var deleteFileList = this.data.deleteFileList

        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePath = res.tempFilePaths[0]
                var zhaopaiUrl = {
                    imagetempFileURL: tempFilePath
                }

                if (imagefileID !== '') {
                    console.log('待删除的 imagefileID', imagefileID);
                    deleteFileList.push(imagefileID)
                }

                that.setData({
                    tempFilePath_zhaopai: tempFilePath,
                    zhaopaiUrl,
                    deleteFileList,
                });
                console.log('选择的图片临时地址：：', tempFilePath);
            }
        })

    },
    // 选择图片 上传文件
    chooseImage_food(e) {
        var category_id = e.currentTarget.dataset.category_id
        var food_id = e.currentTarget.dataset.food_id
        var imagefileID = e.currentTarget.dataset.imagefileid
        var foodList = this.data.foodList
        var deleteFileList = this.data.deleteFileList

        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePath = res.tempFilePaths[0]

                foodList[category_id].food[food_id].imageUrl.imagetempFileURL = tempFilePath;
                console.log('选择的图片临时地址：：', tempFilePath);

                if (imagefileID !== '') {
                    console.log('待删除的 imagefileID', imagefileID);
                    deleteFileList.push(imagefileID)
                }

                that.setData({
                    foodList,
                    deleteFileList,
                });
                that.onShow()
            }
        })

    },




    onInput_foodDetail(e) {
        var category_id = e.currentTarget.dataset.category_id
        var food_id = e.currentTarget.dataset.food_id
        var val_name = e.currentTarget.dataset.val_name
        var foodList = this.data.foodList
        var foodList_item = foodList[category_id].food[food_id]
        if (val_name == 'miaoshu') {
            foodList_item.foodDetail.miaoshu = e.detail.value
        }
        if (val_name == 'zhuliao') {
            foodList_item.foodDetail.zhuliao = e.detail.value
        }
        if (val_name == 'fuliao') {
            foodList_item.foodDetail.fuliao = e.detail.value
        }
        if (val_name == 'foodWeight') {
            foodList_item.foodDetail.foodWeight = e.detail.value
        }
        if (val_name == 'kouwei') {
            foodList_item.foodDetail.kouwei = e.detail.value
        }
        this.setData({
            foodList,
        });
    },
    onInput_food_price(e) {
        var category_id = e.currentTarget.dataset.category_id
        var food_id = e.currentTarget.dataset.food_id
        var foodList = this.data.foodList
        var food_price = Math.ceil(e.detail.value * 100) / 100
        foodList[category_id].food[food_id].price = food_price;

        var foodList_zhiding = this.data.foodList_zhiding
        for (let index = 0; index < foodList_zhiding.length; index++) {
            const element = foodList_zhiding[index];
            if (element.category_id == category_id && element.id == food_id) {
                element.price = food_price
            }
        }
        this.setData({
            foodList,
            foodList_zhiding,
        });
    },
    onInput_food_name(e) {
        var category_id = e.currentTarget.dataset.category_id
        var food_id = e.currentTarget.dataset.food_id
        var foodList = this.data.foodList
        foodList[category_id].food[food_id].name = e.detail.value;

        var foodList_zhiding = this.data.foodList_zhiding
        for (let index = 0; index < foodList_zhiding.length; index++) {
            const element = foodList_zhiding[index];
            if (element.category_id == category_id && element.id == food_id) {
                element.name = e.detail.value
            }
        }
        this.setData({
            foodList,
            foodList_zhiding,
        });
    },
    onInput_category(e) {
        console.log('选择输入框id：：', e.currentTarget.dataset.category_id);
        var category_id = e.currentTarget.dataset.category_id
        var foodList = this.data.foodList
        foodList[category_id].name = e.detail.value;
        this.setData({
            foodList,
        });
    },

    toAddfood(e) {
        console.log(e);
        var addNum2 = this.data.addNum2 + 1
        var category_id = e.currentTarget.dataset.category_id
        var foodList = this.data.foodList
        var addfood = foodList[category_id].food
        var addfood_id = addfood.length
        addfood[addfood_id] = {
            id: addfood_id,
            name: '名称' + addNum2,
            price: '价格' + addNum2,
            imageUrl: {
                imagefileID: '',
                imagetempFileURL: ''
            },
            foodDetail: {
                miaoshu: '',
                zhuliao: '',
                fuliao: '',
                foodWeight: '',
                kouwei: ''
            }
        }
        this.setData({
            foodList,
            addNum2,
        })
    },
    toAddcategory(e) {
        // console.log(e);
        var addNum1 = this.data.addNum1 + 1
        // var category_id = e.currentTarget.dataset.category_id
        var foodList = this.data.foodList
        // var addfood = foodList[category_id].food
        var addcategory_id = foodList.length
        foodList[addcategory_id] = {
            id: addcategory_id,
            name: '分类名称' + addNum1,
            food: [{
                id: 0,
                name: '名称0',
                price: '价格0',
                imageUrl: {
                    imagefileID: '',
                    imagetempFileURL: ''
                },
                foodDetail: {
                    miaoshu: '',
                    zhuliao: '',
                    fuliao: '',
                    foodWeight: '',
                    kouwei: ''
                }
            }]
        }
        this.setData({
            foodList,
            addNum1,
        })
    },
    showXiangqing(e) {
        var isxiangqing = e.currentTarget.dataset.isxiangqing
        console.log(isxiangqing, 'isxiangqing');
        var category_id = e.currentTarget.dataset.category_id
        var food_id = e.currentTarget.dataset.food_id
        var foodList = this.data.foodList
        foodList[category_id].food[food_id].isxiangqing = !isxiangqing
        this.setData({
            foodList
        })
    },
    checkFoodprice(foodList) {
        foodList.forEach(element => {
            if (element) {

            }
        });
    },
    // 店铺信息修改
    async toXiugai_dianpu() {
        // console.log('修改店铺详情');
        var imagetempFileURL = this.data.zhaopaiUrl.imagetempFileURL
        if (imagetempFileURL == '') {
            wx.showToast({
                icon: 'none',
                title: '未上传图片',
            })
            return
        }
        if (this.data.value_name == '') {
            wx.showToast({
                icon: 'none',
                title: '未填店铺名称',
            })
            return
        }
        if (this.data.value_dizhi == '') {
            wx.showToast({
                icon: 'none',
                title: '未填地址',
            })
            return
        }
        if (this.data.value_phone == '') {
            wx.showToast({
                icon: 'none',
                title: '未填电话',
            })
            return
        }
        wx.showLoading({
            title: '上传...',
        })
        var openid = wx.getStorageSync('openid')
        var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var createTime = utils_time.formatTime(new Date())
        var cloudPath = 'shangjia/' + openid + 'dianpu' + iamgeUploadTime + '.png'
        if (imagetempFileURL.includes('tmp')) {
            var res1 = await wx.cloud.uploadFile({ // 上传图片················
                cloudPath: cloudPath,
                filePath: this.data.tempFilePath_zhaopai, // 文件路径
            })
            console.log('上传后的fileID', res1.fileID)
            var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
                fileList: [{
                    fileID: res1.fileID
                }]
            })
            // console.log('用云文件 ID 换取真实链接', res.fileList)
            console.log('res2', res2);

            var zhaopaiUrl = {
                imagefileID: res2.fileList[0].fileID,
                imagetempFileURL: res2.fileList[0].tempFileURL
            }
        } else {
            var zhaopaiUrl = this.data.zhaopaiUrl
        }

        var _id = this.data._id
        if (_id == '') {
            console.log(1);
            db.collection('shangjia').add({
                    data: {
                        // name: '常德牛肉粉',
                        // dizhi: '湘潭大学堕落坑18号',
                        // phone: '湘潭大学堕落坑18号',
                        // zhaopaiUrl: '',
                        // peisongFuwu: '由商家提供配送服务',
                        // peisongTime: '07:00-22:00',
                        // gonggao: 'wo sh gong gao'
                        qisong: this.data.value_qisong,
                        gonggao: this.data.value_gonggao,
                        peisongTime: this.data.value_peisongTime,
                        peisongFuwu: this.data.value_peisongFuwu,
                        peisongShijian: this.data.value_peisongShijian,
                        phone: this.data.value_phone,
                        dizhi: this.data.value_dizhi,
                        name: this.data.value_name,
                        isDianpuOpen: this.data.isDianpuOpen,
                        zhaopaiUrl,
                        createTime,

                        foodList: this.data.foodList,
                        xingji: this.data.xingji
                    }
                })
                .then(res => {
                    console.log('修改店铺详情 成功创建', res._id);
                    wx.showToast({
                        icon: 'none',
                        title: '修改完成',
                    })
                    this.setData({
                        _id: res._id
                    })
                })
                .catch(err => {})
        } else {
            console.log(2);
            var res3 = await db.collection('shangjia').doc(_id).update({
                data: {
                    qisong: this.data.value_qisong,
                    gonggao: this.data.value_gonggao,
                    peisongTime: this.data.value_peisongTime,
                    peisongFuwu: this.data.value_peisongFuwu,
                    peisongShijian: this.data.value_peisongShijian,
                    phone: this.data.value_phone,
                    dizhi: this.data.value_dizhi,
                    name: this.data.value_name,
                    isDianpuOpen: this.data.isDianpuOpen,
                    zhaopaiUrl,
                    gx_Time: createTime,
                }
            })
            var deleteFileList = this.data.deleteFileList
            if (deleteFileList !== []) {
                var resDel = await wx.cloud.deleteFile({
                    fileList: deleteFileList,
                })
                this.setData({
                    deleteFileList: []
                })
                console.log('编辑 店铺详情 删除图片成功：：：', resDel);
            }
            console.log('修改 店铺详情 成功更新', res3.stats.updated);
            wx.showToast({
                icon: 'none',
                title: '修改完成',
            })

        }
    },
    // 美食 信息 修改
    async toXiugai_food() {
        // console.log('修改店铺详情');

        // 第1：图片上传
        // 第2:更新foodlist
        // 第3：把图片删除
        // ....图片上传
        wx.showLoading({
            title: '上传...',
        })

        var createTime = utils_time.formatTime(new Date())
        var openid = wx.getStorageSync('openid')
        var foodList = this.data.foodList
        var foodList_zhiding = this.data.foodList_zhiding

        for (let index1 = 0; index1 < foodList.length; index1++) {
            const category_element = foodList[index1];
            for (let index2 = 0; index2 < category_element.food.length; index2++) {
                const element = category_element.food[index2];
                // 检查价格要大于1元
                if (element.price < 1) {
                    wx.showToast({
                        title: '金额须>1元',
                        icon: 'none'
                    })
                    return
                }
                var tempFilePath = element.imageUrl.imagetempFileURL
                // console.log(tempFilePath.includes('tmp'));
                if (tempFilePath.includes('tmp')) {

                    var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
                    var cloudPath = 'shangjia/' + openid + 'food' + iamgeUploadTime + '.png'

                    var res1 = await wx.cloud.uploadFile({ // 上传图片················
                        cloudPath: cloudPath,
                        filePath: tempFilePath, // 文件路径
                    })
                    console.log('上传后的fileID', res1.fileID)
                    var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
                        fileList: [{
                            fileID: res1.fileID
                        }]
                    })
                    // console.log('用云文件 ID 换取真实链接', res.fileList)
                    console.log('res2', res2);

                    element.imageUrl = {
                        imagefileID: res2.fileList[0].fileID,
                        imagetempFileURL: res2.fileList[0].tempFileURL
                    }

                    for (let index3 = 0; index3 < foodList_zhiding.length; index3++) {
                        const element3 = foodList_zhiding[index3];
                        if (element3.category_id == index1 && element3.id == index2) {
                            element3.imageUrl = {
                                imagefileID: res2.fileList[0].fileID,
                                imagetempFileURL: res2.fileList[0].tempFileURL
                            }
                        }
                    }

                }
            }

        }

        // 。。。 更新foodlist
        var _id = this.data._id
        if (_id == '') {
            console.log('未完善店铺信息');
            wx.showToast({
                icon: 'none',
                title: '先完善店铺信息',
            })
            return

            // db.collection('shangjia').add({
            //         data: {
            //             foodList,
            //         }
            //     })
            //     .then(res => {
            //         console.log('创建 商品详情 成功', res._id);
            //         wx.showToast({
            //             icon: 'none',
            //             title: '修改完成',
            //         })
            //     })
            //     .catch(err => {})
        } else {
            console.log(2);
            var res3 = await db.collection('shangjia').doc(_id).update({
                data: {
                    foodList,
                    foodList_zhiding: this.data.foodList_zhiding,
                    gx_Time: createTime,
                }
            })
            var deleteFileList = this.data.deleteFileList
            if (deleteFileList !== []) {
                var resDel = await wx.cloud.deleteFile({
                    fileList: deleteFileList,
                })
                this.setData({
                    deleteFileList: []
                })
                console.log('编辑 商品详情 删除图片成功：：：', resDel);
            }
            console.log('修改 商品详情 成功 更新', res3.stats.updated);

            wx.showToast({
                icon: 'none',
                title: '修改完成',
            })
        }
    },
    // 输入框状态 公告
    onInput_gonggao(e) {
        var {
            value
        } = e.detail;
        this.setData({
            value_gonggao: value,
            showClearBtn_gonggao: !!value.length,
        });
    },
    onClear_gonggao() {
        console.log('clear');
        this.setData({
            value_gonggao: '',
            showClearBtn_gonggao: false,
        });
    },
    // 输入框状态 配送时间
    // onInput_peisongTime(e) {
    //     var {
    //         value
    //     } = e.detail;
    //     this.setData({
    //         value_peisongTime: value,
    //         showClearBtn_peisongTime: !!value.length,
    //     });
    // },
    // onClear_peisongTime() {
    //     console.log('clear');
    //     this.setData({
    //         value_peisongTime: '',
    //         showClearBtn_peisongTime: false,
    //     });
    // },
    tochangePeisongTime1: function (e) {
        var value_peisongTime = this.data.value_peisongTime
        value_peisongTime.time1 = e.detail.value
        this.setData({
            value_peisongTime,
        })
    },
    tochangePeisongTime2: function (e) {
        var value_peisongTime = this.data.value_peisongTime
        value_peisongTime.time2 = e.detail.value
        this.setData({
            value_peisongTime,
        })
    },
    // 输入框状态 起送金额
    onInput_qisong(e) {
        var value_qisong = Number(e.detail.value)
        this.setData({
            value_qisong,
        });
    },
    // 输入框状态 配送服务
    onInput_peisongFuwu(e) {
        var {
            value
        } = e.detail;
        this.setData({
            value_peisongFuwu: value,
            showClearBtn_peisongFuwu: !!value.length,
        });
    },
    onClear_peisongFuwu() {
        console.log('clear');
        this.setData({
            value_peisongFuwu: '',
            showClearBtn_peisongFuwu: false,
        });
    },
    // 输入框状态 配送时间
    onInput_peisongShijian(e) {
        var {
            value
        } = e.detail;
        this.setData({
            value_peisongShijian: value,
            showClearBtn_peisongShijian: !!value.length,
        });
    },
    onClear_peisongShijian() {
        console.log('clear');
        this.setData({
            value_peisongShijian: '',
            showClearBtn_peisongShijian: false,
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
        });
    },
    onClear_phone() {
        console.log('clear');
        this.setData({
            value_phone: '',
            showClearBtn_phone: false,
        });
    },
    // 输入框状态 地址
    onInput_dizhi(e) {
        var {
            value
        } = e.detail;
        this.setData({
            value_dizhi: value,
            showClearBtn_dizhi: !!value.length,
        });
    },
    onClear_dizhi() {
        console.log('clear');
        this.setData({
            value_dizhi: '',
            showClearBtn_dizhi: false,
        });
    },
    // 输入框状态 店铺名称
    onInput_name(e) {
        var {
            value
        } = e.detail;
        this.setData({
            value_name: value,
            showClearBtn_name: !!value.length,
        });
    },
    onClear_name() {
        console.log('clear');
        this.setData({
            value_name: '',
            showClearBtn_name: false,
        });
    },



    toShenqing() {
        this.setData({
            showZhuce: false,
            isShenqing: true
        })
    },
    toDenglu() {
        wx.showLoading({
            title: '登陆...',
        })
        var id = wx.getStorageSync('id')
        db.collection('user').doc(id).get()
            .then(res => {
                // 是否商家
                console.log('查询 是否商家：：', res.data.isShangjia);
                var isShangjia = res.data.isShangjia
                wx.setStorageSync('isShangjia', isShangjia)

                //查询 订阅消息数量
                console.log(res.data, '新订单通知 统计 成功');
                let dingyue = res.data.dingyue
                let dingyue_total = 0
                if (dingyue != undefined) {

                    dingyue.forEach(element => {
                        if (element.name == '新订单通知') {
                            dingyue_total += 1
                        }
                    });
                }
                this.setData({
                    dingyue_total,
                })

                if (isShangjia == true) {
                    this.setData({
                        showZhuce: false,
                        isDenglu: true,
                        isShangjia,
                    })
                    wx.showToast({
                        icon: 'none',
                        title: '登陆成功',
                    })
                    var _openid = wx.getStorageSync('openid')
                    console.log(_openid, '---openid');
                    // 查询有没店铺记录
                    db.collection('shangjia').where({
                            _openid: _openid
                        })
                        .get()
                        .then(res => {
                            console.log('是否有商家的记录', res.data);
                            if (res.data.length !== 0) {
                                this.setData({
                                    // haveResdata: true,
                                    _id: res.data[0]._id,
                                    value_gonggao: res.data[0].gonggao,
                                    value_peisongTime: res.data[0].peisongTime,
                                    value_peisongFuwu: res.data[0].peisongFuwu,
                                    value_peisongShijian: res.data[0].peisongShijian,
                                    value_phone: res.data[0].phone,
                                    value_dizhi: res.data[0].dizhi,
                                    value_name: res.data[0].name,
                                    zhaopaiUrl: res.data[0].zhaopaiUrl,
                                    value_qisong: res.data[0].qisong,
                                    isDianpuOpen: res.data[0].isDianpuOpen,
                                    xingji: res.data[0].xingji,

                                    foodList: res.data[0].foodList,
                                    foodList_zhiding: res.data[0].foodList_zhiding
                                })

                                // 下载商家订单
                                this.loadDingdan()

                                //监听店铺订单
                                var that = this
                                sjdingdanWatcher = db.collection('meishi').where(
                                        _.and([{
                                                dianpu: {
                                                    // dianpu_id: '14139e1260ffc0090034a43a7fc997c3',
                                                    dianpu_id: res.data[0]._id,
                                                }
                                            },
                                            {
                                                dd_Status: '0'
                                            }
                                        ]),
                                    )
                                    .watch({
                                        onChange: function (snapshot) {
                                            //只打印变动的信息
                                            // console.log('app.js监听talk::', snapshot)
                                            if (snapshot.docChanges.length != 0) {
                                                console.log('监听成功：：', snapshot.docChanges)
                                                if (snapshot.docChanges[0].dataType == 'add') {
                                                    // if (snapshot.docChanges[0].docId) {
                                                    if (snapshot.docChanges[0].doc.dd_Status == '0') {
                                                        console.log('您有新订单了');
                                                        audioCIAC.play()
                                                        var newOrder_List = that.data.newOrder_List
                                                        var shangjiaDingdanList = that.data.shangjiaDingdanList

                                                        // newOrder_List.push(snapshot.docChanges[0].doc)
                                                        newOrder_List.push(snapshot.docChanges[0].doc)
                                                        shangjiaDingdanList.unshift(snapshot.docChanges[0].doc)
                                                        that.setData({
                                                            newOrder_List,
                                                            shangjiaDingdanList,
                                                        })
                                                        if (that.data.nameList_dingdan[0].checked == true) {
                                                            that.setData({
                                                                showlist: newOrder_List,
                                                            })
                                                        } else if (that.data.nameList_dingdan[4].checked == true) {
                                                            that.setData({
                                                                showlist: shangjiaDingdanList,
                                                            })

                                                        }

                                                    }
                                                }

                                            }
                                        },
                                        onError: function (err) {
                                            console.error('the watch closed because of error', err)
                                        }
                                    })


                            } else {
                                var foodList = [{
                                    food: [{
                                        id: 0,
                                        name: '名称0',
                                        price: '价格0',
                                        imageUrl: {
                                            imagefileID: '',
                                            imagetempFileURL: ''
                                        }
                                    }],
                                    id: 0,
                                    name: '分类名称0'
                                }]
                                this.setData({
                                    foodList,
                                })
                            }
                        })


                } else {
                    wx.showToast({
                        icon: 'none',
                        title: '您还不是商家',
                    })
                }
            })
    },

    toPhoneCall() {
        var phone = this.data.dianpuData.phone
        console.log(phone);
        if (phone) {
            wx.makePhoneCall({
                phoneNumber: phone
            })
        }
    },


    onLoad: function (options) {
        // 判断是否商家

        // 页面跳转
        var _id = options._id
        if (_id) {
            db.collection('shangjia').doc(_id)
                .get()
                .then(res => {
                    console.log(res.data);
                    var dianpuData = res.data
                    if (options.isDetail_dianpu) {
                        this.setData({
                            dianpuData,
                            isDetail_dianpu: true,
                            showZhuce: false,
                        })
                    } else if (options.isDetail_meishi) {
                        var resMeishi = dianpuData.foodList[options.index_a].food[options.index_b]
                        this.setData({
                            resMeishi,
                            dianpuData,
                            isDetail_meishi: true,
                            showZhuce: false,
                        })

                    }
                })
        }



    },

    onReady: function () {

    },

    onShow: function () {

    },
    onReachBottom: function () {
        var jiesuan_pageNum = this.data.jiesuan_pageNum
        var jiesuan_list = this.data.jiesuan_list
        var _openid = wx.getStorageSync('openid')
        db.collection('jiesuan').where({
                _openid,
            })
            .orderBy('xd_time', 'desc')
            .skip(jiesuan_pageNum * 20)
            .get()
            .then(res => {
                console.log(res.data, '下载明细');
                if (res.data.length !== 0) {
                    res.data.forEach(element => {
                        jiesuan_list.push(element)
                    });
                    jiesuan_pageNum++
                    this.setData({
                        jiesuan_list,
                        jiesuan_pageNum,
                    })
                } else {
                    this.setData({
                        isnomore: true,
                    })
                }
            })
    },




})