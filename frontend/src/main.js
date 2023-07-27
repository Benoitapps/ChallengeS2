
import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import trackingPlugin from './plugins/trackingPlugin';
import CodeBlock from 'vue3-code-block';

const app = createApp(App);
app.use(trackingPlugin, "msxakqaxk28r8uz9xueof7rhvsj56tii");
app.use(router)
app.component('CodeBlock', CodeBlock)
app.mount('#app');
