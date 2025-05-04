import { createStore } from 'vuex';

export default createStore({
  state: {
    products: [],
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
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
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    REMOVE_FROM_CART(state, productId) {
      state.cart = state.cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    CLEAR_CART(state) {
      state.cart = [];
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    SET_AUTH(state, status) {
      state.isAuthenticated = status;
      localStorage.setItem('isAuthenticated', status);
    }
  },
  actions: {
    fetchProducts({ commit }) {
      const sampleProducts = [
        {
          id: 1,
          name: 'Noir Drift',
          price: 599,
          image: 'noir-drift.jpg',
          description: 'tung tung tung sahur',
          stock: 25
        },
        {
          id: 2,
          name: 'Iron Woods',
          price: 599,
          image: 'iron-woods.jpg',
          description: 'A strong and earthy scent perfect for bold personalities.',
          stock: 18
        },
        {
          id: 3,
          name: 'Azure Pulse',
          price: 599,
          image: 'azure-pulse.jpg',
          description: 'Fresh aquatic notes that energize your senses.',
          stock: 30
        },
        {
          id: 4,
          name: 'Bloom Veil',
          price: 599,
          image: 'bloom-veil.jpg',
          description: 'Floral and soft, like a gentle breeze in spring.',
          stock: 22
        },
        {
          id: 5,
          name: 'Rose Ember',
          price: 599,
          image: 'rose-ember.jpg',
          description: 'A blend of rose petals with a smoky twist.',
          stock: 27
        },
        {
          id: 6,
          name: 'Luna Petal',
          price: 599,
          image: 'luna-petal.jpg',
          description: 'Delicate and dreamy, inspired by moonlit gardens.',
          stock: 15
        },
        {
          id: 7,
          name: 'Solstice Air',
          price: 599,
          image: 'solstice-air.jpg',
          description: 'Light and airy scent that captures summer vibes.',
          stock: 35
        },
        {
          id: 8,
          name: 'Velour Mist',
          price: 599,
          image: 'velour-mist.jpg',
          description: 'Smooth and luxurious, with hints of vanilla and musk.',
          stock: 20
        },
        {
          id: 9,
          name: 'Muse Ashé',
          price: 599,
          image: 'muse-ashe.jpg',
          description: 'Elegant and artistic, with subtle spicy tones.',
          stock: 12
        }
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
