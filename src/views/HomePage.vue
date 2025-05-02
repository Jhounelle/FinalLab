<template>
    <div class="container mt-4">
      <h2 class="mb-3">Product Catalog</h2>
  
      <!-- Search Bar -->
      <div class="mb-3">
        <input
          v-model="searchQuery"
          type="text"
          class="form-control"
          placeholder="Search for products..."
        />
      </div>
  
      <!-- Products Grid -->
      <div class="row">
        <div
          class="col-md-4 mb-4"
          v-for="product in filteredProducts"
          :key="product.id"
        >
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ product.name }}</h5>
              <p class="card-text">₱{{ product.price }}</p>
              <p class="card-text text-muted">{{ product.description }}</p>
              <button
                class="btn btn-success w-100"
                @click="handleAddToCart(product)"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Cart Summary -->
      <div class="mt-5 text-end">
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
          alert('You must register before adding items to cart.');
          this.$router.push('/register');
        }
      }
    },
    mounted() {
      // Load products if empty
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
  