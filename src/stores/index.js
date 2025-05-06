import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'


export const useShopStore = defineStore('shop', () => {
    // Initialize cart from localStorage if available
    const customerId = ref(JSON.parse(localStorage.getItem('customerId')) || null);
    const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);

    // Retrieve completed orders for a customer using customer Id
    const retrieveOrders = async () => {
    
        try {
            if(customerId.value === null) {
               
                return {
                    message: 'There is No customer Id',
                    code: 1
                }
            }
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${customerId.value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if(!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            // Check if the response is empty   
            if(response.status === 404) {
                return "No orders yet"
            }

            const data = await response.json();
            console.log('Orders retrieved:', data.orders);
            return {
                message: 'Orders retrieved successfully',
                code: 0,
                orders: data.orders
            };
        }catch(error){
            console.error('Error retrieving orders:', error);

            throw error; // Rethrow the error to be handled by the caller

        }
    }

    // Retrieve single order by orderId
    const retrieveSingleOrder = async (orderId) => {
        try {
            if(!customerId.value) {
                throw new Error('There is No customer Id');
            }
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${customerId.value}/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if(!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();
            console.log("Order data retrieved: ", data)
            return data.order;
        }catch(error){
            console.error('Error retrieving order:', error);
            throw error; // Rethrow the error to be handled by the caller
        }
    }
    
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

            // const order = {
            
            //         items: [
            //           {
            //             barcode: "6154000082116",
            //             name: "Bigi 750ml Bottle Water",
            //             price: 400,
            //             quantity: 1
            //           },
            //           {
            //             barcode: "5449000293824",
            //             name: "Coca-cola 60cl",
            //             price: 700,
            //             quantity: 1
            //           }
            //         ],
            //       customerId: customerId.value
            
                
            // }


            // Make API call to create order
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            })

            const data = await response.json();
            console.log('Order created:', data);

            // Check if order id is in Localstorage, If there is, override it with the new one
            const existingOrderId = localStorage.getItem('order_id');
            if(existingOrderId) {
                console.log('Removing this id: ', existingOrderId)
                localStorage.removeItem('order_id');
            }
            // Save new order ID to localStorage
            console.log('Saving this id: ', data.orderId)
            localStorage.setItem('order_id', data.orderId); 

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
        retrieveOrders,
        retrieveSingleOrder,
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