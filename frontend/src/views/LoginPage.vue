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
        <h4 class="text-center mt-4 mb-4">{{ role.toUpperCase() }} LOGIN</h4>

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
          <div v-if="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>

        <p v-if="role === 'customer'" class="mt-3 text-center">
          Don't have an account?
          <router-link to="/register">Register here</router-link>
        </p>
        <p v-if="role === 'admin'" class="mt-3 text-center">
          <span style="color: red; font-weight: 600">Notice:</span> For authorized personnel only.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios';
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
      role: 'customer',
      loading: false,
      errorMessage: ''
    };
  },
  methods: {
    ...mapMutations(['SET_AUTH', 'SET_USER_ROLE', 'SET_AUTH_TOKEN']),
    handleLogin() {
      if (this.email && this.password) {
        this.errorMessage = '';
        this.loading = true;
        
        axios.post('/api/token/', {
          email: this.email,
          password: this.password
        })
        .then(response => {
          console.log('Login response:', response.data); // Debug log
          const { token, role } = response.data;
          
          // Check if user's actual role matches the selected role
          if (role !== this.role) {
            this.errorMessage = `You do not have ${this.role} permissions. Please select the correct role.`;
            return;
          }
          
          // Set authentication state
          this.SET_AUTH(true);
          this.SET_USER_ROLE(role);
          this.SET_AUTH_TOKEN(token);
          
          // Set the token in axios default headers
          axios.defaults.headers.common['Authorization'] = `Token ${token}`;
          
          // Redirect based on role
          if (role === 'admin') {
            this.$router.push('/admin/product');
          } else {
            this.$router.push('/customer');
          }
        })
        .catch(error => {
          console.error("Login error:", error);
          
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            this.errorMessage = error.response.data?.error || 
                               error.response.data?.detail || 
                               "Invalid credentials. Please check your email and password.";
          } else if (error.request) {
            console.error("Request error:", error.request);
            this.errorMessage = "Network error. Please check your connection and try again.";
          } else {
            this.errorMessage = "An unexpected error occurred. Please try again.";
          }
        })
        .finally(() => {
          this.loading = false;
        });
      } else {
        this.errorMessage = "Please enter both email and password.";
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  border-radius: 12px;
  height:100%;
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
  background-color:rgb(255, 255, 255);
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
