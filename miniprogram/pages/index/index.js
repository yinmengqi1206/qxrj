// pages/index/index.js
const emotionData = require('../../utils/emotion-data.js')
const util = require('../../utils/util.js')
const cloud = require('../../utils/cloud.js')
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
    marks:[
      {
        year: 2025,
        month: 3,
        day: 10,
        type: "schedule"
      }
    ]
  },
  handleLoad() {
    const calendar = this.selectComponent('#calendar');
    //calendar.getMarks = marks;
    // 如果你使用了其他插件，比如 WxCalendar.use(AnyPlugin)，则可以
    // const calendar = ... as CalendarExport<[typeof AnyPlugin]>;
  },
  onLoad: function() {
    this.updateData(new Date(getApp().globalData.timestamp || Date.now()),true)
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
    this.updateData(new Date(getApp().globalData.timestamp))
  },
  calendarBindclick(detail){
    const calendarDate  = detail.detail.checked;
    //year: 2025,month: 3,day: 1,today: false
    const date = new Date(calendarDate.year, calendarDate.month-1, calendarDate.day)
    this.updateData(date)
    this.hideCalendar(); // 点击日历事件后隐藏浮层
  },
  
  updateData: function(date = new Date()) {
    // 用于去重的 Set
    const uniqueDates = new Set();
    //初始化日历标记
    const marks =  emotionData.getEmotions().map((item) => {
      // 将时间戳转换为日期对象
      const date = new Date(item.timestamp);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 月份从 0 开始，需要 +1
      const day = date.getDate();
  
      // 生成唯一键（年月日）
      const dateKey = `${year}-${month}-${day}`;
  
      // 如果日期已经存在，跳过
      if (uniqueDates.has(dateKey)) {
        return null;
      }
  
      // 添加到 Set 中
      uniqueDates.add(dateKey);
  
      // 返回 marks 对象
      return {
        year,
        month,
        day,
        type: "schedule", // 固定类型
      };
    })
    .filter(Boolean); // 过滤掉 null 值
    this.setData({
      marks
    })
    //渲染页面数据
    getApp().globalData.timestamp = date.getTime();
    let formattedDate = `${date.getMonth() + 1}月${date.getDate()}日`;
    //判断是不是今天
    const today = util.isToday(date);
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
      url: '/index/pages/emotion-type/emotion-type'
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