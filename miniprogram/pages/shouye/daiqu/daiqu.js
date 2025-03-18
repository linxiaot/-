// pages/shouye/daiqu/daiqu.js
var utils_time = require('../../../utils/time.js') //获取时间等
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
var utils_dingdanhao = require('../../../utils/dingdanhao.js') //获取订单号
const _ = wx.cloud.database().command
// var utils_mybaiduocr = require('../../../utils/mybaiduocr.js') // 选择图片百度文字识别

Page({
  data: {
    show_qh_Ma_chongfu: false,
    show_qh_Ma_chongfu_more: false,
    qh_Ma_chongfu_info:{},


    xiadan: [],
    isAdmin_xiadan: false,

    heji_money: 2,
    // 蜂蜜抵扣
    // fengmi_sum: 0,
    isFengmi_dikou: false,
    isWeixinfu: true,
    fengmi_sum: 0,
    balance: 0,
    yizhifu_fengmi: 0,
    balance_jilu: '',

    // 积分抵扣
    isDikou: false,
    isUse_jifendk: '',
    val_dikoujifen: '',
    val_zuiduo_dikou: '',
    val_zuiduo_dikou_isDikou: 0,
    val_mankeyong: 0,
    jifen_sum: 0,
    dikou_money: 0,
    jiage: 999,
    jifen_shiji_dikou: 0,
    youhui_info: '',

    kd_Dian: "--请选择--",
    // trueName: "",
    kd_Name: "",
    kd_PhoNum: "",
    qh_Ma: "",
    sd_Didian: "--请选择--",
    input_sd_Didian: '',
    dd_Status: '1', //订单状态 起始为0   /变更先下单后回调是否付款 已付款为 0 ，因为之前用户的订单都为0
    // is_Quxiao:false, //订单是否被用户取消，实现条件 
    //dialog
    dialogShow: false,
    dialogShowMore: false,
    showOneButtonDialog: false,
    buttons: [{
      text: '提交订单'
    }],
    buttonsHebing: [{
      text: '提交合并订单'
    }],
    buttons_isEdit: [{
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

    value_trueName: '',
    showClearBtn_trueName: false,
    isWaring_trueName: false,

    value_kd_Name: '',
    showClearBtn_kd_Name: false,
    isWaring_kd_Name: false,

    value_qh_Ma: '',
    showClearBtn_qh_Ma: false,
    isWaring_qh_Ma: false,

    value_qh_Ma2: '',
    showClearBtn_qh_Ma2: false,
    isWaring_qh_Ma2: false,
    isTiqu2: false,

    showAndroidDialog2: false,
    kd_Dian2: "--请选择--",

    value_sd_Didian: '',
    showClearBtn_sd_Didian: false,
    isWaring_sd_Didian: false,
    // 弹出式菜单 选择快递点名称
    showAndroidDialog: false,
    // 快递公司名称
    kdDianList: [{
      name: '东门菜鸟驿站'

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
      name: '琴湖菜鸟驿站'
    },
    ],

    // 送达地点 弹出式选择器
    sdSusheList: [],
    sdLoudongList_all: [],

    sd_Didian_sdSushe: '--请选择--',
    sd_Didian_sdLoudong: '--请选择--',

    sdLoudongList1: [{
      name: '1-栋'
    }, {
      name: '2-栋'
    }, {
      name: '3-栋'
    }, {
      name: '4-栋'
    }, {
      name: '5-栋'
    }],
    sdLoudongList2: [],
    sdSusheList1: [],
    sdSusheList2: [],


    // 用户下单完成 是否展示下单页面
    isXiadan: false,

    //送达地点选择
    //多级选择器  二级选择器
    multiArray: [],
    ptSongdadd: '-宿舍区-',
    ptSongdadd2: '-栋数-',
    ptpickerIndex: 0,
    // louDongArr: ['1-栋', '2-栋', '3-栋', '4-栋', '5-栋'],
    sdDidianArr: ['西湖公寓', '琴湖公寓', '金翰林公寓', '南苑宿舍', '北苑宿舍', '兴湘宿舍', '北青&中兴', '湘大南门', '一教区', '二教区', '三教区', '环保&法学', '化学化工', '其他'],
    // sdLoudongArr: [],
    wxhaoArr: [],
    jiageArr: [],
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
    isPaotuiOpen: false,
    hide: false,
    isAdmin: false,
    isBianji: false,
    shiXiang_1: '',
    shiXiang_2: '',
    shiXiang_3: '',
    isXzq_1: false,
    // 隐藏注意3项
    isHidden: false,
    isEdit: false,
    _id: '',
    isTongzhi: false,
    tongzhiHidden: false,
    isEditTongzhi: false,
    inputVal_tongzhi: '',
    text_tongzhi: '',
    disabledXiadan: false,
    xiadansuccess: '',
    isBanner: true,
    duanxin: [],
    beixuan_sd_Didian: [], //总表
    sd_Didian_openList: [], //已开启
    isSd_DidianGengduo: false,
    value_beizhu: '',

    dialogShow_isEdit: false,
    isShowMa: false,
    dingdanList: [],
    showAddqhm: false,
    duodingdanEdit: false,
    index: 0,
    imgNum: 0
  },

  dialogclose(e) {
    console.log('dialogclose', e);
    this.setData({
      dialogShow: false,
      dialogShowMore: false,
    })
    this.resetPay()
  },

  // 选择图片上传  最初的识别方案
  async chooseToUpload() {
    // 设置个人存10张取货码图片乱换调用，超过10覆盖
    var imgNum = wx.getStorageSync('imgNum')
    if (!imgNum) {
      imgNum = 0
    }
    // async goOcr() {
    console.log('chooseToUpload');
    // 本地图片
    var resImg = await wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed']
    })
    console.log('resImg', resImg);

    // 图片大小控制在 4M
    if (resImg.tempFiles[0].size / 1024 / 1024 > 4) {
      console.log(resImg.tempFiles[0].size / 1024 / 1024);
      return false
    }

    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePath = resImg.tempFiles[0].tempFilePath
    var openid = wx.getStorageSync('openid')
    // var cloudPath = 'quhuomaOcr/' + openid + 'SH' + (new Date()).getTime() + '.jpg'
    var cloudPath = 'quhuomaOcr/' + openid + 'NUM' + String(imgNum) + '.jpg'
    var res = await wx.cloud.uploadFile({ // 上传影音················
      cloudPath: cloudPath,
      filePath: tempFilePath, // 文件路径
    })

    imgNum += 1
    if (imgNum == 3) {
      imgNum = 0
    }
    wx.setStorageSync('imgNum', imgNum)
    console.log('res', res);
    // var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
    //   fileList: [{
    //     fileID: res.fileID
    //   }]
    // })

    // console.log('res2', res2);
    return res
  },

  // 操作指引
  goOcrGuide() {
    wx.navigateTo({
      url: '../daiqu/ocrguide/ocrguide',
    })
  },

  // 百度智能文字识别 通用文字识别标准版    
  goOcr() {
    console.log('百度ocr：：：：',);

    // // 是否关注公众号
    // var gzhOpenid = wx.getStorageSync('gzhOpenid')
    // if (!gzhOpenid) {
    //   wx.showToast({
    //     title: '请先关注公众号',
    //     icon: "none"
    //   })
    //   this.setData({
    //     isShowMa: true
    //   })
    //   return
    // }

    // 检查收件人信息是否填写完整 确定jiage
    if (!this.checkShoujianrenInfo()) {
      return
    }
    var s = new Date().getTime()

    // // 获取照片  ==================================== 上传图片 
    // var resImg = await this.chooseToUpload()
    // console.log('图片上传res', new Date().getTime() - s, resImg);
    // wx.showLoading({
    //   title: '识别中...',
    // })
    // if (!resImg) {
    //   wx.showToast({
    //     title: '图片应小于4M',
    //     icon: "none"
    //   })
    //   return
    // }

    // // ocrSDK识别后返回结果    // 网路图片 ===================== 识别
    // var url = resImg.fileID.replace('cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196', 'https://786d-xmf-0g87mzf198205ada-1305629196.tcb.qcloud.la')
    // var res = await wx.cloud.callFunction({
    //   name: 'baiduocr',
    //   data: {
    //     action: 'quhuomaOcr',
    //     url,
    //   }
    // }).catch(err => {
    //   wx.showToast({
    //     title: '未识别到信息',
    //     icon: "none"
    //   })
    // })
    // console.log('百度智能识别res', new Date().getTime() - s, res, );

    // var res = utils_mybaiduocr.tobaiduocr()


    // var tempFilePath = await utils_mybaiduocr.chooseToUpload()

    var that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success(resImg) {
        // console.log('resImg', resImg);
        var tempFilePath = resImg.tempFiles[0].tempFilePath
        console.log('tempFilePath', tempFilePath);
        wx.showLoading({
          title: '识别中...',
        })
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: function (data) {
            var base64 = 'data:image/jpg;base64,' + data.data;
            // console.log(base64);
            // let Img_Url = encodeURIComponent(data.data)
            //   // console.log(Img_Url);

            // that.ocrNumNew(Img_Url)
            // // var res = utils_mybaiduocr.ocrNumAsync(base64)
            // var res = await utils_mybaiduocr.ocrNumNew(base64)

            wx.request({
              url: 'https://aip.baidubce.com/oauth/2.0/token', //获取access_token
              data: {
                // grant_type： 必须参数， 固定为client_credentials；
                // client_id： 必须参数， 应用的API Key；
                // client_secret ： 必须参数， 应用的Secret Key；
                // grant_type: 'client_credentials',
                // client_id: 'ObsEGYHyBTy6yhDBfWuDRsb7',
                // client_secret: 'cR16c4BGzqPmZU0jo39EqEOyOT05ad70',
                grant_type: 'client_credentials',
                client_id: 'H282ConqqZGVhDIautnG1klS', //小蜜蜂
                client_secret: '6cxVPNoUG2zkoHzTDMbroSFN5PHGUOzE',
              },
              header: {
                'content-type': 'application/json' // 默认值
                // 'content-type': 'application/x-www-form-urlencoded' // 默认值
              },
              method: 'get',
              success(res) {
                // console.log('请求成功',res );
                console.log('access_token 请求成功,res.data.access_token为：', res.data.access_token);
                wx.request({
                  // url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/numbers', //数字识别
                  // url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic', //通用文字识别（高精度版）
                  url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic', //通用文字识别（高精度版）
                  data: {
                    access_token: res.data.access_token,
                    // url: that.data.url
                    // url: 'https://time-1guzwjn0765f3328-1305564548.tcloudbaseapp.com/%E5%8F%96%E8%B4%A7%E7%A0%81%E7%9F%AD%E4%BF%A1.png?sign=a75f48e5d7ebfc7cdd3b78c546db5a91&t=1619022456' 
                    //图片的路径
                    image: base64
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded' // 默认值
                  },
                  method: 'post',
                  success(resocr) {
                    // console.log('数字识别 请求成功:',res );
                    console.log('数字识别 请求成功:', resocr);
                    // return res


                    wx.hideLoading()
                    console.log('用时：', new Date().getTime() - s);
                    // 处理返回结果===========================  处理识别结果
                    console.log('mybaiduocr:', resocr);
                    var {
                      words_result,
                      words_result_num
                    } = resocr.data
                    // } = res.result
                    // var words_result_num = 0
                    if (words_result_num == 0) {
                      wx.showToast({
                        title: '未识别到信息',
                        icon: "none"
                      })
                      return
                    }
                    // var len = that.data.dingdanList.length
                    // var dingdanList = that.jiexi(words_result)
                    // if (dingdanList.length == 1) {
                    //   that.setData({
                    //     kd_Dian: dingdanList[0].kd_Dian,
                    //     value_qh_Ma: dingdanList[0].value_qh_Ma,
                    //   })
                    // }


                    that.jiexi(words_result)


                  },
                  fail(error) {
                    console.log('数字识别 请求失败', error)
                    wx.hideLoading()
                    wx.showToast({
                      title: '识别失败!',
                      icon: "none"
                    })

                  }
                })
              },
              fail(error) {
                console.log('获取access_token 请求失败', error)
                wx.hideLoading()
                wx.showToast({
                  title: '无权限.',
                  icon: "none"
                })
                // return error
              }
            })


          },
          fail: function (err) {
            console.log(err);

            wx.hideLoading()
            console.log('用时：', new Date().getTime() - s);
          }
        })

      }
    })






  },


  // 根据ocr识别返回的json数据解析取货码 ==================
  jiexi(words_result) {
    // // 检查收件人信息是否填写完整 确定jiage
    // if (!this.checkShoujianrenInfo()) {
    //   return
    // }
    var {
      jiage,
      dingdanList,
      value_qh_Ma,
      kd_Dian
    } = this.data

    var len = dingdanList.length

    // 若当前dingdanList中没有数据，显示添加包裹订单时，把之前 单独 填写的数据加进去dingdanList===============
    if (dingdanList.length == 0 && this.checkKuaidiInfo()) {
      // if (dingdanList.length == 0) {
      console.log('第一个包裹信息完整，添加到列表首位');
      dingdanList.push({
        value_qh_Ma: value_qh_Ma,
        kd_Dian: kd_Dian,
        jiage
      })
    }
    // 申通快递，申通小程序

    // 展开返回的识别结果列表 =================================
    // var regex_kdd = /.*[快|速]递|.*菜鸟驿站.*/
    var regex_kdd2 = /.*菜鸟驿站.*/
    // var regex_kdd = /.*[快|速]递/
    var regex_kdd = /.*[快递|速递|小程序]/
    // var regex_qhm = /^\d{1,3}-\d+-\d+/
    // var regex_qhm = /^\d+-\d+-\d+/
    var regex_qhm = /^\d+货架\d+层\d+|^\d+-\d+-\d+/

    // // 是否含有“多多买菜代收点”
    // var regex_ddmc = / /

    // 存储识别的取货码，和快递点================
    var val_qhm = false
    var val_kdd = false
    var val_kdd2 = false
    var m2 = false

    if (!words_result) {
      words_result = []
    }
    words_result.forEach((element, i) => {
      var words = element.words // 识别出的文字
      var kdd2 = words.match(regex_kdd2) //  匹配快递点 菜鸟驿站
      var qhm = words.match(regex_qhm) // 匹配取货码

      if (!m2) { // 按先取货吗，在快递公司匹配
        var kdd = words.match(regex_kdd) //  匹配快递点
        // var qhm_new = words.match(regex_qhm) // 匹配取货码
        // console.log(words.match(regex_qhm))
        // console.log(words.match(regex_kdd))
        // console.log('m2:kdd',kdd)
        if (qhm) {
          // 如果识别到取货码，有 val_kdd 存储，则上一对匹配成功，给赋值为新的取货码
          val_qhm = qhm[0]
          // console.log('qhm:',qhm);
        }

        // 一直有取货码，直到快递公司出现,快递公司则相反
        if (kdd && val_qhm) {
          val_kdd = kdd[0] // 快递公司一直false 匹配取货码之后赋值
          var item = {
            jiage,
            kd_Dian: val_kdd,
            value_qh_Ma: val_qhm,
          }
          dingdanList.push(item)
          val_qhm = false //,清空
        }
      }

      // 有菜鸟驿站  按先快递公司 后取货码=======================
      if (kdd2) {
        m2 = true
      }
      if (m2) {
        var qhm = words.match(regex_qhm) // 匹配取货码
        if (kdd2 && val_kdd2 !== kdd2) {
          val_kdd2 = kdd2[0]
        }
        if (qhm) {
          var item = {
            jiage,
            kd_Dian: val_kdd2,
            value_qh_Ma: qhm[0],
          }
          dingdanList.push(item)
        }
      }
    });
    console.log('dingdanList', dingdanList);

    //  快递公司名称匹配到对应的快递点  ===========
    var dingdanList_new = []
    dingdanList.forEach(element => {
      element.kd_Dian = this.pipeikdd(element.kd_Dian)
      // // 如果取货码有 货架 层 则替换成 -
      if (element.value_qh_Ma.indexOf('货架') != -1) {
        element.value_qh_Ma = element.value_qh_Ma.replace('货架', '-').replace('层', '-')
      }
      dingdanList_new.push(element)
    });
    console.log('jiexi:dingdanList_new', dingdanList_new);


    if (dingdanList_new.length == 1) {
      this.setData({
        kd_Dian: dingdanList_new[0].kd_Dian,
        value_qh_Ma: dingdanList_new[0].value_qh_Ma,
      })
    }

    this.setData({
      dingdanList: dingdanList_new
    })


    console.log('len:', len);
    if (dingdanList_new.length == len) {
      wx.showToast({
        title: '无包裹信息',
        icon: "none"
      })
    }


    // return dingdanList_new
  },

  // 根据初始设置的关键词匹配快递点
  pipeikdd(kd_Dian) {
    var {
      kdDianList
    } = this.data
    // // 如果快递点不在范围内，则 --请选择--

    var kd_Dian_new = '--请选择--'
    // var kd_Dian_new = kd_Dian
    kdDianList.forEach(element => {
      var kdlist = element.kdlist
      // 关键词列表
      kdlist.forEach(element_kd => {
        console.log('kd_Dian', kd_Dian, 'element_kd:', element_kd);
        if (kd_Dian.indexOf(element_kd) !== -1) {
          kd_Dian_new = element.name
        }
      });

    });

    return kd_Dian_new
  },


  // 检查包裹信息是否填写完整 第一个包裹
  checkKuaidiInfo() {
    console.log('checkKuaidiInfo');
    if (this.data.kd_Dian == '--请选择--') {
      console.log('[快递点名称] 没有选择');

      // wx.showToast({
      //   icon: 'error',
      //   title: '快递点未选',
      // })
      return false
    }
    // 判断取货码是否填写 ＞ 1位
    if (this.data.value_qh_Ma == undefined || this.data.value_qh_Ma == null || this.data.value_qh_Ma == '' || this.data.value_qh_Ma == ' ') {
      console.log('[取货码] 没有填');

      // wx.showToast({
      //   icon: 'error',
      //   title: '取货码不能少哦',
      // })
      return false
    }
    return true
  },


  // 检查收件人信息是否填写完整
  checkShoujianrenInfo() {


    // 快递姓名 是否填写
    if (this.data.value_kd_Name == undefined || this.data.value_kd_Name == null || this.data.value_kd_Name == '') {

      wx.showToast({
        icon: 'error',
        title: '快递姓名没有填',
      })
      return false
    }

    // 判断手机号码是否 ＞= 11位
    if (this.data.value_kd_PhoNum == null || this.data.value_kd_PhoNum == '') {
      console.log('手机号码没有填');
      wx.showToast({
        icon: 'error',
        title: '手机号码必填',
      })
      return false
    } else if (this.data.value_kd_PhoNum.length < 11) {
      this.setData({
        isWaring_kd_PhoNum: true,
      });
      wx.showToast({
        icon: 'error',
        title: '手机号码太少了',
      })
      return false
    }

    // 判断 送达地点 是否选择 ＞ '--请选择--'
    if (this.data.sd_Didian_sdSushe == '--请选择--') {
      console.log('[送达地点] 没有选择');
      wx.showToast({
        icon: 'error',
        title: '送达地点1未选',
      })
      return false
    }

    if (this.data.sd_Didian_sdLoudong == '--请选择--') {
      console.log('[送达地点] 没有选择');
      wx.showToast({
        icon: 'error',
        title: '送达地点2未选',
      })
      return false
    }

    // 宿舍区是 其他 是否填入自定义地址
    let sd_Didian_0 = this.data.sd_Didian_0
    if (sd_Didian_0 == '其他') {
      if (this.data.value_sd_Didian == '') {
        wx.showToast({
          icon: 'error',
          title: '填入自定义地址',
        })
        return false
      }
    }
    return true
  },




  // 多订单编辑========================
  showAddQuhuoma_edit(e) {
    console.log('showAddQuhuoma_edit');
    var {
      index
    } = e.currentTarget.dataset
    var {
      dingdanList,
    } = this.data
    var item = dingdanList[index]
    var kd_Dian2 = item.kd_Dian
    var value_qh_Ma2 = item.value_qh_Ma
    this.setData({
      showAddqhm: true,
      duodingdanEdit: true,
      kd_Dian2,
      value_qh_Ma2,
      index,
    })

  },
  // 多订单编辑 关闭弹窗 ========================
  closeAddQuhuoma_edit() {
    console.log('closeAddQuhuoma_edit');
    this.setData({
      showAddqhm: false,
      duodingdanEdit: false,
      kd_Dian2: '--请选择--',
      value_qh_Ma2: ''
    })

  },


  closeAddQuhuoma() {
    this.setData({
      showAddqhm: false,
    })
  },

  // 确定取货码 编辑
  quhuomaConfirm_edit(e) {
    console.log('quhuomaConfirm_edit');
    var {
      value_qh_Ma2,
      kd_Dian2,
      jiage,
      dingdanList,
      index
    } = this.data

    if (kd_Dian2 == '--请选择--') {
      console.log('[快递点名称] 没有选择');

      wx.showToast({
        icon: 'error',
        title: '快递点未选',
      })
      return
    }
    // 判断取货码是否填写 ＞ 1位
    if (value_qh_Ma2 == undefined || value_qh_Ma2 == null || value_qh_Ma2 == '' || value_qh_Ma2 == ' ') {
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
    dingdanList[index] = {
      value_qh_Ma: value_qh_Ma2,
      kd_Dian: kd_Dian2,
      jiage
    }

    this.setData({
      dingdanList,
      showAddqhm: false,
      kd_Dian2: '--请选择--',
      value_qh_Ma2: '',
      duodingdanEdit: false
    })
  },

  // // 多订单 测试===================
  // async ceshihedan() {
  //   var res = await wx.cloud.callFunction({
  //     // name: 'apaybacknew',
  //     // data: {
  //     //   action: '合单支付',
  //     //   outTradeNo:'F2023111684756170009567666117'
  //     // }
  //     name: 'apaytuikuan',
  //     data: {
  //       action: 'chaxundingdan',
  //       // dingdanhao:'F202311212613169889797311188'
  //       dingdanhao: 'F2023111811449170027668971459'
  //     }
  //   })
  //   console.log('chaxundingdan查询订单支付，查询支付情况', res);

  // },

  // 确定取货码添加到包裹信息列表  确定
  quhuomaConfirm(e) {
    console.log('quhuomaConfirm');
    var {
      value_qh_Ma2,
      kd_Dian2,
      jiage,
      dingdanList
    } = this.data

    if (kd_Dian2 == '--请选择--') {
      console.log('[快递点名称] 没有选择');

      wx.showToast({
        icon: 'error',
        title: '快递点未选',
      })
      return
    }
    // 判断取货码是否填写 ＞ 1位
    if (value_qh_Ma2 == undefined || value_qh_Ma2 == null || value_qh_Ma2 == '' || value_qh_Ma2 == ' ') {
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

    // 确定价格
    // 检查收件人信息是否填写完整 确定jiage
    if (!this.checkShoujianrenInfo()) {
      return
    }

    dingdanList.push({
      value_qh_Ma: value_qh_Ma2,
      kd_Dian: kd_Dian2,
      jiage
    })
    if (dingdanList.length == 1) { // 若只有一个包裹，则按原来显示
      this.setData({
        value_qh_Ma: dingdanList[0].value_qh_Ma,
        kd_Dian: dingdanList[0].kd_Dian
      })
    }
    this.setData({
      dingdanList,
      showAddqhm: false,
      value_qh_Ma2: '',
      kd_Dian2: '--请选择--'
    })
  },

  // 现实 包裹信息 进行填写
  showAddQuhuoma() {
    console.log('showAddQuhuoma');
    var {
      showAddqhm,
      kd_Dian,
      value_qh_Ma,
      dingdanList,
      jiage,
    } = this.data

    // // 是否关注公众号
    // var gzhOpenid = wx.getStorageSync('gzhOpenid')
    // if (!gzhOpenid) {
    //   wx.showToast({
    //     title: '请先关注公众号',
    //     icon: "none"
    //   })
    //   this.setData({
    //     isShowMa: true
    //   })
    //   return
    // }


    // 若当前dingdanList中没有数据，显示添加包裹订单时，把之前填写的数据加进去dingdanList
    if (dingdanList.length == 0) {
      if (kd_Dian == '--请选择--') {
        wx.showToast({
          title: '快递点未选',
          icon: "none"
        })
        return
      }
      if (value_qh_Ma == '') {
        wx.showToast({
          title: '取货码未填',
          icon: "none"
        })
        return
      }


      dingdanList.push({
        value_qh_Ma: value_qh_Ma,
        kd_Dian: kd_Dian,
        jiage
      })
      this.setData({
        dingdanList,
        showAddqhm: !showAddqhm
      })

      // 有数据，则直接显示 包裹添加弹窗
    } else {

      this.setData({
        showAddqhm: !showAddqhm
      })

    }
  },


  // 删除一个包裹信息
  removeQhm(e) {
    var {
      index
    } = e.currentTarget.dataset
    console.log('removeQhm', index);
    var {
      dingdanList
    } = this.data
    dingdanList.splice(index, 1)
    // console.log('removeQhm', dingdanList);
    // 若只剩一个数据，把它变为原来1个订单的数据
    if (dingdanList.length == 1) {
      console.log('removeQhm只剩1个');
      this.setData({
        value_qh_Ma: dingdanList[0].value_qh_Ma,
        kd_Dian: dingdanList[0].kd_Dian,
      })
      // dingdanList = []
    }
    this.setData({
      dingdanList
    })
  },

  // dingdanlist中是否有快递点位选择
  checkKuaidiDingdanlist(dingdanList) {
    var check = false
    dingdanList.forEach(element => {
      if (element.kd_Dian == '--请选择--') {
        check = true
      }
    });
    return check
  },
  // dingdanlist中是否有取货码重复
  checkQhmDingdanlist(dingdanList) {
    var dict = {}
    var check = false
    dingdanList.forEach(element => {
      if (dict[element.value_qh_Ma]) {
        // dict[element.value_qh_Ma] += 1
        check = true
      } else {
        dict[element.value_qh_Ma] = 1
      }
    });
    console.log(dict);
    return check
  },




  // 确认订单信息  多订单
  openConfirmDingdanMore: function (e) {
    // var heji_money = this.data.jiage
    console.log('openConfirmDingdanMore');
    var {
      jiage,
      dingdanList
    } = this.data

    // 多订单支付列表不为空
    if (dingdanList.length == 0) {
      wx.showToast({
        icon: 'error',
        title: '请先添加包裹',
      })
      return
    }


    if (dingdanList.length > 0) {
      if (this.checkKuaidiDingdanlist(dingdanList)) {
        console.log('[快递点名称] 没有选择');
        wx.showToast({
          title: '有快递点未选',
          icon: 'error',
        })
        return
      }
      if (this.checkQhmDingdanlist(dingdanList)) {
        console.log('取货码重复');
        wx.showToast({
          title: '取货码重复',
          icon: 'error',
        })
        return
      }
    }


    // 快递姓名 是否填写
    if (this.data.value_kd_Name == undefined || this.data.value_kd_Name == null || this.data.value_kd_Name == '') {
      this.setData({
        isWaring_kd_Name: true,
      });
      wx.showToast({
        icon: 'error',
        title: '快递姓名没有填',
      })
      return
    }

    // 判断手机号码是否 ＞= 11位
    if (this.data.value_kd_PhoNum == null || this.data.value_kd_PhoNum == '') {
      console.log('手机号码没有填');
      wx.showToast({
        icon: 'error',
        title: '手机号码必填',
      })
      return
    } else if (this.data.value_kd_PhoNum.length < 11) {
      this.setData({
        isWaring_kd_PhoNum: true,
      });
      wx.showToast({
        icon: 'error',
        title: '手机号码太少了',
      })
      return
    }

    // 判断 送达地点 是否选择 ＞ '--请选择--'
    if (this.data.sd_Didian_sdSushe == '--请选择--') {
      console.log('[送达地点] 没有选择');
      wx.showToast({
        icon: 'error',
        title: '送达地点1未选',
      })
      return
    }

    if (this.data.sd_Didian_sdLoudong == '--请选择--') {
      console.log('[送达地点] 没有选择');
      wx.showToast({
        icon: 'error',
        title: '送达地点2未选',
      })
      return
    }

    // 宿舍区是 其他 是否填入自定义地址
    let sd_Didian_0 = this.data.sd_Didian_0
    if (sd_Didian_0 == '其他') {
      if (this.data.value_sd_Didian == '') {
        wx.showToast({
          icon: 'error',
          title: '填入自定义地址',
        })
        return
      }
    }

    // 多订单 价格=单价*数量
    jiage = this.sswr(jiage * dingdanList.length, 2)
    this.setData({
      xiaoji_money: jiage
    })

    // 判断用户是否微信登陆
    if (this.data.login_ok) {
      if (this.data.isEdit) {
        this.setData({
          dialogShow_isEdit: true
        })
      } else {
        // 抵扣计算 积分 蜂蜜
        var jifen_sum = this.data.jifen_sum
        var fengmi_sum = this.data.fengmi_sum
        var isUse_jifendk = this.data.isUse_jifendk
        var val_mankeyong = this.data.val_mankeyong

        if (jifen_sum < val_mankeyong) { //满多少可用积分
          isUse_jifendk = false
          this.setData({
            isUse_jifendk,
          })
        }
        if (isUse_jifendk == true) { //后台 开启积分抵扣

          // 积分抵扣
          var val_dikoujifen = this.data.val_dikoujifen //多少分抵扣1元

          // var jiage = this.data.jiage //5元

          if (jifen_sum >= jiage * val_dikoujifen) {
            var dikou_money = -jiage
            var jifen_shiji_dikou = -jiage * val_dikoujifen
          } else if (jifen_sum < jiage * val_dikoujifen) {
            var dikou_money = -jifen_sum / val_dikoujifen
            var jifen_shiji_dikou = -jifen_sum
          }

          var youhui_info = '（积分抵扣' + dikou_money + '元）'
          if (!this.data.isDikou) { // 选择使用 积分抵扣
            var dikou_money = 0
            var youhui_info = ''
          }
          // 计算支付金额
          //case 1
          // var heji_money_100 = (jiage + dikou_money) * 100
          // heji_money = Math.ceil(heji_money_100)
          //case 2
          // var heji_money_100 = (jiage + dikou_money) * 100
          // var heji_money = Number((heji_money_100 / 100).toPrecision(3))

          //case 3
          var heji_money = Number(jiage + dikou_money)
          var heji_money = this.jingqueJiage(heji_money)
          console.log(heji_money, '::heji_money');
          this.setData({
            dikou_money,
            heji_money,
            jifen_shiji_dikou: this.sswr(jifen_shiji_dikou, 0),
            youhui_info,
          })

        } else { //后台 积分抵扣不开启
          // var heji_money = this.data.jiage
          var heji_money = jiage
          this.setData({
            heji_money,
            youhui_info: '',
          })
        }

        // 检查取货码是否重复，有则询问是否继续下单
        // var qh_Ma = this.data.value_qh_Ma
        var check_qh_Ma_res = this.check_qh_Ma_more(this.data.dingdanList)

        console.log('取货码是否有重复的订单：', check_qh_Ma_res);
        if (check_qh_Ma_res && !this.data.dialogShowMore) {

          this.setData({
            show_qh_Ma_chongfu_more: true,
            qh_Ma_chongfu_info: check_qh_Ma_res,
          })
          // var that = this
          // wx.showModal({
          //   title: '提示',
          //   // content: `${check_qh_Ma_res}您已有相同取货码的订单，是否继续下单？`,
          //   // content: `${check_qh_Ma_res.kd_Dian}:${check_qh_Ma_res.qh_Ma}\n您已有相同取货码的订单，是否继续下单？`,
          //   content: `${check_qh_Ma_res.xd_time}您已有“${check_qh_Ma_res.kd_Dian}:${check_qh_Ma_res.qh_Ma}”相同订单，是否继续下单？`,

          //   success: function (res) {
          //     if (res.confirm) {
          //       console.log('有重复取货码，用户点击继续下单')
          //       // 显示确认下单弹窗
          //       that.setData({
          //         dialogShowMore: true
          //       })

          //     } else if (res.cancel) {
          //       console.log('用户点击取消')
          //       return
          //     }
          //   }
          // })
        } else {
          // // 如果是用户点击下单 则重置，其它调用不重置
          // if (e) {
          //   var isclick = e.currentTarget.dataset.click
          //   console.log('isclickmore', isclick);
          //   if (isclick) {
          //     this.resetPay()
          //   }
          // }
          // 显示确认下单弹窗
          this.setData({
            dialogShowMore: true
          })



        }

        // this.setData({
        //   dialogShowMore: true
        // })


      }

      this.setData({
        // dialogShow: true,
        sd_Didian: this.data.sd_Didian_sdSushe + '：' + this.data.sd_Didian_sdLoudong
      })
    } else {
      utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
    }
  },

  // 支付方式重置为微信支付
  resetPay(){
    this.setData({
      isWeixinfu: true,
      isDikou: false,
      isFengmi_dikou: false,
    })
  },

  // 已有重复订单，取消下单
  qh_Ma_chongfu_cancel() {
    console.log('qh_Ma_chongfu_cancel');
    this.setData({
      show_qh_Ma_chongfu: false,
      show_qh_Ma_chongfu_more: false,
      qh_Ma_chongfu_info: {},
      // dialogShowMore: false,
      // dialogShow: false,
    })
  },

  // 已有重复订单 继续下单
  qh_Ma_chongfu(){
    console.log('qh_Ma_chongfu');
    this.qh_Ma_chongfu_cancel()

    // this.resetPay()

    this.setData({
      dialogShow: true,
    })

  },
 
  // 已有重复订单，继续下单 more
  qh_Ma_chongfu_more() {
    console.log('qh_Ma_chongfu_more');
    this.qh_Ma_chongfu_cancel()

    // this.resetPay()
    
    this.setData({
      dialogShowMore: true,
    })

  },

  // 检查是否有订单列表缓存，是否有相同取货码 有则返回 true
  check_qh_Ma_more: function (dingdanListNew) {
    var orderInfo_24h = wx.getStorageSync('orderInfo_24h')
    if (orderInfo_24h) {
      for (var i = 0; i < orderInfo_24h.length; i++) {
        var qh_Ma = orderInfo_24h[i].qh_Ma

        for (var j = 0; j < dingdanListNew.length; j++) {
          var qh_Ma2 = dingdanListNew[j].value_qh_Ma
          if (qh_Ma == qh_Ma2) {
            // return orderInfo_24h[i].xd_time
            return orderInfo_24h[i]
          }
        }

      }
    }
    return false
  },


  // 缓存订单信息 取货码 支付时间
  saveOrderInfo_more: function (dingdanList, xd_time) {
    var orderInfo_24h = wx.getStorageSync('orderInfo_24h')
    console.log('orderInfo_24h', orderInfo_24h);
    if (orderInfo_24h) {
      // 检查是否有超过24小时的订单，有则删除
      var orderInfo_24h_new = []
      for (var i = 0; i < orderInfo_24h.length; i++) {
        var xd_time_i = orderInfo_24h[i].xd_time
        var xd_time_i_new = new Date(xd_time_i).getTime()
        var xd_time_now = new Date(xd_time).getTime()
        // // 24小时内的订单保留
        // if (xd_time_now - xd_time_i_new < 86400000) { 
        // // 48小时内的订单保留
        if (xd_time_now - xd_time_i_new < 172800000) {
          orderInfo_24h_new.push(orderInfo_24h[i])
        }
      }
      orderInfo_24h = orderInfo_24h_new
    } else {
      orderInfo_24h = []
    }

    for (var i = 0; i < dingdanList.length; i++) {
      orderInfo_24h.push({
        kd_Dian: dingdanList[i].kd_Dian,
        qh_Ma: dingdanList[i].qh_Ma,
        xd_time: xd_time,
      })
    }
    wx.setStorageSync('orderInfo_24h', orderInfo_24h)
    console.log('duodingdan:缓存下单信息成功');
  },

  // 提交多订单  ==========================================================
  toTijiaoLastDingdanMore(e) {

    console.log('确认下单信息时用户点击了：', e.detail.item.text);
    var isXiaDan = e.detail.item.text //用户点击了什么 确定 or 取消

    var {
      dingdanList,
      dikou_money,
    } = this.data
    console.log(dingdanList);

    // //订单数据 需要上传的数据
    var sd_Didian = this.data.sd_Didian
    var sd_Didian_sdSushe = this.data.sd_Didian_sdSushe
    var sd_Didian_sdLoudong = this.data.sd_Didian_sdLoudong

    var beizhu = this.data.value_beizhu
    var kd_Dian = this.data.kd_Dian
    // var trueName = this.data.value_trueName
    var kd_Name = this.data.value_kd_Name
    var kd_PhoNum = this.data.value_kd_PhoNum
    // var qh_Ma = this.data.value_qh_Ma
    var qh_Ma = dingdanList[0].value_qh_Ma
    if (dingdanList.length > 1) {
      console.log('qh_Ma', qh_Ma);
      qh_Ma = qh_Ma.slice(0, 15) + '等'
    }
    // var dd_Status = this.data.dd_Status //直接添加订单状态
    var xd_time = utils_time.formatTime(new Date())
    var userinfo = wx.getStorageSync('userinfo')
    var openid = wx.getStorageSync('openid')
    var id = wx.getStorageSync('id')
    var gzhOpenid = wx.getStorageSync('gzhOpenid')
    var wxPaisong = this.data.wxPaisong

    var jiage = this.data.jiage
    var heji_money = this.data.heji_money
    var youhui_info = this.data.youhui_info
    var jifen_shiji_dikou = this.data.jifen_shiji_dikou

    var dingdanhao = utils_dingdanhao.dingdanhaoCreate(new Date()) //订单号

    // 蜂蜜和微信支付时出现金额异常，提醒用户重进程序
    if (heji_money >= 999 || heji_money !== this.sswr(jiage * dingdanList.length + dikou_money, 2)) {
      console.log(dikou_money, heji_money);
      wx.showToast({
        title: '金额有误需重进',
      })
      return
    }

    // 抵扣积分记录
    if (this.data.isDikou) {
      var yizhifu_jifen = -jifen_shiji_dikou
    } else {
      var yizhifu_jifen = 0
    }
    var jifen = {
      jifen_name: '代取快递',
      jifen_num: jifen_shiji_dikou,
      jifen_time: xd_time
    }



    let that = this
    if (this.data.isEdit) { // 编辑订单时
      wx.cloud.database().collection('daiqu').doc(this.data._id)
        .update({
          data: {
            kd_Dian,
            // trueName,
            kd_Name,
            kd_PhoNum,
            qh_Ma,
            sd_Didian,
            xd_time, //下单时间
            beizhu,

          }
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err)
        })

    } else if (!this.data.isEdit) { // 新增订单
      // console.log('');
      if (isXiaDan == '提交合并订单') {

        /*
        1.批量生成订单
        2.回传订单号
        3.上传支付系统生成预定单
        4.合并支付
        */



        console.log('提交合并订单')
        this.setData({ // 关闭提示框
          dialogShowMore: false,
        })
        var tmplIds = [
          'x7c0P8kcAQQBP5YKHMfHJsdDgnBjdG-f9jGE2aJCkAE', //下单成功通知
          'bypgXdjPrl2xb57P00ZZxYoY0d7LKQ4ymGGMkwjHAdk', //代取已送达通知
          'mRJHY7kPgaD5v4JH2DOs9YYUXSf7fFKOIBc7UXPdyiI', // 退款通知  新  
        ]
        wx.requestSubscribeMessage({
          // tmplIds: [templateId],
          tmplIds,
        })
          .then(res => {
            console.log('用户点击订阅下单成功消息：', res);
            if (heji_money > 0) { //*********** 积分不抵扣 或 部分抵扣 ***********
              // // 蜂蜜和微信支付时出现金额异常，提醒用户重进程序
              // if (heji_money >= 999||heji_money !== jiage*dingdanList.length+dikou_money) {
              //   console.log(dikou_money,heji_money);
              //   wx.showToast({
              //     title: '金额有误需重进',
              //   })
              //   return
              // }
              // 微信支付============================================================================================
              if (this.data.isWeixinfu) { // 微信支付------小程序代码
                // if (heji_money >= 999||heji_money !== jiage*dingdanList.length+dikou_money) {
                //   console.log(dikou_money,heji_money);
                //   wx.showToast({
                //     title: '金额有误需重进',
                //   })
                //   return
                // }
                wx.showLoading({
                  title: '生成订单'
                })

                // 各订单数据 微信支付 
                var dingdanListNew = []
                dingdanList.forEach((element, i) => {
                  dingdanListNew[i] = {
                    _openid: openid,
                    kd_Dian: element.kd_Dian,
                    kd_Name,
                    kd_PhoNum,
                    qh_Ma: element.value_qh_Ma,
                    sd_Didian,
                    dd_Status: '1', //直接添加订单状态  未支付
                    xd_time, //下单时间
                    nickName: userinfo.nickName,
                    beizhu,
                    dingdan_money: jiage,

                    yizhifu: heji_money,
                    yizhifu_fengmi: 0,
                    yizhifu_jifen,

                    dingdanhao: `${dingdanhao}D${i + 1}`, //订单号,
                    tuikuandanhao: '',
                    user_id: id,
                    gzhOpenid,
                    wxPaisong, // 新增字段 该派送区域客服微信
                  }
                });

                // 生成多订单
                wx.cloud.callFunction({
                  name: 'duodingdan',
                  data: {
                    dingdanList: dingdanListNew,
                    action: '微信支付'
                  }
                })
                  .then(res => {
                    console.log('duodingdan:微信支付', res);

                    wx.setStorageSync('kd_Name', kd_Name)
                    wx.setStorageSync('kd_PhoNum', kd_PhoNum)
                    wx.setStorageSync('sd_Didian_sdSushe', sd_Didian_sdSushe)
                    wx.setStorageSync('sd_Didian_sdLoudong', sd_Didian_sdLoudong)


                    // 微信支付*********************
                    var totalFee = heji_money * 100 // 支付金额,最小1，单位分
                    // var totalFee = 1 // 测试使用


                    wx.cloud.callFunction({
                      name: 'apayment',
                      data: {
                        goodName: '快递代取合并订单' + youhui_info,
                        totalFee,
                        dingdanhao, // 此处不含D
                        // action: 'xiadan_new'
                        action: 'xiadan_duodingdan'
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

                            that.setData({ //展示下单结果
                              isXiadan: true,
                              isToptips: false
                            })

                            if (yizhifu_jifen !== 0) {
                              // 记录抵扣积分
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
                            }

                            // 推送下单成功提醒
                            wx.cloud.callFunction({
                              name: 'tuisongxiadannew',
                              data: {
                                isDaiqu: true,
                                kd_Name: kd_Name,
                                qh_Ma: qh_Ma,
                                xd_time: xd_time,
                                openid: openid,
                                gzhOpenid: wx.getStorageSync('gzhOpenid')

                              }
                            })
                              .then(res => {
                                console.log('[代取下单] 提醒推送 成功', res)
                              })
                              .catch(err => {
                                console.log('[代取下单] 提醒推送 失败：', err)
                              })
                              
                              // 缓存订单信息 取货码 支付时间
                            this.saveOrderInfo_more(dingdanListNew, xd_time)


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
                    wx.showToast({
                      title: '下单失败',
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                  })

                // 蜂蜜支付============================================================================================
              } else if (this.data.isFengmi_dikou) {
                wx.showLoading({
                  title: '正在生成订单'
                })

                //记录 蜂蜜 消费
                var fengmi_shiji_dikou = -heji_money
                var balance_jilu = {
                  jilu_name: '代取快递',
                  jilu_num: fengmi_shiji_dikou,
                  jilu_time: xd_time
                }
                var balance = this.sswr(this.data.fengmi_sum + fengmi_shiji_dikou, 2)

                // 各订单数据
                var dingdanListNew = []
                dingdanList.forEach((element, i) => {
                  dingdanListNew[i] = {
                    _openid: openid,
                    kd_Dian: element.kd_Dian,
                    kd_Name,
                    kd_PhoNum,
                    qh_Ma: element.value_qh_Ma,
                    sd_Didian,
                    dd_Status: '0', //直接添加订单状态
                    xd_time, //下单时间
                    nickName: userinfo.nickName,
                    beizhu,
                    dingdan_money: jiage,
                    // dingdan_fengmi: -fengmi_shiji_dikou / dingdanList.length,
                    // dingdan_jifen:0,

                    yizhifu: 0,
                    // yizhifu_fengmi: -fengmi_shiji_dikou,
                    yizhifu_fengmi: this.sswr(-fengmi_shiji_dikou / dingdanList.length, 2),
                    yizhifu_jifen,

                    // dingdanhao: `${dingdanhao}D${i+1}`, //订单号,
                    dingdanhao: utils_dingdanhao.dingdanhaoCreate(new Date()),
                    tuikuandanhao: '',
                    user_id: id,
                    gzhOpenid,
                    wxPaisong, // 新增字段 该派送区域客服微信
                  }
                });

                // 云端生成多订单
                wx.cloud.callFunction({
                  name: 'duodingdan',
                  data: {
                    dingdanList: dingdanListNew,
                    action: '其他支付'
                  }
                })
                  .then(res => {
                    console.log('duodingdan:蜂蜜支付', res);

                    wx.hideLoading()
                    that.setData({
                      isXiadan: true,
                      isToptips: false
                    })

                    wx.setStorageSync('kd_Name', kd_Name)
                    wx.setStorageSync('kd_PhoNum', kd_PhoNum)
                    wx.setStorageSync('sd_Didian_sdSushe', sd_Didian_sdSushe)
                    wx.setStorageSync('sd_Didian_sdLoudong', sd_Didian_sdLoudong)


                    // 记录抵扣 蜂蜜
                    wx.cloud.database().collection('user').doc(id)
                      .update({
                        data: {
                          balance,
                          balance_jilu: _.addToSet(balance_jilu),
                        }
                      })
                      .then(res => {
                        console.log('[余额] 更新 成功几条：', res.stats.updated)

                        if (yizhifu_jifen !== 0) {
                          // 记录抵扣积分
                          this.jilujifen(id, jifen)
                        }

                      })
                      .catch(err => {
                        console.log('[余额] 更新 失败：', err)
                      })

                    // 推送下单成功提醒
                    this.tixing_xiadan(kd_Name, qh_Ma, xd_time, openid, gzhOpenid)

                    // 缓存订单信息 取货码 支付时间
                    this.saveOrderInfo_more(dingdanListNew, xd_time)

                  })
                  .catch(err => {
                    wx.showToast({
                      title: '下单失败',
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                  })
              }

              //积分全抵扣 ==================================================================================
            } else if (heji_money == 0) { //******* 积分全抵扣 金额为零 无需支付********
              if (jifen_shiji_dikou == 0) {
                wx.showToast({
                  icon: 'none',
                  title: '请重新提交',
                })
                return
              }
              wx.showLoading({
                title: '正在生成订单'
              })

              // 各订单数据
              var dingdanListNew = []
              dingdanList.forEach((element, i) => {
                dingdanListNew[i] = {
                  _openid: openid,
                  kd_Dian: element.kd_Dian,
                  kd_Name,
                  kd_PhoNum,
                  qh_Ma: element.value_qh_Ma,
                  sd_Didian,
                  dd_Status: '0', //直接添加订单状态
                  xd_time, //下单时间
                  nickName: userinfo.nickName,
                  beizhu,
                  dingdan_money: jiage,
                  // dingdan_jifen: -jifen_shiji_dikou / dingdanList.length,
                  // dingdan_fengmi:0,

                  yizhifu: 0,
                  yizhifu_fengmi: 0,
                  yizhifu_jifen: this.sswr(-jifen_shiji_dikou / dingdanList.length, 0),
                  // yizhifu_jifen: -jifen_shiji_dikou / dingdanList.length,

                  dingdanhao: utils_dingdanhao.dingdanhaoCreate(new Date()),

                  tuikuandanhao: '',
                  user_id: id,
                  gzhOpenid,
                  wxPaisong, // 新增字段 该派送区域客服微信
                }
              });

              wx.cloud.callFunction({
                name: 'duodingdan',
                data: {
                  dingdanList: dingdanListNew,
                  action: '其他支付'
                }
              })
                .then(res => {
                  console.log('duodingdan:', res);
                  wx.hideLoading()
                  // that.banner()
                  that.setData({
                    isXiadan: true,
                    isToptips: false
                  })

                  wx.setStorageSync('kd_Name', kd_Name)
                  // wx.setStorageSync('trueName', this.data.value_trueName)
                  wx.setStorageSync('kd_PhoNum', kd_PhoNum)
                  wx.setStorageSync('sd_Didian_sdSushe', sd_Didian_sdSushe)
                  wx.setStorageSync('sd_Didian_sdLoudong', sd_Didian_sdLoudong)
                  // wx.setStorageSync('wxPaisong', wxPaisong)
                  // wx.setStorageSync('jiage', jiage)

                  // 记录抵扣积分

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

                  // 推送下单成功提醒
                  wx.cloud.callFunction({
                    name: 'tuisongxiadannew',
                    data: {
                      isDaiqu: true,
                      kd_Name: kd_Name,
                      qh_Ma: qh_Ma,
                      xd_time: xd_time,
                      openid: openid,
                      gzhOpenid: wx.getStorageSync('gzhOpenid')
                    }
                  })
                    .then(res => {
                      console.log('[代取下单] 提醒推送 成功', res)
                    })
                    .catch(err => {
                      console.log('[代取下单] 提醒推送 失败：', err)
                    })

                    // 缓存订单信息 取货码 支付时间
                  this.saveOrderInfo_more(dingdanListNew, xd_time)



                })
                .catch(err => {
                  console.log('err:', err);
                  wx.showToast({
                    title: '下单失败',
                  })
                })
              // // var tuikuandanhao = '' //无需唤起支付 ，无退款单号
              // wx.cloud.database().collection('daiqu').add({
              //     data: {
              //       kd_Dian,
              //       // trueName,
              //       kd_Name,
              //       kd_PhoNum,
              //       qh_Ma,
              //       sd_Didian,
              //       dd_Status: '0', //直接添加订单状态
              //       xd_time, //下单时间
              //       nickName: userinfo.nickName,
              //       beizhu,
              //       dingdan_money: jiage,
              //       yizhifu: 0,
              //       yizhifu_fengmi: 0,
              //       yizhifu_jifen: -jifen_shiji_dikou,
              //       dingdanhao,
              //       tuikuandanhao: '',
              //       user_id: wx.getStorageSync('id'),

              //       gzhOpenid: wx.getStorageSync('gzhOpenid'),
              //       wxPaisong, // 新增字段 该派送区域客服微信
              //     },
              //   })
              //   .then(res => {
              //     console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              //     wx.hideLoading()
              //     // that.banner()
              //     that.setData({
              //       isXiadan: true,
              //       isToptips: false
              //     })

              //     wx.setStorageSync('kd_Name', kd_Name)
              //     // wx.setStorageSync('trueName', this.data.value_trueName)
              //     wx.setStorageSync('kd_PhoNum', kd_PhoNum)
              //     wx.setStorageSync('sd_Didian_sdSushe', sd_Didian_sdSushe)
              //     wx.setStorageSync('sd_Didian_sdLoudong', sd_Didian_sdLoudong)
              //     // wx.setStorageSync('wxPaisong', wxPaisong)
              //     // wx.setStorageSync('jiage', jiage)

              //     // 记录抵扣积分

              //     wx.cloud.database().collection('user').doc(id)
              //       .update({
              //         data: {
              //           jifen: _.addToSet(jifen),
              //         }
              //       })
              //       .then(res => {
              //         console.log('[积分] 更新 成功几条：', res.stats.updated)
              //       })
              //       .catch(err => {
              //         console.log('[积分] 更新 失败：', err)
              //       })

              //     // 推送下单成功提醒
              //     wx.cloud.callFunction({
              //         name: 'tuisongxiadannew',
              //         data: {
              //           isDaiqu: true,
              //           kd_Name: kd_Name,
              //           qh_Ma: qh_Ma,
              //           xd_time: xd_time,
              //           openid: openid,
              //           gzhOpenid: wx.getStorageSync('gzhOpenid')
              //         }
              //       })
              //       .then(res => {
              //         console.log('[代取下单] 提醒推送 成功', res)
              //       })
              //       .catch(err => {
              //         console.log('[代取下单] 提醒推送 失败：', err)
              //       })
              //   })
              //   .catch(err => {
              //     wx.showToast({
              //       title: '下单失败',
              //     })
              //     console.error('[数据库] [新增记录] 失败：', err)
              //   })

            }
          })
      }
    }
  },

  tixing_xiadan(kd_Name, qh_Ma, xd_time, openid, gzhOpenid) {
    // 推送下单成功提醒
    wx.cloud.callFunction({
      name: 'tuisongxiadannew',
      data: {
        isDaiqu: true,
        kd_Name: kd_Name,
        qh_Ma: qh_Ma,
        xd_time: xd_time,
        openid: openid,
        gzhOpenid: gzhOpenid

      }
    })
      .then(res => {
        console.log('[代取下单] 提醒推送 成功', res)
      })
      .catch(err => {
        console.log('[代取下单] 提醒推送 失败：', err)
      })
  },

  jilujifen(id, jifen) {
    // 记录抵扣积分
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

  // ----------------------------------------------------------
  ShowMa(e) {
    console.log('ShowMa:::', e);
    var {
      isShowMa
    } = this.data
    this.setData({
      isShowMa: !isShowMa
    })
    // this.onShow()
    wx.cloud.database().collection('user').doc(wx.getStorageSync('id'))
      .get()
      .then(res => {
        console.log('关闭公众号二维码后获取用户user：：', res.data);

        // 同步 gzhOpenid
        var gzhOpenid = res.data.gzhOpenid
        wx.setStorageSync('gzhOpenid', gzhOpenid)
        console.log('保存gzhOpenid成功：', gzhOpenid);

      })
      .catch(err => {
        console.log(err);
      })
  },
  toClose_tongzhi() {
    var that = this
    wx.showModal({
      content: this.data.xiadan.xiadanClose_text,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          if (that.data.isAdmin == true) {
            that.setData({
              isAdmin_xiadan: true
            })
          }

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  toChongzhi() {
    wx.navigateTo({
      url: '../../wode/money/money?isChongzhi=true',
    })
  },



  // 积分抵扣 开启  ======
  checkbox_Dikou() {
    var isDikou = !this.data.isDikou //是否选择积分抵扣
    console.log(isDikou, "checkbox_Dikou当前isDikou");
    var val_mankeyong = this.data.val_mankeyong //是否选择积分抵扣
    var {
      dingdanList
    } = this.data
    // if (this.data.jifen_sum > 0) {
    if (this.data.jifen_sum >= val_mankeyong) {
      this.setData({
        isDikou,
        // isFengmi_dikou:!isDikou,
        // isWeixinfu:!isDikou,
      })
      // if (dingdanList.length !== 0) {
      if (dingdanList.length > 1) {

        this.openConfirmDingdanMore()
      } else {
        this.openConfirm()

      }

      // 取消积分抵扣时 检查 蜂蜜支付是否可用 ```新加
      var fengmi_sum = this.data.fengmi_sum
      var jiage = this.data.jiage
      var heji_money = this.data.heji_money
      if (isDikou == false) {
        if (fengmi_sum < jiage) {
          this.setData({
            isFengmi_dikou: false,
            isWeixinfu: true,
          })
        } else {
          this.setData({
            isFengmi_dikou: true,
            isWeixinfu: false,
          })
        }
      }
      if (isDikou == true) { //未选积分抵扣， 点选积分全抵扣时 默认微信 蜂蜜不选
        if (heji_money == 0) {
          this.setData({ // 搭配checkbox_fengmi()
            isFengmi_dikou: false,
            isWeixinfu: false,
          })
        }
      }

    } else {
      wx.showToast({
        title: '积分<' + val_mankeyong,
        icon: 'error'
      })
    }


  },
  // 蜂蜜支付 开启   ···············新
  checkbox_fengmi() {
    console.log('checkbox_fengmi');
    var isFengmi_dikou = this.data.isFengmi_dikou
    var fengmi_sum = this.data.fengmi_sum
    var heji_money = this.data.heji_money
    var isWeixinfu = this.data.isWeixinfu

    if (fengmi_sum >= heji_money) {
      // 搭配 如果已选全抵扣，heji_money == 0 
      if (!isWeixinfu && !isFengmi_dikou) {
        // // this.openConfirm()
        // this.setData({
        //   isDikou:false,
        //   isWeixinfu: true
        // })
        this.checkbox_Dikou()
      } else {
        this.setData({
          isFengmi_dikou: !isFengmi_dikou,
          isWeixinfu: isFengmi_dikou,
        })

      }
    } else if (fengmi_sum < heji_money || fengmi_sum == 0) {
      wx.showToast({
        title: '蜂蜜不足请充值',
      })
    }



  },

  // // 蜂蜜支付 开启
  // checkbox_fengmi() {
  //   var isFengmi_dikou = this.data.isFengmi_dikou
  //   var fengmi_sum = this.data.fengmi_sum
  //   var heji_money = this.data.heji_money

  //   if (fengmi_sum >= heji_money) {
  //     this.setData({
  //       isFengmi_dikou: !isFengmi_dikou,
  //       isWeixinfu: isFengmi_dikou,
  //       // isDikou: false,
  //     })
  //   } else if (fengmi_sum < heji_money || fengmi_sum == 0) {
  //     wx.showToast({
  //       title: '蜂蜜不足请充值',
  //     })
  //   }

  // },


  // 送达地点开启
  checkboxChange_sd_Didian_open(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var sd_Didian_openList = e.detail.value
    var beixuan_sd_Didian = this.data.beixuan_sd_Didian
    beixuan_sd_Didian.forEach(element => {
      if (sd_Didian_openList.includes(element.sushe.name)) {
        element.checked = true
      } else {
        element.checked = false
      }
    });
    this.setData({
      // sd_Didian_openList,
      beixuan_sd_Didian,
    })

  },
  toSd_Didian_gengduo() {
    // console.log('点击设施 更多');
    if (this.data.isSd_DidianGengduo) {
      this.setData({
        isSd_DidianGengduo: false
      })
    } else {
      this.setData({
        isSd_DidianGengduo: true
      })
    }
  },

  toOpen_sd_Didian() {
    console.log('sd_Didian_openList::', this.data.sd_Didian_openList);
    var beixuan_sd_Didian = this.data.beixuan_sd_Didian //云端下载的 or 已修改


    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    console.log('管理员提交了 toOpen_sd_Didian', beixuan_sd_Didian);
    wx.cloud.callFunction({
      name: 'banner',
      data: {
        _id: 'toptipsdaiqu',
        // _id: 'ceshi111111',
        action: 'toOpen_sd_Didian',
        beixuan_sd_Didian: beixuan_sd_Didian,
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

  jingqueJiage(heji_money) {
    var heji_money_a = String(heji_money).slice(0, String(heji_money).indexOf('.'))
    var heji_money_len = heji_money_a.length + 2

    var heji_money_last = Number((heji_money).toPrecision(heji_money_len))
    return heji_money_last
  },





  // 是否 [弹出] 提示框  用户是否填好空 校验
  openConfirm: function (e) {
    // var heji_money = this.data.jiage
    console.log('openConfirm');

    if (this.data.kd_Dian == '--请选择--') {
      console.log('[快递点名称] 没有选择');

      wx.showToast({
        icon: 'error',
        title: '快递点未选',
      })
      return
    }
    // 判断取货码是否填写 ＞ 1位
    if (this.data.value_qh_Ma == undefined || this.data.value_qh_Ma == null || this.data.value_qh_Ma == '' || this.data.value_qh_Ma == ' ') {
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

    // 快递姓名 是否填写
    if (this.data.value_kd_Name == undefined || this.data.value_kd_Name == null || this.data.value_kd_Name == '') {
      this.setData({
        isWaring_kd_Name: true,
      });
      wx.showToast({
        icon: 'error',
        title: '快递姓名没有填',
      })
      return
    }

    // 判断手机号码是否 ＞= 11位
    if (this.data.value_kd_PhoNum == null || this.data.value_kd_PhoNum == '') {
      console.log('手机号码没有填');
      wx.showToast({
        icon: 'error',
        title: '手机号码必填',
      })
      return
    } else if (this.data.value_kd_PhoNum.length < 11) {
      this.setData({
        isWaring_kd_PhoNum: true,
      });
      wx.showToast({
        icon: 'error',
        title: '手机号码太少了',
      })
      return
    }

    // 判断 送达地点 是否选择 ＞ '--请选择--'
    if (this.data.sd_Didian_sdSushe == '--请选择--') {
      console.log('[送达地点] 没有选择');
      wx.showToast({
        icon: 'error',
        title: '送达地点1未选',
      })
      return
    }

    if (this.data.sd_Didian_sdLoudong == '--请选择--') {
      console.log('[送达地点] 没有选择');
      wx.showToast({
        icon: 'error',
        title: '送达地点2未选',
      })
      return
    }

    // 宿舍区是 其他 是否填入自定义地址
    let sd_Didian_0 = this.data.sd_Didian_0
    if (sd_Didian_0 == '其他') {
      if (this.data.value_sd_Didian == '') {
        wx.showToast({
          icon: 'error',
          title: '填入自定义地址',
        })
        return
      }
    }

    // 判断用户是否微信登陆
    if (this.data.login_ok) {
      if (this.data.isEdit) {
        this.setData({
          dialogShow_isEdit: true
        })
      } else {
        // 抵扣计算 积分 蜂蜜
        var jifen_sum = this.data.jifen_sum
        var fengmi_sum = this.data.fengmi_sum
        var isUse_jifendk = this.data.isUse_jifendk
        var val_mankeyong = this.data.val_mankeyong

        if (jifen_sum < val_mankeyong) { //满多少可用积分
          isUse_jifendk = false
          this.setData({
            isUse_jifendk,
          })
        }
        if (isUse_jifendk == true) { //后台 开启积分抵扣

          // 积分抵扣
          var val_dikoujifen = this.data.val_dikoujifen //多少分抵扣1元
          // var val_zuiduo_dikou_isDikou = this.data.val_zuiduo_dikou_isDikou //5元
          // var val_zuiduo_dikou = this.data.val_zuiduo_dikou //5元
          var jiage = this.data.jiage //5元
          // var jifen_sum = this.data.jifen_sum //2936分
          if (jifen_sum >= jiage * val_dikoujifen) {
            var dikou_money = -jiage
            var jifen_shiji_dikou = -jiage * val_dikoujifen
          } else if (jifen_sum < jiage * val_dikoujifen) {
            var dikou_money = -jifen_sum / val_dikoujifen
            var jifen_shiji_dikou = -jifen_sum
          }

          var youhui_info = '（积分抵扣' + dikou_money + '元）'
          if (!this.data.isDikou) { // 选择使用 积分抵扣
            var dikou_money = 0
            var youhui_info = ''
          }
          // 计算支付金额
          //case 1
          // var heji_money_100 = (jiage + dikou_money) * 100
          // heji_money = Math.ceil(heji_money_100)
          //case 2
          // var heji_money_100 = (jiage + dikou_money) * 100
          // var heji_money = Number((heji_money_100 / 100).toPrecision(3))

          //case 3
          var heji_money = Number(jiage + dikou_money)
          var heji_money = this.jingqueJiage(heji_money)
          console.log(heji_money, '::heji_money');
          // var xiaoji_money =
          this.setData({
            // xiaoji_money,
            dikou_money,
            heji_money,
            jifen_shiji_dikou: this.sswr(jifen_shiji_dikou, 0),
            youhui_info,
          })

        } else { //后台 积分抵扣不开启
          var heji_money = this.data.jiage
          this.setData({
            heji_money,
            youhui_info: '',
          })
        }

        // 检查取货码是否重复，有则询问是否继续下单
        var qh_Ma = this.data.value_qh_Ma
        var check_qh_Ma_res = this.check_qh_Ma(qh_Ma)

        console.log('取货码是否有重复的订单：', check_qh_Ma_res);
        if (check_qh_Ma_res && !this.data.dialogShow) {
          this.setData({
            show_qh_Ma_chongfu: true,
            qh_Ma_chongfu_info: check_qh_Ma_res,
          })
          // var that = this
          // wx.showModal({
          //   title: '提示',
          //   // content: `${check_qh_Ma_res}您已有相同取货码的订单，是否继续下单？`,
          //   content: `${check_qh_Ma_res.xd_time}您已有“${check_qh_Ma_res.kd_Dian}:${check_qh_Ma_res.qh_Ma}”相同订单，是否继续下单？`,
          //   success: function (res) {
          //     if (res.confirm) {
          //       console.log('有重复取货码，用户点击继续下单')
          //       // 显示确认下单弹窗
          //       that.setData({
          //         dialogShow: true
          //       })

          //     } else if (res.cancel) {
          //       console.log('用户点击取消')
          //       return
          //     }
          //   }
          // })
        } else {
          // // 如果是用户点击下单 则重置，其它调用不重置
          // if (e) {
          //   var isclick = e.currentTarget.dataset.click
          //   console.log('isclick', isclick);
          //   if (isclick) {
          //     this.resetPay()
          //   }
          // }
          // 显示确认下单弹窗
          this.setData({
            dialogShow: true,
          })

        }
      }

      this.setData({
        // dialogShow: true,
        sd_Didian: this.data.sd_Didian_sdSushe + '：' + this.data.sd_Didian_sdLoudong
      })
    } else {
      utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
    }
  },




  // 四舍五入
  sswr(num, w) {
    // return (Number(numStr)).toFixed(w)
    return Number(num.toFixed(w))
  },

  // 20241115 
  // 检查是否有订单列表缓存，是否有相同取货码 有则返回 true
  check_qh_Ma: function (qh_ma) {
    var orderInfo_24h = wx.getStorageSync('orderInfo_24h')
    if (orderInfo_24h) {
      for (var i = 0; i < orderInfo_24h.length; i++) {
        if (orderInfo_24h[i].qh_Ma == qh_ma) {
          // return true
          // return orderInfo_24h[i].xd_time
          return orderInfo_24h[i]
        }
      }
    }
    return false
  },



  // qh_Ma_chongfu: function () {
  //   console.log('qh_Ma_chongfu');
  //   this.setData({show_qh_Ma_chongfu:false})
  // },

  // cancel_qhmcf(){
  //   this.setData({show_qh_Ma_chongfu:false})
  // },


  // 缓存订单信息 取货码 支付时间
  saveOrderInfo: function (kd_Dian, qh_Ma, xd_time) {
    var orderInfo_24h = wx.getStorageSync('orderInfo_24h')
    console.log('orderInfo_24h', orderInfo_24h);
    if (orderInfo_24h) {
      // 检查是否有超过24小时的订单，有则删除
      var orderInfo_24h_new = []
      for (var i = 0; i < orderInfo_24h.length; i++) {
        var xd_time_i = orderInfo_24h[i].xd_time
        var xd_time_i_new = new Date(xd_time_i).getTime()
        var xd_time_now = new Date(xd_time).getTime()
        // if (xd_time_now - xd_time_i_new < 86400000) { // 24小时内的订单保留
        // // 48小时内的订单保留
        if (xd_time_now - xd_time_i_new < 172800000) {
          orderInfo_24h_new.push(orderInfo_24h[i])
        }
      }
      orderInfo_24h = orderInfo_24h_new
    }

    if (orderInfo_24h) {
      orderInfo_24h.push({
        kd_Dian: kd_Dian,
        qh_Ma: qh_Ma,
        xd_time: xd_time,
      }
      )
    } else {
      orderInfo_24h = [{
        kd_Dian: kd_Dian,
        qh_Ma: qh_Ma,
        xd_time: xd_time,
      }
      ]
    }
    wx.setStorageSync('orderInfo_24h', orderInfo_24h)
    console.log('缓存下单信息成功');
  },

  toTijiaoLast(e) { // 用户 提交成功 代取 下单成功   *** 新

    console.log('确认下单信息时用户点击了：', e.detail.item.text);
    var isXiaDan = e.detail.item.text //用户点击了什么 确定 or 取消

    // this.setData({ // 关闭提示框
    //   dialogShow: false,
    // })

    // var user_id = wx.getStorageSync('id')
    // //订单数据 需要上传的数据
    var sd_Didian = this.data.sd_Didian
    var sd_Didian_sdSushe = this.data.sd_Didian_sdSushe
    var sd_Didian_sdLoudong = this.data.sd_Didian_sdLoudong

    var beizhu = this.data.value_beizhu
    var kd_Dian = this.data.kd_Dian
    // var trueName = this.data.value_trueName
    var kd_Name = this.data.value_kd_Name
    var kd_PhoNum = this.data.value_kd_PhoNum
    var qh_Ma = this.data.value_qh_Ma
    // var dd_Status = this.data.dd_Status //直接添加订单状态
    var xd_time = utils_time.formatTime(new Date())
    var userinfo = wx.getStorageSync('userinfo')
    var openid = wx.getStorageSync('openid')
    var id = wx.getStorageSync('id')
    var wxPaisong = this.data.wxPaisong

    var jiage = this.data.jiage
    var heji_money = this.data.heji_money

    var youhui_info = this.data.youhui_info
    var jifen_shiji_dikou = this.data.jifen_shiji_dikou

    // var balance = this.data.balance
    // var yizhifu_fengmi = this.data.yizhifu_fengmi
    // var balance_jilu = this.data.balance_jilu

    // // 检查取货码是否重复，有则询问是否继续下单
    // check_qh_Ma_res = this.check_qh_Ma(qh_Ma)
    // if (check_qh_Ma_res) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '您已有相同取货码的订单，是否继续下单？',
    //     success: function (res) {
    //       if (res.confirm) {
    //         console.log('用户点击继续下单')
    //       } else if (res.cancel) {
    //         console.log('用户点击取消')
    //         return
    //       }
    //     }
    //   })
    // }


    // 蜂蜜和微信支付时出现金额异常，提醒用户重进程序
    if (heji_money >= 999) {
      wx.showToast({
        title: '金额有误，请重进',
      })
      return
    }

    // 抵扣积分记录
    if (this.data.isDikou) {
      var yizhifu_jifen = -jifen_shiji_dikou
    } else {
      // var jifen_shiji_dikou = 0
      var yizhifu_jifen = 0
    }
    var jifen = {
      jifen_name: '代取快递',
      jifen_num: jifen_shiji_dikou,
      jifen_time: xd_time
    }

    let that = this
    if (this.data.isEdit) { // 编辑订单时
      wx.cloud.database().collection('daiqu').doc(this.data._id)
        .update({
          data: {
            kd_Dian,
            // trueName,
            kd_Name,
            kd_PhoNum,
            qh_Ma,
            sd_Didian,
            xd_time, //下单时间
            beizhu,

          }
        })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err)
        })

    } else if (!this.data.isEdit) {

      if (isXiaDan == '提交订单') {
        console.log('提交订单')
        this.setData({ // 关闭提示框
          dialogShow: false,
        })
        // var templateId = 'x7c0P8kcAQQBP5YKHMfHJsdDgnBjdG-f9jGE2aJCkAE' //订单状态
        var tmplIds = [
          'x7c0P8kcAQQBP5YKHMfHJsdDgnBjdG-f9jGE2aJCkAE', //下单成功通知
          // 'vSKKPYBVtwLL3ZymuTI8gKDmltOKq56cNh0iHjaBC0E', //快递代取送达通知
          'bypgXdjPrl2xb57P00ZZxYoY0d7LKQ4ymGGMkwjHAdk', //代取已送达通知
          'm0LiKsNOZMH1b8QKUqAioeACYUp4G7yiCwIM-q1C6_Q', //订单退款通知
        ]
        wx.requestSubscribeMessage({
          // tmplIds: [templateId],
          tmplIds,
        })
          .then(res => {
            console.log('用户点击订阅下单成功消息：', res);

            var dingdanhao = utils_dingdanhao.dingdanhaoCreate(new Date()) //订单号
            if (heji_money > 0) { //*********** 积分不抵扣 或 部分抵扣 ***********

              if (this.data.isWeixinfu) { // 微信支付------小程序代码
                // if (heji_money >= 999) {
                //   wx.showToast({
                //     title: '金额有误，请重进',
                //   })
                //   return
                // }
                wx.showLoading({
                  title: '生成订单'
                })
                wx.cloud.database().collection('daiqu').add({
                  data: {
                    kd_Dian,
                    // trueName,
                    kd_Name,
                    kd_PhoNum,
                    qh_Ma,
                    sd_Didian,
                    dd_Status: '1', //直接添加订单状态
                    xd_time, //下单时间
                    nickName: userinfo.nickName,
                    beizhu,
                    dingdan_money: jiage,
                    yizhifu: heji_money,
                    yizhifu_fengmi: 0,
                    yizhifu_jifen,
                    dingdanhao,
                    tuikuandanhao: '',
                    gzhOpenid: wx.getStorageSync('gzhOpenid'),
                    user_id: wx.getStorageSync('id'),
                    wxPaisong, // 新增字段 该派送区域客服微信

                  },
                })
                  .then(res => {
                    // that.banner()

                    wx.setStorageSync('kd_Name', kd_Name)
                    // wx.setStorageSync('trueName', this.data.value_trueName)
                    wx.setStorageSync('kd_PhoNum', kd_PhoNum)
                    wx.setStorageSync('sd_Didian_sdSushe', sd_Didian_sdSushe)
                    wx.setStorageSync('sd_Didian_sdLoudong', sd_Didian_sdLoudong)
                    // wx.setStorageSync('wxPaisong', wxPaisong)
                    // wx.setStorageSync('jiage', jiage)
                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)



                    // 微信支付*********************
                    // var totalFee = 1 // 测试使用
                    var totalFee = heji_money * 100 // 支付金额,最小1，单位分



                    wx.cloud.callFunction({
                      name: 'apayment',
                      data: {
                        goodName: '快递代取' + youhui_info,
                        totalFee,
                        dingdanhao,
                        // action: 'xiadan_new'
                        action: 'xiadan'
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

                            that.setData({ //展示下单结果
                              isXiadan: true,
                              isToptips: false
                            })

                            if (yizhifu_jifen !== 0) {
                              // 记录抵扣积分
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
                            }

                            // 推送下单成功提醒
                            wx.cloud.callFunction({
                              name: 'tuisongxiadannew',
                              data: {
                                isDaiqu: true,
                                kd_Name: kd_Name,
                                qh_Ma: qh_Ma,
                                xd_time: xd_time,
                                openid: openid,
                                gzhOpenid: wx.getStorageSync('gzhOpenid')

                              }
                            })
                              .then(res => {
                                console.log('[代取下单] 提醒推送 成功', res)
                              })
                              .catch(err => {
                                console.log('[代取下单] 提醒推送 失败：', err)
                              })

                            // 缓存订单信息 取货码 支付时间
                            this.saveOrderInfo(kd_Dian, qh_Ma, xd_time)


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
                    wx.showToast({
                      title: '下单失败',
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                  })

              } else if (this.data.isFengmi_dikou) {

                wx.showLoading({
                  title: '正在生成订单'
                })
                //记录 蜂蜜 消费
                var fengmi_shiji_dikou = -heji_money
                var balance_jilu = {
                  jilu_name: '代取快递',
                  jilu_num: fengmi_shiji_dikou,
                  jilu_time: xd_time
                }
                var balance = this.data.fengmi_sum + fengmi_shiji_dikou
                wx.cloud.database().collection('daiqu').add({
                  data: {
                    kd_Dian,
                    // trueName,
                    kd_Name,
                    kd_PhoNum,
                    qh_Ma,
                    sd_Didian,
                    dd_Status: '0', //直接添加订单状态
                    xd_time, //下单时间
                    nickName: userinfo.nickName,
                    beizhu,
                    dingdan_money: jiage,
                    yizhifu: 0,
                    yizhifu_fengmi: -fengmi_shiji_dikou,
                    yizhifu_jifen,
                    dingdanhao,
                    tuikuandanhao: '',
                    user_id: wx.getStorageSync('id'),

                    gzhOpenid: wx.getStorageSync('gzhOpenid'),
                    wxPaisong, // 新增字段 该派送区域客服微信
                  },
                })
                  .then(res => {
                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                    wx.hideLoading()
                    // that.banner()
                    that.setData({
                      isXiadan: true,
                      isToptips: false
                    })

                    wx.setStorageSync('kd_Name', kd_Name)
                    // wx.setStorageSync('trueName', this.data.value_trueName)
                    wx.setStorageSync('kd_PhoNum', kd_PhoNum)
                    wx.setStorageSync('sd_Didian_sdSushe', sd_Didian_sdSushe)
                    wx.setStorageSync('sd_Didian_sdLoudong', sd_Didian_sdLoudong)
                    // wx.setStorageSync('wxPaisong', wxPaisong)
                    // wx.setStorageSync('jiage', jiage)

                    // 记录抵扣 蜂蜜
                    wx.cloud.database().collection('user').doc(id)
                      .update({
                        data: {
                          balance,
                          balance_jilu: _.addToSet(balance_jilu),
                        }
                      })
                      .then(res => {
                        console.log('[余额] 更新 成功几条：', res.stats.updated)

                        if (yizhifu_jifen !== 0) {
                          // 记录抵扣积分
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
                        }

                      })
                      .catch(err => {
                        console.log('[余额] 更新 失败：', err)
                      })

                    // 推送下单成功提醒
                    wx.cloud.callFunction({
                      name: 'tuisongxiadannew',
                      data: {
                        isDaiqu: true,
                        kd_Name: kd_Name,
                        qh_Ma: qh_Ma,
                        xd_time: xd_time,
                        openid: openid,
                        gzhOpenid: wx.getStorageSync('gzhOpenid')

                      }
                    })
                      .then(res => {
                        console.log('[代取下单] 提醒推送 成功', res)
                      })
                      .catch(err => {
                        console.log('[代取下单] 提醒推送 失败：', err)
                      })

                    // 缓存订单信息 取货码 支付时间
                    this.saveOrderInfo(kd_Dian, qh_Ma, xd_time)

                  })
                  .catch(err => {
                    wx.showToast({
                      title: '下单失败',
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                  })
              }
            } else if (heji_money == 0) { //******* 积分全抵扣 金额为零 无需支付********
              if (jifen_shiji_dikou == 0) {
                wx.showToast({
                  icon: 'none',
                  title: '请重新提交',
                })
                return
              }
              wx.showLoading({
                title: '正在生成订单'
              })

              // var tuikuandanhao = '' //无需唤起支付 ，无退款单号
              wx.cloud.database().collection('daiqu').add({
                data: {
                  kd_Dian,
                  // trueName,
                  kd_Name,
                  kd_PhoNum,
                  qh_Ma,
                  sd_Didian,
                  dd_Status: '0', //直接添加订单状态
                  xd_time, //下单时间
                  nickName: userinfo.nickName,
                  beizhu,
                  dingdan_money: jiage,
                  yizhifu: 0,
                  yizhifu_fengmi: 0,
                  yizhifu_jifen: -jifen_shiji_dikou,
                  dingdanhao,
                  tuikuandanhao: '',
                  user_id: wx.getStorageSync('id'),

                  gzhOpenid: wx.getStorageSync('gzhOpenid'),
                  wxPaisong, // 新增字段 该派送区域客服微信
                },
              })
                .then(res => {
                  console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                  wx.hideLoading()
                  // that.banner()
                  that.setData({
                    isXiadan: true,
                    isToptips: false
                  })

                  wx.setStorageSync('kd_Name', kd_Name)
                  // wx.setStorageSync('trueName', this.data.value_trueName)
                  wx.setStorageSync('kd_PhoNum', kd_PhoNum)
                  wx.setStorageSync('sd_Didian_sdSushe', sd_Didian_sdSushe)
                  wx.setStorageSync('sd_Didian_sdLoudong', sd_Didian_sdLoudong)
                  // wx.setStorageSync('wxPaisong', wxPaisong)
                  // wx.setStorageSync('jiage', jiage)

                  // 记录抵扣积分

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

                  // 推送下单成功提醒
                  wx.cloud.callFunction({
                    name: 'tuisongxiadannew',
                    data: {
                      isDaiqu: true,
                      kd_Name: kd_Name,
                      qh_Ma: qh_Ma,
                      xd_time: xd_time,
                      openid: openid,
                      gzhOpenid: wx.getStorageSync('gzhOpenid')
                    }
                  })
                    .then(res => {
                      console.log('[代取下单] 提醒推送 成功', res)
                    })
                    .catch(err => {
                      console.log('[代取下单] 提醒推送 失败：', err)
                    })

                  // 缓存订单信息 取货码 支付时间
                  this.saveOrderInfo(kd_Dian, qh_Ma, xd_time)

                })
                .catch(err => {
                  wx.showToast({
                    title: '下单失败',
                  })
                  console.error('[数据库] [新增记录] 失败：', err)
                })

            }
          })
      }
    }
  },




  // 用户编辑````````````````````
  //返回页面传参

  returnPre: function () {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isEdit: true,
    })
    wx.navigateBack({
      delta: 1,
    })
  },

  // 编辑
  toTijiaoEdit(e) {
    console.log('确认下单信息时用户点击了：', e.detail.item.text);
    var isXiaDan = e.detail.item.text //用户点击了什么 确定 or 取消
    // 关闭提示框

    this.setData({
      dialogShow_isEdit: false
    })

    // 需要上传的数据
    // //订单数据
    var sd_Didian = this.data.sd_Didian
    var kd_Dian = this.data.kd_Dian
    var kd_Name = this.data.value_kd_Name
    var kd_PhoNum = this.data.value_kd_PhoNum
    var qh_Ma = this.data.value_qh_Ma
    var beizhu = this.data.value_beizhu
    var wxPaisong = this.data.wxPaisong

    var xd_time = utils_time.formatTime(new Date())
    let that = this
    if (isXiaDan == '确定') {
      // console.log('用户点击确定')
      console.log('上传qh_Ma', qh_Ma);
      wx.cloud.database().collection('daiqu').doc(this.data._id).update({
        data: {
          kd_Dian,
          // trueName,
          kd_Name,
          kd_PhoNum,
          qh_Ma,
          sd_Didian,
          xd_time, //更新时间
          beizhu,
          wxPaisong
        },
      })
        .then(res => {
          console.log('[数据库] [更新] 成功: ', res)
          // that.banner()

          that.returnPre()
        })
        .catch(err => {
          wx.showToast({
            title: '编辑失败',
          })
          console.error('[数据库] [更新] 失败：', err)
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

    // 当前输入框显示条件为dingdanList长度为1，若清空value，则dingdanList也为空
    if (value == '') {
      this.setData({
        dingdanList: []
      })
    }
    this.setData({
      value_qh_Ma: value,
      showClearBtn_qh_Ma: !!value.length,
      // isWaring_qh_Ma: false,

    });
  },
  onClear_qh_Ma() {
    this.setData({
      value_qh_Ma: '',
      showClearBtn_qh_Ma: false,
      // isWaring_qh_Ma: false,
      isTiqu: true,
      // 当前输入框显示条件为dingdanList长度为1，若清空value，则dingdanList也为空
      dingdanList: []
    });
  },
  // 输入框状态  取货码2
  onInput_qh_Ma2(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_qh_Ma2: value,
      showClearBtn_qh_Ma2: !!value.length,
      // isWaring_qh_Ma2: false,

    });
  },
  onClear_qh_Ma2() {
    this.setData({
      value_qh_Ma2: '',
      showClearBtn_qh_Ma2: false,
      // isWaring_qh_Ma2: false,
      isTiqu2: true,
    });
  },

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
  // 输入框状态  备注
  onInput_beizhu(evt) {
    // console.log(evt);
    const {
      value //系统字段 value 不能改
    } = evt.detail;
    this.setData({
      value_beizhu: value,
      showClearBtn_beizhu: !!value.length,
      isWaring_beizhu: false,
    });
  },
  onClear_beizhu() {
    this.setData({
      value_beizhu: '',
      showClearBtn_beizhu: false,
      isWaring_beizhu: false,
    });
  },



  // 弹出式菜单  快递点名称 
  close: function () {
    this.setData({
      showAndroidDialog: false,
      isEditTongzhi: false,
      tongzhiHidden: true,
      showDuanXin: true,
    });
  },
  closebanner: function () {
    this.setData({
      isBanner: false,
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
    var {
      dingdanList
    } = this.data
    this.setData({
      showAndroidDialog: false,
      kd_Dian: e.currentTarget.dataset.name
    });

    // 若只有一个取货码，修改快递点时要同步至dingdanlist
    if (dingdanList.length == 1) {
      dingdanList[0].kd_Dian = e.currentTarget.dataset.name
    }
  },
  closeSheet() {
    this.setData({
      showAndroidDialog: false,
    });
  },

  // 添加包裹信息，多订单
  openAndroid2: function () {
    this.setData({
      showAndroidDialog2: true
    });
  },
  tanChuSheet2(e) {
    console.log('点击弹出式菜单,用户选择的快递点是：', e.currentTarget.dataset.name)
    // currentTarget.id
    this.setData({
      showAndroidDialog2: false,
      kd_Dian2: e.currentTarget.dataset.name
    });
  },
  // closeSheet2() {
  //   this.setData({
  //     showAndroidDialog2: false,
  //   });
  // },


  // 送达地点选择器  新---------------------------------------
  openAndroid_sdSushe: function () {
    this.setData({
      showAndroidDialog_sdSushe: true
    });
  },

  tosdSushe(e) {
    console.log('点击弹出式菜单,用户选择的 tosdSushe：', e.currentTarget.dataset.name)
    console.log('点击弹出式菜单,用户选择的 tosdSushe：', e.currentTarget.dataset.id)
    // currentTarget.id
    var sdLoudongList = this.data.sdLoudongList_all[e.currentTarget.dataset.id]
    var sdLoudongList1 = []
    var sdLoudongList2 = []
    var wxPaisong = this.data.wxhaoArr[e.currentTarget.dataset.id]
    var jiage = this.data.jiageArr[e.currentTarget.dataset.id]
    if (sdLoudongList.length > 9) {
      for (let index = 0; index < sdLoudongList.length; index++) {
        const element = sdLoudongList[index];
        if (index > 8) {
          sdLoudongList2.push(element)
        } else {
          sdLoudongList1.push(element)
        }
      }
    } else {
      sdLoudongList1 = sdLoudongList
    }
    this.setData({
      showAndroidDialog_sdSushe: false,
      sd_Didian_sdSushe: e.currentTarget.dataset.name,
      // sdLoudongList: this.data.sdLoudongList_all[e.currentTarget.dataset.id],
      sdLoudongList1,
      sdLoudongList2,
      sd_Didian_sdLoudong: '--请选择--',
      wxPaisong,
      jiage,
    });

    // jiage要更新到dingdanList
    var {
      dingdanList
    } = this.data
    if (dingdanList.length !== 0) {
      for (let index = 0; index < dingdanList.length; index++) {
        dingdanList[index].jiage = jiage
      }
      this.setData({
        dingdanList
      })
    }

  },

  openAndroid_sdLoudong: function () {
    this.setData({
      showAndroidDialog_sdLoudong: true
    });
  },

  tosdLoudong(e) {
    console.log('点击弹出式菜单,用户选择的快递点是：', e.currentTarget.dataset.name)
    // currentTarget.id
    this.setData({
      showAndroidDialog_sdLoudong: false,
      sd_Didian_sdLoudong: e.currentTarget.dataset.name
    });
  },


  // 下单成功显示页 继续下单
  toContinue() {
    wx.redirectTo({
      url: '../daiqu/daiqu',
    })
    // this.setData({
    //   isXiadan: false,
    //   isDikou: false,
    //   value_qh_Ma: '',
    //   kd_Dian: "--请选择--",
    // })
    // this.onShow()
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
    var isZhanTie = e.detail.item.text //用户点击了什么
    if (this.data.contentDuanXin !== '') {
      console.log('粘贴短信内容 用户点击了：', e.detail.item.text);
      // 关闭提示框
      this.setData({
        showDuanXin: false,
        focus: true, //取货码输入框开始聚焦
        // isTiqu: true,
      })
      if (isZhanTie == '提取') {
        this.tiQudx_new()
        this.setData({
          value_qh_Ma: this.data.contentDuanXin
        })
      }
    } else {
      console.log('粘贴短信内容 用户点击了，', e.detail.item.text, '但是没内容');
      this.setData({
        showDuanXin: false,
        focus: true, //取货码输入框开始聚焦
      })
      wx.showToast({
        icon: 'none',
        title: '剪贴板无内容',
      })
    }
  },

  // 是否粘贴剪贴板的内容
  tapDuanXin2(e) {
    var isZhanTie = e.detail.item.text //用户点击了什么
    if (this.data.contentDuanXin !== '') {
      console.log('粘贴短信内容 用户点击了：', e.detail.item.text);
      // 关闭提示框
      this.setData({
        showDuanXin2: false,
        focus: true, //取货码输入框开始聚焦
        // isTiqu: true,
      })
      if (isZhanTie == '提取') {
        this.tiQudx_new()
        this.setData({
          value_qh_Ma: this.data.contentDuanXin,
          showAddqhm: true
        })
      }
    } else {
      console.log('粘贴短信内容 用户点击了，', e.detail.item.text, '但是没内容');
      this.setData({
        showDuanXin2: false,
        focus: true, //取货码输入框开始聚焦
        showAddqhm: true
      })
      wx.showToast({
        icon: 'none',
        title: '剪贴板无内容',
      })
    }
  },


  //提取剪贴板上的 取货码

  tiQudx_new() {
    var duanxinYun = this.data.duanxin
    var contentDuanXin = this.data.contentDuanXin
    duanxinYun.forEach(element => {
      if (contentDuanXin.includes(element.keyword1) && contentDuanXin.includes(element.keyword2)) {
        var starNum = contentDuanXin.indexOf(element.starNum_word) + element.numjia
        var endNum = contentDuanXin.indexOf(element.endNum_word) - element.numjian
        // var starNum = element.starNum + 1
        // var endNum = element.endNum - 1
        var qh_Ma = contentDuanXin.slice(starNum, endNum)
        console.log('qh_Ma::', qh_Ma);
        if (qh_Ma.includes('取走您')) {
          var index1 = qh_Ma.indexOf('取')
          var index2 = qh_Ma.indexOf('您') + 1
          var qh_Ma = qh_Ma.slice(0, index1) + '-' + String(qh_Ma.slice(index2, qh_Ma.length))
        }
        console.log('这是 ' + element.kd_Dian + ' 的短信：', qh_Ma);
        this.setData({
          contentDuanXin: qh_Ma,
          kd_Dian: element.kd_Dian
        })
        console.log('自动匹配到快递点名称', element.kd_Dian);
      }
    });
  },


  tapTiQudx() {
    var value_qh_Ma = this.data.value_qh_Ma
    if (value_qh_Ma !== '' || value_qh_Ma !== undefined) {
      // console.log('value_qh_Ma',value_qh_Ma);

      this.setData({
        showDuanXin: true,
        contentDuanXin: this.data.value_qh_Ma,
      })
    } else {
      // 取货码 input 为空
      console.log('取货码 input 为空');
    }
  },
  tapTiQudx2() {
    var value_qh_Ma2 = this.data.value_qh_Ma2
    if (value_qh_Ma2 !== '' || value_qh_Ma2 !== undefined) {
      // console.log('value_qh_Ma',value_qh_Ma);

      this.setData({
        showDuanXin2: true,
        contentDuanXin: this.data.value_qh_Ma2,
        showAddqhm: false,

      })
    } else {
      // 取货码 input 为空
      console.log('取货码 input 为空');
    }
  },
  outInput_qh_Ma() {
    this.setData({
      // isTiqu: false
      contentDuanXin: this.data.value_qh_Ma
    })
    // var value_qh_Ma = this.data.value_qh_Ma
    if (this.data.contentDuanXin !== '' || this.data.contentDuanXin !== undefined) {
      // console.log('value_qh_Ma',value_qh_Ma);
      this.tiQudx_new()
      this.setData({
        value_qh_Ma: this.data.contentDuanXin
      })
    } else {
      // 取货码 input 为空
      console.log('取货码 input 为空');
    }
  },
  outInput_qh_Ma2() {
    this.setData({
      // isTiqu: false
      contentDuanXin: this.data.value_qh_Ma2
    })
    // var value_qh_Ma = this.data.value_qh_Ma
    if (this.data.contentDuanXin !== '' || this.data.contentDuanXin !== undefined) {
      // console.log('value_qh_Ma',value_qh_Ma);
      this.tiQudx_new()
      this.setData({
        value_qh_Ma2: this.data.contentDuanXin
      })
    } else {
      // 取货码 input 为空
      console.log('取货码 input 为空');
    }
  },

  tapInput_qh_Ma() {
    this.setData({
      isTiqu: true
    })
  },
  tapInput_qh_Ma2() {
    this.setData({
      isTiqu2: true
    })
  },

  toBianji(e) {
    console.log('管理员点击了编辑按钮', e.detail.value);
    this.setData({
      isBianji: e.detail.value
    })
  },

  toClose_xiadan(e) {
    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    var xiadan = this.data.xiadan
    xiadan.isXiadan_close = e.detail.value
    let that = this
    // console.log('管理员点击了 是否显示 Toptips', e.detail.value);
    wx.cloud.callFunction({
      name: 'banner',
      data: {
        _id: 'toptipsdaiqu',
        action: 'xiadanClose',
        xiadan,
      },
    })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
        that.setData({
          xiadan,
          isAdmin_xiadan: false,
        })
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })
    wx.hideLoading()
  },
  toOpen_paotui(e) {
    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    let that = this
    // console.log('管理员点击了 是否显示 Toptips', e.detail.value);
    wx.cloud.callFunction({
      name: 'banner',
      data: {
        _id: 'toptipsdaiqu',
        action: 'paotuiOpen',
        isPaotuiOpen: e.detail.value
      },
    })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
        that.setData({
          isPaotuiOpen: e.detail.value
        })
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })
    wx.hideLoading()
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
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })
    wx.hideLoading()
  },
  toTongzhi(e) {
    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    let that = this
    var isTongzhi = e.detail.value
    if (isTongzhi) {
      this.setData({
        tongzhiHidden: false
      })
    }
    console.log('管理员点击了 是否显示 toTongzhi', isTongzhi);
    wx.cloud.callFunction({
      name: 'banner',
      data: {
        _id: 'toptipsdaiqu',
        action: 'toTongzhi',
        isTongzhi,
      },
    })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
        that.setData({
          isTongzhi,
        })
      })
      .catch(err => {
        console.log('[云函数] [banner] 更新 失败：', err)
      })
    setTimeout(() => {
      wx.hideLoading()
    }, 300);
  },

  inputToptips(e) {
    this.setData({
      text_toptips: e.detail.value
    })
  },

  toToptips_text() {
    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    let text_toptips = this.data.text_toptips
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
  inputTongzhi(e) {
    this.setData({
      inputVal_tongzhi: e.detail.value
    })
  },
  openEditTongzhi() {
    this.setData({
      tongzhiHidden: false,
      isEditTongzhi: true,
      inputVal_tongzhi: this.data.text_tongzhi
    })
  },
  toEditTongzhi() {
    wx.showLoading({
      title: '变更中',
      mask: true,
    })
    this.close()
    let inputVal_tongzhi = this.data.inputVal_tongzhi
    console.log('管理员提交了 text_toptips', inputVal_tongzhi);
    let that = this
    wx.cloud.callFunction({
      name: 'banner',
      data: {
        _id: 'toptipsdaiqu',
        action: 'tongzhi_text',
        text_tongzhi: inputVal_tongzhi,
      },
    })
      .then(res => {
        console.log('[云函数] [banner] 更新 成功几条：', res.result.stats.updated)
        that.setData({
          text_tongzhi: inputVal_tongzhi
        })
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


  banner() {
    // 在页面中定义插屏广告
    let interstitialAd = null

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-963664f2922fada3'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }

    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  jiage_confirm(sd_Didian_sdSushe, beixuan_sd_Didian) {
    beixuan_sd_Didian.forEach(element => {
      if (element.sushe == sd_Didian_sdSushe) {
        var jiage = element.jiage
        var wxhao = element.wxhao
        this.setData({
          jiage,
          wxhao
        })
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var isAdmin = wx.getStorageSync('isAdmin')
    var sd_Didian_sdSushe = wx.getStorageSync('sd_Didian_sdSushe')
    var sd_Didian_sdLoudong = wx.getStorageSync('sd_Didian_sdLoudong')
    if (isAdmin) {
      this.setData({
        isAdmin: isAdmin
      })
    }
    // 获取提醒 地点选择列表 等
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('获取提醒 地点选择列表 成功：', res.data);

        var sdSusheList1 = []
        var sdSusheList2 = []

        var beixuan_sd_Didian = res.data.beixuan_sd_Didian
        var sdSusheList = []
        var sdLoudongList_all = []
        var wxhaoArr = []
        var jiageArr = []
        beixuan_sd_Didian.forEach(element => {
          if (element.checked) {
            sdSusheList.push(element.sushe)
            sdLoudongList_all.push(element.loudong)
            wxhaoArr.push(element.wxhao)
            jiageArr.push(element.jiage)
          }
          if (element.sushe.name == sd_Didian_sdSushe) {
            var jiage = element.jiage
            var wxPaisong = element.wxhao
            console.log(jiage);
            this.setData({
              jiage,
              wxPaisong,
            })
          }
        });
        var sd_Didian_sdSushe_index = 0
        if (sdSusheList.length > 9) {
          for (let index = 0; index < sdSusheList.length; index++) {
            const element = sdSusheList[index];
            if (index > 8) {
              sdSusheList2.push(element)
              if (element.name == sd_Didian_sdSushe) {
                sd_Didian_sdSushe_index = index - 9
              }
            } else {
              sdSusheList1.push(element)
              if (element.name == sd_Didian_sdSushe) {
                sd_Didian_sdSushe_index = index
              }
            }
          }
        } else {
          sdSusheList1 = sdSusheList
          for (let index = 0; index < sdSusheList1.length; index++) {
            // console.log(element,'element');
            // console.log(sd_Didian_sdSushe,'sd_Didian_sdSushe');
            const element = sdSusheList1[index];
            if (element.name == sd_Didian_sdSushe) {
              sd_Didian_sdSushe_index = index
            }

          }
        }

        // 积分预处理
        var jifendikou_daiqu = res.data.jifendikou_daiqu

        var isUse_jifendk = jifendikou_daiqu.isUse_jifendk
        var val_dikoujifen = jifendikou_daiqu.val_dikoujifen
        var val_zuiduo_dikou = jifendikou_daiqu.val_zuiduo_dikou
        var val_mankeyong = jifendikou_daiqu.val_mankeyong

        var isTongzhi = res.data.isTongzhi
        if (isTongzhi == false) {
          var showDuanXin = true
        }

        this.setData({
          text_toptips: res.data.text,
          isToptips: res.data.isToptips,
          isPaotuiOpen: res.data.isPaotuiOpen,
          shiXiang_1: res.data.shiXiang_1,
          shiXiang_2: res.data.shiXiang_2,
          shiXiang_3: res.data.shiXiang_3,
          // wxhaoArr: res.data.wxhao,
          xiadan: res.data.xiadan,
          wxhaoArr,
          jiageArr,
          // wxPaisong,
          // jiage,
          sdSusheList,
          sdSusheList1,
          sdSusheList2,
          sdLoudongList_all,
          isTongzhi,
          text_tongzhi: res.data.text_tongzhi,
          disabledXiadan: res.data.disabledXiadan,
          xiadansuccess: res.data.xiadansuccess,
          isBanner: res.data.isBanner,
          duanxin: res.data.duanxin,
          beixuan_sd_Didian: res.data.beixuan_sd_Didian,
          kdDianList: res.data.kdDianList,
          isUse_jifendk,
          val_dikoujifen,
          val_zuiduo_dikou,
          val_mankeyong,
          // jiage: res.data.jiage,
          showDuanXin,
        })
        // 判断 缓存的送达地点 是否开启代取
        if (sd_Didian_sdSushe) {
          var panduanList = []
          sdSusheList.forEach(element => {
            panduanList.push(element.name)
          });
          if (!panduanList.includes(sd_Didian_sdSushe)) {
            console.log('此送达地点不存在');
            wx.removeStorageSync('sd_Didian_sdSushe')
            wx.removeStorageSync('sd_Didian_sdLoudong')
            this.setData({
              sd_Didian_sdSushe: '--请选择--',
              sd_Didian_sdLoudong: '--请选择--'
            })
          } else { // 送达地点存在开启列表中
            console.log(sd_Didian_sdSushe_index, '此送达地点存在开启列表中');
            // 设置上次选择的送达地点列表 楼栋列表
            var e_tosdSushe = {
              currentTarget: {
                dataset: {
                  id: sd_Didian_sdSushe_index,
                  name: sd_Didian_sdSushe
                }
              }
            }
            var e_tosdLoudong = {
              currentTarget: {
                dataset: {
                  // id: sd_Didian_sdSushe_index,
                  name: sd_Didian_sdLoudong
                }
              }
            }
            this.tosdSushe(e_tosdSushe)
            this.tosdLoudong(e_tosdLoudong)
          }
        }
      })
      .catch(err => {
        console.log('获取提醒 地点选择列表 失败', err);
      })

    if (options.isEdit) {
      var _id = options._id
      wx.cloud.database().collection('daiqu').doc(_id)
        .get()
        .then(res => {
          console.log('获取代取订单数据：：', res);
          var index = res.data.sd_Didian.indexOf('：')
          console.log(index);
          var sd_Didian_sdSushe = res.data.sd_Didian.slice(0, index)
          console.log(sd_Didian_sdSushe);
          var sd_Didian_sdLoudong = res.data.sd_Didian.slice(index + 1, res.data.sd_Didian.length)
          console.log(sd_Didian_sdLoudong);
          this.setData({
            isEdit: options.isEdit,
            kd_Dian: res.data.kd_Dian,
            value_qh_Ma: res.data.qh_Ma,
            value_kd_Name: res.data.kd_Name,
            value_kd_PhoNum: res.data.kd_PhoNum,
            sd_Didian_sdSushe,
            sd_Didian_sdLoudong,
            value_beizhu: res.data.beizhu,

            _id,
          })
        })
    } else {
      // 是否显示 获取剪贴板 短信
      var that = this
      wx.getClipboardData({
        success(res) {
          console.log('onShow获取剪贴板的内容', res)
          var contentDuanXin = res.data
          if (!contentDuanXin == '') {
            that.setData({
              contentDuanXin,
              dx_Weikong: '',
              showDuanXin: false,
            })
          } else {
            that.setData({
              dx_Weikong: '请复制取货码短信',
              showDuanXin: false,
            })
          }
        },
        fail(err) {
          console.log('onShow获取剪贴板的内容 失败', err);
        }
      })
    }


    if (!this.data.isEdit) {
      // 获取上次填写的快递姓名 和 手机号码
      var kd_Name = wx.getStorageSync('kd_Name')
      // var trueName = wx.getStorageSync('trueName')
      var kd_PhoNum = wx.getStorageSync('kd_PhoNum')
      var sd_Didian_sdSushe = wx.getStorageSync('sd_Didian_sdSushe')
      var sd_Didian_sdLoudong = wx.getStorageSync('sd_Didian_sdLoudong')
      // if (trueName) {
      //   this.setData({
      //     value_trueName: trueName
      //   })
      // }
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
      if (sd_Didian_sdSushe) {
        this.setData({
          sd_Didian_sdSushe: sd_Didian_sdSushe
        })
      }
      if (sd_Didian_sdLoudong) {
        this.setData({
          sd_Didian_sdLoudong: sd_Didian_sdLoudong
        })
      }
    }


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
      // 获取积分
      var id = wx.getStorageSync('id')
      if (id) {
        wx.cloud.database().collection('user').doc(id)
          .get()
          .then(res => {
            console.log('获取用户user：：', res.data);
            // 积分总额
            var jifen_list = res.data.jifen
            // if (typeof(jifen_list)=='object') {
            //   jifen_list = [jifen_list]
            // }
            var jifen_sum = jifen_list.reduce(function (accumulator, currentValue) {
              return accumulator + currentValue.jifen_num;
            }, 0)
            jifen_sum = this.sswr(jifen_sum, 2)
            console.log('积分总额：：', jifen_sum) // logs 6

            // 蜂蜜总额
            var balance_jilu = res.data.balance_jilu
            var fengmi_sum = balance_jilu.reduce(function (accumulator, currentValue) {
              return accumulator + currentValue.jilu_num;
            }, 0)
            fengmi_sum = this.jingqueJiage(fengmi_sum)
            console.log('fengmi_sum总额：：', fengmi_sum)

            // // 默认蜂蜜支付 2022-04-27
            // if (fengmi_sum >= this.data.jiage) {
            //   this.setData({
            //     isFengmi_dikou: true,
            //     isWeixinfu: false
            //   })
            // }

            this.setData({
              jifen_sum,
              fengmi_sum,
              heji_money: this.data.jiage
            })


            // 是否重登陆
            var hasRelogin = res.data.hasRelogin
            if (!hasRelogin) {
              this.onRemoveStorage()
            }

            // 同步 gzhOpenid
            var gzhOpenid = res.data.gzhOpenid
            wx.setStorageSync('gzhOpenid', gzhOpenid)
            console.log('保存gzhOpenid成功：', gzhOpenid);

            // 是否显示关注服务号二维码
            // var gzhOpenid = wx.getStorageSync('gzhOpenid')
            if (gzhOpenid) {
              this.setData({
                isShowMa: false
              })
            } else {
              this.setData({
                isShowMa: true
              })
            }


          })
          .catch(err => {
            console.log(err);
          })
      } else {
        wx.showToast({
          icon: 'none',
          title: '请重新登录',
        })
      }




    }


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
  onHide: function () {
    // console.log('页面隐藏了');
  },

  onUnload: function () {
    // console.log('页面 卸载 了');
  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }

})