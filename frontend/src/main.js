import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import trackingPlugin from './plugins/trackingPlugin';

const app = createApp(App);
app.use(trackingPlugin, "cd0iuhk05n1o8d9tru01j9cqz1x6e5kp");
app.use(router).mount('#app');