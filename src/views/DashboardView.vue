<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <div class="w-full max-w-md flex flex-col gap-6">
      <!-- Section One -->
      <div class="text-center">
        <button
          :disabled="!network.isOnline"
          :class="!network.isOnline ? 'opacity-50 cursor-not-allowed' : ''"
          class="px-6 py-3 bg-black text-white text-lg rounded-lg shadow-md hover:bg-gray-700 transition"
          @click="goToDashboard"
        >
          Start Shopping
        </button>
      </div>

      <!-- Section Two -->
      <div
        v-if="loading"
        role="status"
        class="max-w-md p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded-sm shadow-sm animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <div class="flex items-center justify-between pt-4">
          <div>
            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
            <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
          </div>
          <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
        </div>
        <span class="sr-only">Loading...</span>
      </div>

      <div v-if="receipts" class="">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Recent Receipts</h2>
          <router-link to="dashboard/all-receipts" class="text-blue-500 hover:underline"
            >See all receipts</router-link
          >
        </div>

        <!-- Receipt List -->
        <ul class="space-y-3">
          <li v-for="receipt in receipts" :key="receipt._id">
            <router-link
              :to="`dashboard/receipt/${receipt._id}`"
              class="block p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
            >
              <div class="flex items-center gap-2">
                <!-- Icon -->
                <div
                  class="flex justify-center items-center rounded-full w-[40px] h-[40px] bg-gray-800/15"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 21H7C4.79086 21 3 19.2091 3 17V5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V18C17 19.6569 17.3431 21 19 21Z"
                      stroke="black"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M21 10C21 8.89543 20.1046 8 19 8H17V18.5C17 19.8807 17.6193 21 19 21C20.3807 21 21 19.8807 21 18.5V10Z"
                      stroke="black"
                      stroke-width="1"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path d="M13 11H7" stroke="black" stroke-width="2" stroke-linecap="round" />
                    <path d="M13 7H7" stroke="black" stroke-width="2" stroke-linecap="round" />
                    <path d="M10 15H7" stroke="black" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </div>

                <!-- Receipt details -->
                <div class="flex justify-between w-full">
                  <!-- Receipt title and date -->
                  <div class="">
                    <p>
                      <span class="text-black font-bold text-lg">#</span>
                      {{ receipt.receiptNumber }}
                    </p>
                    <small> {{ formatDate(receipt.createdAt) }} </small>
                  </div>

                  <!-- Financials -->
                  <div>{{ formatCurrency(receipt.total) }}</div>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- No Receipts --->
      <div v-if="message" class="text-center mt-10">
        <p class="text-gray-500">No receipts available.</p>
        <p class="text-gray-500">Start shopping to generate receipts.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

import formatCurrency from '@/services/currencyFormatter'
import formatDate from '@/services/dateTimeFormatter'
import { useShopStore } from '@/stores'
import { useNetworkStore } from '@/stores/network.js'

const shop = useShopStore()
const network = useNetworkStore()

const router = useRouter()

const receipts = ref(null)
const message = ref('')
const loading = ref(false)

const getOrders = async () => {
  loading.value = true
  try {
    const receiptsData = await shop.retrieveOrders()

    // There is no customer Id , so this will run
    if (receiptsData.code === 1) {
      message.value = receiptsData.message
      console.log('Error:', message.value)
      return
    }

    // Data is available here
    if (receiptsData.code === 0) {
      receipts.value = receiptsData.orders
      console.log('Receipts: ', receiptsData.orders)
      return
    }
  } catch (error) {
    console.log('Error:', error)
  } finally {
    loading.value = false
  }
}

const goToDashboard = () => {
  router.push('/dashboard/scanner')
}

watch(
  () => network.isOnline,
  (online) => {
    console.log('Online status changed:', online)
  }
)

onMounted(() => {
  getOrders()
})
</script>
