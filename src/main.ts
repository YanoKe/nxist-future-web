import { createApp} from 'vue'
import  App  from './App.vue'

createApp(App).mount('#app')


// 导入 ElementPlus 
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)
// 挂载 ElementPlus
app.use(ElementPlus)
app.mount('#app')

