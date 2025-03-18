const db = wx.cloud.database()
var utils_time = require('../../../utils/time.js')

Page({

    data: {
        isOpen_shouye0: false,
        isEdit: false,
        isAdmin: false,
        input_list: [],
        qitaResdata: [],
        pageNum: 1,
        isGengDuo:false,
    },


    toAdd_qita(e) {
        var qitaResdata = this.data.qitaResdata
        var addqita_id = qitaResdata.length
        var nickName = wx.getStorageSync('userinfo').nickName
        var xd_time = utils_time.formatTime(new Date())
        qitaResdata[addqita_id] = {
            choose_list: [{
                "choose_items_list": [
                    "",
                    "",
                ],
                "choose_text": "",
                "choose_title": ""
            }],
            input_list: [{
                "input_text": "",
                "input_title": ""
            }, ],
            nickName,
            text_qita: {
                "text_list": [
                    "",
                ],
                "text_title": '版块' + (addqita_id + 1) + ",标题在详情中编辑后同步至主页"
            },
            xd_time,
            zhifu: {
                "choose_price": 0,
                "choose_text": "",
                "isOpen_zhifu": true,
                "price_list": [
                    "",
                    "",
                ],
                "text_list": [
                    "",
                    "",
                ],
                "zhifu_title": ""
            },
            isOpen_qita: false,
        }
        db.collection('banner_qita').add({
            data: qitaResdata[addqita_id]
        }).then(res => {
            console.log(res._id, '新增其他设置信息成功');
            qitaResdata[addqita_id]._id = res._id
            this.setData({
                qitaResdata,
            })
            wx.showToast({
                title: '添加成功',
                icon: 'none'
            })
        })
    },
    todel_qita(e) {
        var del_index = e.currentTarget.dataset.index
        var qitaResdata = this.data.qitaResdata
        var _id = qitaResdata[del_index]._id
        qitaResdata.splice(del_index, 1)
        var that = this
        wx.showModal({
            title: '提示',
            content: '确定删除吗？',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    wx.showLoading()
                    wx.cloud.callFunction({
                        name: 'banner',
                        data: {
                            _id,
                            action: 'banner_qita_del'
                        }
                    }).then(res => {
                        console.log(res.result.stats);
                        that.setData({
                            qitaResdata
                        })
                        wx.showToast({
                            title: '删除成功',
                            icon: 'none'
                        })

                    })


                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },

    toAdd_input(e) {
        // console.log(e,'添加input');
        var input_list = this.data.input_list
        var addinput_id = input_list.length
        input_list[addinput_id] = {
            title: '',
            url: '',
            token: '',
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
    onInput_title(e) {
        var input_list = this.data.input_list
        var index = e.currentTarget.dataset.index
        input_list[index].title = e.detail.value,
            this.setData({
                input_list,
            })
    },
    onInput_url(e) {
        console.log(e);
        var input_list = this.data.input_list
        var index = e.currentTarget.dataset.index
        var url_jsj = e.detail.value
        var token_0 = url_jsj.slice(21, url_jsj.length)

        // input_list[index].title = url_jsj
        input_list[index].url = url_jsj
        input_list[index].token = token_0.slice(token_0.indexOf('/') + 1, token_0.length)
        this.setData({
            input_list
        })
    },
    // 对象变数组
    objtoarr(dictObject) {
        var createArr = []
        for (let i in dictObject) {
            createArr.push(dictObject[i]);
        }
        return createArr
    },
    onEdit_start() {
        this.setData({
            isEdit: true
        })
    },
    onEdit_end() {
        this.setData({
            isEdit: false
        })
    },
    // onEdit_end(e) {
    //     this.setData({
    //         isEdit: false
    //     })
    //     wx.showLoading({
    //         title: '上传中..',
    //     })
    //     console.log(e.detail.value);
    //     var xd_time = utils_time.formatTime(new Date())
    //     var submitData = e.detail.value
    //     var input_shouye0 = this.data.input_shouye0
    //     var input_list = this.data.input_list
    //     var isOpen_shouye0 = this.data.isOpen_shouye0

    //     var submitData_arr = this.objtoarr(submitData)
    //     console.log(submitData_arr);

    //     input_shouye0 = submitData_arr[1]
    //     isOpen_shouye0 = submitData_arr[0]
    //     for (let index = 0; index < input_list.length; index++) {
    //         input_list[index].title = submitData_arr[index * 3 + 2]
    //         input_list[index].url = submitData_arr[index * 3 + 3]
    //         input_list[index].token = submitData_arr[index * 3 + 4]
    //         // console.log(element);
    //     }

    //     this.setData({
    //         isOpen_shouye0,
    //         input_shouye0,
    //         input_list,
    //     })
    //     var nickName = wx.getStorageSync('userinfo').nickName

    //     wx.cloud.callFunction({
    //         name: 'banner',
    //         data: {
    //             qita_data: {
    //                 xd_time,
    //                 nickName,
    //                 isOpen_shouye0,
    //                 input_shouye0,
    //                 input_list,
    //             },
    //             _id,
    //             action: 'banner_qita'
    //         }
    //     }).then(res => {
    //         console.log(res.result.stats);
    //         wx.showToast({
    //             title: '上传成功',
    //             icon: 'none'
    //         })
    //     })


    //     // wx.cloud.callFunction({
    //     //     name: 'banner',
    //     //     data: {
    //     //         qita_data: {
    //     //             xd_time,
    //     //             nickName,
    //     //             isOpen_shouye0,
    //     //             input_shouye0,
    //     //             input_list,
    //     //         },
    //     //         action: 'qita'
    //     //     }
    //     // }).then(res => {
    //     //     console.log(res.result.stats);
    //     //     wx.showToast({
    //     //         title: '上传成功',
    //     //         icon: 'none'
    //     //     })
    //     // })

    // },
    toCheck_zhifu(e) {
        wx.showLoading({
            title: '变更中..',
        })
        var xd_time = utils_time.formatTime(new Date())
        var index = e.currentTarget.dataset.index
        var isOpen_qita = !e.currentTarget.dataset.isopenqita
        var qitaResdata = this.data.qitaResdata
        var _id = qitaResdata[index]._id
        qitaResdata[index].isOpen_qita = isOpen_qita
        wx.cloud.callFunction({
            name: 'banner',
            data: {
                qita_data: {
                    xd_time,
                    isOpen_qita,
                },
                _id,
                action: 'banner_qita'
            }
        }).then(res => {
            console.log(res.result.stats);
            this.setData({
                qitaResdata,
            })
            if (isOpen_qita) {
                wx.showToast({
                    title: '开启成功',
                    icon: 'none'
                })
            } else {
                wx.showToast({
                    title: '已关闭',
                    icon: 'none'
                })

            }
        })
    },

    // toDetail_qita: function () {

    //     wx.navigateTo({
    //         url: '../qita/detail_qita/detail_qita',
    //     })
    // },
    toDetail_qita(e) {
        var _id = e.currentTarget.dataset.id
        var isEdit = this.data.isEdit
        wx.navigateTo({
            url: '../qita/detail_qita/detail_qita?_id=' + _id + '&isEdit=' + isEdit,
        })
    },
    toDetail_qita_close() {
        wx.showToast({
            title: '暂未启用',
            icon: 'none'
        })
    },
    toJinshuju: function (e) {
        var index = e.currentTarget.dataset.index
        var input_list = this.data.input_list
        var url_jsj = input_list[index].url
        var token_jsj = input_list[index].token
        var title_jsj = input_list[index].title
        wx.navigateTo({
            url: '../../gd-component/gd-component?' +
                'url_jsj=' + url_jsj +
                '&title_jsj=' + title_jsj +
                '&token_jsj=' + token_jsj,
        })
    },


    onLoad: function (options) {

        // db.collection('banner').doc('qita0001').get().then(res => {
        //         console.log(res.data, '后台其他版块设置下载');
        //         // var qitaResdata = res.data
        //         var isOpen_shouye0 = res.data.isOpen_shouye0
        //         var input_shouye0 = res.data.input_shouye0
        //         var input_list = res.data.input_list
        //         this.setData({
        //             // qitaResdata,
        //             isOpen_shouye0,
        //             input_shouye0,
        //             input_list,
        //         })
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        // 管理员登陆
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
        this.setData({isEdit:false})
        
        db.collection('banner_qita').where({}).get().then(res => {
                console.log(res.data, '后台其他版块设置下载');
                var qitaResdata = res.data
                // var isOpen_shouye0 = res.data.isOpen_shouye0
                // var input_shouye0 = res.data.input_shouye0
                // var input_list = res.data.input_list
                this.setData({
                    qitaResdata,
                    // isOpen_shouye0,
                    // input_shouye0,
                    // input_list,
                })
            })
            .catch(err => {
                console.log(err);
            })
    },


    onHide: function () {

    },


    onUnload: function () {

    },


    onPullDownRefresh: function () {

    },


    onReachBottom: function () {
        var pageNum = this.data.pageNum + 1
        var qitaResdata = this.data.qitaResdata
        wx.showLoading({})
        db.collection('banner_qita').where({})
        //   .orderBy('xd_time', 'desc')
          .skip((pageNum - 1) * 20)
          .get() //获取根据查询条件筛选后的集合数据  
          .then(res => {
            if (res.data.length == 0) {
              this.setData({
                isGengDuo: true,
              })
              wx.hideLoading()
                
            } else {
              res.data.forEach(element => {
                qitaResdata.push(element)
              });
              wx.hideLoading()
              console.log('触底下载第' + pageNum + '页：', qitaResdata)
              this.setData({
                qitaResdata,
                pageNum,
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
    },


    onShareAppMessage: function () {

    }
})