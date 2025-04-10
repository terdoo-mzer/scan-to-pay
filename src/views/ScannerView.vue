<template>
  <div class="relative w-full h-full overflow-hidden bg-black" @click="wakeCamera">
    <video ref="video" id="video" class="w-full h-full object-cover bg-black" autoplay muted>
      Video stream not available.
    </video>
    <div
      class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] border-2 border-white box-border pointer-events-none z-10 barcode-marker"
    ></div>
    <div
      v-if="isCameraSleeping"
      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 pointer-events-auto"
    >
      <p class="text-white text-lg">Camera is sleeping. Tap to wake.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Refs for DOM elements and state
const video = ref(null)
let barcodeDetector = null
let animationFrameId = null
const canDetect = ref(true)
const isCameraSleeping = ref(false)
let sleepTimeout = null
const INACTIVITY_DELAY = 5000

// Initialize and fetch the video stream
function fetchVideoStream() {
  const constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('getUserMedia API not supported!')
    return
  }

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      if (video.value) {
        video.value.srcObject = stream
        video.value.onloadedmetadata = () => {
          video.value
            .play()
            .then(() => {
              console.log('Video playing successfully')
              startBarcodeDetection()
            })
            .catch((error) => {
              console.error('Error playing video:', error.message, error)
            })
        }
      }
    })
    .catch((error) => {
      console.error('Failed to access stream:', error.message, error)
    })
}

// Set up the Barcode Detection API
function startBarcodeDetection() {
  if (!('BarcodeDetector' in window)) {
    console.warn('Barcode Detection API not supported!')
    return
  }

  barcodeDetector = new BarcodeDetector({
    formats: ['ean_13', 'upc_a', 'qr_code'],
  })

  // Start the sleep timeout when scanning begins
  resetSleepTimeout()
  detectBarcode()
}

// Detect barcodes in the video feed

async function detectBarcode() {
  if (!video.value || !barcodeDetector || isCameraSleeping.value) return

  animationFrameId = requestAnimationFrame(detectBarcode)

  if (!canDetect.value) return

  canDetect.value = false

  try {
    const barcodes = await barcodeDetector.detect(video.value)
    if (barcodes.length > 0) {
      const barcode = barcodes[0]
      console.log('Barcode detected:', {
        rawValue: barcode.rawValue,
        format: barcode.format,
        boundingBox: barcode.boundingBox,
      })

      // Check if product exists in "DB"
      const product = await checkProductInDB(barcode.rawValue)
      if (product) {
        alert(`Product found for barcode: ${barcode.rawValue}`)
        //addToCart(barcode.rawValue, product.name)
      } else {
        alert(`Product not found for barcode: ${barcode.rawValue}`)
        //addToCart(barcode.rawValue) // Add with barcode only if not in DB
      }

      console.log('Resetting sleep timeout due to barcode detection')
      resetSleepTimeout()
    } else {
      console.log('No barcodes detected.')
    }
  } catch (error) {
    console.error('Detection error:', error.message, error)
  } finally {
    setTimeout(() => {
      canDetect.value = true
      console.log('Cooldown ended, can detect again')
    }, 3000)
  }
}

// Reset or start the sleep timeout
function resetSleepTimeout() {
  console.log('Clearing sleep timeout')
  clearTimeout(sleepTimeout)
  console.log('Setting new sleep timeout for 5 seconds')
  sleepTimeout = setTimeout(() => {
    console.log('No activity for 5 seconds, putting camera to sleep...')
    sleepCamera()
  }, INACTIVITY_DELAY)
}

// Put the camera to sleep
function sleepCamera() {
  stopBarcodeDetection()
  isCameraSleeping.value = true
}

// Wake the camera on user click
function wakeCamera() {
  if (isCameraSleeping.value) {
    isCameraSleeping.value = false
    fetchVideoStream()
  }
}

// Stop the detection loop and clean up
function stopBarcodeDetection() {
  console.log('Stopping barcode detection')
  clearTimeout(sleepTimeout)
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject
    stream.getTracks().forEach((track) => {
      console.log('Stopping video track:', track)
      track.stop()
    })
    video.value.srcObject = null
  }
}

// Function to check if a product exists in the DB
const checkProductInDB = async (productCode) => {
  console.log('Checking product in DB:', productCode)
  console.log(`${import.meta.env.VITE_API_BASE_URL}/products/${productCode}`)
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${productCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    console.log('Product Data: ', data)
    return data
  } catch (error) {
    console.error('Error fetching product data:', error)
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchVideoStream()
})

onUnmounted(() => {
  stopBarcodeDetection()
})
</script>

<style scoped>
/* Barcode Marker Pseudo-elements */
.barcode-marker::before,
.barcode-marker::after {
  content: '';
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid white;
}

.barcode-marker::before {
  top: -2px;
  left: -2px;
  border-right: none;
  border-bottom: none;
}

.barcode-marker::after {
  top: -2px;
  right: -2px;
  border-left: none;
  border-bottom: none;
}

.barcode-marker::before {
  bottom: -2px;
  left: -2px;
  border-right: none;
  border-top: none;
}

.barcode-marker::after {
  bottom: -2px;
  right: -2px;
  border-left: none;
  border-top: none;
}
</style>