// pages/emotion-factors/emotion-factors.js
const emotionData = require('../../../utils/emotion-data.js')

Page({
  data: {
    selectedEmotion: null,
    selectedDetails: [],
    selectedFactors: [],
    customContext: '',
    recordType: '',
    factorCategories: [
      ["工作", "学习", "旅行", "聚会", "比赛","考试", "面试", "约会", "运动", "购物", "吃饭","睡觉","写作", "画画", "摄影", "逛街"],
      ["书籍", "音乐", "美食", "影视", "风景","礼物", "服饰", "手机", "宠物", "游戏","手工","天气"],
      ["朋友", "家人", "恋人", "同事", "导师","孩子", "邻居", "偶像", "亲戚", "网友","陌生人"],
    ]
  },
  
  onLoad: function() {
    // 获取全局数据
    const app = getApp()
    const selectedEmotion = app.globalData.selectedEmotion
    const selectedDetails = app.globalData.selectedDetails
    const recordType = app.globalData.recordType
    
    this.setData({
      selectedEmotion,
      selectedDetails,
      recordType
    })
  },
  
  // 切换选择因素
  toggleFactor: function(e) {
    const factor = e.currentTarget.dataset.factor
    const { selectedFactors } = this.data
    
    if (selectedFactors.includes(factor)) {
      // 如果已选中，则取消选中
      this.setData({
        selectedFactors: selectedFactors.filter(f => f !== factor)
      })
    } else {
      // 如果未选中，则添加到选中列表
      this.setData({
        selectedFactors: [...selectedFactors, factor]
      })
    }
  },
  
  // 自定义情境输入
  inputCustomContext: function(e) {
    this.setData({
      customContext: e.detail.value
    })
  },
  
  // 完成记录
  complete: function() {
    const { selectedEmotion, selectedDetails, selectedFactors, customContext, recordType } = this.data
    
    // 创建情绪记录
    const emotion = {
      // 情绪状态（veryUnhappy，unhappy，slightlyUnhappy，neutral，slightlyHappy，happy，veryHappy）
      type: selectedEmotion.type,
      // 情绪状态 中文名
      name: selectedEmotion.name,
      //具体情绪分（0-100）
      value: selectedEmotion.value,
      //情绪详细感受,数据结构是数组
      details: selectedDetails,
      //情绪因素，数据结构是数组
      factors: selectedFactors,
      //自定义情境，字符串
      customContext: customContext,
      //记录类型，daily为当日情绪，current为瞬时情绪
      recordType: recordType,
      //记录时间戳
      timestamp: getApp().globalData.timestamp
    }
    
    // 保存情绪记录
    emotionData.addEmotion(emotion)
    
    // 返回首页
    wx.navigateBack({
      delta: 4 // 返回到首页
    })
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack()
  }
})