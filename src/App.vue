<template>
  <div id="app">
    <MainNavbar />
    <div class="content">
      <router-view />
    </div>
    <FooterComponent />
  </div>
</template>

<script>
import MainNavbar from './components/MainNavbar.vue';
import FooterComponent from './components/FooterComponent.vue';

export default {
  name: 'App',
  components: {
    MainNavbar,
    FooterComponent
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
