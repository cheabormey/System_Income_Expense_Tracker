import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { definePreset } from '@primevue/themes'
import 'primeicons/primeicons.css'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import ToggleSwitch from 'primevue/toggleswitch'
import Select from "primevue/select";
import MultiSelect from 'primevue/multiselect';





const app = createApp(App)

/* Pinia */
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

/* PrimeVue Theme Preset */
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50:  "#f2f8ea",
      100: "#e0efc8",
      200: "#c7e09d",
      300: "#add171",
      400: "#94c246",
      500: "#5B9717", // MAIN COLOR
      600: "#4f8415",
      700: "#3f6b12",
      800: "#2f520e",
      900: "#045B1B", // DARK COLOR
      950: "#033f12",
    },

    secondary: {
      50:  "#f7fde9",
      100: "#ecf9c6",
      200: "#dcf28f",
      300: "#cceb57",
      400: "#bde42f",
      500: "#82B215", // LIGHT GREEN
      600: "#6b9813",
      700: "#557d10",
      800: "#3f620c",
      900: "#2b4608",
      950: "#172603",
    },
  },
})


/* PrimeVue */
app.use(PrimeVue, {
  theme: {
    preset: MyPreset, // ✅ USE YOUR CUSTOM PRESET
    options: {
      prefix: 'p',
      darkModeSelector: false,
      cssLayer: false,
    },
  },
})

app.use(router)
app.use(pinia)

app.component('ToggleSwitch', ToggleSwitch)
app.component("Select", Select);

app.component("MultiSelect",MultiSelect)
app.mount('#app')
