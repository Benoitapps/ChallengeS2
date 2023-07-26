
import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import trackingPlugin from './plugins/trackingPlugin';
import CodeBlock from 'vue3-code-block';

const app = createApp(App);
app.use(trackingPlugin, "mn6so1btd2fzw7g8fbhyjepuhpgr1cet");
app.use(router)
app.component('CodeBlock', CodeBlock)
app.mount('#app');
