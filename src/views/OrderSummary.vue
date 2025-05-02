<template>
    <div class="container mt-5">
      <h2 class="mb-4">Order Summary</h2>
  
      <div v-if="cart.length > 0">
        <table class="table table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>Product</th>
              <th class="text-center">Quantity</th>
              <th class="text-end">Unit Price</th>
              <th class="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in cart" :key="index">
              <td>{{ item.name }}</td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-end">₱{{ item.price }}</td>
              <td class="text-end">₱{{ item.price * item.quantity }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" class="text-end">Total:</th>
              <th class="text-end">₱{{ totalAmount }}</th>
            </tr>
          </tfoot>
        </table>
  
        <div class="text-end mt-3">
          <button class="btn btn-success" @click="confirmCheckout">Confirm & Checkout</button>
        </div>
      </div>
      <div v-else>
        <p>Your cart is empty.</p>
        <router-link to="/" class="btn btn-outline-primary">Back to Store</router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapMutations } from 'vuex';
  
  export default {
    computed: {
      ...mapState(['cart']),
      totalAmount() {
        return this.cart.reduce((total, item) => total + item.price * item.quantity, 0);
      }
    },
    methods: {
      ...mapMutations(['CLEAR_CART']),
      confirmCheckout() {
        alert('Order placed successfully!');
        this.CLEAR_CART();
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  .table th,
  .table td {
    vertical-align: middle;
  }
  </style>
  