import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import trackingPlugin from './plugins/trackingPlugin';

const app = createApp(App);
app.use(trackingPlugin, "i8glfeaxlziraglwcfxvkew8sdac2voz");
app.use(router).mount('#app');