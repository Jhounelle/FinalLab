import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../views/HomePage.vue';
import CheckoutPage from '../components/CheckoutPage.vue';
import UserRegistration from '../views/UserRegistration.vue';
import LoginPage from '@/views/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'register',
    component: UserRegistration
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/UserCart.vue')
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
