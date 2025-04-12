import utils from "../../../utils/paint-util";
// pixel.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 参数作用可以参考painting2
      btnInfo: [
        {
          type: 'width',
          background: '/tools/images/icons/width.png'
        },
        {
          type: 'color',
          background: '/tools/images/icons/color.png'
        },
        {
          type: 'clear',
          background: '/tools/images/icons/clean.png'
        },
        {
          type: 'save',
          background: '/tools/images/icons/save.png'
        }
      ],
        width: false,
        color: false,
        clear: false,
        r: 33,
        g: 33,
        b: 33,
        w: 30,
        eraser: false,
        canvasHeight: 50, // 其实这个是操作栏的高度，不是canvas的高度。。直接使用100vh，因此不需要读取设备的宽高
        scope: false, // 是否获得权限
        saving: false, // 费否保存中
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 建立空白页并检查权限（如果非填充空白会发现保存为透明）
        let ctx = wx.createCanvasContext('myCanvas');
        ctx.rect(0, 0, 10000, 10000);
        ctx.setFillStyle('white');
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
            clear: false,
            canvasHeight: 50,
        })
    },

    touchMove: function (e) {
        // 触摸，绘制中。。
        let ctx = wx.createCanvasContext('myCanvas');

        if (!this.data.eraser) {
            ctx.setFillStyle("rgb(" + this.data.r + ', ' + this.data.g + ', ' + this.data.b + ')');
        } else {
            ctx.setFillStyle('white');
        }
        ctx.fillRect(Number((e.touches[0].x / this.data.w).toFixed(0)) * this.data.w,
            Number((e.touches[0].y / this.data.w).toFixed(0)) * this.data.w,
            this.data.w,
            this.data.w);
        ctx.draw(true);
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
        this.setData({
            w: e.detail.value,
        })
    },

    clearCanvas: function () {
        // 重置
        let ctx = wx.createCanvasContext('myCanvas');
        ctx.rect(0, 0, 500, 800);
        ctx.setFillStyle('white');
        ctx.fill();
        ctx.draw();
        this.setData({
            clear: false,
            canvasHeight: 50
        })
    },

    chooseEraser: function () {
        // 橡皮擦(其实为白色覆盖涂鸦)
        this.setData({
            eraser: !this.data.eraser,
            clear: false,
            canvasHeight: 50
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },
})
