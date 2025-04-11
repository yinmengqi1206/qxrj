import utils from "../../utils/paint-util";
import { recordPointsFun, startTouch, reDraw, drawBack, clearPoints, clearDraw } from '../../utils/paint.js';
// painting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 参数作用可以参考painting2
    prevPosition: [-1, -1],
    btnInfo: [
      {
        type: 'width',
        background: '/images/icons/width.png'
      },
      {
        type: 'color',
        background: '/images/icons/color.png'
      },
      {
        type: 'clear',
        background: '/images/icons/clean.png'
      },
      {
        type: 'save',
        background: '/images/icons/save.png'
      }
    ],
    width: false,
    color: false,
    clear: false,
    r: 33,
    g: 33,
    b: 33,
    w: 10,
    eraser: false,
    canvasHeight: 50, // 其实这个是操作栏的高度，不是canvas的高度。。直接使用100vh，因此不需要读取设备的宽高
    scope: false, // 是否获得权限
    saving: false, // 是否保存中
    pageType: 'whiteBoard',
    bgColor: 'white',
    showHighLight: false,
    movePosition: [-1, -1],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 确定页面类型（普通的白板涂鸦和荧光涂鸦）
    const tempObj = {
      bgColor: options.pageType === 'whiteBoard' ? 'white' : 'black',
      pageType: options.pageType,
    }
    if (options.pageType === 'highlighter') {
      tempObj.r = 255;
      tempObj.g = 255;
      tempObj.b = 255;
    }
    this.setData({
      ...tempObj
    })
    // 获取系统信息设置canvas尺寸
    const systemInfo = wx.getSystemInfoSync();
    this.canvasWidth = systemInfo.windowWidth;
    this.canvasHeight = systemInfo.windowHeight - 60; // 减去底部工具栏高度
    
    // 建立空白页并检查权限
    let ctx = wx.createCanvasContext('myCanvas');
    ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.setFillStyle(tempObj.bgColor);
    ctx.fill();
    ctx.draw();
    let that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.setData({
            scope: true,
          })
        }
      }
    })
  },

  touchStart: function (e) {
    this.setData({
      color: false,
      width: false,
      canvasHeight: 50,
      prevPosition: [e.touches[0].x, e.touches[0].y],
      movePosition: [e.touches[0].x, e.touches[0].y],
    });
    const { r, g, b } = this.data;
    let color = `rgb(${r},${g},${b})`;
    let width = this.data.w;
    startTouch(e, color, width);
  },

  touchMove: function (e) {
    const { r, g, b, prevPosition, movePosition, pageType, eraser, w, showHighLight } = this.data;
    // 触摸，绘制中。。
    const ctx = wx.createCanvasContext('myCanvas');
    // 画笔的颜色
    let color = `rgb(${r},${g},${b})`;
    let width = w;
    if (eraser) {
      color = {
        whiteBoard: '#fff',
        highlighter: '#000',
      }[pageType];
      ctx.setShadow(0, 0, 0, color);
      width = 20;
    }

    // 获取当前触摸点坐标
    const currentX = e.touches[0].x;
    const currentY = e.touches[0].y;

    // 使用前一点和当前点计算贝塞尔曲线控制点
    const controlX = prevPosition[0];
    const controlY = prevPosition[1];
    
    // 使用当前点和控制点的中点作为终点，使线条更平滑
    const endX = (currentX + controlX) / 2;
    const endY = (currentY + controlY) / 2;

    ctx.setLineWidth(width);
    ctx.setStrokeStyle(color);
    if ((pageType === 'highlighter' && !eraser) || (showHighLight && !eraser)) {
      ctx.setShadow(0, 0, 30, `rgba(${r},${g},${b},0.6)`);
    }
    ctx.setLineCap('round');
    ctx.setLineJoin('round');
    
    // 从上一个移动点开始
    ctx.moveTo(...movePosition);
    
    // 使用贝塞尔曲线创建平滑路径
    ctx.quadraticCurveTo(controlX, controlY, endX, endY);
    ctx.stroke();
    ctx.draw(true);

    // 更新位置
    this.setData({
      prevPosition: [currentX, currentY],
      movePosition: [endX, endY]
    });
    recordPointsFun(e, this);
  },

  touchEnd() {
    // reDraw(this);
  },

  tapBtn: function (e) {
    utils.tapBtn(e, this, 1);
  },
  // 修改画笔颜色
  changeColor: function (e) {
    utils.changeColor(e, this);
  },
  // 修改画笔宽度
  changeWidth: function (e) {
    utils.changeWidth(e, this, 130 + e.detail.value, 1)
  },

  tapDraBack (e) {
    drawBack(this);
  },

  clearCanvas: function () {
    // 重置
    let ctx = wx.createCanvasContext('myCanvas');
    ctx.rect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.setFillStyle(this.data.bgColor);
    ctx.fill();
    ctx.draw();
    this.setData({
      clear: false,
      canvasHeight: 50
    })
  },

  setEraser() {
    utils.setEraser(this);
  },

  changeHighLight() {
    this.setData({ showHighLight: !this.data.showHighLight });
  },

  onShow() {
    clearPoints();
  },
})
