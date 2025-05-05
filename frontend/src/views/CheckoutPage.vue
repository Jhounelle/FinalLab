<template>
  <div class="checkout container py-5">
    <div class="row">

      <!-- Order Success Message -->
      <div v-if="orderSuccess" class="col-12 text-center mb-4">
        <div class="alert alert-success mb-4">
          <h4>Your order has been placed successfully!</h4>
          <p>You will be redirected to the homepage in a moment...</p>
        </div>
        <router-link to="/" class="btn btn-primary">
          Continue Shopping
        </router-link>
      </div>

      <!-- Main Checkout UI -->
      <template v-else>
        <!-- Left Column: Checkout Summary -->
        <div class="col-12 col-md-6 mb-4">
          <div v-if="!cart.length">
            <div class="alert alert-warning">
              <p>Your cart is empty. Please add some items to proceed.</p>
            </div>
            <router-link to="/" class="btn btn-primary">Back to Store</router-link>
          </div>

          <div v-else>
            <h3 class="mb-4">Order Summary</h3>
            <div class="cart-items mb-4">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cart" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td>₱{{ item.price }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>₱{{ item.price * item.quantity }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="table-light">
                    <td colspan="3" class="text-end fw-bold">Total</td>
                    <td class="fw-bold">₱{{ totalAmount }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <!-- Right Column: Payment Form -->
        <div class="col-12 col-md-6">
          <div v-if="cart.length" class="card shadow-sm p-4">
            <h3 class="mb-4">Payment</h3>

            <!-- Error Message -->
            <div v-if="errorMessage" class="alert alert-danger mb-4">
              {{ errorMessage }}
            </div>

            <form @submit.prevent="processOrder">
              <!-- Basic Info -->
              <div class="mb-3">
                <label for="fullName" class="form-label">Full Name</label>
                <input type="text" id="fullName" v-model="orderDetails.fullName" class="form-control" required>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" id="email" v-model="orderDetails.email" class="form-control" required>
              </div>

              <div class="mb-3">
                <label for="phone" class="form-label">Phone Number</label>
                <input type="tel" id="phone" v-model="orderDetails.phone" class="form-control" required>
              </div>

              <!-- Payment Method -->
              <div class="mb-4">
                <label class="form-label">Payment Method</label>
                <div class="payment-options">
                  <div v-for="method in paymentMethods" :key="method.value" class="payment-option">
                    <div class="form-check">
                      <input 
                        type="radio" 
                        :id="method.value" 
                        :value="method.value" 
                        v-model="orderDetails.paymentMethod" 
                        class="form-check-input"
                        required
                      >
                      <label :for="method.value" class="form-check-label ps-2">{{ method.label }}</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-primary flex-grow-1" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Processing...' : 'Place Order' }}
                </button>
                <router-link to="/" class="btn btn-outline-secondary">Cancel</router-link>
              </div>
            </form>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      orderDetails: {
        fullName: '',
        email: '',
        phone: '',
        paymentMethod: '',
        // Adding a simple address field that gets populated in submit
        address: 'Default Pickup'
      },
      paymentMethods: [
        { label: 'Credit Card', value: 'credit-card' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'GCash', value: 'gcash' },
        { label: 'Bank Transfer', value: 'bank-transfer' },
        { label: 'Cash on Delivery', value: 'cod' }
      ],
      errorMessage: '',
      isSubmitting: false,
      orderSuccess: false
    };
  },
  computed: {
    ...mapState(['products']),
    ...mapGetters(['cartTotal', 'cart']),
    totalAmount() {
      return this.cart && this.cart.length 
        ? this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        : 0;
    }
  },
  methods: {
    ...mapActions(['submitOrder', 'fetchProducts']),
    
    validateStock() {
      // Check if all items are still in stock
      for (const cartItem of this.cart) {
        const product = this.products.find(p => p.id === cartItem.id);
        if (!product) {
          return { valid: false, message: 'A product in your cart is no longer available.' };
        }
        if (product.stock < cartItem.quantity) {
          return { 
            valid: false, 
            message: `Cannot complete order. ${product.name} has insufficient stock (only ${product.stock} available).` 
          };
        }
      }
      return { valid: true };
    },
    
    async processOrder() {
      if (!this.cart.length) {
        this.errorMessage = 'Your cart is empty. Please add items before checkout.';
        return;
      }

      this.isSubmitting = true;
      this.errorMessage = '';
      
      // First refresh the product data to ensure we have the latest stock info
      await this.fetchProducts();
      
      // Validate stock after refreshing products
      const stockCheck = this.validateStock();
      if (!stockCheck.valid) {
        this.errorMessage = stockCheck.message;
        this.isSubmitting = false;
        return;
      }

      try {
        // Format the order data precisely how the backend expects it
        const orderData = {
          full_name: this.orderDetails.fullName,
          email: this.orderDetails.email,
          phone: this.orderDetails.phone,
          address: this.orderDetails.address,
          total_amount: this.totalAmount,
          order_items: this.cart.map(item => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        };
        
        console.log('Sending order data:', orderData);
        
        const result = await this.submitOrder(orderData);
        
        if (result.success) {
          this.orderSuccess = true;
          // Automatically redirect after a successful order
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
        } else {
          this.errorMessage = result.message || 'Failed to place your order. Please try again.';
        }
      } catch (error) {
        console.error('Order submission error:', error);
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    }
  },
  mounted() {
    // Make sure products are loaded
    if (!this.products.length) {
      this.fetchProducts();
    }
  }
};
</script>

<style scoped>
.checkout {
  min-height: 80vh;
  position: relative;
  z-index: 1;
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.payment-option {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.payment-option:hover {
  background-color: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.form-check-input:checked ~ .form-check-label {
  font-weight: bold;
}

.payment-option .form-check-input:checked + .form-check-label {
  color: #0d6efd;
}

.table td {
  vertical-align: middle;
}

/* Prevent backend overlay from interfering */
.modal-backdrop {
  display: none;
}
</style>
