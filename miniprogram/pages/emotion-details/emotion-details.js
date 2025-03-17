// pages/emotion-details/emotion-details.js
Page({
  data: {
    selectedEmotion: null,
    selectedDetails: [],
    detailOptions: [],
    recordType: ''
  },
  
  onLoad: function() {
    // 获取全局数据
    const app = getApp()
    const selectedEmotion = app.globalData.selectedEmotion
    const recordType = app.globalData.recordType
    
    // 根据情绪类型获取详情选项
    const detailOptions = this.getDetailOptions(selectedEmotion.type)
    
    this.setData({
      selectedEmotion,
      detailOptions,
      recordType
    })
  },
  
  // 根据情绪类型获取详情选项
  getDetailOptions: function(type) {
    if (type.includes('Unhappy')) {
      return [
        "愤怒", "焦虑", "害怕", "不堪重负", "羞愧",
        "厌恶", "尴尬", "泪流", "悲伤", "嫉妒",
        "有压力", "忧虑", "内疚", "惊讶", "无望",
        "烦躁", "孤独", "挫败", "失望", "精疲力尽",
        "伤心"
      ]
    } else if (type === 'neutral') {
      return [
        "平静", "专注", "放松", "满足", "安心",
        "无聊", "疲惫", "困惑", "好奇", "分心",
        "期待", "怀旧", "耐心", "思考", "冷静"
      ]
    } else {
      return [
        "快乐", "兴奋", "感激", "满足", "自豪",
        "爱", "希望", "灵感", "平静", "放松",
        "欣赏", "信任", "乐观", "热情", "满足"
      ]
    }
  },
  
  // 切换选择详情
  toggleDetail: function(e) {
    const detail = e.currentTarget.dataset.detail
    const { selectedDetails } = this.data
    
    if (selectedDetails.includes(detail)) {
      // 如果已选中，则取消选中
      this.setData({
        selectedDetails: selectedDetails.filter(d => d !== detail)
      })
    } else {
      // 如果未选中，则添加到选中列表
      this.setData({
        selectedDetails: [...selectedDetails, detail]
      })
    }
  },
  
  // 下一步
  goNext: function() {
    // 将选择的详情存储到全局数据
    const app = getApp()
    app.globalData.selectedDetails = this.data.selectedDetails
    
    // 导航到影响因素页面
    wx.navigateTo({
      url: '/pages/emotion-factors/emotion-factors'
    })
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack()
  }
})