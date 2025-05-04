<template>
  <div class="checkout container-fluid">
    <div class="row w-100 m-0">

      <!-- Left Column: Checkout Summary -->
      <div class="col-12 col-md-6">
        <div v-if="cart.length === 0">
          <p>Your cart is empty. Please add some items to proceed.</p>
          <router-link to="/store" class="btn btn-primary">Go to Store</router-link>
        </div>

        <div v-else>
          <h3 class="pb-3">Order Summary</h3>
          <div class="cart-items mb-3">
            <div class="cart-item" v-for="item in cart" :key="item.id">
              <p>{{ item.name }} - ${{ item.price }}</p>
            </div>
          </div>
          <div class="total">
            <p><strong>Total:</strong> ${{ totalPrice }}</p>
          </div>
        </div>
      </div>

      <!-- Right Column: Form -->
      <div class="col-12 col-md-6">
        <form @submit.prevent="submitOrder">
          <h3  class="pb-3">Delivery</h3>

          <div class="form-group mb-3">
            <input type="text" id="country" v-model="country" class="form-control" placeholder="Country" required>
          </div>

          <div class="form-group mb-3 d-flex gap-2">
            <input type="text" id="fname" v-model="fname" class="form-control" placeholder="First Name" required>
            <input type="text" id="lname" v-model="lname" class="form-control" placeholder="Last Name" required>
          </div>

          <div class="form-group mb-3">
            <input type="text" id="address" v-model="address" class="form-control" placeholder="Address" required>
          </div>

          <div class="form-group mb-3 d-flex gap-2">
            <input type="text" id="postal" v-model="postal" class="form-control" placeholder="Postal Code" required>
            <input type="text" id="city" v-model="city" class="form-control" placeholder="City" required>
          </div>

          <div class="form-group mb-3">
            <input type="text" id="region" v-model="region" class="form-control" placeholder="Region" required>
          </div>

          <div class="form-group mb-3">
            <input type="text" id="region" v-model="region" class="form-control" placeholder="Region" required>
          </div>

          <div class="form-group mb-3">
            <input type="text" id="region" v-model="region" class="form-control" placeholder="Region" required>
          </div>

          <div class="form-group mb-3">
            <input type="text" id="contact" v-model="contact" class="form-control" placeholder="Contact No." required>
          </div>

          <div class="form-group mb-3">
            <label class="mb-1" for="payment">Payment Method</label>
            <select id="payment" v-model="paymentMethod" class="form-control" required>
              <option value="" disabled selected hidden>Choose a payment method...</option>
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="gcash">GCash</option>
              <option value="bank-transfer">Bank Transfer</option>
            </select>
          </div>

          <button type="submit" class="btn btn-success">Place Order</button>
        </form>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cart: [
        { id: 1, name: 'Sample Item', price: 29.99 },
        { id: 2, name: 'Another Item', price: 49.99 }
      ],
      name: '',
      address: '',
      paymentMethod: '',
    };
  },
  computed: {
    totalPrice() {
      return this.cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
    }
  },
  methods: {
    submitOrder() {
      alert(`Order placed for ${this.name}!\nTotal: $${this.totalPrice}`);
      // Reset cart and form fields (optional)
      this.cart = [];
      this.name = '';
      this.address = '';
      this.paymentMethod = '';
    }
  }
};
</script>

<style scoped>
* {
  font-family: 'Poppins', sans-serif;
}

  .checkout {
    width: 80%;
    padding-top: 30px;
    padding-bottom: 90px;
    border: 2px solid black;
  }

  .row {
    margin: 0;
    width: 100%;
  }

  .cart-items {
    margin-bottom: 20px;
  }

  .cart-item {
    margin-bottom: 10px;
  }

  .total {
    font-weight: bold;
    margin-top: 25px;
  }


</style>
