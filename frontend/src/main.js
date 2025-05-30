import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './axios'; // Import axios configuration

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap';

const app = createApp(App);

app.use(store);
app.use(router);

app.mount('#app');
