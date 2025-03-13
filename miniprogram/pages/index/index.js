// index.js
Page({
    data: {
      inputPrompt: '',
      imageUrl: '',
      isLoading: false,
      errorMsg: '',
      isGenerating: false,
      remainTimes: 0,
    },
    onLoad() {
      const remainTimes = wx.getStorageSync('remainTimes');
      if (typeof remainTimes !== 'number' || isNaN(remainTimes)) {
          // 首次访问初始化为3次
          this.addRemainTimes(3);
      }else {
        this.setData({ remainTimes: remainTimes });
      }

      // 新的一天
      const lastResetDate = wx.getStorageSync('lastResetDate');
      const today = new Date().toDateString();
      if (lastResetDate !== today) {
        //设置为3次
        wx.setStorageSync('remainTimes', 3);
        //清零最大广告次数
        wx.setStorageSync('maxAdCount', 0);
        wx.setStorageSync('lastResetDate', today);
      }
    },
    // 增加剩余次数
    addRemainTimes(times) {
      const remainTimes = wx.getStorageSync('remainTimes') || 0;
      times = remainTimes + times;
      wx.setStorageSync('remainTimes',times);
      this.setData({ remainTimes: times });
    },
  
    onInputChange(e) {
      this.setData({ inputContent: e.detail.value });
    },
  
    generateImage() {
      if (this.data.remainTimes <= 0) {
        wx.showToast({ title: '次数用完啦，去获取次数吧！', icon: 'none' });
        return;
      }
      if (this.data.isGenerating) {
        wx.showToast({ title: '正在生成，请勿重复点击', icon: 'none' });
        return;
      }
      const content = this.data.inputContent;
      if (!content) {
        wx.showToast({ title: '请输入内容', icon: 'none' });
        return;
      }
  
      // 检查已生成次数
      const generatedCount = wx.getStorageSync('generatedCount') || 0;
      const maxAdCount = wx.getStorageSync('maxAdCount') || 0;
      if (generatedCount >= 3 && maxAdCount <= 3) {
        // 清零已生成次数
        wx.setStorageSync('generatedCount', 0);
        //增加最大次数
        wx.setStorageSync('maxAdCount', maxAdCount+1);
        this.startGenerating(content);
        // wx.showModal({
        //   title: '提示',
        //   content: '观看广告，继续使用！',
        //   success: (res) => {
        //     if (res.confirm) {
        //       // 清零已生成次数
        //       wx.setStorageSync('generatedCount', 0);
        //       //增加最大次数
        //       wx.setStorageSync('maxAdCount', maxAdCount+1);
        //       this.startGenerating(content);
        //     }
        //   }
        // });
      } else {
        this.startGenerating(content);
      }
    },
  
    startGenerating(content) {
      // 执行生成逻辑
      this.setData({ isGenerating: true });
      // 触发浮动动画
      this.setData({ showFloatText: true });
      // 隐藏旧图片
      this.setData({ imageUrl: '' });
      wx.showToast({ title: '正在生成，请稍候~', icon: 'none' });
      // 请求生成图片
      this.requestGenerateImage(content);
    },
  
    // 分享回调
    onShareAppMessage() {
      setTimeout(() => {
        this.addRemainTimes(1);
      }, 1000);
      return {
        title: 'AI图片生成神器，输入文字秒出图！',
        path: '/pages/index/index',
        success: (res) => {
          console.log('分享成功', res);
        }
      };
    },
  
    requestGenerateImage(prompt) {
      if (!prompt) {
        wx.showToast({ title: '请输入描述内容', icon: 'none' });
        return;
      }
  
      this.setData({ isLoading: true, errorMsg: '' });
  
      // 替换为你的实际API Token
      const token = 'sk-cazwnotrizbodsuzkoexkyqjohveftjatrnjdnsxwumivlpw';
      
      wx.request({
        url: 'https://api.siliconflow.cn/v1/images/generations',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: "Kwai-Kolors/Kolors",
          prompt: prompt,
          negative_prompt: "",
          image_size: "1024x1024",
          batch_size: 1,
          seed: Math.floor(Math.random() * 10000000000),
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
        success: (res) => {
          console.log(res);
          if (res.statusCode === 200 && res.data.images?.[0]?.url) {
            this.setData({ imageUrl: res.data.images[0].url });
            // 增加已生成次数
            const generatedCount = wx.getStorageSync('generatedCount') || 0;
            wx.setStorageSync('generatedCount', generatedCount + 1);
          } else {
            this.handleError('生成失败，请稍后重试');
          }
        },
        fail: (err) => {
          this.handleError('请求失败，请检查网络');
        },
        complete: () => {
          setTimeout(() => {
            //减次数
            this.addRemainTimes(-1);
            this.setData({ showFloatText: false });
            this.setData({ isLoading: false });
            this.setData({ isGenerating: false });
          }, 1000);
        }
      });
    },
  
    downloadImage() {
      const { imageUrl } = this.data;
      if (!imageUrl) {
          wx.showToast({ title: '没有可下载的图片', icon: 'none' });
          return;
      }
      console.log('imageUrl:', imageUrl);
      wx.showLoading({ title: '保存中...' });
      wx.downloadFile({
          url: imageUrl,
          success: (res) => {
              if (res.statusCode === 200) {
                  wx.saveImageToPhotosAlbum({
                      filePath: res.tempFilePath,
                      success: () => wx.showToast({ title: '保存成功' }),
                      fail: (err) => {
                          if (err.errMsg.includes('auth deny') || err.errMsg.includes('auth denied')) {
                              wx.showModal({
                                  title: '提示',
                                  content: '需要授权保存图片到相册',
                                  showCancel: false,
                                  success: (modalRes) => {
                                      if (modalRes.confirm) {
                                          wx.openSetting();
                                      }
                                  }
                              });
                          } else {
                              wx.showToast({ title: '保存失败', icon: 'none' });
                          }
                      }
                  });
              } else {
                  wx.showToast({ title: '下载失败', icon: 'none' });
              }
          },
          fail: () => {
              wx.showToast({ title: '下载失败', icon: 'none' });
          },
          complete: () => wx.hideLoading()
      });
    },
    onImageLoad() {
      // 图片加载完成后的回调
      this.setData({ isLoading: false });
    },
    handleError(msg) {
      this.setData({ errorMsg: msg });
      wx.showToast({ title: msg, icon: 'none' });
    }
  });