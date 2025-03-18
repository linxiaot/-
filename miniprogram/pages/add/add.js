// pages/add/add.js
// var app = getApp() 
var utils_time = require('../../utils/time.js') //获取时间等
// var banner_daiqu = app.globalData.banner_daiqu

// // 时间选择器
// const date = new Date()
// const years = []
// const months = []
// const days = []
// const month = utils_time.formatMonth(new Date())
// const day = utils_time.formatDay(new Date())

// for (let i = 2020; i <= date.getFullYear(); i++) {
//   years.push(i)
// }

// for (let i = 1; i <= 12; i++) {
//   if (i < 10) {
//     i = '0' + i
//   }
//   months.push(i)
// }

// for (let i = 1; i <= 31; i++) {
//   if (i < 10) {
//     i = '0' + i
//   }
//   days.push(i)
// }
var audioCIAC = wx.createInnerAudioContext()


Page({

  data: {
    audio: {},
    audio_name: '',
    audio_path: '',
    // audio_src: '',
    isPlay: false,
    duration: '00:00',
    currentTime: '00:00',
    percent: 0,

    isImage: true,
    isVideo: false,
    isAudio: false,
    video_fileid: '',
    isMuted: true,
    autoplay: true,

    isHegeOpen: false,
    isHegeOpen_huangye: false,
    val_jifen: 0,
    addType: '',
    isXunren: '',
    isXunwu: '',
    files: [],
    imagesUrlList: [],
    fileIDs: [],
    inputNum: 0,
    deleteFileList: [],

    //选择时间
    isShowshijian: false,
    years:[],
    // year: date.getFullYear(),
    year: '',
    months:[],
    month:'',
    days:[],
    day:'',
    // value: [month - 1, day - 1],
    val: [],
    // value: [1, month - 1, day - 1, 0, 0],
    // isDaytime: true,
    daytimes: ['上午', '下午', '晚上'],
    daytime: '上午',
    times: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    time: 1,
    isDisabled: false,

    huxing: '-请选择-',
    sheshi: [],
    multiArray: [
      ['1室', '2室', '3室', '4室', '5室'],
      ['0厅', '1厅', '2厅', '3厅', '4厅', '5厅'],
      ['0卫', '1卫', '2卫', '3卫', '4卫', '5卫']
    ],
    sheshiList: [{
        id: 0,
        name: '冰箱',
        checked: false
      },
      {
        id: 1,
        name: '电视'
      },
      {
        id: 2,
        name: '洗衣机'
      },
      {
        id: 3,
        name: '热水器'
      },
      {
        id: 4,
        name: '空调'
      },
      {
        id: 5,
        name: '油烟机'
      },
      {
        id: 6,
        name: '燃气灶'
      },
      {
        id: 7,
        name: '宽带'
      },
      {
        id: 8,
        name: '沙发'
      },
      {
        id: 9,
        name: '床'
      },
      {
        id: 10,
        name: '衣柜'
      },
      {
        id: 11,
        name: '阳台'
      },
      {
        id: 12,
        name: '可做饭'
      }
    ],
    isSheshiGengduo: false,
    isEdit: false,
    leixingList: [{
      text: "日结兼职",
      checked: false
    }, {
      text: "短期兼职"
    }, {
      text: "全职"
    }],
    leixingSelected: null,

    leibieList: [{
      text: "美食",
      checked: false
    }, {
      text: "开锁/换锁/修锁"
    }, {
      text: "保洁清洗"
    }, {
      text: "鲜花绿植"
    }, {
      text: "管道疏通/清洗"
    }, {
      text: "生活配送"
    }, {
      text: "其他"
    }],
    leibieSelected: null,

    quyuList: [{
      text: "东坡村",
      checked: false
    }, {
      text: "北斗村"
    }, {
      text: "南阳村"
    }, {
      text: "教师公寓"
    }, {
      text: "东门"
    }, {
      text: "润玉桃李"
    }],
    quyuSelected: null,
    value_name: '',

    zfleixingList: [{
      text: "整租",
      checked: false
    }, {
      text: "合租"
    }],
    zfleixingSelected: null,
    zfleixing: '',
  },

  formatTime(time) {
    var minute = Math.floor(time / 60) % 60;
    var second = Math.floor(time) % 60
    return (minute < 10 ? '0' + minute : minute) + ':' +
      (second < 10 ? '0' + second : second)
  },

  audioPlay: function (e) {

    // audioCIAC.destroy()
    audioCIAC.src = this.data.audio_path
    audioCIAC.onPlay(res => {
      audioCIAC.onTimeUpdate(res => {
        // console.log(res);
        this.setData({
          duration: this.formatTime(audioCIAC.duration),
          currentTime: this.formatTime(audioCIAC.currentTime),
          percent: audioCIAC.currentTime / audioCIAC.duration * 100
        })
      })
    })
    setTimeout(() => {
      audioCIAC.play()
    }, 800);

    this.setData({
      isPlay: true,
    })
  },
  audioPause: function (e) {
    // audioCIAC.src = e.currentTarget.dataset.src
    audioCIAC.pause()
    this.setData({
      isPlay: false,
    })
  },

  toAddAudio() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      success: res => {
        console.log(res);
        var audio_name = res.tempFiles[0].name
        var audio_path = res.tempFiles[0].path
        that.setData({
          audio_name,
          audio_path,

        })
      }
    })
  },
  toDelAudio(e) {
    // console.log(e.detail.value);
    if (this.data.isEdit) {
      wx.showLoading({})
      var fileid = this.data.audio_path
      var fileList = []
      fileList.push(fileid)
      wx.cloud.deleteFile({
          fileList: fileList,
        })
        .then(res => {
          console.log(res);
          wx.hideLoading()
          this.setData({
            audio_path: '',
            audio_name: '',
          })
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      this.setData({
        audio_path: '',
        audio_name: '',
      })
    }
  },

  // 全屏
  bind_quanping(e) {
    console.log(e);
    if (e.detail.fullScreen) {
      this.setData({
        isMuted: false,

      })
    } else(
      this.setData({

        isMuted: true
      })
    )
  },
  upImage() {
    this.setData({
      isImage: true,
      isVideo: false,
      isAudio: false,
    })
  },
  upVideo() {
    this.setData({
      isImage: false,
      isVideo: true,
      isAudio: false,
    })
  },
  upAudio() {
    this.setData({
      isImage: false,
      isVideo: false,
      isAudio: true,
    })
  },
  toDelVideo(e) {
    // console.log(e.detail.value);
    wx.showLoading({})
    var video_fileid = this.data.video_fileid
    var fileList = []
    fileList.push(video_fileid)
    wx.cloud.deleteFile({
        fileList: fileList,
      })
      .then(res => {
        console.log(res);
        wx.hideLoading()
        this.setData({
          video_fileid: '',
        })
      })
      .catch(err => {
        console.log(err);
      })
  },
  // 编辑时 删除图片
  toDelImage(e) {
    // console.log(e.detail.value);
    var imagefileID = e.currentTarget.dataset.imagefileid
    var index = e.currentTarget.dataset.index
    var imagesUrlList = this.data.imagesUrlList
    var deleteFileList = this.data.deleteFileList
    imagesUrlList.splice(index, 1)
    deleteFileList.push(imagefileID)

    this.setData({
      imagesUrlList,
      deleteFileList,
    })
  },
  // 选择影音文件上传
  async toAddMedia(e) {
    console.log(e);
    var deleteFileList = []
    var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
    var openid = wx.getStorageSync('openid')
    var addType = this.data.addType
    // var imagesUrlList = this.data.imagesUrlList
    // var imagefileID = imagesUrlList[index].imagefileID
    var res = await wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
    })
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePath = res.tempFiles[0].tempFilePath
    console.log(res);
    console.log(tempFilePath);
    wx.showLoading({
      title: '上传中..',
    })

    var index_star = tempFilePath.lastIndexOf('.')
    var index_end = tempFilePath.length
    var last_name = tempFilePath.slice(index_star, index_end)
    if (!last_name) {
      var last_name = '.mp4'
    }
    var cloudPath = addType + '/video/' + openid + addType + iamgeUploadTime + '-1' + last_name

    var res1 = await wx.cloud.uploadFile({ // 上传影音················
      cloudPath: cloudPath,
      filePath: tempFilePath, // 文件路径
    })

    var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
      fileList: [{
        fileID: res1.fileID
      }]
    })

    // deleteFileList_check.push(res2.fileList[0].fileID) //备查 有问题则删除

    var video_fileid = res2.fileList[0].fileID

    this.setData({
      video_fileid,
    });
    wx.hideLoading({})

    // // console.log('imagefileID', imagefileID);
    // var deleteFileList = this.data.deleteFileList
    // deleteFileList.push(imagefileID)

    // // 图片安全检查结果：
    // var resImgCheck = await wx.cloud.callFunction({
    //   name: 'anquancheck',
    //   data: {
    //     action: 'imageCheck',
    //     deleteFileList: deleteFileList_check,
    //     // fileID: res2.fileList[0].fileID,
    //   },
    // })
    // console.log('图片安全检查结果：', resImgCheck);
    // wx.hideLoading({})

    // var hasRisky = false
    // resImgCheck.result.forEach(element => {
    //   if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
    //     hasRisky = true
    //   }
    // });

    // if (hasRisky !== true) {
    //   console.log('图片未识别到风险');
    //   this.setData({
    //     imagesUrlList,
    //     deleteFileList,
    //   });
    // } else {
    //   var resDel = await wx.cloud.deleteFile({
    //     fileList: deleteFileList,
    //   })
    //   wx.showToast({
    //     title: '图片含违规信息',
    //     duration: 1000,
    //     icon: 'error',
    //     mask: true,
    //   })
    //   this.setData({
    //     isDisabled: false,
    //   })
    //   return
    // }

  },

  async toAddImage(e) {
    var deleteFileList_check = []
    var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
    var index = e.currentTarget.dataset.index
    var openid = wx.getStorageSync('openid')
    var addType = this.data.addType
    var cloudPath = addType + '/' + openid + addType + iamgeUploadTime + '-' + index + '.png'
    var imagesUrlList = this.data.imagesUrlList
    var imagefileID = imagesUrlList[index].imagefileID
    var res = await wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    })
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePath = res.tempFilePaths[0]

    wx.showLoading({
      title: '上传中..',
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

    deleteFileList_check.push(res2.fileList[0].fileID) //备查 有问题则删除

    imagesUrlList[index] = {
      imagefileID: res2.fileList[0].fileID,
      imagetempFileURL: res2.fileList[0].tempFileURL
    }

    // console.log('imagefileID', imagefileID);
    var deleteFileList = this.data.deleteFileList
    deleteFileList.push(imagefileID)

    // 图片安全检查结果：
    var resImgCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'imageCheck',
        deleteFileList: deleteFileList_check,
        // fileID: res2.fileList[0].fileID,
      },
    })
    console.log('图片安全检查结果：', resImgCheck);
    wx.hideLoading({})

    var hasRisky = false
    resImgCheck.result.forEach(element => {
      if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
        hasRisky = true
      }
    });

    if (hasRisky !== true) {
      console.log('图片未识别到风险');
      this.setData({
        imagesUrlList,
        deleteFileList,
      });
    } else {
      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.showToast({
        title: '图片含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }

  },

  async toAddImage2(e) {
    var deleteFileList_check = []
    var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
    var imagesUrlList = this.data.imagesUrlList
    var index = imagesUrlList.length
    var openid = wx.getStorageSync('openid')
    var addType = this.data.addType
    var cloudPath = addType + '/' + openid + addType + iamgeUploadTime + '-' + index + '.png'
    var res = await wx.chooseImage({
      count: 1,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    })
    // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
    var tempFilePath = res.tempFilePaths[0]

    wx.showLoading({
      title: '上传中..',
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

    deleteFileList_check.push(res2.fileList[0].fileID) //备查 有问题则删除

    imagesUrlList[index] = {
      imagefileID: res2.fileList[0].fileID,
      imagetempFileURL: res2.fileList[0].tempFileURL
    }

    // 图片安全检查结果：
    var resImgCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'imageCheck',
        deleteFileList: deleteFileList_check,
        // fileID: res2.fileList[0].fileID,
      },
    })
    console.log('图片安全检查结果：', resImgCheck);

    wx.hideLoading({})

    var hasRisky = false
    resImgCheck.result.forEach(element => {
      if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
        hasRisky = true
      }
    });

    if (hasRisky !== true) {
      console.log('图片未识别到风险');
      this.setData({
        imagesUrlList,
      });
    } else {
      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.showToast({
        title: '图片含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }

  },

  // 租房类型选择
  zfleixingSelected: function (e) {
    var index = e.currentTarget.dataset.index;
    var zfleixing = this.data.zfleixingList[index]
    console.log('类型选择：：', index, zfleixing);
    var zfleixingSelected = this.data.zfleixingSelected
    if (zfleixingSelected != index) {
      this.setData({
        zfleixingSelected: index,
        zfleixing: zfleixing.text
      })
    } else {
      this.setData({
        zfleixingSelected: null,
        zfleixing: ''
      })
    }
  },
  // 租房小区选择
  quyuSelected: function (e) {
    var index = e.currentTarget.dataset.index;
    var quyu = this.data.quyuList[index]
    console.log('类型选择：：', index, quyu);
    var quyuSelected = this.data.quyuSelected
    if (quyuSelected != index) {
      this.setData({
        quyuSelected: index,
        value_name: quyu.text
      })
    } else {
      this.setData({
        quyuSelected: null,
        value_name: ''
      })
    }
  },
  // 兼职类型选择
  leixingSelected: function (e) {
    var index = e.currentTarget.dataset.index;
    var leixing = this.data.leixingList[index]
    console.log('类型选择：：', index, leixing);
    var leixingSelected = this.data.leixingSelected
    if (leixingSelected != index) {
      this.setData({
        leixingSelected: index,
        // selectedNumb: this.data.selectedNumb + (leixingSelectedSelected == null ? 1 : 0)
      })
    } else {
      this.setData({
        leixingSelected: null,
        isShaixuan: false,
        // selectedNumb: this.data.selectedNumb - 1
      })
    }
  },
  // 黄页类别选择
  leibieSelected: function (e) {
    var index = e.currentTarget.dataset.index;
    var leibie = this.data.leibieList[index]
    console.log('黄页类别选择：：', index, leibie);
    var leibieSelected = this.data.leibieSelected
    if (leibieSelected != index) {
      this.setData({
        leibieSelected: index,
        // selectedNumb: this.data.selectedNumb + (leibieSelectedSelected == null ? 1 : 0)
      })
    } else {
      this.setData({
        leibieSelected: null,
        isShaixuan: false,
        // selectedNumb: this.data.selectedNumb - 1
      })
    }
  },


  // 房屋设施选择
  checkboxChange_sheshi(e) {
    // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    var sheshi = e.detail.value
    var sheshiList = this.data.sheshiList
    sheshiList.forEach(element => {
      if (sheshi.includes(element.name)) {
        element.checked = true
      } else {
        element.checked = false
      }
    });
    this.setData({
      sheshi,
      sheshiList,
    })
  },
  toSheshi_gengduo() {
    // console.log('点击设施 更多');
    if (this.data.isSheshiGengduo) {
      this.setData({
        isSheshiGengduo: false
      })
    } else {
      this.setData({
        isSheshiGengduo: true
      })
    }
  },

  toHuxing(e) {
    // console.log(e);
    var {
      multiArray
    } = this.data
    var multiIndex = e.detail.value
    var huxing = multiArray[0][multiIndex[0]] + multiArray[1][multiIndex[1]] + multiArray[2][multiIndex[2]]
    this.setData({
      huxing,
    })
  },


  bindinputJianjie(e) {
    this.setData({
      inputNum: e.detail.cursor
    })
  },
  bindinputPhone(e) {
    if (e.detail.value.length == 11) {
      // 收起键盘
      wx.hideKeyboard()
    }
  },
  // 时间选择器变更
  toOpenShijian() {
    this.setData({
      isShowshijian: true
    })
  },
  toCloseShijian() {
    this.setData({
      isShowshijian: false
    })
  },
    bindChange(e) {
    var val = e.detail.value
    console.log(val, 'val');
    var year = this.data.years[val[0]]
    var daytime = this.data.daytimes[val[3]]
    var time = this.data.times[val[4]]
    
    if (this.data.addType == 'pinche') {
        var month = this.data.months[val[0]]
        var day = this.data.days[val[1]]
        this.setData({
            month,
            day,
            val
        })
    } else {
        var month = this.data.months[val[1]]
        var day = this.data.days[val[2]]
        this.setData({
            year,
            month,
            day,
            daytime,
            time,
            val,
        })
    }
  },
  // 选择图片 上传文件
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let files = that.data.files.concat(res.tempFilePaths)
        that.setData({
          files,
        });
      }
    })
  },
  todelete(e) {
    // console.log('删除图片', e);
    var files = this.data.files
    files.splice(e.detail.index, 1)
    this.setData({
      files
    })
  },

  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      fileIDs: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('selectFile后files', files)
    let newfiles = this.data.files
    if (newfiles.length == 5) {
      newfiles = []
    }
    files.tempFilePaths.forEach(element => {
      newfiles.push({
        url: element
      })
    });
    this.setData({
      files: newfiles
    })
    // 返回false可以阻止某次文件上传
  },

  // 失物招领 xunren
  async toTijiaoSubmit_xunren(e) {

    var inputVal_name = e.detail.value.inputVal_name
    var inputVal_didian = e.detail.value.inputVal_didian
    var inputVal_lianxi = e.detail.value.inputVal_lianxi
    var inputVal_jianjie = e.detail.value.inputVal_jianjie

    if (e.detail.value.inputVal_name == '') {
      wx.showToast({
        icon: 'none',
        title: '物件名称未填',
      })
      return
    }
    if (e.detail.value.inputVal_didian == '') {
      wx.showToast({
        icon: 'none',
        title: '拾到地点未填',
      })
      return
    }
    if (e.detail.value.inputVal_lianxi == '') {
      wx.showToast({
        icon: 'none',
        title: '联系方式未填',
      })
      return
    }
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '具体信息未填',
      })
      return
    }
    if (this.data.files.length == 0 && !this.data.isEdit) {
      wx.showToast({
        icon: 'none',
        title: '未选择图片',
      })
      return
    }
    // console.log('imagesUrlList', this.data.imagesUrlList);
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var createTime = utils_time.formatTime(new Date())
    var shijian = this.data.year + '年' + this.data.month + '月' + this.data.day + '日' + this.data.daytime + this.data.time + '点'
    // var imagesUrlList = this.getImagesUrlList()
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName

    // 安全检查
    var content = inputVal_name + inputVal_didian + inputVal_lianxi + inputVal_jianjie
    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }


    if (this.data.isEdit) {
      var imagesUrlList = this.data.imagesUrlList
      var deleteFileList = this.data.deleteFileList

      var res3 = await wx.cloud.database().collection('xunwu')
        .doc(this.data._id)
        .update({ //上传一条记录·············
          data: {
            name: e.detail.value.inputVal_name,
            shijian,
            shijianValue: this.data.val,
            didian: e.detail.value.inputVal_didian,
            lianxi: e.detail.value.inputVal_lianxi,
            jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,

            imagesUrlList,
            gx_Time: createTime,
          }
        })

      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.hideLoading()
      this.returnPre()
      console.log('编辑 xunren 成功：：：', res3);
      console.log('编辑 xunren 删除图片成功：：：', resDel);

    } else {
      var imagesUrlList = []
      var deleteFileList = []
      for (let index = 0; index < this.data.files.length; index++) {
        const tempFilePaths = this.data.files[index];
        // console.log('tempFilePaths', tempFilePaths);
        var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'xunwu/' + openid + 'xunren' + iamgeUploadTime + '-' + index + '.png'

        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: tempFilePaths.url, // 文件路径
        })
        // console.log('上传后的fileID', res.fileID)
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })

        deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除

        imagesUrlList.push({
          imagefileID: res2.fileList[0].fileID,
          imagetempFileURL: res2.fileList[0].tempFileURL
        })
      }
      console.log('获取imagesUrlList', imagesUrlList);

      // 图片安全检查结果：
      var resImgCheck = await wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'imageCheck',
          deleteFileList,
          // fileID: res2.fileList[0].fileID,
        },
      })
      console.log('图片安全检查结果：', resImgCheck);
      var hasRisky = false
      resImgCheck.result.forEach(element => {
        if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
          hasRisky = true
        }
      });

      if (hasRisky !== true) {
        console.log('图片未识别到风险');

        var res3 = await wx.cloud.database().collection('xunwu').add({ //上传一条记录·············
          data: {
            name: e.detail.value.inputVal_name,
            shijian,
            shijianValue: this.data.val,
            didian: e.detail.value.inputVal_didian,
            lianxi: e.detail.value.inputVal_lianxi,
            isHege: this.data.isHegeOpen,
            isXiajia: false,
            isZhiding: false,
            isXunwu: false,
            isXunren: true,
            createTime: createTime,
            jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,
            imagesUrlList: imagesUrlList,
            nickName,
            avatarUrl,
          }
        })

        const _ = wx.cloud.database().command
        var jifen = {
          jifen_name: '失物招领发布',
          jifen_num: this.data.val_jifen,
          jifen_time: createTime
        }
        var id = wx.getStorageSync('id')
        var res4 = await wx.cloud.database().collection('user').doc(id)
          .update({
            data: {
              jifen: _.addToSet(jifen),
            }
          })
        console.log('积分成功：', res4.stats.updated);

        // 返回上一级页面
        wx.navigateBack({
          delta: 1
        })
        wx.hideLoading()
        console.log('提交 失物招领 成功res._id：', res3._id);


      } else {
        var resDel = await wx.cloud.deleteFile({
          fileList: deleteFileList,
        })
        wx.showToast({
          title: '图片含违规信息',
          duration: 1000,
          icon: 'error',
          mask: true,
        })
        this.setData({
          isDisabled: false,
        })
        return
      }

    }

  },


  // 寻物启事
  async toTijiaoSubmit_xunwu(e) {
    var inputVal_name = e.detail.value.inputVal_name
    var inputVal_didian = e.detail.value.inputVal_didian
    var inputVal_lianxi = e.detail.value.inputVal_lianxi
    var inputVal_jianjie = e.detail.value.inputVal_jianjie

    if (e.detail.value.inputVal_name == '') {
      wx.showToast({
        icon: 'none',
        title: '物件名称未填',
      })
      return
    }
    if (e.detail.value.inputVal_didian == '') {
      wx.showToast({
        icon: 'none',
        title: '遗失地点未填',
      })
      return
    }
    if (e.detail.value.inputVal_lianxi == '') {
      wx.showToast({
        icon: 'none',
        title: '联系方式未填',
      })
      return
    }
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '具体信息未填',
      })
      return
    }
    if (this.data.files.length == 0 && !this.data.isEdit) {
      wx.showToast({
        icon: 'none',
        title: '未选择图片',
      })
      return
    }
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var createTime = utils_time.formatTime(new Date())
    var shijian = this.data.year + '年' + this.data.month + '月' + this.data.day + '日' + this.data.daytime + this.data.time + '点'
    // var imagesUrlList = this.getImagesUrlList()
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName

    // 安全检查
    var content = inputVal_name + inputVal_didian + inputVal_lianxi + inputVal_jianjie
    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }

    if (this.data.isEdit) {
      var imagesUrlList = this.data.imagesUrlList
      var deleteFileList = this.data.deleteFileList

      var res3 = await wx.cloud.database().collection('xunwu')
        .doc(this.data._id)
        .update({ //上传一条记录·············
          data: {
            name: e.detail.value.inputVal_name,
            shijian,
            shijianValue: this.data.val,
            didian: e.detail.value.inputVal_didian,
            lianxi: e.detail.value.inputVal_lianxi,
            jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,

            imagesUrlList,
            gx_Time: createTime,
          }
        })

      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.hideLoading()
      this.returnPre()
      console.log('编辑xunwu 成功：：：', res3);
      console.log('编辑xunwu 删除图片成功：：：', resDel);

    } else {
      var imagesUrlList = []
      var deleteFileList = []
      for (let index = 0; index < this.data.files.length; index++) {
        const tempFilePaths = this.data.files[index];
        // console.log('tempFilePaths', tempFilePaths);
        var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'xunwu/' + openid + 'xunwu' + iamgeUploadTime + '-' + index + '.png'

        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: tempFilePaths.url, // 文件路径
        })
        // console.log('上传后的fileID', res.fileID)
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })

        deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除

        imagesUrlList.push({
          imagefileID: res2.fileList[0].fileID,
          imagetempFileURL: res2.fileList[0].tempFileURL
        })
      }
      console.log('获取imagesUrlList', imagesUrlList);

      // 图片安全检查结果：
      var resImgCheck = await wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'imageCheck',
          deleteFileList,
          // fileID: res2.fileList[0].fileID,
        },
      })
      console.log('图片安全检查结果：', resImgCheck);
      var hasRisky = false
      resImgCheck.result.forEach(element => {
        if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
          hasRisky = true
        }
      });
      if (hasRisky !== true) {
        console.log('图片未识别到风险');

        var res3 = await wx.cloud.database().collection('xunwu').add({ //上传一条记录·············
          data: {
            name: e.detail.value.inputVal_name,
            shijian,
            shijianValue: this.data.val,
            didian: e.detail.value.inputVal_didian,
            lianxi: e.detail.value.inputVal_lianxi,
            isHege: this.data.isHegeOpen,
            isXiajia: false,
            isZhiding: false,

            isXunwu: true,
            isXunren: false,
            createTime: createTime,
            jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,
            imagesUrlList: imagesUrlList,
            nickName,
            avatarUrl,
          }
        })

        const _ = wx.cloud.database().command
        var jifen = {
          jifen_name: '失物招领发布',
          jifen_num: this.data.val_jifen,
          jifen_time: createTime
        }
        var id = wx.getStorageSync('id')
        var res4 = await wx.cloud.database().collection('user').doc(id)
          .update({
            data: {
              jifen: _.addToSet(jifen),
            }
          })

        console.log('积分成功：', res4.stats.updated);

        // 返回上一级页面
        wx.navigateBack({
          delta: 1
        })
        wx.hideLoading()
        console.log('提交寻物启事 成功res._id：', res3._id);

      } else {
        var resDel = await wx.cloud.deleteFile({
          fileList: deleteFileList,
        })
        wx.showToast({
          title: '图片含违规信息',
          duration: 1000,
          icon: 'error',
          mask: true,
        })
        this.setData({
          isDisabled: false,
        })
        return
      }

    }
  },


  // 黄页·················
  async toTijiaoSubmit_huangye(e) {

    var inputVal_address = e.detail.value.inputVal_address
    var inputVal_jianAddress = e.detail.value.inputVal_jianAddress
    var inputVal_jianjie = e.detail.value.inputVal_jianjie
    var inputVal_name = e.detail.value.inputVal_name

    if (e.detail.value.inputVal_name == '') {
      wx.showToast({
        icon: 'none',
        title: '名称未填',
      })
      return
    }
    // if (e.detail.value.inputVal_phone == '') {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '电话未填',
    //   })
    //   return
    // }
    if (this.data.leibieSelected == null) {
      wx.showToast({
        icon: 'none',
        title: '黄页类别未选',
      })
      return
    }
    if (e.detail.value.inputVal_address == '') {
      wx.showToast({
        icon: 'none',
        title: '详细地址未填',
      })
      return
    }
    if (e.detail.value.inputVal_jianAddress == '') {
      wx.showToast({
        icon: 'none',
        title: '地址简称未填',
      })
      return
    }
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '简介未填',
      })
      return
    }
    if (this.data.files.length == 0 && !this.data.isEdit) {
      wx.showToast({
        icon: 'none',
        title: '未选择图片',
      })
      return
    }
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var createTime = utils_time.formatTime(new Date())
    // var imagesUrlList = this.getImagesUrlList()
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName
    var leibie = this.data.leibieList[this.data.leibieSelected].text

    // 安全检查
    var content = inputVal_address + inputVal_jianAddress + inputVal_jianjie + inputVal_name

    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }

    if (this.data.isEdit) {
      var imagesUrlList = this.data.imagesUrlList
      var deleteFileList = this.data.deleteFileList
      var res3 = await wx.cloud.database().collection('huangye')
        .doc(this.data._id)
        .update({
          data: {
            address: e.detail.value.inputVal_address,
            jianAddress: e.detail.value.inputVal_jianAddress,
            jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,
            name: e.detail.value.inputVal_name,
            phone: e.detail.value.inputVal_phone,
            leibie,
            gx_Time: createTime,
            imagesUrlList,
          }
        })
      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.hideLoading()
      this.returnPre()
      console.log('编辑 huangy 成功：：：', res3);
      console.log('编辑 huangye 删除图片成功：：：', resDel);

    } else {
      var imagesUrlList = []
      var deleteFileList = []
      for (let index = 0; index < this.data.files.length; index++) {
        const tempFilePaths = this.data.files[index];
        // console.log('tempFilePaths', tempFilePaths);
        var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'huangye/' + openid + 'huangye' + iamgeUploadTime + '-' + index + '.png'
        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: tempFilePaths.url, // 文件路径
        })
        // console.log('上传后的fileID', res.fileID)
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })

        deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除
        imagesUrlList.push({
          imagefileID: res2.fileList[0].fileID,
          imagetempFileURL: res2.fileList[0].tempFileURL
        })
      }

      // 图片安全检查结果：
      var resImgCheck = await wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'imageCheck',
          deleteFileList,
          // fileID: res2.fileList[0].fileID,
        },
      })
      console.log('图片安全检查结果：', resImgCheck);
      var hasRisky = false
      resImgCheck.result.forEach(element => {
        if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
          hasRisky = true
        }
      });

      if (hasRisky !== true) {
        console.log('图片未识别到风险');

        var res3 = await wx.cloud.database().collection('huangye').add({
          data: {
            address: e.detail.value.inputVal_address,
            jianAddress: e.detail.value.inputVal_jianAddress,
            // jianjie: e.detail.value.inputVal_jianjie,
            jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,
            name: e.detail.value.inputVal_name,
            phone: e.detail.value.inputVal_phone,
            leibie,
            isHege: this.data.isHegeOpen_huangye,
            isXiajia: false,
            isZhiding: false,
            createTime: createTime,
            imagesUrlList,
            nickName,
            avatarUrl,
          }
        })

        const _ = wx.cloud.database().command
        var jifen = {
          jifen_name: '黄页发布',
          jifen_num: this.data.val_jifen,
          jifen_time: createTime
        }
        var id = wx.getStorageSync('id')
        var res4 = await wx.cloud.database().collection('user').doc(id)
          .update({
            data: {
              jifen: _.addToSet(jifen),
            }
          })

        console.log('huangye积分成功：', res4.stats.updated);

        // 返回上一级页面
        wx.navigateBack({
          delta: 1
        })
        wx.hideLoading()
        console.log('提交 黄页 成功res._id：', res3._id);


      } else {
        var resDel = await wx.cloud.deleteFile({
          fileList: deleteFileList,
        })
        wx.showToast({
          title: '图片含违规信息',
          duration: 1000,
          icon: 'error',
          mask: true,
        })
        this.setData({
          isDisabled: false,
        })
        return
      }

    }
  },
  checkDate(month) {
    if (Number(month) < 10) {
      month = '0' + Number(month)
      // console.log(month,'月份');
    }
    return month
  },

  // 拼车··········
  toTijiaoSubmit_pinche(e) {

    if (e.detail.value.inputVal_xingch_start == '') {
      wx.showToast({
        icon: 'none',
        title: '出发未填',
      })
      return
    }
    if (e.detail.value.inputVal_xingch_end == '') {
      wx.showToast({
        icon: 'none',
        title: '终点未填',
      })
      return
    }
    if (e.detail.value.inputVal_shijian == '') {
      wx.showToast({
        icon: 'none',
        title: '时间未填',
      })
      return
    }
    if (e.detail.value.inputVal_personNum == '') {
      wx.showToast({
        icon: 'none',
        title: '人数未填',
      })
      return
    }
    if (e.detail.value.inputVal_lianxi == '') {
      wx.showToast({
        icon: 'none',
        title: '联系方式未填',
      })
      return
    }
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '具体信息未填',
      })
      return
    }

    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var createTime = utils_time.formatTime(new Date())
    // var shijian = this.data.year + '年' + this.data.month + '月' + this.data.day + '日' + this.data.daytime + this.data.time + '点'

    var shijian = this.checkDate(this.data.month) + '月' + this.checkDate(this.data.day) + '日' + e.detail.value.inputVal_shijian
    // var imagesUrlList = this.getImagesUrlList()
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName
    var inputVal_xingch_start = e.detail.value.inputVal_xingch_start
    var inputVal_xingch_end = e.detail.value.inputVal_xingch_end
    var xingch = inputVal_xingch_start + '到' + inputVal_xingch_end

    var inputVal_shijian = e.detail.value.inputVal_shijian
    var inputVal_personNum = e.detail.value.inputVal_personNum
    var inputVal_lianxi = e.detail.value.inputVal_lianxi
    var inputVal_jianjie = e.detail.value.inputVal_jianjie
    // 安全检查
    var content = inputVal_shijian + inputVal_personNum + inputVal_lianxi + inputVal_xingch_start + inputVal_xingch_end + inputVal_jianjie

    if (this.data.isEdit) {
      // 安全检查
      wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'msgCheck',
          openid,
          content,
        },
        success: res => {
          console.log('安全检查结果：', res);
          if (res.result.result.suggest == 'pass') {
            wx.cloud.database().collection('pinche')
              .doc(this.data._id)
              .update({
                data: {
                  xingch,
                  xingch_start: inputVal_xingch_start,
                  xingch_end: inputVal_xingch_end,
                  shijian,
                  personNum: e.detail.value.inputVal_personNum,
                  lianxi: e.detail.value.inputVal_lianxi,

                  gx_Time: createTime,
                  jianjie: xingch + '：' + e.detail.value.inputVal_jianjie,

                }
              })
              .then(res => {
                console.log('编辑 拼车 成功res：：：', res);
                wx.hideLoading()
                this.returnPre()
              })
              .catch(err => {
                console.log(err);
              })
          } else {
            wx.showToast({
              title: '发布内容违规',
              duration: 1000,
              icon: 'error',
              mask: true,
            })
            this.setData({
              isDisabled: false,
            })
          }
        },
        fail: err => {
          console.log('失败', err);
        }
      })

    } else {

      // 安全检查
      wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'msgCheck',
          openid, // "openid": 'OPENID',
          content, // "content": 'hello world!'
        },
        success: res => {
          console.log('安全检查结果：', res);
          if (res.result.result.suggest == 'pass') {
            wx.cloud.database().collection('pinche').add({ //上传记录
                data: {
                  xingch,
                  xingch_start: inputVal_xingch_start,
                  xingch_end: inputVal_xingch_end,
                  shijian,
                  personNum: e.detail.value.inputVal_personNum,
                  lianxi: e.detail.value.inputVal_lianxi,

                  isHege: this.data.isHegeOpen,
                  isXiajia: false,
                  isZhiding: false,

                  createTime: createTime,
                  jianjie: xingch + '：' + e.detail.value.inputVal_jianjie,
                  nickName,
                  avatarUrl,
                }
              })
              .then(res => {
                console.log('发布拼车 成功res._id：', res._id);
                wx.hideLoading()

                const _ = wx.cloud.database().command
                var jifen = {
                  jifen_name: '拼车发布',
                  jifen_num: this.data.val_jifen,
                  jifen_time: createTime
                }
                var id = wx.getStorageSync('id')
                wx.cloud.database().collection('user').doc(id)
                  .update({
                    data: {
                      jifen: _.addToSet(jifen),
                    }
                  })
                  .then(res => {
                    console.log('积分成功：', res.stats.updated);
                  })
                  .catch(err => {
                    console.log(err);
                  })

                // 返回上一级页面
                wx.navigateBack({
                  delta: 1
                })
              })
              .catch(err => {
                console.log(err);
              })
          } else {
            wx.showToast({
              title: '发布内容违规',
              duration: 1000,
              icon: 'error',
              mask: true,
            })
            this.setData({
              isDisabled: false,
            })
          }
        },
        fail: err => {
          console.log('失败', err);
        }
      })

    }
  },

  // 建议
  async toTijiaoSubmit_jianyi(e) {

    var inputVal_jianjie = e.detail.value.inputVal_jianjie
    // var inputVal_jiage = e.detail.value.inputVal_jiage
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '请输入建议内容',
      })
      return
    }
    // if (e.detail.value.inputVal_jiage == '') {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '价格未填',
    //   })
    //   return
    // }
    // if (this.data.files.length == 0 && !this.data.isEdit) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '未选择图片',
    //   })
    //   return
    // }
    // console.log('imagesUrlList', this.data.imagesUrlList);
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var jianjie = e.detail.value.inputVal_jianjie,
      name = jianjie.slice(0, 23) //选取简介的前24个字座位标题
    var createTime = utils_time.formatTime(new Date())
    // var shijian = this.data.year + '年' + this.data.month + '月' + this.data.day + '日' + this.data.daytime + this.data.time + '点'
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName

    // 安全检查
    var content = inputVal_jianjie
    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }

    // if (this.data.isEdit) {
    //   var imagesUrlList = this.data.imagesUrlList
    //   var deleteFileList = this.data.deleteFileList
    //   var res3 = await wx.cloud.database().collection('ershou')
    //     .doc(this.data._id)
    //     .update({
    //       data: {
    //         name: name,
    //         jianjie: e.detail.value.inputVal_jianjie,
    //         jiage: e.detail.value.inputVal_jiage,

    //         imagesUrlList,
    //         gx_Time: createTime,
    //       }
    //     })

    //   var resDel = await wx.cloud.deleteFile({
    //     fileList: deleteFileList,
    //   })
    //   wx.hideLoading()
    //   this.returnPre()
    //   console.log('编辑 ershou 成功：：：', res3);
    //   console.log('编辑 ershou 删除图片成功：：：', resDel);

    // } else {
    var imagesUrlList = []
    var deleteFileList = []
    for (let index = 0; index < this.data.files.length; index++) {
      const tempFilePaths = this.data.files[index];
      var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
      var cloudPath = 'jianyi/' + openid + 'jianyi' + iamgeUploadTime + '-' + index + '.png'

      var res1 = await wx.cloud.uploadFile({ // 上传图片················
        cloudPath: cloudPath,
        filePath: tempFilePaths.url, // 文件路径
      })
      var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
        fileList: [{
          fileID: res1.fileID
        }]
      })
      // console.log('用云文件 ID 换取真实链接', res.fileList)
      // 用云文件 ID 换取真实链接，公有读的文件获取的链接不会过期，私有的文件获取的链接十分钟有效期。一次最多取 50 个
      // console.log('测试中的 res2',res2);
      deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除
      imagesUrlList.push({
        imagefileID: res2.fileList[0].fileID,
        imagetempFileURL: res2.fileList[0].tempFileURL
      })
      var imagesUrl = res2.fileList[0].tempFileURL
    }

    console.log('获取imagesUrlList', imagesUrlList);
    // 图片安全检查结果：
    var resImgCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'imageCheck',
        deleteFileList,
        // fileID: res2.fileList[0].fileID,
      },
    })
    console.log('图片安全检查结果：', resImgCheck);
    var hasRisky = false
    resImgCheck.result.forEach(element => {
      if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
        hasRisky = true
      }
    });

    if (hasRisky !== true) {
      console.log('图片未识别到风险');

      var res3 = await wx.cloud.database().collection('jianyi').add({ //上传一条记录·············
        data: {
          // name: name,
          // dianzan: [],

          // jiage: e.detail.value.inputVal_jiage,
          // isHege: this.data.isHegeOpen,
          // isXiajia: false,
          // isZhiding: false,

          createTime: createTime,
          jianjie: e.detail.value.inputVal_jianjie,
          // imagesUrlList: imagesUrlList,
          imagesUrl,
          nickName,
          avatarUrl,
        }
      })

      const _ = wx.cloud.database().command
      var jifen = {
        jifen_name: '提交建议',
        jifen_num: this.data.val_jifen,
        jifen_time: createTime
      }
      var id = wx.getStorageSync('id')
      var res4 = await wx.cloud.database().collection('user').doc(id)
        .update({
          data: {
            jifen: _.addToSet(jifen),
          }
        })

      console.log('积分成功：', res4.stats.updated);

      // 返回上一级页面
      wx.navigateBack({
        delta: 1
      })
      wx.hideLoading()
      console.log('提交 建议 成功res._id：', res3._id);

    } else {
      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.showToast({
        title: '图片含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }



    // }
  },
  // 跳蚤市场
  async toTijiaoSubmit_ershou(e) {

    var inputVal_jianjie = e.detail.value.inputVal_jianjie
    var inputVal_jiage = e.detail.value.inputVal_jiage
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '具体信息未填',
      })
      return
    }
    if (e.detail.value.inputVal_jiage == '') {
      wx.showToast({
        icon: 'none',
        title: '价格未填',
      })
      return
    }
    if (this.data.files.length == 0 && !this.data.isEdit) {
      wx.showToast({
        icon: 'none',
        title: '未选择图片',
      })
      return
    }
    // console.log('imagesUrlList', this.data.imagesUrlList);
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var jianjie = e.detail.value.inputVal_jianjie,
      name = jianjie.slice(0, 23) //选取简介的前24个字座位标题
    var createTime = utils_time.formatTime(new Date())
    // var shijian = this.data.year + '年' + this.data.month + '月' + this.data.day + '日' + this.data.daytime + this.data.time + '点'
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName

    // 安全检查
    var content = inputVal_jiage + inputVal_jianjie
    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }

    if (this.data.isEdit) {
      var imagesUrlList = this.data.imagesUrlList
      var deleteFileList = this.data.deleteFileList
      var res3 = await wx.cloud.database().collection('ershou')
        .doc(this.data._id)
        .update({
          data: {
            name: name,
            jianjie: e.detail.value.inputVal_jianjie,
            jiage: e.detail.value.inputVal_jiage,

            imagesUrlList,
            gx_Time: createTime,
          }
        })

      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.hideLoading()
      this.returnPre()
      console.log('编辑 ershou 成功：：：', res3);
      console.log('编辑 ershou 删除图片成功：：：', resDel);

    } else {
      var imagesUrlList = []
      var deleteFileList = []
      for (let index = 0; index < this.data.files.length; index++) {
        const tempFilePaths = this.data.files[index];
        var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'ershou/' + openid + 'ershou' + iamgeUploadTime + '-' + index + '.png'

        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: tempFilePaths.url, // 文件路径
        })
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })
        // console.log('用云文件 ID 换取真实链接', res.fileList)
        // 用云文件 ID 换取真实链接，公有读的文件获取的链接不会过期，私有的文件获取的链接十分钟有效期。一次最多取 50 个
        // console.log('测试中的 res2',res2);
        deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除
        imagesUrlList.push({
          imagefileID: res2.fileList[0].fileID,
          imagetempFileURL: res2.fileList[0].tempFileURL
        })
      }
      console.log('获取imagesUrlList', imagesUrlList);
      // 图片安全检查结果：
      var resImgCheck = await wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'imageCheck',
          deleteFileList,
          // fileID: res2.fileList[0].fileID,
        },
      })
      console.log('图片安全检查结果：', resImgCheck);
      var hasRisky = false
      resImgCheck.result.forEach(element => {
        if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
          hasRisky = true
        }
      });

      if (hasRisky !== true) {
        console.log('图片未识别到风险');

        var res3 = await wx.cloud.database().collection('ershou').add({ //上传一条记录·············
          data: {
            name: name,
            dianzan: [],

            jiage: e.detail.value.inputVal_jiage,
            isHege: this.data.isHegeOpen,
            isXiajia: false,
            isZhiding: false,

            createTime: createTime,
            jianjie: e.detail.value.inputVal_jianjie,
            imagesUrlList: imagesUrlList,
            nickName,
            avatarUrl,
          }
        })

        const _ = wx.cloud.database().command
        var jifen = {
          jifen_name: '跳蚤市场发布',
          jifen_num: this.data.val_jifen,
          jifen_time: createTime
        }
        var id = wx.getStorageSync('id')
        var res4 = await wx.cloud.database().collection('user').doc(id)
          .update({
            data: {
              jifen: _.addToSet(jifen),
            }
          })

        console.log('积分成功：', res4.stats.updated);

        // 返回上一级页面
        wx.navigateBack({
          delta: 1
        })
        wx.hideLoading()
        console.log('提交寻物启事 成功res._id：', res3._id);

      } else {
        var resDel = await wx.cloud.deleteFile({
          fileList: deleteFileList,
        })
        wx.showToast({
          title: '图片含违规信息',
          duration: 1000,
          icon: 'error',
          mask: true,
        })
        this.setData({
          isDisabled: false,
        })
        return
      }



    }
  },

  // 校园互助 ··········
  toTijiaoSubmit_huzhu(e) {

    if (e.detail.value.inputVal_lianxi == '') {
      wx.showToast({
        icon: 'none',
        title: '联系方式未填',
      })
      return
    }
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '互助信息未填',
      })
      return
    }

    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var createTime = utils_time.formatTime(new Date())
    var openid = wx.getStorageSync('openid')



    if (this.data.isEdit) {
      // 安全检查
      var content = e.detail.value.inputVal_lianxi + e.detail.value.inputVal_jianjie
      wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'msgCheck',
          openid, // "openid": 'OPENID',
          content, // "content": 'hello world!'
        },
        success: res => {
          console.log('安全检查结果：', res);
          if (res.result.result.suggest == 'pass') {
            wx.cloud.database().collection('huzhu').doc(this.data._id)
              .update({
                data: {
                  lianxi: e.detail.value.inputVal_lianxi,
                  jianjie: e.detail.value.inputVal_jianjie,

                  gx_Time: createTime,
                }
              })
              .then(res => {
                console.log('编辑 校园互助 成功：', res);
                this.returnPre()
              })
              .catch(err => {
                console.log(err);
              })

          } else {
            wx.showToast({
              title: '发布内容违规',
              duration: 1000,
              icon: 'error',
              mask: true,
            })
            this.setData({
              isDisabled: false,
            })
          }
        },
        fail: err => {
          console.log('失败', err);
        }
      })



    } else {
      var userinfo = wx.getStorageSync('userinfo')
      var avatarUrl = userinfo.avatarUrl
      var nickName = userinfo.nickName

      // 安全检查
      var content = e.detail.value.inputVal_lianxi + e.detail.value.inputVal_jianjie
      wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'msgCheck',
          openid, // "openid": 'OPENID',
          content, // "content": 'hello world!'
        },
        success: res => {
          console.log(res);
          if (res.result.result.suggest == 'pass') {
            wx.cloud.database().collection('huzhu').add({ //上传一条记录·············
                data: {

                  lianxi: e.detail.value.inputVal_lianxi,
                  isHege: this.data.isHegeOpen,
                  isXiajia: false,
                  isZhiding: false,
                  // isPinche: true,
                  createTime: createTime,
                  jianjie: e.detail.value.inputVal_jianjie,
                  nickName,
                  avatarUrl,
                }
              })
              .then(res => {
                console.log('发布 校园互助 成功res._id：', res._id);
                wx.hideLoading()

                const _ = wx.cloud.database().command
                var jifen = {
                  jifen_name: '校园互助发布',
                  jifen_num: this.data.val_jifen,
                  jifen_time: createTime
                }
                var id = wx.getStorageSync('id')
                wx.cloud.database().collection('user').doc(id)
                  .update({
                    data: {
                      jifen: _.addToSet(jifen),
                    }
                  })
                  .then(res => {
                    console.log('积分成功：', res.stats.updated);
                  })
                  .catch(err => {
                    console.log(err);
                  })

                // 返回上一级页面
                wx.navigateBack({
                  delta: 1
                })
              })
              .catch(err => {
                console.log(err);
              })

          } else {
            wx.showToast({
              title: '发布内容违规',
              duration: 1000,
              icon: 'error',
              mask: true,
            })
            this.setData({
              isDisabled: false,
            })
          }
        },
        fail: err => {
          console.log('失败', err);
        }
      })
    }
  },

  // 校园大事件
  async toTijiaoSubmit_bigthings(e) {
    // if (e.detail.value.inputVal_name == '') {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '标题未填',
    //   })
    //   return
    // }
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '事件内容未填',
      })
      return
    }
    // if (this.data.files.length == 0 && !this.data.isEdit) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '未选择图片',
    //   })
    //   return
    // }
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    // var jianjie = e.detail.value.inputVal_jianjie
    var createTime = utils_time.formatTime(new Date())
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName

    var inputVal_name = e.detail.value.inputVal_name
    var inputVal_jianjie = e.detail.value.inputVal_jianjie

    // 安全检查
    var content = inputVal_name + inputVal_jianjie
    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }


    if (this.data.isEdit) {
      console.log('1');
      var audio = {
        'name': '',
        'fileid': '',
      }
      if (this.data.audio_path !== '') {
        console.log('2');
        var audio_name = this.data.audio_name
        var audio_path = this.data.audio_path
        var audioUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'bigthings/audio/' + openid + 'bigthings' + audioUploadTime + '-' + audio_name

        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: audio_path, // 文件路径
        })
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })

        audio = {
          'name': audio_name,
          'fileid': res2.fileList[0].fileID,
        }

      }
      var imagesUrlList = this.data.imagesUrlList
      var deleteFileList = this.data.deleteFileList
      console.log('3');
      var res3 = await wx.cloud.database().collection('bigthings')
        .doc(this.data._id)
        .update({
          data: {
            // name: e.detail.value.inputVal_name,
            jianjie: e.detail.value.inputVal_jianjie,
            imagesUrlList: imagesUrlList,
            video_fileid: this.data.video_fileid,
            audio,

            gx_Time: createTime,
          }
        })
      console.log(res3);

      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.hideLoading()
      this.returnPre()
      console.log('编辑 bigthings 成功：：：', res3);
      console.log('编辑 bigthings 删除图片成功：：：', resDel);

    } else { // 非编辑状态

      if (this.data.isImage) {
        var imagesUrlList = []
        var deleteFileList = []

        for (let index = 0; index < this.data.files.length; index++) {
          const tempFilePaths = this.data.files[index];
          var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
          var cloudPath = 'bigthings/' + openid + 'bigthings' + iamgeUploadTime + '-' + index + '.png'

          var res1 = await wx.cloud.uploadFile({ // 上传图片················
            cloudPath: cloudPath,
            filePath: tempFilePaths.url, // 文件路径
          })
          var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
            fileList: [{
              fileID: res1.fileID
            }]
          })

          deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除

          imagesUrlList.push({
            imagefileID: res2.fileList[0].fileID,
            imagetempFileURL: res2.fileList[0].tempFileURL
          })
        }
        console.log('获取imagesUrlList', imagesUrlList);

        // 图片安全检查结果：
        var resImgCheck = await wx.cloud.callFunction({
          name: 'anquancheck',
          data: {
            action: 'imageCheck',
            deleteFileList,
            // fileID: res2.fileList[0].fileID,
          },
        })
        console.log('图片安全检查结果：', resImgCheck);
        var hasRisky = false
        resImgCheck.result.forEach(element => {
          if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
            hasRisky = true
          }
        });

        if (hasRisky !== true) {
          console.log('图片未识别到风险');
          var res3 = await wx.cloud.database().collection('bigthings').add({ //上传一条记录·············
            data: {
              dianzan: [],
              // name: e.detail.value.inputVal_name,
              name: '蜂蜂校园',
              isHege: true,
              isXiajia: false,
              isZhiding: false,
              gx_Time: '',
              createTime: createTime,
              jianjie: e.detail.value.inputVal_jianjie,
              // jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,
              imagesUrlList: imagesUrlList,
              audio: {
                'name': '',
                'fileid': '',
              },
              video_fileid: '',
              nickName,
              avatarUrl,
            }
          })
          wx.hideLoading()
          // 返回上一级页面 传参
          this.returnPre_add()
          console.log('提交 校园大事件 成功res._id：', res3._id);
        } else {
          var resDel = await wx.cloud.deleteFile({
            fileList: deleteFileList,
          })
          wx.showToast({
            title: '图片含违规信息',
            duration: 1000,
            icon: 'error',
            mask: true,
          })
          this.setData({
            isDisabled: false,
          })
          return
        }
      } else if (this.data.isVideo) {
        var res3 = await wx.cloud.database().collection('bigthings').add({ //上传一条记录·············
          data: {
            dianzan: [],
            // name: e.detail.value.inputVal_name,
            name: '蜂蜂校园',
            isHege: true,
            isXiajia: false,
            isZhiding: false,
            gx_Time: '',
            createTime: createTime,
            jianjie: e.detail.value.inputVal_jianjie,
            // jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,
            imagesUrlList: [],
            video_fileid: this.data.video_fileid,
            audio: {
              'name': '',
              'fileid': '',
            },
            nickName,
            avatarUrl,
          }
        })
        wx.hideLoading()
        // 返回上一级页面 传参
        this.returnPre_add()
        console.log('提交 校园大事件 成功res._id：', res3._id);

      } else if (this.data.isAudio) {
        console.log(4);
        var audio_name = this.data.audio_name
        var audio_path = this.data.audio_path
        var audioUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'bigthings/audio/' + openid + 'bigthings' + audioUploadTime + '-' + audio_name

        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: audio_path, // 文件路径
        })
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })

        var audio = {
          'name': audio_name,
          'fileid': res2.fileList[0].fileID,
        }

        var res3 = await wx.cloud.database().collection('bigthings').add({ //上传一条记录·············
          data: {
            dianzan: [],
            // name: e.detail.value.inputVal_name,
            name: '蜂蜂校园',
            isHege: true,
            isXiajia: false,
            isZhiding: false,
            gx_Time: '',
            createTime: createTime,
            jianjie: e.detail.value.inputVal_jianjie,
            // jianjie: e.detail.value.inputVal_name + '：' + e.detail.value.inputVal_jianjie,
            imagesUrlList: [],
            video_fileid: '',
            audio,
            nickName,
            avatarUrl,
          }
        })
        wx.hideLoading()
        // 返回上一级页面 传参
        this.returnPre_add()
        console.log('提交 校园大事件 成功res._id：', res3._id);

      }

    }
  },
  // 论坛
  async toTijiaoSubmit_luntan(e) {

    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '内容未填',
      })
      return
    }
    if (this.data.files.length == 0 && !this.data.isEdit) {
      wx.showToast({
        icon: 'none',
        title: '未选择图片',
      })
      return
    }
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var jianjie = e.detail.value.inputVal_jianjie,
      name = jianjie.slice(0, 23)
    var createTime = utils_time.formatTime(new Date())
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName


    // 安全检查
    var inputVal_jianjie = e.detail.value.inputVal_jianjie
    var content = inputVal_jianjie

    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }

    if (this.data.isEdit) {
      var imagesUrlList = this.data.imagesUrlList
      var deleteFileList = this.data.deleteFileList
      var res3 = await wx.cloud.database().collection('luntan')
        .doc(this.data._id)
        .update({
          data: {
            name: name,
            jianjie: e.detail.value.inputVal_jianjie,
            imagesUrlList,

            gx_Time: createTime,
          }
        })

      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.hideLoading()
      this.returnPre()
      console.log('编辑 luntan 成功：：：', res3);
      console.log('编辑 luntan 删除图片成功：：：', resDel);
    } else {
      var imagesUrlList = []
      var deleteFileList = []

      for (let index = 0; index < this.data.files.length; index++) {
        const tempFilePaths = this.data.files[index];
        var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'luntan/' + openid + 'luntan' + iamgeUploadTime + '-' + index + '.png'

        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: tempFilePaths.url, // 文件路径
        })
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })

        // console.log('测试中的 res2',res2);
        deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除

        imagesUrlList.push({
          imagefileID: res2.fileList[0].fileID,
          imagetempFileURL: res2.fileList[0].tempFileURL
        })
      }
      console.log('获取imagesUrlList', imagesUrlList);

      // 图片安全检查：
      var resImgCheck = await wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'imageCheck',
          deleteFileList,
          // fileID: res2.fileList[0].fileID,
        },
      })
      console.log('图片安全检查结果：', resImgCheck);
      var hasRisky = false
      resImgCheck.result.forEach(element => {
        if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
          hasRisky = true
        }
      });

      if (hasRisky !== true) {
        console.log('图片未识别到风险');

        var res3 = await wx.cloud.database().collection('luntan').add({ //上传一条记录·············
          data: {
            dianzan: [],
            name: name,
            isHege: this.data.isHegeOpen,
            isXiajia: false,
            isZhiding: false,
            createTime: createTime,
            jianjie: e.detail.value.inputVal_jianjie,
            imagesUrlList: imagesUrlList,
            nickName,
            avatarUrl,
          }
        })
        // 返回上一级页面
        wx.navigateBack({
          delta: 1
        })
        wx.hideLoading()
        console.log('提交 论坛 成功res._id：', res3._id);

      } else {
        var resDel = await wx.cloud.deleteFile({
          fileList: deleteFileList,
        })
        wx.showToast({
          title: '图片含违规信息',
          duration: 1000,
          icon: 'error',
          mask: true,
        })
        this.setData({
          isDisabled: false,
        })
        return
      }
    }
  },
  // 论坛
  async toTijiaoSubmit_jiaoyou(e) {

    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '内容未填',
      })
      return
    }
    if (this.data.files.length == 0 && !this.data.isEdit) {
      wx.showToast({
        icon: 'none',
        title: '未选择图片',
      })
      return
    }
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var jianjie = e.detail.value.inputVal_jianjie,
      name = jianjie.slice(0, 23)
    var createTime = utils_time.formatTime(new Date())
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName

    // 安全检查
    var inputVal_jianjie = e.detail.value.inputVal_jianjie
    var content = inputVal_jianjie

    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }

    if (this.data.isEdit) {
      var imagesUrlList = this.data.imagesUrlList
      var deleteFileList = this.data.deleteFileList
      var res3 = await wx.cloud.database().collection('jiaoyou')
        .doc(this.data._id)
        .update({
          data: {
            name: name,
            jianjie: e.detail.value.inputVal_jianjie,
            imagesUrlList,

            gx_Time: createTime,
          }
        })

      var resDel = await wx.cloud.deleteFile({
        fileList: deleteFileList,
      })
      wx.hideLoading()
      this.returnPre()
      console.log('编辑 交友 成功：：：', res3);
      console.log('编辑 交友 删除图片成功：：：', resDel);

    } else {
      var imagesUrlList = []
      var deleteFileList = []
      for (let index = 0; index < this.data.files.length; index++) {
        const tempFilePaths = this.data.files[index];
        var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'jiaoyou/' + openid + 'jiaoyou' + iamgeUploadTime + '-' + index + '.png'

        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: tempFilePaths.url, // 文件路径
        })
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })

        deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除

        imagesUrlList.push({
          imagefileID: res2.fileList[0].fileID,
          imagetempFileURL: res2.fileList[0].tempFileURL
        })
      }
      console.log('获取imagesUrlList', imagesUrlList);

      // 图片安全检查：
      var resImgCheck = await wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'imageCheck',
          deleteFileList,
          // fileID: res2.fileList[0].fileID,
        },
      })
      console.log('图片安全检查结果：', resImgCheck);
      var hasRisky = false
      resImgCheck.result.forEach(element => {
        if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
          hasRisky = true
        }
      });

      if (hasRisky !== true) {
        console.log('图片未识别到风险');

        var res3 = await wx.cloud.database().collection('jiaoyou').add({ //上传一条记录·············
          data: {
            dianzan: [],
            name: name,
            isHege: this.data.isHegeOpen,
            isXiajia: false,
            isZhiding: false,
            createTime: createTime,
            jianjie: e.detail.value.inputVal_jianjie,
            imagesUrlList: imagesUrlList,
            nickName,
            avatarUrl,
          }
        })
        // 返回上一级页面
        wx.navigateBack({
          delta: 1
        })
        wx.hideLoading()
        console.log('提交 论坛 成功res._id：', res3._id);

      } else {
        var resDel = await wx.cloud.deleteFile({
          fileList: deleteFileList,
        })
        wx.showToast({
          title: '图片含违规信息',
          duration: 1000,
          icon: 'error',
          mask: true,
        })
        this.setData({
          isDisabled: false,
        })
        return
      }

    }
  },



  returnPre() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isEditlater: true,
    })
    // 返回上一级页面
    wx.navigateBack({
      delta: 1
    })
    // console.log(this.data.liaotian_id);
  },
  returnPre_add() {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      isAddLater: true,
    })
    // 返回上一级页面
    wx.navigateBack({
      delta: 1
    })
    // console.log(this.data.liaotian_id);
  },

  // 租房
  async toTijiaoSubmit_zufang(e) {
    if (e.detail.value.inputVal_name == '') {
      wx.showToast({
        icon: 'none',
        title: '名称未填',
      })
      return
    }
    if (this.data.huxing == '-请选择-') {
      wx.showToast({
        icon: 'none',
        title: '户型未选',
      })
      return
    }
    if (e.detail.value.inputVal_mianji == '') {
      wx.showToast({
        icon: 'none',
        title: '面积未填',
      })
      return
    }
    if (e.detail.value.inputVal_louceng1 == '' || e.detail.value.inputVal_louceng2 == '') {
      wx.showToast({
        icon: 'none',
        title: '楼层未填',
      })
      return
    }
    if (e.detail.value.inputVal_zujin == '') {
      wx.showToast({
        icon: 'none',
        title: '租金未填',
      })
      return
    }
    if (this.data.zfleixing == '') {
      wx.showToast({
        icon: 'none',
        title: '租房类型未选',
      })
      return
    }
    if (e.detail.value.inputVal_lianxiren == '') {
      wx.showToast({
        icon: 'none',
        title: '联系人未填',
      })
      return
    }
    if (e.detail.value.inputVal_phone == '') {
      wx.showToast({
        icon: 'none',
        title: '电话未填',
      })
      return
    }
    if (this.data.files.length == 0 && !this.data.isEdit) {
      wx.showToast({
        icon: 'none',
        title: '未选择图片',
      })
      return
    }
    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    // var that = this
    var createTime = utils_time.formatTime(new Date())
    var openid = wx.getStorageSync('openid')
    var userinfo = wx.getStorageSync('userinfo')
    var avatarUrl = userinfo.avatarUrl
    var nickName = userinfo.nickName
    var imagesUrlList = []

    var inputVal_name = e.detail.value.inputVal_name
    var inputVal_mianji = e.detail.value.inputVal_mianji
    var inputVal_zujin = e.detail.value.inputVal_zujin
    var inputVal_jianjie = e.detail.value.inputVal_jianjie
    var inputVal_lianxiren = e.detail.value.inputVal_lianxiren
    var inputVal_phone = e.detail.value.inputVal_phone

    // 安全检查
    var content = inputVal_name + inputVal_mianji + inputVal_zujin + inputVal_jianjie + inputVal_lianxiren + inputVal_phone

    var resCheck = await wx.cloud.callFunction({
      name: 'anquancheck',
      data: {
        action: 'msgCheck',
        openid,
        content,
      },
    })
    console.log('安全检查结果：', resCheck);
    if (resCheck.result.result.suggest !== 'pass') {
      wx.showToast({
        title: '发布内容含违规信息',
        duration: 1000,
        icon: 'error',
        mask: true,
      })
      this.setData({
        isDisabled: false,
      })
      return
    }


    if (this.data.isEdit) {
      var huxing = this.data.huxing
      var sheshi = this.data.sheshi
      var louceng = e.detail.value.inputVal_louceng1 + '|' + e.detail.value.inputVal_louceng2 + '层'

      var imagesUrlList = this.data.imagesUrlList
      var deleteFileList = this.data.deleteFileList
      wx.cloud.database().collection('zufang').doc(this.data._id)
        .update({
          data: {
            name: e.detail.value.inputVal_name,
            huxing,
            mianji: e.detail.value.inputVal_mianji,
            louceng,
            louceng1: e.detail.value.inputVal_louceng1,
            louceng2: e.detail.value.inputVal_louceng2,
            sheshi,
            zujin: e.detail.value.inputVal_zujin,
            zfleixing: this.data.zfleixing,
            jianjie: e.detail.value.inputVal_jianjie,
            lianxiren: e.detail.value.inputVal_lianxiren,
            phone: e.detail.value.inputVal_phone,
            imagesUrlList,

            gx_Time: createTime,
          }
        })
        .then(res => {

          wx.cloud.deleteFile({
            fileList: deleteFileList,
          })
          wx.hideLoading()
          this.returnPre()
          console.log('编辑 租房 成功：：：', res);
          // console.log('编辑 租房 删除图片成功：：：', resDel);
        })
    } else {
      var deleteFileList = []

      for (let index = 0; index < this.data.files.length; index++) {
        const tempFilePaths = this.data.files[index];
        // console.log('tempFilePaths', tempFilePaths);
        var iamgeUploadTime = utils_time.formatTimeMeifuhao(new Date())
        var cloudPath = 'zufang/' + openid + 'zufang' + iamgeUploadTime + '-' + index + '.png'
        var res1 = await wx.cloud.uploadFile({ // 上传图片················
          cloudPath: cloudPath,
          filePath: tempFilePaths.url, // 文件路径
        })
        // console.log('上传后的fileID', res.fileID)
        var res2 = await wx.cloud.getTempFileURL({ // 获得文件路径············
          fileList: [{
            fileID: res1.fileID
          }]
        })
        // console.log('用云文件 ID 换取真实链接', res.fileList)
        // 用云文件 ID 换取真实链接，公有读的文件获取的链接不会过期，私有的文件获取的链接十分钟有效期。一次最多取 50 个
        deleteFileList.push(res2.fileList[0].fileID) //备查 有问题则删除

        imagesUrlList.push({
          imagefileID: res2.fileList[0].fileID,
          imagetempFileURL: res2.fileList[0].tempFileURL
        })
      }

      var louceng = e.detail.value.inputVal_louceng1 + '|' + e.detail.value.inputVal_louceng2 + '层'
      var huxing = this.data.huxing
      var sheshi = this.data.sheshi
      var zfleixing = this.data.zfleixing

      // 图片安全检查结果：
      var resImgCheck = await wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'imageCheck',
          deleteFileList,
          // fileID: res2.fileList[0].fileID,
        },
      })
      console.log('图片安全检查结果：', resImgCheck);
      var hasRisky = false
      resImgCheck.result.forEach(element => {
        if (element.errMsg !== 'openapi.security.imgSecCheck:ok') {
          hasRisky = true
        }
      });

      if (hasRisky !== true) {
        console.log('图片未识别到风险');

        var res3 = await wx.cloud.database().collection('zufang').add({
          data: {
            name: e.detail.value.inputVal_name,
            huxing,
            mianji: e.detail.value.inputVal_mianji,
            louceng,
            louceng1: e.detail.value.inputVal_louceng1,
            louceng2: e.detail.value.inputVal_louceng2,

            sheshi,
            zfleixing,
            zujin: e.detail.value.inputVal_zujin,
            jianjie: e.detail.value.inputVal_jianjie,
            lianxiren: e.detail.value.inputVal_lianxiren,
            phone: e.detail.value.inputVal_phone,

            isHege: this.data.isHegeOpen,
            isZhiding: false,
            isXiajia: false,
            createTime: createTime,
            imagesUrlList,
            nickName,
            avatarUrl,
          }
        })
        console.log('提交 [租房] 成功res._id：', res3._id);
        // 返回上一级页面
        wx.navigateBack({
          delta: 1
        })

      } else {
        var resDel = await wx.cloud.deleteFile({
          fileList: deleteFileList,
        })
        wx.showToast({
          title: '图片含违规信息',
          duration: 1000,
          icon: 'error',
          mask: true,
        })
        this.setData({
          isDisabled: false,
        })
        return
      }

    }
  },
  // 兼职 ··········
  toTijiaoSubmit_jianzhi(e) {
    if (e.detail.value.inputVal_name == '') {
      wx.showToast({
        icon: 'none',
        title: '兼职名称未填',
      })
      return
    }
    if (e.detail.value.inputVal_personNum == '') {
      wx.showToast({
        icon: 'none',
        title: '招聘人数未填',
      })
      return
    }
    if (this.data.leixingSelected == null) {
      wx.showToast({
        icon: 'none',
        title: '兼职类型未选',
      })
      return
    }
    if (e.detail.value.inputVal_xinzi == '') {
      wx.showToast({
        icon: 'none',
        title: '兼职薪资未填',
      })
      return
    }
    if (e.detail.value.inputVal_lianxiren == '') {
      wx.showToast({
        icon: 'none',
        title: '联系人未填',
      })
      return
    }
    if (e.detail.value.inputVal_phone == '') {
      wx.showToast({
        icon: 'none',
        title: '联系方式未填',
      })
      return
    }
    if (e.detail.value.inputVal_address == '') {
      wx.showToast({
        icon: 'none',
        title: '工作地址未填',
      })
      return
    }
    if (e.detail.value.inputVal_jianjie == '') {
      wx.showToast({
        icon: 'none',
        title: '工作内容未填',
      })
      return
    }

    this.setData({
      isDisabled: true,
    })
    wx.showLoading({
      title: '上传中..',
    })
    var createTime = utils_time.formatTime(new Date())
    var leixing = this.data.leixingList[this.data.leixingSelected].text
    var openid = wx.getStorageSync('openid')

    var inputVal_name = e.detail.value.inputVal_name
    var inputVal_personNum = e.detail.value.inputVal_personNum
    var inputVal_xinzi = e.detail.value.inputVal_xinzi
    var inputVal_lianxiren = e.detail.value.inputVal_lianxiren
    var inputVal_phone = e.detail.value.inputVal_phone
    var inputVal_address = e.detail.value.inputVal_address
    var inputVal_jianjie = e.detail.value.inputVal_jianjie
    var content = inputVal_name + inputVal_personNum + inputVal_xinzi + inputVal_lianxiren + inputVal_phone + inputVal_address + inputVal_jianjie

    if (this.data.isEdit) {

      // 安全检查
      wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'msgCheck',
          openid, // "openid": 'OPENID',
          content, // "content": 'hello world!'
        },
        success: res => {
          console.log('安全检查结果：', res);
          if (res.result.result.suggest == 'pass') {

            wx.cloud.database().collection('jianzhi').doc(this.data._id)
              .update({ //上传一条记录·············
                data: {
                  name: e.detail.value.inputVal_name,
                  personNum: e.detail.value.inputVal_personNum,
                  leixing,
                  xinzi: e.detail.value.inputVal_xinzi,
                  lianxiren: e.detail.value.inputVal_lianxiren,
                  phone: e.detail.value.inputVal_phone,
                  address: e.detail.value.inputVal_address,
                  jianjie: e.detail.value.inputVal_jianjie,

                  gx_Time: createTime
                }
              })
              .then(res => {
                console.log('编辑 兼职 成功res._id：', res);
                // 返回
                this.returnPre()
              })
              .catch(err => {
                console.log(err);
              })

          } else {
            wx.showToast({
              title: '发布内容违规',
              duration: 1000,
              icon: 'error',
              mask: true,
            })
            this.setData({
              isDisabled: false,
            })
          }
        },
        fail: err => {
          console.log('失败', err);
        }
      })
    } else {

      var userinfo = wx.getStorageSync('userinfo')
      var avatarUrl = userinfo.avatarUrl
      var nickName = userinfo.nickName

      // 安全检查
      wx.cloud.callFunction({
        name: 'anquancheck',
        data: {
          action: 'msgCheck',
          openid, // "openid": 'OPENID',
          content, // "content": 'hello world!'
        },
        success: res => {
          console.log('安全检查结果：', res);
          if (res.result.result.suggest == 'pass') {

            wx.cloud.database().collection('jianzhi').add({ //上传一条记录·············
                data: {
                  name: e.detail.value.inputVal_name,
                  personNum: e.detail.value.inputVal_personNum,
                  leixing,
                  xinzi: e.detail.value.inputVal_xinzi,
                  lianxiren: e.detail.value.inputVal_lianxiren,
                  phone: e.detail.value.inputVal_phone,
                  address: e.detail.value.inputVal_address,
                  jianjie: e.detail.value.inputVal_jianjie,

                  isHege: this.data.isHegeOpen,
                  isZhiding: false,
                  isXiajia: false,
                  createTime: createTime,
                  nickName,
                  avatarUrl,
                }
              })
              .then(res => {
                console.log('发布 兼职 成功res._id：', res._id);
                // 返回上一级页面
                wx.navigateBack({
                  delta: 1
                })
              })
              .catch(err => {
                console.log(err);
              })

          } else {
            wx.showToast({
              title: '发布内容违规',
              duration: 1000,
              icon: 'error',
              mask: true,
            })
            this.setData({
              isDisabled: false,
            })
          }
        },
        fail: err => {
          console.log('失败', err);
        }
      })
    }

    wx.hideLoading()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 时间选择器
    var date = new Date()
    var years = []
    var months = []
    var days = []
    var month = utils_time.formatMonth(new Date())
    var day = utils_time.formatDay(new Date())
    console.log(month,'month');
    console.log(day,'day');
    for (let i = 2020; i <= date.getFullYear(); i++) {
        years.push(String(i))
    }

    for (let i = 1; i <= 12; i++) {
        if (i < 10) {
            i = '0' + i
        }
        months.push(String(i))
    }

    for (let i = 1; i <= 31; i++) {
        if (i < 10) {
            i = '0' + i
        }
        days.push(String(i))
    }
      if (month<10) {
          month = '0'+ month
      }
      if (day<10) {
        day = '0'+ day
      }
      this.setData({
        date,
        years,
        months,
        days,
        month: String(month),
        day: String(day),
        year: String(date.getFullYear()),
        
        
        // val:[]
    })
      
    // console.log('全局变量isHegeOpen',banner_daiqu);
    console.log('添加 页面onLoad 开始传参');
    if (options.addType) {
        console.log('传递的参数是：', options);
        
      if (options.isXunwu) {
        this.setData({
            isXunwu: options.isXunwu,
            val: [years.length - 1, month - 1, day - 1, 0, 0],
        })
      } else if (options.isXunren) {
        this.setData({
            isXunren: options.isXunren,
            val: [years.length - 1, month - 1, day - 1, 0, 0],
        })
      }else if (options.addType == 'pinche') {
          this.setData({
              val: [month - 1, day - 1]
          })
      }
        
      this.setData({
        addType: options.addType,
      })
    }
    if (options.isEdit) {
      this.setData({
        isEdit: options.isEdit
      })
      wx.cloud.database().collection(options.addType).doc(options._id)
        .get()
        .then(res => {
          console.log('下载 编辑数据成功：：', res.data);
          var sheshiList = this.data.sheshiList
          var zfleixingList = this.data.zfleixingList
          if (options.addType == 'zufang') {
            sheshiList.forEach(element => {
              if (res.data.sheshi.includes(element.name)) {
                element.checked = true
              }
            });
            zfleixingList.forEach((element, index) => {
              if (res.data.zfleixing == element.text) {
                this.setData({
                  zfleixingSelected: index
                })
              }
            });
            this.setData({
              huxing: res.data.huxing,
              value_jianjie: res.data.jianjie,
              value_lianxiren: res.data.lianxiren,
              louceng: res.data.louceng,
              value_louceng1: res.data.louceng1,
              value_louceng2: res.data.louceng2,
              value_mianji: res.data.mianji,
              value_name: res.data.name,
              value_phone: res.data.phone,
              value_zujin: res.data.zujin,
              sheshi: res.data.sheshi,
              zfleixing: res.data.zfleixing,
              sheshiList,
              imagesUrlList: res.data.imagesUrlList,
              inputNum: res.data.jianjie.length,

              _id: options._id,

            })
          } else if (options.addType == 'jianzhi') {
            var leixingList = this.data.leixingList
            leixingList.forEach((element, index) => {
              if (res.data.leixing == element.text) {
                this.setData({
                  leixingSelected: index
                })
              }
            });
            this.setData({
              value_name: res.data.name,
              value_personNum: res.data.personNum,
              leixing: res.data.leixing,
              value_xinzi: res.data.xinzi,
              value_lianxiren: res.data.lianxiren,
              value_phone: res.data.phone,
              value_address: res.data.address,
              value_jianjie: res.data.jianjie,

              _id: options._id,

            })
          } else if (options.addType == 'huzhu') {
            this.setData({
              value_lianxi: res.data.lianxi,
              value_jianjie: res.data.jianjie,

              _id: options._id,
            })
          } else if (options.addType == 'jiaoyou') {
            this.setData({
              imagesUrlList: res.data.imagesUrlList,
              inputNum: res.data.jianjie.length,
              value_jianjie: res.data.jianjie,
              _id: options._id,
            })
          } else if (options.addType == 'xunwu') {
            var length = res.data.name.length + 1
            var jianjie = res.data.jianjie.slice(length, res.data.jianjie.length)
            var val = res.data.shijianValue
            var year = this.data.years[val[0]]
            var month = this.data.months[val[1]]
            var day = this.data.days[val[2]]
            var daytime = this.data.daytimes[val[3]]
            var time = this.data.times[val[4]]
            if (options.isXunwu) {
              this.setData({
                value_name: res.data.name,
                val: res.data.shijianValue,
                value_didian: res.data.didian,
                value_lianxi: res.data.lianxi,
                value_jianjie: jianjie,
                inputNum: res.data.jianjie.length,
                year,
                month,
                day,
                daytime,
                time,

                imagesUrlList: res.data.imagesUrlList,
                _id: options._id,
              })
            } else if (options.isXunren) {
              this.setData({
                value_name: res.data.name,
                val: res.data.shijianValue,
                value_didian: res.data.didian,
                value_lianxi: res.data.lianxi,
                value_jianjie: jianjie,
                inputNum: res.data.jianjie.length,
                year,
                month,
                day,
                daytime,
                time,

                imagesUrlList: res.data.imagesUrlList,
                _id: options._id,
              })
            }
          } else if (options.addType == 'pinche') {
            var length = res.data.xingch.length + 1
            var jianjie = res.data.jianjie.slice(length, res.data.jianjie.length)
            var shijian = res.data.shijian
            var yue_index = shijian.indexOf('月') + 1
            var ri_index = shijian.indexOf('日') + 1
            var month = Number(shijian.slice(0, yue_index - 1))
            var day = Number(shijian.slice(yue_index, ri_index - 1))
            // value= [ month - 1, day - 1],
            shijian = shijian.slice(ri_index, shijian.length)
            this.setData({
              value_jianjie: jianjie,
              value_xingch_start: res.data.xingch_start,
              value_xingch_end: res.data.xingch_end,
              value_shijian: shijian,
              value_personNum: res.data.personNum,
              value_lianxi: res.data.lianxi,
              month,
              day,
              val: [month - 1, day - 1],

              _id: options._id,
            })
          } else if (options.addType == 'bigthings') {
            // var length = res.data.name.length + 1
            // var jianjie = res.data.jianjie.slice(length, res.data.jianjie.length)
            var jianjie = res.data.jianjie
            var video_fileid = res.data.video_fileid
            var imagesUrlList = res.data.imagesUrlList
            var audio = res.data.audio
            var audio_name = audio.name
            var audio_path = audio.fileid
            if (video_fileid !== '') {
              var isVideo = true
              var isImage = false
              var isAudio = false
            } else if (imagesUrlList.length !== 0) {
              var isVideo = false
              var isImage = true
              var isAudio = false
            } else if (audio_path !== '') {
              var isVideo = false
              var isImage = false
              var isAudio = true
            }
            this.setData({
              inputNum: res.data.jianjie.length,
              value_jianjie: jianjie,
              value_name: res.data.name,

              audio_name,
              audio_path,
              imagesUrlList,
              video_fileid,
              isVideo,
              isImage,
              isAudio,

              _id: options._id,
            })
          } else if (options.addType == 'luntan') {
            this.setData({
              imagesUrlList: res.data.imagesUrlList,
              inputNum: res.data.jianjie.length,
              value_jianjie: res.data.jianjie,

              _id: options._id,
            })
          } else if (options.addType == 'huangye') {
            var length = res.data.name.length + 1
            var jianjie = res.data.jianjie.slice(length, res.data.jianjie.length)
            var leibieList = this.data.leibieList
            leibieList.forEach((element, index) => {
              if (res.data.leibie == element.text) {
                this.setData({
                  leibieSelected: index
                })
              }
            });
            this.setData({
              value_name: res.data.name,
              value_phone: res.data.phone,
              value_address: res.data.address,
              value_jianAddress: res.data.jianAddress,
              leibie: res.data.leibie,
              inputNum: res.data.jianjie.length,
              value_jianjie: jianjie,
              imagesUrlList: res.data.imagesUrlList,
              _id: options._id,
            })
          } else if (options.addType == 'ershou') {
            this.setData({
              value_jiage: res.data.jiage,
              imagesUrlList: res.data.imagesUrlList,
              inputNum: res.data.jianjie.length,
              value_jianjie: res.data.jianjie,
              _id: options._id,
            })
          }
        })

    }
    // 图片上传
    this.setData({
      selectFile: this.selectFile.bind(this),
    })

    // 获取提醒 地点选择列表 等
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数 toptipsdaiqu：：', res.data);
        this.setData({
          val_jifen: res.data.jifen.val_jifen_qiang,
          isHegeOpen: res.data.isHegeOpen,
          isHegeOpen_huangye: res.data.isHegeOpen_huangye,
        })
      })
      .catch(err => {
        console.log('后台主参数 toptipsdaiqu：： 失败', err);
      })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // console.log(onUnload);

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