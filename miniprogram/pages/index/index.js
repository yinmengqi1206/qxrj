// pages/index/index.js
const emotionData = require('../../utils/emotion-data.js')
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud.js')

Page({
  data: {
    formattedDate: '',
    dailyEmotion: null,
    momentaryEmotions: []
  },

  onLoad: function() {
    this.updateData()
    // console.log("dailyEmotion", this.data.dailyEmotion)
    // console.log("momentaryEmotions", this.data.momentaryEmotions)
    // cloud.call("getOpenId","你好").then(response => {
    //   console.log('最终结果:', response);
    // });
  },
  
  onShow: function() {
    this.updateData()
  },
  
  updateData: function() {
    // 获取今天日期
    const today = new Date()
    const formattedDate = `${today.getMonth() + 1}月${today.getDate()}日 今天`
    
    // 获取当日情绪
    const dailyEmotion = emotionData.getDailyEmotion()
    
    // 获取瞬时情绪列表
    const momentaryEmotions = emotionData.getMomentaryEmotions().map(emotion => {
      return {
        ...emotion,
        formattedTime: util.formatTime(new Date(emotion.timestamp))
      }
    })
    
    this.setData({
      formattedDate,
      dailyEmotion,
      momentaryEmotions
    })
  },
  
  startRecording: function() {
    wx.navigateTo({
      url: '/pages/emotion-type/emotion-type'
    })
  },
})