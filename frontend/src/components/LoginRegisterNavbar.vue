<template>
  <div>
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
      <div class="container-fluid">

        <router-link class="navbar-brand d-none d-lg-block" to="/">
          <img src="@/assets/logo.png" alt="Scentora Logo" />
        </router-link>

        <div class="navbar-logo-wrapper mx-auto d-lg-none">
          <router-link class="navbar-brand m-0" to="/">
            <img src="@/assets/logo.png" alt="Scentora Logo" />
          </router-link>
        </div>

        <ul class="navbar-nav ms-auto">
          <!-- If the user is NOT authenticated, show login link -->
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/login">
              <i class="fa-regular fa-user"></i>
            </router-link>
          </li>

          <!-- Show Admin Panel only for Employees -->
          <li v-if="isAdmin" class="nav-item">
            <router-link class="nav-link" to="/admin-panel">Admin Panel</router-link>
          </li>

          <!-- Show Cart for Everyone -->
          <li class="nav-item position-relative">
            <router-link class="nav-link" to="/cart">
              <i class="fa-solid fa-cart-shopping fs-5"></i>
              <span v-if="cartItemCount > 0" class="cart-badge position-absolute">
                {{ cartItemCount }}
              </span>
            </router-link>
          </li>

          <!-- If authenticated, show logout button -->
          <li v-if="isAuthenticated" class="nav-item">
            <button class="nav-link btn btn-link" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'MainNavbar',
  components: {
    
  },
  computed: {
    cartItemCount() {
      return this.$store.getters.cartItemCount;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.isAuthenticated && this.$store.getters.isAdmin;
    },
  },
  methods: {
    logout() {
      this.$store.commit('SET_AUTH', false);
      this.$store.commit('CLEAR_CART');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.navbar {
  height: 80px;
  align-items: center;
  position: fixed; 
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); 
}

.custom-navbar {
  background-color: #29000a;
}

.navbar-brand img {
  display: block;
  max-height: 80px;
}

.navbar-nav .nav-link {
  font-weight: 300;
  color: #ffffff;
  font-family: 'Poppins', sans-serif;
}

.navbar-toggler-icon {
  background-color: #ffffff;
}

.navbar-logo-wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.cart-icon-wrapper {
  font-size: 16px;
}

.cart-badge {
  background-color: #ff0000;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  top: -5px;
  right: -5px;
}

</style>
