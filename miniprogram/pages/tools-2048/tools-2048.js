var Board = require("./grid.js");
var Main = require("./main.js");
const emotionData = require('../../utils/emotion-data.js');

Page({ 
  data: {
    hidden: false,
    start: "开始游戏",
    num: [],
    score: 0,
    bestScore: 0, // 最高分
    endMsg: '',
    over: false  // 游戏是否结束 
  },
  // 页面渲染完成
  onReady: function () {
    if(!wx.getStorageSync("highScore")) {
      wx.setStorageSync('highScore', 0);
    }
    
    // 检查是否有保存的游戏
    const savedGame = wx.getStorageSync('currentGame');
    if(savedGame) {
      this.restoreGame(savedGame);
    } else {
      this.gameStart();
    }
  },

  // 恢复保存的游戏
  restoreGame: function(savedGame) {
    var main = new Main(4);
    this.setData({
      main: main,
      bestScore: wx.getStorageSync('highScore'),
      hidden: true,
      over: false,
      score: savedGame.score,
      num: savedGame.grid,
      start: "重新开始"
    });
    this.data.main.__proto__ = main.__proto__;
    this.data.main.board.grid = savedGame.grid;
  },
  gameStart: function() {  // 游戏开始
    // 清除保存的游戏
    wx.removeStorageSync('currentGame');
    var main = new Main(4);
    this.setData({
      main: main,
      bestScore: wx.getStorageSync('highScore')
    });
    this.data.main.__proto__ = main.__proto__;
    
    this.setData({
      hidden: true,
      over: false,
      score: 0,
      num: this.data.main.board.grid
    });  
  },
  gameOver: function() {  // 游戏结束
    this.setData({
      over: true 
    });
    // 清除保存的游戏
    wx.removeStorageSync('currentGame');
  
    if (this.data.score >= 2048) {
      this.setData({ 
        endMsg: '恭喜达到2048,已帮您记录情绪！'
      });
      wx.setStorageSync('highScore', this.data.score);
      
      // 直接记录情绪
      emotionData.addEmotion({
        type: 'veryHappy',
        name: '非常愉快',
        value: 100,
        details: ['兴奋',"满足"],
        factors: ['游戏'],
        customContext: '轻轻松松，2048，不服来战',
        recordType: 'current',
        timestamp: new Date().getTime()
      });
      
    } else if (this.data.score > this.data.bestScore) {
      this.setData({
        endMsg: '创造新纪录,已帮您记录情绪！' 
      }); 
      wx.setStorageSync('highScore', this.data.score);
      
      // 直接记录情绪
      emotionData.addEmotion({
        type: 'slightlyHappy',
        name: '有点愉快',
        value: 70,
        details: ['欢快', '满意'],
        factors: ['游戏'],
        customContext: `哈哈，破纪录了，${this.data.score}分`,
        recordType: 'current',
        timestamp: new Date().getTime()
      });
    } else {
      this.setData({
        endMsg: '游戏结束！'
      }); 
    } 
  },
  // 触摸
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStart: function(ev) { // 触摸开始坐标
    var touch = ev.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

  },
  touchMove: function(ev) { // 触摸最后移动时的坐标
    var touch = ev.touches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
  },
  touchEnd: function() {
    var disX = this.touchStartX - this.touchEndX;
    var absdisX = Math.abs(disX);
    var disY = this.touchStartY - this.touchEndY;
    var absdisY = Math.abs(disY);

    if(this.data.main.isOver()) { // 游戏是否结束
      this.gameOver();
    } else {
      if (Math.max(absdisX, absdisY) > 10) { // 确定是否在滑动
          this.setData({
            start: "重新开始",
          });
        var direction = absdisX > absdisY ? (disX < 0 ? 1 : 3) : (disY < 0 ? 2 : 0);  // 确定移动方向
        var data = this.data.main.move(direction);
        this.updateView(data);
      }   
    }      
  },
  updateView(data) {
    var max = 0;
    for(var i = 0; i < 4; i++)
      for(var j = 0; j < 4; j++)
        if(data[i][j] != "" && data[i][j] > max)
          max = data[i][j];
    
    // 保存当前游戏状态
    wx.setStorageSync('currentGame', {
      grid: data,
      score: max
    });
    
    this.setData({
      num: data,
      score: max
    });
  },
  onShareAppMessage: function() {
    return {
      title: '2048小游戏',
      desc: '来试试你能达到多少分',
      path: '/page/user?id=123'
    }
  }
})
