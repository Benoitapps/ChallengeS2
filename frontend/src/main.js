import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import SDK from '../sdk';

const app = createApp(App);
app.use(router).mount('#app');

new SDK("647e10c62a0b097776d1c584"); // user id