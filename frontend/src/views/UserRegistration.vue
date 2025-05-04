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
          </div>
          <div class="mb-3">
            <input
              type="text"
              v-model="lastname"
              class="form-control"
              required
              placeholder="Last Name"
            />
          </div>
          <div class="mb-3">
            <input
              type="text"
              v-model="location"
              class="form-control"
              required
              placeholder="Location"
            />
          </div>
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
          <div class="mb-3">
            <input
              type="password"
              v-model="confirmpassword"
              class="form-control"
              required
              placeholder="Confirm Password"
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">Register</button>
        </form>
        <p class="mt-3 text-center">
          Already have an account?
          <router-link to="/">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
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
      } else if (this.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters long.';
        isValid = false;
      }

      if (this.password !== this.confirmpassword) {
        this.errors.confirmpassword = 'Passwords do not match.';
        isValid = false;
      }

      return isValid;
    },
    submitForm() {
      if (!this.validateForm()) {
        return;
      }

      this.isSubmitting = true;

      // Simulate form submission
      setTimeout(() => {
        this.isSubmitting = false;
        alert('Registration successful!');

        this.firstname = '';
        this.lastname = '';
        this.location = '';
        this.email = '';
        this.password = '';
        this.confirmpassword = '';
      }, 2000);
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

.btn-primary:hover {
  background-color: rgb(255, 255, 255);
  border: 1px solid #29000a;
  color: #29000a;
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
</style>
