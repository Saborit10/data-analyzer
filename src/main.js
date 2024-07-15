import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Lara from './presets/lara';
import Aura from './presets/aura';


const app = createApp(App);
app.use(PrimeVue, {
    unstyled: true,
    pt: Aura
});
app.mount('#app');
