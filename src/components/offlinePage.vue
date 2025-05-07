<template>
  <transition name="slide-down">
    <div
      v-if="!isOffline"
      class="fixed bg-black inset-0 z-50 bg-opacity-90 flex flex-col items-center justify-center p-6"
    >
      <div class="max-w-md w-full flex flex-col items-center space-y-4 text-center">
        <img height="40" width="40" src="/public/icons/s2s.png" alt="Scan 2 pay logo" />

        <img height="40" width="40" src="/public/icons/offline.svg" alt="Offline icon" />
        <p class="text-sm text-white font-semibold">
          Seems like you are offline. You need to be connected to the internet to use this app.
        </p>
      </div>
    </div>
  </transition>
</template>
  
  <script setup>
const props = defineProps({
  isOffline: {
    type: Boolean,
    required: true,
  },
})
</script>
  
  <style scoped>
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
  