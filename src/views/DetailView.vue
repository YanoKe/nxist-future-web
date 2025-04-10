<template>
    <div class="detail">
        <h1>{{ book?.title }}</h1>
        <el-button @click="goBack">返回列表</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref ,onMounted, computed} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BookStatus, type Book } from '@/types/book'

const route = useRoute()
const router = useRouter()
const book = ref<Book | null>(null)

// 获取路由参数
const bookId = computed(() => Number(route.params.id))

// 模拟数据加载
// 后续需替换为真实API调用
onMounted(() => {
    book.value = {
        id: bookId.value,
        title: `图书 ${bookId.value}`,
        author: '作者',
        status: BookStatus.Available,
        cover: 'https://picsum.photos/200/300',
        Introduction: '图书简介',
        publishData: `${2018}-${2}`,
        publisher: '出版社',
        language: '中文',
        classification: [],
        livePreview: ''
    }
})

const goBack = () => {
    router.back() // 返回上一页
}
</script>