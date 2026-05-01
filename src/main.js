import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/tailwind.css";
import i18n from "../src/i18n";
/* PrimeVue */
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";
import "primeicons/primeicons.css";
import ToastService from "primevue/toastservice";
import Dialog from "primevue/dialog";
import Message from "primevue/message";

/* ✅ Font Awesome */
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* ✅ ADD ICON TO LIBRARY (IMPORTANT FIX) */
library.add(faPlusCircle);
/* Pinia */
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

/* PrimeVue Components */
import ToggleSwitch from "primevue/toggleswitch";
import Select from "primevue/select";
import MultiSelect from "primevue/multiselect";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Button from "primevue/button"; // ✅ IMPORT BUTTON

/* Create Vue App */
const app = createApp(App);

/* Pinia */
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

/* PrimeVue Theme Preset */
const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#f2f8ea",
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
    //     primary: {
//       50: '#ECFDF5',
//       100: '#D1FAE5',
//       200: '#A7F3D0',
//       300: '#6EE7B7',
//       400: '#34D399',
//       500: '#10B981', // main green
//       600: '#059669',
//       700: '#047857',
//       800: '#065F46',
//       900: '#064E3B',
//       950: '#022C22'
//     }

    
    secondary: {
      50: "#f7fde9",
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
});

/* PrimeVue */
app.use(PrimeVue, {
  theme: {
    preset: MyPreset, // ✅ USE YOUR CUSTOM PRESET
    options: {
      prefix: "p",
      darkModeSelector: false,
      cssLayer: false,
    },
  },
});

/* Vue Router & Pinia */
app.use(router);
app.use(pinia);
app.use(i18n);
/* Global Components */
app.component("ToggleSwitch", ToggleSwitch);
app.component("Select", Select);
app.component("MultiSelect", MultiSelect);
app.component("InputText", InputText);
app.component("InputNumber", InputNumber);
app.component("Textarea", Textarea);
app.component("Button", Button); // ✅ REGISTER BUTTON
app.use(ToastService);
app.component('font-awesome-icon', FontAwesomeIcon)
app.component("Dialog", Dialog);
app.component("Message", Message);
/* Mount App */
app.mount("#app");
