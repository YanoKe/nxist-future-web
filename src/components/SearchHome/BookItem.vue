<template>
    <div class="book-item">
        <img :src="book.cover" class="cover" />
        <div class="info">
            <h3 class="title">{{ book.title }}</h3>
            <p class="author">{{ book.author }}</p>
            <el-tag size="small">{{ book.status }}</el-tag>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Book } from '@/types/book'

defineProps<{
    book: Book
}>()
</script>

<style scoped>
.book-item {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    overflow: hidden;
    transition: transform 0.2s;
}

.book-item:hover {
    transform: translateY(-2px);
}

.cover {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.info {
    padding: 12px;
}

.title {
    font-size: 14px;
    margin: 0 0 8px 0;
}

.author {
    color: #666;
    font-size: 12px;
    margin: 0 0 8px 0;
}
</style>