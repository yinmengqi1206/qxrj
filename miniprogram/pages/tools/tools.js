Page({
  data: {
    tools: [
      {
        id: '2048',
        name: '2048',
        icon: '/images/icons/2048.png',
        path: '/tools/pages/tools-2048/tools-2048'
      },
      {
        id: 'draw',
        name: '解压涂鸦板',
        icon: '/images/icons/draw.png',
        path: '/tools/pages/tools-draw/tools-draw'
      },
      {
        id: 'meditation',
        name: '正念训练',
        icon: '/images/icons/meditation.png',
        path: '/tools/pages/tools-meditation/tools-meditation'
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
