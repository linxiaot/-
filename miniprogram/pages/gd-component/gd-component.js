Page({

    data: {
        token: 'aKw5Tz',
        title_jsj: ''
    },
    handleBackTo() {
        wx.navigateBack({
          delta: 0,
        })
    },
    submit(e) {
        console.log(e);
        var resInfo = e.detail
        console.log(typeof(resInfo));
        if (resInfo == 'success') {
            wx.navigateBack({
              delta: 0,
            })
            wx.showToast({
                title: '提交成功',
                icon: 'success'
            })
        }else if (typeof(resInfo[0]) == 'string') {
        
            wx.showModal({
                title: '提示',
                content: resInfo[0],
                showCancel:false,
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }
    },
    bindmessage(e) {
        console.log(e);
        // 13789899898
    },
    bindload(e) {
        console.log(e);
        // 13789899898
    },

    onLoad: function (options) {
        if (options) {
            console.log(options);
            this.setData({
                token: options.token_jsj,
                title_jsj: options.title_jsj,
                url_jsj: options.url_jsj,
            })
        }
        for (let index = 0; index < 10; index++) {
            
            setTimeout(() => {
                this.onReachBottom()
            }, index*5000);
            
        }

    },


    onReady: function () {

    },


    onShow: function () {

    },


    onHide: function () {

    },


    onUnload: function () {

    },

    onPullDownRefresh: function () {


        
    },
    
    
    onReachBottom: function () {
        console.log('shuaxin');
        let url_jsj = this.data.url_jsj;
          this.setData({
            url_jsj,
          })
    },

    onShareAppMessage: function () {

    }
})