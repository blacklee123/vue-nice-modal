import { createApp } from 'vue';
import { Icon } from 'vant';
import App from './App.vue';
import 'vant/lib/index.css';

const app = createApp(App);

app.use(Icon);
// share the app context
app.mount('#app');
