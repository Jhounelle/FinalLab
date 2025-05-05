<template>
  <div class="product-detail">
    <div class="container py-4">
      <!-- Toast Notification -->
      <div 
        v-if="showToast" 
        class="toast-notification" 
        :class="{ 'success': toastType === 'success', 'error': toastType === 'error' }"
      >
        <div class="toast-content">
          <i v-if="toastType === 'success'" class="bi bi-check-circle-fill me-2"></i>
          <i v-else class="bi bi-exclamation-circle-fill me-2"></i>
          {{ toastMessage }}
        </div>
        <button @click="closeToast" class="toast-close">×</button>
      </div>

      <div class="d-flex flex-column flex-md-row mb-4">
        <!-- Back button -->
        <div class="mb-3">
          <button @click="$router.go(-1)" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Back
          </button>
        </div>
      </div>
      
      <div class="row mb-4" v-for="product in filteredProducts" :key="product.id">
        <!-- Image on the left -->
        <div class="col-md-6 d-flex justify-content-center align-items-start">
          <img 
            :src="getImageUrl(product.image)" 
            class="product-image img-fluid" 
            alt="Product image" 
          />
        </div>

        <!-- Product Info on the right -->
        <div class="col-md-6">
          <div class="product-info">
            <h2 class="product-title mb-2">{{ product.name }}</h2>
            <p class="product-price mb-3">₱{{ product.price }}</p>
            <p class="stock-info mb-3">
              <span :class="product.stock > 0 ? 'text-success' : 'text-danger'">
                {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
              </span>
              <small class="text-muted ms-2">({{ product.stock }} available)</small>
            </p>
            
            <div class="sizes mb-4">
              <p class="sizes-label mb-2">Sizes:</p>
              <div class="size-options d-flex gap-3"> 
                <button class="btn-custom" :class="{'active': selectedSize === '30mL'}" @click="selectedSize = '30mL'">30mL</button> 
                <button class="btn-custom" :class="{'active': selectedSize === '50mL'}" @click="selectedSize = '50mL'">50mL</button> 
                <button class="btn-custom" :class="{'active': selectedSize === '100mL'}" @click="selectedSize = '100mL'">100mL</button> 
              </div>
            </div>
            
            <div class="quantity-selector mb-4">
              <p class="quantity-label mb-2">Quantity:</p>
              <div class="d-flex align-items-center quantity-control">
                <button @click="decrementQuantity" class="btn btn-outline-secondary">-</button>
                <input 
                  type="number" 
                  v-model.number="quantity" 
                  class="form-control text-center mx-2" 
                  min="1" 
                  :max="product.stock"
                  style="max-width: 80px;"
                />
                <button @click="incrementQuantity(product.stock)" class="btn btn-outline-secondary">+</button>
              </div>
              <small v-if="errorMessage" class="text-danger d-block mt-2">{{ errorMessage }}</small>
            </div>

            <div class="description mb-4">
              <h5>Description:</h5>
              <p class="description-text">{{ product.description }}</p>
            </div>

            <div class="action mt-4">
              <button
                class="btn btn-primary w-100"
                @click="handleAddToCart(product)"
                :disabled="product.stock <= 0"
              >
                <i class="bi bi-cart-plus"></i> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { getImageUrl } from '../utils/imageHelper';

export default {
  name: 'ProductCatalog',
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      quantity: 1,
      selectedSize: '30mL',
      errorMessage: '',
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      toastTimeout: null
    };
  },
  computed: {
    ...mapState(['products']),
    ...mapGetters(['isAuthenticated']),
    
    product() {
      return this.products.find(p => p.id === parseInt(this.id));
    },
    
    filteredProducts() {
      return this.product ? [this.product] : [];
    }
  },
  methods: {
    ...mapActions(['addToCart']),
    
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    
    incrementQuantity(maxStock) {
      if (this.quantity < maxStock) {
        this.quantity++;
      }
    },
    
    showNotification(message, type = 'success') {
      // Clear any existing timeouts
      if (this.toastTimeout) {
        clearTimeout(this.toastTimeout);
      }
      
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      
      // Auto hide after 3 seconds
      this.toastTimeout = setTimeout(() => {
        this.closeToast();
      }, 3000);
    },
    
    closeToast() {
      this.showToast = false;
    },
    
    handleAddToCart(product) {
      if (!this.isAuthenticated) {
        this.showNotification('You must register before adding items to cart.', 'error');
        setTimeout(() => {
          this.$router.push('/register');
        }, 1500);
        return;
      }
      
      // Validate quantity
      if (this.quantity <= 0) {
        this.errorMessage = 'Please select a valid quantity.';
        return;
      }
      
      // Validate stock
      if (product.stock < this.quantity) {
        this.errorMessage = `Sorry, only ${product.stock} items are available.`;
        return;
      }
      
      // Create a product with updated quantity
      const productWithQuantity = {
        ...product,
        quantity: this.quantity
      };
      
      // Add to cart once with the specified quantity
      const result = this.addToCart(productWithQuantity);
      
      if (!result.success) {
        this.errorMessage = result.message;
        this.showNotification(result.message, 'error');
        return;
      }
      
      // Success message
      this.showNotification(`${this.quantity} ${product.name} added to cart.`);
      this.errorMessage = '';
    },
    
    // Use the imported utility function
    getImageUrl
  },
  mounted() {
    if (!this.products.length) {
      this.$store.dispatch('fetchProducts');
    }
    
    // Set default quantity to 1
    this.quantity = 1;
  },
  beforeUnmount() {
    // Clear any existing timeouts when component is destroyed
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }
};
</script>

<style scoped>
.product-detail {
  min-height: 100vh;
  padding-bottom: 60px;
  background-color: transparent;
  position: relative;
  z-index: 1;
}

.product-image {
  max-height: 400px;
  object-fit: contain;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.product-title {
  font-size: 32px;
  font-weight: 600;
}

.product-price {
  font-size: 24px;
  font-weight: 500;
}

.stock-info {
  font-size: 14px;
}

.btn-custom {
  background-color: #f8f9fa;      
  color: #333;                   
  border: 1px solid #ccc;       
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-custom:hover {
  background-color: #e2e6ea;      
  border-color: #bbb;
  color: #000;
}

.btn-custom.active {
  background-color: #0d6efd;
  color: white;
  border-color: #0d6efd;
}

.quantity-control {
  display: flex;
  align-items: center;
  max-width: 200px;
}

.description-text {
  line-height: 1.6;
  color: #666;
}

/* Toast notification styles */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 300px;
  max-width: 90%;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: fadeIn 0.3s, fadeOut 0.3s 2.7s;
  font-weight: 500;
}

.toast-notification.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.toast-notification.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.toast-content {
  display: flex;
  align-items: center;
}

.toast-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.toast-close:hover {
  opacity: 1;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-20px); }
}

/* Mobile responsiveness improvements */
@media (max-width: 768px) {
  .product-title {
    font-size: 26px;
  }
  
  .product-price {
    font-size: 20px;
  }
  
  .product-image {
    max-height: 300px;
  }
  
  .toast-notification {
    left: 20px;
    right: 20px;
    min-width: auto;
  }
}
</style>
