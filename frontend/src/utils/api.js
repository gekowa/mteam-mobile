import axios from 'axios'
import { generateSignature, env } from './signature.js'

/**
 * 创建自定义axios实例，自动添加签名参数
 */
const createApiClient = () => {
  const apiClient = axios.create({
    baseURL: env.server,
    timeout: 10000,
    headers: {
      'Content-Type': 'multipart/form-data',
      'version': '1.1.4',
      'webversion': '1140'
    }
  })

  // 请求拦截器：自动添加签名参数
  apiClient.interceptors.request.use(
    (config) => {
      // 获取请求路径（移除baseURL部分）
      let path = config.url || ''
      if (path.startsWith(env.server)) {
        path = path.replace(env.server, '')
      }
      if (!path.startsWith('/')) {
        path = '/' + path
      }

      // 获取HTTP方法（转为大写）
      const method = (config.method || 'GET').toUpperCase()

      // 生成签名参数
      const signatureParams = generateSignature(path, method)

      // 将签名参数添加到请求中
      if (method === 'GET' || method === 'DELETE') {
        // GET和DELETE请求添加到query参数
        config.params = {
          ...config.params,
          ...signatureParams
        }
      } else {
        // POST、PUT等请求处理FormData
        if (config.data instanceof FormData) {
          // 如果是FormData，直接添加签名参数
          Object.keys(signatureParams).forEach(key => {
            config.data.append(key, signatureParams[key])
          })
        } else if (config.data && typeof config.data === 'object') {
          // 如果是普通对象，转换为FormData
          const formData = new FormData()
          
          // 添加原有数据
          Object.keys(config.data).forEach(key => {
            formData.append(key, config.data[key])
          })
          
          // 添加签名参数
          Object.keys(signatureParams).forEach(key => {
            formData.append(key, signatureParams[key])
          })
          
          config.data = formData
        } else {
          // 如果没有数据，创建新的FormData
          const formData = new FormData()
          Object.keys(signatureParams).forEach(key => {
            formData.append(key, signatureParams[key])
          })
          config.data = formData
        }
      }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器：处理通用错误
  apiClient.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // 可以在这里添加通用错误处理逻辑
      console.error('API请求错误:', error)
      return Promise.reject(error)
    }
  )

  return apiClient
}

// 创建默认API客户端实例
export const apiClient = createApiClient()

// 导出创建函数供自定义使用
export { createApiClient }

// 导出常用的HTTP方法封装
export const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config)
}

/**
 * 登录API服务
 */
export const authAPI = {
  /**
   * 用户登录 - 第一步：用户名密码验证
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @param {string} deviceId - 设备ID
   * @param {string} turnstile - Turnstile CAPTCHA令牌(可选)
   * @returns {Promise} API响应
   */
  async login(username, password, deviceId, turnstile = '') {
    try {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      if (turnstile) {
        formData.append('turnstile', turnstile)
      }

      const response = await apiClient.post('/login', formData, {
        headers: {
          'did': deviceId
        }
      })

      return response
    } catch (error) {
      console.error('登录API错误:', error)
      throw error
    }
  },

  /**
   * OTP验证 - 第二步：双因子认证
   * @param {string} username - 用户名
   * @param {string} password - 密码
   * @param {string} otpCode - OTP代码
   * @param {string} deviceId - 设备ID
   * @param {string} turnstile - Turnstile CAPTCHA令牌(可选)
   * @returns {Promise} API响应
   */
  async verifyOTP(username, password, otpCode, deviceId, turnstile = '') {
    try {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      formData.append('otpCode', otpCode)
      if (turnstile) {
        formData.append('turnstile', turnstile)
      }

      const response = await apiClient.post('/login', formData, {
        headers: {
          'did': deviceId
        }
      })

      return response
    } catch (error) {
      console.error('OTP验证API错误:', error)
      throw error
    }
  }
}
