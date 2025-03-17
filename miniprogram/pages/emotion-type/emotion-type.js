// pages/emotion-type/emotion-type.js
Page({
  data: {
    
  },
  
  onLoad: function() {
    
  },
  
  selectRecordType: function(e) {
    const recordType = e.currentTarget.dataset.type
    
    // 将选择的记录类型存储到全局数据
    const app = getApp()
    app.globalData.recordType = recordType
    
    // 导航到情绪选择页面
    wx.navigateTo({
      url: '/pages/emotion-selector/emotion-selector'
    })
  },
  
  goBack: function() {
    wx.navigateBack()
  }
})