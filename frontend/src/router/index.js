import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true } // 只有未登录用户可访问
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true } // 需要登录才能访问
    },
    {
      path: '/torrents',
      name: 'torrents',
      component: () => import('../views/TorrentListView.vue'),
      meta: { requiresAuth: true } // 需要登录才能访问
    },
    {
      path: '/torrent/:id',
      name: 'torrent-detail',
      component: () => import('../views/TorrentDetailView.vue'),
      meta: { requiresAuth: true } // 需要登录才能访问
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 尝试从localStorage恢复用户状态
  if (!authStore.user && !authStore.token) {
    authStore.restoreUserState()
  }
  
  const isLoggedIn = authStore.isLoggedIn
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'login' })
    return
  }
  
  // 登录页面，如果已登录则重定向到首页
  if (to.meta.requiresGuest && isLoggedIn) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router
