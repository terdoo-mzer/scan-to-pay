// stores/network.js
import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'

export const useNetworkStore = defineStore('network', () => {
  const isOnline = ref(navigator.onLine)

  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine
  }

  
  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)
  })

  return { isOnline }
})
