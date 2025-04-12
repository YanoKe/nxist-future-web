<template>
    <el-aside width="280px" class="filter-panel">
        <div class="filter-section">
            <h3>中图分类</h3>
            <el-checkbox-group v-model="selectedClassifications">
                <el-checkbox v-for="item in classificationOptions" :key="item" :label="item">
                    {{ item }}
                </el-checkbox>
            </el-checkbox-group>
        </div>

        <div class="filter-section">
            <h3>语种</h3>
            <el-select v-model="selectedLanguages" multiple filterable collapse-tags placeholder="选择语种">
                <el-option v-for="lang in languageOptions" :key="lang" :label="lang" :value="lang" />
            </el-select>
        </div>

        <div class="filter-section">
            <h3>出版日期</h3>
            <div class="date-filters">
                <el-select v-model="selectedYear" placeholder="选择年份">
                    <el-option v-for="year in yearOptions" :key="year" :label="`${year}年`" :value="year" />
                </el-select>
                <el-select v-model="selectedMonth" placeholder="选择月份">
                    <el-option v-for="month in 12" :key="month" :label="`${month}月`" :value="month" />
                </el-select>
            </div>
        </div>

        <div class="filter-section">
            <h3>出版社</h3>
            <el-select v-model="selectedPublishers" multiple filterable remote reserve-keyword
                :remote-method="searchPublisher" placeholder="输入出版社名称">
                <el-option v-for="pub in publisherOptions" :key="pub" :label="pub" :value="pub" />
            </el-select>
        </div>

        <div class="filter-section">
            <h3>图书状态</h3>
            <el-radio-group v-model="selectedStatus">
                <el-radio :label="undefined">全部</el-radio>
                <el-radio v-for="status in Object.values(BookStatus)" :key="status" :label="status">
                    {{ status }}
                </el-radio>
            </el-radio-group>
        </div>

        <div class="filter-section">
            <el-checkbox v-model="hasPreview">支持在线预览</el-checkbox>
        </div>
    </el-aside>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { BookStatus, type Book, type FilterParams } from '@/types/book'
const selectedYear = ref<number | null>(null)
const selectedMonth = ref<number | null>(null)
const selectedStatus = ref<BookStatus | undefined>()
const selectedClassifications = ref<string[]>([])
const selectedLanguages = ref<string[]>([])
const selectedPublishers = ref<string[]>([])
const hasPreview = ref(false)


const props = defineProps<{
    books: Book[] // 当前搜索结果
}>()

const emit = defineEmits(['filter-change'])

// 筛选参数
const filterParams = ref<FilterParams>({
    classifications: [],
    languages: [],
    publishers: [],
    hasPreview: false
})

// 获取可选项（自动从当前搜索结果生成）
const classificationOptions = computed(() => {
    return [...new Set(props.books.map(b => b.chineseClassification))]
})

const languageOptions = computed(() => {
    return [...new Set(props.books.map(b => b.language))]
})

const publisherOptions = ref<string[]>([])
const yearOptions = computed(() => {
    const years = props.books.map(b =>
        parseInt(b.publishData.split('-')[0]))
    return [...new Set(years)].sort((a, b) => b - a)
})

// 筛选参数同步
watchEffect(() => {
    emit('filter-change', {
        ...filterParams.value,
        publishYear: selectedYear.value,
        publishMonth: selectedMonth.value,
        status: selectedStatus.value
    })
})

// 出版社搜索
const searchPublisher = (query: string) => {
    publisherOptions.value = [
        ...new Set(props.books
            .map(b => b.publisher)
            .filter(p => p.includes(query))
    )]
}
</script>

<style scoped>
.filter-panel {
    padding: 20px;
    border-right: 1px solid #ebeef5;
}

.filter-section {
    margin-bottom: 24px;
}

h3 {
    margin: 0 0 12px 0;
    color: #606266;
    font-size: 14px;
}

.date-filters {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.el-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.el-select {
    width: 100%;
}
</style>