import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'


export const useShopStore = defineStore('shop', () => {
    // Initialize cart from localStorage if available
    const customerId = ref(JSON.parse(localStorage.getItem('customerId')) || null);
    const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
    
    // Save to localStorage whenever cart changes
    watch(cart, (newCart) => {
        localStorage.setItem('cart', JSON.stringify(newCart));
    }, { deep: true });

    // Add item to cart
    const addCart = (product) => {
        const existingItem = cart.value.find(item => item.barcode === product.product.barcode);
        if(existingItem) {
            existingItem.quantity++;
            existingItem.price = product.product.price * existingItem.quantity;
        } else {
            cart.value.push({
                barcode: product.product.barcode,
                name: product.product.name,
                description: product.product.description,
                quantity: 1,
                price: product.product.price,
                imageUrl: product.product.imageUrl // Added for display
            });
        }
    }

    // Remove item from cart
    const removeFromCart = (index) => {
        cart.value.splice(index, 1);
    }

    // Increment item quantity in cart
    const incrementQuantity = (index) => {
        const item = cart.value[index];
        if(item) {
            item.quantity++;
            item.price = (item.price / (item.quantity - 1)) * item.quantity;
        }
    }

    // Decrement item quantity in cart
    const decrementQuantity = (index) => {
        const item = cart.value[index];
        if(item) {
            if(item.quantity > 1) {
                item.quantity--;
                item.price = (item.price / (item.quantity + 1)) * item.quantity;
            } else {
                removeFromCart(index);
            }
        }
    }

    // Number if items in cart
    const cartCount = computed(() => {
        return cart.value.reduce((acc, item) => acc + item.quantity, 0);
    });

    const cartSubTotal = computed(() => {
        return cart.value.reduce((acc, item) => acc + item.price, 0);
    })

    // Total Amount
    const cartTotal = computed(() => {
        //return cartSubTotal.value + (cartSubTotal.value * 0.075); // Assuming 7.5% tax
        return cartSubTotal.value 
    });

    // Create order via the API
    const createOrder = async () => {

        try {
            // Check if devieID is set
            if(customerId.value === null) {
                // Generate a new device ID and save it to localStorage
                customerId.value = Math.random().toString(36).substring(2, 15);
                localStorage.setItem('customerId', JSON.stringify(customerId.value));
            } 

            const order = {
                customerId: customerId.value,
                items: cart.value
            }

            // Make API call to create order
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            })

            const data = await response.json();

            return data;
        } catch(error) {
            console.error('Error creating order:', error);
        }
        

    }


    const clearCart = () => {
        cart.value = [];
    }

    // Initialize from localStorage on store creation
    const loadCart = () => {
        const savedCart = localStorage.getItem('cart');
        if(savedCart) {
            cart.value = JSON.parse(savedCart);
        }
    }

    // Load cart immediately
    loadCart();

    return {
        customerId,
        cart,
        addCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        cartCount,
        cartTotal,
        cartSubTotal,
        createOrder,
        clearCart,
        loadCart
    }
})