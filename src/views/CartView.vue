<template>
  <div class="">
    <div class="min-h-screen bg-gray-50 pb-[100px]">
      <div class="space-y-2 mb-4">
        <div class="flex justify-between">
          <span class="text-gray-600">Subtotal</span>
          <span class="font-medium">₦4,700</span>
        </div>
      </div>
      <!-- Cart Items -->
      <div class="divide-y divide-gray-200">
        <!-- Item 1 -->
        <div class="p-4 bg-white">
          <div class="flex gap-3">
            <!-- Product Image -->
            <div class="w-15 h-15 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img src="/public/icons/s2s.png" alt="Product" class="w-full h-full object-cover" />
            </div>

            <!-- Product Details -->
            <div class="flex-grow">
              <h3 class="font-medium text-gray-900 line-clamp-2">Product Name</h3>
              <p class="text-gray-500 text-sm mt-1">Product description</p>
              <p class="text-lg font-semibold text-gray-900 mt-2">₦1,200</p>
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center justify-between mt-3">
            <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              -
            </button>

            <span class="text-lg font-medium px-4">2</span>

            <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              +
            </button>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="p-4 bg-white">
          <div class="flex gap-3">
            <!-- Product Image -->
            <div class="w-15 h-15 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img src="/public/icons/s2s.png" alt="Product" class="w-full h-full object-cover" />
            </div>

            <!-- Product Details -->
            <div class="flex-grow">
              <h3 class="font-medium text-gray-900 line-clamp-2">Another Product</h3>
              <p class="text-gray-500 text-sm mt-1">Another description</p>
              <p class="text-lg font-semibold text-gray-900 mt-2">₦3,500</p>
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center justify-between mt-3">
            <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              -
            </button>

            <span class="text-lg font-medium px-4">1</span>

            <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              +
            </button>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="p-4 bg-white">
          <div class="flex gap-3">
            <!-- Product Image -->
            <div class="w-15 h-15 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img src="/public/icons/s2s.png" alt="Product" class="w-full h-full object-cover" />
            </div>

            <!-- Product Details -->
            <div class="flex-grow">
              <h3 class="font-medium text-gray-900 line-clamp-2">Another Product</h3>
              <p class="text-gray-500 text-sm mt-1">Another description</p>
              <p class="text-lg font-semibold text-gray-900 mt-2">₦3,500</p>
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center justify-between mt-3">
            <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              -
            </button>

            <span class="text-lg font-medium px-4">1</span>

            <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              +
            </button>
          </div>
        </div>

        <!-- Item 2 -->
        <div class="p-4 bg-white">
          <div class="flex gap-3">
            <!-- Product Image -->
            <div class="w-15 h-15 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img src="/public/icons/s2s.png" alt="Product" class="w-full h-full object-cover" />
            </div>

            <!-- Product Details -->
            <div class="flex-grow">
              <h3 class="font-medium text-gray-900 line-clamp-2">Another Product</h3>
              <p class="text-gray-500 text-sm mt-1">Another description</p>
              <p class="text-lg font-semibold text-gray-900 mt-2">₦3,500</p>
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="flex items-center justify-between mt-3">
            <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              -
            </button>

            <span class="text-lg font-medium px-4">1</span>

            <button class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              +
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <button class="w-full bg-black text-white py-3 px-4 rounded-lg font-medium">
          Proceed to Checkout (₦4,700)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useShopStore } from '@/stores'

const store = useShopStore()
</script>

<style lang="scss" scoped>
</style>