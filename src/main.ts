import { createApp} from 'vue'
import  App  from './App.vue'
import router from './router'
import '@/assets/css/base.css'

// 导入 ElementPlus 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)

app.use(router)
app.mount('#app')
// 挂载 ElementPlus
app.use(ElementPlus)


