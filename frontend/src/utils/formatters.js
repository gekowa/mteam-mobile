/**
 * 格式化文件大小
 * @param {string|number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  
  const size = parseInt(bytes)
  if (isNaN(size)) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let fileSize = size
  
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }
  
  return `${fileSize.toFixed(1)} ${units[unitIndex]}`
}

/**
 * 格式化日期时间
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期
 */
export function formatDate(dateString) {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      // 今天：显示时间
      return date.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    } else if (diffDays === 1) {
      // 昨天
      return '昨天'
    } else if (diffDays < 7) {
      // 一周内：显示天数
      return `${diffDays}天前`
    } else if (diffDays < 30) {
      // 一个月内：显示周数
      const weeks = Math.floor(diffDays / 7)
      return `${weeks}周前`
    } else {
      // 超过一个月：显示具体日期
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
      })
    }
  } catch (error) {
    console.error('日期格式化错误:', error)
    return dateString
  }
}

/**
 * 获取优惠标签样式
 * @param {string} discount - 优惠类型
 * @returns {Object} 样式对象
 */
export function getDiscountStyle(discount) {
  const styles = {
    FREE: {
      text: '免费',
      class: 'bg-green-100 text-green-800'
    },
    HALF: {
      text: '50%',
      class: 'bg-blue-100 text-blue-800'
    },
    DOUBLE: {
      text: '2X',
      class: 'bg-purple-100 text-purple-800'
    },
    NORMAL: {
      text: '',
      class: ''
    }
  }
  
  return styles[discount] || styles.NORMAL
}

/**
 * 截断文本
 * @param {string} text - 原始文本
 * @param {number} maxLength - 最大长度
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength = 50) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
