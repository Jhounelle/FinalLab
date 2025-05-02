<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">My Shop</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <!-- Home Link -->
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          
          <!-- Store Link -->
          <li class="nav-item">
            <router-link class="nav-link" to="/store">Store</router-link>
          </li>
          
          <!-- Cart Link -->
          <li class="nav-item">
            <router-link class="nav-link" to="/cart">
              Cart <span class="badge bg-primary">{{ cartItemCount }}</span>
            </router-link>
          </li>

          <!-- Admin Panel Link (Conditional on Admin Status) -->
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin-panel">Admin Panel</router-link>
          </li>

          <!-- Authentication Links -->
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/signup">Sign Up</router-link>
          </li>
          <li v-if="isAuthenticated" class="nav-item">
            <button class="nav-link btn btn-link" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    // Correct getter usage
    cartItemCount() {
      return this.$store.getters.cartItemCount;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.isAuthenticated && this.$store.state.user?.role === 'admin';
    }
  },
  methods: {
    logout() {
      this.$store.commit('SET_AUTH', false); // Match your store mutation
      this.$store.commit('CLEAR_CART');
      this.$router.push('/');
    }
  }
};
</script>


<style scoped>
.navbar {
  margin-bottom: 20px;
}

.navbar-nav .nav-link {
  font-weight: 600;
}

.navbar-toggler-icon {
  background-color: #333;
}
</style>
