// pages/wode/wode.js
var utils_time = require('../../../utils/time.js') //获取时间等
var app = getApp()
var globalData = app.globalData
Page({

  data: {
    ziliaoPercent: 0,
    ziliaoNum: 0,

    isChecked: false,
    screenHeight: 0,
    isShow_xueyuan: false,
    xueyuan_banji_list: [],
    isLookuserinfo: false,
    _openid: '',
    userinfo: {},
    nickName: '',
    city: '',
    province: '',
    gender: '',
    birthday: '',
    nianji: '',
    xueyuan: '',
    banji: '',
    xuehao: '',
    userPhoneNumber: '',

    look_avatarUrl: '',
    look_nickName: '',
    look_city: '',
    look_province: '',
    look_gender: '',
    look_birthday: '',
    look_nianji: '',
    look_xueyuan: '',
    look_banji: '',
    look_xuehao: '',
    look_userPhoneNumber: '',

    avatarUrl: '',
    //未登陆时的头像
    Url: '../../../images/touxiang.png',
    // Url: null,
    openid: '',
    login_ok: false,
    isAdmin: false,
    isShangjia: false,
    isYonghu: false,
    jifen: [],
    zhuceTime: '',

    isEdit: false,
    isShowshijian: false,

    nianjiList: [],

    // 显示注册窗口
    showZhuce: false,
    disableZhuce:false, // 注册按钮是否可用 false可用


    banner_daiqu: {}
  },

  // 上传图片
  async uploadImg(filePath) {
    var openid = wx.getStorageSync('openid')
    var cloudPath = `touxiang/${openid}touxiang.png`
    var res1 = await wx.cloud.uploadFile({ // 上传图片················
      cloudPath: cloudPath,
      filePath, // 文件路径
    })
    console.log('上传后的fileID', res1.fileID)
    return res1.fileID
    // var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
    //   fileList: [{
    //     fileID: res1.fileID
    //   }]
    // })
    // // console.log('用云文件 ID 换取真实链接', res.fileList)
    // console.log('res2', res2);

    // // var zhaopaiUrl = {
    // //   imagefileID: res2.fileList[0].fileID,
    // //   imagetempFileURL: res2.fileList[0].tempFileURL
    // // }
    // // console.log('');
  },


  // 更换头像
  async changeAvatar(e) {
    console.log('更换头像', e);
    var {
      avatarUrl
    } = e.detail
    // 上传图片，返回fileID
    var openid = wx.getStorageSync('openid')
    var cloudPath = `touxiang/${openid}touxiang.png`
    var res1 = await wx.cloud.uploadFile({ // 上传图片················
      cloudPath: cloudPath,
      filePath: avatarUrl, // 文件路径
    })
    console.log('上传后的fileID', res1.fileID)
    var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
      fileList: [{
        fileID: res1.fileID
      }]
    })
    // console.log('用云文件 ID 换取真实链接', res.fileList)
    console.log('res2', res2);
    avatarUrl = res2.fileList[0].tempFileURL
    this.setData({
      avatarUrl,
      // avatarUrl:fileID,
    })

  },

  // 输入昵称
  inputNickname(e) {
    console.log(e);
    this.setData({
      nickName: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    var nianji = this.data.nianjiList[e.detail.value]
    this.setData({
      nianji,
    })
  },

  closeChoose() {
    this.setData({
      isShow_xueyuan: false,
    })
  },

  tapXueyuan(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.list_index);
    // var isChecked = !this.data.isChecked
    var list_index = e.currentTarget.dataset.list_index
    var xueyuan_banji_list = this.data.xueyuan_banji_list
    for (let index = 0; index < xueyuan_banji_list.length; index++) {
      const element = xueyuan_banji_list[index];
      if (list_index == index) {
        // element.checked = isChecked
        element.checked = !element.checked
      } else {
        element.checked = false
      }
    }
    this.setData({
      xueyuan_banji_list,
      // isChecked,
    })
  },

  tapBanji(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.xueyuan);
    this.setData({
      xueyuan: e.currentTarget.dataset.xueyuan,
      banji: e.currentTarget.dataset.banji,
      isShow_xueyuan: false,
    })
  },

  toChoose_Xueyuan() {
    this.setData({
      isShow_xueyuan: !this.data.isShow_xueyuan,
    })
  },

  // 时间选择器
  bindDateChange: function (e) {
    console.log('生日 选择改变，携带值为', e.detail.value)
    this.setData({
      birthday: e.detail.value
    })
  },

  toEdit() {

    wx.cloud.database().collection('banner').doc('schooldata0001')
      .get()
      .then(res => {
        console.log(res);
        var nianjiList = []
        var nianjiList_jinnian = utils_time.formatTime(new Date()).slice(0, 4)
        // console.log(nianjiList_jinnian);
        for (let index = 0; index < 10; index++) {
          var item = String(Number(nianjiList_jinnian) - index)
          nianjiList.push(item)
        }

        this.setData({
          isEdit: true,
          nianjiList,
          xueyuan_banji_list: res.data.xueyuan_banji_list,
        })
      })


  },
  toEditConfirm() {
    wx.showLoading({
      title: '上传..',
    })
    var gx_Time = utils_time.formatTime(new Date());
    var userId = wx.getStorageSync('id')

    var {
      userinfo,
      avatarUrl,
      nickName,
      gender,
      city,
      province,
      birthday,
      nianji,
      xueyuan,
      banji,
      xuehao,
      userPhoneNumber,
    } = this.data

    var list = [nianji, xueyuan, banji, xuehao, userPhoneNumber, nickName, gender, province, city, birthday, ]
    var ziliaoPercent = this.ziliaoPercent(list)
    userinfo.nickName = nickName
    userinfo.gender = gender
    userinfo.city = city
    userinfo.province = province
    userinfo.avatarUrl = avatarUrl

    // 记录操作日志
    wx.cloud.callFunction({
      name: 'addLog',
      data: {
        content: `更新了个人资料：${nickName}`
      }
    }).catch(err => {
      console.error('记录日志失败：', err)
    })

    wx.cloud.database().collection('user').doc(userId)
      .update({
        data: {
          gx_Time,
          nickName,
          gender,
          city,
          province,
          birthday,
          nianji,
          xueyuan,
          banji,
          xuehao,
          userPhoneNumber,
          ziliaoPercent,
          avatarUrl,
        }
      })
      .then(res => {
        console.log('修改成功', res.stats.updated);
        this.setData({
          ziliaoPercent
        })
        wx.setStorageSync('userinfo', userinfo)
        wx.showToast({
          icon: 'none',
          title: '修改完成',
        })

        if (ziliaoPercent == 100) {
          wx.cloud.callFunction({
            name: 'liuyan',
            data: {
              isZiliaoPercent: true,
              userId,
              nowTime: gx_Time
            }
          })
          .then(res => {
            console.log('资料100加积分 成功 res', res);
          })
          .catch(err => {
            console.log('资料100加积分 失败 err', err);
          })
        }
      })
      .catch(err => {
        wx.showToast({
          icon: 'none',
          title: '修改失败',
        })
      })
    this.setData({
      isEdit: false
    })

  },

  input_nickName(e) {
    console.log(e);
    this.setData({
      nickName: e.detail.value
    })
  },
  input_gender(e) {
    this.setData({
      gender: e.detail.value
    })
  },
  input_province(e) {
    this.setData({
      province: e.detail.value
    })
  },
  input_city(e) {
    this.setData({
      city: e.detail.value
    })
  },
  input_birthday(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  input_nianji(e) {
    this.setData({
      nianji: e.detail.value
    })
  },
  input_xueyuan(e) {
    this.setData({
      xueyuan: e.detail.value
    })
  },
  input_banji(e) {
    this.setData({
      banji: e.detail.value
    })
  },
  input_xuehao(e) {
    this.setData({
      xuehao: e.detail.value
    })
  },
  input_userPhoneNumber(e) {
    this.setData({
      userPhoneNumber: e.detail.value
    })
  },

  toImagedit() {
    wx.navigateTo({
      url: './imageedit/imageedit',
    })
  },


  checkGzhOpenid(unionid) {
    wx.cloud.callFunction({
      name: 'search',
      data: {
        searchType: 'gzhOpenid',
        unionid,
      },
      success: res => {
        console.log('checkGzhOpenid::', res);
      },
    })
  },

  // showZhuce() {

  // },


  // 登陆前查询
  gozhuce(e) {
    console.log('注册新用户', e)
    this.setData({disableZhuce:true})
    // 调用函数时，传入new Date()参数，返回值是日期和时间
    var zhuceTime = utils_time.formatTime(new Date());
    var {
      nickName,
    } = e.detail.value

    // 如果用户未选择昵称

    if (nickName == '') {
      var date1 = new Date().getTime()
      nickName = `蜂蜂用户${date1}`
    }
    var {
      avatarUrl,
      unionid,
      gzhOpenid,
      openid,
      banner_daiqu,
    } = this.data

    if (avatarUrl == '') {
      avatarUrl = 'https://786d-xmf-0g87mzf198205ada-1305629196.tcb.qcloud.la/banner/tubiao/touxiang.png?sign=ab93af149914ed12a6d6a3dd34a0fc69&t=1698418316'
    }
    var jifen = [{
      jifen_name: '注册',
      // jifen_num: 10,
      jifen_num: banner_daiqu.jifen.val_jifen_zhuce?banner_daiqu.jifen.val_jifen_zhuce:10,
      jifen_time: zhuceTime
    }]
    // 未注册 则新增数据 to 云端 user
    wx.cloud.database().collection('user').add({
      data: {
        nickName,
        userPhoneNumber: '',
        city: '',
        gender: '',
        province: '',
        avatarUrl: avatarUrl,
        jifen, //首次注册积分初始值
        zhuceTime: zhuceTime,
        isYonghu: false,
        isAdmin: false,
        isShangjia: false,

        birthday: '',
        nianji: '',
        xueyuan: '',
        banji: '',
        xuehao: '',

        kebiaoImageUrl: '',
        qiandao: {},
        balance: 0,
        balance_jilu: [], // mark: gzhOpenid

        unionid: unionid,
        gzhOpenid: gzhOpenid,

        hasRelogin: true, // 新用户不用重新登陆
        
        // 添加租户ID字段，初始为空
        tenant_id: '',
        // 添加用户所属校区列表
        campuses: []
      },
      success: res => {
        console.log('注册数据 新增 成功', res)
        this.setData({
          nickName,
          avatarUrl, // 上传保存
          login_ok: true,
          userinfo: {
            nickName,
            avatarUrl,
          },
          showZhuce: false,
          zhuceTime,

        })
        // 保存到本地
        wx.setStorageSync('userinfo', {
          nickName,
          avatarUrl
        })
        // 保存到本地 openid
        wx.setStorageSync('openid', openid)
        wx.setStorageSync('unionid', unionid)
        wx.setStorageSync('gzhOpenid', gzhOpenid)

        // 保存到本地 _id
        wx.setStorageSync('id', res._id)
        // 缓存 登陆状态为
        wx.setStorageSync('login_ok', true)
        // 缓存 积分
        wx.setStorageSync('jifen', jifen)
        // 缓存 商家身份
        wx.setStorageSync('isShangjia', false)
        // 缓存 管理员身份
        wx.setStorageSync('isAdmin', false)
        // 缓存 watchLiaotian
        wx.setStorageSync('watchLiaotian', [])

        // wx.hideLoading()
        wx.showToast({
          title: '注册成功',
        })
      },
      fail: err => {
        console.log('注册数据 新增 失败', err)
        wx.showToast({
          icon: 'error',
          title: '注册失败',
        })
      },

    })
  },

  //点击授权登陆 注册
  async onGetUserInfo(e) {
    // console.log('点击授权登陆')


    wx.showToast({
      icon: 'loading',
      title: '正在登陆',
    })



    // 获取 openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result)
        var {
          unionid,
          gzhOpenid,
          openid
        } = res.result

        // 保存到本地 openid
        this.setData({
          openid,
          unionid,
          gzhOpenid,
        })

        // 判断用户是否注册
        wx.cloud.database().collection('user')
          .where({
            _openid: openid
          })
          .get()
          .then(res => {
            console.log('查询用户 openid 记录数量', res.data.length, res)
            if (res.data.length == 0) {
              console.log('[判断注册] 未注册')
              this.setData({
                showZhuce: true
              })
              // // 调用函数时，传入new Date()参数，返回值是日期和时间
              // var zhuceTime = utils_time.formatTime(new Date());
              // // this.setData({
              // //   zhuceTime: zhuceTime
              // // })
              // // 未注册 则新增数据 to 云端 user
              // wx.cloud.database().collection('user').add({
              //   data: {
              //     nickName,
              //     userPhoneNumber: '',
              //     city: '',
              //     gender: '',
              //     province: '',
              //     avatarUrl: avatarUrl,
              //     jifen: [{
              //       jifen_name: '注册',
              //       jifen_num: 10,
              //       jifen_time: zhuceTime
              //     }], //首次注册积分初始值
              //     zhuceTime: zhuceTime,
              //     isYonghu: false,
              //     isAdmin: false,
              //     isShangjia: false,

              //     birthday: '',
              //     nianji: '',
              //     xueyuan: '',
              //     banji: '',
              //     xuehao: '',

              //     kebiaoImageUrl: '',
              //     qiandao: {},
              //     balance: 0,
              //     balance_jilu: [], // mark: gzhOpenid

              //     unionid: unionid,
              //     gzhOpenid: gzhOpenid,

              //     hasRelogin: true, // 新用户不用重新登陆

              //   },
              //   success: res => {
              //     console.log('注册数据 新增 成功', res)
              //     this.setData({
              //       nickName,
              //       // avatarUrl:'' // 上传保存
              //       login_ok:true,
              //       userinfo:{
              //         nickName,
              //         avatarUrl,
              //       },
              //     })
              //     // 保存到本地
              //     wx.setStorageSync('userinfo', {
              //       nickName,
              //       avatarUrl
              //     })
              //     // 保存到本地 openid
              //     wx.setStorageSync('openid', openid)
              //     wx.setStorageSync('unionid', unionid)
              //     wx.setStorageSync('gzhOpenid', gzhOpenid)

              //     // 保存到本地 _id
              //     wx.setStorageSync('id', res._id)
              //     // 缓存 登陆状态为
              //     wx.setStorageSync('login_ok', true)
              //     // 缓存 积分
              //     wx.setStorageSync('jifen', jifen)
              //     // 缓存 商家身份
              //     wx.setStorageSync('isShangjia', false)
              //     // 缓存 管理员身份
              //     wx.setStorageSync('isAdmin', false)
              //     // 缓存 watchLiaotian
              //     wx.setStorageSync('watchLiaotian', [])

              //     // wx.hideLoading()
              //     wx.showToast({
              //       title: '注册成功',
              //     })
              //   },
              //   fail: err => {
              //     console.log('注册数据 新增 失败', err)
              //     wx.showToast({
              //       icon: 'error',
              //       title: '注册失败',
              //     })
              //   },

              // })

            } else if (res.data.length !== 0) {
              console.log('[判断注册] 已注册 无需新增', res.data)
              var resdata = res.data[0]

              console.log('判断结果!res.data[0].unionid||!res.data[0].gzhOpenid', !res.data[0].unionid || !res.data[0].gzhOpenid);

              // 有unionid 有gzhOpenid
              if (!res.data[0].unionid || !res.data[0].gzhOpenid) {
                wx.cloud.database().collection('user').doc(res.data[0]._id)
                  .update({
                    data: {
                      unionid: unionid,
                      gzhOpenid: gzhOpenid,
                    },
                    success: res => {
                      console.log('unionid gzhOpenid 更新', res.stats.updated, res)
                      wx.setStorageSync('unionid', unionid)
                      wx.setStorageSync('gzhOpenid', gzhOpenid)

                      this.onShow()
                      wx.showToast({
                        title: '成功',
                      })
                    },
                    fail: err => {
                      console.log('unionid gzhOpenid 更新 失败', err)
                      wx.showToast({
                        icon: 'error',
                        title: '失败',
                      })
                    }
                  })
              }
              if (!res.data[0].hasRelogin) {
                wx.cloud.database().collection('user').doc(res.data[0]._id)
                  .update({
                    data: {
                      hasRelogin: true,
                    },
                    success: res => {
                      console.log('hasRelogin 更新', res.stats.updated, res)

                    },
                    fail: err => {
                      console.log('hasRelogin 更新 失败', err)

                    }
                  })
              }

              /*
              老用户：
              先关注公众号，获取 gzhOpenid
              已注册，如果有 gzhOpenid ，则缓存
              */
              if (res.data[0].gzhOpenid) {
                wx.setStorageSync('gzhOpenid', res.data[0].gzhOpenid)
              }


              let {
                nickName,
                userPhoneNumber,
                city,
                gender,
                province,
                avatarUrl,
                jifen,
                zhuceTime,
                isYonghu,
                isAdmin,
                isShangjia,
                birthday,
                nianji,
                xueyuan,
                banji,
                xuehao,
                kebiaoImageUrl,
                qiandao,
                balance,
                balance_jilu,
                unionid,
                gzhOpenid,
                hasRelogin,
                _id,
              } = resdata


              // 如果已经注册，直接缓存用户信息
              let resuserinfo = {
                nickName,
                city,
                gender,
                province,
                avatarUrl
              }
              wx.setStorageSync('userinfo', resuserinfo)
              // 保存到本地 openid
              wx.setStorageSync('openid', openid)
              // 保存到本地 id
              wx.setStorageSync('id', _id)
              // 缓存 登陆状态为
              wx.setStorageSync('login_ok', true)
              // 缓存 管理员
              wx.setStorageSync('isAdmin', isAdmin)
              // 缓存 商家
              wx.setStorageSync('isShangjia', isShangjia)
              // 缓存 积分
              wx.setStorageSync('watchLiaotian', []) // 缓存 watchLiaotian

              wx.setStorageSync('jifen', jifen)
              wx.setStorageSync('qiandao', qiandao)


              this.setData({
                jifen,
                login_ok: true,
                userinfo: resuserinfo,
                nickName,
                city,
                gender,
                province,
                avatarUrl,
                userPhoneNumber,
                birthday,
                nianji,
                xueyuan,
                banji,
                xuehao,
              })

              // 检查是否已选择校区
              const selectedCampus = wx.getStorageSync('selectedCampus')
              if (!selectedCampus) {
                // 如果未选择校区，跳转到校区选择页面
                wx.navigateTo({
                  url: '/pages/campus/campus'
                })
              } else {
                // 如果已选择校区，跳转到主页面
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }

          })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.showToast({
          icon: 'error',
          title: '登陆失败',
        })
      }
    })

    // this.setData({
    //   login_ok: true,
    //   userinfo: userinfo,
    //   nickName: userinfo.nickName,
    //   city: userinfo.city,
    //   gender: userinfo.gender,
    //   province: userinfo.province,
    //   avatarUrl: userinfo.avatarUrl
    // })



  },
  //点击授权登陆 注册 == 弃用===
  async onGetUserInfoOld() {
    // console.log('点击授权登陆')
    // 弹窗询问是否授权
    // try {
    wx.getUserProfile({
      desc: '用于完善会员资料', //必填 描述信息
      lang: 'zh_CN',
      success: (res) => {
        console.log('userInfo获取成功', res.userInfo)
        // wx.showLoading({
        //   title: '正在登陆',
        // })
        wx.showToast({
          icon: 'loading',
          title: '正在登陆',
        })

        // 获取 openid
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            console.log('[云函数] [login] user openid: ', res.result)
            var {
              unionid,
              gzhOpenid
            } = res.result




            // 保存到本地 openid
            this.setData({
              openid: res.result.openid,
            })

            let openid = this.data.openid
            let nickName = this.data.nickName
            let city = this.data.city
            let gender = this.data.gender
            let province = this.data.province
            let avatarUrl = this.data.avatarUrl
            // let jifen = this.data.jifen //积分
            let userinfo = this.data.userinfo
            // let userPhoneNumber = this.data.userPhoneNumber
            let isShangjia = this.data.isShangjia
            let isAdmin = this.data.isAdmin
            let isYonghu = this.data.isYonghu
            var {banner_daiqu} = this.data

            // 判断用户是否注册
            wx.cloud.database().collection('user')
              .where({
                _openid: openid
              })
              .get()
              .then(res => {
                console.log('查询用户 openid 记录数量', res.data.length, res)
                if (res.data.length == 0) {
                  console.log('[判断注册] 未注册')
                  // 调用函数时，传入new Date()参数，返回值是日期和时间
                  var zhuceTime = utils_time.formatTime(new Date());
                  // this.setData({
                  //   zhuceTime: zhuceTime
                  // })
                  // 未注册 则新增数据 to 云端 user
                  wx.cloud.database().collection('user').add({
                    data: {
                      nickName: nickName,
                      userPhoneNumber: '',
                      city: city,
                      gender: gender,
                      province: province,
                      avatarUrl: avatarUrl,
                      jifen: [{
                        jifen_name: '注册',
                        // jifen_num: 10,
                        jifen_num: banner_daiqu.jifen.val_jifen_zhuce?banner_daiqu.jifen.val_jifen_zhuce:10,
                        jifen_time: zhuceTime
                      }], //首次注册积分初始值
                      zhuceTime: zhuceTime,
                      isYonghu: isYonghu,
                      isAdmin: isAdmin,
                      isShangjia: isShangjia,

                      birthday: '',
                      nianji: '',
                      xueyuan: '',
                      banji: '',
                      xuehao: '',

                      kebiaoImageUrl: '',
                      qiandao: {},
                      balance: 0,
                      balance_jilu: [], // mark: gzhOpenid

                      unionid: unionid,
                      gzhOpenid: gzhOpenid,

                      hasRelogin: true, // 新用户不用重新登陆

                    },
                    success: res => {
                      console.log('注册数据 新增 成功', res)
                      // 保存到本地
                      wx.setStorageSync('userinfo', userinfo)
                      // 保存到本地 openid
                      wx.setStorageSync('openid', openid)
                      wx.setStorageSync('unionid', unionid)
                      wx.setStorageSync('gzhOpenid', gzhOpenid)

                      // 保存到本地 _id
                      wx.setStorageSync('id', res._id)
                      // 缓存 登陆状态为
                      wx.setStorageSync('login_ok', true)
                      // 缓存 积分
                      wx.setStorageSync('jifen', jifen)
                      // 缓存 商家身份
                      wx.setStorageSync('isShangjia', isShangjia)
                      // 缓存 管理员身份
                      wx.setStorageSync('isAdmin', isAdmin)
                      // 缓存 watchLiaotian
                      wx.setStorageSync('watchLiaotian', [])

                      // wx.hideLoading()
                      wx.showToast({
                        title: '注册成功',
                      })
                    },
                    fail: err => {
                      console.log('注册数据 新增 失败', err)
                      // setTimeout(function () {
                      //   wx.hideLoading()
                      // }, 300)
                      wx.showToast({
                        icon: 'error',
                        title: '注册失败',
                      })
                    },

                  })

                } else if (res.data.length !== 0) {
                  console.log('[判断注册] 已注册 无需新增', res.data)
                  // wx.cloud.database().collection('user').doc(res.data[0]._id)
                  //   .update({
                  //     data: {
                  //       nickName: nickName,
                  //       city: city,
                  //       gender: gender,
                  //       province: province,
                  //       avatarUrl: avatarUrl,
                  //       // userPhoneNumber: userPhoneNumber,
                  //     },
                  //     success: res => {
                  //       console.log('注册数据 更新 成功几条：', res.stats.updated, res)
                  //       this.onShow()
                  //       wx.showToast({
                  //         title: '登陆成功',
                  //       })
                  //     },
                  //     fail: err => {
                  //       console.log('注册数据 更新 失败', err)
                  //       wx.showToast({
                  //         icon: 'error',
                  //         title: '登陆失败',
                  //       })
                  //     }
                  //   })
                  console.log('判断结果!res.data[0].unionid||!res.data[0].gzhOpenid', !res.data[0].unionid || !res.data[0].gzhOpenid);
                  if (!res.data[0].unionid || !res.data[0].gzhOpenid) {
                    wx.cloud.database().collection('user').doc(res.data[0]._id)
                      .update({
                        data: {
                          unionid: unionid,
                          gzhOpenid: gzhOpenid,
                        },
                        success: res => {
                          console.log('unionid gzhOpenid 更新', res.stats.updated, res)
                          wx.setStorageSync('unionid', unionid)
                          wx.setStorageSync('gzhOpenid', gzhOpenid)

                          this.onShow()
                          wx.showToast({
                            title: '成功',
                          })
                        },
                        fail: err => {
                          console.log('unionid gzhOpenid 更新 失败', err)
                          wx.showToast({
                            icon: 'error',
                            title: '失败',
                          })
                        }
                      })
                  }
                  if (!res.data[0].hasRelogin) {
                    wx.cloud.database().collection('user').doc(res.data[0]._id)
                      .update({
                        data: {
                          hasRelogin: true,
                        },
                        success: res => {
                          console.log('hasRelogin 更新', res.stats.updated, res)

                        },
                        fail: err => {
                          console.log('hasRelogin 更新 失败', err)

                        }
                      })
                  }

                  /*
                  老用户：
                  先关注公众号，获取 gzhOpenid
                  已注册，如果有 gzhOpenid ，则缓存
                  */
                  if (res.data[0].gzhOpenid) {
                    wx.setStorageSync('gzhOpenid', res.data[0].gzhOpenid)
                  }
                  // 如果已经注册，直接缓存用户信息
                  wx.setStorageSync('userinfo', userinfo)
                  // 保存到本地 openid
                  wx.setStorageSync('openid', openid)
                  // 保存到本地 id
                  wx.setStorageSync('id', res.data[0]._id)
                  // 缓存 登陆状态为
                  wx.setStorageSync('login_ok', true)
                  // 缓存 管理员
                  wx.setStorageSync('isAdmin', res.data[0].isAdmin)
                  // 缓存 商家
                  wx.setStorageSync('isShangjia', res.data[0].isShangjia)
                  // 缓存 积分
                  wx.setStorageSync('watchLiaotian', []) // 缓存 watchLiaotian

                  wx.setStorageSync('jifen', res.data[0].jifen)
                  wx.setStorageSync('qiandao', res.data[0].qiandao)
                  this.setData({
                    jifen: res.data[0].jifen
                  })

                  // 检查是否已选择校区
                  const selectedCampus = wx.getStorageSync('selectedCampus')
                  if (!selectedCampus) {
                    // 如果未选择校区，跳转到校区选择页面
                    wx.navigateTo({
                      url: '/pages/campus/campus'
                    })
                  } else {
                    // 如果已选择校区，跳转到主页面
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  }
                }

              })
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)
            wx.showToast({
              icon: 'error',
              title: '登陆失败',
            })
          }
        })

        this.setData({
          login_ok: true,
          userinfo: res.userInfo,
          nickName: res.userInfo.nickName,
          city: res.userInfo.city,
          gender: res.userInfo.gender,
          province: res.userInfo.province,
          avatarUrl: res.userInfo.avatarUrl
        })

      },
      fail: err => {
        console.log('用户授权登陆 失败', err)
        this.setData({
          login_ok: false
        })
        wx.showToast({
          icon: 'error',
          title: '注册失败',
        })
      }
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

  getPhoneNumber(e) {
    console.log('获取电话号码', e)
  },
  inputPhoneNumber(e) {
    this.setData({
      userPhoneNumber: e.detail.value
    })
    // console.log('填入的手机号码：',e.detail.value)
  },


  onLoad: function (options) {
    console.log('onload');
    if (options.isLookuserinfo) {
      wx.showLoading({})
      console.log('isLookuserinfo', options.isLookuserinfo);
      var _openid = options._openid
      this.setData({
        isLookuserinfo: options.isLookuserinfo,
        _openid,
      })
      var that = this
      wx.cloud.callFunction({
          name: 'yonghu',
          data: {
            _openid,
            lookuserinfo: true,
          }
        })
        .then(res => {
          wx.hideLoading({})
          console.log('isLookuserinfo', res.result.data);
          var look_zhuceTime = res.result.data[0].zhuceTime.slice(0, 10)
          var look_gender = res.result.data[0].gender
          if (look_gender == '1') {
            this.setData({
              look_gender: '男'
            })
          } else if (look_gender == '2') {
            this.setData({
              look_gender: '女'
            })
          } else {
            this.setData({
              look_gender,
            })
          }
          that.setData({
            look_avatarUrl: res.result.data[0].avatarUrl,
            look_nickName: res.result.data[0].nickName,
            look_city: res.result.data[0].city,
            look_province: res.result.data[0].province,
            look_gender: res.result.data[0].gender,
            look_birthday: res.result.data[0].birthday,
            look_nianji: res.result.data[0].nianji,
            look_xueyuan: res.result.data[0].xueyuan,
            look_banji: res.result.data[0].banji,
            look_xuehao: res.result.data[0].xuehao,
            look_userPhoneNumber: res.result.data[0].userPhoneNumber,
            look_zhuceTime,
          })
        })
        .catch(err => {
          console.log(err);
        })
    }
    wx.getSystemInfo({
      success: (res) => {
        console.log(res);
        this.setData({
          screenHeight: res.windowHeight,
        })
      },
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  onShow: function () {
    this.setData({
      banner_daiqu: globalData.banner_daiqu
    })
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var _id = wx.getStorageSync('id')
    if (openid && userinfo) {
      this.setData({
        login_ok: true
      })
      wx.cloud.database().collection('user').doc(_id)
        .get()
        .then(res => {
          var zhuceTime = res.data.zhuceTime.slice(0, 10)
          var gender = res.data.gender
          if (gender == '1') {
            this.setData({
              gender: '男'
            })
          } else if (gender == '2') {
            this.setData({
              gender: '女'
            })
          } else {
            this.setData({
              gender,
            })
          }
          var birthday = res.data.birthday
          if (birthday == '') {
            this.setData({
              val_birthday: '2000-01-01',
            })
          } else {
            this.setData({
              val_birthday: birthday,

            })
          }
          var avatarUrl = userinfo.avatarUrl

          var nianji = res.data.nianji
          var xueyuan = res.data.xueyuan
          var banji = res.data.banji
          var xuehao = res.data.xuehao
          var userPhoneNumber = res.data.userPhoneNumber
          var nickName = userinfo.nickName
          var province = userinfo.province
          var city = userinfo.city
          var list = [nianji, xueyuan, banji, xuehao, userPhoneNumber, nickName, gender, province, city, birthday, ]
          var ziliaoPercent = this.ziliaoPercent(list)

          this.setData({
            ziliaoPercent,

            birthday,
            nianji,
            xueyuan,
            banji,
            xuehao,
            userPhoneNumber,

            nickName,
            avatarUrl,
            province,
            city,

            zhuceTime,
            login_ok: true,
          })

        })

    } else {
      this.setData({
        login_ok: false
      })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  toLog: function() {
    wx.navigateTo({
      url: '/pages/wode/log/log'
    })
  },
})