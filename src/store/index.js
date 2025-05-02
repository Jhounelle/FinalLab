import { createStore } from 'vuex';

export default createStore({
  state: {
    products: [],
    cart: [],
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true'
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    ADD_TO_CART(state, product) {
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId);
    },
    CLEAR_CART(state) {
      state.cart = [];
    },
    SET_AUTH(state, status) {
      state.isAuthenticated = status;
      localStorage.setItem('isAuthenticated', status);
    }
  },
  actions: {
    fetchProducts({ commit }) {
      // Simulate API call
      const sampleProducts = [
        { id: 1, name: 'Product A', price: 10 },
        { id: 2, name: 'Product B', price: 20 }
      ];
      commit('SET_PRODUCTS', sampleProducts);
    },
    addToCart({ commit, state }, product) {
      if (state.isAuthenticated) {
        commit('ADD_TO_CART', product);
      } else {
        alert('Please register or log in first.');
      }
    },
    logout({ commit }) {
      commit('SET_AUTH', false);
      commit('CLEAR_CART');
    }
  },
  getters: {
    cartItemCount: state => state.cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: state => state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    isAuthenticated: state => state.isAuthenticated
  }
});
