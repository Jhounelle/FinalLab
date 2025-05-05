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
        <div class="card h-100 shadow-sm">
            <img :src="getImageUrl(product.image)" class="card-img-top" alt="Product image" />
            <div class="card-body">
            <h5 class="card-title">{{ product.name }}</h5>
            <p class="card-text">₱{{ product.price }}</p>
            <button
              class="btn btn-black w-100 mb-1"
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

    <div class="mt-5 text-end">
      <button
        class="btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target="#cartModal"
      >
        View Cart ({{ cartItemCount }} items)
      </button>
    </div>
  </div>

  <!-- Cart Confirmation Modal -->
<div class="modal fade" id="cartModal" tabindex="-1" aria-labelledby="cartModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="cartModalLabel">Confirm Your Order</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <div v-if="cart.length">
          <table class="table table-hover align-middle">
            <thead class="table-light">
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Price</th>
                <th scope="col">Quantity</th>
                <th scope="col">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart" :key="item.id">
                <td>{{ item.name }}</td>
                <td>₱{{ item.price }}</td>
                <td>{{ item.quantity }}</td>
                <td>₱{{ item.price * item.quantity }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="table-light">
                <td colspan="3" class="text-end fw-bold">Total</td>
                <td class="fw-bold">₱{{ totalAmount }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div v-else class="text-center">
          <p class="text-muted">Your cart is empty.</p>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary" @click="proceedToCheckout" :disabled="!cart.length">
          Confirm Order
        </button>
      </div>
    </div>
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
    },

    proceedToCheckout() {
      alert('Order confirmed! Proceeding to checkout...');
      this.$router.push('/checkout'); // or whatever page you want
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
