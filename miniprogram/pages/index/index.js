// pages/index/index.js
const emotionData = require('../../utils/emotion-data.js')
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud.js')
const siliconflow = require('../../utils/siliconflow.js')
const { WxCalendar } = require('@lspriv/wx-calendar/lib');
const { LunarPlugin } = require('@lspriv/wc-plugin-lunar');
const tool = require('../../utils/tool.js')
// 使用农历插件
WxCalendar.use(LunarPlugin);

Page({
  data: {
    formattedDate: '',
    dailyEmotion: null,
    momentaryEmotions: [],
    showCalendar: false,
    today: false,
  },

  onLoad: function() {
    this.updateData(new Date(getApp().globalData.timestamp),true)
    // const stats = emotionData.getEmotionStats()
    // console.log('Emotion stats:', stats);
    // console.log("dailyEmotion", this.data.dailyEmotion)
    // console.log("momentaryEmotions", this.data.momentaryEmotions)
    // cloud.call("getOpenId","你好").then(response => {
    //   console.log('最终结果:', response);
    // });
    // siliconflow.call("你好").then(response => {
    //   console.log('最终结果:', response);
    // });
  },
  onShow: function() {
    this.updateData(new Date(getApp().globalData.timestamp),true)
  },
  calendarBindclick(detail){
    const calendarDate  = detail.detail.checked;
    //year: 2025,month: 3,day: 1,today: false
    const date = new Date(calendarDate.year, calendarDate.month-1, calendarDate.day)
    this.updateData(date,calendarDate.today)
    this.hideCalendar(); // 点击日历事件后隐藏浮层
  },
  
  updateData: function(date = new Date(), today = false) {
    getApp().globalData.timestamp = date.getTime();
    let formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;
    this.setData({
      today
    });
    if (today) {
      formattedDate = formattedDate + "(今天)";
    }

    // 获取当日情绪
    const dailyEmotion = emotionData.getDailyEmotion(date) || null; // 确保 undefined 被处理为 null

    // 获取瞬时情绪列表
    const momentaryEmotions = emotionData.getMomentaryEmotions(date).map(emotion => {
      return {
        ...emotion,
        formattedTime: util.formatTime(new Date(emotion.timestamp))
      };
    });

    this.setData({
      formattedDate,
      dailyEmotion, // 显式设置 dailyEmotion
      momentaryEmotions
    });
  },
  
  startRecording: function() {
    wx.navigateTo({
      url: '/pages/emotion-type/emotion-type'
    })
  },

  toggleCalendar() {
    this.setData({
      showCalendar: !this.data.showCalendar,
    });
  },
  hideCalendar() {
    this.setData({
      showCalendar: false,
    });
  },
  preventTap() {
    // 阻止事件冒泡，防止点击日历内容关闭浮层
  },
})