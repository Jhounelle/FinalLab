<template>
  <div class="product-card">
    <img :src="product.image" :alt="product.name" class="product-image" />
    <div class="product-info">
      <h5 class="product-name">{{ product.name }}</h5>
      <p class="product-price">${{ product.price.toFixed(2) }}</p>
      
      
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
    isProductInCart() {
      return this.$store.getters.cart.some(item => item.id === this.product.id);
    }
  },
  methods: {
    addToCart() {
      this.$store.commit('addToCart', this.product);
    }
  }
};
</script>

<style scoped>
.product-card {
  background-color: #121212;
  color: #fff;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.product-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 3px solid #1db954;
}

.product-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-name {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 10px 0;
  color: #fff;
}

.product-price {
  font-size: 1.2rem;
  color: #b3b3b3;
  margin-bottom: 15px;
}

button {
  width: 100%;
  font-size: 1.1rem;
  padding: 12px;
  background-color: #1db954;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1ed760;
}

button:disabled {
  background-color: #4f4f4f;
  cursor: not-allowed;
}
</style>
