Page({
  data: {
    tools: [
      {
        id: '2048',
        name: '2048游戏',
        icon: '/images/icons/2048.png',
        path: '/pages/tools-2048/tools-2048'
      },
      {
        id: 'draw',
        name: '涂鸦板',
        icon: '/images/icons/draw.png',
        path: '/pages/tools-draw/tools-draw'
      }
    ]
  },

  onToolTap(e) {
    const { path } = e.currentTarget.dataset;
    wx.navigateTo({
      url: path
    });
  }
});
