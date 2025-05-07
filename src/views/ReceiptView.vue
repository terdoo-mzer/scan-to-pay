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

    <!-- Test Ensure to remove-->
    <!-- <div id="test" style="width: 200px; height: 100px; background: red; color: white">Test PDF</div> -->
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useShopStore } from '@/stores'
import formatCurrency from '@/services/currencyFormatter'
import formatDate from '@/services/dateTimeFormatter'
import html2pdf from 'html2pdf.js'
import { jsPDF } from 'jspdf'

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
    // alert('Starting receipt share process...')

    // alert('Generating PDF...')
    // Check if receipt data is available
    if (!receipt.value || !receipt.value.items) {
      alert('Receipt data not available')
      return
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'a5',
    })

    // Set default font to Times for better Unicode support (Naira symbol)
    doc.setFont('times', 'normal')
    doc.setFontSize(12)

    // Helper function to draw a thin, light grey solid line
    const drawLine = (y, startX = 0.5, width = 4.5) => {
      doc.setLineWidth(0.005) // Thinner line (0.005 inches ~ 0.36 points)
      doc.setDrawColor(150) // Light grey (RGB 150/255)
      doc.line(startX, y, startX + width, y)
      doc.setDrawColor(0) // Reset to black
    }

    // Helper function to draw a thinner, lighter grey dashed line
    const drawDashedLine = (y, startX = 0.5, width = 4.5) => {
      doc.setLineWidth(0.003) // Thinner line (0.003 inches ~ 0.22 points)
      doc.setDrawColor(200) // Lighter grey (RGB 200/255)
      doc.setLineDash([0.1, 0.1], 0)
      doc.line(startX, y, startX + width, y)
      doc.setLineDash() // Reset dash pattern
      doc.setDrawColor(0) // Reset to black
    }

    // Header
    doc.setFontSize(16)
    doc.setFont('times', 'bold')
    doc.text('Scan 2 Pay', 2.75, 0.5, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont('times', 'normal')
    doc.text('123 Main Street, City, Country', 2.75, 0.75, { align: 'center' })
    doc.text('Tel: (123) 456-7890', 2.75, 0.95, { align: 'center' })

    // Separator (thin, light grey solid line)
    drawLine(1.15)

    // Receipt Info
    doc.setFontSize(11)
    doc.text(`Receipt #: ${receipt.value.receiptNumber || 'N/A'}`, 0.5, 1.35)
    doc.text(`Date: ${formatDate(receipt.value.createdAt || new Date())}`, 4.5, 1.35, {
      align: 'right',
    })

    // Item Table Header
    drawDashedLine(1.55)
    doc.setFont('times', 'bold')
    doc.setFontSize(11)
    doc.text('Qty', 0.5, 1.75)
    doc.text('Description', 1.0, 1.75)
    doc.text('Amount', 4.5, 1.75, { align: 'right' })
    doc.setFont('times', 'normal')
    doc.setFontSize(10)

    // Items (dynamic)
    let y = 2.0
    receipt.value.items.forEach((item) => {
      const itemName =
        item.name && item.name.length > 25
          ? item.name.substring(0, 22) + '...'
          : item.name || 'Unknown'
      const formattedPrice = formatCurrency(item.price || 0).replace('₦', 'NGN ') // Fallback if ₦ doesn't render
      doc.text((item.quantity || 0).toString(), 0.5, y)
      doc.text(itemName, 1.0, y)
      doc.text(formattedPrice, 4.5, y, { align: 'right' })
      y += 0.3
    })

    // Separator (thinner, lighter grey dashed line after items)
    drawDashedLine(y)
    y += 0.25

    // Totals (adjusted spacing for descriptions)
    doc.setFontSize(11)
    doc.text('Subtotal:', 2.5, y) // Moved from x=3.0 to x=2.5 for more space
    doc.text(formatCurrency(receipt.value.subtotal || 0).replace('₦', 'NGN '), 4.5, y, {
      align: 'right',
    })
    y += 0.25
    doc.text('Tax (5%):', 2.5, y) // Moved from x=3.0 to x=2.5
    doc.text(formatCurrency(receipt.value.tax || 0).replace('₦', 'NGN '), 4.5, y, {
      align: 'right',
    })
    y += 0.25
    doc.setFont('times', 'bold')
    doc.setFontSize(12)
    doc.text('Total:', 2.5, y) // Moved from x=3.0 to x=2.5
    doc.text(formatCurrency(receipt.value.total || 0).replace('₦', 'NGN '), 4.5, y, {
      align: 'right',
    })
    doc.setFont('times', 'normal')

    // Separator (thin, light grey solid line before disclaimers)
    y += 0.35
    drawLine(y)
    y += 0.3

    // Disclaimers
    doc.setFontSize(9)
    doc.text('Goods sold in good condition are not returnable.', 2.75, y, { align: 'center' })
    y += 0.25
    doc.text('Please, no refund of cash after purchase.', 2.75, y, { align: 'center' })

    // Footer
    y += 0.4
    doc.setFontSize(11)
    doc.text('Thank you for shopping with us!', 2.75, y, { align: 'center' })
    y += 0.25
    doc.text('Visit us again!', 2.75, y, { align: 'center' })

    const pdfBlob = doc.output('blob')
    // alert('PDF generated successfully')

    const pdfFile = new File([pdfBlob], `receipt_${receipt.value.receiptNumber || 'default'}.pdf`, {
      type: 'application/pdf',
    })
    // alert('PDF file created')

    if (navigator.canShare && navigator.canShare({ files: [pdfFile] })) {
      // alert('Attempting to share via Web Share API...')
      await navigator.share({
        title: 'Your Receipt',
        text: 'Here is your purchase receipt. Thank you!',
        files: [pdfFile],
      })
      // alert('Receipt shared successfully')
    } else {
      alert('Web Share not supported, downloading instead...')
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'receipt.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      // alert('Receipt downloaded')
    }
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

onMounted(() => {
  retreiveReceipt()
})
</script>

<style lang="scss" scoped>
</style>