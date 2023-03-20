import {createApp} from 'vue'
import {store} from "@/store";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import App from './App.vue'


const app = createApp(App)

app.use(store)
app.use(Toast)
app.mount('#app')