// pages/wode/dingdan/dingdan.js
var utils_time = require('../../../utils/time.js') //获取时间等

var openid = wx.getStorageSync('openid')
const db = wx.cloud.database()
const _ = db.command
Page({

  data: {
    tapRes_qita: {},
    qitaResdata: {},
    qitaResdata_search: {},
    searchlist_qitaList: [],
    qitaList: [],

    dingdanList: [],
    dingdanListJJchuli: [],
    dingdanListJJyijichu: [],
    dingdanListJJquxiao: [],

    dingdanList_dq_chuli: [],
    dingdanList_dq_wancheng: [],
    dingdanList_dq_tuikuan: [],
    dingdanList_dq_qujianzhong: [],
    dingdanList_dq_paisong: [],

    paotuiList: [],
    dingdanList_pt_chuli: [],
    dingdanList_pt_wancheng: [],
    dingdanList_pt_quxiao: [],

    xunwuList: [],
    huangyeList: [],

    meishiList: [],
    dingdanList_ms_chuli: [],
    dingdanList_ms_wancheng: [],
    dingdanList_ms_tuikuan: [],

    pageNum: 1,
    isZanWu: false,
    isShowLoading: false,
    isGengDuo: false,
    isDaiqu: true,
    isAll_daiqu: true,
    isChuli_daiqu: false,
    isWancheng_daiqu: false,
    isTuikuan_daiqu: false,
    isQujianzhong_daiqu:false,

    isJijian: false,
    isAll_jijian: false,
    isChuli: false,
    isJichu: false,
    chuliNum: '',
    jichuNum: '',

    isPaotui: false,
    isAll_paotui: false,
    isChuli_paotui: false,
    isWancheng_paotui: false,
    isQuxiao_paotui: false,

    isMeishi: false,

    isCancel: false,
    isEdit: false,
    isShowFenshi: false,
    nowDate: '',
    nowTime: '',
    nowMinaTime1: '',
    yesterdayTime: '',
    shaixuanTime: '',

    isInputShowed: false,
    inputVal: "",
    searchResultList: [],
    isShowKong: false,

    isOpen: 'jiezhiNum2', //开启2个时间段
    // isOpen:'jiezhiNum0',//开启1个时间段
    time0: '',
    time1: '',
    time2: '',

    text_quxiao1:'当前包裹取件中，无法退款',
    text_quxiao2:'建议不要前往取件，避免产生冲突'
  },

  goPingjia(e) {
    console.log('评价');
    // console.log(e);
    var dingdan_id = e.currentTarget.dataset.id
    var dianpu_name = e.currentTarget.dataset.dianpu_name
    // console.log(dianpu_name,'dianpu_name');

    wx.navigateTo({
      url: '../../pingjia/pingjia?dingdan_id=' + dingdan_id +
        '&dianpu_name=' + dianpu_name,
    })
  },
  goSongda(e) {
    console.log('送达');
    // console.log(e);
    var dingdan_id = e.currentTarget.dataset.id
    var dd_Status = '3'
    var content_text = '确认送达吗？'
    var timeName = 'songda_time'
    var gx_time = utils_time.formatTime(new Date())
    this.change_dd_Status(dd_Status, content_text, timeName, gx_time, dingdan_id)

  },
  // 改变订单状态
  change_dd_Status(dd_Status, content_text, timeName, gx_time, dingdan_id) {

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
          var idArr = [dingdan_id]
          // showlist_danxuan.forEach(element => {
          //   idArr.push(element._id)
          // });
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

              that.tapMeishi()
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
  goSongda_meishi(e) {
    var showlist_danxuan = [e.currentTarget.dataset.showlist_danxuan]
    console.log(showlist_danxuan, 'meishi送达');
    var gx_time = utils_time.formatTime(new Date())
    // this.change_dd_Status_songda_fenzhang(gx_time, showlist_danxuan)
    this.change_dd_Status_songda(gx_time, showlist_danxuan)
  },
  // 改变订单状态 - 确认送达
  change_dd_Status_songda(gx_time, showlist_danxuan) {
    var that = this
    var _id = showlist_danxuan[0]._id
    wx.showModal({
      title: '提示',
      content: '确认送达吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '提交中..',
          })
          console.log('确认送达');
          wx.cloud.database().collection('meishi').doc(_id)
            .update({
              data: {
                dd_Status: '3',
                songda_time: gx_time,
              }
            })
            .then(res => {
              console.log(res, '确认送达');
              wx.showToast({
                icon: 'none',
                title: '已完成',
              })
              that.tapMeishi()
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
  // 改变订单状态 - 分账-送达
  change_dd_Status_songda_fenzhang(gx_time, showlist_danxuan) {

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
              that.tapMeishi()
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

  // 搜索
  toSearch() {
    console.log('开始对已下载的 结果列表 筛选 搜索');
    var _openid = wx.getStorageSync('openid')
    var searchword = this.data.inputVal
    if (searchword === '' || searchword === ' ') {
      wx.showToast({
        icon: 'none',
        title: '不能为空',
      })
      return
    }
    var searchResultList = []
    if (this.data.isDaiqu) {
      wx.cloud.callFunction({
          name: 'search',
          data: {
            searchType: 'daiqu',
            _openid: _openid
          }
        })
        .then(res => {
          console.log(res);
          var searchList = res.result
          searchList.forEach(element => {
            var qh_Ma = element.qh_Ma
            var kd_Dian = element.kd_Dian
            var xd_time = element.xd_time
            if (qh_Ma.includes(searchword) || kd_Dian.includes(searchword) || xd_time.includes(searchword)) {
              searchResultList.push(element)
            }
          });
          this.setData({
            searchResultList: searchResultList
          })
        })

    } else if (this.data.isJijian) {
      wx.cloud.callFunction({
          name: 'search',
          data: {
            searchType: 'jijian',
            _openid: _openid
          }
        })
        .then(res => {
          var dingdanListJJchuli = []
          var dingdanListJJyijichu = []
          var dingdanListJJquxiao = []
          res.result.forEach(element => {
            if (element.dd_Status < '3') {
              dingdanListJJchuli.push(element)
            } else if (element.dd_Status == '3') {
              dingdanListJJyijichu.push(element)
            } else if (element.dd_Status < '6') {
              dingdanListJJquxiao.push(element)
            }
          })
          if (this.data.isChuli) {
            var searchList = dingdanListJJchuli
          } else if (this.data.isJichu) {
            var searchList = dingdanListJJyijichu
          } else if (this.data.isQuxiao) {
            var searchList = dingdanListJJquxiao
          } else if (this.data.isAll_jijian) {
            var searchList = res.result
          }
          searchList.forEach(element => {
            var mdd = element.mdd
            var JJ_weight = element.JJ_weight
            var xd_time = element.xd_time
            if (mdd.includes(searchword) || JJ_weight.includes(searchword) || xd_time.includes(searchword)) {
              searchResultList.push(element)
            }
          });
          this.setData({
            searchResultList: searchResultList
          })
        })
    } else if (this.data.isPaotui) {
      wx.cloud.callFunction({
          name: 'search',
          data: {
            searchType: 'paotui',
            _openid: _openid
          }
        })
        .then(res => {
          console.log('查询paotui', res);
          res.result.forEach(element => {
            var xuqiu = element.xuqiu
            var xd_time = element.xd_time
            if (xuqiu.includes(searchword) || xd_time.includes(searchword)) {
              console.log('xuqiu', xuqiu);
              searchResultList.push(element)
            }
          });
          this.setData({
            searchResultList: searchResultList
          })
        })

    } else if (this.data.isMeishi) {
      wx.cloud.callFunction({
          name: 'search',
          data: {
            searchType: 'meishi',
            _openid: _openid
          }
        })
        .then(res => {
          console.log('查询 meishi', res);
          res.result.forEach(element => {
            var cartList = element.cartList
            cartList.forEach(element1 => {
              if (element1.name.includes(searchword)) {
                searchResultList.push(element)
              }
            });
          });
          this.setData({
            searchResultList: searchResultList
          })
        })
    } else if (this.data.isQita) {
      wx.cloud.callFunction({
          name: 'search',
          data: {
            searchType: 'qita',
            _openid: _openid
          }
        })
        .then(res => {
          console.log('查询 qita', res);

          var searchResultList = []
          var qitaResdata_search = []
          this.data.tapRes_qita.forEach(element => {
            var hunheSearch = element.picker_0 + element.picker_1 + element.picker_2 + element.text_title + element.picker_zhifu + element.input_0 + element.input_1 + element.input_2 + element.input_3 + element.input_4
            // var hunheSearch = element.text_title
            if (hunheSearch.includes(searchword)) {
              qitaResdata_search.push(element.qitaResdata)
              var newElement = this.objtoarr(element)
              searchResultList.push(newElement)
            }
          });


          // // var searchResultList = []
          // var qitaResdata_search = []
          // var qitaList = this.data.qitaList
          // var qitaResdata = this.data.qitaResdata
          // qitaList.forEach((element,index) => {
          //   var checked = false
          //   element.forEach(element1 => {
          //     console.log(element1);
          //     if (element1.includes(searchword)) {
          //       checked = true
          //     }
          //   });
          //   if (checked) {
          //     qitaResdata_search.push(qitaResdata[index])
          //     searchResultList.push(element)
          //   }
          // });

          this.setData({
            searchResultList,
            qitaResdata_search,
          })
        })
    }
    this.setData({
      isShowKong: true,
    })


  },

  showInput: function () {
    this.setData({
      isInputShowed: true,
      isShowKong: false,
      searchResultList: []
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      isInputShowed: false,
      searchResultList: [],
      isShowKong: false,
    });

  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.showInput()
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  // //美食订单选项
  // toAll() {
  //   this.setData({
  //     isAll: true,
  //     isFukuan: false,
  //     isQueren: false,
  //     isPingjia: false,
  //     isTuikuan: false,
  //   })
  //   // this.tapMeishi()
  // },
  // tofukuan() {
  //   this.setData({
  //     isAll: false,
  //     isFukuan: true,
  //     isQueren: false,
  //     isPingjia: false,
  //     isTuikuan: false,
  //   })
  // },
  // toQueren() {
  //   this.setData({
  //     isAll: false,
  //     isFukuan: false,
  //     isQueren: true,
  //     isPingjia: false,
  //     isTuikuan: false,
  //   })
  // },
  // toPingjia() {
  //   this.setData({
  //     isAll: false,
  //     isFukuan: false,
  //     isQueren: false,
  //     isPingjia: true,
  //     isTuikuan: false,
  //   })
  // },
  // toTuikuan() {
  //   this.setData({
  //     isAll: false,
  //     isFukuan: false,
  //     isQueren: false,
  //     isPingjia: false,
  //     isTuikuan: true,
  //   })
  // },

  // 获取订单状态
  getOrderInfo(_id){
    wx.cloud.database().collection('daiqu').doc(_id)
    .get()
    .then(res => {
      console.log('获取代取订单数据：：', res);
      // 如果订单不等于1不能操作
      if (res.dd_Status!='1'){
        console.log('无法操作订单');
      }else{
        console.log('可以操作订单');
      }
      // this.setData({
      //   isEdit: options.isEdit,
      //   kd_Dian: res.data.kd_Dian,
      //   value_qh_Ma: res.data.qh_Ma,
      //   value_kd_Name: res.data.kd_Name,
      //   value_kd_PhoNum: res.data.kd_PhoNum,
      //   sd_Didian_sdSushe,
      //   sd_Didian_sdLoudong,
      //   value_beizhu: res.data.beizhu,

      //   _id,
      // })
    })
  },

  // 编辑
  async toEdit(e) {
    var _id = e.currentTarget.dataset.id
    console.log('_id', _id);
    if (this.data.isJijian) {
      // var kd_Dian = e.currentTarget.dataset.kd_dian
      // var qh_Ma = e.currentTarget.dataset.qh_ma
      wx.navigateTo({
        url: '../../shouye/jizou/jizou?' +
          '&_id=' + _id +
          // '&kd_Dian=' + kd_Dian +
          // '&qh_Ma=' + qh_Ma +
          '&isEdit=ture'
      })
    } else if (this.data.isDaiqu) {
      
      // 获取订单状态
      var res = await wx.cloud.database().collection('daiqu').doc(_id).get()
      if (res.data.dd_Status!='0'){
        console.log('无法操作订单', res.data.dd_Status);
        // 提示订单状态已更新
        wx.showToast({
          title: '订单状态需更新',
          icon:'none'
        })
        this.tapDaiqu()
        return
      }else{
        console.log('可以操作订单');
        
        // // 判断是否微信支付的合并订单
        // var dingdanhao = e.currentTarget.dataset.dingdanhao
        // console.log('dingdanhao',dingdanhao);
        // // 如果订单号中包含“D”则是合并订单
        // if (dingdanhao.indexOf('D') > -1) {
        //   // 查询合并订单所有订单

        //   var hebingdanhao = dingdanhao.split('D')[0]
        //   // 查询是合并订单
        //   db.collection('daiqu').where({
        //       dingdanhao: {
        //         // $regex: `/^${hebingdanhao}/`
        //         $regex: hebingdanhao
        //       }
        //     }).get()
        //     .then(res => {
        //       console.log(res);
        //       var dingdanList = res.data
        //       // 若有一个订单状态不为0 则不能操作
        //       var isAllStatus = true
        //       for (var i = 0; i < dingdanList.length; i++) {
        //         if (dingdanList[i].dd_Status!= '0') {
        //           isAllStatus = false
        //           break
        //         }
        //       }
        //       if (!isAllStatus) {
        //         console.log('合并订单中有订单状态不为0 不能操作');
        //         // 提示订单状态已更新
        //         wx.showModal({
        //           title: '提示',
        //           content: '合并订单中已有订单取件中，不能操作',
        //           showCancel: false,
        //         })
        //         this.tapDaiqu()
        //         return
        //       } else {
        //         console.log('可以操作合并订单');
        //         // 带参数跳转到详情
        //         var kd_Dian = e.currentTarget.dataset.kd_dian
        //         var qh_Ma = e.currentTarget.dataset.qh_ma
        //         wx.navigateTo({
        //           url: '../../shouye/daiqu/daiqu?' +
        //             '&_id=' + _id +
        //             '&kd_Dian=' + kd_Dian +
        //             '&qh_Ma=' + qh_Ma +
        //             '&isEdit=ture'
        //         })
        //       }
        //     })
        //     .catch(err => {
        //       console.log(err);
        //     })
        // }else{
        //   console.log('可以操作订单');
        //   // 带参数跳转到详情
        //   var kd_Dian = e.currentTarget.dataset.kd_dian
        //   var qh_Ma = e.currentTarget.dataset.qh_ma
        //   wx.navigateTo({
        //     url: '../../shouye/daiqu/daiqu?' +
        //       '&_id=' + _id +
        //       '&kd_Dian=' + kd_Dian +
        //       '&qh_Ma=' + qh_Ma +
        //       '&isEdit=ture'
        //   })
        // }
      }

      // 带参数跳转到详情
      var kd_Dian = e.currentTarget.dataset.kd_dian
      var qh_Ma = e.currentTarget.dataset.qh_ma
      wx.navigateTo({
        url: '../../shouye/daiqu/daiqu?' +
          '&_id=' + _id +
          '&kd_Dian=' + kd_Dian +
          '&qh_Ma=' + qh_Ma +
          '&isEdit=ture'
      })

    }
  },

  // 送达
  toSongda(e) {
    console.log('tosongda', e.currentTarget.dataset.id);
    var _id = e.currentTarget.dataset.id
    var that = this
    var wc_time = utils_time.formatTime(new Date())

    wx.showModal({
      title: '提示',
      content: '确认送达',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection('daiqu').doc(_id)
            .update({
              data: {
                wc_time,
                beizhu_tuisong:'本人点击确认送达',
                dd_Status: '3'
              }
            })
            .then(res => {
              console.log('代取 确认送达 成功', res)
              that.tapDaiqu()
            })
            .catch(console.error())
        } else if (res.cancel) {
          console.log('用户点击取消')

        }
      }
    })
  },


  // 取消
  toCancel(e) {
    console.log('点击toCancel', e.currentTarget.dataset.id);
    this.setData({
      isCancel: true,
      _id: e.currentTarget.dataset.id
    })

  },
  toCancelclose() {
    this.setData({
      isCancel: false
    })
  },
  toCancelconfirm() {
    var _id = this.data._id
    if (this.data.isJijian) {
      db.collection('jijian').doc(_id)
        .update({
          data: {
            dd_Status: '4'
          }
        })
        .then(res => {
          console.log('寄件 取消 成功', res)
          this.toCancelclose()
          this.tapJijian()
          // 订单取消提醒
          var qujTime = res.qujTime
          var qujDate = res.qujDate
          var JJ_Didian = res.JJ_Didian
          wx.cloud.callFunction({
              name: 'tuisongxiadannew',
              data: {
                isJijian: true,
                // JJ_Name: JJ_Name,
                qujTime,
                qujDate,
                JJ_Didian,
                openid: openid,
                action: '已取消',
              }
            })
            .then(res => {
              console.log('[代取下单] 提醒推送 成功', res)
              wx.showToast({
                icon: 'none',
                title: '订单已取消',
              })
            })
            .catch(err => {
              console.log('[代取下单] 提醒推送 失败：', err)
            })
        })
        .catch(console.error())

    } else if (this.data.isDaiqu) {
      db.collection('daiqu').doc(_id)
        // .update({
        //   data: {
        //     dd_Status: '4'
        //   }
        // })
        .remove()
        .then(res => {
          console.log('代取订单 删除 成功', res)
          this.toCancelclose()
          this.tapDaiqu()
          wx.showToast({
            icon: 'none',
            title: '订单已删除',
          })

        })
        .catch(console.error())
    }
  },

  // 对象变数组
  objtoarr(dictObject) {
    var createArr = []
    for (let i in dictObject) {
      createArr.push(dictObject[i]);
    }
    return createArr
  },
  //其他选项卡
  tapQita() {

    this.setData({
      isQita: true,

      pageNum: 1,

      isDaiqu: false,
      isAll_daiqu: false,
      isChuli_daiqu: false,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,

      isJijian: false,
      isAll_jijian: false,
      isChuli: false,
      isJichu: false,
      isQuxiao: false,

      isPaotui: false,
      isAll_paotui: false,
      isChuli_paotui: false,
      isWancheng_paotui: false,
      isQuxiao_paotui: false,

      isMeishi: false,
      isAll_meishi: false,
      isChuli_meishi: false,
      isWancheng_meishi: false,
      isTuikuan_meishi: false,

      isInputShowed: false,
      searchResultList: [],
      // 点击 代取 的时候 寄件 的列表要清空
      dingdanList: [],

      dingdanListJJchuli: [],
      dingdanListJJyijichu: [],
      dingdanListJJquxiao: [],
 
      dingdanList_dq_chuli: [],
      dingdanList_dq_wancheng: [],
      dingdanList_dq_tuikuan: [],

      paotuiList: [],
      dingdanList_pt_chuli: [],
      dingdanList_pt_wancheng: [],
      dingdanList_pt_quxiao: [],

      meishiList: [],
      dingdanList_ms_chuli: [],
      dingdanList_ms_wancheng: [],
      dingdanList_ms_tuikuan: [],


    })

    db.collection('qita').where({
        _openid: openid,
        dd_Status: _.neq('1') //和代取一样 未成功支付为1 支付完成为0 未支付不展示给用户
      })
      .orderBy('xd_time', 'desc')
      .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 qitaList 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            isZanWu: true
          })
        } else {
          var qitaList = []
          var qitaResdata = []
          res.data.forEach(element => {
            qitaResdata.push(element.qitaResdata)
            var newElement = this.objtoarr(element)
            qitaList.push(newElement)
          });
          this.setData({
            qitaList,
            qitaResdata,
            tapRes_qita: res.data
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  //美食选项卡
  tapMeishi() {

    this.setData({
      isQita: false,

      pageNum: 1,

      isDaiqu: false,
      isAll_daiqu: false,
      isChuli_daiqu: false,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,

      isJijian: false,
      isAll_jijian: false,
      isChuli: false,
      isJichu: false,
      isQuxiao: false,

      isPaotui: false,
      isAll_paotui: false,
      isChuli_paotui: false,
      isWancheng_paotui: false,
      isQuxiao_paotui: false,

      isMeishi: true,
      isAll_meishi: true,
      isChuli_meishi: false,
      isWancheng_meishi: false,
      isTuikuan_meishi: false,

      isInputShowed: false,
      searchResultList: [],
      // 点击 代取 的时候 寄件 的列表要清空
      dingdanList: [],

      dingdanListJJchuli: [],
      dingdanListJJyijichu: [],
      dingdanListJJquxiao: [],

      dingdanList_dq_chuli: [],
      dingdanList_dq_wancheng: [],
      dingdanList_dq_tuikuan: [],

      paotuiList: [],
      dingdanList_pt_chuli: [],
      dingdanList_pt_wancheng: [],
      dingdanList_pt_quxiao: [],

      meishiList: [],
      dingdanList_ms_chuli: [],
      dingdanList_ms_wancheng: [],
      dingdanList_ms_tuikuan: [],

    })
    this.toAll_meishi()
    db.collection('meishi').where({
        _openid: openid,
        dd_Status: _.neq('1') //和代取一样 未成功支付为1 支付完成为0 未支付不展示给用户
      })
      .orderBy('xd_time', 'desc')
      .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 meishi 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            isZanWu: true
          })
        } else {
          // this.setData({
          //   meishiList: res.data,
          // })

          var meishiList = res.data
          var dingdanList_ms_chuli = this.data.dingdanList_ms_chuli
          var dingdanList_ms_wancheng = this.data.dingdanList_ms_wancheng
          var dingdanList_ms_tuikuan = this.data.dingdanList_ms_tuikuan
          meishiList.forEach(element => {
            if (element.dd_Status < '3') {
              dingdanList_ms_chuli.push(element)
            } else if (element.dd_Status == '3' || element.dd_Status == '7') {
              dingdanList_ms_wancheng.push(element)
            } else if (element.dd_Status < '7') {
              // console.log('dingdanList_ms_tuikuan',dingdanList_ms_tuikuan);
              dingdanList_ms_tuikuan.push(element)
            }
          });
          this.setData({
            meishiList,
            chuliNum: dingdanList_ms_chuli.length,
            dingdanList_ms_chuli,
            dingdanList_ms_wancheng,
            dingdanList_ms_tuikuan,
          })
          console.log('处理中 的订单列表：', dingdanList_ms_chuli);
          console.log('完成 的订单列表：', dingdanList_ms_wancheng);
          console.log('退款 的订单列表：', dingdanList_ms_tuikuan);



        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  // 美食选项卡2
  toAll_meishi() {
    this.setData({
      pageNum: 1,
      isAll_meishi: true,
      isChuli_meishi: false,
      isWancheng_meishi: false,
      isTuikuan_meishi: false,
      isInputShowed: false,
    })
  },
  toChuli_meishi() {
    this.setData({
      pageNum: 1,
      isAll_meishi: false,
      isChuli_meishi: true,
      isWancheng_meishi: false,
      isTuikuan_meishi: false,
      isInputShowed: false,
    })
  },
  toWancheng_meishi() {
    this.setData({
      pageNum: 1,
      isAll_meishi: false,
      isChuli_meishi: false,
      isWancheng_meishi: true,
      isTuikuan_meishi: false,
      isInputShowed: false,
    })
  },
  toTuikuan_meishi() {
    this.setData({
      pageNum: 1,
      isAll_meishi: false,
      isChuli_meishi: false,
      isWancheng_meishi: false,
      isTuikuan_meishi: true,
      isInputShowed: false,
    })
  },




  // 跑腿选项卡
  tapPaotui() {
    this.setData({
      isQita: false,

      pageNum: 1,

      isDaiqu: false,
      isAll_daiqu: false,
      isChuli_daiqu: false,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,

      isJijian: false,
      isAll_jijian: false,
      isChuli: false,
      isJichu: false,
      isQuxiao: false,

      isPaotui: true,
      isAll_paotui: false,
      isChuli_paotui: true,
      isWancheng_paotui: false,
      isQuxiao_paotui: false,

      isMeishi: false,
      isAll_meishi: false,
      isChuli_meishi: false,
      isWancheng_meishi: false,
      isTuikuan_meishi: false,

      isInputShowed: false,
      searchResultList: [],
      // 点击 代取 的时候 寄件 的列表要清空
      dingdanList: [],

      dingdanListJJchuli: [],
      dingdanListJJyijichu: [],
      dingdanListJJquxiao: [],

      dingdanList_dq_chuli: [],
      dingdanList_dq_wancheng: [],
      dingdanList_dq_tuikuan: [],

      paotuiList: [],
      dingdanList_pt_chuli: [],
      dingdanList_pt_wancheng: [],
      dingdanList_pt_quxiao: [],

      meishiList: [],
      dingdanList_ms_chuli: [],
      dingdanList_ms_wancheng: [],
      dingdanList_ms_tuikuan: [],

    })
    db.collection('paotui').where({
        _openid: openid
      })
      .orderBy('xd_time', 'desc')
      .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 paotui 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            isZanWu: true
          })
        } else {
          var paotuiList = res.data
          var dingdanList_pt_chuli = this.data.dingdanList_pt_chuli
          var dingdanList_pt_wancheng = this.data.dingdanList_pt_wancheng
          var dingdanList_pt_quxiao = this.data.dingdanList_pt_quxiao
          paotuiList.forEach(element => {
            if (element.dd_Status < '3') {
              dingdanList_pt_chuli.push(element)
            } else if (element.dd_Status == '3') {
              dingdanList_pt_wancheng.push(element)
            } else if (element.dd_Status < '6') {
              dingdanList_pt_quxiao.push(element)
            }
          });
          this.setData({
            paotuiList,
            dingdanList_pt_chuli,
            dingdanList_pt_wancheng,
            dingdanList_pt_quxiao,
          })
          console.log('处理中 的订单列表：', dingdanList_pt_chuli);
          console.log('完成 的订单列表：', dingdanList_pt_wancheng);
          console.log('取消 的订单列表：', dingdanList_pt_quxiao);

        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  toAll_paotui() {
    this.setData({
      pageNum: 1,
      isAll_paotui: true,
      isChuli_paotui: false,
      isWancheng_paotui: false,
      isQuxiao_paotui: false,
      isInputShowed: false,
    })
  },
  toChuli_paotui() {
    this.setData({
      pageNum: 1,
      isAll_paotui: false,
      isChuli_paotui: true,
      isWancheng_paotui: false,
      isQuxiao_paotui: false,
      isInputShowed: false,
    })
  },
  toWancheng_paotui() {
    this.setData({
      pageNum: 1,
      isAll_paotui: false,
      isChuli_paotui: false,
      isWancheng_paotui: true,
      isQuxiao_paotui: false,
      isInputShowed: false,
    })
  },
  toQuxiao_paotui() {
    this.setData({
      pageNum: 1,
      isAll_paotui: false,
      isChuli_paotui: false,
      isWancheng_paotui: false,
      isQuxiao_paotui: true,
      isInputShowed: false,
    })
  },

  // 代取 选项卡
  tapDaiqu() {
    this.setData({
      isQita: false,

      pageNum: 1,

      isDaiqu: true,
      isAll_daiqu: false,
      isChuli_daiqu: true,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,
      isQujianzhong_daiqu: false,  // 取件中

      isJijian: false,
      isAll_jijian: false,
      isChuli: false,
      isJichu: false,
      isQuxiao: false,

      isPaotui: false,
      isAll_paotui: false,
      isChuli_paotui: false,
      isWancheng_paotui: false,
      isQuxiao_paotui: false,

      isMeishi: false,
      isAll_meishi: false,
      isChuli_meishi: false,
      isWancheng_meishi: false,
      isTuikuan_meishi: false,

      isInputShowed: false,
      searchResultList: [],
      // 点击 代取 的时候 寄件 的列表要清空
      dingdanList: [],

      dingdanListJJchuli: [],
      dingdanListJJyijichu: [],
      dingdanListJJquxiao: [],

      dingdanList_dq_chuli: [],
      dingdanList_dq_wancheng: [],
      dingdanList_dq_tuikuan: [],
      dingdanList_dq_qujianzhong: [],
      dingdanList_dq_paisong: [],

      paotuiList: [],
      dingdanList_pt_chuli: [],
      dingdanList_pt_wancheng: [],
      dingdanList_pt_quxiao: [],

      meishiList: [],
      dingdanList_ms_chuli: [],
      dingdanList_ms_wancheng: [],
      dingdanList_ms_tuikuan: [],

    })
    db.collection('daiqu').where({
        _openid: openid,
        dd_Status: _.neq('1') //未成功支付为1 支付完成为0 未支付不展示给用户

      })
      .orderBy('xd_time', 'desc')
      .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 daiqu 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            // dingdanList:res.data,
            isZanWu: true
          })
        } else {
          var dingdanList = res.data
          var {
            dingdanList_dq_qujianzhong,
            dingdanList_dq_paisong,
            dingdanList_dq_chuli,
            dingdanList_dq_wancheng,
            dingdanList_dq_tuikuan
          } = this.data
          dingdanList.forEach(element => {
            if (element.dd_Status == '0') {
              dingdanList_dq_chuli.push(element)
            }
            if (element.dd_Status == '2') {  // 新增 取件中
              dingdanList_dq_qujianzhong.push(element)
            }
            if (element.dd_Status == '3') {
              dingdanList_dq_wancheng.push(element)
            }
            if (element.dd_Status >= '4'&& element.dd_Status<='6') {
              dingdanList_dq_tuikuan.push(element)
            }
            if (element.dd_Status == '7'|| element.dd_Status == '8') {  // 已装车7，问题件8
              dingdanList_dq_paisong.push(element)
            }

          });
          this.setData({
            dingdanList,
            chuliNum: dingdanList_dq_chuli.length,
            dingdanList_dq_chuli,
            dingdanList_dq_wancheng,
            dingdanList_dq_tuikuan,
            dingdanList_dq_qujianzhong,
            dingdanList_dq_paisong,
          })
          console.log('处理中 的订单列表：', dingdanList_dq_chuli);
          console.log('完成 的订单列表：', dingdanList_dq_wancheng);
          console.log('退款 的订单列表：', dingdanList_dq_tuikuan);
          console.log('取件中 的订单列表：', dingdanList_dq_qujianzhong);
          console.log('派送中 的订单列表：', dingdanList_dq_paisong);
        }

        // this.setData({
        //   dingdanList: res.data,
        // })

      })
      .catch(err => {
        console.error(err)
      })
  },
  toAll_daiqu() {
    this.setData({
      pageNum: 1,
      isAll_daiqu: true,
      isChuli_daiqu: false,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,
      isInputShowed: false,
      isQujianzhong_daiqu:false,
      isPaisong_daiqu:false,
    })
  },
  toChuli_daiqu() {
    this.setData({
      pageNum: 1,
      isAll_daiqu: false,
      isChuli_daiqu: true,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,
      isInputShowed: false,
      isQujianzhong_daiqu:false,
      isPaisong_daiqu:false,

    })
  },
  toPaisong() {
    this.setData({
      pageNum: 1,
      isAll_daiqu: false,
      isChuli_daiqu: false,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,
      isInputShowed: false,
      isQujianzhong_daiqu:false,
      isPaisong_daiqu:true

    })
  },
  toWancheng() {
    this.setData({
      pageNum: 1,
      isAll_daiqu: false,
      isChuli_daiqu: false,
      isWancheng_daiqu: true,
      isTuikuan_daiqu: false,
      isInputShowed: false,
      isQujianzhong_daiqu:false,
      isPaisong_daiqu:false,

    })
  },
  toTuikuan() {
    this.setData({
      pageNum: 1,
      isAll_daiqu: false,
      isChuli_daiqu: false,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: true,
      isInputShowed: false,
      isQujianzhong_daiqu:false,
      isPaisong_daiqu:false,

    })
  },
  toQujianzhong() {
    this.setData({
      pageNum: 1,
      isAll_daiqu: false,
      isChuli_daiqu: false,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,
      isInputShowed: false,
      isQujianzhong_daiqu:true,
      isPaisong_daiqu:false,
    })
  },

  // 寄件选项卡
  tapJijian() {
    this.setData({
      isQita: false,

      pageNum: 1,

      isDaiqu: false,
      isAll_daiqu: false,
      isChuli_daiqu: false,
      isWancheng_daiqu: false,
      isTuikuan_daiqu: false,
      isQujianzhong_daiqu:false,
      isPaisong_daiqu:false,


      isJijian: true,
      isAll_jijian: false,
      isChuli: true,
      isJichu: false,
      isQuxiao: false,

      isPaotui: false,
      isAll_paotui: false,
      isChuli_paotui: false,
      isWancheng_paotui: false,
      isQuxiao_paotui: false,

      isMeishi: false,
      isAll_meishi: false,
      isChuli_meishi: false,
      isWancheng_meishi: false,
      isTuikuan_meishi: false,

      isInputShowed: false,
      searchResultList: [],
      // 点击 代取 的时候 寄件 的列表要清空
      dingdanList: [],

      dingdanListJJchuli: [],
      dingdanListJJyijichu: [],
      dingdanListJJquxiao: [],

      dingdanList_dq_chuli: [],
      dingdanList_dq_wancheng: [],
      dingdanList_dq_tuikuan: [],
      dingdanList_dq_paisong: [],
      dingdanList_dq_qujianzhong: [],

      paotuiList: [],
      dingdanList_pt_chuli: [],
      dingdanList_pt_wancheng: [],
      dingdanList_pt_quxiao: [],

      meishiList: [],
      dingdanList_ms_chuli: [],
      dingdanList_ms_wancheng: [],
      dingdanList_ms_tuikuan: [],

    })

    db.collection('jijian').where({
        _openid: openid
      })
      .orderBy('xd_time', 'desc')
      .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 jijian 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            // dingdanList:res.data,
            isZanWu: true
          })
        } else {
          var dingdanList = res.data
          var dingdanListJJchuli = this.data.dingdanListJJchuli
          var dingdanListJJyijichu = this.data.dingdanListJJyijichu
          var dingdanListJJquxiao = this.data.dingdanListJJquxiao
          dingdanList.forEach(element => {
            if (element.dd_Status < '3') {
              dingdanListJJchuli.push(element)
            } else if (element.dd_Status == '3') {
              dingdanListJJyijichu.push(element)
            } else if (element.dd_Status < '6') {
              dingdanListJJquxiao.push(element)
            }
          });
          this.setData({
            dingdanList,
            chuliNum: dingdanListJJchuli.length,
            dingdanListJJchuli,
            dingdanListJJyijichu,
            dingdanListJJquxiao
          })
          console.log('处理中的订单列表：', dingdanListJJchuli);
          console.log('已寄出的订单列表：', dingdanListJJyijichu);
          console.log('已取消的订单列表：', dingdanListJJquxiao);

        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  toAll_jijian() {
    this.setData({
      pageNum: 1,
      isAll_jijian: true,
      isJichu: false,
      isChuli: false,
      isQuxiao: false,
      isInputShowed: false,
    })
  },
  toChuli() {
    this.setData({
      pageNum: 1,
      isAll_jijian: false,
      isJichu: false,
      isChuli: true,
      isQuxiao: false,
      isInputShowed: false,
    })
  },
  toYijichu() {
    this.setData({
      pageNum: 1,
      isAll_jijian: false,
      isJichu: true,
      isChuli: false,
      isQuxiao: false,
      isInputShowed: false,
    })
  },
  toQuxiao() {
    this.setData({
      pageNum: 1,
      isAll_jijian: false,
      isJichu: false,
      isChuli: false,
      isQuxiao: true,
      isInputShowed: false,
    })
  },


  toXiangQing(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var {
      isJijian,
      isAll_jijian,
      isChuli,
      isJichu,
      isQuxiao,
      isDaiqu,
      isAll_daiqu,
      isChuli_daiqu,
      isQujianzhong_daiqu,
      isPaisong_daiqu,
      isWancheng_daiqu,
      isTuikuan_daiqu,
      isPaotui,
      isAll_paotui,
      isChuli_paotui,
      isWancheng_paotui,
      isQuxiao_paotui,
      isMeishi,
      isInputShowed
    } = this.data
    if (isDaiqu) {
      console.log('用户点击 [代取] 绑定的数据', e)
      if (isInputShowed) {
        var dingdanList = this.data.searchResultList
      } else {
        if (isAll_daiqu) {
          var dingdanList = this.data.dingdanList
        } else if (isChuli_daiqu) {
          var dingdanList = this.data.dingdanList_dq_chuli
        } else if (isWancheng_daiqu) {
          var dingdanList = this.data.dingdanList_dq_wancheng
        } else if (isTuikuan_daiqu) {
          var dingdanList = this.data.dingdanList_dq_tuikuan
        } else if (isQujianzhong_daiqu) {
          var dingdanList = this.data.dingdanList_dq_qujianzhong
        } else if (isPaisong_daiqu) {
          var dingdanList = this.data.dingdanList_dq_paisong
        }
      }

      var {
        wxPaisong,
        xd_time,
        kd_Dian,
        trueName,
        kd_Name,
        kd_PhoNum,
        qh_Ma,
        sd_Didian,
        dd_Status,
        beizhu,
        yizhifu,
        dingdan_money,
        yizhifu_fengmi,
        yizhifu_jifen,
        dingdanhao,
        tuikuandanhao,
        tytuikuan_time,
        beizhu_tuisong,
        value_tkyy,
        wc_time,
        guitiDatas,
        songdaInfo,
        dingdan_jifen,
        dingdan_fengmi,
      } = dingdanList[index]
      if (dingdan_money == undefined) {
        var dingdan_money = '-'
      }
      // var isDaiqu = this.data.isDaiqu
      //带参数跳转页面 传参
      console.log('dingdan准备传参',dingdanList[index]);
      if (qh_Ma.length >100) {
        qh_Ma = qh_Ma.slice(0,100)+'...'
      }
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&kd_Dian=' + kd_Dian +
          '&trueName=' + trueName +
          '&kd_Name=' + kd_Name +
          '&kd_PhoNum=' + kd_PhoNum +
          '&qh_Ma=' + qh_Ma +
          // ok1Nu5LdvbNEnZR4cfzsK6pUFxA4
          // ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4
          '&sd_Didian=' + sd_Didian +
          '&xd_time=' + xd_time +
          '&dd_Status=' + dd_Status +
          '&beizhu=' + beizhu +
          '&yizhifu=' + yizhifu +
          '&dingdan_money=' + dingdan_money +
          '&yizhifu_fengmi=' + yizhifu_fengmi +
          '&yizhifu_jifen=' + yizhifu_jifen +
          '&dingdanhao=' + dingdanhao +
          '&tuikuandanhao=' + tuikuandanhao +
          '&value_tkyy=' + value_tkyy +
          '&wxPaisong=' + wxPaisong +
          '&tytuikuan_time=' + tytuikuan_time +
          '&beizhu_tuisong=' + beizhu_tuisong +
          '&wc_time=' + wc_time +
          '&guitiDatas=' + JSON.stringify(guitiDatas) +
          '&songdaInfo=' + songdaInfo +
          '&dingdan_jifen=' + dingdan_jifen +
          '&dingdan_fengmi=' + dingdan_fengmi +
          '&isDaiqu=' + isDaiqu
      })
    }
    if (isAll_jijian) {
      console.log('用户点击 [全部中订单] 绑定的数据', e)
      if (isInputShowed) {
        var dingdanList = this.data.searchResultList

      } else {
        var dingdanList = this.data.dingdanList

      }
      var xd_time = dingdanList[index].xd_time
      var JJ_weight = dingdanList[index].JJ_weight
      var JJ_Name = dingdanList[index].JJ_Name
      var JJ_PhoNum = dingdanList[index].JJ_PhoNum
      var qujTime = dingdanList[index].qujTime
      var qujWupin = dingdanList[index].qujWupin
      var mdd = dingdanList[index].mdd
      var JJ_Didian = dingdanList[index].JJ_Didian
      var yundanNum = dingdanList[index].yundanNum
      var company = dingdanList[index].company
      var dd_Status = dingdanList[index].dd_Status

      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&JJ_weight=' + JJ_weight +
          '&JJ_Name=' + JJ_Name +
          '&JJ_PhoNum=' + JJ_PhoNum +
          '&qujTime=' + qujTime +
          '&qujWupin=' + qujWupin +
          '&JJ_Didian=' + JJ_Didian +
          '&company=' + company +
          '&yundanNum=' + yundanNum +
          '&mdd=' + mdd +
          '&xd_time=' + xd_time +
          '&isJijian=' + isJijian +
          '&dd_Status=' + dd_Status +
          '&isChuli=' + isChuli
      })
    }
    if (isChuli) {
      console.log('用户点击 [处理中] 绑定的数据', e)
      if (isInputShowed) {
        var dingdanListJJchuli = this.data.searchResultList

      } else {
        var dingdanListJJchuli = this.data.dingdanListJJchuli

      }
      var xd_time = dingdanListJJchuli[index].xd_time
      var JJ_weight = dingdanListJJchuli[index].JJ_weight
      var JJ_Name = dingdanListJJchuli[index].JJ_Name
      var JJ_PhoNum = dingdanListJJchuli[index].JJ_PhoNum
      var qujTime = dingdanListJJchuli[index].qujTime
      var qujWupin = dingdanListJJchuli[index].qujWupin
      var mdd = dingdanListJJchuli[index].mdd
      var JJ_Didian = dingdanListJJchuli[index].JJ_Didian
      var yundanNum = dingdanListJJchuli[index].yundanNum
      var company = dingdanListJJchuli[index].company
      var dd_Status = dingdanListJJchuli[index].dd_Status

      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&JJ_weight=' + JJ_weight +
          '&JJ_Name=' + JJ_Name +
          '&JJ_PhoNum=' + JJ_PhoNum +
          '&qujTime=' + qujTime +
          '&qujWupin=' + qujWupin +
          '&JJ_Didian=' + JJ_Didian +
          '&company=' + company +
          '&yundanNum=' + yundanNum +
          '&mdd=' + mdd +
          '&xd_time=' + xd_time +
          '&isJijian=' + isJijian +
          '&dd_Status=' + dd_Status +
          '&isChuli=' + isChuli
      })
    }
    if (isJichu) {
      console.log('用户点击 [已寄出] 绑定的数据', e)
      if (isInputShowed) {
        var dingdanListJJyijichu = this.data.searchResultList
      } else {
        var dingdanListJJyijichu = this.data.dingdanListJJyijichu
      }
      var xd_time = dingdanListJJyijichu[index].xd_time
      var JJ_weight = dingdanListJJyijichu[index].JJ_weight
      var JJ_Name = dingdanListJJyijichu[index].JJ_Name
      var JJ_PhoNum = dingdanListJJyijichu[index].JJ_PhoNum
      var qujTime = dingdanListJJyijichu[index].qujTime
      var qujWupin = dingdanListJJyijichu[index].qujWupin
      var mdd = dingdanListJJyijichu[index].mdd
      var JJ_Didian = dingdanListJJyijichu[index].JJ_Didian
      var yundanNum = dingdanListJJyijichu[index].yundanNum
      var company = dingdanListJJyijichu[index].company
      var dd_Status = dingdanListJJyijichu[index].dd_Status

      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&JJ_weight=' + JJ_weight +
          '&JJ_Name=' + JJ_Name +
          '&JJ_PhoNum=' + JJ_PhoNum +
          '&qujTime=' + qujTime +
          '&qujWupin=' + qujWupin +
          '&JJ_Didian=' + JJ_Didian +
          '&company=' + company +
          '&yundanNum=' + yundanNum +
          '&mdd=' + mdd +
          '&xd_time=' + xd_time +
          '&isJijian=' + isJijian +
          '&dd_Status=' + dd_Status +
          '&isChuli=' + isChuli
      })
    }
    if (isQuxiao) {
      console.log('用户点击 [已取消] 绑定的数据', e)
      if (isInputShowed) {
        var dingdanListJJquxiao = this.data.searchResultList
      } else {
        var dingdanListJJquxiao = this.data.dingdanListJJquxiao
      }
      var xd_time = dingdanListJJquxiao[index].xd_time
      var JJ_weight = dingdanListJJquxiao[index].JJ_weight
      var JJ_Name = dingdanListJJquxiao[index].JJ_Name
      var JJ_PhoNum = dingdanListJJquxiao[index].JJ_PhoNum
      var qujTime = dingdanListJJquxiao[index].qujTime
      var qujWupin = dingdanListJJquxiao[index].qujWupin
      var mdd = dingdanListJJquxiao[index].mdd
      var JJ_Didian = dingdanListJJquxiao[index].JJ_Didian
      var yundanNum = dingdanListJJquxiao[index].yundanNum
      var company = dingdanListJJquxiao[index].company
      var dd_Status = dingdanListJJquxiao[index].dd_Status

      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&JJ_weight=' + JJ_weight +
          '&JJ_Name=' + JJ_Name +
          '&JJ_PhoNum=' + JJ_PhoNum +
          '&qujTime=' + qujTime +
          '&qujWupin=' + qujWupin +
          '&JJ_Didian=' + JJ_Didian +
          '&company=' + company +
          '&yundanNum=' + yundanNum +
          '&mdd=' + mdd +
          '&xd_time=' + xd_time +
          '&isJijian=' + isJijian +
          '&isQuxiao=' + isQuxiao +
          '&dd_Status=' + dd_Status +
          '&isChuli=' + isChuli
      })
    }
    if (isPaotui) {
      console.log('用户点击 [paotui] 绑定的数据', e)
      if (isInputShowed) {
        var dingdanList = this.data.searchResultList
      } else {
        if (isAll_paotui) {
          var dingdanList = this.data.paotuiList
        } else if (isChuli_paotui) {
          var dingdanList = this.data.dingdanList_pt_chuli
        } else if (isWancheng_paotui) {
          var dingdanList = this.data.dingdanList_pt_wancheng
        } else if (isQuxiao_paotui) {
          var dingdanList = this.data.dingdanList_pt_quxiao
        }
      }
      var xd_time = dingdanList[index].xd_time
      var xuqiu = dingdanList[index].xuqiu
      var paotui_name = dingdanList[index].paotui_name
      var phone = dingdanList[index].phone
      var xxDizhi = dingdanList[index].xxDizhi
      var dd_Status = dingdanList[index].dd_Status
      var _id = dingdanList[index]._id
      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          '&xuqiu=' + xuqiu +
          '&paotui_name=' + paotui_name +
          '&phone=' + phone +
          '&xxDizhi=' + xxDizhi +
          '&xd_time=' + xd_time +
          '&dd_Status=' + dd_Status +
          '&_id=' + _id +
          '&isPaotui=' + isPaotui
      })
    }
    if (isMeishi) {
      console.log('用户点击 [meishi] 绑定的数据', e.currentTarget.dataset)
      if (isInputShowed) {
        var dingdanList = this.data.searchResultList
      } else {
        var dingdanList = this.data.meishiList
      }
      // var xd_time = dingdanList[index].xd_time
      // var cartPrice = dingdanList[index].cartPrice
      //带参数跳转页面 传参
      wx.navigateTo({
        url: '../xiangqing/xiangqing?' +
          'id=' + id +
          // '&cartPrice=' + cartPrice +
          // '&xd_time=' + xd_time +
          '&isMeishi=' + isMeishi
      })
    }

  },

  onLoad: function (options) {
    if (options.isJijian) {
      console.log('传参，寄件：：');
      this.tapJijian()
    } else if (options.isPaotui) {
      console.log('传参，跑腿：：');
      this.tapPaotui()
    } else if (options.isMeishi) {
      console.log('传参，美食 ：：');
      this.tapMeishi()
    } else if (options.isTuikuan_daiqu) {
      console.log('传参，代取退款 ：：');
      this.toTuikuan()
    } else {
      this.tapDaiqu()
    }



  },
  onReady: function () {},

  onShow: function () {
    var nowDate = utils_time.formatnianyueri(new Date())
    var nowMinaTime = utils_time.formatTime(new Date())
    // var nowMinaTime = '2021-05-26 1:00:01' //测试用 当前时间
    // var nowDate = '2021-05-26' //测试用 当前日期

    // 获取后台主参数
    db.collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数banner：：', res.data.jiezhiTime, res.data.jiezhiOpen);

        var jiezhiOpen = res.data.jiezhiOpen
        var time0 = res.data.jiezhiTime.jiezhiNum0.time0
        var time1 = res.data.jiezhiTime.jiezhiNum2.time1
        var time2 = res.data.jiezhiTime.jiezhiNum2.time2
        if (jiezhiOpen == '2') {
          // var time1 = '14:00:00'
          // var time2 = '18:00:00'
          var nowMinaTime1 = nowDate + ' ' + time1
          var nowMinaTime2 = nowDate + ' ' + time2
          var yesterdayTime = utils_time.formatnianyueriYesterday(new Date()) + ' ' + time2
          var tomorrowTime = utils_time.formatnianyueriTomorrow(new Date()) + ' ' + time1
          if (nowMinaTime < nowMinaTime1) {
            console.log('现在没到', time1, '当前时间', nowMinaTime);
            this.setData({
              yesterdayTime,
              shaixuanTime: nowMinaTime1,
            })
          } else if (nowMinaTime < nowMinaTime2) {
            console.log('现在没到', time2, '当前时间', nowMinaTime);
            this.setData({
              yesterdayTime: nowMinaTime1,
              shaixuanTime: nowMinaTime2
            })
          } else if (nowMinaTime > nowMinaTime2) {
            console.log('现在超过', time2, '当前时间', nowMinaTime);
            this.setData({
              yesterdayTime: nowMinaTime2,
              shaixuanTime: tomorrowTime
            })
          }
        } else if (jiezhiOpen == '1') {
          // var time1 = '14:00:00'
          // var time2 = '18:00:00'
          var nowMinaTime0 = nowDate + ' ' + time0
          var yesterdayTime = utils_time.formatnianyueriYesterday(new Date()) + ' ' + time0
          var tomorrowTime = utils_time.formatnianyueriTomorrow(new Date()) + ' ' + time0
          if (nowMinaTime < nowMinaTime0) {
            console.log('现在没到', time0, '当前时间', nowMinaTime);
            this.setData({
              yesterdayTime,
              shaixuanTime: nowMinaTime0,
            })
          } else if (nowMinaTime > nowMinaTime0) {
            console.log('现在超过', time0, '当前时间', nowMinaTime);
            this.setData({
              yesterdayTime: nowMinaTime0,
              shaixuanTime: tomorrowTime
            })
          }
        }


      })
      .catch(err => {
        console.error(err);
      })

    // var isOpen = this.data.isOpen
    // var time0 = this.data.time0
    // var time1 = this.data.time1
    // var time2 = this.data.time2


    if (this.data.isEdit && this.data.isDaiqu) {
      console.log('this.data.isEdit && this.data.isDaiqu');
      this.tapDaiqu()
    }
    if (this.data.isEdit && this.data.isChuli) {
      this.toChuli()
    }

    var that = this
    if (that.data.quxiao_chuancan_isPaotui) {
      this.tapPaotui()
      console.log('跑腿 详情页申请取消后，页面传参');
    } else if (that.data.quxiao_chuancan_isDaiqu) {
      this.tapDaiqu() // 代取订单退款操作后 返回此页面 刷新
      console.log('代取 详情页申请退款后，页面传参');
    }
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
    if (!this.data.isInputShowed) {
      this.setData({
        isShowLoading: true
      })
      // var dingdanList = this.data.dingdanList
      var pageNum = this.data.pageNum + 1
      console.log('页面触底');
      if (this.data.isDaiqu) {
        db.collection('daiqu').where({
            _openid: openid,
            dd_Status: _.neq('1')
          })
          .orderBy('xd_time', 'desc')
          .skip((pageNum - 1) * 20)
          .get() //获取根据查询条件筛选后的集合数据  
          .then(res => {
            if (res.data.length == 0) {
              this.setData({
                isGengDuo: true,
                isShowLoading: false
              })
            } else {
              console.log('res.data.length ！= 0');
              var dingdanList = this.data.dingdanList
              var dingdanList_dq_chuli = this.data.dingdanList_dq_chuli
              var dingdanList_dq_wancheng = this.data.dingdanList_dq_wancheng
              var dingdanList_dq_tuikuan = this.data.dingdanList_dq_tuikuan
              res.data.forEach(element => {
                dingdanList.push(element)
                if (element.dd_Status < '3') {
                  dingdanList_dq_chuli.push(element)
                } else if (element.dd_Status == '3') {
                  dingdanList_dq_wancheng.push(element)
                } else if (element.dd_Status < '7') {
                  dingdanList_dq_tuikuan.push(element)
                }
              });
              console.log('当前下载订单列表第' + pageNum + '页：', res.data)
              this.setData({
                pageNum,
                isShowLoading: false,
                dingdanList,

                dingdanList_dq_chuli,
                dingdanList_dq_wancheng,
                dingdanList_dq_tuikuan,

              })
              console.log('处理中 的订单列表：', dingdanList_dq_chuli);
              console.log('完成 的订单列表：', dingdanList_dq_wancheng);
              console.log('退款 的订单列表：', dingdanList_dq_tuikuan);

            }
          })
          .catch(err => {
            console.error(err)
          })
      }

      if (this.data.isJijian) {
        db.collection('jijian').where({
            _openid: openid
          })
          .orderBy('xd_time', 'desc')
          .skip((pageNum - 1) * 20)
          .get() //获取根据查询条件筛选后的集合数据  
          .then(res => {
            console.log('是否成功');
            if (res.data.length == 0) {
              console.log('res.data.length == 0');
              this.setData({
                isGengDuo: true,
                isShowLoading: false,
              })
            } else {
              console.log('res.data.length ！= 0');
              var dingdanList = this.data.dingdanList
              var dingdanListJJchuli = this.data.dingdanListJJchuli
              var dingdanListJJyijichu = this.data.dingdanListJJyijichu
              var dingdanListJJquxiao = this.data.dingdanListJJquxiao
              res.data.forEach(element => {
                dingdanList.push(element)
                if (element.dd_Status < '3') {
                  dingdanListJJchuli.push(element)
                } else if (element.dd_Status == '3') {
                  dingdanListJJyijichu.push(element)
                } else if (element.dd_Status < '6') {
                  dingdanListJJquxiao.push(element)
                }
              });
              console.log('当前下载订单列表第' + pageNum + '页：', res.data)
              this.setData({
                pageNum,
                isShowLoading: false,
                dingdanList,
                dingdanListJJchuli,
                dingdanListJJyijichu,
                dingdanListJJquxiao,

                chuliNum: dingdanListJJchuli.length,
              })
              console.log('处理中的订单列表：', dingdanListJJchuli);
              console.log('已寄出的订单列表：', dingdanListJJyijichu);
              console.log('已取消的订单列表：', dingdanListJJquxiao);
            }
          })
          .catch(err => {
            console.error(err)
          })
      }

      if (this.data.isPaotui) {
        db.collection('paotui').where({
            _openid: openid
          })
          .orderBy('xd_time', 'desc')
          .skip((pageNum - 1) * 20)
          .get() //获取根据查询条件筛选后的集合数据  
          .then(res => {
            if (res.data.length == 0) {
              this.setData({
                isGengDuo: true,
                isShowLoading: false
              })
            } else {
              var paotuiList = res.data
              var dingdanList_pt_chuli = this.data.dingdanList_pt_chuli
              var dingdanList_pt_wancheng = this.data.dingdanList_pt_wancheng
              var dingdanList_pt_quxiao = this.data.dingdanList_pt_quxiao
              res.data.forEach(element => {
                paotuiList.push(element)
                if (element.dd_Status < '3') {
                  dingdanList_pt_chuli.push(element)
                } else if (element.dd_Status == '3') {
                  dingdanList_pt_wancheng.push(element)
                } else if (element.dd_Status < '6') {
                  dingdanList_pt_quxiao.push(element)
                }
              });
              console.log('当前下载订单列表第' + pageNum + '页：', res.data)
              this.setData({
                pageNum,
                isShowLoading: false,
                paotuiList,

                dingdanList_pt_chuli,
                dingdanList_pt_wancheng,
                dingdanList_pt_quxiao,
              })
              console.log('处理中 的订单列表：', dingdanList_pt_chuli);
              console.log('完成 的订单列表：', dingdanList_pt_wancheng);
              console.log('取消 的订单列表：', dingdanList_pt_quxiao);



              // res.data.forEach(element => {
              //   paotuiList.push(element)
              // });
              // console.log('当前下载订单列表第' + pageNum + '页：', paotuiList)
              // this.setData({
              //   paotuiList,
              //   pageNum,
              //   isShowLoading: false
              // })

            }
          })
          .catch(err => {
            console.error(err)
          })
      }
      if (this.data.isQita) {
        db.collection('qita').where({
            _openid: openid,
            dd_Status: _.neq('1')
          })
          .orderBy('xd_time', 'desc')
          .skip((pageNum - 1) * 20)
          .get() //获取根据查询条件筛选后的集合数据  
          .then(res => {
            if (res.data.length == 0) {
              this.setData({
                isGengDuo: true,
                isShowLoading: false
              })
            } else {
              // var meishiList = this.data.meishiList
              // res.data.forEach(element => {
              //   meishiList.push(element)
              // });
              var qitaList = this.data.qitaList
              var qitaResdata = this.data.qitaResdata
              res.data.forEach(element => {
                qitaResdata.push(element.qitaResdata)
                var newElement = this.objtoarr(element)
                qitaList.push(newElement)
              });

              console.log('当前下载订单列表第' + pageNum + '页：', qitaList)
              this.setData({
                qitaList,
                qitaResdata,
                pageNum,
                isShowLoading: false
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
      if (this.data.isMeishi) {
        db.collection('meishi').where({
            _openid: openid
          })
          .orderBy('xd_time', 'desc')
          .skip((pageNum - 1) * 20)
          .get() //获取根据查询条件筛选后的集合数据  
          .then(res => {
            if (res.data.length == 0) {
              this.setData({
                isGengDuo: true,
                isShowLoading: false
              })
            } else {
              var meishiList = this.data.meishiList
              res.data.forEach(element => {
                meishiList.push(element)
              });
              console.log('当前下载订单列表第' + pageNum + '页：', meishiList)
              this.setData({
                meishiList,
                pageNum,
                isShowLoading: false
              })
            }
          })
          .catch(err => {
            console.error(err)
          })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})