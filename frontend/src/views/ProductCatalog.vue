<template>
  <div class="container">
    <div class="d-flex flex-column flex-md-row mb-4 pt-3">
      <!-- First Column for Product 1 -->
      <div class="bg-light p-3 flex-fill">
        <div class="row mb-4" v-for="product in filteredProducts" :key="product.id">
          <!-- Image on the left -->
          <div class="col-md-6 d-flex justify-content-center">
            <img 
              :src="getImageUrl(product.image)" 
              class="card-img-left img-fluid" 
              alt="Product image" 
            />
          </div>

          <!-- Product Info on the right -->
          <div class="col-md-6">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text">₱{{ product.price }}</p>
                <p class="card-text pt-0 pb-4">Stocks:  {{ product.stock }}</p>
                <p class="text">Sizes:</p>
                <div class="d-flex gap-3 pb-4"> 
                  <button class="btn-custom">30mL</button> 
                  <button class="btn-custom">50mL</button> 
                  <button class="btn-custom">100mL</button> 
                </div>
                <div class="align-items-center pb-5">
                    <!-- Number Input -->
                    <p class="text">QTY:</p>
                    <input type="number" v-model="quantity" class="form-control" placeholder="1" style="width: ;"/>
                </div>

                <p class="card-text text-muted">Description: {{ product.description }}</p>
              </div>
                <button
                class="btn btn-black w-100 bottom-fixed"
                @click="handleAddToCart(product)"
                >
                Add to Cart
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

export default {
  name: 'ProductCatalog',
  props: ['id'],
  data() {
    return {
      searchQuery: ''
    };
  },
  computed: {
    ...mapState(['products']),
    ...mapGetters(['cartItemCount', 'isAuthenticated']),
    filteredProducts() {
      if (this.id) {
        return this.products.filter(p => p.id === parseInt(this.id)); // Show one product only
      }

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

<style>
.container {
  width: 100%;
  height: 100%;
  background-color: white;
}

.d-flex{
    paadding-top: 1rem;
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

.card-title{
    font-size: 38px;
}

.card {
  border: none;
}

.btn-custom {
  background-color: #f8f9fa;      
  color: #333;                   
  border: 1px solid #ccc;       
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-custom:hover {
  background-color: #e2e6ea;      
  border-color: #bbb;
  color: #000;
}

</style>
