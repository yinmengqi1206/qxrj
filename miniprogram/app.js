// app.js
const originalPage = Page;

// 重写 Page 构造函数
Page = function(config) {
  // 默认分享配置
  const defaultShareConfig = {
    onShareAppMessage() {
      const currentPage = getCurrentPages().pop();
      return {
        title: '情绪日记小助手',
        path: currentPage.route,
        promise: new Promise(resolve => {
          resolve({
            title: '我正在使用情绪日记小助手，一起来试试吧！'
          });
        })
      };
    },
    onShareTimeline() {
      const promise = new Promise(resolve => {
        resolve({
          title: '我正在使用情绪日记小助手，一起来试试吧！'
        })
      })
      return {
        title: '情绪日记小助手',
        path: currentPage.route,
        promise 
      }
    }
  };

  // 合并配置（页面自定义配置优先）
  const mergedConfig = {
    ...defaultShareConfig,
    ...config,
    // 特殊处理分享方法：如果页面自定义了分享，则覆盖默认
    onShareAppMessage: config.onShareAppMessage || defaultShareConfig.onShareAppMessage,
    onShareTimeline: config.onShareTimeline || defaultShareConfig.onShareTimeline
  };

  originalPage(mergedConfig);
};
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
    timestamp: null,
    selectedEmotion: null,
    selectedDetails: [],
    recordType: ''
  }
})