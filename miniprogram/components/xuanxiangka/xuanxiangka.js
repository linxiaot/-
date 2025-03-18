// components/xuanxiangka/xuanxiangka.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        nameList: {
            type: Array,
            value:[{text:'选项1',checked:true},{text:'选项1'},{text:'选项1'}]
        },
        typeNum: {
            type: Number,
            value:1
        },
        red_dot_num: {
            type: Number,
            value:30
        },
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        itemChange(e) {
            // console.log(e);
            var index = e.currentTarget.dataset.index
            this.triggerEvent('itemChange', { index })
        },
        // // 传出参数 使用在目标页面js中
        // tochangeItem(e) {
        //     var index = e.detail.index
        //     var nameList = this.data.nameList
        //     nameList.forEach((element, i) => {
        //         if (index == i) {
        //             element.checked = true
        //         } else {
        //             element.checked = false
        //         }
        //     });
        //     if (index == 2) {
        //         console.log(index+'被点击')
        //     }
        //     this.setData({
        //         nameList
        //     })
        // },
    }
})
