<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
          <svg class="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          登录到 M-Team
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ getStepDescription() }}
        </p>
      </div>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
          </div>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <!-- 用户名密码输入步骤 -->
        <div v-if="currentStep === 'credentials'" class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="form.username"
                name="username"
                type="text"
                autocomplete="username"
                required
                class="input-field"
                placeholder="请输入用户名"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.username }"
              />
              <p v-if="errors.username" class="mt-1 text-sm text-red-600">{{ errors.username }}</p>
            </div>
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="form.password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="input-field pr-10"
                placeholder="请输入密码"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.password }"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                记住我
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                忘记密码？
              </a>
            </div>
          </div>
        </div>

        <!-- OTP验证步骤 -->
        <div v-else-if="currentStep === 'otp'" class="space-y-4">
          <div>
            <label for="otpCode" class="block text-sm font-medium text-gray-700">
              双因子认证代码
            </label>
            <div class="mt-1">
              <input
                id="otpCode"
                v-model="form.otpCode"
                name="otpCode"
                type="text"
                autocomplete="one-time-code"
                required
                maxlength="6"
                class="input-field text-center text-lg tracking-widest"
                placeholder="000000"
                :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.otpCode }"
              />
              <p v-if="errors.otpCode" class="mt-1 text-sm text-red-600">{{ errors.otpCode }}</p>
            </div>
            <p class="mt-2 text-sm text-gray-600">
              请输入您的认证器应用中显示的6位数字代码
            </p>
            <!-- 显示支持的验证方式 -->
            <div v-if="supportedMethods.length > 0" class="mt-3 text-xs text-gray-500">
              <span>支持的验证方式: </span>
              <span v-for="(method, index) in supportedMethods" :key="method" class="inline-flex items-center">
                <span class="px-2 py-1 bg-gray-100 rounded text-gray-700">
                  {{ method === 'otp' ? 'OTP认证器' : method === 'email' ? '邮箱验证' : method }}
                </span>
                <span v-if="index < supportedMethods.length - 1" class="mx-1">•</span>
              </span>
            </div>
          </div>
          
          <div class="text-center">
            <button
              type="button"
              @click="goBackToCredentials"
              class="text-sm text-primary-600 hover:text-primary-500"
            >
              ← 返回用户名密码输入
            </button>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ getButtonText() }}
          </button>
        </div>

        <div class="text-center">
          <p class="text-sm text-gray-600">
            没有账户？
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              注册账号
            </a>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { authAPI } from '../utils/api'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const isLoading = ref(false)
    const showPassword = ref(false)
    const currentStep = ref('credentials') // 'credentials' | 'otp'
    const errorMessage = ref('')
    const supportedMethods = ref([]) // 存储支持的验证方式
    
    const form = reactive({
      username: '',
      password: '',
      otpCode: '',
      rememberMe: false
    })
    
    const errors = reactive({
      username: '',
      password: '',
      otpCode: ''
    })
    
    const clearErrors = () => {
      errors.username = ''
      errors.password = ''
      errors.otpCode = ''
      errorMessage.value = ''
    }
    
    const validateCredentials = () => {
      clearErrors()
      
      if (!form.username.trim()) {
        errors.username = '请输入用户名'
        return false
      }
      
      if (!form.password.trim()) {
        errors.password = '请输入密码'
        return false
      }
      
      return true
    }
    
    const validateOTP = () => {
      clearErrors()
      
      if (!form.otpCode.trim()) {
        errors.otpCode = '请输入OTP代码'
        return false
      }
      
      if (!/^\d{6}$/.test(form.otpCode.trim())) {
        errors.otpCode = '请输入6位数字OTP代码'
        return false
      }
      
      return true
    }
    
    const handleLoginStep = async () => {
      if (!validateCredentials()) {
        return
      }
      
      try {
        const response = await authAPI.login(
          form.username,
          form.password,
          authStore.deviceId
        )
        
        // 检查响应数据
        const data = response.data
        const authToken = response.headers['authorization']
        const newDeviceId = response.headers['did']
        
        // 检查响应状态码
        if (data.code === 0 && authToken) {
          // 登录成功 (code: 0, message: "SUCCESS") + Authorization header中有token
          const userData = {
            username: form.username
          }
          authStore.login(userData, authToken, newDeviceId)
          router.push('/home')
        } else if (data.code === 1001) {
          // 需要两步验证，检查支持的验证方式
          supportedMethods.value = data.data || []
          if (supportedMethods.value.includes('otp')) {
            // 支持OTP验证，进入OTP步骤
            currentStep.value = 'otp'
            errorMessage.value = '' // 清除错误信息
          } else {
            errorMessage.value = data.message || '需要两步验证，但当前不支持的验证方式'
          }
        } else if (data.success && authToken) {
          // 兼容旧的登录成功格式
          authStore.login(data.user, authToken, newDeviceId)
          router.push('/home')
        } else if (data.requireOtp) {
          // 兼容旧的requireOtp格式
          authStore.setTempToken(data.tempToken)
          currentStep.value = 'otp'
        } else {
          errorMessage.value = data.message || '登录失败，请重试'
        }
      } catch (error) {
        console.error('登录API错误:', error)
        
        if (error.response) {
          const errorData = error.response.data
          if (errorData && errorData.error) {
            errorMessage.value = errorData.error
          } else {
            errorMessage.value = '用户名或密码错误'
          }
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage.value = '网络连接失败，请检查网络设置'
        } else {
          errorMessage.value = '登录服务暂时不可用，请稍后再试'
        }
      }
    }
    
    const handleOTPStep = async () => {
      if (!validateOTP()) {
        return
      }
      
      try {
        const response = await authAPI.verifyOTP(
          form.username,
          form.password,
          form.otpCode,
          authStore.deviceId
        )
        
        const data = response.data
        const authToken = response.headers['authorization']
        const newDeviceId = response.headers['did']
        
        if (data.code === 0 && authToken) {
          // OTP验证成功 (code: 0, message: "SUCCESS") + Authorization header中有token
          const userData = {
            username: form.username
          }
          authStore.login(userData, authToken, newDeviceId)
          router.push('/home')
        } else if (data.code === 1001) {
          // 仍然需要两步验证，OTP可能错误
          errorMessage.value = 'OTP验证码错误，请重新输入'
        } else if (data.success && authToken) {
          // 兼容旧的OTP验证成功格式
          authStore.login(data.user, authToken, newDeviceId)
          router.push('/home')
        } else {
          errorMessage.value = data.message || 'OTP验证失败'
        }
      } catch (error) {
        console.error('OTP验证API错误:', error)
        
        if (error.response) {
          const errorData = error.response.data
          if (errorData && errorData.error) {
            errorMessage.value = errorData.error
          } else {
            errorMessage.value = 'OTP代码无效，请重新输入'
          }
        } else {
          errorMessage.value = 'OTP验证服务暂时不可用，请稍后再试'
        }
      }
    }
    
    const handleSubmit = async () => {
      isLoading.value = true
      
      try {
        if (currentStep.value === 'credentials') {
          await handleLoginStep()
        } else if (currentStep.value === 'otp') {
          await handleOTPStep()
        }
      } finally {
        isLoading.value = false
      }
    }
    
    const goBackToCredentials = () => {
      currentStep.value = 'credentials'
      form.otpCode = ''
      supportedMethods.value = []
      clearErrors()
      authStore.setTempToken(null)
    }
    
    const getButtonText = () => {
      if (isLoading.value) {
        return currentStep.value === 'credentials' ? '验证中...' : 'OTP验证中...'
      }
      return currentStep.value === 'credentials' ? '登录' : '验证OTP'
    }
    
    const getStepDescription = () => {
      if (currentStep.value === 'credentials') {
        return '输入您的凭据以访问您的账户'
      } else if (currentStep.value === 'otp') {
        return '您的账户已启用两步验证，请输入双因子认证代码'
      }
      return ''
    }
    
    return {
      form,
      errors,
      isLoading,
      showPassword,
      currentStep,
      errorMessage,
      supportedMethods,
      handleSubmit,
      goBackToCredentials,
      getButtonText,
      getStepDescription
    }
  }
}
</script>
