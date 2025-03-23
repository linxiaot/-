const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 1. 获取默认校区信息
    const tenantResult = await db.collection('tenant').limit(1).get()
    if (!tenantResult.data || tenantResult.data.length === 0) {
      return {
        success: false,
        message: '未找到校区信息'
      }
    }
    
    const defaultTenant = tenantResult.data[0]
    const defaultTenantId = defaultTenant.code || defaultTenant._id
    
    // 2. 需要更新的集合列表
    const collections = [
      'user',
      'daiqu',
      'jijian',
      'shangjia',
      'ershou',
      'bucha',
      'tuikuan',
      'meishi'
    ]
    
    const results = []
    
    // 3. 遍历每个集合，更新数据
    for (const collection of collections) {
      try {
        // 获取集合中所有没有tenant_id的记录
        const records = await db.collection(collection)
          .where({
            tenant_id: _.exists(false)
          })
          .get()
        
        if (records.data && records.data.length > 0) {
          // 批量更新这些记录
          const updatePromises = records.data.map(record => 
            db.collection(collection).doc(record._id).update({
              data: {
                tenant_id: defaultTenantId
              }
            })
          )
          
          await Promise.all(updatePromises)
          
          results.push({
            collection,
            success: true,
            updatedCount: records.data.length
          })
        } else {
          results.push({
            collection,
            success: true,
            updatedCount: 0,
            message: '没有需要更新的记录'
          })
        }
      } catch (err) {
        results.push({
          collection,
          success: false,
          error: err.message
        })
      }
    }
    
    return {
      success: true,
      results
    }
    
  } catch (err) {
    return {
      success: false,
      error: err.message
    }
  }
} 