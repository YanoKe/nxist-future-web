import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/SearchHome.vue') // 使用懒加载
        },

    ]
})

export default router