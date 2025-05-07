<script setup>
import { RouterView } from 'vue-router'

import offlinePage from '@/components/offlinePage.vue'
import { useNetworkStore } from '@/stores/network.js'
const network = useNetworkStore()
</script>

<template>
  <RouterView />
  <offlinePage :isOffline="network.isOnline" />
</template>
<style scoped>
</style>
