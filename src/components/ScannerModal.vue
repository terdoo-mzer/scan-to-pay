<template>
  <div v-if="modalBool" class="relative flex justify-center">
    <div
      class="fixed inset-0 z-10 overflow-y-auto bg-gray-800/20"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          @click="closeModal"
          class="absolute top-[55px] right-[20px] rounded-full bg-white flex justify-center items-center h-[30px] w-[30px]"
        >
          X
        </div>

        <!-- video output here -->
        <div
          class="relative inline-block p-4 overflow-hidden h-[500px] text-left align-middle transition-all transform bg-white shadow-xl sm:max-w-sm rounded-xl sm:my-8 sm:w-full sm:p-6"
        >
          <div class="camera">
            <video id="video">Video stream not available.</video>
            <button id="start-button">Take photo</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const isModalOpen = ref(false)
const emits = defineEmits(['closeModal'])

const props = defineProps({
  modalBool: {
    type: Boolean,
    required: true,
  },
})

const closeModal = () => {
  emits('closeModal', false)
}

// check compatibility
const checkBarcode = () => {
  if (!('BarcodeDetector' in globalThis)) {
    alert('Barcode Detector is not supported by this browser.')
  } else {
    alert('Barcode Detector supported!')

    // create new detector
    const barcodeDetector = new BarcodeDetector({
      formats: ['code_39', 'codabar', 'ean_13'],
    })
  }
}

// Only perform barcode scanning when the modal is opened
// We thus are using watch to track if the modal is opened.

watch(
  () => props.modalBool,
  (newVal) => {
    // If props.modalBool is === true, then call start the barcode scan process
    if (newVal) {
      checkBarcode()
    }
  }
)

// onMounted(() => {
//   if (props.modalBool === true) {
//     checkBarcode()
//   }
// })
</script>

<style lang="scss" scoped>
</style>