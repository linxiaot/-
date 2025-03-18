// pages/xuanzq/xuanzq.js
// var dateStart= this.data.date1+ ' ' +this.data.time1
var utils_time = require('../../utils/time.js') //获取时间等
var nowDate = utils_time.formatnianyueri(new Date())
var yesterday = utils_time.formatnianyueriYesterday(new Date())
const db = wx.cloud.database()
const _ = db.command
var time14 = '14:00'
var time18 = '18:00'
Page({

  data: {
    change_dd_Status_together: true,

    isShengxu_ddwh: true,
    isShengxu_qhm: true,
    isShengxu_shj: true,
    isShow_loudong: false,
    isSearchlist_daiqu: false,

    isQita_bankuai: false,
    choose_list: [],
    input_list: [],

    isQuanxuan_jj: false,
    searchlist_jijian: [],
    go_jijian_list: [],

    val_input_daiqu: '',
    isQuanxuan_dq: false,
    searchlist_daiqu: [],
    go_daiqu_list: [],
    xuanze_num_dq: 0,
    beizhu_index: 0,
    beizhu_tuisong: '可发送20个可汉字、数字、字母或符号组合',
    xiaoxi_list: [],
    beizhu_index_quxiao: 0,
    beizhu_tuisong_quxiao: '可发送20个可汉字、数字、字母或符号组合',
    xiaoxi_list_quxiao: [],
    isQuxiao: false,
    isSongda: false,
    isQujian: true,
    go_tuikuan_list_0_qx: [],
    go_tuikuan_list_qx: [],
    gongnengList: [{
      text: '取件中',
      checked: true
    }, {
      text: '送达',
      checked: false
    }, {
      text: '取消',
      checked: false

    }],

    isDuanxin: false,
    duanxin_list: [],
    tuikuan_pageNum: 1,
    searchlist_tuikuan_jilu: [],
    tuikuanList_jilu: [],
    tuikuanList_jilu_all: [],
    tuikuanList_jilu_jutui: [],
    tuikuanList_jilu_tuikuan: [],
    shaixuan_namelist_tuikuan: [{
        text: '全部',
        val: false,
        checked: true,
      },
      {
        text: '已退款',
        val: false,
        checked: false,
      },
      {
        text: '已拒绝',
        val: true,
        checked: false,
      },
    ],
    isTuikuan_jilu: false,
    isTuikuan_shenqing: true,
    isnomore: true,
    tixian_pageNum: 1,
    // inputVal_tixian: '',
    shaixuan_namelist: [{
        text: '全部',
        val: false,
        checked: true,
      },
      {
        text: '未提现',
        val: false,
        checked: false,
      },
      {
        text: '已提现',
        val: true,
        checked: false,
      },
    ],
    isTixian: false,
    isUrl_all: true,
    tixian_list: [],
    searchlist_tixian: [],
    val_appid: 'wxaad7b42349d83506',

    isKebiao: false,
    // tuikuanList: [],
    go_paotui_list: [],
    searchlist_paotui: [],
    xuanze_num_pt: 0,
    isQuanxuan_pt: false,

    searchlist_tuikuan: [],
    xuanze_num: 0,
    isQuanxuan: false,
    tuikuanList: [],
    go_tuikuan_list: [],
    go_tuikuan_list_0: [], //没有用微信支付的

    bannerOpen_shouye: true,
    bannerOpen_shouye_ad: false,
    inputVal: '',
    chaxunList: [],
    chaxunList_beixuan: [],
    pageNum: 1,
    url: '',
    dateStart: '',
    dateEnd: '',
    // date1: '--日期--',
    date2: nowDate,
    time1: time18,
    date1: yesterday,
    time2: time14,
    isChaxun_Daiqu: true,
    showLoading: false,
    isAdmin: false,
    isDaiqu: true,
    isCountDaiqu: true,
    isJijian: false,
    isQita: false,
    dingyue_total: 0,

    value_shxuanlist: [],
    value_shxuanlist2: [],
    chaxunList_shxuan_kd_Dian: [],
    chaxunList_shxuan_sd_Didian: [],
    sd_DidianList: [{
        name: '西湖',
      },
      {
        name: '琴湖',
      },
      {
        name: '金翰林',
      },
      {
        name: '南苑',
      },
      {
        name: '北苑',
      },
      {
        name: '兴湘',
      },
      {
        name: '北青及中兴',
      },
      {
        name: '湘大南门',
      },
      {
        name: '一教区',
      },
      {
        name: '二教区',
      },
      {
        name: '三教区',
      },
      {
        name: '环保及法学',
      },
      {
        name: '化学化工',
      },
      {
        name: '其他',
      }
    ],
    loudong_list: [{
        name: '1-栋',
      },
      {
        name: '2-栋',
      },
      {
        name: '3-栋',
      },
      {
        name: '4-栋',
      },
      {
        name: '5-栋',
      },
      {
        name: '6-栋',
      },
      {
        name: '7-栋',
      },
      {
        name: '8-栋',
      },
      {
        name: '9-栋',
      },
      {
        name: '10-栋',
      },
      {
        name: '11-栋',
      },
      {
        name: '12-栋',
      },
      {
        name: '13-栋',
      },
      {
        name: '14-栋',
      },
      {
        name: '15-栋',
      },
      {
        name: '16-栋',
      },
      {
        name: '17-栋',
      },
      {
        name: '18-栋',
      }
    ],
    kd_DianList: [{
        name: '中通',
      },
      {
        name: '顺丰',
      },
      {
        name: '京东',
      },
      {
        name: '邮政',
      },
      {
        name: '琴湖',
      }
    ],
    isBanner: false,
    isTuikuan: false,
    isPaotui: false,

    imagesUrlList: [],
    imagesUrlList1: [],
    imagesUrlList2: [],

    nameList: [{
      text: '首页及墙',
      checked: true
    }, {
      text: '美食首页'
    }],

    screenHeight: 0,
    isShow_dianpu: false,
    bannerIndex: 0,
    tksuccess: false,
    tkfail: false,
    dingdanhao: '',

    pages: 1,
    pageNum800: 1,
    meiyeNum: 700

  },

  qiehuanyemian(e) {
    // console.log('onReachBottom触底', e);
    var {
      actionye
    } = e.currentTarget.dataset
    var {
      pageNum800,
      pages,
    } = this.data

    console.log('istoday 翻页');
    if (actionye == '上一页') {
      if (pageNum800 == 1) {
        console.log('已经是第一页了');
        return
      }
      pageNum800 -= 1
    } else { //下一页
      pageNum800 += 1
    }
    console.log(`总${pages}当前第${pageNum800}页`);
    if (pageNum800 <= pages) {
      // this.getSongda(pageNum800)
      this.setData({
        pageNum800,
      })
      this.toChaxun1_new()
      // } else if (pageNum800 == pages) {
      //   // this.getSongda(pageNum800)
      //   this.setData({
      //     pageNum800,
      //   })
      //   this.toChaxun1_new()

    } else {
      // this.showMessage('全部加载完毕，无更多数据。')
      wx.showToast({
        title: '无更多数据',
        icon: "none"
      })
    }
  },



  async chaxunFukuan(e) {
    // 查询订单 付款情况
    // F20231116134737170011365796875
    // F20231118172632170029959258759
    console.log(e.detail.value);
    var {
      dingdanhao
    } = e.detail.value
    if (dingdanhao == '') {
      wx.showToast({
        title: '订单号不能为空',
        icon: "error"
      })
      return
    }
    var res = await wx.cloud.callFunction({
      name: 'apaytuikuan',
      data: {
        action: 'chaxundingdan',
        dingdanhao,
      }
    })
    console.log('chaxundingdan查询订单 付款 情况', res.result);
    if (res.result.resultCode == "SUCCESS") {
      this.setData({
        tkfail: false,
        tksuccess: true,
        dingdanhao
      })

      // wx.showToast({
      //   title: '订单已退款',
      //   icon:"none"
      // })
    } else {
      this.setData({
        tkfail: true,
        tksuccess: false,
        dingdanhao
      })
    }
  },

  // 查询订单退款情况
  async chaxunTuikuan(e) {
    // F20231116134737170011365796875
    // F20231118172632170029959258759
    console.log(e.detail.value);
    var {
      dingdanhao
    } = e.detail.value
    if (dingdanhao == '') {
      wx.showToast({
        title: '订单号不能为空',
        icon: "error"
      })
      return
    }
    var res = await wx.cloud.callFunction({
      name: 'apaytuikuan',
      data: {
        action: 'chaxuntuikuan',
        dingdanhao,
      }
    })
    console.log('chaxundingdan查询订单退款情况', res.result);
    if (res.result.resultCode == "SUCCESS") {
      this.setData({
        tkfail: false,
        tksuccess: true,
        dingdanhao
      })

      // wx.showToast({
      //   title: '订单已退款',
      //   icon:"none"
      // })
    } else {
      this.setData({
        tkfail: true,
        tksuccess: false,
        dingdanhao
      })
    }
  },

  clearInput_daiqu() {
    this.setData({
      searchlist_daiqu: [],
      go_daiqu_list: [],
      val_input_daiqu: '',
      isSearchlist_daiqu: false,
      isQuanxuan_dq: false,
    })
  },

  // 取消订单及取消原因
  quxiao() {
    this.setData({
      isQuxiao: true
    })
  },
  songda() {
    this.setData({
      isQuxiao: false
    })
  },

  toUpdate_fasong_quxiao() {
    var xiaoxi_list_quxiao = this.data.xiaoxi_list_quxiao
    var beizhu_index_quxiao = this.data.beizhu_index_quxiao
    var beizhu_tuisong_quxiao = this.data.beizhu_tuisong_quxiao
    xiaoxi_list_quxiao[beizhu_index_quxiao] = beizhu_tuisong_quxiao
    wx.showLoading()
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          action: 'updateDatas',
          tableName: 'banner',
          id: 'toptipsdaiqu',
          datas: {
            xiaoxi_list_quxiao: xiaoxi_list_quxiao,
          }
        },
      })
      .then(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        this.setData({
          xiaoxi_list_quxiao,
        })
        console.log('取消订单原因 更新 成功几条：', res.result.stats.updated)
      })
      .catch(err => {
        console.log('取消订单原因 更新 失败：', err)
      })
  },
  tochooseMes_quxiao() {
    var that = this
    var xiaoxi_list_quxiao = this.data.xiaoxi_list_quxiao
    wx.showActionSheet({
      itemList: xiaoxi_list_quxiao,
      success(res) {
        console.log(res.tapIndex)
        var beizhu_tuisong_quxiao = xiaoxi_list_quxiao[res.tapIndex]
        that.setData({
          beizhu_tuisong_quxiao,
          beizhu_index_quxiao: res.tapIndex,
        })
        wx.setStorageSync('beizhu_tuisong_quxiao', beizhu_tuisong_quxiao)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  // ok1Nu5LdvbNEnZR4cfzsK6pUFxA4

  // ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4

  // toSend_quxiao() {
  //   var go_daiqu_list = this.data.go_daiqu_list
  //   var chaxunList = this.data.chaxunList
  //   var chaxunList_beixuan = this.data.chaxunList_beixuan
  //   var searchlist_daiqu = this.data.searchlist_daiqu
  //   if (this.data.beizhu_tuisong_quxiao == '') {
  //     wx.showToast({
  //       title: '消息不能为空',
  //       icon: 'none'
  //     })
  //     return
  //   }
  //   var beizhu_tuisong_quxiao = this.data.beizhu_tuisong_quxiao.slice(0, 20)
  //   var gx_time = utils_time.formatTime(new Date())

  //   if (go_daiqu_list.length == 0) {
  //     wx.showToast({
  //       title: '选择为空',
  //       icon: 'none',
  //     })
  //   } else {
  //     var that = this
  //     wx.showModal({
  //       title: '提示',
  //       content: '确定取消订单吗？',
  //       success(res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           wx.showLoading({
  //             title: '提交中..',
  //           })
  //           // var idArr = []
  //           // var openidArr = []
  //           // go_daiqu_list.forEach(element => {
  //           //   idArr.push(element._id)
  //           //   openidArr.push(element._openid)
  //           // });
  //           wx.cloud.callFunction({
  //               name: 'changedata',
  //               data: {
  //                 // action: 'changeStatus_daiqu',
  //                 action: 'changeStatus_daiqu_new',
  //                 changeData: {
  //                   // dd_Status: '3',// 已送达
  //                   dd_Status: '3',// 已取消 去退款
  //                   collection_name: 'daiqu',
  //                   gx_time,
  //                   // idArr,
  //                   // openidArr,
  //                   go_daiqu_list,
  //                   beizhu_tuisong_quxiao,
  //                 }
  //               }
  //             })
  //             .then(res => {
  //               console.log('提交成功：：', res);
  //               wx.showToast({
  //                 icon: 'none',
  //                 title: '发送成功',
  //               })
  //               chaxunList = that.searchDel(go_daiqu_list, chaxunList)
  //               chaxunList_beixuan = that.searchDel(go_daiqu_list, chaxunList_beixuan)
  //               searchlist_daiqu = that.searchDel(go_daiqu_list, searchlist_daiqu)
  //               that.setData({
  //                 go_daiqu_list: [],
  //                 chaxunList,
  //                 chaxunList_beixuan,
  //                 searchlist_daiqu,
  //                 isQuanxuan_dq: false,

  //               })

  //             })
  //             .catch(err => {
  //               console.log(err);
  //               wx.hideLoading({})
  //             })

  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  // },

  // 取消订单
  goTuikuan_quxiao() {
    console.log('取消订单');
    var go_daiqu_list = this.data.go_daiqu_list
    var chaxunList = this.data.chaxunList
    var chaxunList_beixuan = this.data.chaxunList_beixuan
    var searchlist_daiqu = this.data.searchlist_daiqu

    var beizhu_tuisong_quxiao = this.data.beizhu_tuisong_quxiao
    var go_tuikuan_list_0_qx = this.data.go_tuikuan_list_0_qx
    var go_tuikuan_list_qx = this.data.go_tuikuan_list_qx

    var xd_time = utils_time.formatTime(new Date())
    // var timeout = (go_tuikuan_list_qx.length + go_tuikuan_list_0_qx.length) * 500
    // if (timeout < 1) {
    //   timeout = 1
    // }
    if (beizhu_tuisong_quxiao == '' || beizhu_tuisong_quxiao == ' ') {
      wx.showToast({
        title: '取消原因为空',
        icon: 'none',
      })
      return
    }
    if (go_tuikuan_list_qx.length == 0 && go_tuikuan_list_0_qx.length == 0) {
      wx.showToast({
        title: '选择为空',
        icon: 'none',
      })
    } else {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确认取消并退款吗？',
        success(res) {
          if (res.confirm) {

            console.log('用户点击确定')
            wx.showLoading({
              title: '退款中..',
            })
            wx.cloud.callFunction({
                name: 'apaytuikuan',
                data: {
                  go_tuikuan_list: go_tuikuan_list_qx,
                  go_tuikuan_list_0: go_tuikuan_list_0_qx,
                  xd_time,
                  action: 'quxiaodingdan',
                  beizhu_tuisong_quxiao,
                }
              })
              .then(res => {
                console.log('退款成功：：', res);

                wx.showToast({
                  icon: 'none',
                  title: '退款完成',
                })

                chaxunList = that.searchDel(go_daiqu_list, chaxunList)
                chaxunList_beixuan = that.searchDel(go_daiqu_list, chaxunList_beixuan)
                searchlist_daiqu = that.searchDel(go_daiqu_list, searchlist_daiqu)
                that.setData({
                  go_daiqu_list: [],
                  go_tuikuan_list_qx: [],
                  go_tuikuan_list_0_qx: [],
                  chaxunList,
                  chaxunList_beixuan,
                  searchlist_daiqu,
                  isQuanxuan_dq: false,

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
    }
  },


  // // 代取快递订单 退款
  // toShenqing_tuikuan() { 
  //   var dingdanhao = this.data.dingdanhao
  //   var daiqu_id = this.data._id

  //   var kd_Name = this.data.kd_Name
  //   var kd_PhoNum = this.data.kd_PhoNum
  //   var qh_Ma = this.data.qh_Ma
  //   var sd_Didian = this.data.sd_Didian
  //   var xd_time = this.data.xd_time
  //   var yizhifu = this.data.yizhifu
  //   var refund_fee = this.data.yizhifu
  //   var yizhifu_fengmi = this.data.yizhifu_fengmi
  //   var yizhifu_jifen = this.data.yizhifu_jifen
  //   var dingdan_money = this.data.dingdan_money
  //   var value_tkyy = this.data.value_tkyy
  //   if (value_tkyy == '') {
  //     wx.showToast({
  //       title: '请选择原因',
  //       icon:'none'
  //     })
  //     return
  //   }

  //   var user_id = wx.getStorageSync('id')
  //   var tk_time = utils_time.formatTime(new Date())
  //   var that = this
  //   this.toClose_tuikuan()
  //   wx.showModal({
  //     title: '退款',
  //     content: '提交后将取消订单',
  //     success(res) {
  //       if (res.confirm) {
  //         that.setData({tuikuanShow:false})//隐藏退款按钮
  //         console.log('用户点击确定')
  //         var templateId = 'm0LiKsNOZMH1b8QKUqAioeACYUp4G7yiCwIM-q1C6_Q' //退款结果通知
  //         wx.requestSubscribeMessage({
  //             tmplIds: [templateId],
  //           })
  //           .then(res => {
  //             console.log('用户点击订阅退款结果通知：', res);
  //             if (yizhifu !== 0) {
  //               // 提交退款申请单
  //               wx.showLoading({
  //                 title: '发起退款'
  //               })
  //               wx.cloud.callFunction({
  //                   name: 'apaytuikuan',
  //                   data: {
  //                     dingdanhao,
  //                     action: 'chaxundingdan'
  //                   },
  //                 })
  //                 .then(res => {
  //                   console.log('【云函数】 chaxundingdan 成功', res);
  //                   var tuikuandanhao = res.result.transactionId
  //                   db.collection('tuikuan') //提交退款订单
  //                     .add({
  //                       data: {
  //                         daiqu_id, //原始订单的_id
  //                         kd_Name,
  //                         kd_PhoNum,
  //                         qh_Ma,
  //                         sd_Didian,

  //                         xd_time,
  //                         tk_time,
  //                         isYunxu_tuikuan: false,

  //                         dingdanhao,
  //                         tuikuandanhao,
  //                         yizhifu,
  //                         refund_fee,
  //                         yizhifu_fengmi,
  //                         yizhifu_jifen,
  //                         dingdan_money,
  //                         user_id,
  //                         value_tkyy,
  //                       }
  //                     })
  //                     .then(res => {
  //                       console.log('退款申请提交成功：：', res);
  //                       //改变订单状态
  //                       db.collection('daiqu').doc(daiqu_id)
  //                         .update({
  //                           data: {
  //                             dd_Status: '4'
  //                           }
  //                         })
  //                         .then(res => {
  //                           console.log('改变状态4，退款中：：', res);
  //                           wx.cloud.callFunction({
  //                               name: 'tuisongxiadannew',
  //                               data: {
  //                                 isTuikuan_daiqu: true,
  //                                 qh_Ma,
  //                                 sd_Didian,
  //                                 kd_Name,
  //                                 kd_PhoNum,
  //                               }
  //                             })
  //                             .then(res => {
  //                               console.log('退款通知成功', res);
  //                             })
  //                           wx.showToast({
  //                             icon: 'none',
  //                             title: '退款已申请',
  //                           })
  //                           setTimeout(() => {
  //                             that.returnPre() // 返回页面传参 点击刷新

  //                           }, 1000);
  //                         })
  //                         .catch(err => {
  //                           console.log(err)
  //                         })
  //                     })
  //                     .catch(err => {
  //                       console.log(err)
  //                     })


  //                 })
  //                 .catch(err => {
  //                   console.log('【云函数】 chaxundingdan 失败', err)
  //                 })

  //             } else if (yizhifu == 0) { // 支付的金额为零 直接取消订单
  //               db.collection('tuikuan') //提交退款订单
  //                 .add({
  //                   data: {
  //                     daiqu_id, //原始订单的_id
  //                     kd_Name,
  //                     kd_PhoNum,
  //                     qh_Ma,
  //                     sd_Didian,

  //                     xd_time,
  //                     tk_time,
  //                     isYunxu_tuikuan: false,

  //                     dingdanhao,
  //                     tuikuandanhao: '',
  //                     yizhifu,
  //                     refund_fee,
  //                     yizhifu_fengmi,
  //                     yizhifu_jifen,
  //                     dingdan_money,
  //                     user_id,
  //                     value_tkyy,
  //                   }
  //                 })
  //                 .then(res => {
  //                   console.log('退款申请提交成功：：', res);
  //                   //改变订单状态
  //                   db.collection('daiqu').doc(daiqu_id)
  //                     .update({
  //                       data: {
  //                         dd_Status: '4'
  //                       }
  //                     })
  //                     .then(res => {
  //                       console.log('改变状态4，退款中：：', res);
  //                       wx.cloud.callFunction({
  //                           name: 'tuisongxiadannew',
  //                           data: {
  //                             isTuikuan_daiqu: true,
  //                             qh_Ma,
  //                             sd_Didian,
  //                             kd_Name,
  //                             kd_PhoNum,
  //                           }
  //                         })
  //                         .then(res => {
  //                           console.log('退款通知成功', res);
  //                         })
  //                       wx.showToast({
  //                         icon: 'none',
  //                         title: '订单已取消',
  //                       })
  //                       setTimeout(() => {
  //                         that.returnPre() // 返回页面传参 点击刷新

  //                       }, 1000);
  //                     })
  //                     .catch(err => {
  //                       console.log(err)
  //                     })
  //                 })
  //                 .catch(err => {
  //                   console.log(err)
  //                 })


  //             }
  //           })
  //           .catch(err => {
  //             console.log('订阅退款消息失败', err);
  //           })

  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //         that.toShow_tuikuan()
  //       }
  //     }
  //   })
  // },



  // 订单送达及消息发送

  toUpdate_fasong() {
    var xiaoxi_list = this.data.xiaoxi_list
    var beizhu_index = this.data.beizhu_index
    var beizhu_tuisong = this.data.beizhu_tuisong
    xiaoxi_list[beizhu_index] = beizhu_tuisong
    wx.showLoading()
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          action: 'fasong_beizhu',
          xiaoxi_list,
        },
      })
      .then(res => {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        this.setData({
          xiaoxi_list,
        })
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })
  },
  tochooseMes() {
    var that = this
    var xiaoxi_list = this.data.xiaoxi_list
    wx.showActionSheet({
      itemList: xiaoxi_list,
      success(res) {
        console.log(res.tapIndex)
        var beizhu_tuisong = xiaoxi_list[res.tapIndex]
        that.setData({
          beizhu_tuisong,
          beizhu_index: res.tapIndex,
        })
        wx.setStorageSync('beizhu_tuisong', beizhu_tuisong)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  searchDel(go_daiqu_list, chaxunList) {
    if (go_daiqu_list.length !== chaxunList.length) {
      go_daiqu_list.forEach(element => {
        chaxunList.forEach((element2, index) => {
          if (element._id == element2._id) {
            chaxunList.splice(index, 1)
          }
        });
      });
      console.log();
      return chaxunList
    }
    return []

  },
  searchUpdate(go_daiqu_list, chaxunList) {
    var chaxunList_new = []
    chaxunList.forEach((element2, index) => {
      go_daiqu_list.forEach(element => {
        if (element._id == element2._id) {
          // chaxunList.splice(index, 1)
          element2.dd_Status = '2' // 变更订单状态取件中
          element2.checked = false
        }
      });
      chaxunList_new.push(element2)
    });
    // console.log();
    return chaxunList_new
  },

  // 取件中
  toQujian() {
    var change_dd_Status_together = this.data.change_dd_Status_together
    var go_daiqu_list = this.data.go_daiqu_list
    var chaxunList = this.data.chaxunList
    var chaxunList_beixuan = this.data.chaxunList_beixuan
    var searchlist_daiqu = this.data.searchlist_daiqu
    
    // 如果复制下载链接后，同时变更所有订单的状态为取件中，则go_daiqu_list为所有订单chaxunList_beixuan
    if (change_dd_Status_together){
      go_daiqu_list = chaxunList_beixuan
    }

    var gx_time = utils_time.formatTime(new Date())

    if (go_daiqu_list.length == 0) {
      wx.showToast({
        title: '选择为空',
        icon: 'none',
      })
    } else {
      // 对 go_daiqu_list 待处理列表进行筛选 剔除已经取件中的订单
      var go_daiqu_list_new = []
      go_daiqu_list.forEach(element => {
        if (element.dd_Status !== '2') {
          go_daiqu_list_new.push(element)
        }
      });
      console.log('筛选后的go_daiqu_list_new', go_daiqu_list_new);

      var that = this
      wx.showModal({
        title: '提示',
        content: '确定变更为取件中吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '变更中..',
            })

            if (go_daiqu_list_new.length !== 0) {
              wx.cloud.callFunction({
                  name: 'changedata',
                  data: {
                    action: 'changeStatus_daiqu_qujianzhong',
                    changeData: {
                      dd_Status: '2', //取件中 用户无法申请退款
                      collection_name: 'daiqu',
                      gx_time,
                      go_daiqu_list: go_daiqu_list_new,
                    }
                  }
                })
                .then(res => {
                  console.log('提交成功：：', res);
                  wx.showToast({
                    icon: 'none',
                    title: '变更成功',
                  })
                  // 变更之后更新订单状态
                  chaxunList = that.searchUpdate(go_daiqu_list, chaxunList)
                  chaxunList_beixuan = that.searchUpdate(go_daiqu_list, chaxunList_beixuan)
                  searchlist_daiqu = that.searchUpdate(go_daiqu_list, searchlist_daiqu)
                  that.setData({
                    go_daiqu_list: [],
                    go_tuikuan_list_qx: [],
                    go_tuikuan_list_0_qx: [],
                    chaxunList,
                    chaxunList_beixuan,
                    searchlist_daiqu,
                    isQuanxuan_dq: false,

                  })

                })
                .catch(err => {
                  console.log(err);
                  wx.hideLoading({})
                })
            } else {
              console.log('已选订单中没有要变成取件中的订单');
              chaxunList = that.searchUpdate(go_daiqu_list, chaxunList)
              chaxunList_beixuan = that.searchUpdate(go_daiqu_list, chaxunList_beixuan)
              searchlist_daiqu = that.searchUpdate(go_daiqu_list, searchlist_daiqu)
              that.setData({
                go_daiqu_list: [],
                go_tuikuan_list_qx: [],
                go_tuikuan_list_0_qx: [],
                chaxunList,
                chaxunList_beixuan,
                searchlist_daiqu,
                isQuanxuan_dq: false,

              })
              wx.showToast({
                icon: 'none',
                title: '无需变更',
              })
            }


          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })


    }
  },

  // 发送消息 
  toSend() {
    var go_daiqu_list = this.data.go_daiqu_list
    var chaxunList = this.data.chaxunList
    var chaxunList_beixuan = this.data.chaxunList_beixuan
    var searchlist_daiqu = this.data.searchlist_daiqu
    if (this.data.beizhu_tuisong == '') {
      wx.showToast({
        title: '消息不能为空',
        icon: 'none'
      })
      return
    }
    var beizhu_tuisong = this.data.beizhu_tuisong.slice(0, 20)
    var gx_time = utils_time.formatTime(new Date())

    if (go_daiqu_list.length == 0) {
      wx.showToast({
        title: '选择为空',
        icon: 'none',
      })
    } else {
      var that = this
      wx.showModal({
        title: '提示',
        content: '发送消息吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '提交中..',
            })
            // var idArr = []
            // var openidArr = []
            // go_daiqu_list.forEach(element => {
            //   idArr.push(element._id)
            //   openidArr.push(element._openid)
            // });
            wx.cloud.callFunction({
                name: 'changedata',
                data: {
                  // action: 'changeStatus_daiqu',
                  action: 'changeStatus_daiqu_new',
                  changeData: {
                    dd_Status: '3',
                    collection_name: 'daiqu',
                    gx_time,
                    // idArr,
                    // openidArr,
                    go_daiqu_list,
                    beizhu_tuisong,
                  }
                }
              })
              .then(res => {
                console.log('送达提交成功：：', res);
                wx.showToast({
                  icon: 'none',
                  title: '发送成功',
                })
                chaxunList = that.searchDel(go_daiqu_list, chaxunList)
                chaxunList_beixuan = that.searchDel(go_daiqu_list, chaxunList_beixuan)
                searchlist_daiqu = that.searchDel(go_daiqu_list, searchlist_daiqu)
                that.setData({
                  go_daiqu_list: [],
                  go_tuikuan_list_qx: [],
                  go_tuikuan_list_0_qx: [],
                  chaxunList,
                  chaxunList_beixuan,
                  searchlist_daiqu,
                  isQuanxuan_dq: false,

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
    }
  },

  onInput_text(e) {
    console.log(e.currentTarget.dataset.index, '修改短信，index为');
    var index = e.currentTarget.dataset.index
    var duanxin_list = this.data.duanxin_list
    duanxin_list[index].text = e.detail.value;
    this.setData({
      duanxin_list,
    });
  },
  onInput_keyword1(e) {
    console.log(e.currentTarget.dataset.index, '修改短信，index为');
    var index = e.currentTarget.dataset.index
    var duanxin_list = this.data.duanxin_list
    duanxin_list[index].keyword1 = e.detail.value;
    this.setData({
      duanxin_list,
    });
  },
  onInput_keyword2(e) {
    console.log(e.currentTarget.dataset.index, '修改短信，index为');
    var index = e.currentTarget.dataset.index
    var duanxin_list = this.data.duanxin_list
    duanxin_list[index].keyword2 = e.detail.value;
    this.setData({
      duanxin_list,
    });
  },
  onInput_kd_Dian(e) {
    console.log(e.currentTarget.dataset.index, '修改短信，index为');
    var index = e.currentTarget.dataset.index
    var duanxin_list = this.data.duanxin_list
    duanxin_list[index].kd_Dian = e.detail.value;
    this.setData({
      duanxin_list,
    });
  },
  onInput_fasong_quxiao(e) {
    var beizhu_tuisong_quxiao = e.detail.value;

    this.setData({
      beizhu_tuisong_quxiao,

    });
  },
  onInput_fasong(e) {
    var beizhu_tuisong = e.detail.value;
    // var beizhu_index = this.data.beizhu_index
    // var xiaoxi_list = this.data.xiaoxi_list
    // xiaoxi_list[beizhu_index]= beizhu_tuisong
    this.setData({
      beizhu_tuisong,
      // xiaoxi_list
    });
  },
  onInput_starNum_word(e) {
    console.log(e.currentTarget.dataset.index, '修改短信，index为');
    var index = e.currentTarget.dataset.index
    var duanxin_list = this.data.duanxin_list
    duanxin_list[index].starNum_word = e.detail.value;
    this.setData({
      duanxin_list,
    });
  },
  onInput_endNum_word(e) {
    console.log(e.currentTarget.dataset.index, '修改短信，index为');
    var index = e.currentTarget.dataset.index
    var duanxin_list = this.data.duanxin_list
    duanxin_list[index].endNum_word = e.detail.value;
    this.setData({
      duanxin_list,
    });
  },
  onInput_numjia(e) {
    console.log(e, '修改短信');
    var index = e.currentTarget.dataset.index
    var duanxin_list = this.data.duanxin_list
    duanxin_list[index].numjia = Number(e.detail.value)
    this.setData({
      duanxin_list,
    });
  },
  onInput_numjian(e) {
    console.log(e, '修改短信');
    var index = e.currentTarget.dataset.index
    var duanxin_list = this.data.duanxin_list
    duanxin_list[index].numjian = Number(e.detail.value)
    this.setData({
      duanxin_list,
    });
  },
  toAdd_duanxin() {
    var duanxin_list = this.data.duanxin_list
    var add_id = duanxin_list.length
    duanxin_list[add_id] = {
      text: '',
      keyword1: '',
      keyword2: '',
      kd_Dian: '',
      starNum_word: '',
      endNum_word: '',
      numjia: 1,
      numjian: 0,
    }

    this.setData({
      duanxin_list,
    })

  },
  toDel_duanxin(e) {
    var duanxin_list = this.data.duanxin_list
    var index = e.currentTarget.dataset.index
    console.log(index, '删除');
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          duanxin_list.splice(index, 1)
          that.setData({
            duanxin_list,
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toBiangeng() {
    wx.showLoading({
      title: '变更中',
    })
    var duanxin_list = this.data.duanxin_list
    // let that = this
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          action: 'duanxin',
          duanxin_list,
        },
      })
      .then(res => {
        wx.showToast({
          title: '变更成功',
          icon: 'none'
        })
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })
  },


  resetSearch() {
    this.setData({
      input_tuikuan_jilu: ''
    })
  },
  toTuikuan_jilu() {
    var isTuikuan_jilu = this.data.isTuikuan_jilu
    this.setData({
      isTuikuan_jilu: !isTuikuan_jilu,
      isTuikuan_shenqing: false,
    })
    if (isTuikuan_jilu == false) {
      this.loadTuikuan_jilu()
    }
  },
  toTuikuan_shenqing() {
    var isTuikuan_shenqing = this.data.isTuikuan_shenqing
    this.setData({
      isTuikuan_shenqing: !isTuikuan_shenqing,
      isTuikuan_jilu: false,
    })
  },

  toShaixuan_tuikuan(e) { //全部 已退款 已拒绝
    var tuikuanList_jilu_all = this.data.tuikuanList_jilu_all
    var tuikuanList_jilu_tuikuan = this.data.tuikuanList_jilu_tuikuan
    var tuikuanList_jilu_jutui = this.data.tuikuanList_jilu_jutui
    var index = e.currentTarget.dataset.index
    var tuikuanList_jilu = []
    if (index == 0) {
      tuikuanList_jilu = tuikuanList_jilu_all
    } else if (index == 1) {
      tuikuanList_jilu = tuikuanList_jilu_tuikuan
    } else if (index == 2) {
      tuikuanList_jilu = tuikuanList_jilu_jutui
    }

    var shaixuan_namelist_tuikuan = this.data.shaixuan_namelist_tuikuan
    shaixuan_namelist_tuikuan.forEach((element, i) => {
      if (i == index) {
        element.checked = true
      } else {
        element.checked = false
      }
    });

    this.setData({
      tuikuanList_jilu,
      shaixuan_namelist_tuikuan,
      searchlist_tuikuan_jilu: [],
    })
  },
  toShaixuan(e) { //全部 未提现 已提现
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    // console.log(item.text, 'inputVal_tixian');
    var shaixuan_namelist = this.data.shaixuan_namelist
    shaixuan_namelist.forEach((element, i) => {
      if (i == index) {
        element.checked = true
      } else {
        element.checked = false
      }
    });

    var searchlist_tixian = []
    var tixian_list = this.data.tixian_list
    if (index !== 0) {
      tixian_list.forEach(element => {
        if (element.isJiesuan == item.val) {
          searchlist_tixian.push(element)
        }
      });
    }
    this.setData({
      searchlist_tixian,
      shaixuan_namelist,
    })
  },
  toCopy_appid() {
    var data = this.data.val_appid
    wx.setClipboardData({
      data,
      success(res) {
        console.log(data, 'appid复制成功');
      }
    })
  },
  toTixian() {
    var isTixian = this.data.isTixian
    this.setData({
      isTixian: !isTixian
    })
    if (isTixian == false) {
      db.collection('jiesuan').where({})
        .orderBy('xd_time', 'desc')

        .get()
        .then(res => {
          console.log(res.data, '下载提现申请信息');
          var tixian_list = res.data
          this.setData({
            tixian_list,
          })
        })

    }
  },
  goTixian(e) {
    console.log(e, '完成提现');
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    var tx_time = utils_time.formatTime(new Date())
    var tixian_list = this.data.tixian_list
    var searchlist_tixian = this.data.searchlist_tixian
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认已提现吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection('jiesuan').doc(item._id).update({
              data: {
                isJiesuan: true,
                tx_time,
              }
            })
            .then(res => {
              console.log(res, '提现更新成功');
              if (res.stats.updated == 1) { //提现更新到页面
                if (searchlist_tixian.length !== 0) {
                  tixian_list.forEach(element => {
                    if (item._id == element._id) {
                      element.isJiesuan = true
                      element.tx_time = tx_time
                    }
                  });
                  searchlist_tixian[index].isJiesuan = true
                  searchlist_tixian[index].tx_time = tx_time
                  that.setData({
                    searchlist_tixian,
                    tixian_list
                  })
                } else {
                  tixian_list[index].isJiesuan = true
                  tixian_list[index].tx_time = tx_time
                  that.setData({
                    tixian_list
                  })
                }
              }
              // this.toTixian()
            })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  toQita_bankuai() {
    var isQita_bankuai = this.data.isQita_bankuai
    this.setData({
      isQita_bankuai: !isQita_bankuai
    })
  },
  toDuanxin() {
    var isDuanxin = this.data.isDuanxin
    this.setData({
      isDuanxin: !isDuanxin
    })
  },
  toKebiao() {
    var isKebiao = this.data.isKebiao
    this.setData({
      isKebiao: !isKebiao
    })
  },
  toshowGengduo_jilu(e) {
    var index = e.currentTarget.dataset.index
    var isshowGengduo = e.currentTarget.dataset.isshowgengduo
    console.log('isshowGengduo', isshowGengduo);
    var tuikuanList_jilu = this.data.tuikuanList_jilu
    tuikuanList_jilu[index].isshowGengduo = !isshowGengduo
    this.setData({
      tuikuanList_jilu,
    })
  },
  toshowGengduo(e) {
    var index = e.currentTarget.dataset.index
    var isshowGengduo = e.currentTarget.dataset.isshowgengduo
    console.log('isshowGengduo', isshowGengduo);
    var {
      tuikuanList,
      searchlist_tuikuan
    } = this.data
    if (searchlist_tuikuan.length !== 0) {
      searchlist_tuikuan[index].isshowGengduo = !isshowGengduo

      this.setData({
        searchlist_tuikuan,
      })
    } else {
      tuikuanList[index].isshowGengduo = !isshowGengduo
      this.setData({
        tuikuanList,
      })

    }
  },
  fenzhang_Guanli(e) {
    // var bannerIndex = e.currentTarget.dataset.index
    console.log('fenzhang_Guanli');
    var isShow_dianpu = true
    this.setData({
      isShow_dianpu,
      // bannerIndex,
    })
  },
  tapchange_fenzhang(e) {
    var dianpu_id = e.currentTarget.dataset.dianpu_id
    // var index = e.currentTarget.dataset.index
    var dianpu_isFenzhang = e.currentTarget.dataset.dianpu_isfenzhang
    var dianpu_openid = e.currentTarget.dataset.dianpu_openid
    // var shangjiaList = this.data.shangjiaList

    if (dianpu_isFenzhang == true) {
      var action = 'fenzhang_del'
    } else {
      var action = 'fenzhang_add'
    }
    wx.showLoading({
      title: '变更中..',
    })
    wx.cloud.callFunction({
        name: 'fenzhang',
        data: {
          action,
          dianpu_id: dianpu_id,
          dianpu_openid: dianpu_openid,
        },
      })
      .then(res => {
        console.log(res, '变更分账接收方 调用成功')
        if (res.result.errCodeDes) {
          wx.hideLoading()
          wx.showModal({
            content: res.result.errCodeDes,
            title: '操作失败',
            showCancel: false,
          })
        } else {

          this.loadShangjia()
          wx.showToast({
            title: '操作成功',
          })
        }
      })
      .catch(err => {
        console.log('操作 失败：', err)
      })
  },
  tapchange_dianpu(e) {
    var dianpu_id = e.currentTarget.dataset.dianpu_id
    var dianpu_name = e.currentTarget.dataset.dianpu_name
    var imagesUrlList = this.data.imagesUrlList
    var bannerIndex = this.data.bannerIndex
    imagesUrlList[bannerIndex].dianpu_id = dianpu_id
    imagesUrlList[bannerIndex].dianpu_name = dianpu_name
    var data_guanggao = {
      shouyeBanner_meishi: imagesUrlList
    }
    this.setData({
      imagesUrlList
    })
    this.close_dianpu()
    wx.showLoading({
      title: '变更中..',
    })
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          _id: 'toptipsdaiqu',
          action: 'guanggao',
          data_guanggao: data_guanggao,
        },
      })
      .then(res => {
        console.log(res.result.stats.updated, '变更店铺成功')
        this.loadImage()
        wx.showToast({
          title: '变更店铺成功',
        })
      })
      .catch(err => {
        console.log('开启广告 失败：', err)
      })
  },

  async loadShangjia() {
    var tenant_id = wx.getStorageSync('tenant_id')
    var res_count = await wx.cloud.database().collection('shangjia').where({
        _id: _.exists(true),
        tenant_id: tenant_id // 添加租户ID过滤
      })
      .count()
    console.log(res_count.total, 'shangjia数量');
    var shangjiaList = []
    var pageNum = Math.ceil(res_count.total / 20) //向上取整

    for (let index = 0; index < pageNum; index++) {
      var res = await wx.cloud.database().collection('shangjia').where({
          _id: _.exists(true),
          tenant_id: tenant_id // 添加租户ID过滤
        })
        .skip(index * 20)
        .get()
      console.log(res.data, 'shangjia下载');
      res.data.forEach(element => {
        shangjiaList.push(element)
      });
    }
    this.setData({
      shangjiaList,
    })
  },

  open_dianpu(e) {
    var bannerIndex = e.currentTarget.dataset.index
    var isShow_dianpu = true
    this.setData({
      isShow_dianpu,
      bannerIndex,
    })
  },
  close_dianpu(e) {
    var isShow_dianpu = false
    this.setData({
      isShow_dianpu,
    })
  },
  tochangeItem(e) {
    var index = e.detail.index
    var nameList = this.data.nameList
    var imagesUrlList = []
    nameList.forEach((element, i) => {
      if (index == i) {
        element.checked = true
      } else {
        element.checked = false
      }
    });
    if (index == 0) {
      console.log(index, '送达与取消被点击');
      imagesUrlList = this.data.imagesUrlList1
    }
    if (index == 1) {
      imagesUrlList = this.data.imagesUrlList2
      this.loadShangjia()
      console.log(index, '送达与取消被点击');
    }

    this.setData({
      nameList,
      imagesUrlList,
    })
  },
  tochangeItem2(e) {
    var index = e.detail.index
    var {
      gongnengList,
      isQuxiao
    } = this.data
    gongnengList.forEach((element, i) => {
      if (index == i) {
        element.checked = true
      } else {
        element.checked = false
      }
    });
    this.setData({
      isQuxiao: false,
      isSongda: false,
      isQujian: false,
      gongnengList,
    })
    if (index == 0) {
      this.setData({
        isQujian: true,
      })
    }
    if (index == 1) {
      this.setData({
        isSongda: true,
      })
    }
    if (index == 2) {
      this.setData({
        isQuxiao: true,
      })
    }
    console.log(index, '被点击');

  },

  toQingkong_kebiao() {
    // var that = this
    wx.showModal({
      title: '提示',
      content: '确认清空所有课表数据吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '提交中..',
          })

          wx.cloud.callFunction({
              name: 'kebiao_qingkong',
              data: {

              }
            })
            .then(res => {
              console.log('清空课表成功：：', res.result.stats);
              wx.showToast({
                icon: 'none',
                title: '操作完成',
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


  input_loudong(e) {
    console.log(e, '楼栋搜索输入');
    var searchlist_daiqu = []
    var inputVal_daiqu = e.detail.value
    var chaxunList = this.data.chaxunList
    chaxunList.forEach(element => {
      // var hunheStr = element.dianpu_name + element.dianpu_phone + element.val_daiqu + element.xd_time
      var hunheStr = element.sd_Didian
      if (hunheStr.includes(inputVal_daiqu)) {
        searchlist_daiqu.push(element)
        this.setData({
          searchlist_daiqu,
          // inputVal_daiqu,
          // isQuanxuan: false,
        })
      }
    });
    // this.quxiaoQuanxuan()
  },
  input_tixian(e) {
    console.log(e, '提现搜索输入');
    var searchlist_tixian = []
    var inputVal_tixian = e.detail.value
    var tixian_list = this.data.tixian_list
    tixian_list.forEach(element => {
      var hunheStr = element.dianpu_name + element.dianpu_phone + element.val_tixian + element.xd_time
      if (hunheStr.includes(inputVal_tixian)) {
        searchlist_tixian.push(element)
        this.setData({
          searchlist_tixian,
          // inputVal_tixian,
          // isQuanxuan: false,
        })
      }
    });
    // this.quxiaoQuanxuan()
  },
  input_tuikuan_jilu(e) {
    // console.log(e);
    var searchlist_tuikuan_jilu = []
    var inputVal_tuikuan = e.detail.value
    var tuikuanList_jilu = this.data.tuikuanList_jilu
    tuikuanList_jilu.forEach(element => {
      var hunheStr = element.qh_Ma + element.kd_Name + element.kd_PhoNum + element.tk_time
      if (hunheStr.includes(inputVal_tuikuan)) {
        searchlist_tuikuan_jilu.push(element)
        this.setData({
          searchlist_tuikuan_jilu,
          // isQuanxuan: false,
        })
      }
    });
    // this.quxiaoQuanxuan()
  },
  input_tuikuan(e) {
    // console.log(e);
    var searchlist_tuikuan = []
    var inputVal_tuikuan = e.detail.value
    var tuikuanList = this.data.tuikuanList
    tuikuanList.forEach(element => {
      var hunheStr = element.qh_Ma + element.kd_Name + element.kd_PhoNum + element.tk_time
      if (hunheStr.includes(inputVal_tuikuan)) {
        searchlist_tuikuan.push(element)
        this.setData({
          searchlist_tuikuan,
          // isQuanxuan: false,
        })
      }
    });
    if (inputVal_tuikuan == '') {
      this.setData({
        searchlist_tuikuan: []
      })
      this.quxiaoQuanxuan()
    }
  },
  input_paotui(e) {
    // console.log(e);
    var searchlist_paotui = []
    var inputVal_paotui = e.detail.value
    var paotuiList = this.data.paotuiList
    paotuiList.forEach(element => {
      var hunheStr = element.xuqiu + element.paotui_name + element.phone + element.xxDizhi + element.xd_time
      if (hunheStr.includes(inputVal_paotui)) {
        searchlist_paotui.push(element)
        this.setData({
          searchlist_paotui,
        })
      }
    });
    this.quxiaoQuanxuan_pt()
  },

  quxiaoQuanxuan() {
    console.log('quxiaoQuanxuan');
    var searchlist_tuikuan = this.data.searchlist_tuikuan
    var tuikuanList = this.data.tuikuanList

    for (let index = 0; index < searchlist_tuikuan.length; index++) {
      searchlist_tuikuan[index].checked = false
    }
    for (let index = 0; index < tuikuanList.length; index++) {
      tuikuanList[index].checked = false
    }
    this.setData({
      isQuanxuan: false,
      tuikuanList,
      searchlist_tuikuan,
      xuanze_num: 0
    })
  },
  quxiaoQuanxuan_pt() {
    var searchlist_paotui = this.data.searchlist_paotui
    var paotuiList = this.data.paotuiList
    var e = {
      detail: {
        'value': []
      }
    }
    this.checkboxChange_danxuan_pt(e)
    for (let index = 0; index < searchlist_paotui.length; index++) {
      var element = 'searchlist_paotui[' + index + '].checked'
      this.setData({
        [element]: false,
      })
    }
    for (let index = 0; index < paotuiList.length; index++) {
      var element = 'paotuiList[' + index + '].checked'
      this.setData({
        [element]: false,
      })
    }
    this.setData({
      isQuanxuan_pt: false
    })
  },

  checkbox_Quanxuan() {
    console.log('checkbox_Quanxuan');

    var {
      isQuanxuan,
      tuikuanList,
      searchlist_tuikuan
    } = this.data
    console.log(searchlist_tuikuan);
    this.setData({
      isQuanxuan: !isQuanxuan
    })
    if (!isQuanxuan) {

      for (let index = 0; index < searchlist_tuikuan.length; index++) {
        if (searchlist_tuikuan[index].dingdanList) { // 合并支付订单
          searchlist_tuikuan[index].checked = false
        } else {
          searchlist_tuikuan[index].checked = true
        }
      }
      for (let index = 0; index < tuikuanList.length; index++) {
        if (tuikuanList[index].dingdanList) { // 合并支付订单
          tuikuanList[index].checked = false
        } else {
          tuikuanList[index].checked = true
        }
      }

      this.setData({
        searchlist_tuikuan,
        tuikuanList,
      })

    } else {
      console.log('取消全选');
      for (let index = 0; index < searchlist_tuikuan.length; index++) {
        searchlist_tuikuan[index].checked = false
      }
      for (let index = 0; index < tuikuanList.length; index++) {
        tuikuanList[index].checked = false
      }
      this.setData({
        tuikuanList,
        searchlist_tuikuan,
        // xuanze_num: 0
      })
    }

    if (searchlist_tuikuan.length !== 0) {
      tuikuanList = searchlist_tuikuan
    }

    var go_tuikuan_list = []
    var go_tuikuan_list_0 = []
    var checkList = []
    for (let index = 0; index < tuikuanList.length; index++) {
      const element = tuikuanList[index];
      if (element.checked) {
        checkList.push(element)
        if (element.refund_fee == 0) { //没有用微信支付
          go_tuikuan_list_0.push(element)
        } else {
          go_tuikuan_list.push(element)
        }
      }
    }

    this.setData({
      go_tuikuan_list,
      go_tuikuan_list_0,
      xuanze_num: checkList.length
    })
    console.log('选的退款go_tuikuan_list：', go_tuikuan_list);
    console.log('选的退款go_tuikuan_list_0：', go_tuikuan_list_0);
  },


  checkbox_Quanxuan_pt() {
    var searchlist_paotui = this.data.searchlist_paotui
    if (searchlist_paotui.length !== 0) {
      var paotuiList = searchlist_paotui
    } else {
      var paotuiList = this.data.paotuiList
    }
    var isQuanxuan_pt = this.data.isQuanxuan_pt
    this.setData({
      isQuanxuan_pt: !isQuanxuan_pt
    })
    if (!isQuanxuan_pt) {
      var value_list = []
      for (let index = 0; index < paotuiList.length; index++) {
        value_list.push(String(index))
        if (searchlist_paotui.length !== 0) {
          var element = 'searchlist_paotui[' + index + '].checked'
        } else {
          var element = 'paotuiList[' + index + '].checked'
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
      // console.log(value_list);
      this.checkboxChange_danxuan_pt(e)
    } else {
      var e = {
        detail: {
          'value': []
        }
      }
      this.checkboxChange_danxuan_pt(e)
      for (let index = 0; index < paotuiList.length; index++) {
        if (searchlist_paotui.length !== 0) {
          var element = 'searchlist_paotui[' + index + '].checked'
        } else {
          var element = 'paotuiList[' + index + '].checked'
        }
        this.setData({
          [element]: false
        })
      }
    }
  },

  // checkboxChange_danxuan_tk(e) {
  //   console.log('选的退款：', e.detail.value);
  //   var value_array = e.detail.value
  //   var tuikuanList = this.data.tuikuanList
  //   var go_tuikuan_list = []
  //   var go_tuikuan_list_0 = []
  //   value_array.forEach(element => {
  //     var index = Number(element)
  //     var item = tuikuanList[index]
  //     if (item.refund_fee == 0) { //没有用微信支付
  //       go_tuikuan_list_0.push(tuikuanList[index])
  //     } else {
  //       go_tuikuan_list.push(tuikuanList[index])
  //     }
  //   });
  //   this.setData({
  //     go_tuikuan_list,
  //     go_tuikuan_list_0,
  //     xuanze_num: value_array.length
  //   })
  //   console.log('选的退款go_tuikuan_list：', go_tuikuan_list);
  //   console.log('选的退款go_tuikuan_list_0：', go_tuikuan_list_0);

  // },
  checkboxChange_danxuan_tk(e) {
    console.log('checkboxTap', e);

    // function hasD(dingdanhao) {
    //   if (dingdanhao.indexOf('D') !== -1) {
    //     return true
    //   }
    //   return false
    // }
    var {
      index
    } = e.currentTarget.dataset
    console.log('checkboxTap', index);
    var {
      tuikuanList,
      searchlist_tuikuan,
      ischange
    } = this.data

    if (searchlist_tuikuan.length !== 0) {
      tuikuanList = searchlist_tuikuan
    }

    if (ischange) {
      for (let i = 0, lenI = tuikuanList.length; i < lenI; ++i) {
        if (i == Number(index)) {
          tuikuanList[i].checked = !tuikuanList[i].checked // 单选
          if (tuikuanList[i].dingdanList) {
            this.setData({
              ischange: true
            })
            wx.showToast({
              title: '合并订单仅单选',
            })
          } else {
            this.setData({
              ischange: false
            })
          }
        } else {
          tuikuanList[i].checked = false
        }
      }
    } else {
      tuikuanList[index].checked = !tuikuanList[index].checked //多选
      // if (tuikuanList[index].kd_Name == '林轻') {
      if (tuikuanList[index].dingdanList) {

        if (tuikuanList[index].checked) {
          this.setData({
            ischange: true
          })
          wx.showToast({
            title: '合并订单仅单选',
          })
        }
        for (let i = 0; i < tuikuanList.length; i++) {
          if (index !== i) {
            tuikuanList[i].checked = false
          }
        }
      }
    }

    if (searchlist_tuikuan.length !== 0) {
      this.setData({
        searchlist_tuikuan: tuikuanList
      })
    } else {
      this.setData({
        tuikuanList
      })
    }


    var go_tuikuan_list = []
    var go_tuikuan_list_0 = []
    for (let index = 0; index < tuikuanList.length; index++) {
      const element = tuikuanList[index];
      if (element.checked) {
        // checkList.push(element)
        if (element.refund_fee == 0) { //没有用微信支付
          go_tuikuan_list_0.push(element)
        } else {
          go_tuikuan_list.push(element)
        }
      }
    }

    this.setData({
      go_tuikuan_list,
      go_tuikuan_list_0,
      xuanze_num: go_tuikuan_list.length + go_tuikuan_list_0.length
    })
    console.log('选的退款go_tuikuan_list：', go_tuikuan_list);
    console.log('选的退款go_tuikuan_list_0：', go_tuikuan_list_0);

  },

  checkboxChange_danxuan_pt(e) {
    console.log('选的跑腿：', e.detail.value);
    var value_array = e.detail.value
    var paotuiList = this.data.paotuiList
    var go_paotui_list = []
    // var go_paotui_list_0 = []
    value_array.forEach(element => {
      var index = Number(element)
      var item = paotuiList[index]
      // if (item.refund_fee == 0) {
      //   go_paotui_list_0.push(paotuiList[index])
      // } else {
      go_paotui_list.push(item)
      // }
    });
    this.setData({
      go_paotui_list,
      // go_paotui_list_0,
      xuanze_num_pt: value_array.length
    })
    console.log('选的跑腿go_paotui_list：', go_paotui_list);
    // console.log('选的退款go_paotui_list_0：', go_paotui_list_0);

  },

  checkboxChange_danxuan_dq(e) {

    // console.log('选择代取：', e);
    console.log('选择代取：', e.detail.value);
    var value_array = e.detail.value
    var chaxunList = this.data.chaxunList
    var searchlist_daiqu = this.data.searchlist_daiqu
    // ?chaxunList:searchlist_daiqu
    var go_daiqu_list = []
    value_array.forEach(element => {
      var index = Number(element)
      if (searchlist_daiqu.length !== 0) {
        var item = searchlist_daiqu[index]
      } else {
        var item = chaxunList[index]
      }
      go_daiqu_list.push(item)
    });
    this.setData({
      go_daiqu_list,
      xuanze_num_dq: value_array.length
    })
    console.log(go_daiqu_list, '选的go_daiqu_list');


    // if (this.data.isQuxiao) {
    console.log('选的退款：', e.detail.value);

    var go_tuikuan_list_qx = []
    var go_tuikuan_list_0_qx = []
    go_daiqu_list.forEach(item => {
      // var index = Number(i)
      // var item = go_daiqu_list[index]
      if (item.yizhifu == 0) { //没有用微信支付
        go_tuikuan_list_0_qx.push(item)
      } else {
        go_tuikuan_list_qx.push(item)
      }
    });
    this.setData({
      go_tuikuan_list_qx,
      go_tuikuan_list_0_qx,
      // xuanze_num: value_array.length
    })
    console.log('选中的用微信支付的 go_tuikuan_list_qx', go_tuikuan_list_qx);
    console.log('选择中没有用微信支付 go_tuikuan_list_0_qx', go_tuikuan_list_0_qx);

    // }

  },

  checkbox_Quanxuan_dq() {
    var searchlist_daiqu = this.data.searchlist_daiqu
    if (searchlist_daiqu.length !== 0) {
      var go_daiqu_list = searchlist_daiqu
    } else {
      var go_daiqu_list = this.data.chaxunList
    }
    var isQuanxuan_dq = this.data.isQuanxuan_dq
    this.setData({
      isQuanxuan_dq: !isQuanxuan_dq,
      xuanze_num_dq: go_daiqu_list.length
    })
    if (!isQuanxuan_dq) {
      var value_list = []
      for (let index = 0; index < go_daiqu_list.length; index++) {
        value_list.push(String(index))
        if (searchlist_daiqu.length !== 0) {
          var element = 'searchlist_daiqu[' + index + '].checked'
        } else {
          var element = 'chaxunList[' + index + '].checked'
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
      // console.log(value_list);
      this.checkboxChange_danxuan_dq(e)
    } else {
      var e = {
        detail: {
          'value': []
        }
      }
      this.checkboxChange_danxuan_dq(e)
      for (let index = 0; index < go_daiqu_list.length; index++) {
        if (searchlist_daiqu.length !== 0) {
          var element = 'searchlist_daiqu[' + index + '].checked'
        } else {
          var element = 'chaxunList[' + index + '].checked'
        }
        this.setData({
          [element]: false
        })
      }
    }
  },

  // 全选和单选  取件中
  // 80e3bed0659e860c06a18a576ee86dee
  // b751f280659e860c06758d5c4b853ad0
  // 09e78768659e860c067a75c8006b555c
  // 09e78768659e860c067a75c953ea87e9
  // b751f280659e860c06758d615463662d
  checkbox_Quanxuan_dq_new() {
    var {
      searchlist_daiqu,
      chaxunList,
      isQuanxuan_dq
    } = this.data
    if (searchlist_daiqu.length !== 0) {
      var go_daiqu_list = searchlist_daiqu
    } else {
      var go_daiqu_list = chaxunList
    }
    this.setData({
      isQuanxuan_dq: !isQuanxuan_dq,
      xuanze_num_dq: go_daiqu_list.length
    })
    console.log('isQuanxuan_dq', isQuanxuan_dq);

    var go_tuikuan_list_qx = []
    var go_tuikuan_list_0_qx = []
    for (let index = 0; index < go_daiqu_list.length; index++) {
      const item = go_daiqu_list[index]
      if (searchlist_daiqu.length !== 0) {
        // var element = 'searchlist_daiqu[' + index + '].checked'
        searchlist_daiqu[index].checked = !isQuanxuan_dq
      }
      if (searchlist_daiqu.length == 0) {
        // var element = 'chaxunList[' + index + '].checked'
        chaxunList[index].checked = !isQuanxuan_dq
      }
      if (item.yizhifu == 0) { //没有用微信支付
        go_tuikuan_list_0_qx.push(item)
      }
      if (item.yizhifu !== 0) {

        go_tuikuan_list_qx.push(item)
      }
      // 20240110 全选操作取件中时会漏几个，没找到原因，暂时进行判断语句if代替else
    }

    console.log('选中的用微信支付的 go_tuikuan_list_qx', go_tuikuan_list_qx);
    console.log('选中的没用微信支付的 go_tuikuan_list_0_qx', go_tuikuan_list_0_qx);




    if (isQuanxuan_dq) {

      this.setData({
        go_daiqu_list: [],
        chaxunList,
        go_tuikuan_list_qx: [],
        go_tuikuan_list_0_qx: [],
      })

    } else {

      this.setData({
        go_tuikuan_list_qx,
        go_tuikuan_list_0_qx,
        go_daiqu_list,
        chaxunList
      })

    }

  },





  // 寄件列表 
  checkboxChange_danxuan_jj(e) {
    // console.log('选择代取：', e);
    console.log('选择寄件：', e.detail.value);
    var value_array = e.detail.value
    var chaxunList = this.data.chaxunList
    var searchlist_jijian = this.data.searchlist_jijian
    // ?chaxunList:searchlist_jijian
    var go_jijian_list = []
    value_array.forEach(element => {
      var index = Number(element)
      if (searchlist_jijian.length !== 0) {
        var item = searchlist_jijian[index]
      } else {
        var item = chaxunList[index]
      }
      go_jijian_list.push(item)
    });
    this.setData({
      go_jijian_list,
      // xuanze_num_dq: value_array.length
    })
    console.log(go_jijian_list, '选的go_jijian_list');
  },
  checkbox_Quanxuan_jj() {
    var searchlist_jijian = this.data.searchlist_jijian
    if (searchlist_jijian.length !== 0) {
      var go_jijian_list = searchlist_jijian
    } else {
      var go_jijian_list = this.data.chaxunList
    }
    var isQuanxuan_jj = this.data.isQuanxuan_jj
    this.setData({
      isQuanxuan_jj: !isQuanxuan_jj,
      // xuanze_num_jj: go_jijian_list.length
    })
    if (!isQuanxuan_jj) {
      var value_list = []
      for (let index = 0; index < go_jijian_list.length; index++) {
        value_list.push(String(index))
        if (searchlist_jijian.length !== 0) {
          var element = 'searchlist_jijian[' + index + '].checked'
        } else {
          var element = 'chaxunList[' + index + '].checked'
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
      // console.log(value_list);
      this.checkboxChange_danxuan_jj(e)
    } else {
      var e = {
        detail: {
          'value': []
        }
      }
      this.checkboxChange_danxuan_jj(e)
      for (let index = 0; index < go_jijian_list.length; index++) {
        if (searchlist_jijian.length !== 0) {
          var element = 'searchlist_jijian[' + index + '].checked'
        } else {
          var element = 'chaxunList[' + index + '].checked'
        }
        this.setData({
          [element]: false
        })
      }
    }
  },
  searchYiqu(go_jijian_list, chaxunList, isYiqu) {
    go_jijian_list.forEach(element => {
      chaxunList.forEach((element2, index) => {
        if (element._id == element2._id) {
          element2.isYiqu = isYiqu
        }
      });
    });
    console.log();
    return chaxunList
  },
  toYiqu() {
    var go_jijian_list = this.data.go_jijian_list
    var chaxunList = this.data.chaxunList
    var chaxunList_beixuan = this.data.chaxunList_beixuan
    var searchlist_jijian = this.data.searchlist_jijian
    var gx_time = utils_time.formatTime(new Date())
    var isYiqu = true
    if (go_jijian_list.length == 0) {
      wx.showToast({
        title: '选择为空',
        icon: 'none',
      })
    } else {
      var that = this
      wx.showLoading({
        title: '提交中..',
      })
      wx.cloud.callFunction({
          name: 'changedata',
          data: {
            action: 'changeStatus_jijian',
            changeData: {
              collection_name: 'jijian',
              gx_time,
              go_jijian_list,
              isYiqu,
            }
          }
        })
        .then(res => {
          console.log('提交成功：：', res);
          wx.hideLoading({})
          chaxunList = that.searchYiqu(go_jijian_list, chaxunList, isYiqu)
          chaxunList_beixuan = that.searchYiqu(go_jijian_list, chaxunList_beixuan, isYiqu)
          searchlist_jijian = that.searchYiqu(go_jijian_list, searchlist_jijian, isYiqu)
          if (this.data.isQuanxuan_jj) {
            this.checkbox_Quanxuan_jj()
            this.setData({
              isQuanxuan_jj: false,
            })
          }
          that.setData({
            go_jijian_list: [],
            chaxunList,
            chaxunList_beixuan,
            searchlist_jijian,
          })
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading({})
        })

    }
  },
  toWeiqu() {
    var go_jijian_list = this.data.go_jijian_list
    var chaxunList = this.data.chaxunList
    var chaxunList_beixuan = this.data.chaxunList_beixuan
    var searchlist_jijian = this.data.searchlist_jijian
    var gx_time = utils_time.formatTime(new Date())
    var isYiqu = false
    if (go_jijian_list.length == 0) {
      wx.showToast({
        title: '选择为空',
        icon: 'none',
      })
    } else {
      var that = this
      wx.showLoading({
        title: '提交中..',
      })
      wx.cloud.callFunction({
          name: 'changedata',
          data: {
            action: 'changeStatus_jijian',
            changeData: {
              collection_name: 'jijian',
              gx_time,
              go_jijian_list,
              isYiqu,
            }
          }
        })
        .then(res => {
          console.log('提交成功：：', res);
          wx.hideLoading({})
          chaxunList = that.searchYiqu(go_jijian_list, chaxunList, isYiqu)
          chaxunList_beixuan = that.searchYiqu(go_jijian_list, chaxunList_beixuan, isYiqu)
          searchlist_jijian = that.searchYiqu(go_jijian_list, searchlist_jijian, isYiqu)
          if (this.data.isQuanxuan_jj) {
            this.checkbox_Quanxuan_jj()
            this.setData({
              isQuanxuan_jj: false,
            })
          }
          that.setData({
            go_jijian_list: [],
            chaxunList,
            chaxunList_beixuan,
            searchlist_jijian,
          })
        })
        .catch(err => {
          console.log(err);
          wx.hideLoading({})
        })

    }
  },
  // toYiqu() {
  //   var go_jijian_list = this.data.go_jijian_list
  //   var chaxunList = this.data.chaxunList
  //   var chaxunList_beixuan = this.data.chaxunList_beixuan
  //   var searchlist_jijian = this.data.searchlist_jijian
  //   var gx_time = utils_time.formatTime(new Date())

  //   if (go_jijian_list.length == 0) {
  //     wx.showToast({
  //       title: '选择为空',
  //       icon: 'none',
  //     })
  //   } else {
  //     var that = this
  //     wx.showModal({
  //       title: '提示',
  //       content: '发送消息吗？',
  //       success(res) {
  //         if (res.confirm) {
  //           console.log('用户点击确定')
  //           wx.showLoading({
  //             title: '提交中..',
  //           })
  //           wx.cloud.callFunction({
  //               name: 'changedata',
  //               data: {
  //                 action: 'changeStatus_jijian', 
  //                 changeData: {
  //                   collection_name: 'jijian',
  //                   gx_time,
  //                   go_jijian_list,
  //                 }
  //               }
  //             })
  //             .then(res => {
  //               console.log('提交成功：：', res);
  //               // wx.showToast({
  //               //   icon: 'none',
  //               //   title: '操作成功',
  //               // })
  //               chaxunList = that.searchYiqu(go_jijian_list, chaxunList)
  //               chaxunList_beixuan = that.searchYiqu(go_jijian_list, chaxunList_beixuan)
  //               searchlist_jijian = that.searchYiqu(go_jijian_list, searchlist_jijian)
  //               that.setData({
  //                 go_jijian_list: [],
  //                 chaxunList,
  //                 chaxunList_beixuan,
  //                 searchlist_jijian,
  //                 isQuanxuan_jj: false,
  //               })

  //             })
  //             .catch(err => {
  //               console.log(err);
  //               wx.hideLoading({})
  //             })

  //         } else if (res.cancel) {
  //           console.log('用户点击取消')
  //         }
  //       }
  //     })
  //   }
  // },

  tuiFengmi(id, balance, balance_jilu) {
    wx.cloud.database().collection('user').doc(id)
      .update({
        data: {
          balance,
          balance_jilu: _.addToSet(balance_jilu),
        }
      })
      .then(res => {
        console.log('[余额] 更新 成功几条：', res.stats.updated)
      })
      .catch(err => {
        console.log('[余额] 更新 失败：', err)
      })
  },
  tuiJifen(id, jifen) {
    wx.cloud.database().collection('user').doc(id)
      .update({
        data: {
          jifen: _.addToSet(jifen),
        }
      })
      .then(res => {
        console.log('[积分] 更新 成功几条：', res.stats.updated)
      })
      .catch(err => {
        console.log('[积分] 更新 失败：', err)
      })
  },
  chaBalance(id) {
    wx.cloud.database().collection('user').doc(id)
      .get()
      .then(res => {
        console.log('chaBalance', res)
        return res
      })
      .catch(err => {
        console.log('chaBalance 失败：', err)
      })
  },

  goPaotui_wancheng() {
    this.change_dd_Status('3')
  },

  change_dd_Status(dd_Status) {
    var go_paotui_list = this.data.go_paotui_list
    if (go_paotui_list.length == 0) {
      wx.showToast({
        title: '选择为空',
        icon: 'none',
      })
    } else {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确认完成吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.showLoading({
              title: '提交中..',
            })
            var idArr = []
            go_paotui_list.forEach(element => {
              idArr.push(element._id)
            });
            wx.cloud.callFunction({
                name: 'changedata',
                data: {
                  dd_Status,
                  collection_name: 'paotui',
                  idArr,
                }
              })
              .then(res => {
                console.log('提交成功：：', res);
                wx.showToast({
                  icon: 'none',
                  title: '操作完成',
                })
                that.loadPaotui()
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

  goPaotui_cancel() {
    this.change_dd_Status('5')
  },

  goTuikuan() {
    var go_tuikuan_list_0 = this.data.go_tuikuan_list_0
    var go_tuikuan_list = this.data.go_tuikuan_list
    var xd_time = utils_time.formatTime(new Date())
    var timeout = (go_tuikuan_list.length + go_tuikuan_list_0.length) * 500
    if (timeout < 1) {
      timeout = 1
    }
    if (go_tuikuan_list.length == 0 && go_tuikuan_list_0.length == 0) {
      wx.showToast({
        title: '选择为空',
        icon: 'none',
      })
    } else {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确认退款吗？',
        success(res) {
          if (res.confirm) {

            console.log('用户点击确定')
            wx.showLoading({
              title: '退款中..',
            })
            // 微信退款
            if (go_tuikuan_list.length !== 0 && go_tuikuan_list_0.length == 0) {
              console.log('去微信退款');

              wx.cloud.callFunction({
                  name: 'apaytuikuan',
                  // name: 'apaytuikuan_ceshi',
                  data: {
                    go_tuikuan_list,
                    xd_time,
                    action: 'tuikuan',
                  }
                })
                .then(res => {
                  console.log('退款成功：：', res);
                  wx.showToast({
                    icon: 'none',
                    title: '退款完成',
                  })

                  setTimeout(() => {
                    that.loadTuikuan()
                  }, timeout);

                })
                .catch(err => {
                  console.log(err);
                  wx.hideLoading({})
                })
            }
            // 其余退款
            if (go_tuikuan_list.length == 0 && go_tuikuan_list_0.length !== 0) {
              console.log('去其他退款');
              wx.cloud.callFunction({
                  name: 'apaytuikuan',
                  data: {
                    go_tuikuan_list_0,
                    xd_time,
                    action: 'tuikuan_qita',
                  }
                })
                .then(res => {
                  console.log('退款成功：：', res);
                  wx.showToast({
                    icon: 'none',
                    title: '退款完成',
                  })

                  setTimeout(() => {
                    that.loadTuikuan()
                  }, timeout);

                })
                .catch(err => {
                  console.log(err);
                  wx.hideLoading({})
                })

            }
            // 微信+其余退款
            if (go_tuikuan_list.length !== 0 && go_tuikuan_list_0.length !== 0) {
              console.log('去多种退款');
              wx.cloud.callFunction({
                  name: 'apaytuikuan',
                  data: {
                    go_tuikuan_list,
                    go_tuikuan_list_0,
                    xd_time,
                    action: 'tuikuan_duozhong',
                  }
                })
                .then(res => {
                  console.log('退款成功：：', res);
                  wx.showToast({
                    icon: 'none',
                    title: '退款完成',
                  })

                  setTimeout(() => {
                    that.loadTuikuan()
                  }, timeout);

                })
                .catch(err => {
                  console.log(err);
                  wx.hideLoading({})
                })
            }

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  goJutui() {
    var go_tuikuan_list_0 = this.data.go_tuikuan_list_0
    var go_tuikuan_list = this.data.go_tuikuan_list
    var xd_time = utils_time.formatTime(new Date())
    var timeout = (go_tuikuan_list.length + go_tuikuan_list_0.length) * 500
    if (timeout < 1) {
      timeout = 1
    }
    if (go_tuikuan_list.length == 0 && go_tuikuan_list_0.length == 0) {
      wx.showToast({
        title: '选择为空',
        icon: 'none',
      })
    } else {
      var that = this
      wx.showModal({
        title: '提示',
        content: '确认拒绝吗？',
        success(res) {
          if (res.confirm) {

            wx.showLoading({
              title: '拒退中..',
            })

            console.log('去多种拒绝退款');
            wx.cloud.callFunction({
                name: 'apaytuikuan',
                data: {
                  go_tuikuan_list,
                  go_tuikuan_list_0,
                  // xd_time,
                  action: 'tuikuan_jutui',
                }
              })
              .then(res => {
                console.log('拒绝退款成功：：', res);
                wx.showToast({
                  icon: 'none',
                  title: '拒退完成',
                })

                setTimeout(() => {
                  that.loadTuikuan()
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


  async loadTuikuan_jilu() {
    wx.showLoading({
      title: '加载中..',
    })

    var tuikuanList_jilu_all = this.data.tuikuanList_jilu_all
    var tuikuanList_jilu_jutui = this.data.tuikuanList_jilu_jutui
    var tuikuanList_jilu_tuikuan = this.data.tuikuanList_jilu_tuikuan
    var res_loadmore = await wx.cloud.callFunction({
      name: 'loaddata',
      data: {
        loaddataType: 'tuikuan_jilu',
      }
    })
    console.log(res_loadmore.result, '退款记录');

    if (res_loadmore.result.length !== 0) {
      res_loadmore.result.forEach(element => {
        tuikuanList_jilu_all.push(element)
        if (element.isJutui) {
          tuikuanList_jilu_jutui.push(element)
        } else {
          tuikuanList_jilu_tuikuan.push(element)
        }
      });
    }

    this.setData({
      tuikuanList_jilu: res_loadmore.result,
      tuikuanList_jilu_all: res_loadmore.result,
      tuikuanList_jilu_jutui,
      tuikuanList_jilu_tuikuan,
      // tuikuan_pageNum,
    })

    wx.hideLoading({
      success: (res) => {},
    })
  },

  // async loadTuikuan_jilu() {
  //   wx.showLoading({
  //     title: '加载中..',
  //   })
  //   var res_count = await wx.cloud.database().collection('tuikuan').where({
  //       isYunxu_tuikuan: true,
  //     })
  //     .count()
  //   console.log(res_count.total, '退款记录数量');
  //   if (res_count.total >= 100) {
  //     console.log('退款记录数量>=100,res_count.total设置为100')
  //     res_count.total = 100
  //   }
  //   var tuikuanList_jilu_all = []
  //   var tuikuanList_jilu_jutui = []
  //   var tuikuanList_jilu_tuikuan = []
  //   var pageNum = Math.ceil(res_count.total / 20) //向上取整
  //   // console.log(pageNum);
  //   // 退款订单
  //   for (let index = 0; index < pageNum; index++) {
  //     var res = await wx.cloud.database().collection('tuikuan').where({
  //         isYunxu_tuikuan: true,
  //       })
  //       .skip(index * 20)
  //       .orderBy('tk_time', 'desc')
  //       .get()
  //     console.log(res.data, '退款记录');
  //     res.data.forEach(element => {

  //       tuikuanList_jilu_all.push(element)
  //       if (element.isJutui) {
  //         tuikuanList_jilu_jutui.push(element)
  //       } else {
  //         tuikuanList_jilu_tuikuan.push(element)

  //       }
  //     });
  //   }
  //   this.setData({
  //     tuikuanList_jilu: res.data,
  //     tuikuanList_jilu_all:res.data,
  //     tuikuanList_jilu_jutui,
  //     tuikuanList_jilu_tuikuan,
  //   })
  //   // this.quxiaoQuanxuan()
  //   wx.hideLoading({
  //     success: (res) => {},
  //   })
  // },

  async loadTuikuan() {

    var res_count = await wx.cloud.database().collection('tuikuan').where({
        isYunxu_tuikuan: false,
      })
      .count()
    console.log('tuikuan数量  ：：', res_count.total);
    var tuikuanList = []
    var pageNum = Math.ceil(res_count.total / 20) //向上取整
    // console.log(pageNum);
    // 退款订单
    for (let index = 0; index < pageNum; index++) {
      var res = await wx.cloud.database().collection('tuikuan').where({
          isYunxu_tuikuan: false,
        })
        .skip(index * 20)
        .orderBy('tk_time', 'desc')
        .get()
      console.log('tuikuan订单 ：：', res.data);
      res.data.forEach(element => {
        // var xd_time1 = element.xd_time.slice(0, 10).split('-').join('')
        // var xd_time2 = element.xd_time.slice(11, 19).split(':').join('')
        // element.xd_time_paixu = xd_time1 + xd_time2
        tuikuanList.push(element)
      });
    }
    this.setData({
      tuikuanList,
      // searchlist_tuikuan:[],
      // inputVal_tuikuan:'',
    })
    this.quxiaoQuanxuan()

  },

  async loadPaotui() {
    var res_count = await wx.cloud.database().collection('paotui').where({
        dd_Status: '1',
      })
      .count()
    console.log('paotui数量  ：：', res_count.total);
    var paotuiList = []
    var pageNum = Math.ceil(res_count.total / 20) //向上取整
    // console.log(pageNum);
    // 退款订单
    for (let index = 0; index < pageNum; index++) {
      var res = await wx.cloud.database().collection('paotui').where({
          dd_Status: '1',
        })
        .skip(index * 20)
        .orderBy('xd_time', 'desc')
        .get()
      console.log('paotui 订单 ：：', res.data);
      res.data.forEach(element => {
        // var xd_time1 = element.xd_time.slice(0, 10).split('-').join('')
        // var xd_time2 = element.xd_time.slice(11, 19).split(':').join('')
        // element.xd_time_paixu = xd_time1 + xd_time2
        paotuiList.push(element)
      });
    }
    this.setData({
      paotuiList,
    })
    this.quxiaoQuanxuan_pt()
  },



  // 点我复制
  toCopy(e) {
    var data = String(e.currentTarget.dataset.value)
    console.log(data);
    wx.setClipboardData({
      data,
      success(res) {
        console.log('用户点击，成功复制', res);
      }
    })
  },

  toBannerOpen(e) {
    console.log('点击了开启广告按钮', e.detail.value);
    var data_guanggao = {
      bannerOpen_shouye: e.detail.value,
      bannerOpen_shouye_ad: !e.detail.value,
    }
    wx.showLoading({
      title: '开启...',
    })
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          _id: 'toptipsdaiqu',
          action: 'guanggao',
          data_guanggao: data_guanggao,
        },
      })
      .then(res => {
        console.log('开启广告 成功：：', res.result.stats.updated)
        this.loadImage()
        wx.hideLoading({
          success: (res) => {},
        })
      })
      .catch(err => {
        console.log('开启广告 失败：', err)
      })

  },
  toBannerOpen_ad(e) {
    console.log('点击了开启广告按钮', e.detail.value);
    var data_guanggao = {
      bannerOpen_shouye: !e.detail.value,
      bannerOpen_shouye_ad: e.detail.value,
    }
    wx.showLoading({
      title: '开启...',
    })
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          _id: 'toptipsdaiqu',
          action: 'guanggao',
          data_guanggao: data_guanggao,
        },
      })
      .then(res => {
        console.log('开启广告 成功：：', res.result.stats.updated)
        this.loadImage()
        wx.hideLoading({
          success: (res) => {},
        })
      })
      .catch(err => {
        console.log('开启广告 失败：', err)
      })
  },

  loadImage() {
    // 获取广告src
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数banner：：', res.data);
        var imagesUrlList1 = res.data.shouyeBanner
        var imagesUrlList2 = res.data.shouyeBanner_meishi
        var bannerOpen_shouye = res.data.bannerOpen_shouye
        var bannerOpen_shouye_ad = res.data.bannerOpen_shouye_ad
        var nameList = this.data.nameList
        var imagesUrlList = []

        nameList.forEach((element, i) => {
          if (element.checked == true && i == 0) {
            imagesUrlList = imagesUrlList1
          } else if (element.checked == true && i == 1) {
            imagesUrlList = imagesUrlList2
          }
        });
        this.setData({
          imagesUrlList,
          imagesUrlList1,
          imagesUrlList2,
          bannerOpen_shouye,
          bannerOpen_shouye_ad,
        })
      })
      .catch(err => {
        console.error(err);
      })
  },
  toDel(e) {
    var index = e.currentTarget.dataset.index
    var imagesUrlList = this.data.imagesUrlList
    var imagefileID = imagesUrlList[index].imagefileID
    var deleteFileList = [imagefileID]
    var nameList = this.data.nameList
    var data_guanggao = {}
    console.log('imagefileID', imagefileID);
    wx.showModal({
      cancelColor: 'green',
      cancelText: '取消',
      confirmColor: 'red',
      confirmText: '确定',
      content: '是否删除？',
      title: '提示',
      success: (res) => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '删除...',
          })
          wx.cloud.deleteFile({
            fileList: deleteFileList,
            success: (res) => {
              console.log('云端 删除图片成功', res.fileList);
              imagesUrlList[index].imagefileID = ''
              imagesUrlList[index].src = ''
              // console.log(imagesUrlList);

              nameList.forEach((element, i) => {
                if (element.checked == true && i == 0) {
                  data_guanggao = {
                    shouyeBanner: imagesUrlList
                  }
                } else if (element.checked == true && i == 1) {
                  data_guanggao = {
                    shouyeBanner_meishi: imagesUrlList
                  }
                }
              });
              wx.cloud.callFunction({
                  name: 'banner',
                  data: {
                    _id: 'toptipsdaiqu',
                    action: 'guanggao',
                    data_guanggao: data_guanggao,
                  },
                })
                .then(res => {
                  console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
                  this.loadImage()
                  wx.showToast({
                    title: '已删除',
                    icon: 'none'
                  })
                })
                .catch(err => {
                  console.log('[云函数] [banner] 更新 失败：', err)
                })
            },
            fail: (err) => {
              console.log('删除图片失败', err);
            },
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      },
    })

  },
  async toimageChoose(e) {
    var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
    var index = e.currentTarget.dataset.index
    var openid = wx.getStorageSync('openid')
    var cloudPath = 'banner/' + openid + iamgeUploadTime + '-' + index + '.png'
    var imagesUrlList = this.data.imagesUrlList
    var nameList = this.data.nameList
    var data_guanggao = {}
    var res = await wx.chooseImage({
      count: 1,
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    })
    // 返回选定照片的本地文件路径列表
    var tempFilePath = res.tempFilePaths[0]

    wx.showLoading({
      title: '上传...',
    })
    var res1 = await wx.cloud.uploadFile({ // 上传图片················
      cloudPath: cloudPath,
      filePath: tempFilePath, // 文件路径
    })

    var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
      fileList: [{
        fileID: res1.fileID
      }]
    })

    imagesUrlList[index].imagefileID = res2.fileList[0].fileID
    imagesUrlList[index].src = res2.fileList[0].tempFileURL
    console.log('imagesUrlList', imagesUrlList);
    nameList.forEach((element, i) => {
      if (element.checked == true && i == 0) {
        data_guanggao = {
          shouyeBanner: imagesUrlList
        }
      } else if (element.checked == true && i == 1) {
        data_guanggao = {
          shouyeBanner_meishi: imagesUrlList
        }
      }
    });

    var res3 = await wx.cloud.callFunction({
      name: 'banner',
      data: {
        _id: 'toptipsdaiqu',
        action: 'guanggao',
        data_guanggao: data_guanggao,
      },
    })
    console.log('[云函数] [banner] 更新 成功几条：', res3.result.stats.updated)

    this.loadImage()
    wx.hideLoading({
      success: (res) => {},
    })
  },

  toPaixu1() {
    wx.showLoading({
      title: '排序中...',
    })
    var chaxunList = this.data.chaxunList
    var isShengxu_shj = this.data.isShengxu_shj
    var miaoNum = chaxunList.length / 70 * 1000
    if (isShengxu_shj) {
      chaxunList.sort(function (a, b) {
        return Date.parse(a.xd_time) - Date.parse(b.xd_time); //时间升序
      });
    } else {
      chaxunList.sort(function (a, b) {
        return Date.parse(b.xd_time) - Date.parse(a.xd_time); //时间升序
      });
    }
    this.setData({
      chaxunList,
      isShengxu_shj: !isShengxu_shj
    })
    setTimeout(() => {
      wx.hideLoading()
    }, miaoNum);
  },
  toPaixu2() {
    wx.showLoading({
      title: '排序中...',
    })
    let {
      chaxunList
    } = this.data
    var miaoNum = chaxunList.length / 70 * 1000
    chaxunList.sort(function (a, b) {
      return Date.parse(b.xd_time) - Date.parse(a.xd_time); //时间降序
    });
    this.setData({
      chaxunList
    })
    setTimeout(() => {
      wx.hideLoading({
        success: (res) => {},
      })
    }, miaoNum);
  },
  toPaixu3() {
    wx.showLoading({
      title: '排序中...',
    })
    var chaxunList = this.data.chaxunList
    var miaoNum = chaxunList.length / 70 * 1000
    var isShengxu_qhm = this.data.isShengxu_qhm
    if (isShengxu_qhm) {
      chaxunList.sort(function (a, b) {
        return a.qh_Ma.localeCompare(b.qh_Ma); //取货码升序
      });
    } else {
      chaxunList.sort(function (a, b) {
        return b.qh_Ma.localeCompare(a.qh_Ma); //取货码升序
      });
    }
    this.setData({
      chaxunList,
      isShengxu_qhm: !isShengxu_qhm,
    })
    setTimeout(() => {
      wx.hideLoading()
    }, miaoNum);
  },

  toPaixu4() {
    console.log('订单尾号排序');
    wx.showLoading({
      title: '排序中...',
    })
    var chaxunList = this.data.chaxunList
    var miaoNum = chaxunList.length / 70 * 1000
    var isShengxu_ddwh = this.data.isShengxu_ddwh
    if (isShengxu_ddwh) {
      chaxunList.sort(function (a, b) {
        return a.dingdanhao.localeCompare(b.dingdanhao); //取货码升序
      });
    } else {
      chaxunList.sort(function (a, b) {
        return b.dingdanhao.localeCompare(a.dingdanhao); //取货码升序
      });
    }
    this.setData({
      chaxunList,
      isShengxu_ddwh: !isShengxu_ddwh,
    })
    setTimeout(() => {
      wx.hideLoading()
    }, miaoNum);
  },
  // qh_maPaixu(qh_ma) {
  //   for (let index = 0; index < qh_ma.length; index++) {
  //     const element = qh_ma[index];
  //     if (element == '-') {
  //       element = ''
  //     }
  //   }
  //   console.log(qh_ma);
  //   return qh_ma
  // },
  totime1() {
    this.setData({
      time1: time14,
      date1: nowDate,
    })
    if (this.data.isDaiqu) {
      this.tapDaiqu()
    } else if (this.data.isJijian) {
      this.tapJijian()
    }
  },
  totime2() {
    this.setData({
      time2: time18,
      date2: nowDate,
    })
    if (this.data.isDaiqu) {
      this.tapDaiqu()
    } else if (this.data.isJijian) {
      this.tapJijian()
    }
  },
  tochoose_loudong() {
    var isShow_loudong = !this.data.isShow_loudong
    this.setData({
      isShow_loudong,
      // isSearchlist_daiqu: true,
    })
  },
  // 楼栋筛选 采用搜索的方法
  checkboxChange_loudong(e) {
    console.log('楼栋筛选', e)
    var val_input_daiqu = e.currentTarget.dataset.checkname
    // var loudong_list = this.data.loudong_list
    // var element = loudong_list[e.detail.value]
    // var val_input_daiqu = element.name
    // element.checked = !element.checked

    // var e = { detail: { value: val_input_daiqu } }
    // if (element.checked) {
    //   this.input_loudong(e)
    // } else {
    //   this.clearInput_daiqu()
    // }
    // this.setData({
    //   loudong_list,
    //   val_input_daiqu,
    //   isShow_loudong:false
    // })
    var e = {
      detail: {
        value: val_input_daiqu
      }
    }
    this.setData({
      // loudong_list,
      val_input_daiqu,
      isShow_loudong: false,
      isSearchlist_daiqu: true,
      go_daiqu_list: []
    })
    this.input_loudong(e)
  },
  // 送达地点筛选
  checkboxChange_sd_Didian(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.clearInput_daiqu()
    let value_shxuanlist = e.detail.value
    let value_shxuanlist2 = this.data.value_shxuanlist2
    this.setData({
      value_shxuanlist,
      isUrl_all: false
    })
    var chaxunList_shxuan = []
    // this.shxuan(value_shxuanlist, 'sd_Didian', chaxunList_shxuan)
    var chaxunList_shxuan_kd_Dian = this.data.chaxunList_shxuan_kd_Dian
    if (this.data.value_shxuanlist2.length !== 0) {
      if (this.data.value_shxuanlist.length == 0) {
        this.shxuan(value_shxuanlist2, 'kd_Dian', chaxunList_shxuan)
      } else {
        this.shxuan(value_shxuanlist, 'kd_sd', chaxunList_shxuan_kd_Dian)
      }
    } else if (this.data.value_shxuanlist2.length == 0) {
      if (this.data.value_shxuanlist.length !== 0) {
        this.shxuan(value_shxuanlist, 'sd_Didian', chaxunList_shxuan)
      } else {
        this.setData({
          chaxunList: this.data.chaxunList_beixuan,
          isUrl_all: true,
        })
      }
    }
  },
  // 快递点筛选
  checkboxChange_kd_Dian(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.clearInput_daiqu()
    let value_shxuanlist2 = e.detail.value
    let value_shxuanlist = this.data.value_shxuanlist
    this.setData({
      value_shxuanlist2,
      isUrl_all: false
    })
    var chaxunList_shxuan = []
    var chaxunList_shxuan_sd_Didian = this.data.chaxunList_shxuan_sd_Didian
    if (this.data.value_shxuanlist.length !== 0) {
      if (this.data.value_shxuanlist2.length == 0) {
        this.shxuan(value_shxuanlist, 'sd_Didian', chaxunList_shxuan)
      } else {
        this.shxuan(value_shxuanlist2, 'sd_kd', chaxunList_shxuan_sd_Didian)
      }
    } else if (this.data.value_shxuanlist.length == 0) {
      if (this.data.value_shxuanlist2.length !== 0) {
        this.shxuan(value_shxuanlist2, 'kd_Dian', chaxunList_shxuan)
      } else {
        this.setData({
          chaxunList: this.data.chaxunList_beixuan,
          isUrl_all: true,
        })
      }
    }
  },
  // 筛选方法
  shxuan(value_shxuanlist, shxType, chaxunList_shxuan) {
    // this.setData({isUrl_all:false})
    wx.showLoading({
      title: '筛选中...',
    })
    var sd_DidianList = this.data.sd_DidianList
    var kd_DianList = this.data.kd_DianList
    if (shxType == 'kd_Dian') {
      this.data.chaxunList_beixuan.forEach(element => { //总元素列表
        value_shxuanlist.forEach(value_shxuan => { //筛选词列表
          // console.log('value_shxuan.Number()', Number(value_shxuan));
          if (element.kd_Dian.includes(kd_DianList[Number(value_shxuan)].name)) {
            chaxunList_shxuan.push(element)
          }
        })
      })
      // chaxunList_shxuan.sort(function (a, b) {
      //   return Date.parse(a.xd_time) - Date.parse(b.xd_time)
      // })
      this.setData({
        chaxunList_shxuan_kd_Dian: chaxunList_shxuan,
        chaxunList: chaxunList_shxuan
      })
    } else if (shxType == 'sd_Didian') {
      this.data.chaxunList_beixuan.forEach(element => { //总元素列表
        value_shxuanlist.forEach(value_shxuan => { //筛选词列表
          // console.log('value_shxuan.Number()', Number(value_shxuan));
          if (element.sd_Didian.includes(sd_DidianList[Number(value_shxuan)].name)) {
            chaxunList_shxuan.push(element)
          }
        })
      })
      this.setData({
        chaxunList_shxuan_sd_Didian: chaxunList_shxuan,
        chaxunList: chaxunList_shxuan
      })
    } else if (shxType == 'sd_kd') {
      // var chaxunList_beixuan = chaxunList_shxuan
      var chaxunList_shxuan_hunhe = []
      chaxunList_shxuan.forEach(element => { //总元素列表
        value_shxuanlist.forEach(value_shxuan => { //筛选词列表
          // console.log('value_shxuan.Number()', Number(value_shxuan));
          if (element.kd_Dian.includes(kd_DianList[Number(value_shxuan)].name)) {
            chaxunList_shxuan_hunhe.push(element)
          }
        })
      })
      this.setData({
        chaxunList: chaxunList_shxuan_hunhe
      })
    } else if (shxType == 'kd_sd') {
      // var chaxunList_beixuan = chaxunList_shxuan
      var chaxunList_shxuan_hunhe = []
      chaxunList_shxuan.forEach(element => { //总元素列表
        value_shxuanlist.forEach(value_shxuan => { //筛选词列表
          // console.log('value_shxuan.Number()', Number(value_shxuan));
          if (element.sd_Didian.includes(sd_DidianList[Number(value_shxuan)].name)) {
            chaxunList_shxuan_hunhe.push(element)
          }
        })
      })
      this.setData({
        chaxunList: chaxunList_shxuan_hunhe
      })
    }
    wx.hideLoading({
      success: (res) => {},
    })

    return chaxunList_shxuan
  },



  toShXuanDidian() {
    wx.showLoading({
      title: '筛选中...',
    })
    let chaxunList_shxuan = []
    var sd_DidianList = this.data.sd_DidianList
    var value_shxuanlist = this.data.value_shxuanlist
    this.data.chaxunList_beixuan.forEach(element => {
      value_shxuanlist.forEach(value_shxuan => {
        console.log('value_shxuan.Number()', Number(value_shxuan));
        if (element.sd_Didian.includes(sd_DidianList[Number(value_shxuan)].name)) {
          chaxunList_shxuan.push(element)
        }
      });
    });
    this.setData({
      chaxunList: chaxunList_shxuan
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },

  tapQita() {
    this.loadShangjia()
    this.setData({
      isQita: true,
      isPaotui: false,
      isTuikuan: false,
      isBanner: false,
      isDaiqu: false,
      isCountDaiqu: false,
      isJijian: false,
      isChaxun_Daiqu: false,
      chaxunList: []
    })
  },
  tapPaotui() {
    this.loadPaotui()
    this.setData({
      isQita: false,
      isPaotui: true,
      isTuikuan: false,
      isBanner: false,
      isDaiqu: false,
      isCountDaiqu: false,
      isJijian: false,
      isChaxun_Daiqu: false,
      chaxunList: []
    })
  },
  tapTuikuan() {
    this.loadTuikuan()
    this.setData({
      isQita: false,
      isPaotui: false,
      isTuikuan: true,
      isBanner: false,
      isDaiqu: false,
      isCountDaiqu: false,
      isJijian: false,
      isChaxun_Daiqu: false,
      chaxunList: []
    })
  },
  tapBanner() {
    this.setData({
      isQita: false,
      isPaotui: false,
      isTuikuan: false,
      isBanner: true,
      isDaiqu: false,
      isCountDaiqu: false,
      isJijian: false,
      isChaxun_Daiqu: false,
      chaxunList: []
    })
  },
  tapDaiqu() {
    this.setData({
      isQita: false,
      isPaotui: false,
      isTuikuan: false,
      isBanner: false,
      isDaiqu: true,
      isCountDaiqu: true,
      isJijian: false,
      isChaxun_Daiqu: true,
      chaxunList: []
    })
  },
  tapJijian() {
    this.setData({
      isQita: false,
      isPaotui: false,
      isTuikuan: false,
      isBanner: false,
      isDaiqu: false,
      isCountDaiqu: false,
      isJijian: true,
      isChaxun_Daiqu: true,
      chaxunList: []
    })
  },

  toGuanli() {
    let isAdmin = wx.getStorageSync('isAdmin')
    if (isAdmin) {
      this.setData({
        isAdmin: isAdmin
      })
    } else {
      wx.showToast({
        icon: 'error',
        title: '非管理员',
      })
    }
  },

  bindDateChange_1: function (e) {
    this.setData({
      date1: e.detail.value,
      isChaxun_Daiqu: true,
      chaxunList: [],
      chaxunList_beixuan: [],
    })
  },
  bindTimeChange_1: function (e) {
    this.setData({
      isChaxun_Daiqu: true,
      time1: e.detail.value,
      chaxunList: [],
      chaxunList_beixuan: [],
    })
  },
  bindDateChange_2: function (e) {
    this.setData({
      isChaxun_Daiqu: true,
      date2: e.detail.value,
      chaxunList: [],
      chaxunList_beixuan: [],
    })
  },
  bindTimeChange_2: function (e) {
    this.setData({
      isChaxun_Daiqu: true,
      time2: e.detail.value,
      chaxunList: [],
      chaxunList_beixuan: [],
    })
  },

  // // 搜索框
  // clearInput: function () {
  //   this.setData({
  //     inputVal: "",
  //     searchResultList: '',
  //     // isShowSearchWord:false,
  //     isFocus: true,
  //   });
  // },
  // inputTyping: function (e) {
  //   this.setData({
  //     inputVal: e.detail.value
  //   });
  // },

  // toSearch() {
  //   wx.cloud.callFunction({
  //     name: 'tochaxun1',
  //     data: {
  //       searchType: 'daiqu',
  //       searchword:this.data.inputVal
  //     },
  //     success: res => {
  //       console.log('搜索  成功:', err);

  //     },
  //     fail: err => {
  //       console.log('搜索  失败:', err);
  //     }
  //   })
  // },

  // 查询代取订单
  toChaxun1_new() {
    console.log('开始查询 daiqu');
    this.setData({
      showLoading: true,
      isUrl_all: true,
      isQuanxuan_dq: false,
      go_daiqu_list: [],
      go_tuikuan_list_0_qx: [],
      go_tuikuan_list_qx: [],
      go_tuikuan_list_0: [],
      go_tuikuan_list: [],
    })
    let dateStart = this.data.date1 + ' ' + this.data.time1
    let dateEnd = this.data.date2 + ' ' + this.data.time2
    var {
      pageNum800,
      meiyeNum // 800 改 700
    } = this.data

    console.log('pageNum800', pageNum800);
    wx.cloud.callFunction({
      // name: 'toloadexcel',
      name: 'toloadexcelnew', //测试大于800 下载数据，也要考虑数据下载量超过1MB
      data: {
        dateStart: dateStart,
        dateEnd: dateEnd,
        isDaiqu_new: true,
        pageNum800,
        meiyeNum,
      },
      success: res => {
        console.log(res);
        if (res.result.count == 0) {
          this.setData({
            isChaxun_Daiqu: true,
            showLoading: false,
          })
          wx.showToast({
            icon: 'none',
            title: '查询结果为空',
          })
        } else {

          var pages = Math.ceil(res.result.count / meiyeNum) //向上取整 有多少个800

          this.setData({
            url: res.result.url,
            chaxunList: res.result.chaxunList,
            chaxunList_beixuan: res.result.chaxunList,
            count: res.result.count,
            isChaxun_Daiqu: false,
            showLoading: false,
            pages,
          })

        }
      },
      fail: err => {
        console.log(err);
        wx.showModal({
          content: err,
        })
        this.setData({
          showLoading: false
        })
      }
    })

  },

  toChaxun() {
    let that = this
    let dateStart = this.data.date1 + ' ' + this.data.time1
    let dateEnd = this.data.date2 + ' ' + this.data.time2
    let isDaiqu = this.data.isDaiqu
    let isCountDaiqu = this.data.isCountDaiqu
    var chaxunListNew = []
    // var pageNum = 1
    this.setData({
      showLoading: true,
    })
    // 先查总数
    wx.cloud.callFunction({
      name: 'tochaxun1',
      data: {
        dateStart: dateStart,
        dateEnd: dateEnd,
        // isDaiqu: isDaiqu,
        isCountDaiqu: isCountDaiqu,
        // isCountJijian: false,
        // pageNum: pageNum,
      },
      success: res => {
        console.log('查询的记录总数:', res.result, 'isCountDaiqu:', isCountDaiqu);
        var count = res.result
        if (res.result == 0) {
          that.setData({
            isChaxun_Daiqu: true,
            showLoading: false,
          })
          wx.showToast({
            icon: 'none',
            title: '查询结果为空',
          })
        } else {
          var pageNum = Math.ceil(count / 100) //向上取整
          console.log('pageNum', pageNum);
          // 查询这组数据要几次 pageNum
          for (let index = 0; index < pageNum; index++) {
            wx.cloud.callFunction({
              name: 'tochaxun1',
              data: {
                dateStart: dateStart,
                dateEnd: dateEnd,
                isDaiqu: isDaiqu,
                pageNum: index, //每次+1
              },
              success: res => {
                // 当前第几页
                console.log('当前第', index + 1, '页 index为', index, 'isDaiqu:', isDaiqu);
                console.log('[云函数] [tochaxun1] 返回的数据: ', res.result.data)
                res.result.data.forEach(element => {
                  chaxunListNew.push(element)
                });
                that.setData({
                  // chaxunList: res.result.data,
                  chaxunList: chaxunListNew,
                  chaxunList_beixuan: chaxunListNew,
                  isChaxun_Daiqu: false,
                  showLoading: false,
                })
              },
              fail: err => {
                console.log('[云函数] [tochaxun1] 返回 失败: ', err)
                wx.showToast({
                  title: '未查询到信息',
                })
                that.setData({
                  showLoading: false,
                  isChaxun_Daiqu: true,
                })
              }
            })

          }
          that.setData({
            showLoading: false,
          })
        }

      },
      fail: err => {
        console.log('查询的记录总数 失败:', err);
      }
    })
  },

  toExcel() {
    let that = this
    let isDaiqu = this.data.isDaiqu
    this.setData({
      showLoading: true,
    })
    wx.cloud.callFunction({
      name: 'toexcel',
      data: {
        isDaiqu: isDaiqu,
        chaxunList: that.data.chaxunList
      },
      success: res => {
        console.log('[云函数] [excel] 返回的数据: ', res)
        wx.cloud.getTempFileURL({
          fileList: [res.result.fileID],
          success: res => {
            // get temp file URL
            var url = res.fileList[0].tempFileURL
            console.log('文件的下载链接 url 是：', url)
            that.setData({
              // url,
              showLoading: false,
              // isChaxun_Daiqu: true,
            })
            wx.setClipboardData({
              data: url,
              success(res) {
                console.log('用户点击，成功复制', res);
              }
            })
          },
          fail: err => {
            console.log('文件下载地址url 失败', err)
            // handle error
            that.setData({
              showLoading: false,
              isChaxun_Daiqu: true,
            })
          }
        })
      },
      fail: e => {
        console.log('[云函数] [excel] 返回的数据: ', e)
        that.setData({
          showLoading: false,
        })
      },
    })
  },
  toUrlcopy() {
    var that = this
    if (this.data.isDaiqu) {
      // 询问是否同时变更为取件中
      wx.showModal({
        title: '是否同时变更为取件中',
        content: '点击确认后，将变更所有订单状态为取件中，请确认是否继续？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            that.setData({
              change_dd_Status_together: true,
            })
            // 变更订单状态
            that.toQujian()
          }
          else if (res.cancel) {
            console.log('用户点击取消')
            wx.setClipboardData({
              data: this.data.url,
              success(res) {
                console.log('用户点击，成功复制微信号', res);
              }
            })
          }
        }
      })
    
    } else {
      wx.setClipboardData({
        data: this.data.url,
        success(res) {
          console.log('用户点击，成功复制微信号', res);
        }
      })

    }
  },


  toDingyue() {
    var id = wx.getStorageSync('id')
    // var openid = wx.getStorageSync('openid')
    var templateId = 'WgZ1KHx64XOYlQEzwmjiXIBdSA_-iKaih6Hhli8rH_Y' // 预约提醒
    // var templateId = 'sEx2DfBJQhWRum4C2TMC4dvEp9D-ZK9CmtsTVzDmBM4'//订单状态提醒
    var dingyue = {
      templateId: templateId,
      name: '寄件预约提醒'
    }
    let that = this
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success(res) {
        console.log('管理员 点击订阅消息：', res);
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
            wx.cloud.database().collection('user')
              .get()
              .then(res => {
                console.log('寄件预约提醒 统计 成功', res);
                let dingyue = res.data[0].dingyue
                let dingyue_total = 0
                dingyue.forEach(element => {
                  if (element.name == '寄件预约提醒') {
                    dingyue_total += 1
                  }
                });
                that.setData({
                  dingyue_total,
                })
              })
              .catch(err => {
                console.log('寄件预约提醒 统计失败', err);
              })

          })
          .catch(err => {
            console.log('[云函数] [yonghu][dingyue] 更新 失败：', err)
          })
      }
    })
  },

  onLoad: function (options) {


    console.log('页面加载');

    var str = '北青Hello, world!';
    var replacedStr = str.replace(/北青.*/g, 'a');
    console.log(replacedStr); // 输出：Hella, warld!


    // 默认当前日期
    // 查询 订阅数
    let that = this
    wx.cloud.database().collection('user')
      .get()
      .then(res => {
        let dingyue = res.data[0].dingyue
        let dingyue_total = this.data.dingyue_total
        dingyue.forEach(element => {
          if (element.name == '寄件预约提醒') {
            dingyue_total += 1
          }
        });
        that.setData({
          dingyue_total,
        })
        console.log('查询用户数据 [订阅数]:', dingyue_total);
      })
      .catch(err => {
        console.log('查询用户数据 [订阅数] 失败:', err);
      })
    // 获取提醒 地点选择列表 等
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数 toptipsdaiqu：：', res.data);
        var imagesUrlList1 = res.data.shouyeBanner
        var imagesUrlList2 = res.data.shouyeBanner_meishi
        var bannerOpen_shouye = res.data.bannerOpen_shouye
        var bannerOpen_shouye_ad = res.data.bannerOpen_shouye_ad

        var kd_DianList = res.data.kdDianList
        kd_DianList.forEach((element, i) => {
          kd_DianList[i].name = element.name.slice(0, 2)
        });

        var beixuan_sd_Didian = res.data.beixuan_sd_Didian
        var sd_DidianList = this.data.sd_DidianList
        beixuan_sd_Didian.forEach((element, i) => {
          sd_DidianList[i] = element.sushe
        });

        // console.log('sd_DidianList:', sd_DidianList);
        this.setData({
          // sdSusheList: res.data[0].sdSusheList,
          sd_DidianList,
          kd_DianList,

          imagesUrlList1,
          imagesUrlList2,
          imagesUrlList: imagesUrlList1,
          bannerOpen_shouye,
          bannerOpen_shouye_ad,
          duanxin_list: res.data.duanxin,
          xiaoxi_list: res.data.xiaoxi_list,
          xiaoxi_list_quxiao: res.data.xiaoxi_list_quxiao,
          beizhu_tuisong: wx.getStorageSync('beizhu_tuisong'),
          beizhu_tuisong_quxiao: wx.getStorageSync('beizhu_tuisong_quxiao'),
        })
      })
      .catch(err => {
        console.log('后台主参数 toptipsdaiqu：： 失败', err);
      })
    db.collection('banner').doc('qita0001')
      .get()
      .then(res => {
        console.log('后台主参数 qita0001', res.data);
        var choose_list = res.data.choose_list
        var input_list = res.data.input_list
        this.setData({
          choose_list,
          input_list,
        })
      })
      .catch(err => {
        console.log('后台主参数 qita0001 失败', err);
      })
    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        this.setData({
          screenHeight: res.windowHeight,
        })
      },
    })

  },


  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },


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
    if (this.data.isQita) {
      var tixian_pageNum = this.data.tixian_pageNum
      var tixian_list = this.data.tixian_list
      db.collection('jiesuan').where({})
        .orderBy('xd_time', 'desc')
        .skip(tixian_pageNum * 20)
        .get()
        .then(res => {
          console.log(res.data, '下载提现申请信息');
          if (res.data.length !== 0) {
            res.data.forEach(element => {
              tixian_list.push(element)
            });
            tixian_pageNum++
            this.setData({
              tixian_list,
              tixian_pageNum,
            })
          } else {
            this.setData({
              isnomore: true,
            })
          }
        })

    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})