<template>
  <div class="h-screen flex flex-col items-center justify-center">
    <div class="w-full max-w-md flex flex-col gap-6">
      <!-- Section One -->
      <div class="text-center">
        <!-- <button
          class="px-6 py-3 bg-gray-800 text-white text-lg rounded-lg shadow-md hover:bg-blue-600 transition"
          @click="startShopping"
        >
          Start Shopping
        </button> -->
        <router-link
          to="/dashboard/scanner"
          class="px-6 py-3 bg-gray-800 text-white text-lg rounded-lg shadow-md hover:bg-blue-600 transition"
          @click="startShopping"
        >
          Start Shopping
        </router-link>
      </div>

      <!-- Section Two -->
      <div v-if="receipts !== null" class="">
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
      <div v-else class="text-center mt-10">
        <p class="text-gray-500">No receipts available.</p>
        <p class="text-gray-500">Start shopping to generate receipts.</p>
      </div>
    </div>
  </div>
  <!-- <ScannerModal :modalBool="isModalOpen" @closeModal="startShopping" /> -->
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import formatCurrency from '@/services/currencyFormatter'
import formatDate from '@/services/dateTimeFormatter'
import { useShopStore } from '@/stores'

const shop = useShopStore()

// const router = useRouter()

const receipts = ref(null)
const message = ref('')
const getOrders = async () => {
  const receiptsData = await shop.retrieveOrders()
  if (receiptsData.code === 1) {
    message.value = receiptsData.message
    console.log('Error:', message.value)
    return
  }
  if (receiptsData.code === 0) {
    message.value = receiptsData.message
    receipts.value = receiptsData.orders
    console.log('Receipts: ', receiptsData.orders)
    return
  }
}

onMounted(() => {
  getOrders()
})
</script>
