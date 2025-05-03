<template>
  <div class="container mt-5" style="max-width: 500px">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title text-center mb-4">LOGIN</h3>
        <div class="textLabel">Enter your email and password to login:</div>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <input
              type="email"
              v-model="email"
              class="form-control"
              required
              placeholder="Email"
            />
          </div>
          <div class="mb-3">
            <input
              type="password"
              v-model="password"
              class="form-control"
              required
              placeholder="Password"
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
  background-color: #D9D9D9;
  padding: 4rem 0rem;
  border-radius: 12px;
}

.card {
  border: none;
  border-radius: 16px;
  background-color: #D9D9D9;
  box-shadow: none;
}

.card-body {
  padding: 2rem;
}

.card-title {
  font-weight: 700;
  color: #121212;
  font-size: 1.75rem;
  font-family: Poppins, 'sans-serif';
}

label {
  font-weight: 500;
  margin-bottom: 5px;
  color: #121212;
}

.textLabel {
  font-size: 0.8rem;
  color: #121212;
  text-align: center;
  margin-bottom: 30px;
}

input.form-control {
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

input.form-control:focus {
  border-color: #D9AD9A;
  box-shadow: 0 0 0 0.15rem #A26D5C;
}

.btn-primary {
  background-color: #29000A;
  border: none;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color:rgb(255, 255, 255);
  border: 1px solid #29000A;
  color: #29000A;
}

p {
  color:rgb(0, 0, 0);
  font-size: 14px;
}

a {
  color:rgb(207, 59, 0);
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
</style>
