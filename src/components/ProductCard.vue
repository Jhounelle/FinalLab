<template>
    <div class="product-card">
      <!-- Product Image -->
      <img :src="product.image" :alt="product.name" class="product-image" />
      
      <!-- Product Details -->
      <div class="product-info">
        <h5 class="product-name">{{ product.name }}</h5>
        <p class="product-price">${{ product.price.toFixed(2) }}</p>
        
        <!-- Add to Cart Button -->
        <button 
          class="btn btn-primary" 
          @click="addToCart" 
          :disabled="isProductInCart"
        >
          {{ isProductInCart ? 'Added to Cart' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      product: {
        type: Object,
        required: true
      }
    },
    computed: {
      // Check if the product is already in the cart
      isProductInCart() {
        return this.$store.getters.cart.some(item => item.id === this.product.id);
      }
    },
    methods: {
      addToCart() {
        // Add the product to the cart in Vuex
        this.$store.commit('addToCart', this.product);
      }
    }
  };
  </script>
  
  <style scoped>
  .product-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    text-align: center;
    margin-bottom: 20px;
    background-color: #fff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 15px;
  }
  
  .product-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .product-name {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .product-price {
    font-size: 1.1rem;
    color: #333;
    margin-bottom: 10px;
  }
  
  button {
    width: 100%;
    font-size: 1rem;
    padding: 10px;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  