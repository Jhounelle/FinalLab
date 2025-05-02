<template>
    <div class="checkout">
      <h2>Checkout</h2>
  
      <!-- If the cart is empty, show a message -->
      <div v-if="cart.length === 0">
        <p>Your cart is empty. Please add some items to proceed.</p>
        <router-link to="/store" class="btn btn-primary">Go to Store</router-link>
      </div>
  
      <!-- If the cart is not empty, show the checkout details -->
      <div v-else>
        <h3>Order Summary</h3>
        <div class="cart-items">
          <div class="cart-item" v-for="item in cart" :key="item.id">
            <p>{{ item.name }} - ${{ item.price }}</p>
          </div>
        </div>
  
        <div class="total">
          <p>Total: ${{ totalPrice }}</p>
        </div>
  
        <form @submit.prevent="submitOrder">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="name" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="address">Shipping Address</label>
            <textarea id="address" v-model="address" class="form-control" required></textarea>
          </div>
          <div class="form-group">
            <label for="payment">Payment Method</label>
            <select id="payment" v-model="paymentMethod" class="form-control" required>
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>
  
          <button type="submit" class="btn btn-success">Place Order</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        address: '',
        paymentMethod: 'credit-card'
      };
    },
    computed: {
      cart() {
        return this.$store.getters.cart;
      },
      totalPrice() {
        return this.cart.reduce((total, item) => total + item.price, 0).toFixed(2);
      }
    },
    methods: {
      submitOrder() {
        // Handle the order submission (e.g., send it to an API or mock backend)
        alert('Order placed successfully!');
  
        // Clear the cart after order is placed
        this.$store.commit('clearCart');
  
        // Redirect to the homepage
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  .checkout {
    margin: 20px;
  }
  
  .cart-items {
    margin-bottom: 20px;
  }
  
  .cart-item {
    margin-bottom: 10px;
  }
  
  .total {
    font-weight: bold;
    margin-top: 20px;
  }
  
  form {
    margin-top: 20px;
  }
  </style>
  