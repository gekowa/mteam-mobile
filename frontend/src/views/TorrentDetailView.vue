<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              @click="$router.go(-1)"
              class="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 class="text-lg font-semibold text-gray-900">种子详情</h1>
          </div>
          <button
            @click="refreshDetail"
            :disabled="loading"
            class="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <svg
              class="w-5 h-5"
              :class="{ 'animate-spin': loading }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p class="text-gray-500 text-sm">正在加载...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">加载失败</h3>
            <p class="mt-1 text-sm text-red-700">{{ error }}</p>
            <button
              @click="fetchTorrentDetail"
              class="mt-2 text-sm font-medium text-red-800 hover:text-red-600"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Torrent Detail -->
    <div v-else-if="torrent" class="bg-white">
      <!-- Main Info Section -->
      <div class="p-4">
        <div class="flex space-x-4">
          <!-- Poster Image -->
          <div class="flex-shrink-0">
            <div class="w-32 h-44 bg-gray-200 rounded-lg overflow-hidden shadow-sm">
              <img
                v-if="torrent.imageList && torrent.imageList[0]"
                :src="torrent.imageList[0]"
                :alt="torrent.name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-gray-400"
              >
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Title -->
            <h2 class="text-lg font-semibold text-gray-900 mb-2 leading-6">
              {{ torrent.name }}
            </h2>

            <!-- Small Description -->
            <p v-if="torrent.smallDescr" class="text-sm text-gray-600 mb-3 leading-5">
              {{ torrent.smallDescr }}
            </p>

            <!-- Tech Info Grid -->
            <div class="grid grid-cols-2 gap-2 text-xs mb-3">
              <div v-if="torrent.size" class="flex items-center">
                <span class="text-gray-500 w-12">体积:</span>
                <span class="text-gray-900">{{ formatFileSize(torrent.size) }}</span>
              </div>
              <div v-if="torrent.category" class="flex items-center">
                <span class="text-gray-500 w-12">类别:</span>
                <span class="text-gray-900">{{ getCategoryName(torrent.category) }}</span>
              </div>
              <div v-if="torrent.videoCodec" class="flex items-center">
                <span class="text-gray-500 w-12">视频:</span>
                <span class="text-gray-900">{{ getVideoCodecName(torrent.videoCodec) }}</span>
              </div>
              <div v-if="torrent.audioCodec" class="flex items-center">
                <span class="text-gray-500 w-12">音频:</span>
                <span class="text-gray-900">{{ getAudioCodecName(torrent.audioCodec) }}</span>
              </div>
              <div v-if="torrent.standard" class="flex items-center">
                <span class="text-gray-500 w-12">解析度:</span>
                <span class="text-gray-900">{{ getStandardName(torrent.standard) }}</span>
              </div>
              <div v-if="torrent.countries && torrent.countries.length" class="flex items-center">
                <span class="text-gray-500 w-12">地区:</span>
                <span class="text-gray-900">{{ getCountriesName(torrent.countries) }}</span>
              </div>
              <div v-if="torrent.team" class="flex items-center col-span-2">
                <span class="text-gray-500 w-12">制作组:</span>
                <span class="text-gray-900">{{ getTeamName(torrent.team) }}</span>
              </div>
            </div>

            <!-- Labels and Ratings -->
            <div class="space-y-2">
              <!-- Labels -->
              <div v-if="torrent.labelsNew && torrent.labelsNew.length" class="flex flex-wrap gap-1">
                <span
                  v-for="label in torrent.labelsNew"
                  :key="label"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ label }}
                </span>
              </div>

              <!-- Ratings and Links -->
              <div class="flex flex-wrap items-center gap-2">
                <!-- IMDb Rating -->
                <a
                  v-if="torrent.imdb && torrent.imdbRating"
                  :href="torrent.imdb"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium hover:opacity-80 transition-opacity"
                  style="background-color: #f5c518; color: #000;"
                >
                  IMDb {{ torrent.imdbRating }}
                </a>
                <!-- Douban Rating -->
                <a
                  v-if="torrent.douban && torrent.doubanRating"
                  :href="torrent.douban"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium hover:opacity-80 transition-opacity"
                  style="background-color: #071; color: #fff;"
                >
                  豆瓣 {{ torrent.doubanRating }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Description Section -->
      <div v-if="torrent.descr" class="border-t border-gray-200">
        <div class="px-4 py-3">
          <h3 class="text-sm font-medium text-gray-900 mb-3">详细描述</h3>
          <div 
            class="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            v-html="renderDescription(torrent.descr)"
          ></div>
        </div>
      </div>

      <!-- Stats Section -->
      <div v-if="torrent.status" class="border-t border-gray-200">
        <div class="px-4 py-3">
          <h3 class="text-sm font-medium text-gray-900 mb-3">种子状态</h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">做种者:</span>
              <span class="text-green-600 font-medium">{{ torrent.status.seeders || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">下载者:</span>
              <span class="text-red-600 font-medium">{{ torrent.status.leechers || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">完成数:</span>
              <span class="text-gray-900">{{ torrent.status.timesCompleted || 0 }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">浏览数:</span>
              <span class="text-gray-900">{{ torrent.status.views || 0 }}</span>
            </div>
            <div v-if="torrent.status.discount && torrent.status.discount !== 'NORMAL'" class="col-span-2 flex justify-between">
              <span class="text-gray-500">优惠:</span>
              <span 
                :class="getDiscountStyle(torrent.status.discount).class"
                class="px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ getDiscountStyle(torrent.status.discount).text }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { torrentAPI } from '../utils/api'
import { formatFileSize, getDiscountStyle } from '../utils/formatters'
import { 
  getCategoryName, 
  getVideoCodecName, 
  getAudioCodecName, 
  getStandardName, 
  getCountriesName, 
  getTeamName 
} from '../utils/constants'
import { useAuthStore } from '../stores/auth'
import { renderBBCodeAndMarkdown } from '../utils/bbcodeRenderer'

export default {
  name: 'TorrentDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    // 响应式数据
    const torrent = ref(null)
    const loading = ref(false)
    const error = ref('')


    // 获取种子详情
    const fetchTorrentDetail = async () => {
      try {
        // 检查是否已登录
        if (!authStore.isLoggedIn) {
          router.push('/')
          return
        }

        loading.value = true
        error.value = ''

        const torrentId = route.params.id
        if (!torrentId) {
          throw new Error('种子ID不能为空')
        }

        const response = await torrentAPI.getTorrentDetail(torrentId)

        if (response.data?.code === '0' && response.data?.data) {
          torrent.value = response.data.data
        } else {
          throw new Error(response.data?.message || '获取种子详情失败')
        }
      } catch (err) {
        console.error('获取种子详情失败:', err)

        // 特殊处理认证错误
        if (err.response?.status === 401) {
          authStore.logout()
          router.push('/')
          return
        }

        error.value = err.message || '网络错误，请重试'
      } finally {
        loading.value = false
      }
    }

    // 刷新详情
    const refreshDetail = () => {
      fetchTorrentDetail()
    }

    // 处理图片加载错误
    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }


    // 渲染描述内容（使用 BBCode + Markdown 渲染器）
    const renderDescription = (descr) => {
      return renderBBCodeAndMarkdown(descr)
    }

    // 监听路由参数变化
    watch(
      () => route.params.id,
      (newId) => {
        if (newId) {
          fetchTorrentDetail()
        }
      },
      { immediate: true }
    )

    // 组件挂载时加载数据
    onMounted(() => {
      if (route.params.id) {
        fetchTorrentDetail()
      }
    })

    return {
      torrent,
      loading,
      error,
      fetchTorrentDetail,
      refreshDetail,
      handleImageError,
      getCategoryName,
      getVideoCodecName,
      getAudioCodecName,
      getStandardName,
      getCountriesName,
      getTeamName,
      renderDescription,
      formatFileSize,
      getDiscountStyle
    }
  }
}
</script>

<style scoped>
/* 图片样式 */
.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.375rem;
  margin: 0.5rem 0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* 引用块样式 */
.prose blockquote {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  margin: 0.75rem 0;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-radius: 0 0.375rem 0.375rem 0;
}

/* 代码块样式 */
.prose pre {
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin: 0.5rem 0;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

/* 链接样式 */
.prose a {
  color: #2563eb;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.prose a:hover {
  color: #1d4ed8;
}

/* 列表样式 */
.prose ul, .prose ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.25rem 0;
  line-height: 1.5;
}

/* 段落样式 */
.prose p {
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

/* Markdown 标题样式 */
.prose h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.prose h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.prose h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

/* 文本对齐 */
.prose .text-center {
  text-align: center;
}

.prose .text-left {
  text-align: left;
}

.prose .text-right {
  text-align: right;
}

/* 文本装饰 */
.prose strong {
  font-weight: 600;
}

.prose em {
  font-style: italic;
}

.prose u {
  text-decoration: underline;
}

.prose del {
  text-decoration: line-through;
  opacity: 0.7;
}
</style>