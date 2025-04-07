import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useShopStore = defineStore('shop', () => {
    const deviceId = ref(null);
    const cart = ref([]);
    const addCart = () => {}
    const removeCart = () => {}
    const cartCount = computed(() => {
        return cart.value.length
    })
    const clearCart = () => {}
})
