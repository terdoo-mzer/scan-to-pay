<template>
  <transition name="slide-down">
    <div
      v-if="toastIsVisible"
      class="fixed top-0 left-0 right-0 p-4 flex justify-center items-center"
    >
      <div
        :class="{
          'bg-red-600 text-white': toastType === 'error',
          'bg-green-900 text-white': toastType === 'success',
        }"
        class="shadow-lg rounded-lg p-4 max-w-sm w-full"
      >
        <p class="text-white font-semibold">{{ toastMessage }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'

let timer

// const isToastVisible = ref(false)
const emit = defineEmits(['update:toastIsVisible', 'update:toastMessage', 'update:toastType'])
const props = defineProps({
  toastMessage: {
    type: String,
    required: true,
  },
  toastType: {
    type: String,
    required: true,
  },
  toastIsVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
})

// watch(
//   () => props.toastType,
//   (newVal, oldVal) => {
//     console.log('toastType changed from', oldVal, 'to', newVal)
//   }
// )

watch(
  () => props.toastIsVisible,
  (newValue) => {
    // isToastVisible.value = newValue
    clearInterval(timer)
    if (newValue) {
      timer = setTimeout(() => {
        emit('update:toastIsVisible', false) // ✅ notify parent to hide toast
        emit('update:toastMessage', '')
        emit('update:toastType', '')
        clearInterval(timer)
      }, 3000)
    }
  },
  { immediate: true }
)

// const handleToastVisibility = () => {}
</script>

<style scoped>
/* Slide-down transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>