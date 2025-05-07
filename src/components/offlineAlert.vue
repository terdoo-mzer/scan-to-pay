<template>
  <transition name="slide-down">
    <div
      v-if="!isOffline"
      class="h-18 text-xs bg-black fixed bottom-16 left-0 right-0 p-4 flex justify-center items-center"
    >
      <div
        class="shadow-lg rounded-lg p-4 max-w-sm w-full flex items-center justify-between space-x-2"
      >
        <img height="20" width="20" src="/icons/offline.svg" alt="Offline icon" />
        <p class="text-white font-semibold">
          Seems like you are offline. You have to be connected to the internet to use the app.
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