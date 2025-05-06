import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

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
    path: '/customer',
    name: 'CustomerHome',
    component: CustomerPage,
    meta: { requiresAuth: true, requiresCustomer: true }
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
    component: () => import('@/views/UserCart.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/registration',
    name: 'registration',
    component: UserRegistration
  },
  {
    path: '/admin/product',
    name: 'AdminProductPanel',
    component: AdminProductPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/transaction',
    name: 'AdminTransactionPanel',
    component: AdminTransactionPanel,
    meta: { requiresAuth: true, requiresAdmin: true }
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
    meta: { useCheckoutNavbar: true, requiresAuth: true }
  }, 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresCustomer = to.matched.some(record => record.meta.requiresCustomer);
  const isAuthenticated = store.getters.isAuthenticated;
  const isAdmin = store.getters.isAdmin;
  const isCustomer = store.getters.isCustomer;

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } 
  else if (requiresAdmin && !isAdmin) {
    if (isAuthenticated) {
      next('/customer');
    } else {
      next('/login');
    }
  }
  

  else if (requiresCustomer && !isCustomer) {
    if (isAuthenticated && isAdmin) {
      next('/admin/product');
    } else {
      next('/login');
    }
  }
  else {
    next();
  }
});

export default router;
