<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Scentora</router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
         
          <li class="nav-item">
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" to="/product">Products</router-link>
          </li>
          
          <li class="nav-item">
            <router-link class="nav-link" to="/cart">
              Cart <span class="badge bg-primary">{{ cartItemCount }}</span>
            </router-link>
          </li>

          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin-panel">Admin Panel</router-link>
          </li>

          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
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
      this.$store.commit('SET_AUTH', false); 
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
