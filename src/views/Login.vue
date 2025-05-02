<template>
    <div class="container mt-5" style="max-width: 500px">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title text-center mb-4">Login</h3>
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label>Email</label>
              <input
                type="email"
                v-model="email"
                class="form-control"
                required
                placeholder="Enter your email"
              />
            </div>
            <div class="mb-3">
              <label>Password</label>
              <input
                type="password"
                v-model="password"
                class="form-control"
                required
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Login</button>
          </form>
          <p class="mt-3 text-center">
            Don't have an account?
            <router-link to="/register">Register here</router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapMutations } from 'vuex';
  
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      ...mapMutations(['SET_AUTH']),
      handleLogin() {
        // For demonstration, we allow any login
        if (this.email && this.password) {
          // Normally you'd verify against an API or user store
          this.SET_AUTH(true);
          alert('Login successful!');
          this.$router.push('/');
        } else {
          alert('Invalid credentials.');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .card {
    border-radius: 12px;
  }
  </style>
  