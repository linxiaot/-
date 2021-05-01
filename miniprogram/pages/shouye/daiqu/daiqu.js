// pages/shouye/daiqu/daiqu.js
var utils_time = require('../../../utils/time.js') //获取时间等
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'


Page({
  data: {
    kd_Dian: "--请选择--",
    kd_Name: "",
    kd_PhoNum: "",
    qh_Ma: "",
    sd_Didian: "--请选择--",
    input_sd_Didian: '',
    dd_Status: '0', //订单状态 起始为0  ，完成后为 1 
    // is_Quxiao:false, //订单是否被用户取消，实现条件 
    //dialog
    dialogShow: false,
    showOneButtonDialog: false,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    dxbuttons: [{
      text: '取消'
    }, {
      text: '提取'
    }],
    //判断用户 是否登陆
    login_ok: false,
    // form 输入框状态 判断用户填表正确 
    value_kd_PhoNum: '',
    showClearBtn_kd_PhoNum: false,
    isWaring_kd_PhoNum: false,

    value_kd_Name: '',
    showClearBtn_kd_Name: false,
    isWaring_kd_Name: false,

    value_qh_Ma: '',
    showClearBtn_qh_Ma: false,
    isWaring_qh_Ma: false,

    value_sd_Didian: '',
    showClearBtn_sd_Didian: false,
    isWaring_sd_Didian: false,
    // 弹出式菜单 选择快递点名称
    showAndroidDialog: false,
    // 快递公司名称
    kdDianList: [{
        name: '中通快递'
      },
      {
        name: '顺丰快递'
      },
      {
        name: '京东快递'
      },
      {
        name: '邮政速递'
      },
      {
        name: '琴湖驿站'
      },
    ],
    // 用户下单完成 是否展示下单页面
    isXiadan: false,
    // 官方微信号
    weiXinhao: 'XDXMF0001',
    //送达地点选择
    //多级选择器  二级选择器
    multiArray: [],
    ptSongdadd: '-宿舍区-',
    ptSongdadd2: '-栋数-',
    ptpickerIndex: 0,
    louDongArr: ['1-栋', '2-栋', '3-栋', '4-栋', '5-栋'],
    sdDidianArr: ['西湖公寓', '琴湖公寓', '金翰林公寓', '南苑宿舍', '北苑宿舍', '兴湘宿舍', '北青&中兴', '湘大南门', '一教区', '二教区', '三教区', '环保&法学', '化学化工', '其他'],
    sdLoudongArr: [],
    wxhaoArr: [],
    sd_Didian_0: '',
    multiIndex: [0, 0],

    // 短信内容
    contentDuanXin: '',
    // 是否显示 剪贴板
    showDuanXin: false,
    // 取货码输入框 是否聚焦 
    focus: false,
    // 剪贴板 为空时
    dx_Weikong: '',
    // 送达地点 选择其他自定义时 跳出输入框
    isZiDingYi: false,
    // 是否展示 提取按钮
    isTiqu: false,
    wxPaisong: '',
    isToptips: false,
    hide: false,
    isAdmin: false,
    isBianji: false,
    shiXiang_1: '',
    shiXiang_2: '',
    shiXiang_3: '',
    isXzq_1: false,
    // 隐藏注意3项
    isHidden: false,


  },

  // ----------------------------------------------------------

  // // 多级选择器  送达地点
  // // 1号选择器
  bindMultiPickerChange: function (e) {
    console.log('点击确定后选择器的值：', e);
    var multiIndex = e.detail.value
    let wxhaoArr = this.data.wxhaoArr
    let wxPaisong = wxhaoArr[multiIndex[0]]
    let multiArray = this.data.multiArray
    var sd_Didian = multiArray[0][multiIndex[0]] + '：' + multiArray[1][multiIndex[1]]
    let sd_Didian_0 = multiArray[0][multiIndex[0]]
    this.setData({
      sd_Didian,
      wxPaisong,
      sd_Didian_0, //宿舍区的值 用来判断是不是选择的 ‘其他’
    })
    if (sd_Didian_0 == '其他') {
      this.setData({
        isZiDingYi: true
      })
    }
    console.log('[送达地点] [缓存] picker发送选择改变，携带值为：', sd_Didian, wxPaisong)
    // 保存 送达地点 到缓存
    wx.setStorageSync('multiIndex', multiIndex)
    wx.setStorageSync('multiArray', multiArray)
  },

  // 多项选择器 送达地点
  // 1号选择器
  bindMultiPickerColumnChange: function (e) {
    // console.log(e);
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    let multiArray = this.data.multiArray
    let sdLoudongArr = this.data.sdLoudongArr
    if (e.detail.column == 0) {
      let louDongArr = sdLoudongArr[e.detail.value]
      multiArray.splice(1, 1, louDongArr)
    }
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
    // 选择器变动之前 都不显示送达地点自定义输入框
    this.setData({
      isZiDingYi: false
    })
  },

  // 用户提交的数据
  toSubmit(e) {
    console.log(e.detail.value);
    let kd_Name = e.detail.value.kd_Name
    let kd_PhoNum = e.detail.value.kd_PhoNum
    let qh_Ma = e.detail.value.qh_Ma
    let input_sd_Didian = e.detail.value.input_sd_Didian

    // 送达地点
    var multiIndex = this.data.multiIndex
    var multiArray = this.data.multiArray
    // var input_sd_Didian = this.data.input_sd_Didian
    // 判断 送达地点 是否为其他自定义
    if (input_sd_Didian) {
      var sd_Didian = multiArray[0][multiIndex[0]] + '：' + multiArray[1][multiIndex[1]] + input_sd_Didian
      // this.setData({
      //   value_sd_Didian: input_sd_Didian
      // })
      wx.setStorageSync('input_sd_Didian', input_sd_Didian)
    } else {
      var sd_Didian = multiArray[0][multiIndex[0]] + '：' + multiArray[1][multiIndex[1]]
    }

    this.setData({
      // kd_Dian: e.detail.value.kd_Dian,
      kd_Name,
      kd_PhoNum,
      qh_Ma,
      sd_Didian,
    })
    wx.setStorageSync('kd_Name', kd_Name)
    wx.setStorageSync('kd_PhoNum', kd_PhoNum)
  },

  // 是否 [弹出] 提示框  用户是否填好空 校验
  openConfirm: function () {
    if (this.data.value_kd_PhoNum.length < 11 && this.data.value_kd_Name.length < 1) {
      wx.showToast({
        icon: 'error',
        title: '填好才能下单哦',
      })
      return
    }
    // 判断 快递点名称 是否选择 ＞ '--请选择--'
    if (this.data.kd_Dian == '--请选择--') {
      console.log('[快递点名称] 没有选择');
      // this.setData({
      //   isWaring_qh_Ma: true,
      // });
      wx.showToast({
        icon: 'error',
        title: '快递点未选',
      })
      return
    }
    // 判断 送达地点 是否选择 ＞ '--请选择--'
    if (this.data.sd_Didian == '--请选择--') {
      console.log('[送达地点] 没有选择');
      wx.showToast({
        icon: 'error',
        title: '送达地点未选',
      })
      return
    }
    // 判断取货码是否填写 ＞ 1位
    if (this.data.value_qh_Ma.length < 1) {
      console.log('[取货码] 没有填');
      this.setData({
        isWaring_qh_Ma: true,
      });
      wx.showToast({
        icon: 'error',
        title: '取货码不能少哦',
      })
      return
    }
    // 判断手机号码是否 ＞= 11位
    if (this.data.value_kd_PhoNum.length < 11) {
      console.log('手机号码小于11位');
      this.setData({
        isWaring_kd_PhoNum: true,
      });
      wx.showToast({
        icon: 'error',
        title: '手机号码太少了',
      })
      return
    }
    // 快递姓名 是否填写
    if (this.data.value_kd_Name.length < 1) {
      this.setData({
        isWaring_kd_Name: true,
      });
      wx.showToast({
        icon: 'error',
        title: '快递姓名没有填',
      })
      return
    }
    // 宿舍区是 其他 是否填入自定义地址
    let sd_Didian_0 = this.data.sd_Didian_0
    if (sd_Didian_0 == '其他') {
      if (this.data.value_sd_Didian.length < 1) {
        wx.showToast({
          icon: 'error',
          title: '填入自定义地址',
        })
        return
      }
    }

    // 判断用户是否微信登陆

    if (this.data.login_ok) {
      this.setData({
        dialogShow: true
      })
    } else {
      utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
    }
  },
  // 用户 提交成功 代取 下单成功
  // 绑定用户的点击事件 确定 和 取消  提交订单 上传数据
  tapDialogButton(e) {
    console.log('确认下单信息时用户点击了：', e.detail.item.text);
    var isXiaDan = e.detail.item.text //用户点击了什么 确定 or 取消
    // 关闭提示框
    this.setData({
      dialogShow: false,
    })

    // 需要上传的数据
    //订单数据
    var sd_Didian = this.data.sd_Didian
    var kd_Dian = this.data.kd_Dian
    var kd_Name = this.data.kd_Name
    var kd_PhoNum = this.data.kd_PhoNum
    var qh_Ma = this.data.qh_Ma
    var dd_Status = this.data.dd_Status //直接添加订单状态
    var xd_time = utils_time.formatTime(new Date())
    var userinfo = wx.getStorageSync('userinfo')
    var id = wx.getStorageSync('id')
    var jifen = {
      jifen_name: '代取',
      jifen_num: 10,
      jifen_time: xd_time
    }
    let that = this
    if (isXiaDan == '确定') {
      console.log('用户点击确定')
      wx.cloud.database().collection('daiqu').add({
        data: {
          kd_Dian,
          kd_Name,
          kd_PhoNum,
          qh_Ma,
          sd_Didian,
          dd_Status, //直接添加订单状态
          xd_time, //下单时间
          sx_time: xd_time, //筛选时间
          nickName: userinfo.nickName,
          // is_Quxiao,
        },
        success: res => {
          that.setData({
            isXiadan: true
          })
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
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
            })
            .catch(err => {
              console.log('[云函数] [积分] 更新 失败：', err)
            })
        },
        fail: err => {
          wx.showToast({
            title: '下单失败',
          })
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })
    } else if (isXiaDan == '取消') {
      console.log('用户点击取消')
    }
  },



  // 用户查看订单
  toDingDan() {
    wx.navigateTo({
      url: '../../wode/dingdan/dingdan'
    })
  },

  // 输入框状态  手机号码 
  onInput_kd_PhoNum(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_kd_PhoNum: value,
      showClearBtn_kd_PhoNum: !!value.length,
      isWaring_kd_PhoNum: false,
    });
    if (evt.detail.value.length == 11) {
      // 收起键盘
      wx.hideKeyboard()
    }
  },
  onClear_kd_PhoNum() {
    this.setData({
      value_kd_PhoNum: '',
      showClearBtn_kd_PhoNum: false,
      isWaring_kd_PhoNum: false,
    });
  },

  // 输入框状态  取货码
  onInput_qh_Ma(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_qh_Ma: value,
      showClearBtn_qh_Ma: !!value.length,
      isWaring_qh_Ma: false,

    });
  },
  onClear_qh_Ma() {
    this.setData({
      value_qh_Ma: '',
      showClearBtn_qh_Ma: false,
      isWaring_qh_Ma: false,
      isTiqu: true,
    });
  },

  // 输入框状态  快递姓名
  onInput_kd_Name(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_kd_Name: value,
      showClearBtn_kd_Name: !!value.length,
      isWaring_kd_Name: false,
    });
  },
  onClear_kd_Name() {
    this.setData({
      value_kd_Name: '',
      showClearBtn_kd_Name: false,
      isWaring_kd_Name: false,
    });
  },

  // 输入框状态  送达地点
  onInput_sd_Didian(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_sd_Didian: value,
      showClearBtn_sd_Didian: !!value.length,
      isWaring_sd_Didian: false,
    });
  },
  onClear_sd_Didian() {
    this.setData({
      value_sd_Didian: '',
      showClearBtn_sd_Didian: false,
      isWaring_sd_Didian: false,
    });
  },



  // 弹出式菜单  快递点名称 
  close: function () {
    this.setData({
      showAndroidDialog: false
    });
  },

  openAndroid: function () {
    this.setData({
      showAndroidDialog: true
    });
  },

  tanChuSheet(e) {
    console.log('点击弹出式菜单,用户选择的快递点是：', e.currentTarget.dataset.name)
    // currentTarget.id
    this.setData({
      showAndroidDialog: false,
      kd_Dian: e.currentTarget.dataset.name
    });
  },
  closeSheet() {
    this.setData({
      showAndroidDialog: false,
    });
  },

  // 下单成功显示页 继续下单
  toContinue() {
    this.setData({
      isXiadan: false,
      value_qh_Ma: '',
      kd_Dian: "--请选择--",
    })
  },
  // 点我复制到剪贴板
  toCopywx() {
    wx.setClipboardData({
      data: this.data.wxPaisong,
      success(res) {
        console.log('用户点击，成功复制微信号', res);
      }
    })
  },

  // 是否粘贴剪贴板的内容
  tapDuanXin(e) {
    console.log('粘贴短信内容 用户点击了：', e.detail.item.text);
    var isZhanTie = e.detail.item.text //用户点击了什么
    // 关闭提示框
    this.setData({
      showDuanXin: false,
      focus: true, //取货码输入框开始聚焦
      isTiqu: true,

    })
    if (isZhanTie == '提取') {
      this.tiQudx()
      this.setData({
        value_qh_Ma: this.data.contentDuanXin
      })
    }
  },


  //提取剪贴板上的 取货码
  tiQudx() {
    //判断是哪家的短信
    var contentDuanXin = this.data.contentDuanXin
    for (var i = 0; i < contentDuanXin.length; i++) {
      // console.log(contentDuanXin[i]);
      if (contentDuanXin[i] == '顺' && contentDuanXin[i + 1] == '丰') {
        let starNum = contentDuanXin.indexOf('码') + 1
        let endNum = contentDuanXin.indexOf('请') - 1
        var qh_Ma = contentDuanXin.slice(starNum, endNum)
        console.log('这是 [顺丰] 的短信：', qh_Ma);
        // 设置 快递点名称 为 顺丰快递
        this.setData({
          kd_Dian: this.data.kdDianList[1].name
        })
        console.log('自动匹配到快递点名称', this.data.kdDianList[1].name);
        break
      }
      if (contentDuanXin[i] == '琴' && contentDuanXin[i + 1] == '湖') {
        let starNum = contentDuanXin.indexOf('凭') + 1
        let endNum1 = contentDuanXin.indexOf('在')
        let endNum2 = contentDuanXin.indexOf('至')
        if (endNum1 || endNum2) {
          var endNum = endNum1 + endNum2 + 1
          console.log('数字', endNum);
        }
        var qh_Ma = contentDuanXin.slice(starNum, endNum)
        console.log('这是 [琴湖菜鸟] 的短信：', qh_Ma);
        // 设置 快递点名称 
        this.setData({
          kd_Dian: this.data.kdDianList[4].name
        })
        console.log('自动匹配到快递点名称', this.data.kdDianList[4].name);
        break
      }
      if (contentDuanXin[i] == '京' && contentDuanXin[i + 1] == '东') {
        let starNum = contentDuanXin.indexOf('尾') + 2
        let endNum = contentDuanXin.indexOf('送') - 1
        var qh_Ma = contentDuanXin.slice(starNum, endNum)

        console.log('这是 [京东] 的短信：', qh_Ma);
        // 设置 快递点名称 
        this.setData({
          kd_Dian: this.data.kdDianList[2].name
        })
        console.log('自动匹配到快递点名称', this.data.kdDianList[2].name);
        break
      }

      if (contentDuanXin[i] == '邮' && contentDuanXin[i + 1] == '政') {
        let starNum1 = contentDuanXin.indexOf('架') + 2
        let endNum1 = contentDuanXin.indexOf('取')
        var qh_Ma1 = contentDuanXin.slice(starNum1, endNum1)
        let starNum2 = contentDuanXin.indexOf('您') + 2
        let endNum2 = contentDuanXin.indexOf('包') - 1
        var qh_Ma2 = contentDuanXin.slice(starNum2, endNum2)
        var qh_Ma = qh_Ma1 + '-' + qh_Ma2
        console.log('这是 [邮政] 的短信：', qh_Ma);
        // 设置 快递点名称 为 邮政速递
        this.setData({
          kd_Dian: this.data.kdDianList[3].name
        })
        console.log('自动匹配到快递点名称', this.data.kdDianList[3].name);
        break
      } else {

        qh_Ma = contentDuanXin
      }
    }
    if (contentDuanXin.includes('东门对面') || contentDuanXin.includes('百岁堂')) {
      if (contentDuanXin.includes('19198286188') || contentDuanXin.includes('中通')) {
        // for (var i = 0; i < contentDuanXin.length; i++) {
        let starNum = contentDuanXin.indexOf('码') + 1
        let endNum = contentDuanXin.indexOf('湘') - 1
        var qh_Ma = contentDuanXin.slice(starNum, endNum)
        console.log('这是 [中通] 的短信：', qh_Ma);
        // 设置 快递点名称 为 中通快递
        this.setData({
          kd_Dian: this.data.kdDianList[0].name
        })
        console.log('自动匹配到快递点名称', this.data.kdDianList[0].name);
        // }
      } else {
        let starNum = contentDuanXin.indexOf('凭') + 1
        let endNum1 = contentDuanXin.indexOf('在')
        let endNum2 = contentDuanXin.indexOf('至')
        if (endNum1 || endNum2) {
          var endNum = endNum1 + endNum2 + 1
          console.log('数字', endNum);
        }
        var qh_Ma = contentDuanXin.slice(starNum, endNum)
        console.log('这是 [东门菜鸟] 的短信：', qh_Ma);
        // 设置 快递点名称 
        this.setData({
          kd_Dian: this.data.kdDianList[0].name
        })
        console.log('自动匹配到快递点名称', this.data.kdDianList[0].name);
      }
    }
    this.setData({
      contentDuanXin: qh_Ma,
    })

  },

  tapTiQudx() {
    this.setData({
      showDuanXin: true,
      contentDuanXin: this.data.value_qh_Ma,
    })
  },
  outInput_qh_Ma() {
    this.setData({
      isTiqu: false
    })
  },
  tapInput_qh_Ma() {
    this.setData({
      isTiqu: true
    })
  },

  toBianji(e) {
    console.log('管理员点击了编辑按钮', e.detail.value);
    this.setData({
      isBianji: e.detail.value
    })
  },
  toToptips(e) {
    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    let that = this
    console.log('管理员点击了 是否显示 Toptips', e.detail.value);
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          _id: 'toptipsdaiqu',
          action: 'toptips',
          isToptips: e.detail.value
        },
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
        that.setData({
          isToptips: e.detail.value
        })
        // wx.setStorageSync('jifen', jifen)
        setTimeout(function () {
          wx.hideLoading()
        }, 300)
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })

  },
  inputToptips(e) {
    this.setData({
      text_toptips: e.detail.value
    })
    // console.log(e.detail.value);
    // 温馨提示：试运行期间，只下单体验，实际不送件！
  },

  toToptips_text() {
    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    let text_toptips = this.data.text_toptips
    let that = this
    console.log('管理员提交了 text_toptips', text_toptips);
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          _id: 'toptipsdaiqu',
          action: 'Toptips_text',
          text: text_toptips,
          // isToptips:e.detail.value
        },
      })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
        setTimeout(function () {
          wx.hideLoading()
        }, 300)
        wx.showModal({
          cancelColor: 'red',
          title: '提交成功',
          content: '点击“确定”立即查看效果',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              // 返回主页面页面 delta: 2  上级页面 delta: 1
              wx.navigateBack({
                delta: 2
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })

      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })
  },

  inputShixiang_1(e) {
    this.setData({
      shiXiang_1: e.detail.value
    })
  },
  inputShixiang_2(e) {
    this.setData({
      shiXiang_2: e.detail.value
    })
  },
  inputShixiang_3(e) {
    this.setData({
      shiXiang_3: e.detail.value
    })
  },

  toShixiang() {
    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    let shiXiang_1 = this.data.shiXiang_1
    let shiXiang_2 = this.data.shiXiang_2
    let shiXiang_3 = this.data.shiXiang_3
    let that = this
    console.log('管理员提交了 shiXiang_1,2,3', shiXiang_1, shiXiang_2, shiXiang_3);
    wx.cloud.callFunction({
        name: 'banner',
        data: {
          _id: 'toptipsdaiqu',
          action: 'toShixiang',
          shiXiang_1: shiXiang_1,
          shiXiang_2: shiXiang_2,
          shiXiang_3: shiXiang_3,
        },
      })
      .then(res => {
        setTimeout(function () {
          wx.hideLoading()
        }, 300)
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
        wx.showModal({
          cancelColor: 'red',
          title: '提交成功',
          content: '点击“确定”立即查看效果',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              // 返回主页面页面 delta: 2  上级页面 delta: 1
              wx.navigateBack({
                delta: 2
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })
  },


  toYincangOpen: function () {
    setTimeout(() => {
      this.setData({
        isHidden: false,
      });
    }, 300);
  },
  toYincangClose: function () {
    setTimeout(() => {
      this.setData({
        isHidden: true,
      });
    }, 300);
  },




  // toXuanzq(e) {
  //   wx.showLoading({
  //     title: '变更中',
  //     mask: true,
  //   })
  //   let that = this
  //   console.log('管理员点击了 送达地点全选 isXzq_1', e.detail.value);
  //   wx.cloud.callFunction({
  //       name: 'banner',
  //       data: {
  //         _id: 'toptipsdaiqu',
  //         action: 'toXuanzq',
  //         isXzq_1: e.detail.value
  //       },
  //     })
  //     .then(res => {
  //       console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
  //       that.setData({
  //         isXzq_1: e.detail.value
  //       })
  //       setTimeout(function () {
  //         wx.hideLoading()
  //       }, 300)
  //     })
  //     .catch(err => {
  //       console.log('[云函数] [banner] 更新 失败：', err)
  //     })

  // },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('页面 加载 了');
    let isAdmin = wx.getStorageSync('isAdmin')
    if (isAdmin) {
      this.setData({
        isAdmin: isAdmin
      })
    }
    // 获取提醒 地点选择列表 等
    let ptpickerIndex = this.data.ptpickerIndex
    let multiArray = this.data.multiArray
    wx.cloud.database().collection('banner').where({
        _id: 'toptipsdaiqu'
      })
      .get()
      .then(res => {
        console.log('获取提醒 地点选择列表 成功：', res.data[0]);
        let sdDidianArr = res.data[0].sdDidian
        let sdLoudongArr = res.data[0].sdLoudong
        let louDongArr = sdLoudongArr[ptpickerIndex]
        multiArray.push(sdDidianArr, louDongArr)
        let wxPaisong = (res.data[0].wxhao)[this.data.multiIndex[0]]
        this.setData({
          text_toptips: res.data[0].text,
          isToptips: res.data[0].isToptips,
          shiXiang_1: res.data[0].shiXiang_1,
          shiXiang_2: res.data[0].shiXiang_2,
          shiXiang_3: res.data[0].shiXiang_3,
          // isXzq_1: res.data[0].isXzq_1,
          sdDidianArr: res.data[0].sdDidian,
          sdLoudongArr: res.data[0].sdLoudong,
          wxhaoArr: res.data[0].wxhao,
          multiArray: multiArray,
          wxPaisong
        })

      })
      .catch(err => {
        console.log('获取提醒 地点选择列表 失败', err);
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log('页面 初次渲染 了');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log('页面 显示 了');
    //获取登陆状态
    var login_ok = wx.getStorageSync('login_ok')
    if (login_ok) {
      this.setData({
        login_ok: true
      })
    }

    // 获取上次填写的快递姓名 和 手机号码
    var kd_Name = wx.getStorageSync('kd_Name')
    var kd_PhoNum = wx.getStorageSync('kd_PhoNum')
    var input_sd_Didian = wx.getStorageSync('input_sd_Didian')
    var multiIndex = wx.getStorageSync('multiIndex')
    var multiArray = wx.getStorageSync('multiArray')
    let wxhaoArr = this.data.wxhaoArr
    let wxPaisong = wxhaoArr[multiIndex[0]]


    if (multiIndex && multiArray) {
      var sd_Didian = multiArray[0][multiIndex[0]] + '：' + multiArray[1][multiIndex[1]]
      var sd_Didian_0 = multiArray[0][multiIndex[0]]
      this.setData({
        multiIndex,
        multiArray,
        wxPaisong: wxPaisong,
        sd_Didian,
      })
    } else {
      let wxh_Chushizhi = wxhaoArr[this.data.multiIndex[0]]
      this.setData({
        wxPaisong: wxh_Chushizhi
      })
    }

    if (kd_Name) {
      this.setData({
        value_kd_Name: kd_Name
      })
    }
    if (kd_PhoNum) {
      // console.log('保存的手机号码 是有的');
      this.setData({
        value_kd_PhoNum: kd_PhoNum
      })
    }

    // 宿舍区是 其他 是否填入自定义地址
    if (sd_Didian_0 == '其他') {
      this.setData({
        isZiDingYi: true,
        // value_sd_Didian: input_sd_Didian,
      })
    }

    if (input_sd_Didian) {
      // console.log('自定义地址 是有的');
      this.setData({
        value_sd_Didian: input_sd_Didian
      })
    }

    // 是否显示 获取剪贴板 短信
    let that = this
    wx.getClipboardData({
      success(res) {
        console.log('onShow获取剪贴板的内容', res)
        var contentDuanXin = res.data
        if (!contentDuanXin == '') {
          that.setData({
            contentDuanXin,
            dx_Weikong: '',
            showDuanXin: true,
          })
        } else {
          that.setData({
            dx_Weikong: '请复制取货码短信',
            showDuanXin: true,

          })
        }
      },
      fail(err) {
        console.log('onShow获取剪贴板的内容 失败', err);
      }
    })

  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // console.log('页面隐藏了');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log('页面 卸载 了');
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

  }

})