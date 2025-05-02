<template>
    <div class="cart">
      <h2>Your Cart</h2>
  
      <!-- If the cart is empty, display a message -->
      <div v-if="cartItems.length === 0">
        <p>Your cart is empty. Please add some products to your cart.</p>
        <router-link to="/store" class="btn btn-primary">Go to Store</router-link>
      </div>
  
      <!-- If the cart has items, display the cart details -->
      <div v-else>
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>${{ item.price.toFixed(2) }}</td>
              <td>
                <input type="number" v-model.number="item.quantity" min="1" @change="updateQuantity(item)" class="form-control" />
              </td>
              <td>${{ (item.price * item.quantity).toFixed(2) }}</td>
              <td>
                <button class="btn btn-danger" @click="removeFromCart(item.id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
  
        <div class="cart-summary">
          <p><strong>Total Price:</strong> ${{ totalPrice.toFixed(2) }}</p>
          <button class="btn btn-success" @click="proceedToCheckout" :disabled="!cartItems.length">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    computed: {
      cartItems() {
        return this.$store.getters.cart; // Retrieve cart items from Vuex store
      },
      totalPrice() {
        return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      }
    },
    methods: {
      updateQuantity(item) {
        // Update the quantity in the Vuex store
        this.$store.commit('updateItemQuantity', item);
      },
      removeFromCart(productId) {
        // Remove the item from the cart in Vuex store
        this.$store.commit('removeFromCart', productId);
      },
      proceedToCheckout() {
        // Redirect to the checkout page
        this.$router.push('/checkout');
      }
    }
  };
  </script>
  
  <style scoped>
  .cart {
    margin: 20px;
  }
  
  .cart-summary {
    margin-top: 20px;
  }
  
  .table th, .table td {
    text-align: center;
  }
  
  button {
    margin-top: 10px;
  }
  </style>
  