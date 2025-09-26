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
            data-testid="refresh-button"
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
    <div class="bg-white border-b border-gray-200 px-4 py-3 space-y-3">
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
      </div>
      <div class="flex space-x-2">
        <div class="flex-1 relative">
          <input
            v-model="searchParams.keyword"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="输入关键词搜索..."
            class="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            v-if="searchParams.keyword"
            @click="clearKeyword"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          @click="handleSearch"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          搜索
        </button>
      </div>
    </div>

    <!-- Search Result Summary -->
    <div v-if="showSearchSummary && !loading && torrents.length > 0" class="px-4 py-3 bg-gray-50 border-b border-gray-200" data-testid="search-summary">
      <p class="text-sm text-gray-600">
        找到 {{ totalCount }} 个结果，共 {{ totalPages }} 页，当前第 {{ currentPage }} 页
      </p>
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
      <!-- Big Picture Mode for Adult Content -->
      <div
        v-for="torrent in torrents"
        :key="torrent.id"
        v-if="isBigPictureMode"
        :class="[
          'p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer big-picture-mode',
          getStickyBackgroundClass(torrent)
        ]"
        @click="handleTorrentClick(torrent)"
        data-testid="torrent-item"
      >
        <!-- Title -->
        <h3 class="text-base font-medium text-gray-900 mb-3" data-testid="torrent-title-big">
          {{ torrent.name }}
        </h3>

        <!-- Full Width Image -->
        <div class="w-full mb-3 aspect-ratio-container" data-testid="torrent-big-image">
          <div class="w-full bg-gray-200 rounded-md overflow-hidden" style="aspect-ratio: 16/9;">
            <img
              v-if="torrent.imageList && torrent.imageList[0]"
              :src="torrent.imageList[0]"
              :alt="torrent.name"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-gray-400 image-placeholder"
            >
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="mb-4" data-testid="torrent-details-big">
          <p v-if="torrent.smallDescr" class="text-sm text-gray-600 mb-2">
            {{ torrent.smallDescr }}
          </p>

          <div class="flex items-center space-x-4 text-sm text-gray-500">
            <!-- File Size -->
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {{ formatFileSize(torrent.size) }}
            </span>

            <!-- Seeders -->
            <span class="flex items-center text-green-600">
              <svg width="10" height="8" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.296477 3.58611L2.88648 0.996113C3.27648 0.606113 3.90648 0.606113 4.29648 0.996113L6.88648 3.58611C7.51648 4.21611 7.06648 5.29611 6.17648 5.29611H0.996477C0.106477 5.29611 -0.333523 4.21611 0.296477 3.58611Z" fill="#00BA1B"></path></svg>
              {{ torrent.status?.seeders || 0 }}
            </span>

            <!-- Leechers -->
            <span class="flex items-center text-red-600">
              <svg width="10" height="8" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.06436 2.41389L4.47436 5.00389C4.08436 5.39389 3.45436 5.39389 3.06436 5.00389L0.474362 2.41389C-0.155638 1.78389 0.294363 0.703887 1.18436 0.703887L6.36436 0.703887C7.25436 0.703887 7.69436 1.78389 7.06436 2.41389Z" fill="#FE2C55"></path></svg>
              {{ torrent.status?.leechers || 0 }}
            </span>

            <!-- Date -->
            <span>{{ formatRelativeTime(torrent.createdDate) }}</span>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="flex items-center justify-between" data-testid="torrent-actions-big">
          <div class="flex items-center space-x-2">
            <!-- Favorite Button -->
            <button
              @click.stop="toggleFavorite(torrent)"
              :disabled="torrent.favoriteLoading"
              class="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50"
              data-testid="favorite-button"
            >
              <svg
                class="w-4 h-4 mr-1"
                :class="torrent.collection ? 'text-yellow-400 fill-current' : 'text-gray-400'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              {{ torrent.collection ? '已收藏' : '收藏' }}
            </button>

            <!-- Download Button -->
            <button
              @click.stop="handleDownload(torrent)"
              :disabled="torrent.downloadLoading"
              class="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors duration-150 disabled:opacity-50"
              data-testid="download-button"
            >
              <svg
                v-if="!torrent.downloadLoading"
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div
                v-else
                class="w-4 h-4 mr-1 animate-spin rounded-full border-2 border-white border-t-transparent"
              ></div>
              下载
            </button>
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

      <!-- Regular Mode for Other Content -->
      <div
        v-for="torrent in torrents"
        :key="torrent.id"
        v-else
        :class="[
          'p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer',
          getStickyBackgroundClass(torrent)
        ]"
        @click="handleTorrentClick(torrent)"
        data-testid="torrent-item"
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
            <!-- Favorite Star -->
            <div class="mt-1 flex justify-center">
              <button
                @click.stop="toggleFavorite(torrent)"
                :disabled="torrent.favoriteLoading"
                class="p-1 hover:bg-gray-100 rounded-full transition-colors duration-150 disabled:opacity-50"
                data-testid="favorite-button"
              >
                <svg
                  class="w-4 h-4"
                  :class="torrent.collection ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
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
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.296477 3.58611L2.88648 0.996113C3.27648 0.606113 3.90648 0.606113 4.29648 0.996113L6.88648 3.58611C7.51648 4.21611 7.06648 5.29611 6.17648 5.29611H0.996477C0.106477 5.29611 -0.333523 4.21611 0.296477 3.58611Z" fill="#00BA1B"></path></svg>
                  {{ torrent.status?.seeders || 0 }}
                </span>

                <!-- Leechers -->
                <span class="flex items-center text-red-600">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.06436 2.41389L4.47436 5.00389C4.08436 5.39389 3.45436 5.39389 3.06436 5.00389L0.474362 2.41389C-0.155638 1.78389 0.294363 0.703887 1.18436 0.703887L6.36436 0.703887C7.25436 0.703887 7.69436 1.78389 7.06436 2.41389Z" fill="#FE2C55"></path></svg>
                  {{ torrent.status?.leechers || 0 }}
                </span>
              </div>

              <!-- Date -->
              <span>{{ formatRelativeTime(torrent.createdDate) }}</span>
            </div>

            <!-- Tags and Discount -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1">
                <!-- IMDb Rating -->
                <span
                  v-if="torrent.imdb && torrent.imdbRating && torrent.imdbRating > 0"
                  @click.stop="gotoExternalLink(torrent.imdb)"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style="background-color: #f5c518; color: #000;"
                >
                  IMDb {{ torrent.imdbRating }}
                </span>
                <!-- Douban Rating -->
                <span
                  v-if="torrent.douban && torrent.doubanRating && torrent.doubanRating > 0"
                  @click.stop="gotoExternalLink(torrent.douban)"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                  style="background-color: #071; color: #fff;"
                >
                  豆 {{ torrent.doubanRating }}
                </span>
                <!-- Labels -->
                <span
                  v-for="label in (torrent.labelsNew || []).slice(0, 2)"
                  :key="label"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 uppercase"
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

    <!-- Pagination Controls -->
    <div
      v-if="totalPages > 1 && !loading && torrents.length > 0"
      class="px-4 py-6 text-center"
      data-testid="pagination-container"
    >
      <div class="flex items-center justify-center space-x-4">
        <!-- Previous Page Button -->
        <button
          @click="goToPrevPage"
          :disabled="currentPage === 1"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="prev-page-button"
        >
          &lt;
        </button>

        <!-- Page Dropdown -->
        <select
          v-model="currentPage"
          @change="goToPage"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          data-testid="page-select"
        >
          <option
            v-for="page in totalPages"
            :key="page"
            :value="page"
          >
            第{{ page }}页
          </option>
        </select>

        <!-- Next Page Button -->
        <button
          @click="goToNextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="next-page-button"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { torrentAPI } from '../utils/api'
import { formatFileSize, formatDate, formatRelativeTime, getDiscountStyle, truncateText } from '../utils/formatters'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'TorrentListView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()

    // 响应式数据
    const torrents = ref([])
    const loading = ref(false)
    const error = ref('')
    const totalPages = ref(0)
    const totalCount = ref(0)
    const currentPage = ref(1)

    const searchParams = reactive({
      mode: 'movie',
      visible: 1,
      keyword: '',
      categories: [],
      pageNumber: 1,
      pageSize: 100
    })

    // 从URL参数初始化搜索条件
    const initFromUrlParams = () => {
      const query = route.query
      if (query.mode) {
        searchParams.mode = query.mode
      } else {
        searchParams.mode = 'movie'
      }

      // 直接设置keyword，如果URL中没有则为空字符串
      searchParams.keyword = query.keyword || ''

      // 初始化页码
      const pageFromUrl = parseInt(query.page) || 1
      searchParams.pageNumber = pageFromUrl
      currentPage.value = pageFromUrl
    }

    // 将搜索参数同步到URL
    const syncParamsToUrl = (resetPage = false, page = null) => {
      const query = {}

      query.mode = searchParams.mode

      if (searchParams.keyword) {
        query.keyword = searchParams.keyword
      }

      // 如果重置页面，则不包含页面参数；否则包含页面参数
      const pageToUse = page || searchParams.pageNumber
      if (!resetPage && pageToUse > 1) {
        query.page = pageToUse.toString()
      }

      console.log("pushing to route")
      // 推送到历史记录，但不触发重新加载
      router.push({
        path: '/torrents',
        query
      }).catch(() => {
        // 忽略重复导航错误
      })
    }

    // 搜索种子
    const searchTorrents = async () => {
      console.log("searchTorrents")
      try {
        // 检查是否已登录
        if (!authStore.isLoggedIn) {
          router.push('/')
          return
        }

        loading.value = true

        error.value = ''

        const response = await torrentAPI.searchTorrents(searchParams)

        if (response.data?.code === '0' && response.data?.data) {
          const newTorrents = response.data.data.data || []

          // 总是替换种子列表（不再有loadMore功能）
          torrents.value = newTorrents

          // 更新分页信息
          const responseTotalPages = parseInt(response.data.data.totalPages) || 0
          const responseTotalCount = parseInt(response.data.data.total) || 0

          totalPages.value = responseTotalPages
          totalCount.value = responseTotalCount

          // 滚动到顶部
          window.scrollTo({ top: 0, behavior: 'smooth' })

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
      }
    }

    // 处理搜索
    const handleSearch = () => {
      // 同步参数到URL
      syncParamsToUrl(true)
      // 直接调用搜索
      // searchTorrents(true)
    }

    // 刷新列表
    const refreshList = () => {
      searchTorrents(true)
    }

    // 分页导航函数
    const goToPrevPage = () => {
      if (currentPage.value > 1) {
        const newPage = currentPage.value - 1
        searchParams.pageNumber = newPage
        currentPage.value = newPage
        syncParamsToUrl(false, newPage)
        // searchTorrents(false)
      }
    }

    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        const newPage = currentPage.value + 1
        searchParams.pageNumber = newPage
        currentPage.value = newPage
        syncParamsToUrl(false, newPage)
        // searchTorrents(false)
      }
    }

    const goToPage = () => {
      searchParams.pageNumber = currentPage.value
      syncParamsToUrl(false, currentPage.value)
      // searchTorrents(false)
    }

    // 计算是否显示搜索结果摘要
    const showSearchSummary = computed(() => {
      const query = route.query
      // 检查是否有除了mode和page之外的搜索条件
      const hasSearchConditions = Object.keys(query).some(key =>
        key !== 'mode' && key !== 'page' && query[key]
      )
      return hasSearchConditions
    })

    // 计算是否为大图模式 (9KG adult content)
    const isBigPictureMode = computed(() => {
      return searchParams.mode === 'adult'
    })

    // 处理种子点击
    const handleTorrentClick = (torrent) => {
      // 导航到种子详情页面
      router.push(`/torrent/${torrent.id}`)
    }

    // 处理图片加载错误
    const handleImageError = (event) => {
      event.target.style.display = 'none'
    }

    const gotoExternalLink = (link) => {
      window.open(link, "_blank")
    }

    // 清除关键词
    const clearKeyword = () => {
      searchParams.keyword = ''
      handleSearch()
    }

    // 获取置顶种子背景色类名
    const getStickyBackgroundClass = (torrent) => {
      // 检查是否为电影或电视剧模式
      const isMovieOrTv = searchParams.mode === 'movie' || searchParams.mode === 'tvshow'

      if (torrent.status?.toppingLevel && torrent.status.toppingLevel !== '0') {
        const toppingLevel = torrent.status.toppingLevel
        if (toppingLevel === '1') {
          return 'bg-topping-level-1' // #4fc7171a
        } else if (toppingLevel === '2') {
          return 'bg-topping-level-2' // #e396291a
        }
      }
      return 'bg-white'
    }

    // 切换收藏状态
    const toggleFavorite = async (torrent) => {
      if (torrent.favoriteLoading) return

      try {
        // 设置加载状态
        torrent.favoriteLoading = true

        const newCollectedState = !torrent.collection
        const response = await torrentAPI.toggleTorrentCollection(torrent.id, newCollectedState)

        if (response.data?.code === '0') {
          // 更新本地状态
          torrent.collection = newCollectedState
        } else {
          throw new Error(response.data?.message || '收藏操作失败')
        }
      } catch (err) {
        console.error('切换收藏状态失败:', err)
        error.value = err.message || '收藏操作失败，请重试'
      } finally {
        torrent.favoriteLoading = false
      }
    }

    // 处理下载
    const handleDownload = async (torrent) => {
      if (torrent.downloadLoading) return

      try {
        // 设置加载状态
        torrent.downloadLoading = true

        const response = await torrentAPI.generateDownloadToken(torrent.id)

        if (response.data?.code === '0' && response.data?.data?.downloadUrl) {
          // 在新窗口中打开下载链接
          window.open(response.data.data.downloadUrl, '_blank')
        } else {
          throw new Error(response.data?.message || '获取下载链接失败')
        }
      } catch (err) {
        console.error('下载失败:', err)
        error.value = err.message || '下载失败，请重试'
      } finally {
        torrent.downloadLoading = false
      }
    }

    // 处理路由变化，支持浏览器前进后退
    // onBeforeRouteUpdate((to, from) => {
    //   console.log("onBeforeRouteUpdate")
    //   // 只有当查询参数真正改变时才重新搜索
    //   if (JSON.stringify(to.query) !== JSON.stringify(from.query)) {
    //     // 更新路由对象引用
    //     Object.assign(route, to)
    //     initFromUrlParams()
    //     searchTorrents(true)
    //   }
    // })

    // 组件挂载时加载数据
    onMounted(() => {
      torrentAPI.getCategoryList()

      // 首先从URL参数初始化搜索条件
      initFromUrlParams()
      searchTorrents(true)
    })

    return {
      torrents,
      loading,
      error,
      totalPages,
      totalCount,
      currentPage,
      searchParams,
      showSearchSummary,
      isBigPictureMode,
      handleSearch,
      refreshList,
      goToPrevPage,
      goToNextPage,
      goToPage,
      handleTorrentClick,
      handleImageError,
      gotoExternalLink,
      clearKeyword,
      getStickyBackgroundClass,
      toggleFavorite,
      handleDownload,
      formatFileSize,
      formatDate,
      formatRelativeTime,
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

/* 置顶种子背景色 */
.bg-topping-level-1 {
  background-color: #4fc7171a;
}

.bg-topping-level-2 {
  background-color: #e396291a;
}
</style>
