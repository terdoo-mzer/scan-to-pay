<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold">Welcome to Scan2Pay</h1>
    <button
      ref="pwaButton"
      @click="installPwa"
      class="mt-5 px-6 py-3 bg-black text-white rounded-lg shadow-md"
    >
      Install App
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)

const installPwa = async () => {
  console.log('Clicked')
  deferredPrompt.value.prompt()
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})
</script>
