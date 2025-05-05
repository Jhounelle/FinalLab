import { createStore } from 'vuex';
import axios from '../axios';

// Helper function for safe API requests with fallback data
const safeRequest = async (endpoint, fallbackData, errorMessage = 'API request failed') => {
  try {
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    // Only fall back to sample data if there was an actual error, not just an empty response
    if (error.response && error.response.status === 404) {
      console.warn('API endpoint not found, using fallback data');
      return fallbackData;
    }
    // For other types of errors, check if we got a valid response with empty data
    if (error.response && error.response.data) {
      return error.response.data;
    }
    // Last resort: use fallback data
    return fallbackData;
  }
};

export default createStore({
  state: {
    products: [],
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
    userRole: localStorage.getItem('userRole') || null,
    authToken: localStorage.getItem('authToken') || null,
    orders: [],
  },
  mutations: {
    SET_PRODUCTS(state, products) {
      state.products = products;
    },
    ADD_TO_CART(state, product) {
      // Initialize cart if undefined
      if (!state.cart) {
        state.cart = [];
      }
      
      // Check if product already has a quantity specified
      const productQuantity = product.quantity || 1;
      
      // Ensure price is a number
      const productToAdd = {
        ...product,
        price: parseFloat(product.price),
        quantity: productQuantity
      };
      
      const existing = state.cart.find(item => item.id === product.id);
      if (existing) {
        // If the product already has a specified quantity, add that quantity
        existing.quantity += productQuantity;
        existing.price = parseFloat(existing.price); // Ensure price is a number
      } else {
        state.cart.push(productToAdd);
      }
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    REMOVE_FROM_CART(state, productId) {
      if (!state.cart) {
        state.cart = [];
        return;
      }
      
      state.cart = state.cart.filter(item => item.id !== productId);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    UPDATE_CART_ITEM_QUANTITY(state, { id, quantity }) {
      if (!state.cart) {
        state.cart = [];
        return;
      }
      
      const item = state.cart.find(item => item.id === id);
      if (item) {
        // Ensure quantity is a number and at least 1
        item.quantity = Math.max(1, parseInt(quantity) || 1);
        // Also ensure price is a number
        item.price = parseFloat(item.price);
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    CLEAR_CART(state) {
      state.cart = [];
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    SET_AUTH(state, status) {
      state.isAuthenticated = status;
      localStorage.setItem('isAuthenticated', status);
      if (!status) {
        state.userRole = null;
        state.authToken = null;
        localStorage.removeItem('userRole');
        localStorage.removeItem('authToken');
      }
    },
    SET_USER_ROLE(state, role) {
      state.userRole = role;
      localStorage.setItem('userRole', role);
    },
    SET_AUTH_TOKEN(state, token) {
      state.authToken = token;
      localStorage.setItem('authToken', token);
    },
    SET_ORDERS(state, orders) {
      state.orders = orders;
    },
    ADD_ORDER(state, order) {
      state.orders.push(order);
    }
  },
  actions: {
    async fetchProducts({ commit, state }) {
      console.log('Fetching products with role:', state.userRole);
      
      // Default to public products for unauthenticated users
      let endpoint = '/api/public/products/';
      
      if (state.isAuthenticated) {
        if (state.userRole === 'admin') {
          endpoint = '/api/employee/products/';
        } else {
          endpoint = '/api/customer/products/';
        }
      }
      
      // Sample data as fallback
      const sampleProducts = [
        {
          id: 1,
          name: 'Noir Drift',
          price: 599,
          image: 'noir-drift.jpg',
          description: 'A captivating fragrance that evokes mystery, elegance, and quiet strength.',
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
      
      try {
        const response = await axios.get(endpoint);
        console.log('Products fetched successfully:', response.data);
        
        // If we get a valid response with data
        if (response.data && Array.isArray(response.data)) {
          commit('SET_PRODUCTS', response.data);
        } else {
          console.warn('API returned invalid data format, using fallback');
          commit('SET_PRODUCTS', sampleProducts);
        }
      } catch (error) {
        console.error(`Error fetching products from ${endpoint}:`, error);
        commit('SET_PRODUCTS', sampleProducts);
      }
    },
    addToCart({ commit, state }, product) {
      return new Promise((resolve) => {
        if (!state.isAuthenticated) {
          resolve({ success: false, message: 'Please register or log in first.' });
          return;
        }
        
        // Get the quantity from the product if available, otherwise default to 1
        const quantity = product.quantity || 1;
        
        // Check if product has stock
        const productInStore = state.products.find(p => p.id === product.id);
        if (!productInStore || productInStore.stock <= 0) {
          resolve({ success: false, message: 'This product is out of stock.' });
          return;
        }
        
        // Check if adding more would exceed available stock
        const cart = state.cart || [];
        const cartItem = cart.find(item => item.id === product.id);
        const currentQuantity = cartItem ? cartItem.quantity : 0;
        
        if (currentQuantity + quantity > productInStore.stock) {
          resolve({ success: false, message: 'Cannot add more. Maximum stock reached.' });
          return;
        }
        
        commit('ADD_TO_CART', product);
        resolve({ success: true, message: `${product.name} added to cart.` });
      });
    },
    async submitOrder({ commit, state, dispatch }, orderData) {
      // Make sure we have the latest product data
      await dispatch('fetchProducts');
      
      // Ensure cart exists
      if (!state.cart || state.cart.length === 0) {
        return { 
          success: false, 
          message: 'Your cart is empty.' 
        };
      }
      
      // Validate cart items against current stock
      for (const cartItem of state.cart) {
        const product = state.products.find(p => p.id === cartItem.id);
        if (!product) {
          return { 
            success: false, 
            message: 'A product in your cart is no longer available.'
          };
        }
        
        if (product.stock < cartItem.quantity) {
          return { 
            success: false, 
            message: `Cannot complete order. ${product.name} has insufficient stock (only ${product.stock} available).`
          };
        }
      }

      try {
        console.log('Submitting order with data:', orderData);
        
        // Create order on backend
        const response = await axios.post('/api/customer/orders/', orderData);
        
        // Add order to store
        commit('ADD_ORDER', response.data);
        
        // Clear cart after successful order
        commit('CLEAR_CART');
        
        // Add a small delay to ensure UI updates properly
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return { success: true, order: response.data };
      } catch (error) {
        console.error('Error submitting order:', error);
        
        let errorMessage = 'Failed to submit order. Please try again.';
        
        // Try to extract the specific error message from the API response
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.detail) {
            errorMessage = error.response.data.detail;
          } else if (error.response.data.non_field_errors) {
            errorMessage = error.response.data.non_field_errors.join(', ');
          } else if (typeof error.response.data === 'object') {
            // Format validation errors for display
            const errorMessages = [];
            for (const field in error.response.data) {
              const fieldError = error.response.data[field];
              if (Array.isArray(fieldError)) {
                errorMessages.push(`${field}: ${fieldError.join(', ')}`);
              } else {
                errorMessages.push(`${field}: ${fieldError}`);
              }
            }
            if (errorMessages.length > 0) {
              errorMessage = errorMessages.join(', ');
            }
          }
        }
        
        return { 
          success: false, 
          message: errorMessage
        };
      }
    },
    async fetchOrders({ commit, state }) {
      const endpoint = state.userRole === 'admin' 
        ? '/api/admin/orders/' 
        : '/api/customer/orders/';
      
      const orders = await safeRequest(
        endpoint, 
        [], 
        `Error fetching orders from ${endpoint}`
      );
      commit('SET_ORDERS', orders);
    },
    logout({ commit }) {
      commit('SET_AUTH', false);
      commit('CLEAR_CART');
    }
  },
  getters: {
    cart: state => state.cart || [],
    cartItemCount: state => state.cart ? state.cart.reduce((total, item) => total + item.quantity, 0) : 0,
    cartTotal: state => state.cart ? state.cart.reduce((total, item) => total + item.price * item.quantity, 0) : 0,
    isAuthenticated: state => state.isAuthenticated,
    userRole: state => state.userRole,
    isAdmin: state => state.userRole === 'admin',
    isCustomer: state => state.userRole === 'customer',
    getProductById: state => id => state.products.find(product => product.id === id),
    checkIfInStock: state => id => {
      const product = state.products.find(p => p.id === id);
      return product && product.stock > 0;
    }
  }
});
