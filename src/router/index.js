import { createRouter, createWebHistory } from 'vue-router';

// Use relative paths to test
import HomePage from '../views/HomePage.vue';
import UserCart from '../components/UserCart.vue';
import CheckoutPage from '../components/CheckoutPage.vue';
import UserRegistration from '../components/UserRegistration.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/cart',
    name: 'cart',
    component: UserCart
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage
  },
  {
    path: '/registration',
    name: 'registration',
    component: UserRegistration
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
