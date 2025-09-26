import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import TorrentListView from './TorrentListView.vue'
import * as VueRouter from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'

// Mock dependencies
vi.mock('../utils/api')
vi.mock('../utils/formatters', () => ({
  formatFileSize: vi.fn((size) => `${size} MB`),
  formatDate: vi.fn((date) => '2024-01-01'),
  formatRelativeTime: vi.fn((date) => '2小时前'),
  getDiscountStyle: vi.fn((discount) => ({
    text: discount === 'FREE' ? '免费' : '50%',
    class: discount === 'FREE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
  })),
  truncateText: vi.fn((text, length) => text?.length > length ? text.substring(0, length) + '...' : text)
}))

vi.mock('../stores/auth', () => ({
  useAuthStore: vi.fn(() => ({
    isLoggedIn: true,
    logout: vi.fn()
  }))
}))

// Mock Vue Router
const mockPush = vi.fn(() => Promise.resolve().catch(() => {}))
const mockGo = vi.fn()
const mockRoute = { query: {} }
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

describe('TorrentListView', () => {
  let wrapper
  let mockTorrentAPI
  let mockAuthStore

  const mockTorrentData = {
    data: {
      code: '0',
      data: {
        data: [
          {
            id: '1',
            name: '测试种子1',
            smallDescr: '测试描述1',
            size: 1073741824,
            createdDate: '2024-01-01T10:00:00Z',
            imageList: ['https://example.com/image1.jpg'],
            collection: false,
            status: {
              seeders: 10,
              leechers: 5,
              discount: 'FREE',
              toppingLevel: '1'
            },
            imdbRating: '8.5',
            doubanRating: '9.0',
            labelsNew: ['HD', '中字']
          },
          {
            id: '2',
            name: '测试种子2',
            smallDescr: '测试描述2',
            size: 2147483648,
            createdDate: '2024-01-01T09:00:00Z',
            imageList: null,
            collection: true,
            status: {
              seeders: 20,
              leechers: 3,
              discount: 'HALF'
            },
            labelsNew: ['4K']
          }
        ],
        totalPages: 2
      }
    }
  }

  beforeEach(async () => {
    // Setup Pinia
    const pinia = createPinia()
    setActivePinia(pinia)

    // Mock window.scrollTo
    global.window.scrollTo = vi.fn()

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
      searchTorrents: vi.fn().mockResolvedValue(mockTorrentData),
      toggleTorrentCollection: vi.fn().mockResolvedValue({ data: { code: '0' } })
    }
    vi.mocked(torrentAPI).searchTorrents = mockTorrentAPI.searchTorrents
    vi.mocked(torrentAPI).toggleTorrentCollection = mockTorrentAPI.toggleTorrentCollection

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
    delete global.window.scrollTo
    // Reset route query after each test
    mockRoute.query = {}
    vi.restoreAllMocks()
  })

  describe('Component Initialization', () => {
    it('should render the component correctly', () => {
      wrapper = mount(TorrentListView, {
        global: {
          stubs: ['router-link']
        }
      })

      expect(wrapper.find('h1').text()).toBe('种子列表')
      expect(wrapper.find('input[placeholder="输入关键词搜索..."]').exists()).toBe(true)
      expect(wrapper.find('select').exists()).toBe(true)
    })

    it('should initialize search parameters from URL query', async () => {
      mockRoute.query = { mode: 'tvshow', keyword: '测试关键词' }

      wrapper = mount(TorrentListView)
      await flushPromises()

      expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'tvshow',
          keyword: '测试关键词'
        })
      )
    })

    it('should call searchTorrents on mount', async () => {
      wrapper = mount(TorrentListView)
      await flushPromises()

      expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledOnce()
    })
  })

  describe('Search Functionality', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentListView)
      await flushPromises()
      // 清除挂载时的调用记录，测试只关心用户操作后的调用
      mockTorrentAPI.searchTorrents.mockClear()
    })

    it('should handle search with keyword', async () => {
      const searchInput = wrapper.find('input[placeholder="输入关键词搜索..."]')
      const searchButton = wrapper.findAll('button').find(btn => btn.text().includes('搜索'))

      await searchInput.setValue('新关键词')
      await searchButton.trigger('click')
      await flushPromises()

      expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          keyword: '新关键词',
          pageNumber: 1
        })
      )
    })

    it('should handle mode change', async () => {
      const modeSelect = wrapper.find('select')

      await modeSelect.setValue('music')
      await flushPromises()

      expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          mode: 'music'
        })
      )
    })

    it('should handle Enter key in search input', async () => {
      const searchInput = wrapper.find('input[placeholder="输入关键词搜索..."]')

      await searchInput.setValue('快捷搜索')
      await searchInput.trigger('keyup.enter')
      await flushPromises()

      expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledExactlyOnceWith(
        expect.objectContaining({
          keyword: '快捷搜索'
        })
      )
    })

    it('should clear keyword when clear button is clicked', async () => {
      const searchInput = wrapper.find('input[placeholder="输入关键词搜索..."]')
      
      await searchInput.setValue('要清除的关键词')
      await nextTick()
      
      // The clear button should now be visible. Find the parent button element
      const clearButton = wrapper.find('button svg path[d="M6 18L18 6M6 6l12 12"]').element?.closest('button')
      expect(clearButton).toBeTruthy()
      
      // Simulate click on the clear button
      wrapper.vm.clearKeyword()
      await flushPromises()

      expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledWith(
        expect.objectContaining({
          keyword: ''
        })
      )
    })
  })

  describe('Loading States', () => {
    it('should show loading state when searching', async () => {
      // Mock delayed response that never resolves initially
      let resolvePromise
      const delayedPromise = new Promise(resolve => {
        resolvePromise = resolve
      })
      mockTorrentAPI.searchTorrents.mockReturnValue(delayedPromise)

      wrapper = mount(TorrentListView)
      
      // Wait for component to mount and start loading
      await nextTick()
      
      // Should show loading immediately
      expect(wrapper.find('.animate-spin').exists()).toBe(true)
      expect(wrapper.text()).toContain('正在加载...')

      // Resolve the promise
      resolvePromise(mockTorrentData)
      await flushPromises()
      
      // Loading should be gone
      expect(wrapper.find('.animate-spin').exists()).toBe(false)
    })

    it('should show error state when API fails', async () => {
      mockTorrentAPI.searchTorrents.mockRejectedValue(new Error('网络错误'))

      wrapper = mount(TorrentListView)
      await flushPromises()

      expect(wrapper.find('.bg-red-50').exists()).toBe(true)
      expect(wrapper.text()).toContain('加载失败')
      expect(wrapper.text()).toContain('网络错误')
    })

    it('should show empty state when no torrents found', async () => {
      mockTorrentAPI.searchTorrents.mockResolvedValue({
        data: { code: '0', data: { data: [], totalPages: 0 } }
      })

      wrapper = mount(TorrentListView)
      await flushPromises()

      expect(wrapper.text()).toContain('暂无种子')
      expect(wrapper.text()).toContain('当前搜索条件下没有找到任何种子')
    })
  })

  describe('Torrent List Display', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentListView)
      await flushPromises()
    })

    it('should display torrent list correctly', () => {
      const torrentItems = wrapper.findAll('[data-testid="torrent-item"]')
      expect(torrentItems).toHaveLength(2)

      // Check first torrent
      const firstTorrent = torrentItems[0]
      expect(firstTorrent.text()).toContain('测试种子1')
      expect(firstTorrent.text()).toContain('测试描述1')
      expect(firstTorrent.find('img').attributes('src')).toBe('https://example.com/image1.jpg')
    })

    it('should show discount badge correctly', () => {
      const discountBadges = wrapper.findAll('.inline-flex')
      const freeBadge = discountBadges.find(badge => badge.text().includes('免费'))
      expect(freeBadge?.exists()).toBe(true)
    })

    it('should show ratings correctly', () => {
      expect(wrapper.text()).toContain('IMDb8.5')
      expect(wrapper.text()).toContain('豆9.0')
    })

    it('should show labels correctly', () => {
      expect(wrapper.text()).toContain('HD')
      expect(wrapper.text()).toContain('中字')
      expect(wrapper.text()).toContain('4K')
    })

    it('should show placeholder when image is missing', () => {
      const imagePlaceholders = wrapper.findAll('svg')
      expect(imagePlaceholders.length).toBeGreaterThan(0)
    })
  })

  describe('User Interactions', () => {
    beforeEach(async () => {
      wrapper = mount(TorrentListView)
      await flushPromises()
    })

    it('should navigate to torrent detail when clicked', async () => {
      const torrentItem = wrapper.find('[data-testid="torrent-item"]')
      
      await torrentItem.trigger('click')
      
      expect(mockPush).toHaveBeenCalledWith('/torrent/1')
    })

    it('should toggle favorite status', async () => {
      const favoriteButton = wrapper.find('[data-testid="favorite-button"]')
      
      await favoriteButton.trigger('click')
      await flushPromises()

      expect(mockTorrentAPI.toggleTorrentCollection).toHaveBeenCalledWith('1', true)
    })

    it('should refresh list when refresh button is clicked', async () => {
      const refreshButton = wrapper.find('button[data-testid="refresh-button"]')
      
      await refreshButton.trigger('click')
      await flushPromises()

      expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledTimes(2) // Once on mount, once on refresh
    })

    it('should go back when back button is clicked', async () => {
      // Mount component with proper router mock
      wrapper = mount(TorrentListView, {
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
      
      // Find the first button in the header, which should be the back button
      const backButton = wrapper.find('button')
      
      await backButton.trigger('click')
      
      expect(mockGo).toHaveBeenCalledWith(-1)
    })

    it('should not display load more button (legacy functionality removed)', async () => {
      const loadMoreButton = wrapper.findAll('button').find(btn => btn.text().includes('加载更多'))
      expect(loadMoreButton).toBeUndefined()
    })
  })

  describe('Authentication Integration', () => {
    it('should redirect to login when not authenticated', async () => {
      mockAuthStore.isLoggedIn = false

      wrapper = mount(TorrentListView)
      await flushPromises()

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('should handle 401 error correctly', async () => {
      const error = new Error('Unauthorized')
      error.response = { status: 401 }
      mockTorrentAPI.searchTorrents.mockRejectedValue(error)

      wrapper = mount(TorrentListView)
      await flushPromises()

      expect(mockAuthStore.logout).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  describe('URL Parameters Synchronization', () => {
    it('should update URL when search parameters change', async () => {
      wrapper = mount(TorrentListView)
      await flushPromises()

      const searchInput = wrapper.find('input[placeholder="输入关键词搜索..."]')
      const modeSelect = wrapper.find('select')

      await modeSelect.setValue('tvshow')
      await searchInput.setValue('新搜索')
      await wrapper.findAll('button').find(btn => btn.text().includes('搜索')).trigger('click')
      await flushPromises()

      expect(mockPush).toHaveBeenCalledWith({
        path: '/torrents',
        query: {
          mode: 'tvshow',
          keyword: '新搜索'
        }
      })
    })

    it('should not include empty keyword in URL', async () => {
      // Reset the route query to be clean
      mockRoute.query = {}
      
      wrapper = mount(TorrentListView)
      await flushPromises()

      // Clear any previous calls
      mockPush.mockClear()

      await wrapper.findAll('button').find(btn => btn.text().includes('搜索')).trigger('click')
      await flushPromises()

      expect(mockPush).toHaveBeenCalledWith({
        path: '/torrents',
        query: {
          mode: 'movie'
        }
      })
    })
  })

  describe('Sticky Background Classes', () => {
    it('should apply correct topping level background classes', async () => {
      wrapper = mount(TorrentListView)
      await flushPromises()

      // Check if the component applies the correct background class
      const vm = wrapper.vm
      const torrent1 = mockTorrentData.data.data.data[0]
      
      // Set search mode to movie to enable topping level
      vm.searchParams.mode = 'movie'
      
      const backgroundClass = vm.getStickyBackgroundClass(torrent1)
      expect(backgroundClass).toBe('bg-topping-level-1')
    })

    it('should return white background for non-movie/tv modes', async () => {
      wrapper = mount(TorrentListView)
      await flushPromises()

      const vm = wrapper.vm
      const torrent1 = mockTorrentData.data.data.data[0]
      
      vm.searchParams.mode = 'music'
      
      const backgroundClass = vm.getStickyBackgroundClass(torrent1)
      expect(backgroundClass).toBe('bg-white')
    })
  })

  describe('Error Handling', () => {
    it('should handle image load errors', async () => {
      wrapper = mount(TorrentListView)
      await flushPromises()

      const img = wrapper.find('img')
      const mockEvent = { target: { style: {} } }
      
      wrapper.vm.handleImageError(mockEvent)
      
      expect(mockEvent.target.style.display).toBe('none')
    })

    it('should handle API errors gracefully', async () => {
      mockTorrentAPI.searchTorrents.mockRejectedValue(new Error('服务器错误'))

      wrapper = mount(TorrentListView)
      await flushPromises()

      expect(wrapper.find('.bg-red-50').exists()).toBe(true)
      expect(wrapper.text()).toContain('服务器错误')
    })

    it('should handle favorite toggle errors', async () => {
      mockTorrentAPI.toggleTorrentCollection.mockRejectedValue(new Error('收藏失败'))

      wrapper = mount(TorrentListView)
      await flushPromises()

      const favoriteButton = wrapper.find('[data-testid="favorite-button"]')
      await favoriteButton.trigger('click')
      await flushPromises()

      // Should show error in the component
      expect(wrapper.vm.error).toBe('收藏失败')
    })
  })

  // describe('Route Watching', () => {
  //   it('should react to route query changes', async () => {
  //     mockRoute.query = { mode: 'movie' }

  //     wrapper = mount(TorrentListView)
  //     await flushPromises()

  //     // Clear previous calls
  //     mockTorrentAPI.searchTorrents.mockClear()

  //     // Simulate route change by updating the search params and triggering search
  //     wrapper.vm.searchParams.mode = 'tvshow'
  //     wrapper.vm.searchParams.keyword = 'new search'
      
  //     // Trigger search through the exposed handleSearch method
  //     await wrapper.vm.handleSearch()

  //     expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         mode: 'tvshow',
  //         keyword: 'new search'
  //       })
  //     )
  //   })
  // })

  describe('New Pagination Requirements', () => {
    describe('Search Result Summary', () => {
      it('should display search result summary when there are search conditions', async () => {
        // Set up search conditions (anything other than mode and page)
        mockRoute.query = { mode: 'movie', keyword: 'test' }
        
        const mockDataWithTotal = {
          data: {
            code: '0',
            data: {
              data: mockTorrentData.data.data.data,
              totalPages: 5,
              totalCount: 450
            }
          }
        }
        mockTorrentAPI.searchTorrents.mockResolvedValue(mockDataWithTotal)

        wrapper = mount(TorrentListView)
        await flushPromises()

        expect(wrapper.find('[data-testid="search-summary"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="search-summary"]').text()).toContain('450')
        expect(wrapper.find('[data-testid="search-summary"]').text()).toContain('5')
        expect(wrapper.find('[data-testid="search-summary"]').text()).toContain('1')
      })

      it('should NOT display search result summary when only mode parameter exists', async () => {
        mockRoute.query = { mode: 'movie' }

        wrapper = mount(TorrentListView)
        await flushPromises()

        expect(wrapper.find('[data-testid="search-summary"]').exists()).toBe(false)
      })

      it('should NOT display search result summary when only mode and page parameters exist', async () => {
        mockRoute.query = { mode: 'movie', page: '2' }

        wrapper = mount(TorrentListView)
        await flushPromises()

        expect(wrapper.find('[data-testid="search-summary"]').exists()).toBe(false)
      })
    })

    describe('Pagination Controls', () => {
      beforeEach(async () => {
        const mockDataWithPages = {
          data: {
            code: '0',
            data: {
              data: mockTorrentData.data.data.data,
              totalPages: 10,
              totalCount: 1000
            }
          }
        }
        mockTorrentAPI.searchTorrents.mockResolvedValue(mockDataWithPages)
        const { useRoute } = await import('vue-router')
        vi.mocked(useRoute).mockReturnValue({ query: { mode: 'movie', page: '5' } })
        
        wrapper = mount(TorrentListView)
        await flushPromises()
      })

      it('should display pagination controls at bottom center', () => {
        const paginationContainer = wrapper.find('[data-testid="pagination-container"]')
        expect(paginationContainer.exists()).toBe(true)
        expect(paginationContainer.classes()).toContain('text-center')
      })

      it('should display previous page link', () => {
        const prevButton = wrapper.find('[data-testid="prev-page-button"]')
        expect(prevButton.exists()).toBe(true)
        expect(prevButton.text()).toContain('<')
      })

      it('should display next page link', () => {
        const nextButton = wrapper.find('[data-testid="next-page-button"]')
        expect(nextButton.exists()).toBe(true)
        expect(nextButton.text()).toContain('>')
      })

      it('should display page dropdown with all available pages', () => {
        const pageSelect = wrapper.find('[data-testid="page-select"]')
        expect(pageSelect.exists()).toBe(true)
        
        const options = pageSelect.findAll('option')
        expect(options).toHaveLength(10) // Should have 10 pages
        expect(options[0].attributes('value')).toBe('1')
        expect(options[9].attributes('value')).toBe('10')
        expect(pageSelect.element.value).toBe('5') // Should be page 5 as set in beforeEach
      })

      it('should disable previous button on first page', async () => {
        const { useRoute } = await import('vue-router')
        vi.mocked(useRoute).mockReturnValue({ query: { mode: 'movie', page: '1' } })
        wrapper = mount(TorrentListView)
        await flushPromises()

        const prevButton = wrapper.find('[data-testid="prev-page-button"]')
        expect(prevButton.attributes('disabled')).toBeDefined()
      })

      it('should disable next button on last page', async () => {
        const { useRoute } = await import('vue-router')
        vi.mocked(useRoute).mockReturnValue({ query: { mode: 'movie', page: '10' } })
        wrapper = mount(TorrentListView)
        await flushPromises()

        const nextButton = wrapper.find('[data-testid="next-page-button"]')
        expect(nextButton.attributes('disabled')).toBeDefined()
      })
    })

    describe('Page Navigation', () => {
      beforeEach(async () => {
        const mockDataWithPages = {
          data: {
            code: '0',
            data: {
              data: mockTorrentData.data.data.data,
              totalPages: 10,
              totalCount: 1000
            }
          }
        }
        mockTorrentAPI.searchTorrents.mockResolvedValue(mockDataWithPages)
        const { useRoute } = await import('vue-router')
        vi.mocked(useRoute).mockReturnValue({ query: { mode: 'movie', page: '5' } })
        
        wrapper = mount(TorrentListView)
        await flushPromises()
        mockTorrentAPI.searchTorrents.mockClear()
      })

      it('should navigate to previous page when prev button clicked', async () => {
        const prevButton = wrapper.find('[data-testid="prev-page-button"]')
        await prevButton.trigger('click')
        await flushPromises()

        expect(mockPush).toHaveBeenCalledWith({
          path: '/torrents',
          query: { mode: 'movie', page: '4' }
        })
        expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({
            pageNumber: 4
          })
        )
      })

      it('should navigate to next page when next button clicked', async () => {
        const nextButton = wrapper.find('[data-testid="next-page-button"]')
        await nextButton.trigger('click')
        await flushPromises()

        expect(mockPush).toHaveBeenCalledWith({
          path: '/torrents',
          query: { mode: 'movie', page: '6' }
        })
        expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({
            pageNumber: 6
          })
        )
      })

      it('should navigate to selected page when dropdown changes', async () => {
        const pageSelect = wrapper.find('[data-testid="page-select"]')
        await pageSelect.setValue('8')
        await flushPromises()

        expect(mockPush).toHaveBeenCalledWith({
          path: '/torrents',
          query: { mode: 'movie', page: '8' }
        })
        expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledExactlyOnceWith(
          expect.objectContaining({
            pageNumber: 8
          })
        )
      })

      it('should call API exactly once per pagination action', async () => {
        const nextButton = wrapper.find('[data-testid="next-page-button"]')
        await nextButton.trigger('click')
        await flushPromises()

        expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledTimes(1)
      })
    })

    describe('URL and Page State Management', () => {
      it('should initialize page from URL parameter', async () => {
        // Set the route query before creating the wrapper
        const { useRoute } = await import('vue-router')
        vi.mocked(useRoute).mockReturnValue({ query: { mode: 'movie', page: '7' } })
        
        wrapper = mount(TorrentListView)
        await flushPromises()

        expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledWith(
          expect.objectContaining({
            pageNumber: 7
          })
        )
      })

      it('should default to page 1 when no page parameter in URL', async () => {
        const { useRoute } = await import('vue-router')
        vi.mocked(useRoute).mockReturnValue({ query: { mode: 'movie' } })
        
        wrapper = mount(TorrentListView)
        await flushPromises()

        expect(mockTorrentAPI.searchTorrents).toHaveBeenCalledWith(
          expect.objectContaining({
            pageNumber: 1
          })
        )
      })

      it('should update URL with page parameter when navigating', async () => {
        const mockDataWithPages = {
          data: {
            code: '0',
            data: {
              data: mockTorrentData.data.data.data,
              totalPages: 5
            }
          }
        }
        mockTorrentAPI.searchTorrents.mockResolvedValue(mockDataWithPages)
        const { useRoute } = await import('vue-router')
        vi.mocked(useRoute).mockReturnValue({ query: { mode: 'movie', keyword: 'test' } })
        
        wrapper = mount(TorrentListView)
        await flushPromises()
        mockPush.mockClear()

        // Navigate to page 3
        const pageSelect = wrapper.find('[data-testid="page-select"]')
        await pageSelect.setValue('3')
        await flushPromises()

        expect(mockPush).toHaveBeenCalledWith({
          path: '/torrents',
          query: {
            mode: 'movie',
            keyword: 'test',
            page: '3'
          }
        })
      })
    })

    describe('Loading State and Scroll Behavior', () => {
      beforeEach(() => {
        // Mock window.scrollTo
        global.window.scrollTo = vi.fn()
      })

      afterEach(() => {
        delete global.window.scrollTo
      })

      it('should show loading state during pagination', async () => {
        const mockDataWithPages = {
          data: {
            code: '0',
            data: {
              data: mockTorrentData.data.data.data,
              totalPages: 5
            }
          }
        }

        // Mock delayed response
        let resolvePromise
        const delayedPromise = new Promise(resolve => {
          resolvePromise = resolve
        })
        mockTorrentAPI.searchTorrents.mockReturnValueOnce(mockDataWithPages)
        mockTorrentAPI.searchTorrents.mockReturnValueOnce(delayedPromise)

        wrapper = mount(TorrentListView)
        await flushPromises()

        // Navigate to next page
        const nextButton = wrapper.find('[data-testid="next-page-button"]')
        await nextButton.trigger('click')
        
        // Should show loading state
        expect(wrapper.vm.loading).toBe(true)
        expect(wrapper.find('.animate-spin').exists()).toBe(true)

        // Resolve the promise
        resolvePromise(mockDataWithPages)
        await flushPromises()
        
        // Loading should be gone
        expect(wrapper.vm.loading).toBe(false)
      })

      it('should scroll to top after page data loads', async () => {
        const mockDataWithPages = {
          data: {
            code: '0',
            data: {
              data: mockTorrentData.data.data.data,
              totalPages: 5
            }
          }
        }
        mockTorrentAPI.searchTorrents.mockResolvedValue(mockDataWithPages)

        wrapper = mount(TorrentListView)
        await flushPromises()

        // Navigate to next page
        const nextButton = wrapper.find('[data-testid="next-page-button"]')
        await nextButton.trigger('click')
        await flushPromises()

        expect(global.window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
      })

      it('should replace torrent list on page navigation (not append)', async () => {
        const mockDataPage1 = {
          data: {
            code: '0',
            data: {
              data: [{ id: 'page1-item1', name: 'Page 1 Item 1' }],
              totalPages: 3
            }
          }
        }
        const mockDataPage2 = {
          data: {
            code: '0',
            data: {
              data: [{ id: 'page2-item1', name: 'Page 2 Item 1' }],
              totalPages: 3
            }
          }
        }

        mockTorrentAPI.searchTorrents.mockResolvedValueOnce(mockDataPage1)
        wrapper = mount(TorrentListView)
        await flushPromises()

        expect(wrapper.vm.torrents).toHaveLength(1)
        expect(wrapper.vm.torrents[0].id).toBe('page1-item1')

        // Navigate to page 2
        mockTorrentAPI.searchTorrents.mockResolvedValueOnce(mockDataPage2)
        const nextButton = wrapper.find('[data-testid="next-page-button"]')
        await nextButton.trigger('click')
        await flushPromises()

        // Should replace, not append
        expect(wrapper.vm.torrents).toHaveLength(1)
        expect(wrapper.vm.torrents[0].id).toBe('page2-item1')
      })
    })

    describe('Remove Legacy Load More Functionality', () => {
      it('should NOT display load more button', async () => {
        wrapper = mount(TorrentListView)
        await flushPromises()

        const loadMoreButton = wrapper.findAll('button').find(btn => btn.text().includes('加载更多'))
        expect(loadMoreButton).toBeUndefined()
      })

      it('should NOT have loadMore method functionality', async () => {
        wrapper = mount(TorrentListView)
        await flushPromises()

        // The loadMore method should not exist or should not affect pagination behavior
        expect(wrapper.vm.loadMore).toBeUndefined()
      })
    })
  })
})