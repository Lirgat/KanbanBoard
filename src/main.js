import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App).use(createPinia())

app.use(pinia)
app.mount('#app')
createApp(App).use(createPinia()).mount('#app')
export default {
}