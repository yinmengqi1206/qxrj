// utils/util.js

// 格式化时间
function formatTime(date) {
  const hour = date.getHours()
  const minute = date.getMinutes()
  
  return [hour, minute].map(formatNumber).join(':')
}

// 格式化数字
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime,
  formatNumber
}