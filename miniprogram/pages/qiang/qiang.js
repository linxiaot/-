Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner_kebiao: {},

    guangGaoList: [],
    yulanImageList: [],
    bannerOpen_shouye: true,
    bannerOpen_shouye_ad: false,

    tuijian_list: [{
        text: '黄页',
        fabuType: 'huangye',
        checked: true
      }, {
        text: '失物招领',
        fabuType: 'xunwu',
      }, {
        text: '校园拼车',
        fabuType: 'pinche',
      }, {
        text: '跳蚤市场',
        fabuType: 'ershou',
      },
      // {
      // text: '校园互助',
      // fabuType: 'huzhu',
      // }
    ],

    tuijianList: [],
    tuijianlist_all: [],
    tuijianlist_huangye: [],
    tuijianlist_xunwu: [],
    tuijianlist_pinche: [],
    tuijianlist_ershou: [],
    tuijianlist_huzhu: [],
    fabuType: 'zufang',
    isNoMore: false,

  }, 

  toYulanImage(e) {
    console.log('预览图片', e);
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls: this.data.yulanImageList // 需要预览的图片http链接 列表
    })
  },

  // 列表详情
  toDetail(e) {
    var _id = e.currentTarget.dataset.id
    var _openid = e.currentTarget.dataset.openid
    var fabuType = e.currentTarget.dataset.fabutype
    wx.navigateTo({
      url: '../qiang/huangye/xiangqing2/xiangqing2?' +
        '&detailType=' + fabuType +
        '&_openid=' + _openid +
        '&_id=' + _id
    })
  },

  async loadTuijian() {

    var tuijianlist_all = []
    var tuijian_list = this.data.tuijian_list

    for (let index = 0; index < tuijian_list.length; index++) {
      const element = tuijian_list[index];
      var fabuType = element.fabuType
      var res = await wx.cloud.database().collection(fabuType)
        .where({
          isHege: true,
          isXiajia: false,
        })
        // .orderBy('isXiajia', 'asc')
        // .orderBy('isZhiding', 'desc')
        .orderBy('createTime', 'desc')
        // .skip(0)
        .get() //获取根据查询条件筛选后的集合数据  

      console.log('下载的订单列表' + fabuType + '为：', res.data)
      var list = 'tuijianlist_' + fabuType
      var resdatalist = res.data.slice(0, 2)
      if (res.data.length !== 0) {
        this.setData({
          [list]: resdatalist
        })
      }
      res.data.forEach(element => {
        var createTime1 = element.createTime.slice(0, 10).split('-').join('')
        var createTime2 = element.createTime.slice(11, 19).split(':').join('')
        element.createTimeformat = createTime1 + createTime2
        element.fabuType = fabuType
        tuijianlist_all.push(element)
      });
    }
    var tuijianlist_all_sort = tuijianlist_all.sort(function (a, b) {
      return b.createTimeformat - a.createTimeformat
    });

    this.setData({
      tuijianlist_all: tuijianlist_all_sort,
    })

  },

  // loadmore(fabuType) {
  //   console.log('页面触底');
  //   var tuijianList = this.data.tuijianList
  //   var pageNum = this.data.pageNum + 1
  //   wx.showLoading({
  //     title: 'loading',
  //   })
  //   wx.cloud.database().collection(fabuType).where({
  //       isHege: true,
  //       isXiajia: false,

  //     })
  //     .orderBy('createTime', 'desc')
  //     .skip((pageNum - 1) * 20)
  //     .get()
  //     .then(res => {
  //       if (res.data.length == 0) {
  //         // wx.showToast({
  //         //   title: '暂无数据',
  //         //   icon: 'none',
  //         // })
  //         this.setData({
  //           isNoMore: true
  //         })
  //         wx.hideLoading({})
  //       } else {
  //         wx.hideLoading({})

  //         res.data.forEach(element => {
  //           tuijianList.push(element)
  //         });
  //         console.log('当前下载tuijianList第' + pageNum + '页：', tuijianList)
  //         this.setData({
  //           tuijianList,
  //           pageNum,
  //         })
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })

  // },


  jianshezhong() {
    wx.showToast({
      icon: 'none',
      title: '建设中，敬请期待',
    })
  },
  //跳转到 kebiao
  toKebiao: function () {
    // this.jianshezhong()
    var xiaoli_date = this.data.banner_kebiao.xiaoli_date
    var xiaoli_zhoushu = this.data.banner_kebiao.xiaoli_zhoushu
    console.log(xiaoli_date, xiaoli_zhoushu);
    wx.navigateTo({
      url: '../qiang/kebiao/kebiao?' +
        'xiaoli_date=' + xiaoli_date +
        '&xiaoli_zhoushu=' + xiaoli_zhoushu,
    })
  },
  //跳转到 huangye
  toHuangye: function () {
    wx.navigateTo({
      url: '../qiang/huangye/huangye',
    })
  },
  //跳转到 寻物
  toXunWu: function () {
    wx.navigateTo({
      url: '../qiang/xunwu/xunwu',
    })
  },
  //跳转到 招领
  toZhaoLing: function () {
    wx.navigateTo({
      url: '../qiang/zhaoling/zhaoling',
    })
  },
  //跳转到 拼车
  toPinChe: function () {
    wx.navigateTo({
      url: '../qiang/pinche/pinche',
    })
  },
  //跳转到 兼职
  toJianZhi: function () {
    wx.navigateTo({
      url: '../qiang/jianzhi/jianzhi',
    })
  },
  //跳转到 二手
  toErShou: function () {
    wx.navigateTo({
      url: '../qiang/ershou/ershou',
    })
  },
  //跳转到 互助
  toHuZhu: function () {
    // this.jianshezhong()

    wx.navigateTo({
      url: '../qiang/huzhu/huzhu',
    })
  },
  //跳转到 校园大事件
  toBigthings: function () {
    // this.jianshezhong()

    wx.navigateTo({
      url: '../qiang/bigthings/bigthings',
    })
  },
  //跳转到 论坛
  toLuntan: function () {
    wx.navigateTo({
      url: '../qiang/luntan/luntan',
    })
  },
  //跳转到 交友
  toJiaoyou: function () {
    wx.navigateTo({
      url: '../qiang/jiaoyou/jiaoyou',
    })
  },

  // 监听全局变量
  watchBack: function (isNewmessage) {
    wx.showTabBarRedDot({
      index: 2,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    getApp().watch(that.watchBack)

    // 获取广告src
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数banner：：', res.data);
        var guangGaoList = res.data.shouyeBanner
        var bannerOpen_shouye = res.data.bannerOpen_shouye
        var bannerOpen_shouye_ad = res.data.bannerOpen_shouye_ad
        var yulanImageList = []
        guangGaoList.forEach(element => {
          yulanImageList.push(element.src)
        });
        this.setData({
          yulanImageList,
          guangGaoList,
          bannerOpen_shouye,
          bannerOpen_shouye_ad,
        })
      })
      .catch(err => {
        console.error(err);
      })

    this.loadTuijian()

    wx.cloud.database().collection('banner').doc('kebiao0001')
      .get()
      .then(res => {
        console.log('后台主参数 kebiao0001::', res.data);
        this.setData({
          banner_kebiao: res.data
        })
      })
      .catch(err => {
        console.log('后台主参数 kebiao0001:: 失败', err);
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
    var isNewmessage = wx.getStorageSync('isNewmessage')
    if (isNewmessage) {
      wx.showTabBarRedDot({
        index: 2,
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

  }
})