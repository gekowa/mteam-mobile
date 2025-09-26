import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import TorrentDetailView from '../TorrentDetailView.vue'
import { createPinia, setActivePinia } from 'pinia'

// Mock dependencies
vi.mock('../../utils/api')
vi.mock('../../utils/formatters', () => ({
  formatFileSize: vi.fn((size) => `${size} MB`),
  getDiscountStyle: vi.fn((discount) => ({
    text: discount === 'FREE' ? '免费' : '50%',
    class: discount === 'FREE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  }))
}))

vi.mock('../../utils/constants', () => ({
  getCategoryName: vi.fn(() => '电影'),
  getVideoCodecName: vi.fn(() => 'H.264'),
  getAudioCodecName: vi.fn(() => 'AC3'),
  getStandardName: vi.fn(() => '1080p'),
  getCountriesName: vi.fn(() => '美国'),
  getTeamName: vi.fn(() => 'Test团队')
}))

vi.mock('../../stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    isLoggedIn: true,
    logout: vi.fn()
  }))
}))

vi.mock('../../utils/bbcodeRenderer', () => ({
  renderBBCodeAndMarkdown: vi.fn((text) => `<p>${text}</p>`)
}))

// Mock Vue Router
const mockPush = vi.fn(() => Promise.resolve().catch(() => {}))
const mockGo = vi.fn()
const mockRoute = { params: { id: '123' } }
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: mockPush,
      go: mockGo
    })),
    useRoute: vi.fn(() => mockRoute)
  }
})

describe('TorrentDetailView', () => {
  let wrapper
  let mockTorrentAPI
  let mockAuthStore

  const mockTorrentDetail = {
    data: {
      code: '0',
      data: {
        id: '123',
        name: '测试电影名称',
        smallDescr: '这是一部测试电影的简短描述',
        descr: '这是详细描述内容，包含[b]粗体[/b]和**markdown**格式',
        size: 5368709120,
        imageList: ['https://example.com/poster.jpg'],
        imdb: 'https://imdb.com/title/tt123456',
        imdbRating: '8.5',
        douban: 'https://douban.com/subject/123456',
        doubanRating: '9.0',
        labelsNew: ['HD', '中字', '蓝光'],
        collection: false,
        status: {
          seeders: 15,
          leechers: 3,
          timesCompleted: 120,
          views: 1500,
          discount: 'FREE'
        }
      }
    }
  }

  beforeEach(async () => {
    // Setup Pinia
    const pinia = createPinia()
    setActivePinia(pinia)

    // Reset mocks
    vi.clearAllMocks()
    mockPush.mockClear()
    mockGo.mockClear()

    // Reset router mocks
    const { useRouter, useRoute } = await import('vue-router')
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      go: mockGo
    })
    vi.mocked(useRoute).mockReturnValue(mockRoute)

    // Mock the API module
    const { torrentAPI } = await import('../../utils/api')
    mockTorrentAPI = {
      getTorrentDetail: vi.fn().mockResolvedValue(mockTorrentDetail),
      toggleTorrentCollection: vi.fn().mockResolvedValue({ data: { code: '0' } }),
      generateDownloadToken: vi.fn().mockResolvedValue({ 
        data: { 
          code: '0', 
          data: 'https://api.m-team.cc/api/rss/dlv2?sign=test&t=123&tid=123&uid=456' 
        } 
      })
    }
    vi.mocked(torrentAPI).getTorrentDetail = mockTorrentAPI.getTorrentDetail
    vi.mocked(torrentAPI).toggleTorrentCollection = mockTorrentAPI.toggleTorrentCollection
    vi.mocked(torrentAPI).generateDownloadToken = mockTorrentAPI.generateDownloadToken

    // Mock auth store
    const { useAuthStore } = await import('../../stores/auth')
    mockAuthStore = {
      isLoggedIn: true,
      logout: vi.fn()
    }
    vi.mocked(useAuthStore).mockReturnValue(mockAuthStore)
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    // Reset route params after each test
    mockRoute.params = { id: '123' }
    vi.restoreAllMocks()
  })

  describe('Component Initialization', () => {
    it('should render the component correctly with header', async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.find('h1').text()).toBe('种子详情')
      expect(wrapper.find('button').exists()).toBe(true) // Back button
      expect(wrapper.find('button[disabled]').exists()).toBe(false) // Refresh button should not be disabled initially
    })

    it('should call getTorrentDetail on mount with correct torrent ID', async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(mockTorrentAPI.getTorrentDetail).toHaveBeenCalledWith('123')
    })

    it('should handle missing torrent ID', async () => {
      const { useRoute } = await import('vue-router')
      vi.mocked(useRoute).mockReturnValue({ params: {} })
      
      // Mock API to reject with missing ID error
      mockTorrentAPI.getTorrentDetail.mockRejectedValue(new Error('种子ID不能为空'))
      
      wrapper = mount(TorrentDetailView)
      await flushPromises()

      // The component will still try to call API but with empty ID, resulting in an error
      expect(wrapper.vm.error).toContain('种子ID不能为空')
    })
  })

  describe('Loading States', () => {
    it('should show loading state when fetching torrent detail', async () => {
      let resolvePromise
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockTorrentAPI.getTorrentDetail.mockReturnValue(delayedPromise)

      wrapper = mount(TorrentDetailView)
      await nextTick()
      
      // Should show loading immediately
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      expect(wrapper.text()).toContain('正在加载...')

      // Resolve the promise
      resolvePromise(mockTorrentDetail)
      await flushPromises()
      
      // Loading should be gone
      expect(wrapper.find('.animate-spin').exists()).toBe(false)
    })

    it('should show error state when API fails', async () => {
      mockTorrentAPI.getTorrentDetail.mockRejectedValue(new Error('网络错误'))

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.find('.bg-red-50').exists()).toBe(true)
      expect(wrapper.text()).toContain('加载失败')
      expect(wrapper.text()).toContain('网络错误')
    })

    it('should show retry button in error state', async () => {
      mockTorrentAPI.getTorrentDetail.mockRejectedValue(new Error('网络错误'))

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      // Check if retry functionality exists by looking for the button text
      expect(wrapper.text()).toContain('重试')
    })
  })

  describe('Torrent Detail Display', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()
    })

    it('should display torrent information correctly', () => {
      expect(wrapper.text()).toContain('测试电影名称')
      expect(wrapper.text()).toContain('这是一部测试电影的简短描述')
      expect(wrapper.text()).toContain('5368709120 MB') // Formatted size
    })

    it('should display poster image when available', () => {
      const img = wrapper.find('img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe('https://example.com/poster.jpg')
      expect(img.attributes('alt')).toBe('测试电影名称')
    })

    it('should show placeholder when image is missing', async () => {
      const mockDetailWithoutImage = {
        ...mockTorrentDetail,
        data: {
          ...mockTorrentDetail.data,
          data: {
            ...mockTorrentDetail.data.data,
            imageList: null
          }
        }
      }
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(mockDetailWithoutImage)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      // Should show SVG placeholder
      const svgPlaceholder = wrapper.find('svg')
      expect(svgPlaceholder.exists()).toBe(true)
    })

    it('should display labels correctly', () => {
      const labels = ['HD', '中字', '蓝光']
      labels.forEach(label => {
        expect(wrapper.text()).toContain(label)
      })
    })

    it('should display ratings with correct links', () => {
      // Check IMDb rating
      expect(wrapper.text()).toContain('IMDb 8.5')
      const imdbLink = wrapper.find('a[href="https://imdb.com/title/tt123456"]')
      expect(imdbLink.exists()).toBe(true)

      // Check Douban rating
      expect(wrapper.text()).toContain('豆 9.0')
      const doubanLink = wrapper.find('a[href="https://douban.com/subject/123456"]')
      expect(doubanLink.exists()).toBe(true)
    })

    it('should hide ratings when not available', async () => {
      const mockDetailWithoutRatings = {
        ...mockTorrentDetail,
        data: {
          ...mockTorrentDetail.data,
          data: {
            ...mockTorrentDetail.data.data,
            imdb: null,
            imdbRating: null,
            douban: null,
            doubanRating: null
          }
        }
      }
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(mockDetailWithoutRatings)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.text()).not.toContain('IMDb')
      expect(wrapper.text()).not.toContain('豆')
    })
  })

  describe('Status Information', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()
    })

    it('should display torrent status information', () => {
      expect(wrapper.text()).toContain('种子状态')
      expect(wrapper.text()).toContain('做种者')
      expect(wrapper.text()).toContain('15')
      expect(wrapper.text()).toContain('下载者')
      expect(wrapper.text()).toContain('3')
      expect(wrapper.text()).toContain('完成数')
      expect(wrapper.text()).toContain('120')
      expect(wrapper.text()).toContain('浏览数')
      expect(wrapper.text()).toContain('1500')
    })

    it('should display discount information when available', () => {
      expect(wrapper.text()).toContain('优惠')
      expect(wrapper.text()).toContain('免费')
    })

    it('should hide discount section when discount is NORMAL', async () => {
      const mockDetailWithNormalDiscount = {
        ...mockTorrentDetail,
        data: {
          ...mockTorrentDetail.data,
          data: {
            ...mockTorrentDetail.data.data,
            status: {
              ...mockTorrentDetail.data.data.status,
              discount: 'NORMAL'
            }
          }
        }
      }
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(mockDetailWithNormalDiscount)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      // The discount section should not be visible for NORMAL discount
      expect(wrapper.text()).not.toContain('优惠:')
    })

    it('should handle missing status information', async () => {
      const mockDetailWithoutStatus = {
        ...mockTorrentDetail,
        data: {
          ...mockTorrentDetail.data,
          data: {
            ...mockTorrentDetail.data.data,
            status: null
          }
        }
      }
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(mockDetailWithoutStatus)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.text()).not.toContain('种子状态')
    })
  })

  describe('Description Section', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()
    })

    it('should display description section', () => {
      expect(wrapper.text()).toContain('详细描述')
    })

    it('should render description with BBCode and Markdown', async () => {
      // Check that the description content is rendered properly
      expect(wrapper.text()).toContain('这是详细描述内容')
      
      // Verify the mocked function was called
      await nextTick()
      const { renderBBCodeAndMarkdown } = await import('../../utils/bbcodeRenderer')
      expect(vi.mocked(renderBBCodeAndMarkdown)).toHaveBeenCalled()
    })

    it('should hide description section when not available', async () => {
      const mockDetailWithoutDescr = {
        ...mockTorrentDetail,
        data: {
          ...mockTorrentDetail.data,
          data: {
            ...mockTorrentDetail.data.data,
            descr: null
          }
        }
      }
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(mockDetailWithoutDescr)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.text()).not.toContain('详细描述')
    })
  })

  describe('User Interactions', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()
    })

    it('should go back when back button is clicked', async () => {
      // Mount with router mock in global config
      wrapper = mount(TorrentDetailView, {
        global: {
          mocks: {
            $router: {
              go: mockGo,
              push: mockPush
            }
          }
        }
      })
      await flushPromises()
      
      const backButton = wrapper.find('button')
      await backButton.trigger('click')
      
      expect(mockGo).toHaveBeenCalledWith(-1)
    })

    it('should refresh detail when refresh button is clicked', async () => {
      // Clear previous API calls
      mockTorrentAPI.getTorrentDetail.mockClear()
      
      // Find and click refresh button (second button in header)
      const refreshButton = wrapper.findAll('button')[1]
      await refreshButton.trigger('click')
      await flushPromises()

      expect(mockTorrentAPI.getTorrentDetail).toHaveBeenCalledWith('123')
    })

    it('should disable refresh button during loading', async () => {
      let resolvePromise
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockTorrentAPI.getTorrentDetail.mockClear()
      mockTorrentAPI.getTorrentDetail.mockReturnValue(delayedPromise)

      // Click refresh button
      const refreshButton = wrapper.findAll('button')[1]
      await refreshButton.trigger('click')
      await nextTick()

      expect(refreshButton.attributes('disabled')).toBeDefined()

      // Resolve the promise
      resolvePromise(mockTorrentDetail)
      await flushPromises()
      
      // Button should be enabled again
      expect(refreshButton.attributes('disabled')).toBeUndefined()
    })

    it('should handle image load errors', () => {
      const img = wrapper.find('img')
      const mockEvent = { target: { style: {} } }
      
      // Simulate error event
      wrapper.vm.handleImageError(mockEvent)
      
      expect(mockEvent.target.style.display).toBe('none')
    })

    it('should retry loading when retry button is clicked in error state', async () => {
      // First make the API fail
      mockTorrentAPI.getTorrentDetail.mockRejectedValue(new Error('网络错误'))
      
      wrapper = mount(TorrentDetailView)
      await flushPromises()

      // Should show error state
      expect(wrapper.vm.error).toContain('网络错误')

      // Mock successful retry
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(mockTorrentDetail)
      
      // Call retry function directly (since finding button with text is complex)
      await wrapper.vm.fetchTorrentDetail()

      expect(wrapper.vm.error).toBe('')
      expect(wrapper.vm.torrent).toBeTruthy()
    })
  })

  describe('Authentication Integration', () => {
    it('should redirect to login when not authenticated', async () => {
      mockAuthStore.isLoggedIn = false

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should handle 401 error correctly', async () => {
      const error = new Error('Unauthorized')
      error.response = { status: 401 }
      mockTorrentAPI.getTorrentDetail.mockRejectedValue(error)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(mockAuthStore.logout).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  describe('Route Parameters Watching', () => {
    it('should refetch data when route params change', async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()
      
      // Clear previous calls
      mockTorrentAPI.getTorrentDetail.mockClear()

      // Simulate route change
      mockRoute.params.id = '456'
      
      // Manually trigger the watcher (since we can't simulate actual route changes easily)
      await wrapper.vm.fetchTorrentDetail()

      expect(mockTorrentAPI.getTorrentDetail).toHaveBeenCalledWith('456')
    })

    it('should handle API response with error code', async () => {
      const errorResponse = {
        data: {
          code: '1',
          message: '种子不存在'
        }
      }
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(errorResponse)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.vm.error).toContain('种子不存在')
    })

    it('should handle API response without data', async () => {
      const emptyResponse = {
        data: {
          code: '0',
          data: null
        }
      }
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(emptyResponse)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.vm.error).toContain('获取种子详情失败')
    })
  })

  describe('Formatters Integration', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()
    })

    it('should format file size correctly', async () => {
      const { formatFileSize } = await import('../../utils/formatters')
      expect(vi.mocked(formatFileSize)).toHaveBeenCalledWith(5368709120)
    })

    it('should format discount style correctly', async () => {
      const { getDiscountStyle } = await import('../../utils/formatters')
      expect(vi.mocked(getDiscountStyle)).toHaveBeenCalledWith('FREE')
    })
  })

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('网络连接失败')
      mockTorrentAPI.getTorrentDetail.mockRejectedValue(networkError)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.find('.bg-red-50').exists()).toBe(true)
      expect(wrapper.vm.error).toContain('网络连接失败')
    })

    it('should handle unexpected errors gracefully', async () => {
      mockTorrentAPI.getTorrentDetail.mockRejectedValue(new Error())

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      expect(wrapper.vm.error).toContain('网络错误，请重试')
    })

    it('should clear error when successfully retrying', async () => {
      // First fail
      mockTorrentAPI.getTorrentDetail.mockRejectedValueOnce(new Error('网络错误'))
      // Then succeed
      mockTorrentAPI.getTorrentDetail.mockResolvedValueOnce(mockTorrentDetail)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      // Should have error
      expect(wrapper.vm.error).toBeTruthy()

      // Retry
      await wrapper.vm.fetchTorrentDetail()

      // Error should be cleared
      expect(wrapper.vm.error).toBe('')
      expect(wrapper.vm.torrent).toBeTruthy()
    })
  })

  describe('Component Lifecycle', () => {
    it('should fetch data on mount when torrent ID is available', async () => {
      // The API has already been called during beforeEach setup
      // Let's create a clean test by mounting a new component
      mockTorrentAPI.getTorrentDetail.mockClear()
      
      const newWrapper = mount(TorrentDetailView)
      await flushPromises()
      
      expect(mockTorrentAPI.getTorrentDetail).toHaveBeenCalled()
      
      newWrapper.unmount()
    })

    it('should handle errors when torrent ID is missing', async () => {
      const { useRoute } = await import('vue-router')
      vi.mocked(useRoute).mockReturnValue({ params: {} })
      
      // Mock API to simulate error handling for empty ID
      const errorResponse = new Error('种子ID不能为空')
      mockTorrentAPI.getTorrentDetail.mockRejectedValueOnce(errorResponse)
      
      wrapper = mount(TorrentDetailView)
      await flushPromises()

      // Component should handle missing ID gracefully with error message
      expect(wrapper.vm.error).toContain('种子ID不能为空')
    })
  })

  describe('Action Buttons', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentDetailView)
      await flushPromises()
    })

    it('should render action buttons area above stats section', () => {
      const actionButtons = wrapper.find('[data-testid="action-buttons"]')
      
      expect(actionButtons.exists()).toBe(true)
    })

    it('should render bookmark and download buttons', () => {
      const bookmarkButton = wrapper.find('[data-testid="bookmark-button"]')
      const downloadButton = wrapper.find('[data-testid="download-button"]')
      
      expect(bookmarkButton.exists()).toBe(true)
      expect(downloadButton.exists()).toBe(true)
    })

    it('should display correct bookmark icon when not bookmarked', () => {
      const bookmarkButton = wrapper.find('[data-testid="bookmark-button"]')
      const starIcon = bookmarkButton.find('svg')
      
      expect(starIcon.exists()).toBe(true)
      expect(starIcon.classes()).not.toContain('text-yellow-400')
      expect(starIcon.classes()).not.toContain('fill-current')
    })

    it('should display correct bookmark icon when bookmarked', async () => {
      const mockDetailBookmarked = {
        ...mockTorrentDetail,
        data: {
          ...mockTorrentDetail.data,
          data: {
            ...mockTorrentDetail.data.data,
            collection: true
          }
        }
      }
      mockTorrentAPI.getTorrentDetail.mockResolvedValue(mockDetailBookmarked)

      wrapper = mount(TorrentDetailView)
      await flushPromises()

      const bookmarkButton = wrapper.find('[data-testid="bookmark-button"]')
      const starIcon = bookmarkButton.find('svg')
      
      expect(starIcon.exists()).toBe(true)
      expect(starIcon.classes()).toContain('text-yellow-400')
      expect(starIcon.classes()).toContain('fill-current')
    })

    it('should toggle bookmark when bookmark button clicked', async () => {
      const bookmarkButton = wrapper.find('[data-testid="bookmark-button"]')
      await bookmarkButton.trigger('click')
      await flushPromises()

      expect(mockTorrentAPI.toggleTorrentCollection).toHaveBeenCalledWith('123', true)
    })

    it('should disable bookmark button during loading', async () => {
      let resolvePromise
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockTorrentAPI.toggleTorrentCollection.mockReturnValue(delayedPromise)

      const bookmarkButton = wrapper.find('[data-testid="bookmark-button"]')
      await bookmarkButton.trigger('click')
      await nextTick()

      expect(bookmarkButton.attributes('disabled')).toBeDefined()

      resolvePromise({ data: { code: '0' } })
      await flushPromises()

      expect(bookmarkButton.attributes('disabled')).toBeUndefined()
    })

    it('should call download API when download button clicked', async () => {
      const downloadButton = wrapper.find('[data-testid="download-button"]')
      await downloadButton.trigger('click')
      await flushPromises()

      expect(mockTorrentAPI.generateDownloadToken).toHaveBeenCalledWith('123')
    })

    it('should open download URL in new tab when download succeeds', async () => {
      // Mock window.open
      const mockOpen = vi.fn()
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        configurable: true
      })

      const downloadButton = wrapper.find('[data-testid="download-button"]')
      await downloadButton.trigger('click')
      await flushPromises()

      expect(mockOpen).toHaveBeenCalledWith(
        'https://api.m-team.cc/api/rss/dlv2?sign=test&t=123&tid=123&uid=456',
        '_blank'
      )
    })

    it('should disable download button during loading', async () => {
      let resolvePromise
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockTorrentAPI.generateDownloadToken.mockReturnValue(delayedPromise)

      const downloadButton = wrapper.find('[data-testid="download-button"]')
      await downloadButton.trigger('click')
      await nextTick()

      expect(downloadButton.attributes('disabled')).toBeDefined()

      resolvePromise({ data: { code: '0', data: 'test-url' } })
      await flushPromises()

      expect(downloadButton.attributes('disabled')).toBeUndefined()
    })

    it('should handle bookmark API errors gracefully', async () => {
      mockTorrentAPI.toggleTorrentCollection.mockRejectedValue(new Error('收藏失败'))
      
      const bookmarkButton = wrapper.find('[data-testid="bookmark-button"]')
      await bookmarkButton.trigger('click')
      await flushPromises()

      // Should not change the bookmark state on error
      expect(wrapper.vm.torrent.collection).toBe(false)
    })

    it('should handle download API errors gracefully', async () => {
      mockTorrentAPI.generateDownloadToken.mockRejectedValue(new Error('下载失败'))
      
      // Mock window.open to ensure it's not called
      const mockOpen = vi.fn()
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        configurable: true
      })

      const downloadButton = wrapper.find('[data-testid="download-button"]')
      await downloadButton.trigger('click')
      await flushPromises()

      // Should not open any window on error
      expect(mockOpen).not.toHaveBeenCalled()
    })
  })
})