import { defineStore } from 'pinia'
import { ref } from 'vue'
import { memberAPI } from '../utils/api'

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchProfile() {
    loading.value = true
    error.value = null
    try {
      const response = await memberAPI.getProfile()
      if (response.data.code === '0') {
        profile.value = response.data.data
      } else {
        throw new Error(response.data.message)
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch profile'
      console.error(err)
    }
    loading.value = false
  }

  return { profile, loading, error, fetchProfile }
})
