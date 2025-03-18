import WeCropper from '../../utils2/we-cropper/we-cropper.js'

const app = getApp()

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({
  data: {
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 268) / 2, // 裁剪框x轴起点
        y: (height - 480) / 2, // 裁剪框y轴期起点
        width: 268, // 裁剪框宽度
        height: 480 // 裁剪框高度
      },
      boundStyle: {
        color: "green",
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      },

    },
    isShow: true,
    iamgeURllast: ''
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },

  //当点击生成图片按钮的时候，得到图片的src后，调用wx.uploadFile()上传图片，成功后可以再跳转到想要去的页面
  getCropperImage() {
    // let that = this
    var id = wx.getStorageSync('id')
    this.cropper.getCropperImage()
      .then((src) => {
        console.log(src);
        this.setData({
          isShow: false,
        })
        // 返回主页面页面 delta: 2  上级页面 delta: 1
        wx.navigateBack({
          delta: 1
        })
        // wx.navigateTo({
        //   url: '../qiang/kebiao/kebiao',
        // })
        wx.setStorageSync('kebiaoImageUrl', src)
        wx.cloud.database().collection('user').doc(id)
          .update({
            data: {
              kebiaoImageUrl: src
            }
          })
          .then(res => {
            console.log('kebiaoImageUrl更新成功', res);
            
          })
      })
      .catch((err) => {
        wx.showModal({
          title: '温馨提示',
          content: err.message
        })
      })
  },

  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      //   sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        //   console.log(res.tempFilePaths[0]);
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        self.cropper.pushOrign(src)
        console.log('已选择图片，地址为：', src);
      }
    })
  },
  onLoad(option) {
    // const {
    //   cropperOpt
    // } = this.data

    // cropperOpt.boundStyle.color = "green"

    // this.setData({
    //   cropperOpt
    // })

    // this.cropper = new WeCropper(cropperOpt)
    //   .on('ready', (ctx) => {
    //     console.log(`wecropper is ready for work!`)
    //   })
    //   .on('beforeImageLoad', (ctx) => {
    //     wx.showToast({
    //       title: '上传中',
    //       icon: 'loading',
    //       duration: 20000
    //     })
    //   })
    //   .on('imageLoad', (ctx) => {
    //     wx.hideToast()
    //   })

    // canvas2d 使用示例
    const { cropperOpt } = this.data

        this.createSelectorQuery().select(`#${cropperOpt.id}`).fields({ node: true, size: true }).exec((res) => {
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')

            const dpr = wx.getSystemInfoSync().pixelRatio
            canvas.width = res[0].width * dpr
            canvas.height = res[0].height * dpr
            ctx.scale(dpr, dpr)
            cropperOpt.canvas = canvas
            cropperOpt.ctx = ctx

            this.cropper = new WeCropper(cropperOpt)
            .on('ready', (ctx) => {
                console.log(`wecropper is ready for work 图片裁剪准备好了!`)
            })
            .on('beforeImageLoad', (ctx) => {
                wx.showToast({
                    title: '上传中',
                    icon: 'loading',
                    duration: 20000
                })
            })
            .on('imageLoad', (ctx) => {
                wx.hideToast()
            })
        })
  }
})