const apiKey = 'sk-cazwnotrizbodsuzkoexkyqjohveftjatrnjdnsxwumivlpw';

function call(content) {
  return new Promise((resolve) => {
    wx.request({
      url: 'https://api.siliconflow.cn/v1/chat/completions',
      method: 'POST',
      header: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      data: {
        "model": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
        "messages": [{
          "role": "user",
          "content": content
        }],
        "stream": false,
        "max_tokens": 8192,
        "temperature": 0.3,
        "top_p": 0.7,
        "top_k": 50,
        "frequency_penalty": 0.5,
        "n": 1,
        "response_format": {
          "type": "text"
        }
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data.choices[0].message.content); // ✅ 成功返回内容
        } else {
          resolve('0'); // ✅ 非200状态码也返回0
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        resolve('0'); // ✅ 网络错误返回0
      }
    });
  });
}

module.exports = {
    call
}