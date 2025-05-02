<template>
  <div class="container mt-4">
    <h2 class="mb-3">Scentora Perfume Collection</h2>

    <div class="mb-3">
      <input
        v-model="searchQuery"
        type="text"
        class="form-control"
        placeholder="Search for products..."
      />
    </div>

    <div class="row">
      <div
        class="col-md-4 mb-4"
        v-for="product in filteredProducts"
        :key="product.id"
      >
        <div class="card h-100 shadow-sm">
            <img :src="getImageUrl(product.image)" class="card-img-top" alt="Product image" />
            <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">₱{{ product.price }}</p>
            <p class="card-text text-muted">{{ product.description }}</p>
            <button
              class="btn btn-black w-100"
              @click="handleAddToCart(product)"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>

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
      searchQuery: '', 
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
    },

    getImageUrl(filename) {
      return require(`@/assets/${filename}`);
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
.container {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 10px;
}

h2 {
  color: #121212;
  font-weight: 700;
}

.card {
  border: none;
  border-radius: 12px;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  max-height: 750px;
  object-fit: cover;
}

.card-title {
  font-weight: 600;
  color: #121212;
  font-size: 1.2rem;
}

.card-text {
  color: #333;
  font-size: 0.95rem;
}

.card-text.text-muted {
  color: #777;
  font-size: 0.85rem;
}

.card-body {
  text-align: center;
}

.mt-5 {
  margin-top: 3rem !important;
}

.btn-black {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.btn-black:hover {
  background-color: #1a1a1a;
  color: #fff;
}

input.form-control {
  border-radius: 6px;
  padding: 10px;
  border: 1px solid #ccc;
}

.btn-outline-primary {
  border-color: #000;
  color: #000;
  font-weight: 600;
}

.btn-outline-primary:hover {
  background-color: #000;
  color: #fff;
}
</style>
