import { createRouter, createWebHistory } from 'vue-router';

import CustomerPage from '../views/CustomerPage.vue';
import CheckoutPage from '@/views/CheckoutPage.vue';
import UserRegistration from '../views/UserRegistration.vue';
import LoginPage from '@/views/LoginPage.vue';
import AdminProductPanel from '@/views/AdminProductPanel.vue';
import AdminTransactionPanel from '@/views/AdminTransactionPanel.vue';

const routes = [
  {
    path: '/',
    name: 'Customer',
    component: CustomerPage
  },
  {
    path: '/login',
    name: 'login',
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
    path: '/admin/product',
    name: 'AdminProductPanel',
    component: AdminProductPanel
  },

  {
    path: '/admin/transaction',
    name: 'AdminTransactionPanel',
    component: AdminTransactionPanel
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
