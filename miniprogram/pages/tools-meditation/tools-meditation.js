Page({
  data: {
    isPlaying: false,
    currentTime: 0,
    duration: 300, // 默认5分钟
    timer: null,
    backgroundAudioManager: null
  },

  onLoad() {
    //this.initBackgroundAudio();
  },

  initBackgroundAudio() {
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.title = '正念冥想';
    backgroundAudioManager.epname = '正念冥想';
    backgroundAudioManager.singer = '情绪日记';
    backgroundAudioManager.coverImgUrl = 'https://cdn.vspo.cn/acl/5min.gif';
    // 这里需要替换成实际的音频文件URL
    backgroundAudioManager.src = 'https://cdn.vspo.cn/acl/5min.mp3';
    this.setData({
      backgroundAudioManager
    });
  },

  startMeditation() {
    // 直接记录情绪
    emotionData.addEmotion({
      type: 'neutral',
      name: '不悲不喜',
      value: 50,
      details: ['平静',"放松","安心"],
      factors: ['正念训练'],
      customContext: '正念冥想，放松心情，抱抱自己~',
      recordType: 'current',
      timestamp: new Date().getTime()
    });
    this.initBackgroundAudio();
    if (this.data.isPlaying) return;
    
    this.setData({
      isPlaying: true
    });

    this.data.backgroundAudioManager.play();
    
    const timer = setInterval(() => {
      if (this.data.currentTime >= this.data.duration) {
        this.stopMeditation();
        return;
      }
      
      this.setData({
        currentTime: this.data.currentTime + 1
      });
    }, 1000);

    this.setData({ timer });
  },

  stopMeditation() {
    if (!this.data.isPlaying) return;
    
    clearInterval(this.data.timer);
    this.data.backgroundAudioManager.stop();
    
    this.setData({
      isPlaying: false,
      currentTime: 0,
      timer: null
    });
  },

  onUnload() {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
    if (this.data.backgroundAudioManager) {
      this.data.backgroundAudioManager.stop();
    }
  },

  setDuration(e) {
    const duration = e.currentTarget.dataset.duration;
    this.setData({ duration });
  },

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
})
