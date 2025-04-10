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
      @click="fetchProduct"
      class="mt-5 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md"
    >
      Fetch Product
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
</template>

<script setup>
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)

const apiRes = ref(null)

const installPwa = async () => {
  console.log('Clicked')
  deferredPrompt.value.prompt()
}

const fetchProduct = async () => {
  console.log('Checking product in DB:')
  console.log(`${import.meta.env.VITE_API_BASE_URL}/products/6036000022081`)
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/603600002208`, {
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
