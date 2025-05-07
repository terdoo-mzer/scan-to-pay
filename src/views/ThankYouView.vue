<template>
  <div class="flex items-center justify-center min-h-screen bg-white">
    <div class="text-center space-y-4">
      <div v-if="transactionState === 'null'">
        <div class="text-xl font-semibold text-gray-700">
          Please hold while we confirm your payment...
        </div>
        <div class="w-20 h-20 mx-auto">
          <!-- Replace this with your custom loader -->
          <img src="/icons/loader.svg" alt="Loader" />
        </div>
      </div>
      <div v-if="transactionState === 'success'">
        <div class="text-xl font-semibold text-gray-700">
          Your payment has being confirmed, redirecting away from this page...
        </div>
        <div class="w-20 h-20 mx-auto">
          <!-- Replace this with your custom loader -->
          Add checkmark icon here
        </div>
      </div>
      <div v-if="transactionState === 'failed'">
        <div class="text-xl font-semibold text-gray-700">Your payment failed, Please retry...</div>
        <div class="w-20 h-20 mx-auto">
          <!-- Replace this with your custom loader -->
          Add Failed icon here
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { verifyPayment } from '@/services/paymentService'
import { useShopStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useShopStore()

const reference = route.query.reference
const transactionState = ref(null)

const confirmPayment = async () => {
  const orderId = localStorage.getItem('order_id')

  if (!orderId) {
    console.log('No orderId found in localStorage')
    return
  }

  if (!reference) {
    console.log('No reference provided')
    return
  }
  console.log('Transaction Reference: ', reference)

  const verifyPay = await verifyPayment(reference)
  if (verifyPay.status === 200) {
    transactionState.value = 'success'
    console.log('Payment verified successfully')
    localStorage.removeItem('orderId')
    // Clear cart here
    store.clearCart()
    router.replace({ name: 'ReceiptPage', params: { orderId } })
  } else {
    transactionState.value = 'failed'
    console.log('Payment verification failed:', verifyPay.error)
  }
}

onMounted(() => {
  confirmPayment()
})
</script>

<style lang="scss" scoped>
</style>