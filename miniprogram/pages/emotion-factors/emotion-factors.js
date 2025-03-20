// pages/emotion-factors/emotion-factors.js
const emotionData = require('../../utils/emotion-data.js')

Page({
  data: {
    selectedEmotion: null,
    selectedDetails: [],
    selectedFactors: [],
    customContext: '',
    recordType: '',
    factorCategories: [
      ["健康", "健身", "自我照顾", "爱好", "身份", "心灵"],
      ["社群", "家人", "朋友", "伴侣", "约会"],
      ["家务", "工作", "教育", "旅行", "天气", "时事", "金钱"]
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
      type: selectedEmotion.type,
      name: selectedEmotion.name,
      value: selectedEmotion.value,
      details: selectedDetails,
      factors: selectedFactors,
      customContext: customContext,
      recordType: recordType
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