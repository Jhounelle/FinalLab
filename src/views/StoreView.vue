<template>
  <div class="container mt-5">
    <h2 class="mb-4">Welcome to the Store</h2>

    <!-- Search bar -->
    <div class="input-group mb-4">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="Search for products..."
      />
    </div>

    <!-- Product list -->
    <div class="row">
      <div
        class="col-md-4 mb-4"
        v-for="product in filteredProducts"
        :key="product.id"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">₱{{ product.price }}</p>
            <p class="text-muted">{{ product.description }}</p>
            <button
              class="btn btn-success mt-auto"
              @click="handleAddToCart(product)"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Cart button -->
    <div class="mt-4 text-end">
      <router-link to="/cart" class="btn btn-outline-primary">
        View Cart ({{ cartItemCount }} items)
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      searchQuery: ''
    };
  },
  computed: {
    ...mapState(['products']),
    ...mapGetters(['cartItemCount', 'isAuthenticated']),
    filteredProducts() {
      if (!this.searchQuery.trim()) return this.products;
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  },
  methods: {
    ...mapActions(['addToCart']),
    handleAddToCart(product) {
      if (this.isAuthenticated) {
        this.addToCart(product);
      } else {
        alert('You must be registered and logged in to add items to cart.');
        this.$router.push('/register');
      }
    }
  },
  mounted() {
    if (!this.products.length) {
      this.$store.dispatch('fetchProducts');
    }
  }
};
</script>

<style scoped>
.card-title {
  font-weight: bold;
}
</style>
