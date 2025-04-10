<template>

</template>

<script lang="ts" setup>
defineOptions({
    name: '',
})
// 导入 useRouter
import { useRouter } from 'vue-router'

const router = useRouter()

// 修改 viewDetail 方法
const viewDetail = (id: number) => {
    router.push({
        name: 'Detail', // 使用路由名称跳转
        params: { id }
    })
}
</script>

<style scoped>

</style>