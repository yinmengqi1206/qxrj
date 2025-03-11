// index.js
Page({
    data: {
      inputPrompt: '',
      imageUrl: '',
      isLoading: false,
      errorMsg: '',
      isGenerating: false
    },
  
    onInputChange(e) {
      this.setData({ inputContent: e.detail.value });
    },
  
    generateImage() {
      if (this.data.isGenerating) {
        wx.showToast({ title: '正在生成，请勿重复点击', icon: 'none' });
        return;
      }
      const content = this.data.inputContent.trim();
      if (!content) {
        wx.showToast({ title: '请输入内容', icon: 'none' });
        return;
      }
      // 执行生成逻辑
      this.setData({ isGenerating: true });
      // 触发浮动动画
      this.setData({ showFloatText: true });
      // 隐藏旧图片
      this.setData({ imageUrl: '' });
      setTimeout(() => {
        this.setData({ showFloatText: false });
        this.requestGenerateImage(content);
      }, 1000);
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
          } else {
            this.handleError('生成失败，请稍后重试');
          }
        },
        fail: (err) => {
          this.handleError('请求失败，请检查网络');
        },
        complete: () => {
          this.setData({ isLoading: false });
          this.setData({ isGenerating: false });
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