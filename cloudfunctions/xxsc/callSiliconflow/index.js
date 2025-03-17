const axios = require('axios');

exports.main = async (event, context) => {
  try {
    // 从环境变量获取密钥（安全！）
    const apiKey = 'sk-cazwnotrizbodsuzkoexkyqjohveftjatrnjdnsxwumivlpw';
    
    // 调用第三方API
    const response = await axios.post('https://api.siliconflow.cn/v1/chat/completions', {
      model: "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
      messages: [{
        role: "user",
        content: event.content
      }],
      stream: false,
      max_tokens: 8192,
      temperature: 0.3,
      top_p: 0.7,
      top_k: 50,
      frequency_penalty: 0.5,
      n: 1,
      response_format: { type: "text" }
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // 返回标准化结构
    return {
      code: 0,
      data: response.data.choices[0].message.content
    };
  } catch (error) {
    // 统一错误处理
    console.error('云函数调用失败:', error);
    return {
      code: error.response?.status || 500,
      data: '0'
    };
  }
};