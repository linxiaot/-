const db = wx.cloud.database()
const _ = db.command
var utils_time = require('../../../utils/time.js') //获取时间等
var xingjisrc1 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing1.png'
var xingjisrc2 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing2.png'
var xingjisrc3 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing3.png'
Page({

  data: {
    tuikuanShow: true,
    // 代取订单参数
    kd_Dian: '',
    // trueName: '',
    kd_Name: '',
    kd_PhoNum: '',
    qh_Ma: '',
    sd_Didian: '',
    xd_time: '',
    isDaiqu: false,
    isTuikuan_daiqu: false,
    dd_Status: '',
    yizhifu: '',
    yizhifu_fengmi: '',
    yizhifu_jifen: '',
    dingdanhao: '',
    tytuikuan_time: '',
    beizhu_tuisong: '',

    // 寄件订单参数
    JJ_weight: '',
    JJ_Name: '',
    JJ_PhoNum: '',
    qujTime: '',
    qujWupin: '',
    JJ_Didian: '',
    mdd: '',
    isJijian: false,
    isChuli: false,
    dd_Status: '',

    //跑腿订单参数 
    xuqiu: '',
    isPaotui: false,

    //美食 订单参数
    cartData: '',
    isMeishi: false,

    xingji_list: [],
    pingjia_list: ['差', '一般', '不错', '很满意', '强烈推荐'],

    dialogShow: false,
    tkyy_list: ['取件/收件信息填错了', '重复下单', '准备自己去取', '这个快递已经被取走了', '其他（请提前与客服进行沟通）'],
    value_tkyy: '',
    wxPaisong: '',
    buttons: [{
      text: '提交'
    }],
    guitiDatas: null,
    songdaInfo: '',
    dingdan_jifen: 0,
    dingdan_fengmi: 0,
    isHebingdingdan: false,

  },

  tochoose_tkyy() {
    var that = this
    var tkyy_list = this.data.tkyy_list
    wx.showActionSheet({
      itemList: tkyy_list,
      success(res) {
        console.log(res.tapIndex)
        var value_tkyy = tkyy_list[res.tapIndex]
        if (res.tapIndex == 4) {
          value_tkyy = '其他'
        }
        that.setData({
          value_tkyy,
        })
      },
      fail(res) {
        console.log(res.errMsg)
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

  // 返回页面传参
  returnPre: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (this.data.isPaotui) {
      prevPage.setData({
        quxiao_chuancan_isPaotui: true,
      })
    } else if (this.data.isDaiqu) {
      prevPage.setData({
        quxiao_chuancan_isDaiqu: true,
      })

    }
    console.log('返回页面传参');
    wx.navigateBack({
      delta: 1,
    })
  },

  toQuxiao_paotui() {
    var _id = this.data._id
    var that = this
    wx.showModal({
      confirmColor: 'red',
      confirmText: '确认',
      content: '取消订单？',
      title: '提示',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.cloud.database().collection('paotui').doc(_id)
            .update({
              data: {
                dd_Status: '4'
              }
            })
            .then(res => {
              console.log('取消成功', res);
              that.returnPre()
            })
            .catch(err => {
              console.log(err);
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 退款窗口
  async toShow_tuikuan() {

    var {
      dingdanhao,
      isHebingdingdan
    } = this.data
    var hebingdanhao = dingdanhao.split('D')[0]
    // 查询是合并订单
    if (isHebingdingdan) {
      console.log('查询合并订单');
      db.collection('daiqu').where({
          dingdanhao: {
            // $regex: `/^${hebingdanhao}/`
            $regex: hebingdanhao
          }
        }).get()
        .then(res => {
          console.log('查询合并订单成功',res);
          var dingdanList = res.data

          // 若有一个订单状态不为0 则不能操作
          var isAllStatus = true
          for (var i = 0; i < dingdanList.length; i++) {
            if (dingdanList[i].dd_Status!= '0') {
              isAllStatus = false
              break
            }
          }
          if (!isAllStatus) {
            console.log('合并订单中有订单状态不为0 不能操作');
            // 提示订单状态已更新
            wx.showModal({
              title: '提示',
              content: '合并订单中已有订单取件中，不能操作退款',
              showCancel: false,
            })
            return
          }else{
            // 若全部订单状态为0 则可以操作
            console.log('合并订单中全部订单状态为0 可以操作');
            this.setData({
              dialogShow: true,
              dingdanList,
            })
          }

        })
        .catch(err => {
          console.log(err);
          wx.showToast({
            title: '查询订单失败',
            icon: 'error'
          })
        })

    } else {
      this.setData({
        dialogShow: true,
      })
    }

  },
  toClose_tuikuan() {
    this.setData({
      dialogShow: false,
    })
  },

  // 四舍五入
  sswr(num, w) {
    // return (Number(numStr)).toFixed(w)
    return Number(num.toFixed(w))
  },

  // 代取快递订单 退款
  async toShenqing_tuikuan() {
    console.log('toShenqing_tuikuan');

    var {
      dingdanhao,
      kd_Name,
      kd_PhoNum,
      qh_Ma,
      sd_Didian,
      xd_time,
      yizhifu,
      yizhifu_fengmi,
      yizhifu_jifen,
      dingdan_money,
      value_tkyy,
      isHebingdingdan,
      dingdanList,
      dingdan_jifen,
      dingdan_fengmi,
    } = this.data
    
    var daiqu_id = this.data._id
    var refund_fee = this.data.yizhifu
    var gzhOpenid = wx.getStorageSync('gzhOpenid')

    if (value_tkyy == '' || value_tkyy == 'undefined') {
      wx.showToast({
        title: '请选择原因',
        icon: 'none'
      })
      return
    }

    var user_id = wx.getStorageSync('id')
    var tk_time = utils_time.formatTime(new Date())
    // if (isHebingdingdan) {
    //   dingdanhao = dingdanhao.split('D')[0]
    //   console.log('dingdanhaoH',dingdanhao);
    // }

    // data ：退款申请时 提交的数据
    var data = {
      daiqu_id, //原始订单的_id
      kd_Name,
      kd_PhoNum,
      qh_Ma,
      sd_Didian,

      xd_time,
      tk_time,
      isYunxu_tuikuan: false,

      dingdanhao,
      // tuikuandanhao,
      yizhifu,
      refund_fee,
      yizhifu_fengmi,
      yizhifu_jifen,
      dingdan_money,
      user_id,
      value_tkyy,
      gzhOpenid
    }

    // 获取订单状态
    var resOrder = await wx.cloud.database().collection('daiqu').doc(daiqu_id).get()
    if (resOrder.data.dd_Status!='0'){
      console.log('无法操作订单', resOrder.data.dd_Status);
      // 提示订单状态已更新
      wx.showToast({
        title: '无法操作',
        icon:'none'
      })
      setTimeout(() => {
        this.returnPre()
        // wx.navigateBack({
        //   delta: 1,
        // })
      }, 1000)
   
      // // this.tapDaiqu()
      // // 返回上一页
      return
    }else{
      console.log('可以操作订单');
    }

    // 如果是合并支付的订单，提交申请时订单金额为总金额，退款时多个订单一起退
    if (isHebingdingdan) {
      console.log('合并付dingdan');
      // 若是微信支付，一起退
      dingdanhao = dingdanhao.split('D')[0]
      data.dingdanhao = dingdanhao
      data.dingdanList = dingdanList

      // data.dingdan_money = dingdan_money * dingdanList.length 
      data.dingdan_money = this.sswr(dingdan_money * dingdanList.length, 2)

      console.log('hebing data:', data);

      // 若是其他支付的订单无合并支付
    } 
    // else {
    //   data.yizhifu_jifen = dingdan_jifen
    //   data.yizhifu_fengmi = dingdan_fengmi
    // }

    var that = this
    this.toClose_tuikuan()
    wx.showModal({
      title: '退款',
      content: '提交后将取消订单',
      success(res) {
        if (res.confirm) {
          that.setData({
            tuikuanShow: false
          }) //隐藏退款按钮
          console.log('用户点击确定')
          var templateId = 'm0LiKsNOZMH1b8QKUqAioeACYUp4G7yiCwIM-q1C6_Q' //退款结果通知
          wx.requestSubscribeMessage({
              tmplIds: [templateId],
            })
            .then(res => {
              console.log('用户点击订阅退款结果通知：', res);

              // 有微信支付
              if (yizhifu !== 0) {

                // 提交退款申请单
                wx.showLoading({
                  title: '发起退款'
                })
                console.log('dingdanhao:::', dingdanhao);
                wx.cloud.callFunction({
                    name: 'apaytuikuan',
                    data: {
                      dingdanhao,
                      action: 'chaxundingdan'
                    },
                  })
                  .then(res => {
                    console.log('chaxun tuikuandanhao成功', res);
                    if (res.result.resultCode == 'FAIL') {
                      wx.showToast({
                        title: res.result.errCodeDes,
                      })
                      return
                    }
                    data.tuikuandanhao = res.result.transactionId

                    db.collection('tuikuan') //提交退款订单
                      .add({
                        data,
                      })
                      .then(res => {
                        console.log('退款申请提交成功：：', res);

                        //改变订单状态

                        // 若是合并支付订单
                        var idList = []
                        if (isHebingdingdan) {
                          dingdanList.forEach(element => {
                            idList.push(element._id)
                          });
                        } else {
                          idList = [daiqu_id]
                        }
                        // db.collection('daiqu').doc(daiqu_id)
                        db.collection('daiqu').where({
                            _id: _.or(idList)
                          })
                          .update({
                            data: {
                              dd_Status: '4'
                            }
                          })
                          .then(res => {
                            console.log('改变状态4，退款中：：', res);
                            wx.cloud.callFunction({
                                name: 'tuisongxiadannew',
                                data: {
                                  isTuikuan_daiqu: true,
                                  qh_Ma,
                                  sd_Didian,
                                  kd_Name,
                                  kd_PhoNum,

                                }
                              })
                              .then(res => {
                                console.log('退款通知 发送给管理员', res);
                              })
                            wx.showToast({
                              icon: 'none',
                              title: '退款已申请',
                            })
                            setTimeout(() => {
                              that.returnPre() // 返回页面传参 点击刷新

                            }, 1000);
                          })
                          .catch(err => {
                            console.log(err)
                          })
                      })
                      .catch(err => {
                        console.log(err)
                      })


                  })
                  .catch(err => {
                    console.log('【云函数】 chaxundingdan 失败', err)
                  })

              } else if (yizhifu == 0) { // 支付的金额为零 直接申请，不用查询退款单号
                db.collection('tuikuan') //提交退款订单
                  .add({
                    data,
                  })
                  .then(res => {
                    console.log('退款申请提交成功：：', res);
                    //改变订单状态
                    if (isHebingdingdan) {
                      // db.collection('daiqu').doc(daiqu_id)

                      // 若是合并支付订单
                      var idList = []
                      dingdanList.forEach(element => {
                        idList.push(element._id)
                      });
                      db.collection('daiqu').where({
                          _id: _.or(idList)
                        }).update({
                          data: {
                            dd_Status: '4'
                          }
                        })
                        .then(res => {
                          console.log('改变状态4，退款中：：', res);
                          wx.cloud.callFunction({
                              name: 'tuisongxiadannew',
                              data: {
                                isTuikuan_daiqu: true,
                                qh_Ma,
                                sd_Didian,
                                kd_Name,
                                kd_PhoNum,
                              }
                            })
                            .then(res => {
                              console.log('退款发送给管理员退款通知', res);
                            })
                          wx.showToast({
                            icon: 'none',
                            title: '订单已取消',
                          })
                          setTimeout(() => {
                            that.returnPre() // 返回页面传参 点击刷新

                          }, 1000);
                        })
                        .catch(err => {
                          console.log(err)
                        })

                    } else {
                      db.collection('daiqu').doc(daiqu_id)
                        .update({
                          data: {
                            dd_Status: '4'
                          }
                        })
                        .then(res => {
                          console.log('改变状态4，退款中：：', res);
                          wx.cloud.callFunction({
                              name: 'tuisongxiadannew',
                              data: {
                                isTuikuan_daiqu: true,
                                qh_Ma,
                                sd_Didian,
                                kd_Name,
                                kd_PhoNum,
                              }
                            })
                            .then(res => {
                              console.log('退款发送给管理员退款通知', res);
                            })
                          wx.showToast({
                            icon: 'none',
                            title: '订单已取消',
                          })
                          setTimeout(() => {
                            that.returnPre() // 返回页面传参 点击刷新

                          }, 1000);
                        })
                        .catch(err => {
                          console.log(err)
                        })

                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })


              }
            })
            .catch(err => {
              console.log('订阅退款消息失败', err);
            })

        } else if (res.cancel) {
          console.log('用户点击取消')
          that.toShow_tuikuan()
        }
      }
    })
  },
  // 美食订单 退款
  toShenqing_tuikuan_meishi() {
    console.log('退款');
    // console.log(e);
    var dingdan_id = this.data.cartData._id
    var dianpu_openid = this.data.cartData.dianpu.dianpu_openid
    var dingdanhao = this.data.cartData.dingdanhao
    var shijiMoney = this.data.cartData.shijiMoney
    var dingdan_neirong = (this.data.cartData.name + this.data.cartData.describe).slice(0, 20)
    var beizhu_tuisong = (this.data.cartData.address_meishi.value_phone + this.data.cartData.address_meishi.value_name).slice(0, 20)

    var dd_Status = '4'
    var timeName = 'tk_time'
    var gx_time = utils_time.formatTime(new Date())
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认退款吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var templateId = 'm0LiKsNOZMH1b8QKUqAioeACYUp4G7yiCwIM-q1C6_Q' //退款结果通知
          wx.requestSubscribeMessage({
              tmplIds: [templateId],
            })
            .then(res => {
              wx.showLoading({
                title: '提交中..',
              })
              wx.cloud.callFunction({
                  name: 'changedata',
                  data: {
                    action: 'changeStatus_meishi',
                    changeData: {
                      timeName,
                      dd_Status,
                      collection_name: 'meishi', //美食
                      gx_time,
                      dingdan_id,

                      dianpu_openid,
                      dingdan_neirong,
                      dingdanhao,
                      shijiMoney,
                      beizhu_tuisong,
                    }
                  }
                })
                .then(res => {
                  console.log('提交成功：：', res);
                  wx.showToast({
                    icon: 'none',
                    title: '操作完成',
                  })
                  // that.loadDingdan()
                  setTimeout(() => {
                    that.returnPre_onload()
                  }, 1000);
                })
                .catch(err => {
                  console.log(err);
                  wx.hideLoading({})
                })
            })


        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  returnPre_onload() {
    var pages = getCurrentPages(); //当前页面
    console.log(pages.length);
    var beforePage = pages[pages.length - 2]; //前一页
    beforePage.tapMeishi(); // 执行前一个页面的onLoad方法
    wx.navigateBack({
      delta: 1
    });
    // console.log(beforePage,'beforePage');
  },

  // 改变订单状态
  change_dd_Status(dd_Status, content_text, timeName, gx_time, dingdan_id, dianpu_openid) {



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


  onLoad: function (options) {
    console.log('页面加载 准备传参');
    if (options.isDaiqu) {
      console.log('代取 订单传递的参数是：', options);
      var yizhifu = Number(options.yizhifu)
      var yizhifu_fengmi = Number(options.yizhifu_fengmi)
      var yizhifu_jifen = Number(options.yizhifu_jifen)
      if (options.value_tkyy == 'undefined') {
        options.value_tkyy = ''
      }
      if (options.wxPaisong == 'undefined') {
        options.wxPaisong = ''
      }
      if (options.guitiDatas !== "undefined") {
        this.setData({
          guitiDatas: JSON.parse(options.guitiDatas),

        })

      }
      if (options.dingdanhao.indexOf('D') !== -1 && options.yizhifu > 0) {
        this.setData({
          isHebingdingdan: true
        })
      }
      if (options.dingdan_jifen == 'undefined') {
        options.dingdan_jifen = 0
      }
      if (options.dingdan_fengmi == 'undefined') {
        options.dingdan_fengmi = 0
      }

      this.setData({
        kd_Dian: options.kd_Dian,
        // trueName: options.trueName,
        kd_Name: options.kd_Name,
        kd_PhoNum: options.kd_PhoNum,
        qh_Ma: options.qh_Ma,
        sd_Didian: options.sd_Didian,
        xd_time: options.xd_time,
        isDaiqu: options.isDaiqu,
        dd_Status: options.dd_Status,
        _id: options.id,
        beizhu: options.beizhu,
        yizhifu_fengmi,
        yizhifu_jifen,
        dingdan_money: options.dingdan_money,
        yizhifu,
        dingdanhao: options.dingdanhao,
        wxPaisong: options.wxPaisong,
        value_tkyy: options.value_tkyy,
        tytuikuan_time: options.tytuikuan_time,
        beizhu_tuisong: options.beizhu_tuisong,
        wc_time: options.wc_time,
        songdaInfo: options.songdaInfo,
        dingdan_jifen: options.dingdan_jifen,
        dingdan_fengmi: options.dingdan_fengmi,
      })
    }
    if (options.isJijian) {
      console.log('寄件 订单传递的参数是：', options);
      this.setData({
        JJ_weight: options.JJ_weight,
        JJ_Name: options.JJ_Name,
        JJ_PhoNum: options.JJ_PhoNum,
        JJ_Didian: options.JJ_Didian,
        qujTime: options.qujTime,
        qujWupin: options.qujWupin,
        yundanNum: options.yundanNum,
        mdd: options.mdd,
        xd_time: options.xd_time,
        isJijian: options.isJijian,
        isChuli: options.isChuli,
        dd_Status: options.dd_Status,
        company: options.company,
      })
      // if (options.company) {
      //   this.setData({
      //     company: options.company,
      //   })
      // }
    }
    if (options.isPaotui) {
      console.log('[跑腿] 订单传递的参数是：', options);
      this.setData({
        paotui_name: options.paotui_name,
        phone: options.phone,
        xxDizhi: options.xxDizhi,
        xuqiu: options.xuqiu,
        xd_time: options.xd_time,
        isPaotui: options.isPaotui,
        dd_Status: options.dd_Status,
        _id: options._id,
      })
    }
    if (options.isMeishi) {
      console.log('[美食] 订单传递的参数是：', options);

      wx.cloud.database().collection('meishi').doc(options.id).get()
        .then(res => {
          console.log('下载meishi订单成功：', res);
          var cartData = res.data
          cartData.xingji_list = this.showXingji(cartData.pingjia.pingjia_fenshu)
          this.setData({
            isMeishi: options.isMeishi,
            cartData,
          })
        })

    }
  },
  // 点我复制到剪贴板
  toCopy() {
    wx.setClipboardData({
      data: this.data.yundanNum,
      success(res) {
        console.log('用户点击，成功复制微信号', res);
      }
    })
  },
  // 点我复制到剪贴板
  toCopyDingdanhao(e) {
    console.log(e);
    var data = e.currentTarget.dataset.val_copy
    wx.setClipboardData({
      data,
      success(res) {
        console.log('用户点击，成功复制', res);
      }
    })
  },
  // 点我复制到剪贴板
  toCopyNew(e) {
    console.log(e);
    var {
      data
    } = e.currentTarget.dataset
    wx.setClipboardData({
      data,
      success(res) {
        console.log('用户点击，成功复制', res);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})