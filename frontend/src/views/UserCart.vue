<template>
  <div class="cart container py-4">
    <h2 class="mb-4">Your Cart</h2>

    <div v-if="cartItems.length === 0" class="empty-cart text-center py-5">
      <i class="bi bi-cart-x fs-1 text-muted mb-3"></i>
      <p>Your cart is empty. Please add some products to your cart.</p>
      <router-link to="/" class="btn btn-primary">Go to Store</router-link>
    </div>

    <div v-else>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>Product</th>
              <th class="text-center">Price</th>
              <th class="text-center">Quantity</th>
              <th class="text-center">Total</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td class="text-center">₱{{ formatPrice(item.price) }}</td>
              <td class="text-center" style="width: 120px;">
                <input type="number" v-model.number="item.quantity" min="1" @change="updateQuantity(item)" class="form-control form-control-sm text-center mx-auto" style="max-width: 80px;" />
              </td>
              <td class="text-center">₱{{ formatPrice(item.price * item.quantity) }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-danger" @click="removeFromCart(item.id)">
                  <i class="bi bi-trash"></i> Remove
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="cart-summary card mt-4 p-3">
        <div class="d-flex justify-content-between align-items-center">
          <p class="mb-0"><strong>Total Price:</strong></p>
          <p class="mb-0 fs-5">₱{{ formatPrice(totalPrice) }}</p>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button class="btn btn-success" @click="proceedToCheckout" :disabled="!cartItems.length">
            Proceed to Checkout <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    cartItems() {
      return this.$store.getters.cart;
    },
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
      }, 0);
    }
  },
  methods: {
    formatPrice(value) {
      const price = parseFloat(value);
      return isNaN(price) ? '0.00' : price.toFixed(2);
    },
    updateQuantity(item) {
      this.$store.commit('UPDATE_CART_ITEM_QUANTITY', { id: item.id, quantity: item.quantity });
    },
    removeFromCart(productId) {
      this.$store.commit('REMOVE_FROM_CART', productId);
    },
    proceedToCheckout() {
      this.$router.push('/checkout');
    }
  }
};
</script>

<style scoped>
.cart {
  margin-bottom: 40px;
}

.table th, .table td {
  vertical-align: middle;
}

.cart-summary {
  background-color: #f8f9fa;
  border-radius: 8px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
}
</style>
