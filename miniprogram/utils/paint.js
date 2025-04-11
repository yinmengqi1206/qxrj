
const App = getApp();
const recordPoints = App.globalData.recordPoints;

// 记录一条线的起始点，顺便记录一下这条线的颜色和为宽度
export const startTouch = (e, color, width, _this) => {
  recordPoints.push([{
    x: e.touches[0].x,
    y: e.touches[0].y,
    color,
    width,
    showHighLight: _this.data.showHighLight,
    pageType: _this.data.pageType
  }]);
};

// 记录一条线内的每个点
export const recordPointsFun = (move, draw) => {
  const l = recordPoints.length;
  if (!move?.touches?.[0] || !draw?.prevPosition || !draw?.midPoint) return;
  
  if (l > 0 && Array.isArray(recordPoints[l-1])) {
    recordPoints[l-1].push({
      move: draw.movePosition || move.touches[0],
      control: draw.prevPosition,
      end: draw.midPoint
    });
  }
};

// 绘制过程
export const reDraw = (_this) => {
  const ctx = wx.createCanvasContext('myCanvas');
  // 清空画布
  ctx.clearRect(0, 0, _this.canvasWidth, _this.canvasHeight);
  
  // 如果有背景图片，先绘制背景图片
  if (_this.data.background) {
    ctx.drawImage(_this.data.background, 0, 0, _this.data.canvasWidth, _this.data.canvasHeight);
  } else {
    // 没有背景图片时才填充白色背景
    ctx.setFillStyle(_this.data.bgColor || 'white');
    ctx.fillRect(0, 0, _this.canvasWidth, _this.canvasHeight);
  }

  // 先绘制所有内容，最后一次性draw
  recordPoints.forEach(line => {
    if (!Array.isArray(line) || line.length === 0) return;
    
    const { width, color, x, y, showHighLight, pageType } = line[0];
    ctx.setLineWidth(width);
    ctx.setStrokeStyle(color);
    ctx.setLineCap('round');
    ctx.setLineJoin('round');
    
    // 只使用线条自己的荧光状态，不再使用当前页面状态
    if (showHighLight && !_this.data.eraser) {
      ctx.setShadow(0, 0, 30, color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
    }

    let lastPoint = [line[0].x, line[0].y];
    ctx.beginPath();
    ctx.moveTo(...lastPoint);
    
    line.forEach((p, i) => {
      if (i === 0) return;
      if (!p.control || !p.end) return;
      
      ctx.quadraticCurveTo(p.control[0], p.control[1], p.end[0], p.end[1]);
      lastPoint = p.end;
    });
    
    ctx.stroke();
  });

  // 最后统一draw一次
  ctx.draw();
  
  _this.setData({
    prevPosition: [-1, -1]
  });
};

// 后退
export const drawBack = (_this) => {
  recordPoints.pop();
  reDraw(_this);
};

// 清空globalData里的点数据
export const clearPoints = () => {
  recordPoints.length = 0;
};

export const clearDraw = (e, _this) => {
  const ctx = wx.createCanvasContext('myCanvas');
  const { x, y } = e.touches[0];
  ctx.clearRect(x, y, 20, 20);
  ctx.draw();
}
