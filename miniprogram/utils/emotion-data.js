// utils/emotion-data.js

// 获取所有情绪记录
function getEmotions() {
  try {
    const storedEmotions = wx.getStorageSync('emotions')
    if (storedEmotions) {
      return JSON.parse(storedEmotions)
    }
  } catch (error) {
    console.error('获取情绪数据失败', error)
  }

  return []
}

// 添加新的情绪记录
function addEmotion(emotion) {
  const newEmotion = {
    ...emotion,
    id: Date.now().toString(),
    timestamp: Date.now()
  }

  let emotions = getEmotions()

  // 如果是当日情绪，则替换之前的当日情绪记录
  if (emotion.recordType === 'daily') {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTimestamp = today.getTime()
    
    // 过滤掉今天的当日情绪记录
    emotions = emotions.filter(e => !(e.recordType === 'daily' && e.timestamp >= todayTimestamp))
  }

  emotions = [newEmotion, ...emotions]

  try {
    wx.setStorageSync('emotions', JSON.stringify(emotions))
  } catch (error) {
    console.error('保存情绪数据失败', error)
  }

  return newEmotion
}

// 获取今日情绪记录
function getTodayEmotions() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTimestamp = today.getTime()

  const emotions = getEmotions()
  return emotions.filter(emotion => emotion.timestamp >= todayTimestamp)
}

// 获取当日整体情绪
function getDailyEmotion() {
  const todayEmotions = getTodayEmotions()
  return todayEmotions.find(emotion => emotion.recordType === 'daily')
}

// 获取瞬时情绪列表
function getMomentaryEmotions() {
  const todayEmotions = getTodayEmotions()
  return todayEmotions.filter(emotion => emotion.recordType === 'current')
}

// 获取情绪统计数据
function getEmotionStats() {
  const stats = {
    veryHappy: 0,
    happy: 0,
    neutral: 0,
    unhappy: 0,
    veryUnhappy: 0
  }

  const emotions = getEmotions()
  emotions.forEach(emotion => {
    if (emotion.type === 'veryHappy') {
      stats.veryHappy++
    } else if (emotion.type === 'happy') {
      stats.happy++
    } else if (emotion.type === 'neutral') {
      stats.neutral++
    } else if (emotion.type === 'unhappy') {
      stats.unhappy++
    } else if (emotion.type === 'veryUnhappy') {
      stats.veryUnhappy++
    }
  })

  return stats
}

// 删除情绪记录
function deleteEmotion(id) {
  let emotions = getEmotions()
  emotions = emotions.filter(emotion => emotion.id !== id)

  try {
    wx.setStorageSync('emotions', JSON.stringify(emotions))
    return true
  } catch (error) {
    console.error('删除情绪数据失败', error)
    return false
  }
}

module.exports = {
  getEmotions,
  addEmotion,
  getTodayEmotions,
  getDailyEmotion,
  getMomentaryEmotions,
  getEmotionStats,
  deleteEmotion
}