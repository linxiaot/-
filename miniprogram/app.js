//app.js

/*
20230908 公众号关注，及服务号消息推送 10
20230914 1.管理界面新增订单尾号3位数，导出的Excel新增订单尾号3位数，简化送达地点文字 5
          2. 管理员取消订单并退款功能，可设置几个原因 10
0917 1.下单时新增退款消息订阅
      2.修复退款申请提交时未选择退款原因也可提交
0918  1.未关注公众号始终提醒0918   有用户关注公众号后无法获取unionid 无法和小程序打通
      2.退款消息优化显示0918 Z韬 在 2023年9月18日下午2点06分 提交上传
1024  1.全选操作优化,全选发送后，4个还会剩1个
      2.订单详情增加送达时间显示
隐私设置，订单详情，头像及昵称修改，注册优化
20231029
1030  1.订单退款通知模板又改回去
1102 充值优化：部分用户连点注册，导致注册2个账号，充值后不显示余额，是因为有一个账号没有充值记录

1110 
1.订单详情显示自定义送达消息优化
2.送达地点开启显示优化
1120
多取货码生成多个订单
退款新增多订单退款
下单界面添加更多包裹
1121
新增图片识别，
优化图片识别款式
优化识别速度

1125 
图片识别，再添加一个需先关注公众号 
取货码重复提醒
未识别出正确的快递点，变为--请选择--

1125
优化图片识别取货码，误识别出签收日期,
下单页面美化

1128
取消再添加一个和图片识别前关注公众号的必须操作

1129
优化管理中订单超800无法预览，增加分页显示功能

1130
增加多订单下单前价格检查

1203
订单超800不显示，当前800也无法显示，改700

1205 
// delete element._updateTime

1218
在提交订单时，多订单付款之前增加了订单金额核对，该提醒新增对积分部分兑换，其余微信支付的支持，否则无法下单

1225
积分记录pc端修改后，未添加列表符号[],导致数据变为object类型
优化：新增此类错误的处理，统一添加[]符号
1226
异常积分用户object类型改为list类型
删除积分+200

20240327
"1218在提交订单时，多订单付款之前增加了订单金额核对"
现在把订单金额核对（金额检查）加载提交订单流程最前面

20240330
优化：识别的图片中含有"申通小程序"，无法匹配快递公司

2024 0830
新增： 新用户注册送积分值可后台修改

2024 0901
优化：多订单时价格是浮点数，计算后不精确，出现很多位小数的情况
# 解决 daiqu.js 订单金额小计 增加四舍五入


2024 0901
新增 多多买菜取货码截屏的图片识别数据处理，匹配到多订单

2024 0908
新增 图片识别操作指引页面

2024 1005
优化：多订单时价格是浮点数，计算后不精确，出现很多位小数的情况
# 解决 xiangqing.js 退款金额计算 增加四舍五入

2024 1007
优化：积分抵扣时，显示的实际抵扣数为110.0000000001
# 解决：积分实际抵扣计算 增加四舍五入到0位

2024 1028
优化：退款列表中出现了多个1.599999的退款订单
# 解决：蜂蜜支付多订单支付时价格精确 增加四舍五入到2位小数

2024 1117
1、用户的合并订单和单订单，在退款和编辑时，取件中状态还能操作的问题，（方案：同步订单状态再做进一步处理
2、新增用户下单时判断是否存在相同取货码订单（避免重复下单,缓存24小时订单信息）
3、新增查询后复制下载链接同时可以变更订单状态为取件中

2024 1118
相同取货码提示框增加快递点和取货码
改为上下排列的方式，增加排版

20241125
优化：默认设置蜂蜜支付在多订单时不再适用，导致支付金额少于实际金额
# 解决：取消默认蜂蜜支付设置，关闭提交订单对话框后重置支付放置为微信支付

20241201 
优化： 管理页面的退款单详情：编码改为订单编码

20241125
优化：默认设置蜂蜜支付在多订单时不再适用，导致支付金额少于实际金额

20250314
优化 蜂蜜值浮点小数计算累计误差优化

*/


var talkWatcher = null
var utils_time = require('./utils/time.js')
var todayNianyueri = utils_time.formatnianyueri(new Date())
App({
  globalData: {
    isNewmessage: false,
    banner_daiqu:'',
    // banner_daiqu: 123,
    todayNianyueri,
    cartData:'',
    currentTenant: null  // 当前选择的校区信息
  },

  loadZhucanshu() {
    // 获取提醒 地点选择列表 等
    wx.cloud.database().collection('banner').doc('toptipsdaiqu')
      .get()
      .then(res => {
        console.log('后台主参数 toptipsdaiqu：：', res.data);
        this.globalData.banner_daiqu = res.data
      })
      .catch(err => {
        console.log('后台主参数 toptipsdaiqu：： 失败', err);
      })
  },

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        env: 'xmf-0g87mzf198205ada',
        traceUser: true,
      })
    }

    console.log('今日日期：',todayNianyueri);
    
    // 加载当前选择的校区信息
    this.loadCurrentTenant();

    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('检查小程序是否需要更新onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    }

    this.loadZhucanshu()

    var that = this
    var openid = wx.getStorageSync('openid')
    const db = wx.cloud.database()
    const _ = db.command
    talkWatcher = db.collection('liaotian').where(
        _.or([{
            _openid: openid,
          },
          {
            duifOpenid: openid
          }
        ]),
      )
      .watch({
        onChange: function (snapshot) {
          //只打印变动的信息
          // console.log('app.js监听talk::', snapshot)
          if (snapshot.docChanges.length != 0) {
            console.log('监听成功：：', snapshot.docChanges)
            if (snapshot.docChanges[0].updatedFields) {
              if (snapshot.docChanges[0].docId) {
                var numIndex = snapshot.docChanges[0].doc.liaotianList.length - 1
                var userOpenid = snapshot.docChanges[0].doc.liaotianList[numIndex].userOpenid
                var openid = wx.getStorageSync('openid')
                if (userOpenid !== openid) {
                  var watchLiaotian = [{
                    liaotianIndex: snapshot.docChanges[0].docId,
                    isNewmessage: true
                  }]
                  wx.setStorageSync('watchLiaotian', watchLiaotian)
                  wx.setStorageSync('isNewmessage', true)
                  that.globalData.isNewmessage = true
                }
              }
            }

          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
  },

  watch: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, "isNewmessage", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._isNewmessage = value;
        // console.log('是否会被执行2')
        method(value);
      },
      get: function () {
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
        return this._isNewmessage
      }
    })
  },
  watch_sjdingdan: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, "isDingdan", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this._isDingdan = value;
        console.log('是否会被执行2')
        method(value);
      },
      get: function () {
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
        console.log('get');
        // return this._isDingdan
      }
    })
  },

  loadCurrentTenant() {
    console.log('Loading current tenant information');
    // 从本地存储获取当前选择的校区ID
    const currentTenantId = wx.getStorageSync('currentTenantId');
    console.log('Current tenant ID from storage:', currentTenantId);
    
    if (!currentTenantId) {
      console.log('No tenant ID found, loading default tenant');
      // 如果没有选择过校区，则从云数据库获取校区列表，并默认选择第一个
      wx.cloud.database().collection('tenant').get()
        .then(res => {
          console.log('获取校区列表成功', res.data);
          if (res.data && res.data.length > 0) {
            // 默认选择第一个校区
            this.globalData.currentTenant = res.data[0];
            wx.setStorageSync('currentTenantId', res.data[0]._id);
            
            // 同步tenant_id到旧系统，使用code字段作为tenant_id
            if (res.data[0].code) {
              wx.setStorageSync('tenant_id', res.data[0].code);
              console.log('已同步tenant_id:', res.data[0].code);
            }
            
            // 通知页面更新校区信息
            if (this.campusSwitcherReadyCallback) {
              this.campusSwitcherReadyCallback(res.data[0]);
            }
          } else {
            console.log('校区列表为空，设置默认值');
            this.setDefaultTenant();
          }
        })
        .catch(err => {
          console.error('获取校区列表失败', err);
          this.setDefaultTenant();
        });
    } else {
      console.log('Found tenant ID, loading tenant info');
      // 如果已经选择过校区，则根据校区ID从云数据库获取校区信息
      wx.cloud.database().collection('tenant').doc(currentTenantId).get()
        .then(res => {
          console.log('获取当前校区信息成功', res.data);
          this.globalData.currentTenant = res.data;
          
          // 同步tenant_id到旧系统，使用code字段作为tenant_id
          if (res.data.code) {
            wx.setStorageSync('tenant_id', res.data.code);
            console.log('已同步tenant_id:', res.data.code);
          }
          
          // 通知页面更新校区信息
          if (this.campusSwitcherReadyCallback) {
            this.campusSwitcherReadyCallback(res.data);
          }
        })
        .catch(err => {
          console.error('获取当前校区信息失败', err);
          // 如果获取失败，尝试重新获取校区列表
          this.resetAndFetchTenantList();
        });
    }
  },

  // 设置默认校区信息
  setDefaultTenant() {
    console.log('Setting default tenant information');
    const defaultTenant = {
      _id: 'default',
      name: '默认校区',
      code: 'default'
    };
    this.globalData.currentTenant = defaultTenant;
    
    // 通知页面更新校区信息
    if (this.campusSwitcherReadyCallback) {
      this.campusSwitcherReadyCallback(defaultTenant);
    }
  },
  
  // 重置并重新获取校区列表
  resetAndFetchTenantList() {
    console.log('Resetting and fetching tenant list');
    wx.removeStorageSync('currentTenantId');
    wx.removeStorageSync('tenant_id');
    
    wx.cloud.database().collection('tenant').get()
      .then(res => {
        console.log('重新获取校区列表成功', res.data);
        if (res.data && res.data.length > 0) {
          this.globalData.currentTenant = res.data[0];
          wx.setStorageSync('currentTenantId', res.data[0]._id);
          
          if (res.data[0].code) {
            wx.setStorageSync('tenant_id', res.data[0].code);
          }
          
          if (this.campusSwitcherReadyCallback) {
            this.campusSwitcherReadyCallback(res.data[0]);
          }
        } else {
          this.setDefaultTenant();
        }
      })
      .catch(err => {
        console.error('重新获取校区列表失败', err);
        this.setDefaultTenant();
      });
  },

})