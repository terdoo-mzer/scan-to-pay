<template>
  <div class="min-h-screen">
    <!-- Skeleton Loader -->
    <div v-if="loading" role="status" class="animate-pulse">
      <div v-for="i in 20" :key="i" class="h-2 bg-gray-200 rounded-full mb-2.5"></div>

      <span class="sr-only">Loading...</span>
    </div>

    <!-- Receipt Content -->
    <div
      v-if="receipt"
      class="receipt mx-auto p-4 bg-white text-black font-sans text-sm rounded shadow-lg"
    >
      <!-- Header -->
      <div class="text-center mb-4">
        <h1 class="font-bold text-lg">Scan 2 Pay</h1>
        <p>123 Main Street</p>
        <p>City, Country</p>
        <p>Tel: (123) 456-7890</p>
      </div>

      <h3 class="text-black">Receipt: {{ receipt.receiptNumber }}</h3>
      <div class="border-t border-black my-2"></div>

      <!-- Table Headers -->
      <div class="flex justify-between font-bold mb-2">
        <span>Qty</span>
        <span>Item</span>
        <span>Price</span>
      </div>

      <!-- Items -->
      <div class="space-y-2 mb-4">
        <div v-for="item in receipt.items" :key="item.receiptNumber" class="flex justify-between">
          <span>{{ item.quantity }}</span>
          <span class="break-words">{{ item.name }}</span>
          <span>{{ formatCurrency(item.price) }}</span>
        </div>
      </div>

      <div class="border-t border-black my-2"></div>

      <!-- Totals -->
      <div class="space-y-2 mb-4">
        <div class="flex justify-between font-semibold">
          <span>Subtotal</span>
          <span>{{ formatCurrency(receipt.subtotal) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Tax (5%)</span>
          <span>{{ formatCurrency(receipt.tax) }}</span>
        </div>
        <div class="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{{ formatCurrency(receipt.total) }}</span>
        </div>
      </div>

      <div class="border-t border-black my-2"></div>

      <!-- Disclaimers -->
      <div class="text-center text-xs mt-4 space-y-2">
        <p>Goods sold in good condition are not returnable.</p>
        <p>Please, no refund of cash after purchase.</p>
      </div>

      <!-- Footer -->
      <div class="text-center mt-4">
        <p>Thank you for shopping!</p>
        <p>Visit us again!</p>
        <p class="mt-2 text-xs">Receipt #: {{ receipt.receiptNumber }}</p>
        <p class="text-xs">Date: {{ formatDate(receipt.createdAt) }}</p>
      </div>

      <!-- Share Button -->
      <div class="max-w-sm mx-auto mt-4 flex justify-center">
        <button
          @click="shareReceipt"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-all duration-300"
        >
          Share Receipt
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errMsg" class="min-h-screen flex items-center justify-center text-center px-4">
      <p class="text-red-500 text-base">{{ errMsg }}</p>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useShopStore } from '@/stores'
import formatCurrency from '@/services/currencyFormatter'
import formatDate from '@/services/dateTimeFormatter'
import html2pdf from 'html2pdf.js'

const store = useShopStore()
const route = useRoute()
const receiptId = ref(route.params.orderId) // Assuming the receipt ID is passed as a route parameter
const receipt = ref(null)
const loading = ref(false)
const errMsg = ref('')

const retreiveReceipt = async () => {
  loading.value = true

  try {
    if (!receiptId.value) {
      console.error('No receipt ID provided')
      return
    }

    const response = await store.retrieveSingleOrder(receiptId.value)
    receipt.value = response[0]
    console.log('Receipt Data:', response[0])
  } catch (error) {
    console.error('Error:', error)
    errMsg.value = 'Failed to retrieve receipt. Please try again later.'
  } finally {
    loading.value = false
  }
}

const shareReceipt = async () => {
  try {
    const receiptElement = document.querySelector('.receipt')
    if (!receiptElement) {
      console.error('Receipt element not found.')
      alert('Receipt element not found')
      return
    }

    // Generate PDF blob
    const opt = {
      margin: 0.5,
      filename: `Receipt_${receipt.value.receiptNumber}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a5', orientation: 'portrait' },
    }

    const worker = html2pdf().from(receiptElement).set(opt)

    // Generate the PDF as blob
    const pdfBlob = await worker.outputPdf('blob')

    const file = new File([pdfBlob], `Receipt_${receipt.value.receiptNumber}.png`, {
      type: 'image/png',
    })

    // Now check if the Web Share API with files is available
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Your Receipt',
        text: 'Here is your purchase receipt. Thank you!',
        files: [file],
      })
    } else {
      // If cannot share, fallback: download instead

      await worker.save()
    }
  } catch (error) {
    alert('An error occured in sharing')
    console.error('Error sharing receipt:', error)
  }
}

onMounted(() => {
  retreiveReceipt()
})
</script>

<style lang="scss" scoped>
</style>