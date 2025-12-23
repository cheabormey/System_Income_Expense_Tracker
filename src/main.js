import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";


const app = createApp(App)



const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: false, // or 'light'
      cssLayer: false
    }
  }
})

app.use(router)
app.use(pinia);

app.mount('#app')
