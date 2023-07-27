
import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import CodeBlock from 'vue3-code-block';

const app = createApp(App);
app.use(router)
app.component('CodeBlock', CodeBlock)
app.mount('#app');
