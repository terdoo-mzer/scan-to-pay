<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold">Welcome</h1>
    <button
      ref="pwaButton"
      @click="installPwa"
      class="mt-5 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md"
    >
      Install App
    </button>
    <button
      @click="toastController('Succesfully added to cart', 'success')"
      class="mt-5 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md"
    >
      Show Success Toast
    </button>
    <button
      @click="fetchProduct"
      class="mt-5 px-6 py-3 bg-green-500 text-white rounded-lg shadow-md"
    >
      Fetch Product
    </button>
    <button
      @click="toastController('Product not found! please ask the attendants for help!', 'error')"
      class="mt-5 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md"
    >
      Show Error Toast
    </button>
    <div v-if="apiRes && apiRes.status === 200" class="mt-5">
      <h2 class="text-xl font-semibold">Product Details:</h2>
      <pre>{{ apiRes.message }}</pre>
    </div>
    <div v-if="apiRes && apiRes.status === 404" class="mt-5">
      <h2 class="text-xl font-semibold">Product Details:</h2>
      <pre>{{ apiRes.message }}</pre>
    </div>
  </div>
  <ToastComponent
    v-model:toastMessage="toastMessage"
    v-model:toastType="toastType"
    v-model:toastIsVisible="toastIsVisible"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToastComponent from '@/components/ToastComponent.vue'

const deferredPrompt = ref(null)

const apiRes = ref(null)

const toastMessage = ref('')
const toastType = ref('')
const toastIsVisible = ref(null)

const toastController = (message, type) => {
  toastMessage.value = message
  toastType.value = type
  toastIsVisible.value = true
}

const installPwa = async () => {
  console.log('Clicked')
  deferredPrompt.value.prompt()
}

// Initialize AudioContext for beep sound
const audioContext = new (window.AudioContext || window.webkitAudioContext)()
function playBeep() {
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
  gainNode.gain.setValueAtTime(0.5, audioContext.currentTime)

  oscillator.start()
  oscillator.stop(audioContext.currentTime + 0.1) // 100ms beep
}

const fetchProduct = async () => {
  playBeep()
  console.log('Checking product in DB:')
  console.log(`${import.meta.env.VITE_API_BASE_URL}/products/6036000022081`)
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/6036000022081`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    console.log('Product Data: ', data)
    apiRes.value = data
    return data
  } catch (error) {
    console.error('Error fetching product data:', error)
  }
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})
</script>
