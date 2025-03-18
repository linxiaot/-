const app = getApp()
const fetch = app.fetch
var xingjisrc1 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing1.png'
var xingjisrc2 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing2.png'
var xingjisrc3 = 'cloud://xmf-0g87mzf198205ada.786d-xmf-0g87mzf198205ada-1305629196/banner/tubiao/shangjia/xingxing3.png'
// var utils_sysInfo = require('../../../utils/getsysteminfo.js')
// var categoryHeight = [] // 右列表各分类高度数组 
// var categoryHeight = [0,742.2,1484.4,2226.6] // 右列表各分类高度数组 742.2 * i
// const foodList = wx.
Page({

    data: {
        categoryHeight: [],
        activeIndex: 0,
        scrollTop: 0,
        tapIndex: 0,
        foodList: [],

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

        dianpuData: {},
        xuanxiangkaList: [{
            text: '商品',
            checked: true
        }, {
            text: '评价'
        }, {
            text: '店铺'
        }],
        screenHeight: 0,

        pingjiaData: [],
        pingjia_list: ['差', '一般', '不错', '很满意', '强烈推荐'],
        pingjia_count: 0,
        xingji: 5,
        xingji_list: [xingjisrc1, xingjisrc1, xingjisrc1, xingjisrc1, xingjisrc1], //评价总分展示使用
    },
    changingCategory: false, // 是否正在切换左侧激活的分类（防止滚动过快时切换迟缓）
    shopcartAnimate: null,

    showXingji(fenshu) {
        var xingji_list = [xingjisrc1, xingjisrc1, xingjisrc1, xingjisrc1, xingjisrc1]
        for (let index = 0; index < xingji_list.length; index++) {
            if (index < fenshu) {
                xingji_list[index] = xingjisrc2
            }
        }
        return xingji_list
    },

    toDetail_meishi(e) {
        var index_a = e.currentTarget.dataset.index_a
        var index_b = e.currentTarget.dataset.index_b
        console.log(index_a, index_b);

        wx.navigateTo({
            url: '../../shangjia/sjmeishidetail/sjmeishidetail?_id=' +
                this.data.dianpuData._id +
                // '&dianpu_openid=' + this.data.dianpuData._openid +
                '&isDetail_meishi=true' +
                '&index_a=' + index_a +
                '&index_b=' + index_b,
        })
    },



    loadPingjia() {
        var xingji = this.data.dianpuData.xingji
        var xingji_list = this.showXingji(xingji)
        this.setData({
            xingji_list,
            xingji
        })
        var that = this
        var tenant_id = wx.getStorageSync('tenant_id')
        wx.cloud.database().collection('meishi').where({
                dianpu: {
                    dianpu_id: this.data.dianpuData._id
                },
                dd_Status: '7',
                tenant_id: tenant_id // 添加租户ID过滤
            })
            .count()
            .then(res => {
                console.log(res.total, 'pingjia总数');
                that.setData({
                    pingjia_count: res.total,
                })
            })
        wx.cloud.database().collection('meishi').where({
                dianpu: {
                    dianpu_id: this.data.dianpuData._id
                },
                dd_Status: '7',
                tenant_id: tenant_id // 添加租户ID过滤
            })
            .orderBy('xd_time', 'desc')
            .skip(0)
            .get()
            .then(res => {
                console.log(res.data, 'pingjia下载成功');
                var pingjiaData = res.data
                pingjiaData.forEach(element => {
                    element.xingji_list = that.showXingji(element.pingjia.pingjia_fenshu)
                });
                that.setData({
                    pingjiaData,
                })
            })
    },
    loadPingjia_more() {
        var pingjiaData = this.data.pingjiaData
        var pingjiaData_length = pingjiaData.length
        var that = this
        wx.showLoading({
            //   title: 'title',
        })
        wx.cloud.database().collection('meishi').where({
                dianpu: {
                    dianpu_id: this.data.dianpuData._id
                },
                dd_Status: '7'
            })
            .orderBy('xd_time', 'desc')
            .skip(pingjiaData_length)
            .get()
            .then(res => {
                console.log(res.data, 'pingjia_more下载成功');
                wx.hideLoading({
                    success: (res) => {},
                })
                if (res.data.length == 0) {
                    wx.showToast({
                        icon: 'none',
                        title: '没有更多了哦',
                    })
                    return
                }
                res.data.forEach(element => {
                    element.xingji_list = that.showXingji(element.pingjia.pingjia_fenshu)
                    pingjiaData.push(element)
                });
                // pingjiaData.concat(res.data)
                that.setData({
                    pingjiaData,
                })
            })
    },

    toitemChange(e) {
        // console.log(e);
        var index = e.detail.index
        var xuanxiangkaList = this.data.xuanxiangkaList
        xuanxiangkaList.forEach((element, i) => {
            if (index == i) {
                element.checked = true
            } else {
                element.checked = false
            }
        });
        if (index == 1) {
            console.log('看评论');
            this.loadPingjia()
        }
        if (index == 2) {
            console.log('看店铺');
            // this.toDetail_dianpu()
        }
        this.setData({
            xuanxiangkaList
        })
    },

    toDetail_dianpu() {
        wx.navigateTo({
            url: '../../shangjia/shangjia?_id=' + this.data.dianpuData._id + '&isDetail_dianpu=true',
        })
    },
    onLoad: function (options) {
        var _id = options._id
        console.log(_id);
        if (_id) {
            this.loadShangjiaData(_id)
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
        this.shopcartAnimate = shopcartAnimate('.operate-shopcart-icon', this)
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

    onShow: function () {
        // app.globalData.cartData = {name:'name...'}
        this.getCartdatas() //获取购物车数据
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

    async loadShangjiaData(_id) {
        var tenant_id = wx.getStorageSync('tenant_id')
        var res = await wx.cloud.database().collection('shangjia').where({
            _id: _id,
            tenant_id: tenant_id // 添加租户ID过滤
        }).get()
        console.log('下载 商家 数据成功：：', res.data);
        if (res.data.length > 0) {
            this.setData({
                foodList: res.data[0].foodList,
                dianpuData: res.data[0]
            })
            await this.chaxunJiedian()
        }
    },
    chaxunJiedian() {
        return new Promise((resolve) => {
            // 查询节点信息
            var categoryHeight = []
            wx.createSelectorQuery()
                .selectAll('.foodall')
                .boundingClientRect(res => {
                    console.log('节点信息', res);
                    var top = res[0].top
                    res.forEach((element, i) => {
                        var height_item = element.top - top
                        categoryHeight.push(height_item)
                    });
                    this.setData({
                        categoryHeight,
                    })
                })
                .exec()
            resolve()
        })
    },

    selectViewport() {
        // wx.createSelectorQuery()
        //     .selectViewport()
        //     .scrollOffset(res => {

        wx.createSelectorQuery()
            // .select('.food-category')
            .selectAll('.food-category')
            .boundingClientRect(res => {
                console.log('节点信息', res);
                wx.showModal({
                    title: 'title',
                    // content: JSON.stringify(res)
                    content: JSON.stringify(res[0].height)
                });
            })
            .exec()
        wx.createSelectorQuery()
            .selectAll('.food-item')
            .boundingClientRect(res => {
                console.log('节点信息2', res);
                wx.showModal({
                    title: 'title',
                    // content: JSON.stringify(res)
                    content: JSON.stringify(res[0].height)
                });
            })
            .exec()
    },
    count_categoryHeight() {
        var foodList = this.data.foodList
        var categoryHeight = this.data.categoryHeight
        foodList.forEach((element, i) => {
            var categoryHeight_item = (element.food.length * (57 + 20) + 29.2 + 20) * i
            // var categoryHeight_item = (element.food.length*(600/12)+29.2) * i *780/667
            categoryHeight.push(categoryHeight_item)
        });

        this.setData({
            categoryHeight
        })
    },

    tapCategory(e) {
        // console.log('tapCategory', e);
        var index = e.currentTarget.dataset.index
        // console.log('tapCategory：：index', index);

        this.setData({
            scrollTop: this.data.categoryHeight[index],
            activeIndex: index

        })
    },
    foodScroll(e) {
        // console.log('滚动值：', e);
        var scrollTop = e.detail.scrollTop
        var categoryHeight = this.data.categoryHeight
        var activeIndex = 0
        categoryHeight.forEach((element, i) => {
            if (scrollTop >= element - 1) {
                // console.log('i::',i);
                activeIndex = i
            }
        })
        // console.log('activeIndex：：', activeIndex);
        this.setData({
            activeIndex,
        })
    },


    scrolltolower: function () {
        var categoryHeight = this.data.categoryHeight
        console.log('滑到底部');
        this.setData({
            activeIndex: categoryHeight.length - 1
        })
        console.log('滑到底部activeIndex：', categoryHeight.length);

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
        var id = e.currentTarget.dataset.id
        console.log('id', id);
        var category_id = e.currentTarget.dataset.category_id
        console.log('category_id', category_id);
        var food = this.data.foodList[category_id].food[id]
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
        this.shopcartAnimate.show(e)
        this.setData({
            cartList: cartList,
            // cartPrice: this.data.cartPrice + food.price,
            cartPrice: this.data.cartPrice + parseFloat(food.price),
            cartNumber: this.data.cartNumber + 1
        })

        this.setCartdatas()

    },
    toOrder: function () {
        if (this.data.cartNumber === 0) {
            return
        }

        // var cartData = {
        //     cartList: this.data.cartList,
        //     cartPrice: this.data.cartPrice,
        //     cartNumber: this.data.cartNumber,
        //     name: this.data.cartList[0].name,
        //     describe: '等' + this.data.cartNumber + '件美食',
        //     describeImageurl: this.data.cartList[0].imageUrl,
        //     dianpu: {
        //         dianpu_id: this.data.dianpuData._id,
        //         dianpu_name: this.data.dianpuData.name,
        //         dianpu_dizhi: this.data.dianpuData.dizhi,
        //         dianpu_phone: this.data.dianpuData.phone,
        //         dianpu_zhaopaiUrl: this.data.dianpuData.zhaopaiUrl,
        //     }
        // }
        // wx.setStorageSync('cartData', cartData)
        wx.navigateTo({
            url: '../../shouye/meishi/check/check'
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

    onReady: function () {

    },



    onHide: function () {

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

function shopcartAnimate(iconClass, page) {
    var busPos = {}
    wx.createSelectorQuery().select(iconClass).boundingClientRect(rect => {
        busPos.x = rect.left + 15
        busPos.y = rect.top
    }).exec()
    return {
        show: function (e) {
            var finger = {
                x: e.touches[0].clientX - 10,
                y: e.touches[0].clientY - 10
            }
            var topPoint = {}
            if (finger.y < busPos.y) {
                topPoint.y = finger.y - 150
            } else {
                topPoint.y = busPos.y - 150
            }
            topPoint.x = Math.abs(finger.x - busPos.x) / 2
            if (finger.x > busPos.x) {
                topPoint.x = (finger.x - busPos.x) / 2 + busPos.x
            } else {
                topPoint.x = (busPos.x - finger.x) / 2 + finger.x
            }
            var linePos = bezier([busPos, topPoint, finger], 30)
            var bezier_points = linePos.bezier_points
            page.setData({
                'cartBall.show': true,
                'cartBall.x': finger.x,
                'cartBall.y': finger.y
            })
            var len = bezier_points.length
            var index = len
            let i = index - 1
            var timer = setInterval(function () {
                i = i - 5
                if (i < 1) {
                    clearInterval(timer)
                    page.setData({
                        'cartBall.show': false
                    })
                    return
                }
                page.setData({
                    'cartBall.show': true,
                    'cartBall.x': bezier_points[i].x,
                    'cartBall.y': bezier_points[i].y
                })
            }, 50)
        }
    }

    function bezier(pots, amount) {
        var pot
        var lines
        var ret = []
        var points
        for (var i = 0; i <= amount; ++i) {
            points = pots.slice(0)
            lines = []
            while (pot = points.shift()) {
                if (points.length) {
                    lines.push(pointLine([pot, points[0]], i / amount))
                } else if (lines.length > 1) {
                    points = lines
                    lines = []
                } else {
                    break
                }
            }
            ret.push(lines[0])
        }

        function pointLine(points, rate) {
            var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance
            var ret = []
            pointA = points[0]
            pointB = points[1]
            xDistance = pointB.x - pointA.x
            yDistance = pointB.y - pointA.y
            pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2)
            tan = yDistance / xDistance
            radian = Math.atan(tan)
            tmpPointDistance = pointDistance * rate
            ret = {
                x: pointA.x + tmpPointDistance * Math.cos(radian),
                y: pointA.y + tmpPointDistance * Math.sin(radian)
            }
            return ret
        }
        return {
            bezier_points: ret
        }
    }
}