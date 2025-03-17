// 原代码改为云函数调用
function call(functionName,content) {
  return new Promise((resolve) => {
    wx.cloud.callFunction({
      name: 'xxsc', // 需与云函数目录名一致（默认同目录名）
      data: {
        type: functionName, // 触发对应路由
        content: content // 传递给云函数的参数
      },
      success: (res) => {
        console.log('云函数调用成功:', res);
        // 统一响应结构处理
        resolve(res.result.code === 0 ? res.result.data : '0');
      },
      fail: (err) => {
        console.error('云函数调用失败:', err);
        resolve('0');
      }
    });
  });
}

module.exports = {
  call
}