<template>
    <el-container class="search-home">
        <el-header class="header">
            <div class="header-content">
                <schoolLogo class="logo" />
                <!-- 添加吸附容器 -->
                <div class="one-word-wrapper" :class="{ fixed: isSticky }">
                    <oneWord class="oneWord" />
                </div>
                <user class="user" />
            </div>
        </el-header>
        <el-main class="main">
            <el-container>
                <el-main class="main-content">
                    <schoolTitle class="title" />
                    <div class="search-wrapper">
                        <SearchBox @search="handleSearch" />
                    </div>
                    <el-container class="content-wrapper">
                        <FilterPanel :books="filteredBooks" @filter-change="handleFilterChange" />
                        <el-main class="result-area">
                            <div class="debug-info">
                                当前搜索：{{ searchKeyword }} ({{ searchType }})
                                筛选结果数：{{ filteredBooks.length }}
                            </div>
                            <BookList :filtered-books="pagedBooks" />
                            <!-- 分页控件 -->
                            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize"
                                :total="filteredBooks.length" :page-sizes="[10, 20, 50, 100]"
                                layout="total, sizes, prev, pager, next, jumper" @current-change="handlePageChange"
                                @size-change="handleSizeChange" />
                        </el-main>
                    </el-container>
                </el-main>
            </el-container>


        </el-main>
        <el-footer>
            <test />
        </el-footer>
    </el-container>

</template>

<script lang="ts" setup>
defineOptions({
    name: 'SearchHome',
})
import { ref, computed, onMounted, onUnmounted } from 'vue'
import schoolLogo from '@/components/SearchHome/logo.vue'
import schoolTitle from '@/components/SearchHome/title.vue'
import user from '@/components/SearchHome/user.vue'
import oneWord from '@/components/SearchHome/oneWord.vue'
import SearchBox from '@/components/SearchHome/SearchBox.vue'

import { mockBooks } from '@/mock/books'
import FilterPanel from '@/components/SearchHome/FilterPanel.vue'
import BookList from '@/components/SearchHome/BookList.vue'
import type { Book, FilterParams } from '@/types/book'
import { SearchType } from '@/types/book'

const searchType = ref<SearchType>(SearchType.Title)

// 搜索和筛选状态
const rawBooks = ref<Book[]>([]) // 从API获取的原始数据
onMounted(() => {
    rawBooks.value = mockBooks
})


const searchKeyword = ref('')
const currentFilter = ref<FilterParams>({
    classifications: [],
    languages: [],
    publishers: [],
    hasPreview: false,
    chineseClassification: 'ALL',  // 初始化应为'ALL'
    publishYears: [],
    publishMonth: undefined,      // 补充缺失字段
    status: undefined              // 补充缺失字段
})

// 分页状态
const currentPage = ref(1)
const pageSize = ref(20)

// 处理搜索
const handleSearch = (keyword: string, type: SearchType) => {
    searchKeyword.value = keyword.trim()  // 增加trim处理
    searchType.value = type
    currentPage.value = 1
    console.log('搜索参数:', { keyword, type })  // 调试日志
}
// 处理筛选
const handleFilterChange = (params: FilterParams) => {
    currentFilter.value = params
    currentPage.value = 1
    
}

// 综合筛选
const filteredBooks = computed(() => {
    return rawBooks.value.filter(book => {
        // 匹配搜索条件
        const matchesSearch = checkSearchCondition(book)

        // 匹配筛选条件
        const matchesFilter = checkFilterCondition(book)

        return matchesSearch && matchesFilter
    })
})

// 分页数据
const pagedBooks = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    return filteredBooks.value.slice(start, start + pageSize.value)
})
// 修改 checkSearchCondition 方法
const checkSearchCondition = (book: Book) => {
    const val = searchKeyword.value.trim().toLowerCase()
    if (!val) return true // 空关键词时显示全部

    switch (searchType.value) {
        case SearchType.Title:
            return book.title.toLowerCase().includes(val)
        case SearchType.Author:
            return book.author.toLowerCase().includes(val)
        case SearchType.ISBN:
            return book.isbn?.replace(/-/g, '').includes(val.replace(/-/g, '')) 
        case SearchType.ID:
            return book.id.toString() === val
        default:
            return true
    }
}

// 完善后的筛选条件检查
const checkFilterCondition = (book: Book) => {
    const filter = currentFilter.value

    // 防御性处理空值
    const bookYear = parseInt(book.publishData?.split('-')[0]) || 0
    const bookMonth = parseInt(book.publishData?.split('-')[1]) || 0
    const bookLanguage = book.language || ''
    const bookPublisher = book.publisher || ''

    const result =
        (filter.chineseClassification === 'ALL' ||
            book.chineseClassification === filter.chineseClassification) &&
        (filter.languages.length === 0 ||
            filter.languages.includes(bookLanguage)) &&
        (filter.publishers.length === 0 ||
            filter.publishers.includes(bookPublisher)) &&
        (filter.publishYears.length === 0 ||
            filter.publishYears.includes(bookYear)) &&
        (!filter.publishMonth ||
            bookMonth === filter.publishMonth) &&
        (!filter.status ||
            book.status === filter.status) &&
        (!filter.hasPreview ||
            !!book.livePreview)

    console.log(`[DEBUG] 图书 ${book.id} 筛选结果:`, result)
    return result
}

// 分页事件处理
const handlePageChange = (newPage: number) => {
    currentPage.value = newPage
    scrollToTop()
}

const handleSizeChange = (newSize: number) => {
    pageSize.value = newSize
    currentPage.value = 1
    scrollToTop()
}

// 滚动到顶部
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}



const isSticky = ref(false)
const stickyOffset = ref(0)
const headerHeight = ref(0)

// 滚动处理
const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    isSticky.value = scrollTop > stickyOffset.value
}

// 重置定位参数
const headerElement = ref<HTMLElement | null>(null)

// 在updateDimensions中获取实际DOM尺寸
const updateDimensions = () => {
    if (headerElement.value) {
        headerHeight.value = headerElement.value.offsetHeight
        stickyOffset.value = headerHeight.value * 0.8
        document.documentElement.style.setProperty(
            '--sticky-offset',
            `${headerHeight.value * 0.2}px`
        )
    }
}


onMounted(() => {
    updateDimensions()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateDimensions)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', updateDimensions)
})



</script>

<style scoped>
.search-home {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.header-content {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.main {
    padding: 0px;
}

.title {
    font-family: 'CooperZhengKai';
    font-size: 3em;
    font-weight: 550;
    padding-top: 0.1rem;
}



.main-content {
    padding: 0;
    overflow: hidden;
}

.book-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding: 20px;
}

.el-pagination {
    margin-top: 20px;
    justify-content: center;
}

.oneWord {
    display: flex;
    justify-content: center;
    width: 100%;
    z-index: 2000;
}
.logo {
    padding: 2px;
}

.result-area {
    padding-top: 0px;
    max-width: 1600px;
    margin: 0 auto;
    height: 100%;
}

.header {
    height: 4rem;
    padding: 0;
}

/* 新增样式 */
.one-word-wrapper {
    position: absolute;
    width: 100%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;

    /* 初始动画位置 */
    transform: translateY(-150%);
    animation: slideDown 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: 0.5s;

    /* 吸附状态 */
    &.fixed {
        position: fixed;
        top: 0px;
        animation: float 3s ease-in-out infinite;
        border-radius: 35px;
        width: 100%;
        left: 50%;
        transform: translateX(-50%);

        .poem-line {
            box-shadow: none;
        }
    }
}
.content-wrapper{
    margin-left: 5px;
    height: 80vh;
}
.debug-info {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    z-index: 9999;
}

/* 初始动画 */
@keyframes slideDown {
    to {
        transform: translateY(v-bind('headerHeight * 0.2 + "px"'));
    }
}

/* 浮动效果 */
@keyframes float {

    0%,50%,75%,
    100% {
        transform: translate(-50%);
    }
}
/* 响应式调整 */
@media (max-width: 768px) {
    .one-word-wrapper.fixed {
        top: 10px;
        width: 90%;

        .poem {
            font-size: 1.2rem !important;
        }

        .author {
            font-size: 1rem !important;
        }
    }
}
</style>