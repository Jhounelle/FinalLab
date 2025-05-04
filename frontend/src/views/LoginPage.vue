<template>
  <div class="login-container d-flex justify-content-center align-items-center">
    <div class="login-card card shadow">
      <div class="card-header d-flex justify-content-around">
        <button
          class="tab-button"
          :class="{ active: role === 'customer' }"
          @click="role = 'customer'"
        >
          Customer
        </button>
        <button
          class="tab-button"
          :class="{ active: role === 'admin' }"
          @click="role = 'admin'"
        >
          Admin
        </button>
      </div>
      <div class="card-body">
        <h4 class="text-center mb-4">{{ role.toUpperCase() }} LOGIN</h4>

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

        <p v-if="role === 'customer'" class="mt-3 text-center">
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
      password: '',
      role: 'customer' // Default tab
    };
  },
  methods: {
    ...mapMutations(['SET_AUTH']),
    handleLogin() {
      if (this.email && this.password) {
        this.SET_AUTH(true);
        this.$store.commit('SET_ROLE', this.role);

        alert(`${this.role.toUpperCase()} login successful!`);

        if (this.role === 'admin') {
          this.$router.push('/admin/product'); // ✅ go to admin product page
        } else {
          this.$router.push('/customer'); // ✅ go to customer page
        }
      } else {
        alert('Invalid credentials.');
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  background-color: #d9d9d9;
  border-radius: 12px;
  padding-top: 8%; /* Pushes it downward */
}

.login-card {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  
}

.card-header {
  background-color: #29000a;
  padding: 0;
}

.tab-button {
  width: 50%;
  padding: 1rem;
  border: none;
  background-color: #29000a;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab-button.active {
  background-color: #a26d5c;
}

.tab-button:not(.active):hover {
  background-color: #47201d;
}

.card-body {
  background-color: #ffffff;
  padding: 2rem;
}

input.form-control {
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

input.form-control:focus {
  border-color: #d9ad9a;
  box-shadow: 0 0 0 0.15rem #a26d5c;
}

.btn-primary {
  background-color: #29000a;
  border: none;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #ffffff;
  border: 1px solid #29000a;
  color: #29000a;
}

p {
  color: #000;
  font-size: 14px;
}

a {
  color: #cf3b00;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
</style>
