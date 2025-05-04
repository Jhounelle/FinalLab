<template>
  <div>
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
      <div class="container-fluid">

        <router-link class="navbar-brand d-none d-lg-block" to="/admin/product">
          <img src="@/assets/logo.png" alt="Scentora Logo" />
        </router-link>

        <div class="navbar-logo-wrapper mx-auto d-lg-none">
          <router-link class="navbar-brand m-0" to="/admin/product">
            <img src="@/assets/logo.png" alt="Scentora Logo" />
          </router-link>
        </div>

        <button
          class="navbar-toggler"
          type="button" 
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav" >
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/product" active-class="active-link">Products</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/admin/transaction" active-class="active-link">Transactions</router-link>
            </li>
            <li class="nav-item">
              <button class="nav-link btn btn-link" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'MainNavbar',
  computed: {
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
      this.$store.commit('CLEAR_CART'); // Optional: remove if cart store is deleted too
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

/* Make the mobile menu background white when expanded */
@media (max-width: 991.98px) {
  .navbar-collapse {
    background-color: #ffffff;
    padding: 1rem;
    border-radius: 0 0 12px 12px;
  }

  .navbar-nav .nav-link {
    color: #29000a; /* Dark text for visibility on white bg */
  }

  .btn-link.nav-link {
    color: #29000a;
  }
}

</style>
