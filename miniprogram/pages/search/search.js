// pages/search/search.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: true,
        inputVal: "",
        searchType: "",
        searchResultList: [],
        searchWordList: [],
        isShowSearchWord: false,
        isFocus: true,
        searchResultAll: [],
    },
    // 搜索框
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: "",
            searchResultList: [],
            // isShowSearchWord:false,
            isFocus: true,
            searchResultAll: [],

        });
    },
    inputTyping: function (e) {
        this.setData({
            inputVal: e.detail.value
        });
        if (e.detail.value.length > 0) {
            this.setData({
                isShowSearchWord: true,
            })
        }
    },
    toshowSearchWord() {
        this.setData({
            isShowSearchWord: true,
            searchResultList: [],
            searchResultAll: [],

        })
    },


    // 封装 search 云函数的调用
    yunSearch(searchType, inputVal) {
        let that = this
        var tenant_id = wx.getStorageSync('tenant_id')
        wx.cloud.callFunction({
            name: 'search',
            data: {
                searchType: searchType,
                inputVal: inputVal,
                tenant_id: tenant_id // 添加租户ID参数
            }
        })
        .then(res => {
            console.log('云函数search查询成功：', res.result);
            var searchResultList = res.result.searchResultList
            if (searchType == 'shouye') { //首页查询
                var length_sum = searchResultList.reduce(function (accumulator, currentValue) {
                    return accumulator + currentValue.result.length;
                }, 0)  //计算总数
                console.log('length_sum ：：', length_sum)
                if (length_sum == 0) {
                    wx.showToast({
                        icon: 'none',
                        title: '没有查询到结果',
                    })
                } else {
                    var searchResultAll = [] // 最终渲染的列表
                    searchResultList.forEach(element1 => { //下载的搜索数据
                        var searchResultAll_item = {}
                        var result = element1.result
                        if (result.length !== 0) {
                            result.forEach(element => {
                                var elementHunhe = element.hunheSearch.join('，')
                                var indexNum = elementHunhe.indexOf(inputVal)
                                element.jianjie_start = elementHunhe.slice(0, indexNum)
                                element.jianjie_end = elementHunhe.slice(indexNum + inputVal.length, elementHunhe.length)
                            });
                            searchResultAll_item.searchType = element1.searchType
                            searchResultAll_item.result = result
                            searchResultAll.push(searchResultAll_item)
                        }
                    });
                    this.setData({
                        searchResultAll
                    })
                }
            } else if (searchType == 'xunwu') {
                var searchResultList_new1 = []
                var searchResultList_new2 = []
                searchResultList.forEach(element => {
                    let indexNum = element.jianjie.indexOf(inputVal)
                    element.jianjie_start = element.jianjie.slice(0, indexNum) //直接赋值
                    element.jianjie_end = element.jianjie.slice(indexNum + inputVal.length, element.jianjie.length)
                    
                    if (element.isXunwu) {
                        searchResultList_new1.push(element)
                    } else if (element.isXunren) {
                        searchResultList_new2.push(element)
                    }

                });
                if (this.data.isXunwu) {
                    if (searchResultList_new1.length == 0) {
                        wx.showToast({
                            icon: 'none',
                            title: 'isXunwu没有查询到结果',
                        })
                    } else {
                        that.setData({
                            searchResultList: searchResultList_new1
                        })
                    }
                } else
                if (this.data.isXunren) {
                    if (searchResultList_new2.length == 0) {
                        wx.showToast({
                            icon: 'none',
                            title: 'isXunren没有查询到结果',
                        })
                    } else {
                        that.setData({
                            searchResultList: searchResultList_new2
                        })
                    }
                }
            } else if (searchType == 'shangjia') {
                that.setData({
                    searchResultList,
                })
            } else {
                searchResultList.forEach(element => {
                    var elementHunhe = element.hunheSearch.join('，')
                    var indexNum = elementHunhe.indexOf(inputVal)
                    element.jianjie_start = elementHunhe.slice(0, indexNum) //直接赋值 
                    element.jianjie_end = elementHunhe.slice(indexNum + inputVal.length, elementHunhe.length)
                });
                that.setData({
                    searchResultList,
                })
            }
        })
        .catch(err => {
            console.error(err)
        })
    },

    setSearchWord(inputVal) {
        // var searchWordList = this.data.searchWordList.pop() 
        var searchWordList = this.data.searchWordList
        if (searchWordList.length == 0) {
            searchWordList = [inputVal]
        } else if (searchWordList.length < 8) {
            searchWordList.reverse()
            searchWordList.push(inputVal)
            searchWordList.reverse()
        } else {
            searchWordList.pop()
            searchWordList.reverse()
            searchWordList.push(inputVal)
            searchWordList.reverse()
        }
        wx.setStorageSync('searchWordList', searchWordList)
        this.setData({
            searchWordList,
        })
    },

    // 点击事件
    toSearch() {
        if (this.data.inputVal) {
            console.log('搜索 用户输入的 关键字：', this.data.inputVal);
            var searchType = this.data.searchType
            var inputVal = this.data.inputVal
            this.yunSearch(searchType, inputVal)
            this.setData({
                isShowSearchWord: false,
            })
            console.log('inputVal', inputVal);
            this.setSearchWord(inputVal)

        } else {
            wx.showToast({
                icon: 'none',
                title: '请输入关键词',
            })
        }
    },
    toWordSearch(e) {
        // console.log(e);
        // console.log( '搜索历史', e.currentTarget.dataset.searchword);
        var searchword = e.currentTarget.dataset.searchword
        var searchType = this.data.searchType
        this.setData({
            inputVal: searchword,
            isShowSearchWord: false,
        })
        this.yunSearch(searchType, searchword)
        this.setSearchWord(searchword)
    },
    tuchuShow(array) {
        array.forEach(element => {
            let inputVal = this.data.inputVal
            let jianjie = element.jianjie
            let indexNum = jianjie.indexOf(inputVal)
            element.jianjie.splice(indexNum, 10)
        });
        return array
    },
    toDianpu(e) {
        // console.log(e);
        var _id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '../shouye/meishi/meishi?_id=' + _id,
        })
    },
    toDetail_meishi(e) {
        var index_a = e.currentTarget.dataset.index_a
        var index_b = e.currentTarget.dataset.index_b
        var _id = e.currentTarget.dataset.id
        console.log(_id,index_a, index_b);
    
        wx.navigateTo({
            url: '../shangjia/sjmeishidetail/sjmeishidetail?_id=' + _id +
                '&isDetail_meishi=true' +
                '&index_a=' + index_a +
                '&index_b=' + index_b,
        })
    },
    toSearchDetail(e) {
        var searchType = this.data.searchType
        // console.log(e);
        var searchType_item = e.currentTarget.dataset.searchtype
        var _id = e.currentTarget.dataset.id
        var _openid = e.currentTarget.dataset.openid
        if (searchType == 'shouye') {
            wx.navigateTo({
                url: '../qiang/huangye/xiangqing2/xiangqing2?' +
                    '&detailType=' + searchType_item +
                    '&_openid=' + _openid +
                    '&_id=' + _id
            })
        } else {
            wx.navigateTo({
                url: '../qiang/huangye/xiangqing2/xiangqing2?' +
                    '&detailType=' + searchType +
                    '&_openid=' + _openid +
                    '&_id=' + _id
            })
        }

    },

    setTitletext(searchType) {
        var searchTypelist = ['xunwu', 'huangye', 'pinche', 'ershou', 'huzhu', 'bigthings', 'luntan', 'jiaoyou', 'zufang', 'jianzhi', 'shouye','shangjia']
        var titlelist = ['失物招领', '黄页', '校园拼车', '跳蚤市场', '校园互助', '校园大事件', '论坛', '交友', '租房', '兼职', '蜂蜂校园','美食店铺']
        for (let index = 0; index < searchTypelist.length; index++) {
            const element = searchTypelist[index];
            if (searchType == element) {
                wx.setNavigationBarTitle({
                    title: titlelist[index],
                })
            }
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('搜索页面onLoad 开始传参');
        var searchType = options.searchType
        if (searchType) {
            console.log('传递的参数是：', options);
            this.setData({
                searchType: searchType,
                // inputShowed: options.inputShowed,
            })
            this.setTitletext(searchType)
        }
        var searchWordList = wx.getStorageSync('searchWordList')
        if (searchWordList) {
            this.setData({
                searchWordList,
            })
        }
        if (searchType == 'xunwu') {
            var isXunwu = options.isXunwu
            var isXunren = options.isXunren
            if (isXunwu == 'true') {
                var isXunwu = true
            } else if (isXunwu == 'false') {
                var isXunwu = false
            }
            if (isXunren == 'true') {
                var isXunren = true
            } else if (isXunren == 'false') {
                var isXunren = false
            }
            this.setData({
                isXunwu,
                isXunren,
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