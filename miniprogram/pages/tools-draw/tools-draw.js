//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this
    wx.authorize({
      scope: 'scope.writePhotosAlbum',
    })
  }
})
