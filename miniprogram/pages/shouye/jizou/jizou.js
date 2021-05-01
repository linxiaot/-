// pages/shouye/jizou/jizou.js

var utils_time = require('../../../utils/time.js') //获取时间等
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'

Page({

  data: {
    // 取件时间
    // qujTimeList: ['09:00-11:00','12:00-14:00','16:00-18:00','20:00-22:00',],
    qujTimeList: [{
        name: '09:00-11:00'
      },
      {
        name: '12:00-14:00'
      },
      {
        name: '16:00-18:00'
      },
      {
        name: '20:00-22:00'
      },
    ],
    qujTime: '--请选择--',
    showAndroidDialog: false,
    // 目的地
    mdd: '',
    // mdd: '--请选择--',
    JJ_Biaozh: '',
    // 寄件费用
    JJ_feiyong: '-',
    //  需要提交的订单内容
    company: "",
    JJ_Name: "",
    JJ_PhoNum: "",
    JJ_Didian: "--请选择--",
    JJ_weight: null,
    JJ_JinE: 0,
    input_JJ_Didian: '',
    dd_Status: '0', //订单状态 起始为0  ，完成后为 1 
    // is_Quxiao:false, //订单是否被用户取消，实现条件 
    //dialog
    dialogShow: false,
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
    value_JJ_PhoNum: '',
    showClearBtn_JJ_PhoNum: false,
    isWaring_JJ_PhoNum: false,

    value_JJ_Name: '',
    showClearBtn_JJ_Name: false,
    isWaring_JJ_Name: false,

    value_JJ_weight: null,
    showClearBtn_JJ_weight: false,
    isWaring_JJ_weight: false,

    value_JJ_Didian: '',
    showClearBtn_JJ_Didian: false,
    isWaring_JJ_Didian: false,

    value_mdd: '',
    showClearBtn_mdd: false,
    isWaring_mdd: false,
    // 用户下单完成 是否展示下单页面
    isXiadan: false,
    // 官方微信号
    weiXinhao: 'XDXMF0001',
    //取件地点选择
    //多级选择器  二级选择器
    multiArray_JJ: [],
    ptSongdadd: '-宿舍区-',
    ptSongdadd2: '-栋数-',
    ptpickerIndex: 0,
    louDongArr: ['1-栋', '2-栋', '3-栋', '4-栋', '5-栋'],
    sdDidianArr: ['西湖公寓', '琴湖公寓', '金翰林公寓', '南苑宿舍', '北苑宿舍', '兴湘宿舍', '北青&中兴', '湘大南门', '一教区', '二教区', '三教区', '环保&法学', '化学化工', '其他'],
    sdLoudongArr: [],
    wxhaoArr: [],
    JJ_Didian_0: '',
    multiIndex_JJ: [0, 0],

    // 短信内容
    contentDuanXin: '',
    // 是否显示 剪贴板
    showDuanXin: false,
    // 重量输入框 是否聚焦 
    focus: false,
    // 剪贴板 为空时
    dx_Weikong: '',
    // 取件地点 选择其他自定义时 跳出输入框
    isZiDingYi: false,
    // 是否展示 提取按钮
    isTiqu: false,
    // 派送区域短信
    wxPaisong_list: ['XDXMF0001', 'XDXMF0002', 'XDXMF0003', 'XDXMF0004', 'XDXMF0005', 'axtu2021'],
    wxPaisong: '',
    isAdmin: false,
    isBianji: false,
    isHidden: false,
  },

  // ----------------------------------------------------------
  // onInput_mdd(e) {
  //   this.setData({
  //     mdd: e.detail.value
  //   })
  // },
  openAndroid: function () {
    this.setData({
      showAndroidDialog: true
    });
  },
  toqujTime(e) {
    console.log('点击弹出式菜单,用户选择的 取件时间 是：', e.currentTarget.dataset.name)
    // currentTarget.id
    this.setData({
      showAndroidDialog: false,
      qujTime: e.currentTarget.dataset.name
    });
  },
  closeSheet() {
    this.setData({
      showAndroidDialog: false,
    });
  },

  toHuoqu() {

    let inputFajdz = this.data.inputFajdz
    wx.request({
      url: 'https://aip.baidubce.com/oauth/2.0/token',
      method: 'get', //仅为示例，并非真实的接口地址
      data: {
        grant_type: 'client_credentials',
        client_id: 'nNFpBwQTTI4FLIyyNqpmsx54',
        client_secret: '2UpeoWVp485yb3QNZiUwNzh3tbBMyoxN',
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log('获取Access Token成功', res.data)
      }
    })
  },

  // 多级选择器  取件地点

  bindMultiPickerChange: function (e) {
    let multiIndex_JJ = e.detail.value //
    let wxhaoArr = this.data.wxhaoArr
    let wxPaisong = wxhaoArr[multiIndex_JJ[0]]
    let multiArray_JJ = this.data.multiArray_JJ
    let JJ_Didian = multiArray_JJ[0][multiIndex_JJ[0]] + '：' + multiArray_JJ[1][multiIndex_JJ[1]]
    let JJ_Didian_0 = multiArray_JJ[0][multiIndex_JJ[0]]
    // 多级选择器选定了 其他自定义 显示输入框
    if (JJ_Didian_0 == '其他') {
      this.setData({
        isZiDingYi: true
      })
    }
    this.setData({
      JJ_Didian,
      wxPaisong,
      JJ_Didian_0, //宿舍区的值 用来判断是不是选择的 ‘其他’
    })

    console.log('[取件地点] [缓存] picker发送选择改变，携带值为：', JJ_Didian, wxPaisong)
    // 保存 取件地点 到缓存
    wx.setStorageSync('multiIndex_JJ', multiIndex_JJ)
    wx.setStorageSync('multiArray_JJ', multiArray_JJ)
  },

  bindMultiPickerColumnChange: function (e) {
    // console.log(e);
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray_JJ: this.data.multiArray_JJ,
      multiIndex_JJ: this.data.multiIndex_JJ
    };
    let multiArray_JJ = this.data.multiArray_JJ
    let sdLoudongArr = this.data.sdLoudongArr
    if (e.detail.column == 0) {
      let louDongArr = sdLoudongArr[e.detail.value]
      multiArray_JJ.splice(1, 1, louDongArr)
    }
    data.multiIndex_JJ[e.detail.column] = e.detail.value;
    this.setData(data);
    // 选择器变动之前 都不显示取件地点自定义输入框
    this.setData({
      isZiDingYi: false
    })
  },

  // 用户提交的数据
  toSubmit(e) {
    console.log('用户点下单后，绑定的信息：', e.detail.value);
    let JJ_Name = e.detail.value.JJ_Name
    let JJ_PhoNum = e.detail.value.JJ_PhoNum
    let JJ_weight = e.detail.value.JJ_weight
    let input_JJ_Didian = e.detail.value.input_JJ_Didian
    let mdd = e.detail.value.mdd

    // 取件地点
    var multiIndex_JJ = this.data.multiIndex_JJ
    var multiArray_JJ = this.data.multiArray_JJ
    // var input_JJ_Didian = this.data.input_JJ_Didian
    // 判断 取件地点 是否为其他自定义
    if (input_JJ_Didian) {
      var JJ_Didian = multiArray_JJ[0][multiIndex_JJ[0]] + '：' + multiArray_JJ[1][multiIndex_JJ[1]] + input_JJ_Didian
      // this.setData({
      //   value_JJ_Didian: input_JJ_Didian
      // })
      wx.setStorageSync('input_JJ_Didian', input_JJ_Didian)
    } else {
      var JJ_Didian = multiArray_JJ[0][multiIndex_JJ[0]] + '：' + multiArray_JJ[1][multiIndex_JJ[1]]
    }
    this.setData({
      // mdd: e.detail.value.mdd,
      JJ_Name,
      JJ_PhoNum,
      JJ_weight,
      mdd,
      JJ_Didian,
    })
    wx.setStorageSync('JJ_Name', JJ_Name)
    wx.setStorageSync('JJ_PhoNum', JJ_PhoNum)
  },

  // 是否 [弹出] 提示框  用户是否填好空 校验
  openConfirm: function () {
    // 一项都没填 提醒
    if (this.data.value_JJ_PhoNum.length < 11 && this.data.value_JJ_Name.length < 1) {
      wx.showToast({
        icon: 'error',
        title: '填好才能下单哦',
      })
      return
    }
    // 判断 重量 是否填写 ＞ 1位
    if (this.data.value_JJ_weight.length < 1) {
      console.log('[重量] 没有填');
      this.setData({
        isWaring_JJ_weight: true,
      });
      wx.showToast({
        icon: 'error',
        title: '重量不能少哦',
      })
      return
    }
    // 判断手机号码是否 ＞= 11位
    if (this.data.value_JJ_PhoNum.length < 11) {
      console.log('手机号码小于11位');
      this.setData({
        isWaring_JJ_PhoNum: true,
      });
      wx.showToast({
        icon: 'error',
        title: '手机号码太少了',
      })
      return
    }
    // 寄件人姓名 是否填写
    if (this.data.value_JJ_Name.length < 1) {
      this.setData({
        isWaring_JJ_Name: true,
      });
      wx.showToast({
        icon: 'error',
        title: '寄件人姓名没有填',
      })
      return
    }
    // 目的地 是否 填写
    if (this.data.value_mdd.length < 1) {
      wx.showToast({
        icon: 'error',
        title: '详细地址为空',
      })
      return
    }
    // 取件地点 是否选择
    if (this.data.JJ_Didian == '--请选择--') {
      wx.showToast({
        icon: 'error',
        title: '取件地点未选',
      })
      return
    }
    // 取件时间 是否选择
    if (this.data.qujTime == '--请选择--') {
      wx.showToast({
        icon: 'error',
        title: '取件时间未选',
      })
      return
    }
    // 取件点 其他 是否填入自定义地址
    let JJ_Didian_0 = this.data.JJ_Didian_0
    if (JJ_Didian_0 == '其他') {
      if (this.data.value_JJ_Didian.length < 1) {
        wx.showToast({
          icon: 'error',
          title: '填入自定义地址',
        })
        return
      }
    }

    // 判断用户是否微信登陆
    if (this.data.login_ok) {
      console.log('点击下单后 判断是否登录：', this.data.login_ok);
      this.setData({
        dialogShow: true
      })
    } else {
      utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
    }
  },
  // 用户提交成功
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
    var qujTime = this.data.qujTime
    var JJ_Didian = this.data.JJ_Didian
    var JJ_Name = this.data.JJ_Name
    var JJ_PhoNum = this.data.JJ_PhoNum
    var mdd = this.data.mdd
    var JJ_weight = this.data.JJ_weight + '公斤'
    var dd_Status = this.data.dd_Status //直接添加 订单状态
    var company = this.data.company //直接添加 快递公司
    var xd_time = utils_time.formatTime(new Date())
    var userinfo = wx.getStorageSync('userinfo')
    var id = wx.getStorageSync('id')
    var jifen = {
      jifen_name: '寄件',
      jifen_num: 10,
      jifen_time: xd_time
    }

    let that = this
    if (isXiaDan == '确定') {
      console.log('用户点击确定')
      wx.cloud.database().collection('jijian').add({
        data: {
          mdd,
          JJ_Name,
          JJ_PhoNum,
          JJ_weight,
          JJ_Didian,
          qujTime,
          xd_time, //下单时间
          dd_Status, //直接添加 订单状态
          company, //直接添加 快递公司
          nickName: userinfo.nickName,
          yundanNum:'',
          // is_Quxiao,
        },
        success: res => {
          // 下单成功
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
              console.log('[云函数] [积分] 更新 成功：', res)
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
      url: '../../wode/dingdan/dingdan?isJijian=true'
    })
  },

  // 输入框状态  手机号码 
  onInput_JJ_PhoNum(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_JJ_PhoNum: value,
      showClearBtn_JJ_PhoNum: !!value.length,
      isWaring_JJ_PhoNum: false,
    });
    if (evt.detail.value.length == 11) {
      // 收起键盘
      wx.hideKeyboard(this.data.JJ_weight)
    }
  },
  onClear_JJ_PhoNum() {
    this.setData({
      value_JJ_PhoNum: '',
      showClearBtn_JJ_PhoNum: false,
      isWaring_JJ_PhoNum: false,
    });
  },

  // 目的地的选择
  bindPicker3Change: function (e) {
    let mdd = this.data.mdd_list[e.detail.value]
    let value_JJ_weight = this.data.value_JJ_weight
    // let showClearBtn_JJ_weight = this.data.showClearBtn_JJ_weight
    this.setData({
      mdd,
      // JJ_feiyong: '-'
    })
    if (value_JJ_weight) {
      this.sumFeiyong(value_JJ_weight, mdd)
    }
  },


  sumFeiyong(weight, mdd) {
    // console.log('费用预计 计算结果为：weight=',this.data.JJ_feiyong);

    if (mdd.includes('湖南')) {
      // console.log('新算式成立');
      this.setData({
        JJ_feiyong: (weight - 1) * 4 + 10
      })
    }
    if (mdd.includes('江西') || mdd.includes('安徽') || mdd.includes('天津') || mdd.includes('河南') || mdd.includes('福建') || mdd.includes('河北') || mdd.includes('山东') || mdd.includes('广西')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 6 + 12
      })
    }
    if (mdd.includes('湖北') || mdd.includes('上海') || mdd.includes('广东') || mdd.includes('浙江') || mdd.includes('江苏')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 6 + 10
      })
    }
    if (mdd.includes('北京') || mdd.includes('陕西') || mdd.includes('重庆') || mdd.includes('山西') || mdd.includes('贵州') || mdd.includes('云南') || mdd.includes('四川')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 8 + 15
      })
    }
    if (mdd.includes('黑龙江') || mdd.includes('辽宁') || mdd.includes('吉林')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 8 + 15
      })
    }
    if (mdd.includes('海南') || mdd.includes('甘肃')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 14 + 17
      })
    }
    if (mdd.includes('青海') || mdd.includes('宁夏')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 16 + 18
      })
    }
    if (mdd.includes('内蒙古')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 15 + 20
      })
    }
    if (mdd.includes('新疆')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 20 + 28
      })
    }
    if (mdd.includes('西藏')) {
      this.setData({
        JJ_feiyong: (weight - 1) * 20 + 25
      })
    }
  },

  inputChange_mdd() {
    console.log('inputChange_mdd');
    let value_JJ_weight = this.data.value_JJ_weight
    if (!value_JJ_weight == '') {
      this.sumFeiyong(value_JJ_weight, this.data.value_mdd)
    } else {
      this.setData({
        JJ_feiyong: '-'
      })
    }
  },
  // 输入框状态  重量
  onInput_JJ_weight(evt) {
    // console.log('重量输入框的参数',evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_JJ_weight: value,
      showClearBtn_JJ_weight: !!value.length,
      isWaring_JJ_weight: false,
    });
    // 开始计算 预估费用
    if (!value == '') {
      this.sumFeiyong(value, this.data.value_mdd)
    } else {
      this.setData({
        JJ_feiyong: '-'
      })
    }
  },
  onClear_JJ_weight() {
    this.setData({
      value_JJ_weight: '',
      showClearBtn_JJ_weight: false,
      isWaring_JJ_weight: false,
      isTiqu: true,
      JJ_feiyong: '-',
    });
  },

  // 输入框状态  寄件人姓名
  onInput_JJ_Name(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_JJ_Name: value,
      showClearBtn_JJ_Name: !!value.length,
      isWaring_JJ_Name: false,
    });
  },
  onClear_JJ_Name() {
    this.setData({
      value_JJ_Name: '',
      showClearBtn_JJ_Name: false,
      isWaring_JJ_Name: false,
    });
  },

  // 输入框状态  取件地点
  onInput_JJ_Didian(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_JJ_Didian: value,
      showClearBtn_JJ_Didian: !!value.length,
      isWaring_JJ_Didian: false,
    });
  },
  onClear_JJ_Didian() {
    this.setData({
      value_JJ_Didian: '',
      showClearBtn_JJ_Didian: false,
      isWaring_JJ_Didian: false,
    });
  },

  // 输入框状态  详细地址
  onInput_mdd(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_mdd: value,
      showClearBtn_mdd: !!value.length,
      isWaring_mdd: false,
    });
    // 开始计算 预估费用
    let value_JJ_weight = this.data.value_JJ_weight
    if (!value_JJ_weight == '') {
      this.sumFeiyong(value_JJ_weight, value)
    } else {
      this.setData({
        JJ_feiyong: '-'
      })
    }
  },
  onClear_mdd() {
    this.setData({
      value_mdd: '',
      showClearBtn_mdd: false,
      isWaring_mdd: false,
    });
  },



  // 下单成功显示页 继续下单
  toContinue() {
    this.setData({
      isXiadan: false,
      value_JJ_weight: null,
      // mdd: "--请选择--",
      JJ_feiyong: '-'
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
  // 管理员是否开始编辑
  toBianji(e) {
    console.log('管理员点击了编辑按钮', e.detail.value);
    this.setData({
      isBianji: e.detail.value
    })
  },
  // 提醒编辑
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
          _id: 'toptipsjijian',
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
          _id: 'toptipsjijian',
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
  // 事项编辑
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
          _id: 'toptipsjijian',
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
  // 隐藏注意事项3项
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('寄走 页面加载');
    let isAdmin = wx.getStorageSync('isAdmin')
    if (isAdmin) {
      this.setData({
        isAdmin: isAdmin
      })
    }
    // 获取提醒 地点选择列表 等
    let ptpickerIndex = this.data.ptpickerIndex
    let multiArray_JJ = this.data.multiArray_JJ
    wx.cloud.database().collection('banner').where({
        _id: 'toptipsjijian'
      })
      .get()
      .then(res => {
        console.log('获取提醒 地点选择列表 成功：', res.data[0]);
        let sdDidianArr = res.data[0].sdDidian
        let sdLoudongArr = res.data[0].sdLoudong
        let louDongArr = sdLoudongArr[ptpickerIndex]
        multiArray_JJ.push(sdDidianArr, louDongArr)
        let wxPaisong = (res.data[0].wxhao)[this.data.multiIndex_JJ[0]]
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
          multiArray_JJ: multiArray_JJ,
          wxPaisong
        })

      })
      .catch(err => {
        console.log('获取提醒 地点选择列表 失败', err);
      })

    // console.log('页面 加载 了');
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

    // 获取上次填写的寄件人姓名 和 手机号码
    var JJ_Name = wx.getStorageSync('JJ_Name')
    var JJ_PhoNum = wx.getStorageSync('JJ_PhoNum')
    var input_JJ_Didian = wx.getStorageSync('input_JJ_Didian')
    var multiIndex_JJ = wx.getStorageSync('multiIndex_JJ')
    var multiArray_JJ = wx.getStorageSync('multiArray_JJ')
    let wxhaoArr = this.data.wxhaoArr
    


    if (multiIndex_JJ && multiArray_JJ) {
      var wxPaisong = wxhaoArr[multiIndex_JJ[0]]
      var JJ_Didian = multiArray_JJ[0][multiIndex_JJ[0]] + '：' + multiArray_JJ[1][multiIndex_JJ[1]]
      var JJ_Didian_0 = multiArray_JJ[0][multiIndex_JJ[0]]
      // 设置取件地点 多项选择器的 初始值
      this.setData({
        multiIndex_JJ,
        multiArray_JJ,
        wxPaisong: wxPaisong,
        JJ_Didian,
      })
    } else { //解决 从未进入，第一次进入小程序的 不显示微信
      let wxh_Chushizhi = wxhaoArr[this.data.multiIndex_JJ[0]]
      this.setData({
        wxPaisong: wxh_Chushizhi
      })
    }

    if (JJ_Name) {
      this.setData({
        value_JJ_Name: JJ_Name
      })
    }

    if (JJ_PhoNum) {
      // console.log('保存的手机号码 是有的');
      this.setData({
        value_JJ_PhoNum: JJ_PhoNum
      })
    }


    // 多级选择器选定了 其他自定义 显示输入框

    if (JJ_Didian_0 == '其他') {
      this.setData({
        isZiDingYi: true,
        // value_JJ_Didian: input_JJ_Didian,
      })
    }
    if (input_JJ_Didian) {
      // console.log('自定义地址 是有的');
      this.setData({
        value_JJ_Didian: input_JJ_Didian
      })
    }

    this.setData({
      dialogShow: false
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