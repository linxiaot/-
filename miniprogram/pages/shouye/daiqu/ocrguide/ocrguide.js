// pages/shouye/daiqu/ocrguide/ocrguide.js
Page({


    data: {
        TabCur: 0,
        tabList: ['菜鸟App','多多买菜代收点']
    },

    tabSelect(e) {
        console.log(e);
        this.setData({
            TabCur: e.currentTarget.dataset.id,
            scrollLeft: (e.currentTarget.dataset.id - 1) * 60
        })
    },
    onLoad(options) {

    },


    onReady() {

    },


    onShow() {

    },


    onHide() {

    },

})