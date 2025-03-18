// pages/xtu/xtu.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: 'http://jwxt.xtu.edu.cn/jsxsd/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_PYGL'
    },

    bindmessage(e) {
        console.log('bindmessage', e);
    },
    bindload(e) {
        console.log('bindload', e);
        console.log('bindload', e.detail.src);
        wx.request({
            // url: 'http://jwxt.xtu.edu.cn/jsxsd/kbcx/kbxx_xzb_ifr', 
            // url: 'http://jwxt.xtu.edu.cn/jsxsd/xskb/xskb_list.do?Ves632DSdyV=NEW_XSD_PYGL',
            url: 'http://jwxt.xtu.edu.cn/jsxsd/xk/LoginToXk',
            data: {
                'USERNAME': '2016600436',
                'PASSWORD': 'hzkj1234'
                // 'xnxqh': '2021-2022-1',
                // 'skyx': '060',
                // 'sknj': '2021',
                // 'skzy': '00706',
                // 'bj': 'C0D0B793A9A94052933389585F075508',
                // 'zc1': '3',
                // 'zc2': '3',
                // 'jc1': '',
                // 'jc2': '',

                // 'cj0701id': '',
                // 'zc': '10',
                // 'demo': '',
                // 'xnxq01id': '2020-2021-2',
                // 'sfFD': '1',

                // 'jx0415zbdiv_1': '5CB20017CDBF490582305D00D6982E29-1-1',
                // 'jx0415zbdiv_2': '5CB20017CDBF490582305D00D6982E29-1-2',
                // 'jx0415zbdiv_1': '5CB20017CDBF490582305D00D6982E29-2-1',
                // 'jx0415zbdiv_2': '5CB20017CDBF490582305D00D6982E29-2-2',
                // 'jx0415zbdiv_1': '5CB20017CDBF490582305D00D6982E29-3-1',
                // 'jx0415zbdiv_2': '5CB20017CDBF490582305D00D6982E29-3-2',
                // 'jx0415zbdiv_1': '5CB20017CDBF490582305D00D6982E29-4-1',
                // 'jx0415zbdiv_2': '5CB20017CDBF490582305D00D6982E29-4-2',
                // 'jx0415zbdiv_1': '5CB20017CDBF490582305D00D6982E29-5-1',
                // 'jx0415zbdiv_2': '5CB20017CDBF490582305D00D6982E29-5-2',
                // 'jx0415zbdiv_1': '5CB20017CDBF490582305D00D6982E29-6-1',
                // 'jx0415zbdiv_2': '5CB20017CDBF490582305D00D6982E29-6-2',
                // 'jx0415zbdiv_1': '5CB20017CDBF490582305D00D6982E29-7-1',
                // 'jx0415zbdiv_2': '5CB20017CDBF490582305D00D6982E29-7-2',
                // 'jx0415zbdiv_1': 'C24482A716FA4A0880EB9FDA7EF2C28C-1-1',
                // 'jx0415zbdiv_2': 'C24482A716FA4A0880EB9FDA7EF2C28C-1-2',
                // 'jx0415zbdiv_1': 'C24482A716FA4A0880EB9FDA7EF2C28C-2-1',
                // 'jx0415zbdiv_2': 'C24482A716FA4A0880EB9FDA7EF2C28C-2-2',
                // 'jx0415zbdiv_1': 'C24482A716FA4A0880EB9FDA7EF2C28C-3-1',
                // 'jx0415zbdiv_2': 'C24482A716FA4A0880EB9FDA7EF2C28C-3-2',
                // 'jx0415zbdiv_1': 'C24482A716FA4A0880EB9FDA7EF2C28C-4-1',
                // 'jx0415zbdiv_2': 'C24482A716FA4A0880EB9FDA7EF2C28C-4-2',
                // 'jx0415zbdiv_1': 'C24482A716FA4A0880EB9FDA7EF2C28C-5-1',
                // 'jx0415zbdiv_2': 'C24482A716FA4A0880EB9FDA7EF2C28C-5-2',
                // 'jx0415zbdiv_1': 'C24482A716FA4A0880EB9FDA7EF2C28C-6-1',
                // 'jx0415zbdiv_2': 'C24482A716FA4A0880EB9FDA7EF2C28C-6-2',
                // 'jx0415zbdiv_1': 'C24482A716FA4A0880EB9FDA7EF2C28C-7-1',
                // 'jx0415zbdiv_2': 'C24482A716FA4A0880EB9FDA7EF2C28C-7-2',
                // 'jx0415zbdiv_1': '49D20C2BC52A4C12B2E902D771A8AFF0-1-1',
                // 'jx0415zbdiv_2': '49D20C2BC52A4C12B2E902D771A8AFF0-1-2',
                // 'jx0415zbdiv_1': '49D20C2BC52A4C12B2E902D771A8AFF0-2-1',
                // 'jx0415zbdiv_2': '49D20C2BC52A4C12B2E902D771A8AFF0-2-2',
                // 'jx0415zbdiv_1': '49D20C2BC52A4C12B2E902D771A8AFF0-3-1',
                // 'jx0415zbdiv_2': '49D20C2BC52A4C12B2E902D771A8AFF0-3-2',
                // 'jx0415zbdiv_1': '49D20C2BC52A4C12B2E902D771A8AFF0-4-1',
                // 'jx0415zbdiv_2': '49D20C2BC52A4C12B2E902D771A8AFF0-4-2',
                // 'jx0415zbdiv_1': '49D20C2BC52A4C12B2E902D771A8AFF0-5-1',
                // 'jx0415zbdiv_2': '49D20C2BC52A4C12B2E902D771A8AFF0-5-2',
                // 'jx0415zbdiv_1': '49D20C2BC52A4C12B2E902D771A8AFF0-6-1',
                // 'jx0415zbdiv_2': '49D20C2BC52A4C12B2E902D771A8AFF0-6-2',
                // 'jx0415zbdiv_1': '49D20C2BC52A4C12B2E902D771A8AFF0-7-1',
                // 'jx0415zbdiv_2': '49D20C2BC52A4C12B2E902D771A8AFF0-7-2',
                // 'jx0415zbdiv_1': 'C6E9D3EE581144269593C0EEE9155A82-1-1',
                // 'jx0415zbdiv_2': 'C6E9D3EE581144269593C0EEE9155A82-1-2',
                // 'jx0415zbdiv_1': 'C6E9D3EE581144269593C0EEE9155A82-2-1',
                // 'jx0415zbdiv_2': 'C6E9D3EE581144269593C0EEE9155A82-2-2',
                // 'jx0415zbdiv_1': 'C6E9D3EE581144269593C0EEE9155A82-3-1',
                // 'jx0415zbdiv_2': 'C6E9D3EE581144269593C0EEE9155A82-3-2',
                // 'jx0415zbdiv_1': 'C6E9D3EE581144269593C0EEE9155A82-4-1',
                // 'jx0415zbdiv_2': 'C6E9D3EE581144269593C0EEE9155A82-4-2',
                // 'jx0415zbdiv_1': 'C6E9D3EE581144269593C0EEE9155A82-5-1',
                // 'jx0415zbdiv_2': 'C6E9D3EE581144269593C0EEE9155A82-5-2',
                // 'jx0415zbdiv_1': 'C6E9D3EE581144269593C0EEE9155A82-6-1',
                // 'jx0415zbdiv_2': 'C6E9D3EE581144269593C0EEE9155A82-6-2',
                // 'jx0415zbdiv_1': 'C6E9D3EE581144269593C0EEE9155A82-7-1',
                // 'jx0415zbdiv_2': 'C6E9D3EE581144269593C0EEE9155A82-7-2',
                // 'jx0415zbdiv_1': 'DCCA111F52FC406E895193B6420D7AA6-1-1',
                // 'jx0415zbdiv_2': 'DCCA111F52FC406E895193B6420D7AA6-1-2',
                // 'jx0415zbdiv_1': 'DCCA111F52FC406E895193B6420D7AA6-2-1',
                // 'jx0415zbdiv_2': 'DCCA111F52FC406E895193B6420D7AA6-2-2',
                // 'jx0415zbdiv_1': 'DCCA111F52FC406E895193B6420D7AA6-3-1',
                // 'jx0415zbdiv_2': 'DCCA111F52FC406E895193B6420D7AA6-3-2',
                // 'jx0415zbdiv_1': 'DCCA111F52FC406E895193B6420D7AA6-4-1',
                // 'jx0415zbdiv_2': 'DCCA111F52FC406E895193B6420D7AA6-4-2',
                // 'jx0415zbdiv_1': 'DCCA111F52FC406E895193B6420D7AA6-5-1',
                // 'jx0415zbdiv_2': 'DCCA111F52FC406E895193B6420D7AA6-5-2',
                // 'jx0415zbdiv_1': 'DCCA111F52FC406E895193B6420D7AA6-6-1',
                // 'jx0415zbdiv_2': 'DCCA111F52FC406E895193B6420D7AA6-6-2',
                // 'jx0415zbdiv_1': 'DCCA111F52FC406E895193B6420D7AA6-7-1',
                // 'jx0415zbdiv_2': 'DCCA111F52FC406E895193B6420D7AA6-7-2',
            },
            header: {
                'content-type': 'application/json', // 默认值
                // 'content-type': 'application/msexcel', // 默认值
                // 'cookie': 'JSESSIONID=E9306C896BEC85A7764E6E2F0879F912',
                // 'cookie': 'JSESSIONID=C0E95DF3138D41D5220C9EF79C1B80C1',
            },
            method: 'POST',
            success(res) {
                // console.log(res.data);
                console.log(res);
            }
        })
    },
    binderror(e) {
        console.log('binderror', e);
    },




    



    onLoad: function (options) {

    },


    onReady: function () {

    },

 
    onShow: function () {

    },


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