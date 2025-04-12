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
    hasPreview: false,
    chineseClassification: '',
    publishYears: []
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
// 在SearchHome.vue的筛选条件检查中

const checkFilterCondition = (book: Book) => {
    const filter = currentFilter.value

    // 解析图书出版年份
    const bookYear = parseInt(book.publishData.split('-')[0])

    return (
        // 中图分类筛选
        (filter.chineseClassification === 'ALL' ||
            book.chineseClassification === filter.chineseClassification) &&

        // 语种筛选
        (filter.languages.length === 0 ||
            filter.languages.includes(book.language)) &&

        // 出版社筛选
        (filter.publishers.length === 0 ||
            filter.publishers.includes(book.publisher)) &&

        // 出版年份筛选（多选逻辑）
        (filter.publishYears.length === 0 ||
            filter.publishYears.includes(bookYear)) &&

        // 出版月份筛选（可选）
        (!filter.publishMonth ||
            parseInt(book.publishData.split('-')[1]) === filter.publishMonth) &&

        // 图书状态筛选
        (!filter.status || book.status === filter.status) &&

        // 在线预览筛选
        (!filter.hasPreview || !!book.livePreview)
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

.main-content{
    padding: 0;
    overflow:hidden;
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