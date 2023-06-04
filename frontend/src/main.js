import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import SDK from '../sdk';

const app = createApp(App);
app.use(router).mount('#app');

new SDK();