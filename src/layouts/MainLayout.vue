<template>
  <div class="h-screen flex flex-col">
    <!-- Header Navigation -->
    <HeaderNav />
    <div class="flex-1 overflow-auto bg-gray-100 p-4">
      <!-- Child pages will be rendered here -->
      <router-view />
    </div>
    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>
  
  <script setup>
import HeaderNav from '@/components/HeaderNav.vue'
import BottomNav from '@/components/BottomNav.vue'
</script>
  