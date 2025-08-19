import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))
  const deviceId = ref(localStorage.getItem('device_id') || generateDeviceId())
  const tempToken = ref(null) // 用于OTP验证的临时token
  
  const isLoggedIn = computed(() => !!token.value && !!user.value)

  // 生成设备ID
  function generateDeviceId() {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  function login(userData, authToken, newDeviceId) {
    user.value = userData
    token.value = authToken
    if (newDeviceId) {
      deviceId.value = newDeviceId
      localStorage.setItem('device_id', newDeviceId)
    }
    localStorage.setItem('auth_token', authToken)
    localStorage.setItem('user_data', JSON.stringify(userData))
    tempToken.value = null
  }

  function setTempToken(temp) {
    tempToken.value = temp
  }

  function logout() {
    user.value = null
    token.value = null
    tempToken.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    // 保留device_id，下次登录时使用
  }

  // 从localStorage恢复用户状态
  function restoreUserState() {
    const savedToken = localStorage.getItem('auth_token')
    const savedUserData = localStorage.getItem('user_data')
    
    if (savedToken && savedUserData) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUserData)
        return true
      } catch (error) {
        console.error('恢复用户状态失败:', error)
        logout() // 清理无效数据
      }
    }
    return false
  }

  return { 
    user, 
    token, 
    deviceId, 
    tempToken,
    isLoggedIn, 
    login, 
    logout, 
    setTempToken,
    restoreUserState,
    generateDeviceId
  }
})
