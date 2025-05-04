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

        <button
          class="navbar-toggler"
          type="button" 
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasLeftCart"
          aria-controls="offcanvasLeftCart"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>


        <!-- Mobile-only avatar and cart -->
        <div class="d-lg-none d-flex align-items-center ms-auto">
          <router-link v-if="!isAuthenticated" class="nav-link text-white me-2" to="/login">
            <i class="fa-regular fa-user"></i>
          </router-link>

          <a
            class="nav-link text-white position-relative"
            data-bs-toggle="offcanvas"
            href="#offcanvasCart"
            role="button"
            aria-controls="offcanvasCart"
          >
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="cart-badge badge bg-primary position-absolute">
              {{ cartItemCount }}
            </span>
          </a>
        </div>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li v-if="!isAuthenticated" class="nav-item">
              <router-link class="nav-link" to="/login">
                <i class="fa-regular fa-user"></i>
              </router-link>
            </li>

            <li class="nav-item position-relative">
              <a
                class="nav-link"
                data-bs-toggle="offcanvas"
                href="#offcanvasCart"
                role="button"
                aria-controls="offcanvasCart"
              >
                <div class="cart-icon-wrapper position-relative d-inline-block">
                  <i class="fa-solid fa-cart-shopping"></i>
                  <span class="cart-badge badge bg-primary position-absolute">
                    {{ cartItemCount }}
                  </span>
                </div>
              </a>
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

    <!-- OFFCANVAS CART -->
    <div
      class="offcanvas offcanvas-end"
      tabindex="-1"
      id="offcanvasCart"
      aria-labelledby="offcanvasCartLabel"
    >
      <div class="offcanvas-header">
        <h5 id="offcanvasCartLabel">Cart</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <CartForm />
      </div>
    </div>

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
import CartForm from './CartForm.vue';
import MobileSidebar from './MobileSidebar.vue';

export default {
  name: 'MainNavbar',
  components: {
    CartForm,
    MobileSidebar,
  },
  computed: {
    cartItemCount() {
      return this.$store.getters.cartItemCount;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    isAdmin() {
      return this.isAuthenticated && this.$store.state.user?.role === 'admin';
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
  top: -8px;
  right: -10px;
  border-radius: 50%;
  padding: 4px 6px;
  font-size: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
