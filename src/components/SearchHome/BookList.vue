<template>
    <div class="book-list-container">
        <div class="book-grid">
            <div v-for="book in filteredBooks" :key="book.id" class="book-card" @click="showDetail(book)">
                <div class="book-cover">
                    <img :src="book.cover" />
                    <div class="bookID">{{ `图书ID：${book.id}` }}</div>
                    <div class="status-badge" :class="book.status === BookStatus.Available ? 'available' : 'borrowed'">
                        {{ book.status }}
                    </div>
                </div>
                <div class="book-info">
                    <h3 class="title">{{ book.title }}</h3>
                    <p class="author">{{ book.author }}</p>
                    <div class="meta-info">
                        <span class="isbn">ISBN: {{ book.isbn }}</span>
                        <span class="classification">分类: {{ book.chineseClassification }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 图书详情弹窗 -->
        <el-dialog v-model="detailVisible" :show-close="false" width="80%" top="10vh" custom-class="book-detail-modal">
            <div class="detail-container">
                <div class="cover-column">
                    <img :src="currentBook.cover" class="detail-cover" />
                </div>
                <div class="info-column">
                    <h1 class="detail-title">{{ currentBook.title }}</h1>
                    <div class="detail-meta">
                        <div class="meta-item">
                            <span class="label">作者:</span>
                            <span class="value">{{ currentBook.author }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="label">状态:</span>
                            <el-tag :type="currentBook.status === BookStatus.Available ? 'success' : 'danger'">
                                {{ currentBook.status }}
                            </el-tag>
                        </div>
                        <div class="meta-item">
                            <span class="label">ISBN:</span>
                            <span class="value">{{ currentBook.isbn }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="label">分类代码:</span>
                            <span class="value">{{ currentBook.chineseClassification }}</span>
                        </div>
                        <div class="meta-item full-width">
                            <span class="label">简介:</span>
                            <p class="description">{{ currentBook.Introduction }}</p>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <el-button type="primary" v-if="currentBook.livePreview">在线预览</el-button>
                        <el-button>收藏图书</el-button>
                    </div>
                </div>
            </div>

            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { type Book, BookStatus } from '@/types/book'

const props = defineProps<{
    filteredBooks: Book[]
}>()

const detailVisible = ref(false)
const currentBook = ref<Book>({} as Book)

const showDetail = (book: Book) => {
    currentBook.value = book
    detailVisible.value = true
}
</script>

<style scoped>


.book-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 24px;
}

.book-card {
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(8px);
    transition: transform 0.3s ease;
    cursor: pointer;
    overflow: hidden;
}

.book-card:hover {
    transform: translateY(-4px);
}

.book-cover {
    position: relative;
    aspect-ratio: 3/4;
    background: #f5f5f5;
}

.book-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.status-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    color: white;

    &.available {
        background: var(--el-color-success);
    }

    &.borrowed {
        background: var(--el-color-danger);
    }
}
.bookID{
    position: absolute;
        top: 2px;
        left: 2px;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #ff6700;
}
.book-info {
    padding: 16px;

    .title {
        font-size: 16px;
        margin: 0 0 8px;
        line-height: 1.4;
    }

    .author {
        color: var(--el-text-color-secondary);
        font-size: 14px;
        margin: 0 0 12px;
    }

    .meta-info {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        font-size: 12px;
        color: var(--el-text-color-regular);

        span {
            background: var(--el-fill-color-light);
            padding: 4px 8px;
            border-radius: 4px;
        }
    }
}

/* 详情弹窗样式 */
.detail-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 40px;
    height: 70vh;
}

.cover-column {
    .detail-cover {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
}

.info-column {
    padding-right: 20px;
    display: flex;
    flex-direction: column;

    .detail-title {
        font-size: 28px;
        margin: 0 0 20px;
    }

    .detail-meta {
        flex: 1;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
        align-content: start;

        .meta-item {
            &.full-width {
                grid-column: 1 / -1;
            }

            .label {
                display: block;
                color: var(--el-text-color-secondary);
                margin-bottom: 4px;
                font-size: 14px;
            }

            .value {
                font-size: 16px;
                word-break: break-word;
            }

            .description {
                line-height: 1.6;
                margin: 8px 0 0;
            }
        }
    }

    .action-buttons {
        margin-top: 24px;
        display: flex;
        gap: 12px;
    }
}

/* 适配移动端 */
@media (max-width: 768px) {
    .detail-container {
        grid-template-columns: 1fr;
        height: auto;

        .cover-column {
            max-height: 50vh;
        }
    }

    .book-grid {
        grid-template-columns: 1fr;
    }
}
</style>