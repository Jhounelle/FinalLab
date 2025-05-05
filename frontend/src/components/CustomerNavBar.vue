<template>
  <div>
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
      <div class="container-fluid">

        <router-link class="navbar-brand d-none d-lg-block" to="/">
          <img src="@/assets/logo.png" alt="Scentora Logo" />
        </router-link>

        <div class="navbar-logo-wrapper mx-auto d-lg-none">
          <router-link class="navbar-brand m-0" to="/customer">
            <img src="@/assets/logo.png" alt="Scentora Logo" />
          </router-link>
        </div>

        <!-- <button
          class="navbar-toggler"
          type="button" 
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasLeftCart"
          aria-controls="offcanvasLeftCart"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button> -->

        <!-- Mobile-only buttons -->
        <div class="d-lg-none d-flex align-items-center ms-auto">
          <!-- Cart button for mobile -->
          <router-link class="nav-link text-white me-3 position-relative" to="/cart">
            <i class="fa-solid fa-cart-shopping fs-5"></i>
            <span v-if="cartItemCount > 0" class="cart-badge position-absolute">{{ cartItemCount }}</span>
          </router-link>

          <router-link v-if="!isAuthenticated" class="nav-link text-white me-2" to="/login">
            <i class="bi bi-person fs-5"></i>
          </router-link>

          <button v-if="isAuthenticated" class="nav-link btn btn-link text-white" @click="logout">
            Logout
          </button>
        </div>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <!-- Cart button for desktop -->
            <li class="nav-item">
              <router-link class="nav-link position-relative" to="/cart">
                <i class="fa-solid fa-cart-shopping fs-5"></i>
                <span v-if="cartItemCount > 0" class="cart-badge position-absolute">{{ cartItemCount }}</span>
              </router-link>
            </li>

            <li v-if="!isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="bi bi-person fs-5"></i>
              </router-link>
            </li>

            <li v-if="isAdmin" class="nav-item">
              <router-link class="nav-link" to="/admin-panel">Admin Panel</router-link>
            </li>

            <li v-if="isAuthenticated" class="nav-item">
              <button class="nav-link btn btn-link" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- OFFCANVAS LEFTCART -->
    <div
      class="offcanvas offcanvas-start"
      tabindex="-1"
      id="offcanvasLeftCart"
      aria-labelledby="offcanvasLeftCartLabel"
    >
      <div class="offcanvas-header">
        <h5 id="offcanvasLeftCartLabel">Cart</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <MobileSidebar />
      </div>
    </div>
  </div>
</template>

<script>
import MobileSidebar from './MobileSidebar.vue';

export default {
  name: 'MainNavbar',
  components: {
    MobileSidebar,
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.isAuthenticated && this.$store.state.userRole === 'admin';
    },
    cartItemCount() {
      return this.$store.getters.cartItemCount || 0;
    }
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

/* Cart badge styling */
.cart-badge {
  background-color: #ff0000;
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 50%;
  top: -5px;
  right: -5px;
}

/* Adjust the logout button in mobile view */
.d-lg-none .nav-link.btn-link {
  color: white;
  font-weight: 400;
  padding: 0;
  font-size: 16px;
}

</style>
