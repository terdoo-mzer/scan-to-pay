<template>
  <div class="min-h-screen">
    <div v-if="store.cartCount > 0" class="pb-[100px]">
      <!-- Cart Items -->
      <div class="divide-y divide-gray-200 pb-[20px]">
        <!-- Item 1 -->
        <div v-for="(item, index) in store.cart" :key="index" class="p-4 bg-white">
          <div class="flex gap-3">
            <!-- Product Image -->
            <div class="w-15 h-15 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img src="/public/icons/s2s.png" alt="Product" class="w-full h-full object-cover" />
            </div>

            <!-- Product Details -->
            <div class="flex-grow">
              <h3 class="font-medium text-gray-900 line-clamp-2">{{ item.name }}</h3>
              <p class="text-gray-500 text-sm mt-1">{{ item.description }}</p>
              <p class="text-lg font-semibold text-gray-900 mt-2">
                {{ formatCurrency(item.price) }}
              </p>
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="flex justify-between items-center mt-3">
            <p class="text-amber-700" @click="store.removeFromCart(index)">Remove Item</p>
            <div class="flex items-center justify-between">
              <button
                class="w-10 h-10 rounded-full bg-gray-100 font-bold flex items-center justify-center"
              >
                -
              </button>

              <span class="text-lg font-medium px-4"> {{ item.quantity }}</span>

              <button
                class="w-10 h-10 rounded-full bg-gray-100 font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-center items-center">
          <router-link
            to="/dashboard/scanner"
            class="w-full flex justify-center items-center bg-black text-white py-3 px-4 rounded-lg font-medium"
          >
            Continue Shopping
          </router-link>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div class="space-y-2 mb-4">
          <p class="text-lg font-semiboldtext-gray-600">
            You have <span class="text-black">{{ store.cartCount }} items</span> in cart
          </p>
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal</span>
            <span class="font-medium">{{ formatCurrency(store.cartSubTotal) }}</span>
          </div>
        </div>
        <button class="w-full bg-black text-white py-3 px-4 rounded-lg font-medium">
          Proceed to Checkout {{ formatCurrency(store.cartTotal) }}
        </button>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center">
      <img src="/public/icons/cart.svg" width="70" height="70" alt="Empty cart" class="" />
      <h3 class="text-lg">Your cart is empty</h3>

      <router-link
        to="/dashboard/scanner"
        class="w-full flex justify-center items-center bg-black text-white py-3 px-4 rounded-lg font-medium"
      >
        Start Shopping
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useShopStore } from '@/stores'
import formatCurrency from '@/services/currencyFormatter'

const store = useShopStore()
</script>

<style lang="scss" scoped>
</style>