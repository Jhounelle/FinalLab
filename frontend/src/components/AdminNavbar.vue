<template>
    <div>
      <!-- NAVBAR -->
      <nav class="navbar navbar-expand-lg custom-navbar fixed-top">
        <div class="container-fluid">
          <div class="navbar-brand d-none d-lg-block">
            <img src="@/assets/logo.png" alt="Scentora Logo" />
          </div>
        </div>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
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


</script>

<style scoped>
.navbar {
  height: 50px;
  align-items: center;
  position: fixed; 
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); 
}

.custom-navbar {
  background-color:rgb(243, 222, 227);
}

.navbar-brand img {
  display: block;
  max-height: 50px;
}
</style>
