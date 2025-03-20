// app.js
App({
  onLaunch: function() {
    // 初始化云开发环境
    wx.cloud.init({
      env: 'cloud1-9g3c4a60b42522bd', // 必填！替换为实际环境ID
      traceUser: true, // 记录用户访问日志（可选）
    });
    // 初始化全局数据
    this.globalData = {
      selectedEmotion: null,
      selectedDetails: [],
      recordType: ''
    }
  },
  
  globalData: {
    timestamp: new Date().getTime(),
    selectedEmotion: null,
    selectedDetails: [],
    recordType: ''
  }
})