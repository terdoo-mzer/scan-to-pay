<template>
  <div class="p-4">
    <header class="flex justify-between items-center">
      <h1 class="text-lg text-center text-gray-800 font-bold">Scan2Shop</h1>

      <!-- Cart icon -->
      <router-link to="/dashboard/cart">
        <div class="relative">
          <svg
            width="24"
            height="24"
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 106.53 122.88"
          >
            <title>shopping-bag</title>
            <path
              d="M4.93,30.34H27.41V25.76a25.77,25.77,0,0,1,51.53,0v4.58H101.6a4.91,4.91,0,0,1,3.47,1.45h0a4.9,4.9,0,0,1,1.44,3.48v69.9a17.75,17.75,0,0,1-17.7,17.7H17.7A17.75,17.75,0,0,1,0,105.18V35.28A4.91,4.91,0,0,1,1.45,31.8h0a4.91,4.91,0,0,1,3.47-1.45Zm28.76,0h39V25.76a19.49,19.49,0,0,0-39,0v4.58Zm-6.28,13V36.62H6.28v62h94V36.62H78.94v6.76a6.48,6.48,0,1,1-6.28-.12V36.62h-39v6.71a6.48,6.48,0,1,1-6.28,0Z"
            />
          </svg>
          <!-- Pill -->
          <div
            v-if="store.cartCount > 0"
            class="absolute top-[-5px] right-[-5px] bg-red-400 text-white text-xs flex justify-center items-center rounded-full w-[18px] h-[18px]"
          >
            {{ store.cartCount }}
          </div>
        </div>
      </router-link>
    </header>
    <router-link
      v-if="route.meta.showBackButton"
      to="/dashboard"
      class="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200"
    >
      <img src="/public/icons/left-arrow.svg" alt="Left Arrow" width="20" height="20" />
    </router-link>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useShopStore } from '@/stores'

import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const store = useShopStore()
</script>
  