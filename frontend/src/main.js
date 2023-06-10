import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import SDK from '../sdk';

const app = createApp(App);
app.use(router).mount('#app');

new SDK("cd0iuhk05n1o8d9tru01j9cqz1x6e5kp"); // api_token