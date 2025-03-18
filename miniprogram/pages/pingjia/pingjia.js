// pages/pingjia/pingjia.js
var utils_time = require('../../utils/time.js') //获取时间等
var xingjisrc1 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing1.png'
var xingjisrc2 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing2.png'
var xingjisrc3 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing3.png'

Page({

    data: {
        pingjia_text: '此用户评价内容为空',
        pingjia_list: ['差', '一般', '不错', '很满意', '强烈推荐'],
        xingji_list: [xingjisrc2, xingjisrc2, xingjisrc2, xingjisrc2, xingjisrc2],
        fenshu:5
    },
    oninput_pingjia(e) {
        // console.log(e);
        var pingjia_text = e.detail.value
        this.setData({pingjia_text})
    },
    showXingji(e) {
        var fenshu = e.currentTarget.dataset.index+1
        var xingji_list = [xingjisrc1,xingjisrc1,xingjisrc1,xingjisrc1,xingjisrc1]
        for (let index = 0; index < xingji_list.length; index++) {
          if (index < fenshu) {
            xingji_list[index] = xingjisrc2
          }
        }
        this.setData({xingji_list,fenshu})
      },

    goPingjia() {
        console.log('评价');
        var dingdan_id = this.data.dingdan_id
        var dd_Status = '7'
        var content_text = '确认评价吗？'
        // var timeName = 'pingjia_time'
        var pingjia_time = utils_time.formatTime(new Date())
        var userinfo = wx.getStorageSync('userinfo')
        var pingjia = {
            pingjia_text: this.data.pingjia_text,
            pingjia_fenshu: this.data.fenshu,
            pingjia_time: pingjia_time,
            pingjia_name: userinfo.nickName,
            pingjia_avatarUrl:userinfo.avatarUrl,
        }
        this.change_dd_Status(dd_Status, content_text, dingdan_id, pingjia)

    },
    returnPre_onload() {
        var pages = getCurrentPages(); //当前页面
        var beforePage = pages[pages.length - 2]; //前一页
        beforePage.tapMeishi(); // 执行前一个页面的onLoad方法
        wx.navigateBack({
            delta: 1
        });
    },
    // 改变订单状态
    change_dd_Status(dd_Status, content_text, dingdan_id, pingjia) {

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

                    wx.cloud.callFunction({
                            name: 'changedata',
                            data: {
                                action: 'changeStatus_pingjia',
                                changeData: {
                                    // timeName,
                                    dd_Status,
                                    collection_name: 'meishi', //美食
                                    // gx_time,
                                    idArr,
                                    pingjia,
                                    // pingjia_fenshu,
                                }
                            }
                        })
                        .then(res => {
                            console.log('提交成功：：', res);
                            wx.showToast({
                                icon: 'none',
                                title: '操作完成',
                            })
                            setTimeout(() => {
                                that.returnPre_onload()
                            }, 1000);
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
    onLoad: function (options) {
        var dingdan_id = options.dingdan_id
        var dianpu_name = options.dianpu_name
        // console.log(dianpu_name,'dianpu_name');
        if (dingdan_id) {
            this.setData({ dingdan_id, dianpu_name })
            wx.setNavigationBarTitle({
              title: dianpu_name,
            })
        }
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