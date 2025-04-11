
const App = getApp();
const recordPoints = App.globalData.recordPoints;

// 记录一条线的起始点，顺便记录一下这条线的颜色和为宽度
export const startTouch = (e, color, width) => {
  recordPoints.push([{
    x: e.touches[0].x,
    y: e.touches[0].y,
    color,
    width,
  }]);
};

// 记录一条线内的每个点
export const recordPointsFun = (move, draw) => {
  const l = recordPoints.length;
  if (l > 0 && Array.isArray(recordPoints[l-1])) {
    recordPoints[l-1].push({
      move: [move.touches[0].x, move.touches[0].y],
      draw: [draw.prevPosition[0], draw.prevPosition[1], (move.touches[0].x + draw.prevPosition[0]) / 2, (move.touches[0].y + draw.prevPosition[1]) / 2]
    });
  }
};

// 绘制过程
export const reDraw = (_this) => {
  const ctx = wx.createCanvasContext('myCanvas');
  // 清空画布
  ctx.clearRect(0, 0, 10000, 10000);
  ctx.setFillStyle(_this.data.bgColor || 'white');
  ctx.fillRect(0, 0, 10000, 10000);

  recordPoints.forEach(line => {
    if (!Array.isArray(line) || line.length === 0) return;
    
    const { width, color, x, y } = line[0];
    // 线的宽度
    ctx.setLineWidth(width);
    // 线的颜色
    ctx.setStrokeStyle(color);
    // 起始位置
    ctx.moveTo(x, y);
    // 这些样式就默认了
    ctx.setLineCap('round');
    ctx.setLineJoin('round');

    if (_this.data.pageType === 'highlighter' && !_this.data.eraser) {
      ctx.setShadow(0, 0, 30, color.replace(')', ', 0.6)').replace('rgb', 'rgba'));
    }

    line.forEach((p, i) => {
      if (i === 0) return;
      if (!p.move || !p.draw) return;
      
      ctx.moveTo(p.move[0], p.move[1]);
      ctx.quadraticCurveTo(p.draw[0], p.draw[1], p.draw[2], p.draw[3]);
      ctx.stroke();
    });
    ctx.draw(true);
  });

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
