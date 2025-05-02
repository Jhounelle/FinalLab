<template>
    <div class="registration-form">
      <h2>Register</h2>
  
      <!-- Registration Form -->
      <form @submit.prevent="submitForm">
        <!-- Name -->
        <div class="mb-3">
          <label for="name" class="form-label">Full Name</label>
          <input
            type="text"
            class="form-control"
            id="name"
            v-model="name"
            :class="{'is-invalid': errors.name}"
            required
          />
          <div class="invalid-feedback">{{ errors.name }}</div>
        </div>
  
        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            v-model="email"
            :class="{'is-invalid': errors.email}"
            required
          />
          <div class="invalid-feedback">{{ errors.email }}</div>
        </div>
  
        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
            :class="{'is-invalid': errors.password}"
            required
          />
          <div class="invalid-feedback">{{ errors.password }}</div>
        </div>
  
        <!-- Confirm Password -->
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input
            type="password"
            class="form-control"
            id="confirmPassword"
            v-model="confirmPassword"
            :class="{'is-invalid': errors.confirmPassword}"
            required
          />
          <div class="invalid-feedback">{{ errors.confirmPassword }}</div>
        </div>
  
        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          Register
        </button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isSubmitting: false,
        errors: {
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        }
      };
    },
    methods: {
      validateForm() {
        // Reset errors
        this.errors = {
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        };
  
        let isValid = true;
  
        // Name validation
        if (!this.name) {
          this.errors.name = 'Full name is required.';
          isValid = false;
        }
  
        // Email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!this.email || !emailPattern.test(this.email)) {
          this.errors.email = 'Please enter a valid email address.';
          isValid = false;
        }
  
        // Password validation
        if (!this.password) {
          this.errors.password = 'Password is required.';
          isValid = false;
        } else if (this.password.length < 6) {
          this.errors.password = 'Password must be at least 6 characters long.';
          isValid = false;
        }
  
        // Confirm Password validation
        if (this.password !== this.confirmPassword) {
          this.errors.confirmPassword = 'Passwords do not match.';
          isValid = false;
        }
  
        return isValid;
      },
      submitForm() {
        // Validate the form first
        if (!this.validateForm()) {
          return;
        }
  
        // Proceed with form submission (e.g., API call)
        this.isSubmitting = true;
  
        // Simulate an API call (you can replace this with actual API integration)
        setTimeout(() => {
          this.isSubmitting = false;
          alert('Registration successful!');
          
          // Reset the form fields
          this.name = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
        }, 2000);
      }
    }
  };
  </script>
  
  <style scoped>
  .registration-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .invalid-feedback {
    display: block;
    font-size: 0.875rem;
    color: #dc3545;
  }
  
  button:disabled {
    background-color: #ccc;
  }
  </style>
  