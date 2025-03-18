var db = wx.cloud.database()
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 购物车
        cartList: [],
        cartPrice: 0,
        cartNumber: 0,
        cartBall: {
            show: false,
            x: 0,
            y: 0
        },
        showCart: false,
        promotion: {},

        screenHeight: 0,
        isDetail_meishi: false,
        resMeishi: {},
        index_a: 0,
        index_b: 0,
        dianpuData: {},


    },
    checkSame(cartList, category_id, id) {
        var isSame = false
        cartList.forEach(element => {
            if (element.id == id && element.category_id == category_id) {
                isSame = true
            }
        });
        return isSame
    },

    addToCart: function (e) {
        // var id = e.currentTarget.dataset.id
        // console.log('id', id);
        // var category_id = e.currentTarget.dataset.category_id
        // console.log('category_id', category_id);
        // var food = this.data.foodList[category_id].food[id]
        var category_id = Number(this.data.index_a)
        var id = Number(this.data.index_b)
        console.log('category_id', category_id);
        console.log('id', id);
        var food = this.data.resMeishi
        var cartList = this.data.cartList

        // var cartList_index = 0
        if (cartList.length == 0) {
            console.log('购物车 添加 第一个');
            var cartList_item = {
                category_id: category_id,
                id: food.id,
                name: food.name,
                price: parseFloat(food.price),
                // price: food.price,
                imageUrl: food.imageUrl,
                number: 1
            }
            cartList.push(cartList_item)
        } else {
            var isSame = this.checkSame(cartList, category_id, id)
            console.log('isSame...', isSame);
            if (isSame == true) {
                console.log('购物车有相同项');
                cartList.forEach(element => {
                    if (element.id == id && element.category_id == category_id) {
                        ++element.number
                    }
                });
            } else {
                console.log('购物车 无相同');
                var cartList_item = {
                    category_id: category_id,
                    id: food.id,
                    name: food.name,
                    price: parseFloat(food.price),
                    // price: food.price,
                    imageUrl: food.imageUrl,
                    number: 1
                }
                cartList.push(cartList_item)
            }
        }
        // this.shopcartAnimate.show(e)
        this.setData({
            cartList: cartList,
            // cartPrice: this.data.cartPrice + food.price,
            cartPrice: this.data.cartPrice + parseFloat(food.price),
            cartNumber: this.data.cartNumber + 1
        })
        this.setCartdatas() //缓存购物车数据

    },
    toOrder: function () {
        if (this.data.cartNumber === 0) {
            return
        }
        wx.navigateTo({
            url: '../../shouye/meishi/check/check?' + 'dianpu_openid=' + this.data.dianpuData._openid
        })
    },

    showCartList: function () {
        if (this.data.cartNumber > 0) {
            this.setData({
                showCart: !this.data.showCart
            })
        }
    },
    cartNumberDec: function (e) {
        var id = e.currentTarget.dataset.id
        var cartList = this.data.cartList
        if (cartList[id]) {
            var price = cartList[id].price
            if (cartList[id].number > 1) {
                --cartList[id].number
            } else {
                // delete cartList[id]
                cartList.splice(id, 1)
            }
            this.setData({
                cartList: cartList,
                cartNumber: --this.data.cartNumber,
                cartPrice: this.data.cartPrice - price
            })
            if (this.data.cartNumber <= 0) {
                this.setData({
                    showCart: false
                })
            }
            this.setCartdatas() //缓存购物车数据
        }

    },
    cartNumberAdd: function (e) {
        var id = e.currentTarget.dataset.id
        var cartList = this.data.cartList
            ++cartList[id].number
        this.setData({
            cartList: cartList,
            cartNumber: ++this.data.cartNumber,
            cartPrice: this.data.cartPrice + cartList[id].price
        })
        this.setCartdatas() //缓存购物车数据

    },
    cartClear: function () {
        // wx.removeStorageSync('cartData')
        app.globalData.cartData = ''
        this.setData({
            cartList: [],
            cartNumber: 0,
            cartPrice: 0,
            showCart: false
        })
    },
    //返回页面传参
    returnPre: function () {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        prevPage.setData({
            isreturnPre: true,
        })
        // console.log(this.data.liaotian_id);
        // wx.navigateBack({
        //   delta: 1,
        // })
    },

    setCartdatas() {
        // 购物车数据
        if (this.data.cartList.length == 0) {
            var cartData_name = ''
            var describeImageurl = ''
        } else {
            var cartData_name = this.data.cartList[0].name
            var describeImageurl = this.data.cartList[0].imageUrl
        }
        var cartData = {
            cartList: this.data.cartList,
            cartPrice: this.data.cartPrice,
            cartNumber: this.data.cartNumber,
            name: cartData_name,
            describe: '等' + this.data.cartNumber + '件美食',
            describeImageurl: describeImageurl,
            dianpu: {
                dianpu_id: this.data.dianpuData._id,
                dianpu_openid: this.data.dianpuData._openid,
                dianpu_name: this.data.dianpuData.name,
                dianpu_dizhi: this.data.dianpuData.dizhi,
                dianpu_phone: this.data.dianpuData.phone,
                dianpu_zhaopaiUrl: this.data.dianpuData.zhaopaiUrl,
            }
        }
        // wx.setStorageSync('cartData', cartData)
        app.globalData.cartData = cartData
    },
    getCartdatas() {
        // 购物车数据
        var cartData = app.globalData.cartData
        console.log('cartData...', cartData);
        // var cartData = wx.getStorageSync('cartData')
        if (cartData !== '') {
            // console.log('1');
            this.setData({
                cartList: cartData.cartList,
                cartPrice: cartData.cartPrice,
                cartNumber: cartData.cartNumber
            })
        } else {
            this.cartClear()
        }
    },

    onLoad: function (options) {
        var _id = options._id
        // var dianpu_openid = options.dianpu_openid
        if (_id) {
            db.collection('shangjia').doc(_id)
                .get()
                .then(res => {
                    console.log(res.data);
                    var dianpuData = res.data
                    if (options.isDetail_dianpu) {
                        this.setData({
                            isDetail_dianpu: true,
                        })
                    } else if (options.isDetail_meishi) {
                        var index_a = options.index_a
                        var index_b = options.index_b
                        var resMeishi = dianpuData.foodList[index_a].food[index_b]
                        wx.setNavigationBarTitle({
                            title: dianpuData.name,
                        })
                        this.setData({
                            dianpuData,
                            resMeishi,
                            index_a,
                            index_b,
                            isDetail_meishi: true,
                        })

                    }
                })
            this.getCartdatas()
            //识别是否进的同一家店铺 不同则清空购物车
            var dianpu_id = wx.getStorageSync('dianpu_id')
            if (dianpu_id) {
                if (dianpu_id != _id) {
                    this.cartClear()
                    wx.setStorageSync('dianpu_id', _id)
                }
            } else {
                wx.setStorageSync('dianpu_id', _id)
            }

        }
        // 获取手机系统信息
        var that = this
        wx.getSystemInfo({
            success: (res) => {
                console.log('手机系统信息', res);
                var screenHeight = res.windowHeight
                console.log('screenHeight', screenHeight);
                that.setData({
                    screenHeight
                })

            },
        })
    },


    onReady: function () {

    },


    onShow: function () {
        // console.log(app.globalData.cartData);
        // app.globalData.cartData = {name:'name...'}
    },


    onHide: function () {
        // console.log(111);
    },

    onUnload: function () {

    },

    onPullDownRefresh: function () {

    },

    onReachBottom: function () {

    },

    onShareAppMessage: function () {

    }
})