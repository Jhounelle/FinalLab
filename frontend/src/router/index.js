import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../views/HomePage.vue';
import CheckoutPage from '@/views/CheckoutPage.vue';
import UserRegistration from '../views/UserRegistration.vue';
import LoginPage from '@/views/LoginPage.vue';
import AdminPanel from '@/views/AdminPanel.vue';

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
    path: '/registration',
    name: 'registration',
    component: UserRegistration
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel
  },
  {
    path: '/product/:id',
    name: 'ProductCatalog',
    component: () => import('@/views/ProductCatalog.vue'),
    props: true
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: CheckoutPage,
    meta: { useCheckoutNavbar: true }
  }, 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
