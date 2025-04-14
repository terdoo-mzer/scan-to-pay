import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useShopStore = defineStore('shop', () => {
    const deviceId = ref(null);
    const cart = ref([]);
    const addCart = (product) => {
        // Check if the product is already in the cart
        const existingItem = cart.value.find(item => item.barcode === product.product.barcode);
        if(existingItem) {
            // If item exixts increase Item count and price
            existingItem.quantity++;
            existingItem.price += product.product.price;
            return
        } else {
            // Create a new item in the cart 
            const item = {
                barcode: product.product.barcode,
                name: product.product.name,
                quantity: 1,
                price: product.product.price,
            }
    
            cart.value.push(item);
        }
    
    }
    const removeCart = () => {}
    const cartCount = computed(() => {
        return cart.value.length
    })
    const createOrder = () => {}
    const clearCart = () => {}

    return {
        deviceId,
        cart,
        addCart,
        removeCart,
        cartCount,
        createOrder,
        clearCart
    }
})
