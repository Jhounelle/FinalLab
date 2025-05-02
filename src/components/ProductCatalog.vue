<template>
    <div class="product-catalog">
      <h2 class="catalog-title">Our Products</h2>
      
      <!-- Search Bar -->
      <div class="search-bar mb-3">
        <input 
          type="text" 
          class="form-control" 
          v-model="searchQuery" 
          placeholder="Search products..." 
        />
      </div>
  
      <!-- Products Grid -->
      <div class="row">
        <product-card 
          v-for="product in filteredProducts" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </template>
  
  <script>
  import ProductCard from '@/components/ProductCard.vue';
  
  export default {
    components: {
      ProductCard
    },
    data() {
      return {
        // Array of products (this could come from an API or Vuex store)
        products: [
          { id: 1, name: 'Product 1', price: 29.99, image: 'product1.jpg' },
          { id: 2, name: 'Product 2', price: 49.99, image: 'product2.jpg' },
          { id: 3, name: 'Product 3', price: 19.99, image: 'product3.jpg' },
          { id: 4, name: 'Product 4', price: 39.99, image: 'product4.jpg' }
        ],
        searchQuery: ''
      };
    },
    computed: {
      // Filter products based on the search query
      filteredProducts() {
        if (!this.searchQuery) {
          return this.products;
        }
        return this.products.filter(product => 
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    }
  };
  </script>
  
  <style scoped>
  .product-catalog {
    padding: 20px;
  }
  
  .catalog-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .search-bar {
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
  }
  
  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  </style>
  