const emotionData = require('../../utils/emotion-data.js')
const siliconflow = require('../../utils/siliconflow.js')

// 定义EmotionBall类来管理每个情绪球的状态和动画
class EmotionBall {
  constructor(emotion, x, y, ctx, canvas, canvasWidth, canvasHeight, dpr) {
    this.emotion = emotion
    this.x = x
    this.y = y
    this.type = emotion.type
    this.dpr = dpr
    this.radius = 12 // 更小的尺寸
    this.baseRadius = 12 
    this.targetRadius = 12
    // 降低运动速度
    this.dx = (Math.random() - 0.5) * 0.8
    this.dy = (Math.random() - 0.5) * 0.8
    // 初始位置向中心偏移
    this.centerX = x
    this.centerY = y
    this.maxOffset = Math.min(canvasWidth, canvasHeight) / 4
    this.ctx = ctx
    this.canvas = canvas
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.image = null
    this.alpha = 0
    this.targetAlpha = 0.9
    this.loadImage()
  }

  // 检查点是否在小球内
  containsPoint(touchX, touchY) {
    const distance = Math.sqrt(
      Math.pow(touchX - this.x, 2) + 
      Math.pow(touchY - this.y, 2)
    )
    return distance <= this.radius * 2
  }

  // 检查是否与其他小球碰撞
  checkCollision(otherBall) {
    const dx = this.x - otherBall.x
    const dy = this.y - otherBall.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < (this.radius + otherBall.radius) * 2) {
      // 计算碰撞角度
      const angle = Math.atan2(dy, dx)
      
      // 调整位置防止重叠
      const overlap = (this.radius + otherBall.radius) * 2 - distance
      const moveX = (overlap / 2) * Math.cos(angle)
      const moveY = (overlap / 2) * Math.sin(angle)
      
      this.x += moveX
      this.y += moveY
      otherBall.x -= moveX
      otherBall.y -= moveY
      
      // 交换速度分量
      const tempDx = this.dx
      const tempDy = this.dy
      this.dx = otherBall.dx
      this.dy = otherBall.dy
      otherBall.dx = tempDx
      otherBall.dy = tempDy
    }
  }

  loadImage() {
    const img = this.canvas.createImage()
    img.onload = () => {
      this.image = img
      this.alpha = 0
      setTimeout(() => {
        this.targetAlpha = 0.9
      }, Math.random() * 500)
    }
    img.src = `../../images/icons/${this.type}.png`
  }

  update(otherBalls) {
    // 处理与其他小球的碰撞
    if (otherBalls) {
      otherBalls.forEach(ball => {
        if (ball !== this) {
          this.checkCollision(ball)
        }
      })
    }

    // 计算与中心点的距离
    const distanceX = this.x - this.centerX
    const distanceY = this.y - this.centerY

    // 如果超出最大偏移范围，改变方向
    if (Math.abs(distanceX) > this.maxOffset) {
      this.dx = -Math.sign(distanceX) * Math.abs(this.dx)
    }
    if (Math.abs(distanceY) > this.maxOffset) {
      this.dy = -Math.sign(distanceY) * Math.abs(this.dy)
    }

    // 应用边界限制
    if (this.x + this.radius > this.canvasWidth || this.x - this.radius < 0) {
      this.dx = -this.dx
      this.x = Math.max(this.radius, Math.min(this.canvasWidth - this.radius, this.x))
    }
    if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0) {
      this.dy = -this.dy
      this.y = Math.max(this.radius, Math.min(this.canvasHeight - this.radius, this.y))
    }

    // 更新位置
    this.x += this.dx
    this.y += this.dy

    // 更新透明度
    if (this.alpha < this.targetAlpha) {
      this.alpha = Math.min(this.alpha + 0.03, this.targetAlpha)
    } else if (this.alpha > this.targetAlpha) {
      this.alpha = Math.max(this.alpha - 0.03, this.targetAlpha)
    }

    // 更新半径
    if (this.radius < this.targetRadius) {
      this.radius = Math.min(this.radius + 2, this.targetRadius)
    } else if (this.radius > this.targetRadius) {
      this.radius = Math.max(this.radius - 2, this.targetRadius)
    }
  }

  draw() {
    if (this.image) {
      this.ctx.save()
      this.ctx.globalAlpha = this.alpha

      const displayRadius = this.radius * this.dpr

      if (this.radius > this.baseRadius) {
        this.ctx.shadowColor = '#007AFF'
        this.ctx.shadowBlur = 15 * this.dpr
      }

      this.ctx.drawImage(
        this.image,
        this.x - displayRadius,
        this.y - displayRadius,
        displayRadius * 2,
        displayRadius * 2
      )
      this.ctx.restore()
    }
  }
}

Page({
  data: {
    currentTab: 'day',
    emotions: [],
    showModal: false,
    selectedEmotion: null,
    showLoadingModal: false,
    showAnalysisModal: false,
    showEmptyModal: false,
    analysisResult: ''
  },

  onLoad: function () {
    this.getEmotions()
  },

  onShow: function () {
    if (this.emotionBalls) {
      this.emotionBalls.forEach(ball => {
        ball.targetAlpha = 0
      })
      setTimeout(() => {
        this.getEmotions()
      }, 500)
    } else {
      this.getEmotions()
    }
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    
    if (this.emotionBalls) {
      this.emotionBalls.forEach(ball => {
        ball.targetAlpha = 0
      })
      
      setTimeout(() => {
        this.setData({ currentTab: tab })
        this.getEmotions()
      }, 500)
    } else {
      this.setData({ currentTab: tab })
      this.getEmotions()
    }
  },

  getEmotions: function () {
    const { currentTab } = this.data
    let emotions = []
    if (currentTab === 'day') {
      emotions = emotionData.getTodayEmotions()
    } else {
      const today = new Date()
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(weekStart)
        date.setDate(weekStart.getDate() + i)
        const dayEmotions = emotionData.getTodayEmotions(date)
        emotions = emotions.concat(dayEmotions)
      }
    }

    this.setData({ emotions }, () => {
      if (this.canvas) {
        if (this.animationFrameId) {
          this.canvas.cancelAnimationFrame(this.animationFrameId)
        }
      }
      this.initCanvas()
    })
  },

  onReady: function () {
    this.initCanvas()
  },

  initCanvas: function () {
    if (typeof wx.createSelectorQuery !== 'function') return

    wx.createSelectorQuery()
      .select('#emotionCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) return

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const { pixelRatio: dpr } = wx.getWindowInfo()
        
        this.dpr = dpr
        this.originalWidth = res[0].width
        this.originalHeight = res[0].height
        
        canvas.width = this.originalWidth * dpr
        canvas.height = this.originalHeight * dpr
        
        ctx.scale(dpr, dpr)
        
        this.canvas = canvas
        this.ctx = ctx
        this.canvasWidth = this.originalWidth
        this.canvasHeight = this.originalHeight

        this.emotionBalls = []
        this.createEmotionBalls()
        this.startAnimation()
      })
  },

  createEmotionBalls: function () {
    const { emotions } = this.data
    this.emotionBalls = []

    if (emotions && emotions.length > 0) {
      emotions.forEach(emotion => {
        if (!emotion.type) return

        // 均匀分布初始位置
        const margin = 40 // 边距
        const x = margin + Math.random() * (this.canvasWidth - margin * 2)
        const y = margin + Math.random() * (this.canvasHeight - margin * 2)
        
        const ball = new EmotionBall(
          emotion,
          x, y,
          this.ctx,
          this.canvas,
          this.canvasWidth,
          this.canvasHeight,
          this.dpr
        )
        this.emotionBalls.push(ball)
      })
    }
  },

  onCanvasTouch: function (e) {
    if (!this.emotionBalls || !this.emotionBalls.length) return

    const touch = e.touches[0]

    wx.createSelectorQuery()
      .select('#emotionCanvas')
      .boundingClientRect()
      .exec((res) => {
        if (!res[0]) return

        const rect = res[0]
        const canvasX = touch.clientX - rect.left
        const canvasY = touch.clientY - rect.top

        const touchedBall = this.emotionBalls.find(ball => ball.containsPoint(canvasX, canvasY))

        if (touchedBall) {
          this.emotionBalls.forEach(ball => {
            ball.targetRadius = ball.baseRadius
            ball.targetAlpha = 0.9
          })

          touchedBall.targetRadius = touchedBall.baseRadius * 1.4
          touchedBall.targetAlpha = 1

          setTimeout(() => {
            touchedBall.targetRadius = touchedBall.baseRadius
            touchedBall.targetAlpha = 0.9
            this.showEmotionDetail(touchedBall.emotion)
          }, 200)
        }
      })
  },

  showEmotionDetail: function (emotion) {
    this.setData({
      showModal: true,
      selectedEmotion: emotion
    })
  },

  closeModal: function () {
    this.setData({
      showModal: false,
      selectedEmotion: null
    })
  },

  startAnimation: function () {
    if (!this.ctx || !this.emotionBalls) return

    const animate = () => {
      this.ctx.clearRect(0, 0, this.originalWidth * this.dpr, this.originalHeight * this.dpr)
      
      this.emotionBalls.forEach(ball => {
        ball.update(this.emotionBalls)
        ball.draw()
      })

      this.animationFrameId = this.canvas.requestAnimationFrame(animate)
    }

    animate()
  },

  onUnload: function () {
    if (this.animationFrameId && this.canvas) {
      this.canvas.cancelAnimationFrame(this.animationFrameId)
    }
  },

  analyzeEmotion: function() {
    if (!this.data.emotions || this.data.emotions.length === 0) {
      this.setData({ showEmptyModal: true });
      return;
    }

    this.setData({ showLoadingModal: true });

    const emotionsData = this.data.emotions.map(emotion => ({
      type: emotion.type,
      value: emotion.value,
      details: emotion.details || [],
      factors: emotion.factors || [],
      customContext: emotion.customContext || '',
      timestamp: emotion.timestamp
    }));

    const prompt = `(要求：1.不使用markdown格式,2.一次性回答，以'祝您生活愉快！'结束)，您现在是个心理医生小姐姐，请根据我的情绪记录数据，帮我分析情绪,主要从情绪比例和情绪场景来分析，然后并给出一定的心理指导，或鼓励，或认可，希望可以语气温柔，给人力量,情绪数据如下:${JSON.stringify(emotionsData)}`;

    siliconflow.call(prompt)
    .then(res => {
      if(res==='0'){
        wx.showToast({
          title: '分析失败，请稍后重试',
          icon: 'none'
        });
        this.setData({ showLoadingModal: false });
        return;
      }else{
        this.setData({
          showLoadingModal: false,
          showAnalysisModal: true,
          analysisResult: res
        });
      }
    });
  },

  closeAnalysisModal: function() {
    this.setData({ showAnalysisModal: false });
  },

  closeEmptyModal: function() {
    this.setData({ showEmptyModal: false });
  },

  goToRecord: function() {
    this.setData({ showEmptyModal: false });
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})
