import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import trackingPlugin from './plugins/trackingPlugin';

const app = createApp(App);
app.use(trackingPlugin, "s6bzz5hhj1g65x2lqrj6idvn72an0332");
app.use(router).mount('#app');