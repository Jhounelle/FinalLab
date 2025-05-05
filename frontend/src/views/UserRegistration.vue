<template>
  <div class="container mt-5" style="max-width: 500px">
    <div class="card">
      <div class="card-body">
        <h3 class="card-title text-center mb-4">SIGN UP</h3>
        <div class="textLabel">Please fill in the information below:</div>
        <form @submit.prevent="submitForm">
          <div class="mb-3">
            <input
              type="text"
              v-model="firstname"
              class="form-control"
              required
              placeholder="First Name"
            />
            <div v-if="errors.firstname" class="text-danger">{{ errors.firstname }}</div>
          </div>
          <div class="mb-3">
            <input
              type="text"
              v-model="lastname"
              class="form-control"
              required
              placeholder="Last Name"
            />
            <div v-if="errors.lastname" class="text-danger">{{ errors.lastname }}</div>
          </div>
          <div class="mb-3">
            <input
              type="text"
              v-model="location"
              class="form-control"
              required
              placeholder="Location"
            />
            <div v-if="errors.location" class="text-danger">{{ errors.location }}</div>
          </div>
          <div class="mb-3">
            <input
              type="email"
              v-model="email"
              class="form-control"
              required
              placeholder="Email"
            />
            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
          </div>
          <div class="mb-3">
            <input
              type="password"
              v-model="password"
              class="form-control"
              required
              placeholder="Password"
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>
          <div class="mb-3">
            <input
              type="password"
              v-model="confirmpassword"
              class="form-control"
              required
              placeholder="Confirm Password"
            />
            <div v-if="errors.confirmpassword" class="text-danger">{{ errors.confirmpassword }}</div>
          </div>
          <div v-if="apiError" class="alert alert-danger">{{ apiError }}</div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isSubmitting">
            {{ isSubmitting ? 'Registering...' : 'Register' }}
          </button>
        </form>
        <p class="mt-3 text-center">
          Already have an account?
          <router-link to="/login">Login here</router-link>
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
      firstname: '',
      lastname: '',
      location: '',
      email: '',
      password: '',
      confirmpassword: '',
      isSubmitting: false,
      apiError: '',
      errors: {
        firstname: '',
        lastname: '',
        location: '',
        email: '',
        password: '',
        confirmpassword: ''
      }
    };
  },
  methods: {
    ...mapMutations(['SET_AUTH', 'SET_USER_ROLE', 'SET_AUTH_TOKEN']),
    validateForm() {
      this.errors = {
        firstname: '',
        lastname: '',
        location: '',
        email: '',
        password: '',
        confirmpassword: ''
      };

      let isValid = true;

      if (!this.firstname) {
        this.errors.firstname = 'First name is required.';
        isValid = false;
      }
      if (!this.lastname) {
        this.errors.lastname = 'Last name is required.';
        isValid = false;
      }
      if (!this.location) {
        this.errors.location = 'Location is required.';
        isValid = false;
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!this.email || !emailPattern.test(this.email)) {
        this.errors.email = 'Please enter a valid email address.';
        isValid = false;
      }

      if (!this.password) {
        this.errors.password = 'Password is required.';
        isValid = false;
      } else if (this.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long.';
        isValid = false;
      }

      if (this.password !== this.confirmpassword) {
        this.errors.confirmpassword = 'Passwords do not match.';
        isValid = false;
      }

      return isValid;
    },
    async submitForm() {
      this.apiError = '';
      
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await axios.post('/api/register/', {
          firstName: this.firstname,
          lastName: this.lastname,
          email: this.email,
          password: this.password,
          location: this.location
        });
        
        console.log('Registration successful:', response.data);
        
        // Set authentication state
        this.SET_AUTH(true);
        this.SET_USER_ROLE(response.data.role);
        this.SET_AUTH_TOKEN(response.data.token);
        
        // Set the token in axios default headers
        axios.defaults.headers.common['Authorization'] = `Token ${response.data.token}`;
        
        // Redirect to the customer page
        this.$router.push('/customer');
      } catch (error) {
        console.error('Registration error:', error);
        
        if (error.response) {
          this.apiError = error.response.data?.error || 'Registration failed. Please try again.';
        } else if (error.request) {
          this.apiError = 'Network error. Please check your connection and try again.';
        } else {
          this.apiError = 'An unexpected error occurred. Please try again.';
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.container {
  background-color: #d9d9d9;
  border-radius: 12px;
}

.card {
  border: none;
  border-radius: 16px;
  background-color: #d9d9d9;
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

.btn-primary:hover:not(:disabled) {
  background-color: rgb(255, 255, 255);
  border: 1px solid #29000a;
  color: #29000a;
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

p {
  color: rgb(0, 0, 0);
  font-size: 14px;
}

a {
  color: rgb(207, 59, 0);
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

.text-danger {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}
</style>
