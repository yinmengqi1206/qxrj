Page({
  data: {
    penColor: '#000000',
    lineWidth: 4,
    canvasWidth: 0,
    canvasHeight: 0,
    isDrawing: false,
    colors: ['#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
  },

  onLoad() {
    const { windowWidth, windowHeight } = wx.getSystemInfoSync();
    // 设置画布大小，留出顶部工具栏空间
    this.setData({
      canvasWidth: windowWidth,
      canvasHeight: windowHeight - 100
    });
    
    // 获取canvas上下文
    this.ctx = wx.createCanvasContext('drawCanvas');
    this.ctx.setLineCap('round');
    this.ctx.setLineJoin('round');
    this.setLineWidth();
    this.setStrokeStyle();
  },

  setLineWidth() {
    this.ctx.setLineWidth(this.data.lineWidth);
  },

  setStrokeStyle() {
    this.ctx.setStrokeStyle(this.data.penColor);
  },

  touchStart(e) {
    const { x, y } = e.touches[0];
    this.setData({ isDrawing: true });
    this.startX = x;
    this.startY = y;
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  },

  touchMove(e) {
    if (!this.data.isDrawing) return;
    const { x, y } = e.touches[0];
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.ctx.draw(true);
    this.startX = x;
    this.startY = y;
  },

  touchEnd() {
    this.setData({ isDrawing: false });
  },

  // 选择颜色
  selectColor(e) {
    const color = e.currentTarget.dataset.color;
    this.setData({ penColor: color });
    this.setStrokeStyle();
  },

  // 调整画笔粗细
  adjustLineWidth(e) {
    const width = parseInt(e.currentTarget.dataset.width);
    this.setData({ lineWidth: width });
    this.setLineWidth();
  },

  // 清空画布
  clearCanvas() {
    wx.showModal({
      title: '提示',
      content: '确定要清空画布吗？',
      success: (res) => {
        if (res.confirm) {
          this.ctx.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeight);
          this.ctx.draw();
        }
      }
    });
  },

  // 保存图片
  saveImage() {
    wx.canvasToTempFilePath({
      canvasId: 'drawCanvas',
      success: (res) => {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            });
          },
          fail: (err) => {
            console.error('保存失败', err);
            wx.showToast({
              title: '保存失败',
              icon: 'error'
            });
          }
        });
      },
      fail: (err) => {
        console.error('生成图片失败', err);
        wx.showToast({
          title: '生成图片失败',
          icon: 'error'
        });
      }
    });
  }
});
