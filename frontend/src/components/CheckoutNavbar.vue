<template>
  <div>
    <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
      <div class="container-fluid position-relative">
        <!-- CENTERED LOGO -->
        <div class="navbar-brand mx-auto position-absolute top-50 start-50 translate-middle">
          <img src="@/assets/scentora2.png" alt="Scentora Logo" />
        </div>
        <!-- RIGHT SIDE ICON -->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item position-relative">
            <router-link class="nav-link" to="/cart">
              <i class="fa-solid fa-cart-shopping fs-5"></i>
              <span v-if="cartItemCount > 0" class="cart-badge position-absolute">
                {{ cartItemCount }}
              </span>
            </router-link>
          </li>
          <li v-if="!isAuthenticated" class="nav-item">
            <router-link class="nav-link" to="/">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    cartItemCount() {
      return this.$store.getters.cartItemCount || 0;
    }
  }
};
</script>

<style scoped>
.navbar {
  height: 60px;
  align-items: center;
  position: fixed; 
  top: 0;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); 
}

.custom-navbar {
  background-color: #D9AD9A;
}

.navbar-brand img {
  display: block;
  max-height: 100px;
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
</style>
