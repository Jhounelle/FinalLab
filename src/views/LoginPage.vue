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
      if (this.email && this.password) {
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
.container {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 12px;
}

.card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
}

.card-body {
  padding: 2rem;
}

.card-title {
  font-weight: 700;
  color: #121212;
  font-size: 1.75rem;
}

label {
  font-weight: 500;
  margin-bottom: 5px;
  color: #121212;
}

input.form-control {
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

input.form-control:focus {
  border-color: #1db954;
  box-shadow: 0 0 0 0.15rem rgba(30, 215, 96, 0.25);
}

.btn-primary {
  background-color: #000;
  border: none;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #1a1a1a;
}

p {
  color: #333;
}

a {
  color: #1db954;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
</style>
