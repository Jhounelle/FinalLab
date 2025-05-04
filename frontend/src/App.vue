<template>
  <div id="app">
    <component :is="currentNavbar" />
    <div class="content">
      <router-view />
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import AdminNavbar from './components/AdminNavbar.vue';
import CustomerNavBar from './components/CustomerNavBar.vue';
import CheckoutNavbar from './components/CheckoutNavbar.vue'; 
import LoginRegisterNavbar from './components/LoginRegisterNavbar.vue'; 
import FooterComponent from './components/FooterComponent.vue';

export default {
  name: 'App',
  components: {
    AdminNavbar,
    CustomerNavBar,
    CheckoutNavbar,
    LoginRegisterNavbar,
    FooterComponent,
  },
  computed: {
    currentNavbar() {
      const path = this.$route.path;

      if (path === '/' || path === '/register') {
        return 'LoginRegisterNavbar';
      } else if (path === '/admin/product' || path ==='/admin/transaction') {
        return 'AdminNavbar';
      } else {
        return 'CustomerNavBar';
      }
    }
  }
};
</script>


<style>
html, body, #app {
  height: 100%;
  margin: 0;
}

#app {
  padding-top: 40px;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1; /* This pushes the footer to the bottom */
}

.body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
}
</style>
