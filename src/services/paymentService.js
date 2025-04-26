

/**
 *
 * Call Squad API here to make payment. Pass payload from the form filled by the user
 **/
export const processPayment = (payload) => {

    console.log("Processing payment:", payload);
  
    // Destructure the payload to extract necessary data
    const {  amount, transactionReference } = payload;
  
    console.log( amount, transactionReference);
  
    // Return a Promise to handle async response
    return new Promise((resolve, reject) => {
      if (!window.squad) {
        reject("Squad script not loaded!");
        return;
      }
  
      // Call the Squad API to initiate payment
      const squadInstance = new squad({
        onClose: () => {
          resolve({ status: "closed" }); // ✅ Resolve the response to the calling component
        },
        onLoad: () => console.log("Widget loaded successfully"),
        onSuccess: (response) => {
          // console.log("Payment Successful:", response);
          resolve(response); // ✅ Resolve the response to the calling component
        },
        key: import.meta.env.VITE_SQUAD_SANDBOX_PK, // Replace with your actual key

        email: `${transactionReference}@scan2pay.com`,
        amount: amount * 100, // Convert to Kobo
        transaction_ref: transactionReference,
        currency_code: "NGN",
      });
      squadInstance.setup();
      squadInstance.open();
    });
  };
  
  /**
   *
   * Verify payment by passing in the transaction reference from the url
   * THis must be called efore deciding whether to give value to the customer or not
   **/
  export const verifyPayment = async (transRef) => {
    try {
      // Step 1: Verify the payment with Squad API
      const squadResponse = await fetch(
        `https://sandbox-api-d.squadco.com/transaction/verify/${transRef}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SQUAD_SANDBOX_SK}`,
          },
        }
      );
  
      const squadData = await squadResponse.json();

  
      // Step 2: Update order if transaction is successful
      if (squadData.status === 200 && squadData.data.transaction_status === 'success') {
        const orderId = localStorage.getItem('order_id');
        if(!orderId) {
            throw new Error('Order ID not found in localStorage');
        }

        const updateResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}/confirm-payment`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: squadData.transaction_status,
              transaction_type: squadData.transaction_type,
            }),
          }
        );
  
        const updateData = await updateResponse.json();
        console.log('Order status updated:', updateData);
        return updateData
  
        
      } else {
        return {
          statusCode: squadData.status,
          transactionStatus: squadData.transaction_status || 'failed',
          error: 'Payment verification failed',
        };
      }
    } catch (error) {
      console.error('❌ Error verifying transaction:', error);
      return { statusCode: 500, transactionStatus: 'failed', error: error.message };
    }
  };

