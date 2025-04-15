<template>
  <nav
    v-if="!route.meta.hideNavigation"
    class="bg-gray-100 p-3 fixed bottom-0 w-full flex justify-around border-t-[0.1px]"
  >
    <router-link to="/dashboard" class="px-4 py-2">Home</router-link>
    <router-link to="/dashboard/scanner" class="px-4 py-2">Shop</router-link>
    <router-link to="/dashboard/all-receipts" class="px-4 py-2">Receipts</router-link>
  </nav>
</template>
<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
  