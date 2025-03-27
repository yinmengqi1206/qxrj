const emotionData = require('../../utils/emotion-data.js')
const siliconflow = require('../../utils/siliconflow.js')

// 定义EmotionBall类来管理每个情绪球的状态和动画
class EmotionBall {
  constructor(emotion, x, y, ctx, canvas, canvasWidth, canvasHeight, dpr) {
    this.emotion = emotion // 保存完整的情绪数据
    this.x = x
    this.y = y
    this.type = emotion.type
    this.dpr = dpr
    this.radius = 15 // 更小的尺寸
    this.baseRadius = 15 
    this.targetRadius = 15
    // 降低运动速度
    this.dx = (Math.random() - 0.5) * 1.5
    this.dy = (Math.random() - 0.5) * 1.5
    // 初始位置向中心偏移
    this.centerX = x
    this.centerY = y
    this.maxOffset = Math.min(canvasWidth, canvasHeight) / 4 // 限制运动范围
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
    // 直接使用坐标进行碰撞检测，因为已经在相同的坐标系中
    const distance = Math.sqrt(
      Math.pow(touchX - this.x, 2) + 
      Math.pow(touchY - this.y, 2)
    )

    // 为了调试
    console.log('Hit test:', {
      ball: { x: this.x, y: this.y },
      touch: { x: touchX, y: touchY },
      distance,
      threshold: this.radius * 2,
      hit: distance <= this.radius * 2
    })

    // 使用两倍半径作为点击范围
    return distance <= this.radius * 2
  }

  loadImage() {
    const img = this.canvas.createImage()
    img.onload = () => {
      this.image = img
      this.alpha = 0
      // 淡入效果
      setTimeout(() => {
        this.targetAlpha = 0.9
      }, Math.random() * 500) // 错开加载时间，使动画更自然
    }
    img.src = `../../images/icons/${this.type}.png`
  }

  update() {
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
    }
    if (this.y + this.radius > this.canvasHeight || this.y - this.radius < 0) {
      this.dy = -this.dy
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

      // 计算实际绘制尺寸（考虑DPR）
      const displayRadius = this.radius * this.dpr

      // 添加发光效果
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
    // 为当前小球添加淡出效果
    if (this.emotionBalls) {
      this.emotionBalls.forEach(ball => {
        ball.targetAlpha = 0
      })
      // 等待淡出动画完成后再切换
      setTimeout(() => {
        this.getEmotions()
      }, 500)
    } else {
      this.getEmotions()
    }
  },

  switchTab: function (e) {
    const tab = e.currentTarget.dataset.tab
    
    // 为当前小球添加淡出效果
    if (this.emotionBalls) {
      this.emotionBalls.forEach(ball => {
        ball.targetAlpha = 0
      })
      
      // 等待淡出动画完成后再切换
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
      // 获取今日所有情绪记录
      emotions = emotionData.getTodayEmotions()
    } else {
      // 获取本周的情绪记录
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

    // 过滤出所有情绪记录（包括当日和瞬时）
    this.setData({ emotions }, () => {
      if (this.canvas) {
        // 如果canvas已存在，清除当前动画
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
        
        // 保存原始尺寸和DPR
        this.dpr = dpr
        this.originalWidth = res[0].width
        this.originalHeight = res[0].height
        
        // 设置canvas的物理像素大小
        canvas.width = this.originalWidth * dpr
        canvas.height = this.originalHeight * dpr
        
        // 缩放上下文以适应DPR
        ctx.scale(dpr, dpr)
        
        this.canvas = canvas
        this.ctx = ctx
        // 保存逻辑尺寸（不考虑DPR）
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
      console.log('Creating balls for emotions:', emotions) // 调试信息
      emotions.forEach(emotion => {
        // 确保emotion对象包含必要的属性
        if (!emotion.type) {
          console.warn('Invalid emotion object:', emotion)
          return
        }

        // 使用已经考虑了dpr的canvas尺寸
        const x = Math.random() * (this.canvasWidth / 2) + this.canvasWidth / 4
        const y = Math.random() * (this.canvasHeight / 2) + this.canvasHeight / 4
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

  // canvas点击事件处理
  onCanvasTouch: function (e) {
    if (!this.emotionBalls || !this.emotionBalls.length) return

    const touch = e.touches[0]
    const { pixelRatio: dpr } = wx.getWindowInfo()

    // 获取canvas在页面中的位置
    wx.createSelectorQuery()
      .select('#emotionCanvas')
      .boundingClientRect()
      .exec((res) => {
        if (!res[0]) return

        const rect = res[0]
        // 计算触摸点在canvas坐标系中的实际位置
        // 将触摸坐标转换为canvas坐标（考虑缩放）
        const canvasX = touch.clientX - rect.left
        const canvasY = touch.clientY - rect.top

        console.log('Debug info:', {
          touch: { clientX: touch.clientX, clientY: touch.clientY },
          rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
          canvas: { x: canvasX, y: canvasY }
        })

        console.log('Emotion balls:', this.emotionBalls.map((ball, index) => ({
          index,
          x: ball.x,
          y: ball.y,
          radius: ball.radius,
          type: ball.type
        })))

        // 检查是否点击到了某个小球
        this.emotionBalls.forEach((ball, index) => {
          if (ball.containsPoint(canvasX, canvasY)) {
            console.log(`Ball ${index} hit:`, {
              ballPos: { x: ball.x, y: ball.y },
              touchPos: { x: canvasX, y: canvasY },
              radius: ball.radius
            })
          }
        })

        const touchedBall = this.emotionBalls.find(ball => ball.containsPoint(canvasX, canvasY))

        if (touchedBall) {
          console.log('Opening detail for ball:', touchedBall.emotion)
          
          // 重置所有小球状态
          this.emotionBalls.forEach(ball => {
            ball.targetRadius = ball.baseRadius
            ball.targetAlpha = 0.9
          })

          // 设置点击的小球动画效果
          touchedBall.targetRadius = touchedBall.baseRadius * 1.4
          touchedBall.targetAlpha = 1

          // 延迟显示弹窗，等待动画完成
          setTimeout(() => {
            touchedBall.targetRadius = touchedBall.baseRadius
            touchedBall.targetAlpha = 0.9
            this.showEmotionDetail(touchedBall.emotion)
          }, 200)
        }
      })
  },

  // 显示情绪详情
  showEmotionDetail: function (emotion) {
    this.setData({
      showModal: true,
      selectedEmotion: emotion
    })
  },

  // 关闭弹窗
  closeModal: function () {
    this.setData({
      showModal: false,
      selectedEmotion: null
    })
  },

  startAnimation: function () {
    if (!this.ctx || !this.emotionBalls) return

    const animate = () => {
      // 清除整个画布（使用原始尺寸 * dpr）
      this.ctx.clearRect(0, 0, this.originalWidth * this.dpr, this.originalHeight * this.dpr)
      
      // 更新并绘制所有小球
      this.emotionBalls.forEach(ball => {
        ball.update() // 更新位置和状态
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

  // 分析情绪
  analyzeEmotion: function() {
    // 检查是否有情绪数据
    if (!this.data.emotions || this.data.emotions.length === 0) {
      this.setData({ showEmptyModal: true });
      return;
    }

    // 显示loading
    this.setData({ showLoadingModal: true });

    // 准备分析的情绪数据
    const emotionsData = this.data.emotions.map(emotion => ({
      type: emotion.type,
      value: emotion.value,
      details: emotion.details || [],
      factors: emotion.factors || [],
      customContext: emotion.customContext || '',
      timestamp: emotion.timestamp
    }));

    // 构建提示词
    const prompt = `您现在是个心理医生小姐姐，请根据我的情绪记录数据，帮我分析情绪,主要从情绪比例和情绪场景来分析，然后并给出一定的心理指导，或鼓励，或认可，希望可以语气温柔，给人力量+${JSON.stringify(emotionsData)}(要求：无需markdown格式)`;

    // 调用分析API
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
        // 隐藏loading，显示分析结果
        this.setData({
          showLoadingModal: false,
          showAnalysisModal: true,
          analysisResult: res
        });
      }
    });
  },

  // 关闭分析结果弹窗
  closeAnalysisModal: function() {
    this.setData({ showAnalysisModal: false });
  },

  // 关闭空数据提示弹窗
  closeEmptyModal: function() {
    this.setData({ showEmptyModal: false });
  },

  // 跳转到记录页面
  goToRecord: function() {
    this.setData({ showEmptyModal: false });
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
})
