<template>
    <div class="search-container">
        <el-select v-model="searchType" class="search-type-select" placeholder="搜索类型" @change="handleSearchTypeChange">
            <el-option v-for="type in searchTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
        </el-select>

        <el-input v-model="searchKeyword" class="search-input" :placeholder="searchPlaceholder"
            @focus="showHistory = true" @blur="handleInputBlur" @keyup.enter="handleSearch">
            <template #append>
                <el-button type="primary" icon="Search" @click="handleSearch" />
            </template>
        </el-input>
        <el-card v-show="showHistory && searchHistory.length > 0" class="history-dropdown" shadow="always">
            <div v-for="(history, index) in searchHistory" :key="index" class="history-item">
                <span class="history-content" @click="applyHistory(history)">
                    <el-tag size="small">{{ getTypeLabel(history.type) }}</el-tag>
                    <span class="keyword">{{ history.keyword }}</span>
                    <span class="time">{{ formatTime(history.timestamp) }}</span>
                </span>
                <el-button type="danger" link icon="Delete" class="delete-btn"  @mousedown.prevent="deleteHistory(index)" />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watchEffect } from 'vue'
import { SearchType, type SearchHistory } from '@/types/book'
import { ElMessage } from 'element-plus'

// 搜索类型选项
const searchTypeOptions = [
    { value: SearchType.Title, label: '书名' },
    { value: SearchType.Author, label: '作者' },
    { value: SearchType.ISBN, label: 'ISBN' },
    { value: SearchType.ID, label: 'ID' }
]

// 响应式状态
const searchType = ref<SearchType>(SearchType.Title)
const searchKeyword = ref<string>('')
const showHistory = ref<boolean>(false)
const searchHistory = ref<SearchHistory[]>([])

// 计算属性
const searchPlaceholder = computed(() => {
    const map = {
        [SearchType.Title]: '请输入书名',
        [SearchType.Author]: '请输入作者名称',
        [SearchType.ISBN]: '请输入ISBN（格式：XXX-XX-XXXX-XXX）',
        [SearchType.ID]: '请输入图书ID'
    }
    return map[searchType.value]
})

// 初始化加载历史记录
onMounted(() => {
    loadHistory()
})

// 加载历史记录
const loadHistory = () => {
    const saved = localStorage.getItem('searchHistory')
    if (!saved) return

    try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) ){
            searchHistory.value = parsed
                .filter(item => isValidHistory(item))
                .slice(0, 10)
        }
    } catch (error) {
        ElMessage.error('历史记录加载失败')
    }
}

// 历史记录校验
const isValidHistory = (item: any): item is SearchHistory => {
    return (
        Object.values(SearchType).includes(item?.type) &&
        typeof item?.keyword === 'string' &&
        Number.isInteger(item?.timestamp)
    )
}

// 处理搜索类型切换
const handleSearchTypeChange = (newType: SearchType) => {
    searchKeyword.value = ''
}

// 执行搜索
const handleSearch = () => {
    const keyword = searchKeyword.value.trim()
    if (!keyword) return

    addToHistory({
        type: searchType.value,
        keyword,
        timestamp: Date.now()
    })

    // TODO: 实际搜索逻辑
    console.log('Searching:', searchType.value, keyword)
}

// 添加历史记录
const addToHistory = (history: SearchHistory) => {
    // 去重检查
    const exists = searchHistory.value.some(
        h => h.type === history.type && h.keyword === history.keyword
    )

    if (!exists) {
        searchHistory.value = [history, ...searchHistory.value].slice(0, 10)
        saveHistory()
    }
}

// 保存历史记录
const saveHistory = () => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
}

// 删除单条记录
const deleteHistory = (index: number) => {
    searchHistory.value.splice(index, 1)
    saveHistory()
}

// 应用历史记录
const applyHistory = (history: SearchHistory) => {
    searchType.value = history.type
    searchKeyword.value = history.keyword
    handleSearch()
}

// 格式化时间
const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString()
}

// 获取类型标签
const getTypeLabel = (type: SearchType) => {
    return searchTypeOptions.find(t => t.value === type)?.label || ''
}

// 处理输入框失焦
const handleInputBlur = () => {
    setTimeout(() => {
        showHistory.value = false
    }, 200)
}


</script>

<style scoped>
.search-container {
    position: relative;
    display: flex;
    gap: 8px;
    max-width: 800px;
    margin: 20px auto;
}

.search-type-select {
    width: 120px;
}

.history-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    z-index: 2000;
    max-height: 60vh;
    overflow-y: auto;
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    transition: background-color 0.2s;
    min-height: 36px;   /* 保证最小高度 */
}

.history-item:hover {
    background-color: var(--el-color-primary-light-9);
}

.history-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.keyword {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
}

.time {
    font-size: 0.8rem;
    color: var(--el-text-color-secondary);
}

.delete-btn {
    padding: 0;
    opacity: 0.6;
}

.delete-btn:hover {
    opacity: 1;
}

@media (max-width: 768px) {
    .search-container {
        flex-direction: column;
    }

    .search-type-select {
        width: 100%;
    }
}
</style>