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
            <h1 class="text-lg font-semibold text-gray-900">种子列表</h1>
          </div>
          <button 
            @click="refreshList"
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

    <!-- Search Bar -->
    <div class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex space-x-2">
        <select 
          v-model="searchParams.mode" 
          @change="handleSearch"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="movie">电影</option>
          <option value="tvshow">电视剧</option>
          <option value="music">音乐</option>
          <option value="normal">综合</option>
          <option value="adult">9KG</option>
        </select>
        <button 
          @click="handleSearch"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          搜索
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && torrents.length === 0" class="flex justify-center items-center py-12">
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
              @click="handleSearch"
              class="mt-2 text-sm font-medium text-red-800 hover:text-red-600"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Torrent List -->
    <div v-else-if="torrents.length > 0" class="divide-y divide-gray-200">
      <div
        v-for="torrent in torrents"
        :key="torrent.id"
        class="bg-white p-4 hover:bg-gray-50 transition-colors duration-150"
        @click="handleTorrentClick(torrent)"
      >
        <div class="flex space-x-3">
          <!-- Image -->
          <div class="flex-shrink-0">
            <div class="w-16 h-20 bg-gray-200 rounded-md overflow-hidden">
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
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Title and Description -->
            <div class="mb-2">
              <h3 class="text-sm font-medium text-gray-900 line-clamp-2 leading-5">
                {{ truncateText(torrent.name, 60) }}
              </h3>
              <p 
                v-if="torrent.smallDescr" 
                class="text-xs text-gray-500 mt-1 line-clamp-1"
              >
                {{ torrent.smallDescr }}
              </p>
            </div>

            <!-- Stats Row -->
            <div class="flex items-center justify-between text-xs text-gray-500 mb-2">
              <div class="flex items-center space-x-3">
                <!-- File Size -->
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {{ formatFileSize(torrent.size) }}
                </span>

                <!-- Seeders -->
                <span class="flex items-center text-green-600">
                  <!-- <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg> -->
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.296477 3.58611L2.88648 0.996113C3.27648 0.606113 3.90648 0.606113 4.29648 0.996113L6.88648 3.58611C7.51648 4.21611 7.06648 5.29611 6.17648 5.29611H0.996477C0.106477 5.29611 -0.333523 4.21611 0.296477 3.58611Z" fill="#00BA1B"></path></svg>
                  {{ torrent.status?.seeders || 0 }}
                </span>

                <!-- Leechers -->
                <span class="flex items-center text-red-600">
                  <!-- <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H3" />
                  </svg> -->
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.06436 2.41389L4.47436 5.00389C4.08436 5.39389 3.45436 5.39389 3.06436 5.00389L0.474362 2.41389C-0.155638 1.78389 0.294363 0.703887 1.18436 0.703887L6.36436 0.703887C7.25436 0.703887 7.69436 1.78389 7.06436 2.41389Z" fill="#FE2C55"></path></svg>
                  {{ torrent.status?.leechers || 0 }}
                </span>
              </div>

              <!-- Date -->
              <span>{{ formatDate(torrent.createdDate) }}</span>
            </div>

            <!-- Tags and Discount -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1">
                <!-- Labels -->
                <span
                  v-for="label in (torrent.labelsNew || []).slice(0, 2)"
                  :key="label"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ label }}
                </span>
              </div>

              <!-- Discount Badge -->
              <span
                v-if="torrent.status?.discount && torrent.status.discount !== 'NORMAL'"
                :class="getDiscountStyle(torrent.status.discount).class"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              >
                {{ getDiscountStyle(torrent.status.discount).text }}
              </span>
            </div>
          </div>

          <!-- Arrow -->
          <div class="flex-shrink-0 flex items-center">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" class="px-4 py-12">
      <div class="text-center">
        <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">暂无种子</h3>
        <p class="text-gray-500 text-sm">当前搜索条件下没有找到任何种子</p>
      </div>
    </div>

    <!-- Load More -->
    <div 
      v-if="hasMore && !loading && torrents.length > 0" 
      class="px-4 py-4"
    >
      <button
        @click="loadMore"
        :disabled="loadingMore"
        class="w-full py-3 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        <span v-if="loadingMore" class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
          加载中...
        </span>
        <span v-else>加载更多</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { torrentAPI } from '../utils/api'
import { formatFileSize, formatDate, getDiscountStyle, truncateText } from '../utils/formatters'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'TorrentListView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    // 响应式数据
    const torrents = ref([])
    const loading = ref(false)
    const loadingMore = ref(false)
    const error = ref('')
    const hasMore = ref(true)
    
    const searchParams = reactive({
      mode: 'movie',
      visible: 1,
      categories: [],
      pageNumber: 1,
      pageSize: 100
    })
    
    // 搜索种子
    const searchTorrents = async (resetList = false) => {
      try {
        // 检查是否已登录
        if (!authStore.isLoggedIn) {
          router.push('/')
          return
        }

        if (resetList) {
          loading.value = true
          searchParams.pageNumber = 1
        } else {
          loadingMore.value = true
        }
        
        error.value = ''
        
        const response = await torrentAPI.searchTorrents(searchParams)
        
        if (response.data?.code === '0' && response.data?.data) {
          const newTorrents = response.data.data.data || []
          
          if (resetList) {
            torrents.value = newTorrents
          } else {
            torrents.value.push(...newTorrents)
          }
          
          // 检查是否还有更多数据
          const totalPages = parseInt(response.data.data.totalPages) || 0
          hasMore.value = searchParams.pageNumber < totalPages
          
          if (!resetList) {
            searchParams.pageNumber++
          }
        } else {
          throw new Error(response.data?.message || '获取种子列表失败')
        }
      } catch (err) {
        console.error('搜索种子失败:', err)
        
        // 特殊处理认证错误
        if (err.response?.status === 401) {
          authStore.logout()
          router.push('/')
          return
        }
        
        error.value = err.message || '网络错误，请重试'
      } finally {
        loading.value = false
        loadingMore.value = false
      }
    }
    
    // 处理搜索
    const handleSearch = () => {
      searchTorrents(true)
    }
    
    // 刷新列表
    const refreshList = () => {
      searchTorrents(true)
    }
    
    // 加载更多
    const loadMore = () => {
      if (!loadingMore.value && hasMore.value) {
        searchTorrents(false)
      }
    }
    
    // 处理种子点击
    const handleTorrentClick = (torrent) => {
      // 这里可以导航到种子详情页面
      console.log('点击种子:', torrent)
      // router.push(`/torrent/${torrent.id}`)
    }
    
    // 处理图片加载错误
    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }
    
    // 组件挂载时加载数据
    onMounted(() => {
      searchTorrents(true)
    })
    
    return {
      torrents,
      loading,
      loadingMore,
      error,
      hasMore,
      searchParams,
      handleSearch,
      refreshList,
      loadMore,
      handleTorrentClick,
      handleImageError,
      formatFileSize,
      formatDate,
      getDiscountStyle,
      truncateText
    }
  }
}
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
