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
      version: env.version,
      webversion: parseInt(env.version.split('.').join('')) * 10
    }
  })

  // 请求拦截器：自动添加签名参数和认证头部
  apiClient.interceptors.request.use(
    (config) => {
      // 添加认证头部
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `${token}`
      }

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
        // POST、PUT等请求处理数据格式
        const contentType = config.headers['Content-Type'] || config.headers['content-type']

        if (contentType === 'application/json') {
          // JSON格式：直接合并签名参数到数据对象
          if (config.data && typeof config.data === 'object') {
            config.data = {
              ...config.data,
              ...signatureParams
            }
          } else {
            config.data = signatureParams
          }
        } else {
          // FormData格式处理
          if (config.data instanceof FormData) {
            // 如果是FormData，直接添加签名参数
            Object.keys(signatureParams).forEach((key) => {
              config.data.append(key, signatureParams[key])
            })
          } else if (config.data && typeof config.data === 'object') {
            // 如果是普通对象，转换为FormData
            const formData = new FormData()

            // 添加原有数据
            Object.keys(config.data).forEach((key) => {
              formData.append(key, config.data[key])
            })

            // 添加签名参数
            Object.keys(signatureParams).forEach((key) => {
              formData.append(key, signatureParams[key])
            })

            config.data = formData
          } else {
            // 如果没有数据，创建新的FormData
            const formData = new FormData()
            Object.keys(signatureParams).forEach((key) => {
              formData.append(key, signatureParams[key])
            })
            config.data = formData
          }
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
      // 处理 401 未授权错误
      if (error.response?.status === 401) {
        // 清除本地存储的认证信息
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')

        // 如果是在浏览器环境且有 router，重定向到登录页
        if (typeof window !== 'undefined' && window.location) {
          window.location.href = '/'
        }
      }

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
 * 种子搜索API服务
 */
export const torrentAPI = {
  /**
   * 搜索种子列表
   * @param {Object} params - 搜索参数
   * @param {string} params.mode - 搜索模式 (movie, tv, music等)
   * @param {number} params.visible - 可见性 (1: 可见)
   * @param {string} params.keyword - 搜索关键词
   * @param {Array} params.categories - 分类ID数组
   * @param {number} params.pageNumber - 页码 (从1开始)
   * @param {number} params.pageSize - 每页数量
   * @returns {Promise} API响应
   */
  async searchTorrents({
    mode = 'movie',
    visible = 1,
    keyword = '',
    categories = [],
    pageNumber = 1,
    pageSize = 20
  } = {}) {
    try {
      // 获取设备ID和访客ID
      const deviceId = localStorage.getItem('device_id')
      const visitorId = localStorage.getItem('visitor_id')

      const response = await apiClient.post(
        '/torrent/search',
        {
          mode,
          visible,
          keyword,
          categories,
          pageNumber,
          pageSize
        },
        {
          headers: {
            'Content-Type': 'application/json',
            did: deviceId || '',
            visitorid: visitorId || ''
          }
        }
      )

      return response
    } catch (error) {
      console.error('种子搜索API错误:', error)
      throw error
    }
  },

  /**
   * 切换种子收藏状态
   * @param {string} torrentId - 种子ID
   * @param {boolean} isCollected - 是否收藏 (true: 收藏, false: 取消收藏)
   * @returns {Promise} API响应
   */
  async toggleTorrentCollection(torrentId, isCollected) {
    try {
      // 获取设备ID和访客ID
      const deviceId = localStorage.getItem('device_id')
      const visitorId = localStorage.getItem('visitor_id')

      const response = await apiClient.post(
        '/torrent/collection',
        {
          id: torrentId,
          make: isCollected ? 'true' : 'false'
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            did: deviceId || '',
            visitorid: visitorId || ''
          }
        }
      )

      return response
    } catch (error) {
      console.error('种子收藏API错误:', error)
      throw error
    }
  },

  /**
   * 获取种子详情
   * @param {string} torrentId - 种子ID
   * @returns {Promise} API响应
   */
  async getTorrentDetail(torrentId) {
    try {
      // 获取设备ID和访客ID
      const deviceId = localStorage.getItem('device_id')
      const visitorId = localStorage.getItem('visitor_id')

      const response = await apiClient.post(
        '/torrent/detail',
        {
          id: torrentId
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            did: deviceId || '',
            visitorid: visitorId || ''
          }
        }
      )

      return response
    } catch (error) {
      console.error('获取种子详情API错误:', error)
      throw error
    }
  },

  /**
   * 生成下载token
   * @param {string} torrentId - 种子ID
   * @returns {Promise} API响应
   */
  async generateDownloadToken(torrentId) {
    try {
      // 获取设备ID和访客ID
      const deviceId = localStorage.getItem('device_id')
      const visitorId = localStorage.getItem('visitor_id')

      const response = await apiClient.post(
        '/torrent/genDlToken',
        {
          id: torrentId
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            did: deviceId || '',
            visitorid: visitorId || ''
          }
        }
      )

      return response
    } catch (error) {
      console.error('生成下载token API错误:', error)
      throw error
    }
  },

  async getCategoryList() {
    try {
      // 获取设备ID和访客ID
      const deviceId = localStorage.getItem('device_id')
      const visitorId = localStorage.getItem('visitor_id')

      const response = await apiClient.post(
        '/torrent/categoryList',
        {},
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            did: deviceId || '',
            visitorid: visitorId || ''
          }
        }
      )

      return response
    } catch (error) {
      console.error('CategoryList API错误:', error)
      throw error
    }
  }
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
          did: deviceId
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
          did: deviceId
        }
      })

      return response
    } catch (error) {
      console.error('OTP验证API错误:', error)
      throw error
    }
  }
}

/**
 * 用户信息API服务
 */
export const memberAPI = {
  /**
   * 获取当前登录用户的个人资料
   * @returns {Promise} API响应
   */
  async getProfile() {
    try {
      const deviceId = localStorage.getItem('device_id')
      const visitorId = localStorage.getItem('visitor_id')

      const response = await apiClient.post(
        '/member/profile',
        {},
        {
          headers: {
            did: deviceId || '',
            visitorid: visitorId || ''
          }
        }
      )
      return response
    } catch (error) {
      console.error('获取用户资料API错误:', error)
      throw error
    }
  }
}
