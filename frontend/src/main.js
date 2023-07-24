import { createApp } from 'vue';
import App from './App.vue'
import router from './router';
import trackingPlugin from './plugins/trackingPlugin';
import CodeBlock from 'vue3-code-block';

const app = createApp(App);
app.use(trackingPlugin, "ikb3yt96da5pz1d47x5wv1dn12v3voly");
app.use(router)
app.component('CodeBlock', CodeBlock)
app.mount('#app');
