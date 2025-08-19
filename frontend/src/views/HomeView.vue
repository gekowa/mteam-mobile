<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-xl font-bold text-primary-600">M-Team</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">欢迎, {{ authStore.user?.username || '用户' }}</span>
            <button
              @click="handleLogout"
              class="text-sm text-red-600 hover:text-red-500"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          欢迎来到 M-Team 移动版
        </h2>
        <p class="text-gray-600 mb-4">
          您已成功登录，这里是首页
        </p>
        
        <!-- 用户信息卡片 -->
        <div v-if="authStore.user" class="max-w-md mx-auto bg-white rounded-lg shadow mb-8 p-6">
          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">{{ authStore.user.username }}</h3>
            <p v-if="authStore.user.uid" class="text-sm text-gray-500">用户ID: {{ authStore.user.uid }}</p>
            <div class="mt-4 flex justify-center">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                已登录
              </span>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <router-link 
            to="/torrents"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 block"
          >
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      种子列表
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      浏览所有种子
                    </dd>
                  </dl>
                </div>
                <div class="ml-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </router-link>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      下载记录
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      查看下载历史
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      个人中心
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      管理账户设置
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const handleLogout = () => {
      authStore.logout()
      router.push('/')
    }
    
    return {
      authStore,
      handleLogout
    }
  }
}
</script>
