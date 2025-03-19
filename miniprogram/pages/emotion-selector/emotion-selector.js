// pages/emotion-selector/emotion-selector.js
Page({
  data: {
    sliderValue: 50,
    selectedEmotion: {
      type: 'neutral',
      name: '不悲不喜',
      color: '#bae6fd',  // 标准浅天蓝
      colorC: '#38bdf8', // 标准深天蓝
      icon: 'circle',
      value: 50
    },
    recordType: ''
  },
  
  onLoad: function() {
    // 获取全局数据中的记录类型
    const app = getApp()
    const recordType = app.globalData.recordType || 'current'
    
    this.setData({
      recordType
    })
  },
  
  // 滑块改变事件
  sliderChange: function(e) {
    const value = e.detail.value
    let emotion = {}
    
    if (value < 15) {
      emotion = {
        type: 'veryUnhappy',
        name: '非常不愉快',
        color: '#e0e7ff',  // 最冷色-淡紫
        colorC: '#6366f1', // 深靛蓝
        icon: 'flower-purple',
        value
      }
    } else if (value < 30) {
      emotion = {
        type: 'unhappy',
        name: '不愉快',
        color: '#c7d2fe',  // 浅蓝紫
        colorC: '#818cf8', // 中等蓝紫
        icon: 'flower-indigo',
        value
      }
    } else if (value < 45) {
      emotion = {
        type: 'slightlyUnhappy',
        name: '有点不愉快',
        color: '#bfdbfe',  // 冷调浅蓝
        colorC: '#60a5fa', // 深天蓝
        icon: 'flower-blue',
        value
      }
    } else if (value < 60) {
      emotion = {
        type: 'neutral',
        name: '不悲不喜',
        color: '#bae6fd',  // 标准浅天蓝
        colorC: '#38bdf8', // 标准深天蓝
        icon: 'circle',
        value
      }
    } else if (value < 75) {
      emotion = {
        type: 'slightlyHappy',
        name: '有点愉快',
        color: '#a7f3d0',  // 淡薄荷绿
        colorC: '#34d399', // 深薄荷绿
        icon: 'flower-green',
        value
      }
    } else if (value < 90) {
      emotion = {
        type: 'happy',
        name: '愉快',
        color: '#fef08a',  // 浅琥珀黄
        colorC: '#facc15', // 深琥珀黄
        icon: 'flower-yellow',
        value
      }
    } else {
      emotion = {
        type: 'veryHappy',
        name: '非常愉快',
        color: '#fed7aa',  // 浅橙
        colorC: '#fb923c', // 深橙
        icon: 'flower-gold',
        value
      }
    }
    
    this.setData({
      sliderValue: value,
      selectedEmotion: emotion
    })
  },
  
  // 触摸开始事件
  touchStart: function(e) {
    // 记录触摸开始位置
    this.startX = e.touches[0].pageX
  },
  
  // 触摸移动事件
  touchMove: function(e) {
    // 计算移动距离
    const moveX = e.touches[0].pageX - this.startX
    
    // 根据移动距离调整滑块值
    if (Math.abs(moveX) > 10) {
      const direction = moveX > 0 ? 1 : -1
      const step = 5
      
      let newValue = this.data.sliderValue + (direction * step)
      newValue = Math.max(0, Math.min(100, newValue))
      
      this.sliderChange({
        detail: { value: newValue }
      })
      
      // 更新起始位置
      this.startX = e.touches[0].pageX
    }
  },
  
  // 触摸结束事件
  touchEnd: function() {
    // 清除起始位置
    this.startX = 0
  },
  
  // 下一步
  goNext: function() {
    // 将选择的情绪存储到全局数据
    const app = getApp()
    app.globalData.selectedEmotion = this.data.selectedEmotion
    
    // 导航到情绪详情页面
    wx.navigateTo({
      url: '/pages/emotion-details/emotion-details'
    })
  },
  
  // 返回上一页
  goBack: function() {
    wx.navigateBack()
  }
})