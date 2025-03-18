  // var app = getApp()
  // var isNewmessage_globalData = app.globalData.isNewmessage
  // wx.cloud.init({
  //   env:'hnkjdx-9ge75aru1db3a094'
  // })

  // wx.cloud.database().collection('daiqu').where({
  //   id:'1'
  // }).get().then(res=>{
  //   console.log('ceshi:',res);
  // }).catch(err=>{
  //   console.log('ceshi:',err);
  // })

  var utils_toShouQuan = require('../../utils/toShouQuan.js') //获取 是否登录 login_ok
  var url = '../wode/ziliao/ziliao'
  var utils_time = require('../../utils/time.js') //获取时间等

  Page({

    data: {
      showPrivacy:true,
      ziliaoPercent: 0,

      login_ok: false,
      avatarUrl: '',
      // // 未登录头像
      // Url: 'https://xmf-0g87mzf198205ada-1305629196.tcloudbaseapp.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%85%8D%E7%BD%AE%E5%9B%BE%E7%89%87/touxiang.png?sign=10dbd2f842a9b3fcdb865ca28974d60d&t=1618579789',
      // 未登录头像
      Url: '../../images/touxiang.png',
      jifen_total: 0,
      guanliUrl: '../xuanzq/xuanzq',
      tips: '请稍后',
      showLoading: false,
      animated: true,
      // dingyue_total: 0,
      // dingyueUrl: './dingyue/dingyue',
      isNewmessage: false,
      isQiandao: false,
      Val_jifen: 1,
      Val_jifen_next: 1,
      // isNewmessage_globalData,
      dingdan_namelist: [{
          src: 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/wode/daiqu.png',
          text: '代取'
        },
        {
          src: 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/wode/jijian.png',
          text: '寄件'
        },
        {
          src: 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/wode/paotui.png',
          text: '跑腿'
        },
        {
          src: 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/wode/meishi.png',
          text: '美食'
        },
        {
          src: 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/wode/qita.png',
          text: '其他'
        },
      ],
      balance: 0,
      qiandao: {
        dateQiandao: '2021-09-01',
        numQiandao: 1
      },
      showPrivacy: true,
      currentTenant: null
    },

    handleAgreePrivacyAuthorization(e) {
      console.log('同意了隐私条款');
      // 用户同意隐私协议事件回调
      // 用户点击了同意，之后所有已声明过的隐私接口和组件都可以调用了
      // wx.getUserProfile()
      // wx.chooseMedia()
      // wx.getClipboardData()
      // wx.startRecord()
    },
    handleOpenPrivacyContract() {
      // 打开隐私协议页面
      wx.openPrivacyContract({
        success: () => {}, // 打开成功
        fail: () => {}, // 打开失败
        complete: () => {}
      })
    },

    handleGetUserInfo(e) {
      // 获取头像昵称成功
      console.log(e)
    },



    toMeishi() {
      wx.navigateTo({
        url: '../shouye/dianpu/dianpu',
      })
    },

    toceshi() {
      // 2021-09-29T04:39:47.564Z
      var date = new Date()
      console.log(date);
      date = String(date)
      var date8hour = String(date).slice(10, 12)
      console.log(date8hour);
    },

    toEleme() { //饿了么开放平台
      wx.request({
        // url: 'http://jwxt.xtu.edu.cn/jsxsd/kbcx/kbxx_xzb_ifr', 
        // url: 'http://jwxt.xtu.edu.cn/jsxsd/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_PYGL',
        url: 'https://open-api.shop.ele.me/api/v1/',
        data: {
          'USERNAME': '2016600436',
          'PASSWORD': 'hzkj1234'

        },
        header: {
          'content-type': 'application/json;charset=utf-8', // 默认值
          // 'content-type': 'application/msexcel', // 默认值
          // 'cookie': 'JSESSIONID=E9306C896BEC85A7764E6E2F0879F912',
          // 'cookie': 'JSESSIONID=C0E95DF3138D41D5220C9EF79C1B80C1',
        },
        method: 'POST',
        success(res) {
          // console.log(res.data);
          console.log(res.data);
        }
      })
    },
    toLianjie() { //分账申请
      wx.request({
        url: 'https://api.mch.weixin.qq.com/pay/profitsharingaddreceiver',
        data: {
          'mch_id': '1612648921',
          'appid': 'wxd2d16a504f24665e',
          'sign_type': 'HMAC-SHA256',
          'receiver': {
            "type": "PERSONAL_OPENID", // 个人openid
            "account": "ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4",
            // "name": "ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4",
            "relation_type": "PARTNER"
          }

        },
        method: 'POST',
        success(res) {
          console.log(res);
        }
      })
    },

    toDownload() {
      wx.downloadFile({
        // url:'https://786d-xmf-0g87mzf198205ada-1305629196.tcb.qcloud.la/daiqu.xlsx?sign=2b27e323a4fd909997dda2e9c38215d9&t=1631686082',
        url: 'http://jwxt.xtu.edu.cn/tkglAction.do?method=glkedy&yxbh=013', //仅为示例，并非真实的资源
        // filePath:
        data: {
          'type': 'xx04',
          'isview': '1',
          'yxbh': '013',
          'rxnf': '',
          'zy': '00201',
          'bjbh': '8E66CAA3B6804DDDAEDDCFD935176DF1',
          'zc': '2',
          'xnxq01id': '2021-2022-1',
          'xx04id': '8E66CAA3B6804DDDAEDDCFD935176DF1',
          'xx04mc': '',
          'dydg': 'dg',
        },
        // header: {
        //   'content-type': 'application/x-www-form-urlencoded', // 默认值
        //   // 'content-type': 'application/msexcel', // 默认值
        //   // 'cookie': 'JSESSIONID=E9306C896BEC85A7764E6E2F0879F912',
        //   'cookie': 'JSESSIONID=C0E95DF3138D41D5220C9EF79C1B80C1',
        // },
        success(res) {
          console.log(res.tempFilePath);
          var filePath = res.tempFilePath
          wx.openDocument({
            filePath,
          })

          // wx.saveFile({
          //   filePath,
          //   success(res) {
          //     console.log(res)

          //   },
          //   fail(res) {
          //     console.error(res)
          //   }
          // })
        }
      })
    },

    async toCsvin() { //测试用
      var loadingTime = utils_time.formatTime(new Date())
      var res = await wx.chooseMessageFile({
        count: 1,
      })
      var filePath = res.tempFiles[0].path
      var name = res.tempFiles[0].name
      var cloudPath = 'kebiao/' + loadingTime + name
      wx.showLoading({
        title: '上传中..',
      })
      var res1 = await wx.cloud.uploadFile({ // 上传图片················
        cloudPath,
        filePath, // 文件路径
      })
      var fileID = res1.fileID
      console.log('fileID', fileID);

      var res2 = wx.cloud.callFunction({
        // name: 'csvin',
        name: 'toexcel',
        data: {
          fileID,
          isCsvin: true
        },
      })

      console.log(res2);
      wx.hideLoading({})
      // .then(res => {
      //   console.log(res);
      // })
      // .catch(err => {
      //   console.log(err);
      // })

    },

    toFenzhang() { //测试用
      wx.cloud.callFunction({
          name: 'fenzhang',
          data: {
            action: 'fenzhang_add'
          },
        })
        .then(res => {
          // console.log(res);
          console.log(res.result, 'res.result');
        })
    },
    toFenzhang2() { //测试用
      wx.cloud.callFunction({
          name: 'fenzhang',
          data: {
            action: 'fenzhang_danci'
          },
        })
        .then(res => {
          // console.log(res);
          console.log(res.result, 'res.result');
        })
    },
    toFenzhang3() { //测试用
      wx.cloud.callFunction({
          name: 'fenzhang',
          data: {
            action: 'fenzhang_tuikuan'
          },
        })
        .then(res => {
          // console.log(res);
          console.log(res.result, 'res.result');
        })
    },
    toCaozuoUser_chakan() { //测试用
      var resNewlist = []
      wx.cloud.callFunction({
          name: 'caozuo_user2',
          data: {
            action: 'chongzhi_fushu'
          },
        })
        .then(res => {
          console.log(res);
          res.result.forEach(element => {
            var balance_time = []
            var jifen = element.jifen
            var balance_jilu = element.balance_jilu
            // jifen.forEach((element_jifen, i_jifen) => {
            //   balance_jilu.forEach((element_jilu,i_jilu) => {
            //     // if (element_jilu.jilu_time == element_jifen.jifen_time && element_jilu.jilu_num == -2) {
            //     if (element_jilu.jilu_num < 0 ) {
            //       balance_time.push(element_jilu.jilu_time)
            //     //   element_jilu.jilu_num = 0
            //       element.balance_time = balance_time
            //     }
            //   });
            // });
            // if (element.balance_time) {
            //   resNewlist.push(element)
            // }
            if (!element.balance_duokou2_time) {
              resNewlist.push(element)
            }
          });
          console.log(resNewlist, '新列表');


          //  //查看结果
          //   res.result.forEach((element,i) => {
          //     var balance_time = []
          //     var jifen = element.jifen
          //     var balance_jilu = element.balance_jilu
          //     balance_jilu.forEach((element_jilu, i_jilu) => {
          //       if (element_jilu.jilu_num == 0) {
          //         res.result[i] = {'you':true,_id:element._id}
          //       }
          //     });
          //   });
          //   console.log(res.result, '新列表');


        })
    },
    toCaozuoUser_chuli() { //测试用 处理
      var resNewlist = []
      wx.cloud.callFunction({
          name: 'caozuo_user2',
          data: {
            action: 'chongzhi_fushu_chuli'
          },
        })
        .then(res => {
          console.log(res);
          res.result.forEach(element => {
            var balance_time = []
            var jifen = element.jifen
            var balance_jilu = element.balance_jilu
            jifen.forEach((element_jifen, i_jifen) => {
              balance_jilu.forEach((element_jilu, i_jilu) => {
                if (element_jilu.jilu_time == element_jifen.jifen_time && element_jilu.jilu_num == -2) {
                  balance_time.push(element_jilu.jilu_time)
                  //   element_jilu.jilu_num = 0
                  element.balance_time = balance_time
                }
              });
            });
            if (element.balance_time) {
              resNewlist.push(element)
            }
          });
          console.log(resNewlist, '新列表');


          //  //查看结果
          //   res.result.forEach((element,i) => {
          //     var balance_time = []
          //     var jifen = element.jifen
          //     var balance_jilu = element.balance_jilu
          //     balance_jilu.forEach((element_jilu, i_jilu) => {
          //       if (element_jilu.jilu_num == 0) {
          //         res.result[i] = {'you':true,_id:element._id}
          //       }
          //     });
          //   });
          //   console.log(res.result, '新列表');


        })
    },

    toDingqichuli() { //测试用
      wx.cloud.callFunction({
          // name: 'dingqichuli',
          // name: 'dingqichuli_daiqu',
          name: 'dingqichuli_meishi',
          data: {},
        })
        .then(res => {
          console.log(res);
          // console.log(res.result.date);
        })

    },
    diaoyongyunhanshu() { //测试用
      // 充值
      // wx.cloud.callFunction({
      //     name: 'yonghu',
      //   data: {
      //     chongzhi:true,
      //     _openid:'ok1Nu5EpcW0USpiSlVB2Ww9m4ZW4',
      //     totalFee:1,
      //     dingdanhao:'F202216173814164146189497071',
      //     xd_time:'2022-01-06 17:38:14',
      //     },
      //   })
      //   .then(res => {
      //     console.log(res);
      //     // console.log(res.result.date);
      //   })

      // wx.cloud.callFunction({
      //     name: 'caozuo_user2',
      //   data: {
      //     action:'chongzhi_3000',
      //     },
      //   })
      //   .then(res => {
      //     console.log(res);
      //     console.log(res.result);
      //   })

      wx.cloud.callFunction({
          name: 'caozuo_user2',
          data: {
            action: 'chongzhi_1',
          },
        })
        .then(res => {
          console.log(res);
          console.log(res.result);
        })

    },
    getBarcode() { //测试用

      wx.cloud.callFunction({
          name: 'tobarcode',
          data: {
            text: '123456',
          },
        })
        .then(res => {
          console.log('getBarcode:',res);
        })

    },

    toQiandao() {
      wx.showLoading({
        icon: 'none',
        title: '签到..',
      })
      var jifen_time = utils_time.formatTime(new Date())
      var id = wx.getStorageSync('id')
      var jifen = {
        jifen_name: '签到',
        jifen_num: this.data.Val_jifen,
        jifen_time: jifen_time
      }

      var qiandao = this.data.qiandao

      wx.cloud.callFunction({
          name: 'yonghu',
          data: {
            qiandaoData: {
              id: id,
              jifen: jifen,
              qiandao: qiandao,
            }
          }
        })
        .then(res => {
          // console.log('[云函数] [积分] 更新 成功几条：', res.result.stats.updated)
          // wx.setStorageSync('qiandao', qiandao)
          this.setData({
            isQiandao: true,
          })

          wx.showToast({
            icon: 'none',
            title: '已签到',
          })
          this.toRefresh()
        })
        .catch(err => {
          wx.showToast({
            icon: 'none',
            title: '签到失败',
          })
        })
    },

    toWebview() { //网页测试
      wx.navigateTo({
        url: '../xtu/xtu',
      })
    },

    toMoney() {
      if (this.data.login_ok) {
        wx.navigateTo({
          url: '../wode/money/money'
        })
      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },

    toJianyi() {
      if (this.data.login_ok) {

        wx.navigateTo({
          url: '../add/add?' + '&addType=jianyi'
        })

      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },

    toRenwu() {
      if (this.data.login_ok) {
        wx.navigateTo({
          url: '../wode/renwu/renwu'
        })
      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },
    toShangjia() {
      if (this.data.login_ok) {
        wx.navigateTo({
          url: '../shangjia/shangjia'
        })
      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },
    toGuanli() {
      if (this.data.login_ok) {
        wx.navigateTo({
          url: '../xuanzq/xuanzq'
        })
      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },
    toDizhi() {
      if (this.data.login_ok) {
        wx.chooseAddress({
          success: (result) => {
            console.log('chooseAddress成功：');
          },
        })
      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },
    toDingdan(e) {
      var index = e.currentTarget.dataset.index
      // console.log(e);
      if (this.data.login_ok) {
        if (index == '0') {
          wx.navigateTo({
            url: '../wode/dingdan/dingdan?isDaiqu=true',
          })
        } else if (index == '1') {
          wx.navigateTo({
            url: '../wode/dingdan/dingdan?isJijian=true',
          })
        } else if (index == '2') {
          wx.navigateTo({
            url: '../wode/dingdan/dingdan?isPaotui=true',
          })
        } else if (index == '3') {
          wx.navigateTo({
            url: '../wode/dingdan/dingdan?isMeishi=true',
          })
        } else if (index == '4') {
          wx.navigateTo({
            url: '../wode/dingdan/dingdan?isQita=true',
          })
        }
      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },
    toFabu() {
      if (this.data.login_ok) {
        wx.navigateTo({
          url: '../wode/fabu/fabu',
        })
      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },
    toTalklist() {
      if (this.data.login_ok) {
        wx.navigateTo({
          url: '../talklist/talklist',
        })
        // wx.removeStorageSync('key')
        wx.setStorageSync('isNewmessage', false)
        this.setData({
          isNewmessage: false
        })
      } else {
        utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
      }
    },
    toZiliao: function () {
      wx.navigateTo({
        url: '../wode/ziliao/ziliao',
      })
    },
    toJifen() {
      let jifen_total = this.data.jifen_total
      wx.navigateTo({
        url: '../wode/jifen/jifen?jifen_total=' + jifen_total,
      })
    },
    toXiaoqu() {
      wx.navigateTo({
        url: '../wode/xiaoqu/xiaoqu'
      })
    },
    ziliaoPercent(list) {
      var ziliaoNum = 0
      list.forEach(element => {
        if (element !== '') {
          ziliaoNum += 1
        }
      });

      var ziliaoPercent = ziliaoNum / 10 * 100
      return ziliaoPercent
    },
    jingqueJiage(heji_money) {
      var heji_money_a = String(heji_money).slice(0, String(heji_money).indexOf('.'))
      var heji_money_len = heji_money_a.length + 2

      var heji_money_last = Number((heji_money).toPrecision(heji_money_len))
      return heji_money_last
    },

        // 四舍五入
    sswr(num, w) {
      // return (Number(numStr)).toFixed(w)
      return Number(num.toFixed(w))
    },

    toRefresh: function () {
      this.setData({
        showLoading: true
      })
      // 查询积分
      // let that = this
      let jifen_total = 0
      var openid = wx.getStorageSync('openid')
      var userinfo = wx.getStorageSync('userinfo')
      var id = wx.getStorageSync('id')
      console.log([id],'_id');
      wx.cloud.database().collection('user').doc(id)
        .get()
        .then(res => {
          console.log('[刷新] 查询用户数据 [积分 蜂蜜] 成功:',res);
          let jifen = res.data.jifen
          // if (typeof(jifen)=='object') {
          //   console.log('积分是object');
          //   jifen = [jifen]
          // }
          jifen.forEach(element => {
            jifen_total += element.jifen_num
          });
          jifen_total = this.sswr(jifen_total, 2)
          var balance_jilu = res.data.balance_jilu

          // var balance = balance_jilu.reduce(function (accumulator, currentValue) {
          //   // return accumulator + currentValue.jilu_num;
          //   return accumulator + (currentValue.jilu_num * 100); // 20250314 减少浮点数运算误差累计
          // }, 0)
          // balance = balance / 100
          // balance = this.jingqueJiage(balance)
          var balance = this.count_total(balance_jilu)
          console.log(balance,'balance是');

          var gender = res.data.gender
          var nianji = res.data.nianji
          var xueyuan = res.data.xueyuan
          var banji = res.data.banji
          var xuehao = res.data.xuehao
          var userPhoneNumber = res.data.userPhoneNumber
          var nickName = res.data.nickName
          var avatarUrl = res.data.avatarUrl
          var province = res.data.province
          var city = res.data.city
          var birthday = res.data.birthday
          var list = [nianji, xueyuan, banji, xuehao, userPhoneNumber, nickName, gender, province, city, birthday, ]
          var ziliaoPercent = this.ziliaoPercent(list)

          this.setData({
            jifen_total: jifen_total,
            balance,
            ziliaoPercent,
            nickName,
            avatarUrl,
            // 结束刷新
            showLoading: false
          })

          userinfo.nickName = nickName
          userinfo.avatarUrl = avatarUrl
          wx.setStorageSync('userinfo', userinfo)

          // 缓存 积分
          wx.setStorageSync('jifen', jifen)

          var gzhOpenid = res.data.gzhOpenid
          wx.setStorageSync('gzhOpenid', gzhOpenid)
          console.log('保存gzhOpenid成功', gzhOpenid);

          // 是否重登陆
          var hasRelogin = res.data.hasRelogin
          if (!hasRelogin) {
            this.onRemoveStorage()
          }

        })
        .catch(err => {
          console.log('[点击刷新] 查询用户数据 [积分 蜂蜜] 失败:', err);
        })

    },

    // 退出登陆 清除缓存
    onRemoveStorage() {
      try {
        wx.clearStorageSync()
        this.setData({
          login_ok: false
        })
        console.log('清除缓存 成功')
      } catch (e) {
        console.log('清除缓存 失败', e)
      }
    },

    onShow: function () {
      var app = getApp()
      var that = this
      var openid = wx.getStorageSync('openid')
      var userinfo = wx.getStorageSync('userinfo')
      var login_ok = wx.getStorageSync('login_ok')
      var isNewmessage = wx.getStorageSync('isNewmessage')
      if (openid && userinfo) {
        console.log('onshow 用户有登陆');
        this.setData({
          login_ok: login_ok,
          nickName: userinfo.nickName,
          avatarUrl: userinfo.avatarUrl,
          isNewmessage,
        })
        //隐藏新消息提醒
        wx.hideTabBarRedDot({
          index: 2
        })
      } else {
        console.log('onshow 用户未登陆');
        this.setData({
          login_ok: false,
          // avatarUrl: '../wode/user-unlogin.png'
        })
      }
      this.toRefresh()

      // 获取当前选择的校区
      if (app.globalData.currentTenant) {
        this.setData({
          currentTenant: app.globalData.currentTenant
        })
      }

      // 已设置官方隐私设置弹窗说明
      // https://developers.weixin.qq.com/miniprogram/dev/framework/user-privacy/PrivacyAuthorize.html
      // wx.getPrivacySetting({
      //   success: res => {
      //     console.log(res) // 返回结果为: res = { needAuthorization: true/false, privacyContractName: '《xxx隐私保护指引》' }
      //     // this.setData({
      //     //   showPrivacy: true
      //     // })
      //     if (res.needAuthorization) {
      //       // 需要弹出隐私协议
      //       this.setData({
      //         showPrivacy: true
      //       })
      //     } else {
      //       // 用户已经同意过隐私协议，所以不需要再弹出隐私协议，也能调用已声明过的隐私接口
      //       // wx.getUserProfile()
      //       // wx.chooseMedia()
      //       // wx.getClipboardData()
      //       // wx.startRecord()
      //     }
      //   },
      //   fail: () => {},
      //   complete: () => {}
      // })


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

    onLoad: function (options) {
      var openid = wx.getStorageSync('openid')
      var id = wx.getStorageSync('id')
      console.log('页面加载');
      // 查询积分
      let that = this
      let jifen_total = 0

      wx.cloud.database().collection('user').doc(id)
        .get()
        .then(res => {
          let jifen = res.data.jifen
          // if (typeof(jifen)=='object') {
          //   jifen = [jifen]
          // }
          jifen.forEach(element => {
            jifen_total += element.jifen_num
          });
          jifen_total = this.sswr(jifen_total, 2)
          var balance_jilu = res.data.balance_jilu

          // var balance = balance_jilu.reduce(function (accumulator, currentValue) {
          //   return accumulator + currentValue.jilu_num;
          // }, 0)
          // balance = this.jingqueJiage(balance)
          var balance = this.count_total(balance_jilu)
          

          var qiandao = res.data.qiandao
          // wx.setStorageSync('qiandao', qiandao)

          // 签到 判断 目的：1.dateQiandao 2.numQiandao
          var today = utils_time.formatnianyueri(new Date())
          var yesterday = utils_time.formatnianyueriYesterday(new Date())
          var dateQiandao = qiandao.dateQiandao
          var numQiandao = qiandao.numQiandao
          if (numQiandao == undefined || dateQiandao == undefined) {
            dateQiandao = ''
            numQiandao = 0
          }
          console.log(1);
          if (dateQiandao == today) { //今天已经签到
            console.log(11);

            this.setData({
              isQiandao: true,
            })

            if (numQiandao < 5) {
              this.setData({
                Val_jifen_next: numQiandao + 1,
              })
            } else if (numQiandao > 4) {
              this.setData({
                Val_jifen_next: 5,
              })
            }

          } else { // 尚未签到
            console.log(2);
            if (dateQiandao == yesterday) {
              console.log('有连续');
              numQiandao++
              var qiandao = {
                dateQiandao: today,
                numQiandao: numQiandao
              }
              if (numQiandao < 5) {
                console.log('积分+', numQiandao);
                console.log('明日积分+', numQiandao + 2);
                this.setData({
                  Val_jifen: numQiandao,
                  Val_jifen_next: numQiandao + 1,
                })
              } else if (numQiandao > 4) {
                console.log('积分+', 5);
                console.log('明日积分+', 5);
                this.setData({
                  Val_jifen: 5,
                  Val_jifen_next: 5,
                })
              }

            } else if (dateQiandao !== yesterday) {
              console.log(3);

              this.setData({
                Val_jifen: 1,
                Val_jifen_next: 2,
              })
              console.log('不连续,签到后刷新缓存日期');
              console.log('积分+', 1);
              var qiandao = {
                dateQiandao: today,
                numQiandao: 1
              }
            }
          }
          console.log(4);
          this.setData({
            jifen_total: jifen_total,
            balance,
            // dingyue_total,
            qiandao,
            ziliaoPercent: res.data.ziliaoPercent
          })
          console.log('查询用户数据 [积分]:', jifen);

        })
        .catch(err => {
          console.log('查询用户数据 [积分及订阅数] 失败:', err);
        })

      getApp().watch(that.watchBack)

    },
    watchBack: function (isNewmessage) {
      this.setData({
        isNewmessage: getApp().globalData.isNewmessage
      })
    },


    // 测试

    toTuisongXiaDanNew() { // 测试服务号消息发送
      wx.cloud.callFunction({
          name: 'tuisongxiadannew',
          // name: 'dingqichuli',
          data: {
            openid: wx.getStorageSync('openid'),
            isDaiqu: true,
            qh_Ma: '12-1-2201',
            kd_Name: '王先生',
            xd_time: utils_time.formatTime(new Date()),
            gzhOpenid: wx.getStorageSync('gzhOpenid')
          }
        })
        .then(res => {
          // console.log('dingqichuli', res)
          console.log('toTuisongXiaDanNew', res)

        })
    },
    toTuikuan() { // 测试退款
      wx.cloud.callFunction({
          // name: 'tuisongFwh',
          name: 'ceshituikuan',
          data: {
            action:'退款',
            total_fee:5,
            refund_fee:1,
            out_refund_no:'4200001982202311093674708209',
            out_trade_no:'F2023119213238169953675819136',
            // out_refund_no:'4200002002202311096993973950',
            // out_trade_no:'F2023119205522169953452295393',
          }
        })
        .then(res => {
          console.log('toTuikuan', res)
        })
        .catch(err=>{
          console.log(err);
        })
    },
    toTuisongFuwuhao() { // 测试服务号消息发送
      wx.cloud.callFunction({
          name: 'tuisongFwh',
          // name: 'dingqichuli',
          data: {
            // gzhOpenid: wx.getStorageSync('gzhOpenid'),
            // pagePath:'wode/dingdan/dingdan?isDaiqu=true'
            

          }
        })
        .then(res => {
          // console.log('dingqichuli', res)
          console.log('toTuisongFuwuhao', res)
        })
    },
    getAccess_token() { // 测试getAccess_token
      wx.cloud.callFunction({
          name: 'access_token',
          // name: 'dingqichuli',
          data: {}
        })
        .then(res => {
          // console.log('dingqichuli', res)
          console.log('getAccess_token', res.result)
          /*
          云函数先获取accesstoken，云函数再提交模板消息发送
          */
         this.toTuisongFuwuhao()
        })
    },
    update_token() { // 测试getAccess_token
      wx.cloud.callFunction({
          name: 'update_token',
          data: {}
        })
        .then(res => {
          console.log('update_token', res)
        })
    },


    /*
    服务号消息推送
    一、获取unionid，小程序openid，公众号openid
    1.从小程序关注公众号
      1.1 已有小程序openid
      1.2 关注与取关公众号，调用云函数实现公众号openid更新到用户表
      1.3 扫码的方式关注公众号| 进入公众号文章的方式
    2.从公众号关后进入小程序

    二、发送消息
    */




    toTest_env() {

      wx.cloud.callFunction({
          name: 'test_env',
          // name: 'dingqichuli',
          data: {}
        })
        .then(res => {
          // console.log('dingqichuli', res)
          console.log('test_env', res)
        })
    },

    toTuisong() {
      wx.cloud.callFunction({
          name: 'tuisong',
          // name: 'dingqichuli',
          data: {}
        })
        .then(res => {
          // console.log('dingqichuli', res)
          console.log('tuisong', res)
        })
    },

    todingyue() {
      wx.requestSubscribeMessage({
        // tmplIds: ['OgFUv0zi6LpzrnWT8-bNZIvY5WDupxYhN8GV1FgPp5o'], //下单提醒
        tmplIds: ['bypgXdjPrl2xb57P00ZZxYoY0d7LKQ4ymGGMkwjHAdk'], //快递代取送达通知
        // tmplIds: ['m0LiKsNOZMH1b8QKUqAioeACYUp4G7yiCwIM-q1C6_Q'],//退款结果通知
      })
    },

    towebhook() {
      wx.cloud.callFunction({
          name: 'webhook',
          data: {}

        })
        .then(res => {
          console.log('webhook', res)
        })

    },
    toJianting() {
      const _ = wx.cloud.database().command
      wx.cloud.database().collection('jijian').where({
          _id: _.exists(true)
        })
        .watch({
          onChange: function (snapshot) {
            console.log('[寄件] 有更新snapshot', snapshot)
            wx.cloud.callFunction({
              name: 'tuisong'
            })
          },
          onError: function (err) {
            console.error('监听函数因错误而停止', err)
          }
        })
    }
  })