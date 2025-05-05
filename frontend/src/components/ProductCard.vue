<template>
  <div class="product-card">
    <div class="product-image-container">
      <img :src="getImageUrl(product.image)" :alt="product.name" class="product-image" />
    </div>
    <div class="product-info">
      <h5 class="product-name">{{ product.name }}</h5>
      <p class="product-price">₱{{ formatPrice(product.price) }}</p>
      
      <div class="button-container">
        <button 
          class="btn btn-outline-secondary w-100 mb-2"
          @click="viewProduct"
        >
          View Product
        </button>
        <button 
          class="btn btn-primary w-100" 
          @click="addToCart" 
          :disabled="isProductInCart"
        >
          {{ isProductInCart ? 'Added to Cart' : 'Add to Cart' }}
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
  </div>
</template>

<script>
import { getImageUrl } from '../utils/imageHelper';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      toastMessage: '',
      cartToast: null
    };
  },
  computed: {
    isProductInCart() {
      return this.$store.getters.cart.some(item => item.id === this.product.id);
    }
  },
  methods: {
    async addToCart() {
      // Check if user is authenticated first
      if (!this.$store.getters.isAuthenticated) {
        this.showToast('Please login first to add items to your cart.');
        this.$router.push('/login');
        return;
      }
      
      try {
        // Dispatch returns a Promise
        const result = await this.$store.dispatch('addToCart', this.product);
        
        // Only show error message if operation failed
        if (result && !result.success) {
          this.showToast(result.message || 'Could not add product to cart.');
        } else if (result && result.success) {
          this.showToast(`${this.product.name} added to your cart!`);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.showToast('An error occurred adding the product to cart.');
      }
    },
    viewProduct() {
      this.$router.push(`/product/${this.product.id}`);
    },
    showToast(message) {
      this.toastMessage = message;
      if (this.cartToast) {
        this.cartToast.show();
      }
    },
    getImageUrl,
    formatPrice(value) {
      const price = parseFloat(value);
      return isNaN(price) ? '0.00' : price.toFixed(2);
    }
  },
  mounted() {
    this.cartToast = new bootstrap.Toast(document.getElementById('cartToast'));
  }
};
</script>

<style scoped>
.product-card {
  background-color: #ffffff;
  color: #333;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  height: 280px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;
}

.product-image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  flex-grow: 1;
}

.product-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 10px 0;
  color: #121212;
  height: 50px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-price {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
}

.button-container {
  width: 100%;
  margin-top: auto;
}

button {
  font-size: 1rem;
  padding: 10px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #000;
  border-color: #000;
}

.btn-primary:hover {
  background-color: #333;
  border-color: #333;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}
</style>
