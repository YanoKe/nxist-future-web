import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/views/SearchHome.vue') // 使用懒加载
        },
        {
            path: '/detail/:id',
            name: 'Detail',
            component: () => import('@/views/DetailView.vue'),
            props: true
        }
    ]
})

export default router