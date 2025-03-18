// pages/shouye/shouye.js
var utils_time = require('../../utils/time.js')
var audioCIAC = wx.createInnerAudioContext()
var app = getApp()
var todayNianyueri = app.globalData.todayNianyueri
// wx.cloud.init({env:'hnkjdx-9ge75aru1db3a094'})
const db = wx.cloud.database()
var xingjisrc1 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing1.png'
var xingjisrc2 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing2.png'
var xingjisrc3 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing3.png'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ceshiurl:'https://786d-xmf-0g87mzf198205ada-1305629196.tcb.qcloud.la/%E8%9C%82%E8%9C%82%E6%A0%A1%E5%9B%AD%E5%85%AC%E4%BC%97%E5%8F%B7%E4%BA%8C%E7%BB%B4%E7%A0%81.jpg?sign=8106c88381331940446df8d838938542&t=1694076805',
    guanzhuurl:'../../images/guanzhu.jpg',
    isOpen_meishi:false,
    guangbo_text:'一个人活着就是为了让更多的人更好的活着！一个人活着就是为了让更多的人更好的活着！',

    url_2: 'https://xmf-0g87mzf198205ada-1305629196.tcloudbaseapp.com/%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%85%8D%E7%BD%AE%E5%9B%BE%E7%89%87/xiaomifeng.png?sign=40491ed53b44b741a37b2b634d977410&t=1618583872',
    // isNewmessage:false,

    guangGaoList: [],
    yulanImageList: [],
    bannerOpen_shouye: true,
    bannerOpen_shouye_ad: false,
    isPaotuiOpen: true,

    tuijian_list: [
      {
      text: '牛牯塘',
      fabuType: 'bigthings',
      checked: true
      },
      {
      text: '房屋租赁',
      fabuType: 'zufang',

      },
      {
      text: '兼职招聘',
      fabuType: 'jianzhi',
      },
      {
      text: '美食',
      fabuType: 'meishi',
      },
    ],

    tuijianList: [],
    fabuType: 'bigthings',
    isNoMore: false,

    categoryHeight: [],
    pageNum: 1,

    isPlay: false,
    duration: '00:00',
    currentTime: '00:00',
    percent: 0,
    audioShowed: false,
    audio: '',
    oneButton: [{
      text: '退出播放'
    }],

    pageNum: 1,
    shangjiaList: [],
    timeSys:'',

    //是否显示关注图片
    isShowGuanzhu:false,
    isShowMa:false,

  },



  ShowMa(e){
    console.log('ShowMa:::',e);
    var {isShowMa} = this.data
    this.setData({isShowMa:!isShowMa})
  },
  showGuanzhu(e){
    console.log('ShowGuanzhu:::',e);
    var {isShowGuanzhu} = this.data
    this.setData({isShowGuanzhu:!isShowGuanzhu})
  },
  // 是否展示了关注公众号组件
  isLoaderr(e){
    console.log('isLoaderr:::',e);

    // this.setData({isShowGuanzhu:false})

  },
  isLoad(e){
    console.log('isLoad:::',e);

    this.setData({isShowGuanzhu:false})

  },

  toxiuxi_tongzhi() {
    wx.showToast({
      title: '店铺休息中..',
      icon:'none'
    })
  },
  checkYingye(peisongTime) {
    var time1 = peisongTime.time1
    var time2 = peisongTime.time2
    var timeSys = this.data.timeSys
    if (timeSys > time1 && timeSys < time2) {
      var isYingye = true
    }
    return isYingye
  },
  toDianpu(e) {
    // console.log(e);
    var _id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: './meishi/meishi?_id=' + _id,
    })
  },
  toDetail_meishi(e) {
    var index_a = e.currentTarget.dataset.index_a
    var index_b = e.currentTarget.dataset.index_b
    var _id = e.currentTarget.dataset.id
    console.log(_id, index_a, index_b);

    wx.navigateTo({
      url: '../shangjia/sjmeishidetail/sjmeishidetail?_id=' + _id +
        '&isDetail_meishi=true' +
        '&index_a=' + index_a +
        '&index_b=' + index_b,
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

  toShowAudio(e) {
    var audio = e.currentTarget.dataset.audio
    this.setData({
      audioShowed: true,
      audio,
      percent: 0,
      currentTime: '00:00',
    })
    this.audioPlay()
  },
  toCloseAudio() {
    this.audioStop()
    this.setData({
      audioShowed: false,
    })
  },

  formatTime(time) {
    var minute = Math.floor(time / 60) % 60;
    var second = Math.floor(time) % 60
    return (minute < 10 ? '0' + minute : minute) + ':' +
      (second < 10 ? '0' + second : second)
  },

  audioPlay(e) {
    // audioCIAC.destroy()
    // var audioCIAC = wx.createInnerAudioContext()
    audioCIAC.src = this.data.audio.fileid
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
    }, 1000);

    this.setData({
      isPlay: true,
    })
  },
  audioPause(e) {
    // audioCIAC.src = e.currentTarget.dataset.src
    audioCIAC.pause()
    this.setData({
      isPlay: false,
    })
  },

  audioTuodong(e) {
    // console.log(e);
    var percent = e.detail.value
    var currentTime = this.formatTime(percent / 100 * audioCIAC.duration)
    audioCIAC.seek(percent)
    this.setData({
      currentTime
    })
  },
  audioStart() {
    audioCIAC.seek(0)
  },
  audioStop() {
    audioCIAC.stop()
    this.setData({
      isPlay: false,
    })
  },

  // chaxunJiedian() {
  //   return new Promise((resolve) => {
  //     // 查询节点信息
  //     var categoryHeight = []
  //     wx.createSelectorQuery()
  //       .selectAll('.pengyq')
  //       .boundingClientRect(res => {
  //         console.log('节点信息', res);
  //         var top = res[0].top
  //         res.forEach((element, i) => {
  //           // var height_item = element.top - top
  //           var height_item = element.top
  //           categoryHeight.push(height_item)
  //         });
  //         this.setData({
  //           categoryHeight,
  //         })
  //       })
  //       .exec()
  //     resolve()
  //   })
  // },

  toLike(e) {
    console.log(e);
    var login_ok = wx.getStorageSync('login_ok')
    var item = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    console.log(index);

    var isLike = item.isLike == true ? false : true
    var openid = wx.getStorageSync('openid')
    var userId = wx.getStorageSync('id')
    var _id = e.currentTarget.dataset.id
    var dianzanTime = utils_time.formatTime(new Date())
    var detailType = 'bigthings'
    var dianzan = {
      dianzanTime: dianzanTime,
      openid: openid,
      isLike,
    }
    if (login_ok) {
      console.log('点赞······');

      // 点赞后分两步：1.存在data中
      var tuijianList = this.data.tuijianList
      var element = tuijianList[index]
      if (element.dianzan.length !== 0) { // 有点赞记录
        // console.log(item.dianzanIndex);
        if (item.dianzanIndex !== undefined) { //点过赞
          console.log('点过赞');
          var dianzanNum = element.dianzanNum
          if (isLike == true) {
            dianzanNum += 1
          } else {
            dianzanNum -= 1
          }
          element.dianzanNum = dianzanNum
          element.isLike = isLike
          // element.isDianzan = true
          // element.dianzanIndex = element.dianzan.length
          // element.dianzan.push(dianzan)
          element.dianzan[item.dianzanIndex] = dianzan
          this.setData({
            tuijianList,
          })
        } else { //没点过赞
          var dianzanNum = element.dianzanNum
          element.dianzanNum = dianzanNum + 1
          element.isDianzan = true
          element.isLike = isLike
          element.dianzanIndex = element.dianzan.length
          element.dianzan.push(dianzan)
          this.setData({
            tuijianList,
          })
        }
      } else { //没有任何点赞记录时点赞
        console.log('没有任何点赞记录');
        var dianzanNum = 1
        element.isDianzan = true

        element.dianzanNum = dianzanNum
        element.isLike = isLike
        element.dianzanIndex = element.dianzan.length
        element.dianzan.push(dianzan)
        this.setData({
          tuijianList,
        })
      }

      // 点赞后分两步：2.上传服务器  
      wx.cloud.callFunction({
          name: 'liuyan',
          data: {
            like_new: true,
            _id,
            detailType,
            dianzan,
            isDianzan: item.isDianzan, //是否点赞过
            // isDianzan: false, //是否点赞过
            dianzanIndex: item.dianzanIndex,
            isLike,
            userId,
            todayNianyueri,
            nowTime: dianzanTime,
          }
        })
        .then(res => {
          console.log('点赞 成功 res', res);

          // this.loadTuijian(this.data.fabuType)
          // var scrollTop = this.data.categoryHeight[index]
          // setTimeout(() => {
          //   wx.pageScrollTo({
          //     scrollTop,
          //     duration: 0,
          //   })
          // }, 800);

        })
        .catch(err => {
          console.log('点赞 失败 err', err);
        })
    } else {
      utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
    }
  },

  // 去搜索页
  toSearch() {
    console.log('跳转搜索页');
    wx.navigateTo({
      url: '../search/search?' +
        '&searchType=shouye'
    })
  },


  toYulanImageCeshi(e) {
    console.log('预览图片', e);
    // var current = e.currentTarget.dataset.src
    // var current = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/wode/daiqu.png'
    var current = this.data.ceshiurl
    wx.previewImage({
      // current, // 当前显示图片的http链接
      // urls: this.data.yulanImageList // 需要预览的图片http链接 列表
      current, // 当前显示图片的http链接
      urls: [current] // 需要预览的图片http链接 列表
    }).then(res=>{console.log(res);}).catch(err=>{console.log(err);})
  },
  toYulanImage(e) {
    console.log('预览图片', e);
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: this.data.yulanImageList // 需要预览的图片http链接 列表

    })
  },

  toYulanImage2(e) {
    console.log('预览图片', e);
    var current = e.currentTarget.dataset.src
    var list = e.currentTarget.dataset.list
    var urls = []
    list.forEach(element => {
      urls.push(element.imagetempFileURL)
    });
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls, // 需要预览的图片http链接 列表
    })
  },



  // 签到跳转
  toQiandao_shouye() {
    wx.switchTab({
      url: '../wode/wode',
    })
  },

  // 列表详情
  toDetail(e) {
    var _id = e.currentTarget.dataset.id
    var _openid = e.currentTarget.dataset.openid
    var fabuType = this.data.fabuType
    wx.navigateTo({
      url: '../qiang/huangye/xiangqing2/xiangqing2?' +
        '&detailType=' + fabuType +
        '&_openid=' + _openid +
        '&_id=' + _id
    })
  },

  jianshezhong() {
    wx.showToast({
      icon: 'none',
      title: '建设中，敬请期待',
    })
  },

  tapTuijian(e) {
    console.log('tapTuijian::', e.currentTarget.dataset.item);
    // var index = e.currentTarget.dataset.index
    var item = e.currentTarget.dataset.item
    var tuijian_list = this.data.tuijian_list
    tuijian_list.forEach(element => {
      if (element.text == item.text) {
        element.checked = true
      } else {
        element.checked = false
      }
    });
    if (item.text == '美食') {
      if (this.data.isOpen_meishi) {
        this.load_dianpu()
        
      } else {
        this.jianshezhong()
        
      }
    } else {
      this.loadTuijian(item.fabuType)
    }

    this.setData({
      tuijian_list,
      fabuType: item.fabuType
    })

  },

  loadTuijian(fabuType) {
    var userOpenid = wx.getStorageSync('openid')
    var tenant_id = wx.getStorageSync('tenant_id')

    this.setData({
      tuijianList: [],
      pageNum: 1
    })
    wx.cloud.database().collection(fabuType)
      .where({
        isHege: true,
        isXiajia: false,
        tenant_id: tenant_id
      })
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        console.log('下载的列表 ' + fabuType + ' 为：', res.data)
        if (res.data.length !== 0) {
          if (fabuType == 'bigthings') {
            res.data.forEach(element => {
              if (element.dianzan.length !== 0) {
                var dianzanNum = 0
                var dianzan = element.dianzan
                for (let index = 0; index < dianzan.length; index++) {
                  const element2 = dianzan[index];
                  if (element2.openid == userOpenid) {
                    element.isDianzan = true
                    element.dianzanIndex = index
                    element.isLike = element2.isLike
                  } else {
                    element.isDianzan = false
                  }
                  if (element2.isLike) {
                    dianzanNum += 1
                  }
                }
                element.dianzanNum = dianzanNum
              } else {
                element.isDianzan = false
              }
            });
          }
          this.setData({
            tuijianList: res.data,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },

  loadmore(fabuType) {
    console.log('页面触底');
    var tuijianList = this.data.tuijianList
    var pageNum = this.data.pageNum + 1
    var tenant_id = wx.getStorageSync('tenant_id')
    wx.showLoading({
      title: 'loading',
    })
    wx.cloud.database().collection(fabuType).where({
        isHege: true,
        isXiajia: false,
        tenant_id: tenant_id
      })
      .orderBy('createTime', 'desc')
      .skip((pageNum - 1) * 20)
      .get()
      .then(res => {
        if (res.data.length == 0) {
          this.setData({
            isNoMore: true
          })
          wx.hideLoading({})
        } else {
          wx.hideLoading({})
          if (fabuType == 'bigthings') {
            res.data.forEach(element => {
              if (element.dianzan.length !== 0) {
                var dianzanNum = 0
                var dianzan = element.dianzan
                for (let index = 0; index < dianzan.length; index++) {
                  const element2 = dianzan[index];
                  if (element2.openid == userOpenid) {
                    element.isDianzan = true
                    element.dianzanIndex = index
                    element.isLike = element2.isLike
                  } else {
                    element.isDianzan = false
                  }
                  if (element2.isLike) {
                    dianzanNum += 1
                  }
                }
                element.dianzanNum = dianzanNum
              } else {
                element.isDianzan = false
              }
              tuijianList.push(element)
            });
          } else {
            res.data.forEach(element => {
              tuijianList.push(element)
            });
          }
          console.log('当前下载tuijianList第' + pageNum + '页：', tuijianList)
          this.setData({
            tuijianList,
            pageNum,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },

  load_dianpu() {
    var tenant_id = wx.getStorageSync('tenant_id')
    wx.showLoading({
      title: 'loading',
    })
    db.collection('shangjia').where({
        isDianpuOpen: true,
        tenant_id: tenant_id
      })
      .orderBy('xingji', 'desc')
      .get()
      .then(res => {
        wx.hideLoading({})
        if (res.data.length == 0) {
          this.setData({
            isNoMore: true
          })
        } else {
          res.data.forEach(element => {
            element.isYingye = this.checkYingye(element.peisongTime)
            element.xingji_list = this.showXingji(element.xingji)
          });
          this.setData({
            shangjiaList:res.data,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  loadmore_dianpu() {
    var pageNum = this.data.pageNum + 1
    var shangjiaList = this.data.shangjiaList
    var tenant_id = wx.getStorageSync('tenant_id')
    wx.showLoading({
      title: 'loading',
    })
    db.collection('shangjia').where({
        isDianpuOpen: true,
        tenant_id: tenant_id
      })
      .skip((pageNum - 1) * 20)
      .get()
      .then(res => {
        wx.hideLoading({})
        if (res.data.length == 0) {
          this.setData({
            isNoMore: true
          })
        } else {
          res.data.forEach(element => {
            element.xingji_list = this.showXingji(element.xingji)
            element.isYingye = this.checkYingye(element.peisongTime)
            shangjiaList.push(element)
          });
          this.setData({
            shangjiaList,
            pageNum,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },



  //跳转到代取下单
  toDaiQu: function () {
    wx.navigateTo({
      url: '../shouye/daiqu/daiqu',
    })
  },
  //跳转到寄走下单
  toJiZou: function () {
    wx.navigateTo({
      url: '../shouye/jizou/jizou',
    })
  },

  toPaotui: function () {
    var isPaotuiOpen = this.data.isPaotuiOpen
    // console.log(banner_daiqu.isPaotuiOpen);
    if (isPaotuiOpen == true) {
      wx.navigateTo({
        url: '../shouye/paotui/paotui',
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '暂停使用',
      })
    }
  },

  toZufang: function () {
    wx.navigateTo({
      url: '../shouye/zufang/zufang',
    })
  },

  toGanxi: function () {
    wx.navigateTo({
      url: '../shouye/ganxi/ganxi',
    })
  },

  toJianzhi: function () {
    wx.navigateTo({
      url: '../shouye/jianzhi/jianzhi',
    })
  },
  toMeishi: function () {
    wx.navigateTo({
      url: '../shouye/dianpu/dianpu',
      // url: '../shouye/shangjia/shangjia',
    })
  },
  toQita: function () {
    wx.navigateTo({
      url: '../shouye/qita/qita',
    })
  },


  // 显示二维码图片
  erWeima() {
    wx.previewImage({
      current: this.data.url_2, // 当前显示图片的http链接
      urls: [this.data.url_2] // 需要预览的图片http链接列表
    })
  },

  watchBack: function (isNewmessage) {
    wx.showTabBarRedDot({
      index: 2,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onload');
    var that = this
    getApp().watch(that.watchBack)
    // console.log(2222);

    // 获取广告src
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数banner：：', res.data);
        var guangGaoList = res.data.shouyeBanner
        var bannerOpen_shouye = res.data.bannerOpen_shouye
        var bannerOpen_shouye_ad = res.data.bannerOpen_shouye_ad
        var isPaotuiOpen = res.data.isPaotuiOpen
        var guangbo_text = res.data.guangbo_text
        var yulanImageList = []
        guangGaoList.forEach(element => {
          yulanImageList.push(element.src)
        });
        this.setData({
          guangGaoList,
          yulanImageList,
          bannerOpen_shouye,
          bannerOpen_shouye_ad,
          isPaotuiOpen,
          guangbo_text,
        })
      })
      .catch(err => {
        console.error(err);
      })
    


    this.loadTuijian('bigthings')

    var timeSys = utils_time.formatTime(new Date()).slice(11, 16)
    console.log(timeSys, 'timeSys');
    this.setData({
      timeSys
    })

  },


  onReady: function () {

  },


  onShow: function () {
    var isNewmessage = wx.getStorageSync('isNewmessage')
    if (isNewmessage) {
      wx.showTabBarRedDot({
        index: 2,
      })
    }
    // this.loadTuijian(this.data.fabuType)
    
    db.collection('banner').doc('meishidata0001').get().then(res => {
      console.log('后台主参数 meishi', res.data);
      var isOpen_meishi = res.data.isOpen_meishi
      this.setData({
        isOpen_meishi,
      })
      var gzhOpenid = wx.getStorageSync('gzhOpenid')
      if (gzhOpenid) {
        console.log('关闭关注提示框');
        this.setData({isShowGuanzhu:false})
      }else{
        this.setData({isShowGuanzhu:true})
      }
    })
    // if (!isOpen_meishi) {
    //   var e = {currentTarget:{dataset:{item:'牛牯塘'}}}
    //   this.tapTuijian(e)
    // }

      // var e = {currentTarget:{dataset:{item:'牛牯塘'}}}
      // this.tapTuijian(e)

    
  },

  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {

  },

  onReachBottom: function () {
    if (this.data.fabuType == 'meishi') {
      this.loadmore_dianpu()
    } else {
      this.loadmore(this.data.fabuType)
      
    }
  },


  onShareAppMessage: function () {

  }
})