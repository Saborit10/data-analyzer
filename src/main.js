import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "./presets/aura";
import ToastService from "primevue/toastservice";

const app = createApp(App);
app.use(PrimeVue, {
  unstyled: true,
  pt: Aura,
});
app.use(ToastService);
app.mount("#app");
