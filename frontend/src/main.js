
import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import trackingPlugin from './plugins/trackingPlugin';
import CodeBlock from 'vue3-code-block';

const app = createApp(App);
app.use(trackingPlugin, "3tspucnwtebczm7eaenyqmmybsllam9m");
app.use(router)
app.component('CodeBlock', CodeBlock)
app.mount('#app');
