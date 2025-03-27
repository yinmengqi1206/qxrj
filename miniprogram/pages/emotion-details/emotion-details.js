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
      if (type === 'veryUnhappy') {
        return [
          "痛苦", "绝望", "无助", "崩溃", "伤心",
          "怨恨", "悲切", "悲伤", "烦躁", "愤怒",
          "失落", "孤独", "委屈", "焦虑", "悔恨",
          "内疚", "困惑", "害怕", "疲惫", "哀怨",
        ];
      } else if (type === 'unhappy') {
        return [
          "烦闷", "苦恼", "无奈", "忧虑", "沉闷",
          "伤感", "郁闷", "失意", "焦心", "压抑",
          "遗憾", "心酸", "烦恼", "茫然", "失望",
          "倦怠", "无聊", "孤单", "怅然", "憋屈",
        ];
      } else if (type === 'slightlyUnhappy') {
        return [
          "疲乏", "低落", "惋惜", "疑虑", "孤单",
          "不安", "轻怅", "无味", "不悦", "牵挂",
          "倦意", "微怅", "嫌弃", "冷淡", "失神",
          "迷茫", "闷闷", "寂寥", "尴尬", "黯然",
        ];
      } else if (type === 'neutral') {
        return [
          "平静", "专注", "放松", "满足", "安心",
          "无聊", "疲惫", "困惑", "好奇", "分心",
          "期待", "怀旧", "耐心", "思考", "冷静",
          "淡定", "平和", "安逸", "自在", "清爽",
        ];
      } else if (type === 'slightlyHappy') {
        return [
          "欢快", "满意", "轻松", "自在", "愉快",
          "微笑", "惬意", "欣慰", "甜美", "舒畅",
          "雀跃", "宁静", "乐观", "愉悦", "轻快",
          "平和", "满足", "安逸", "柔和", "喜悦",
        ];
      } else if (type === 'happy') {
        return [
          "开心", "幸福", "畅快", "欣喜", "激动",
          "兴奋", "愉悦", "安乐", "欢乐", "甜蜜",
          "振奋", "惬意", "欢乐", "开怀", "喜悦",
          "满足", "怡然", "欢腾", "热情", "快活",
        ];
      } else if (type === 'veryHappy') {
        return [
          "狂喜", "乐极", "喜悦", "满足", "欢腾",
          "兴奋", "开怀", "甜蜜", "激动", "欢乐",
          "振奋", "惬意", "喜庆", "心欢", "畅快",
          "欢快", "安乐", "喜气", "欣慰", "怡然",
        ];
      } else {
        return ["未知情绪"]; // 如果情绪类型无法匹配
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