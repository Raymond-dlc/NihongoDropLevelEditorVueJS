import './assets/main.css'
import 'vue3-toastify/dist/index.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const application = createApp(App)

application.use(router)

application.mount('#app')
