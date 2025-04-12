<template>
    <el-container class="search-home">
        <el-header class="header">
            <div class="header-content">
                <schoolLogo class="logo" />
                <oneWord class="oneWord" />
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
                            <!-- 图书展示组件 -->
                            <div class="book-list">
                                <BookItem v-for="book in pagedBooks" :key="book.id" :book="book" />
                            </div>

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
        <el-footer></el-footer>
    </el-container>

</template>

<script lang="ts" setup>
defineOptions({
    name: 'SearchHome',
})
import { ref ,computed} from 'vue'
import schoolLogo from '@/components/SearchHome/logo.vue'
import schoolTitle from '@/components/SearchHome/title.vue'
import user from '@/components/SearchHome/user.vue'
import oneWord from '@/components/SearchHome/oneWord.vue'
import SearchBox from '@/components/SearchHome/SearchBox.vue'


import FilterPanel from '@/components/SearchHome/FilterPanel.vue'
import BookItem from '@/components/SearchHome/BookItem.vue'
import type { Book, FilterParams } from '@/types/book'
import { SearchType } from '@/types/book'

const searchType = ref<SearchType>(SearchType.Title)

// 搜索和筛选状态
const rawBooks = ref<Book[]>([]) // 从API获取的原始数据
const searchKeyword = ref('')
const currentFilter = ref<FilterParams>({
    classifications: [],
    languages: [],
    publishers: [],
    hasPreview: false
})

// 分页状态
const currentPage = ref(1)
const pageSize = ref(20)

// 处理搜索
const handleSearch = (keyword: string, type: SearchType) => {
    searchKeyword.value = keyword
    searchType.value = type // 更新搜索类型
    currentPage.value = 1
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

// 条件检查方法
const checkSearchCondition = (book: Book) => {
    // 根据当前搜索类型匹配
    // 示例：假设searchType来自SearchBox
    const val = searchKeyword.value.toLowerCase()
    switch (searchType.value) {
        case SearchType.Title:
            return book.title.toLowerCase().includes(val)
        case SearchType.Author:
            return book.author.toLowerCase().includes(val)
        // ...其他搜索类型
        default:
            return true
    }
}

const checkFilterCondition = (book: Book) => {
    const f = currentFilter.value
    return (
        (f.classifications.length === 0 ||
            f.classifications.includes(book.chineseClassification)) &&
        (f.languages.length === 0 ||
            f.languages.includes(book.language)) &&
        (f.publishers.length === 0 ||
            f.publishers.includes(book.publisher)) &&
        (!f.publishYear ||
            parseInt(book.publishData.split('-')[0]) === f.publishYear) &&
        (!f.publishMonth ||
            parseInt(book.publishData.split('-')[1]) === f.publishMonth) &&
        (!f.status || book.status === f.status) &&
        (!f.hasPreview || !!book.livePreview)
    )
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

</script>

<style scoped>
.search-home {
    /* height: 100vh; */
    display: flex;
    flex-direction: column;
}

.header-content {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.title {
    font-family: 'CooperZhengKai';
    font-size: 3em;
    font-weight: 550;
    padding-top: 0.1rem;
}

.oneWord {
    display: flex;
    justify-content: center;
    width: 100vw;
    gap: 0.5rem;
}

.main {
    padding: 0;
    overflow:hidden;
    /* height: 100vw; */
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



</style>