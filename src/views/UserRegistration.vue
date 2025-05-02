<template>
  <div class="registration-form">
    <h2>Register</h2>

    <form @submit.prevent="submitForm">
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
      this.errors = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      let isValid = true;

      if (!this.name) {
        this.errors.name = 'Full name is required.';
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
      } else if (this.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters long.';
        isValid = false;
      }

      if (this.password !== this.confirmPassword) {
        this.errors.confirmPassword = 'Passwords do not match.';
        isValid = false;
      }

      return isValid;
    },
    submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      setTimeout(() => {
        this.isSubmitting = false;
        alert('Registration successful!');

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
  max-width: 420px;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.8rem;
  color: #121212;
}

label {
  font-weight: 500;
  margin-bottom: 6px;
  color: #121212;
}

.form-control {
  border-radius: 10px;
  padding: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-control:focus {
  border-color: #1db954;
  box-shadow: 0 0 0 0.15rem rgba(30, 215, 96, 0.25);
}

.invalid-feedback {
  display: block;
  font-size: 0.875rem;
  color: #dc3545;
  margin-top: 0.25rem;
}

button {
  margin-top: 1rem;
  padding: 12px;
  width: 100%;
  font-weight: 600;
  font-size: 1rem;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1a1a1a;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
