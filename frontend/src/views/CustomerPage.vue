<template>
<div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"></button>
  </div>

  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="@/assets/ads1.svg" class="d-block w-100" alt="Slide 1">
    </div>
    <div class="carousel-item">
      <img src="@/assets/ads2.svg" class="d-block w-100" alt="Slide 2">
    </div>
  </div>

  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon"></span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon"></span>
  </button>
</div>


  <div class="container">
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
        <div class="card h-100 product-card shadow-sm">
          <div class="product-image-container">
            <img :src="getImageUrl(product.image)" class="card-img-top product-image" alt="Product image" />
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">₱{{ product.price }}</p>
            <div class="mt-auto">
              <button
                class="btn btn-black w-100 mb-2"
                @click="$router.push(`/product/${product.id}`)"
              >
                View Product
              </button>
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
    </div>

    <div class="mt-5 text-end">
      <button
        class="btn btn-outline-primary"
        @click="goToCart"
      >
        <i class="fa-solid fa-cart-shopping me-2"></i>View Cart ({{ cartItemCount }} items)
      </button>
    </div>
  </div>

  <!-- Toast Notification -->
  <div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="cartToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Scentora</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        {{ toastMessage }}
      </div>
    </div>
  </div>

</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { getImageUrl } from '../utils/imageHelper';

export default {
  data() {
    return {
      searchQuery: '',
      toastMessage: '',
      cartToast: null
    };
  },
  computed: {
    ...mapState(['products', 'cart']),
    ...mapGetters(['cartItemCount', 'isAuthenticated']),

    filteredProducts() {
      if (!this.searchQuery.trim()) return this.products;
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    totalAmount() {
      return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  },
  methods: {
    ...mapActions(['addToCart']),

    async handleAddToCart(product) {
      if (this.isAuthenticated) {
        try {
          // Dispatch returns a Promise
          const result = await this.addToCart(product);
          
          if (!result.success) {
            this.showToast(result.message || 'Could not add product to cart.');
          } else {
            this.showToast(`${product.name} added to your cart!`);
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          this.showToast('An error occurred adding the product to cart.');
        }
      } else {
        this.showToast('You must register before adding items to cart.');
        setTimeout(() => {
          this.$router.push('/register');
        }, 1500);
      }
    },

    showToast(message) {
      this.toastMessage = message;
      if (this.cartToast) {
        this.cartToast.show();
      }
    },

    getImageUrl,

    goToCart() {
      this.$router.push('/cart');
    }
  },
  mounted() {
    if (!this.products.length) {
      this.$store.dispatch('fetchProducts');
    }
    
    // Initialize toast
    this.cartToast = new bootstrap.Toast(document.getElementById('cartToast'));
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
  height: 100%;
}

.card:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.product-card {
  display: flex;
  flex-direction: column;
}

.product-image-container {
  height: 280px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.card-img-top.product-image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.card-title {
  font-weight: 600;
  color: #121212;
  font-size: 1.2rem;
  height: 50px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-text {
  color: #333;
  font-size: 1.2rem;
  font-weight: 500;
}

.card-body {
  text-align: center;
  padding: 1.5rem;
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
