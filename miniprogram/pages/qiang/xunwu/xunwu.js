// pages/qiang/xunwu/xunwu.js
var utils_toShouQuan = require('../../../utils/toShouQuan.js') //获取 是否登录 login_ok
var url = '../../wode/ziliao/ziliao'
Page({
  // mixins: [require('../../mixin/themeChanged')],
  data: {
    xunWuList: [],
    xunRenList: [],
    isXunwu: true,
    isXunren: false,
    pageNum: 1,
  },

  // 搜索框

  toSearch() {
    console.log('跳转搜索页');
    wx.navigateTo({
      url: '../../search/search?' +
        '&searchType=xunwu' +
        '&isXunwu=' + this.data.isXunwu +
        '&isXunren=' + this.data.isXunren
    })
  },

  tapXunwu() {
    this.setData({
      isXunwu: true,
      isXunren: false,
      // // 点击 寻物 的时候 寻人 的列表要清空
      xunRenList: [],
      pageNum:1
    })
    wx.cloud.database().collection('xunwu')
      .where({
        isHege: true,
        isXunwu: true,
      })
      .orderBy('isXiajia', 'asc')
      .orderBy('isZhiding', 'desc')
      .orderBy('createTime', 'desc')
      // .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 xunWuList 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            xunWuList: res.data,
            // isZanWu: true
          })
        } else {
          this.setData({
            xunWuList: res.data,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  },
  tapXunren() {
    this.setData({
      isXunwu: false,
      isXunren: true,
      // // 点击 寻物 的时候 寻人 的列表要清空
      xunWuList: [],
      pageNum:1
    })
    wx.cloud.database().collection('xunwu')
      .where({
        isHege: true,
        isXunren: true,
      })
      .orderBy('isXiajia', 'asc')
      .orderBy('isZhiding', 'desc')
      .orderBy('createTime', 'desc')
      // .skip(0)
      .get() //获取根据查询条件筛选后的集合数据  
      .then(res => {
        console.log('下载的订单列表 xunRenList 为：', res.data)
        if (res.data.length == 0) {
          this.setData({
            xunRenList: res.data,
            // isZanWu: true
          })
        } else {
          this.setData({
            xunRenList: res.data,
          })
        }
      })
      .catch(err => {
        console.error(err)
      })

  },

  toPaixu() {
    let {
      xunWuList
    } = this.data
    xunWuList.reverse()
    this.setData({
      xunWuList
    })
  },

  // toDetail111(e) {
  //   // var id = e.currentTarget.dataset.id
  //   var index = e.currentTarget.dataset.index
  //   if (this.data.isXunwu) {
  //     var xunWuList = this.data.xunWuList
  //   }else if (this.data.xunRenList) {
  //     var xunWuList = this.data.xunRenList
  //   }
  //   var isXunren = this.data.isXunren
  //   var isXunwu = this.data.isXunwu
  //   var didian = xunWuList[index].didian
  //   var _id = xunWuList[index]._id
  //   var createTime = xunWuList[index].createTime
  //   var name = xunWuList[index].name
  //   var avatarUrl = xunWuList[index].avatarUrl
  //   var nickName = xunWuList[index].nickName
  //   var lianxi = xunWuList[index].lianxi
  //   var shijian = xunWuList[index].shijian
  //   var jianjie = xunWuList[index].jianjie
  //   var length = xunWuList[index].imagesUrlList.length
  //   var src0 = xunWuList[index].imagesUrlList[0].imagetempFileURL
  //   // var src3 = xunWuList[index].imagesUrlList[3].imagetempFileURL
  //   // var src4 = xunWuList[index].imagesUrlList[4].imagetempFileURL
  //   if (length == 2) {
  //     var src1 = xunWuList[index].imagesUrlList[1].imagetempFileURL
  //   }
  //   if (length == 3) {
  //     var src1 = xunWuList[index].imagesUrlList[1].imagetempFileURL
  //     var src2 = xunWuList[index].imagesUrlList[2].imagetempFileURL
  //   }
  //   if (length == 4) {
  //     var src1 = xunWuList[index].imagesUrlList[1].imagetempFileURL
  //     var src2 = xunWuList[index].imagesUrlList[2].imagetempFileURL
  //     var src3 = xunWuList[index].imagesUrlList[3].imagetempFileURL
  //   }
  //   if (length == 5) {
  //     var src1 = xunWuList[index].imagesUrlList[1].imagetempFileURL
  //     var src2 = xunWuList[index].imagesUrlList[2].imagetempFileURL
  //     var src3 = xunWuList[index].imagesUrlList[3].imagetempFileURL
  //     var src4 = xunWuList[index].imagesUrlList[4].imagetempFileURL
  //   }
  //   wx.navigateTo({
  //     url: '../huangye/xiangqing2/xiangqing2?' +
  //       '&detailType=' + 'xunwu' +
  //       '&_id=' + _id +
  //       '&name=' + name +
  //       '&lianxi=' + lianxi +
  //       '&didian=' + didian +
  //       '&shijian=' + shijian +
  //       '&jianjie=' + jianjie +
  //       '&avatarUrl=' + avatarUrl +
  //       '&nickName=' + nickName +
  //       '&src0=' + src0 +
  //       '&src1=' + src1 +
  //       '&src2=' + src2 +
  //       '&src3=' + src3 +
  //       '&src4=' + src4 +
  //       '&isXunwu=' + isXunwu +
  //       '&isXunren=' + isXunren +
  //       '&createTime=' + createTime,
  //     //   events: events,
  //   })
  //   console.log('isXunwu',isXunwu);
  //   console.log('isXunren',isXunren);
  // },
  toDetail(e) {  // 列表详情
    var _id = e.currentTarget.dataset.id
    var _openid = e.currentTarget.dataset.openid
    wx.navigateTo({
      url: '../huangye/xiangqing2/xiangqing2?' +
      '&detailType=' + 'xunwu' +
      '&_openid=' + _openid +
      '&_id=' + _id
    })

  },


  toTijiao() {
    console.log('跳转添加页');
    var login_ok = wx.getStorageSync('login_ok')
    if (login_ok) {
      if (this.data.isXunwu) {
        wx.navigateTo({
          url: '../../add/add?' + '&addType=xunwu' + '&isXunwu=true'
        })
      } else
      if (this.data.isXunren) {
        wx.navigateTo({
          url: '../../add/add?' + '&addType=xunwu' + '&isXunren=true'
        })
      }
    } else {
      utils_toShouQuan.toShouQuan(url) //跳转到授权登录页面
    }

  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log('onLoad');

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
    if (this.data.isXunwu) {
      this.tapXunwu()
    } else if (this.data.isXunren) {
      this.tapXunren()
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
    this.setData({
      isShowLoading: true
    })
    var xunWuList = this.data.xunWuList
    var xunRenList = this.data.xunRenList
    var pageNum = this.data.pageNum + 1
    console.log('页面触底');
    if (this.data.isXunwu) {
      wx.cloud.database().collection('xunwu').where({
          isHege: true,
          isXunwu: true
        })
        .orderBy('isXiajia', 'asc')
        .orderBy('isZhiding', 'desc')
        .orderBy('createTime', 'desc')
        .skip((pageNum - 1) * 20)
        .get() //获取根据查询条件筛选后的集合数据  
        .then(res => {
          if (res.data.length == 0) {
            this.setData({
              isGengDuo: true,
            })
          } else {
            res.data.forEach(element => {
              xunWuList.push(element)
            });
            console.log('当前下载xunWuList第' + pageNum + '页：', xunWuList)
            this.setData({
              xunWuList,
              pageNum,
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    } else
    if (this.data.isXunren) {
      wx.cloud.database().collection('xunwu').where({
          isHege: true,
          isXunren: true
        })
        .orderBy('isXiajia', 'asc')
        .orderBy('isZhiding', 'desc')
        .orderBy('createTime', 'desc')
        .skip((pageNum - 1) * 20)
        .get() //获取根据查询条件筛选后的集合数据  
        .then(res => {
          if (res.data.length == 0) {
            this.setData({
              isGengDuo: true,
            })
          } else {
            res.data.forEach(element => {
              xunRenList.push(element)
            });
            console.log('当前下载xunRenList第' + pageNum + '页：', xunRenList)
            this.setData({
              xunRenList,
              pageNum,
            })
          }
        })
        .catch(err => {
          console.error(err)
        })
    }

      this.setData({
        isShowLoading: false
      })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})