import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

// Import Bootstrap and optionally Bootstrap Icons
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const app = createApp(App);

// Vuex & Vue Router setup
app.use(store);
app.use(router);

// Mount the app
app.mount('#app');
