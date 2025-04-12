<template>
    <el-aside width="28rem" class="filter-panel">
        <div class="filter-header">
            <h2>筛选条件</h2>
            <el-button type="primary" link @click="resetAllFilters">重置所有条件</el-button>
        </div>

        <transition-group name="tag-scale" tag="div" class="selected-tags" v-if="selectedTags.length > 0">
            <el-tag v-for="tag in selectedTags" :key="tag.key" closable @close="clearFilter(tag.type)"
                class="filter-tag">
                {{ tag.label }}
            </el-tag>
        </transition-group>

        <!-- 折叠面板 -->
        <el-collapse v-model="activeCollapse" class="collapse-container">
            <!-- 中图分类 -->
            <el-collapse-item name="classification" class="collapse-item">
                <template #title>
                    <h3>中图分类</h3>
                    <span class="selected-value">{{ selectedClassificationName }}</span>
                </template>
                <el-radio-group v-model="filterParams.chineseClassification" class="classification-group">
                    <el-radio v-for="item in CLASSIFICATIONS" :key="item.code" :value="item.code"
                        class="classification-item">
                        <strong>{{ item.code }}</strong> - {{ item.name }}
                    </el-radio>
                </el-radio-group>
            </el-collapse-item>

            <!-- 语种 -->
            <el-collapse-item name="language">
                <template #title>
                    <h3>语种</h3>
                    <span class="selected-value">{{ selectedLanguages.join(', ') || '全部' }}</span>
                </template>
                <el-select v-model="selectedLanguages" multiple filterable collapse-tags placeholder="选择语种">
                    <el-option v-for="lang in languageOptions" :key="lang" :label="lang" :value="lang" />
                </el-select>
            </el-collapse-item>

            <!-- 出版日期 -->
            <el-collapse-item name="publishData">
                <template #title>
                    <h3>出版日期</h3>
                    <span class="selected-value">{{ selectedDateText }}</span>
                </template>
                <div class="date-filters">
                    <el-select v-model="selectedYears" multiple filterable collapse-tags placeholder="选择年份"
                        style="margin-bottom: 12px" @change="handleYearChange">
                        <el-option v-for="year in yearOptions" :key="year" :label="`${year}年`" :value="year" />
                    </el-select>
                    <el-select v-model="selectedMonth" placeholder="选择月份" clearable
                        :disabled="selectedYears.length === 0">
                        <el-option v-for="month in 12" :key="month" :label="`${month}月`" :value="month" />
                    </el-select>
                </div>
            </el-collapse-item>

            <!-- 出版社 -->
            <el-collapse-item name="publisher">
                <template #title>
                    <h3>出版社</h3>
                    <span class="selected-value">{{ selectedPublishers.join(', ') || '全部' }}</span>
                </template>
                <el-select v-model="selectedPublishers" multiple filterable remote reserve-keyword
                    :remote-method="searchPublisher" placeholder="输入出版社名称">
                    <el-option v-for="pub in publisherOptions" :key="pub" :label="pub" :value="pub" />
                </el-select>
            </el-collapse-item>

            <!-- 图书状态 -->
            <el-collapse-item name="status">
                <template #title>
                    <h3>图书状态</h3>
                    <span class="selected-value">{{ selectedStatus || '全部' }}</span>
                </template>
                <el-radio-group v-model="selectedStatus">
                    <el-radio value="undefined">全部</el-radio>
                    <el-radio v-for="status in Object.values(BookStatus)" :key="status" :value="status">
                        {{ status }}
                    </el-radio>
                </el-radio-group>
            </el-collapse-item>
            <el-collapse-item name="preview">
                <template #title>
                    <h3>在线预览</h3>
                    <span class="selected-value">{{ hasPreview ? '已选' : '全部' }}</span>
                </template>
                <el-checkbox v-model="hasPreview">支持在线预览</el-checkbox>
            </el-collapse-item>
        </el-collapse>
    </el-aside>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect, watch } from 'vue'
import { BookStatus, type Book, type FilterParams, CLASSIFICATIONS } from '@/types/book'
// 响应式数据
const activeCollapse = ref<string[]>([])
const selectedYears = ref<number[]>([])
const selectedMonth = ref<number | null>(null)
const selectedStatus = ref<BookStatus | undefined>()
const selectedLanguages = ref<string[]>([])
const selectedPublishers = ref<string[]>([])
const hasPreview = ref(false)


const props = defineProps<{
    books: Book[]
}>()



// 筛选参数
const filterParams = ref<FilterParams>({
    chineseClassification: 'ALL',
    languages: [],
    publishers: [],
    publishYears: [],
    publishMonth: undefined,
    status: undefined,
    hasPreview: false,
    classifications: []
})


// 获取可选项
const languageOptions = computed(() => {
    return [...new Set(props.books.map(b => b.language))]
})

const publisherOptions = ref<string[]>([])
const yearOptions = computed(() => {
    const years = props.books.map(b => parseInt(b.publishData.split('-')[0]))
    return [...new Set(years)].sort((a, b) => b - a)
})


watch(selectedYears, (newVal) => {
    filterParams.value.publishYears = newVal
    emit('filter-change', filterParams.value)
})
// 参数同步
const emit = defineEmits(['filter-change'])
watchEffect(() => {
    filterParams.value = {
        ...filterParams.value,
        languages: selectedLanguages.value,
        publishers: selectedPublishers.value,
        publishYears: selectedYears.value,
        publishMonth: selectedMonth.value || undefined,
        status: selectedStatus.value,
        hasPreview: hasPreview.value
    }
    emit('filter-change', filterParams.value)
})

// 重置所有筛选条件
const resetAllFilters = () => {
    filterParams.value = {
        chineseClassification: 'ALL',
        languages: [],
        publishers: [],
        publishYears: [],
        publishMonth: undefined,
        status: undefined,
        hasPreview: false,
        classifications: []
    }
    selectedYears.value = []
    selectedMonth.value = null
    selectedStatus.value = undefined
    selectedLanguages.value = []
    selectedPublishers.value = []
    hasPreview.value = false
}

// 已选标签计算
const selectedTags = computed(() => {
    const tags = []

    if (filterParams.value.chineseClassification !== 'ALL') {
        const cls = CLASSIFICATIONS.find(c => c.code === filterParams.value.chineseClassification)
        tags.push({
            type: 'classification',
            label: `分类: ${cls?.name}`,
            key: `cls-${cls?.code}`
        })
    }

    if (selectedLanguages.value.length > 0) {
        tags.push(...selectedLanguages.value.map(lang => ({
            type: 'language',
            label: `语种: ${lang}`,
            key: `lang-${lang}`
        })))
    }

    if (selectedYears.value.length > 0) {
        tags.push({
            type: 'publishYear',
            label: `出版年: ${selectedYears.value.join(', ')}年`,
            key: 'publish-year'
        })
    }
    if (selectedPublishers.value.length > 0) {
        tags.push(...selectedPublishers.value.map(pub => ({
            type: 'publisher',
            label: `出版社: ${pub}`,
            key: `pub-${pub}`
        })))
    }
    if (selectedStatus.value) {
        tags.push({
            type: 'status',
            label: `状态: ${selectedStatus.value}`,
            key: `status-${selectedStatus.value}`
        })
    }
    if (hasPreview.value) {
        tags.push({
            type: 'preview',
            label: '支持预览',
            key: 'has-preview'
        })
    }


    return tags
})

// 清除单个筛选条件
const clearFilter = (type: string) => {
    switch (type) {
        case 'classification':
            filterParams.value.chineseClassification = 'ALL'
            break
        case 'language':
            selectedLanguages.value = []
            break
        case 'publishYears':
            selectedYears.value = []
            break
        case 'publisher':
            selectedPublishers.value = []
            break
        case 'status':
            selectedStatus.value = undefined
            break
        case 'preview':
            hasPreview.value = false
            break
    }
}

// 当前选中分类名称
const selectedClassificationName = computed(() => {
    const cls = CLASSIFICATIONS.find(c => c.code === filterParams.value.chineseClassification)
    return cls?.code === 'ALL' ? '全部' : `${cls?.code} - ${cls?.name}`
})

// 出版社搜索
const searchPublisher = (query: string) => {
    publisherOptions.value = [
        ...new Set(props.books
            .map(b => b.publisher)
            .filter(p => p.includes(query))
        )]
}

// 已选日期显示文本
const selectedDateText = computed(() => {
    const parts = []
    if (selectedYears.value.length > 0) {
        parts.push(`${selectedYears.value.join(', ')}年`)
    }
    if (selectedMonth.value) parts.push(`${selectedMonth.value}月`)
    return parts.length > 0 ? parts.join(' ') : '全部'
})

// 年份变化时清空月份
const handleYearChange = () => {
    selectedMonth.value = null
}
</script>

<style scoped>
.filter-panel {
    padding: 5px 15px 15px 15px ;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    height: auto;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
}

.filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
}

/* 标签区域优化 */
.selected-tags {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, max-content));
    /* 固定列宽策略 */
    grid-auto-columns: minmax(120px, max-content);
    /* 防止列宽突变 */
    gap: 8px;
    padding: 0 8px 8px 0;
    margin: 0 -4px;
}

.filter-tag {
    --tag-bg: rgba(255, 255, 255, 0.9);
    --tag-border: rgba(0, 0, 0, 0.1);

    width: auto !important;
    /* 取消固定宽度 */
    min-width: 120px;
    max-width: 240px;
    /* 增加最大宽度限制 */
    transform-origin: center center;
    /* 优化缩放中心 */
    will-change: transform, opacity;
    /* 声明变化的属性 */

    width: 100%;
    min-width: 120px;
    max-width: 100%;
    height: auto;
    min-height: 32px;
    padding: 6px 12px;
    border-radius: 8px;
    background: var(--tag-bg);
    border: 1px solid var(--tag-border);
    backdrop-filter: blur(6px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    white-space: normal;
    line-height: 1.4;
    overflow: visible;
}

.filter-tag:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.tag-scale-enter-active {
    transition:
        opacity 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28),
        transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    transform: scale(0.8);
}

.tag-scale-enter-from {
    opacity: 0;
    transform: scale(0.8) translateY(8px);
}

.tag-scale-enter-to {
    opacity: 1;
    transform: scale(1) translateY(0);
}

/* 优化离开动画 */
.tag-scale-leave-active {
    transition:
        opacity 0.2s cubic-bezier(0.6, -0.3, 0.74, 0.05),
        transform 0.2s cubic-bezier(0.6, -0.3, 0.74, 0.05);
    position: absolute;
    /* 保持绝对定位 */
    z-index: -1;
    /* 隐藏布局影响 */
}

.tag-scale-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

/* 优化移动动画 */
.tag-scale-move {
    transition:
        transform 0.4s cubic-bezier(0.17, 0.84, 0.44, 1),
        width 0s 0.4s;
    /* 延迟宽度变化 */
}
/* 折叠面板优化 */
.collapse-container {
    --collapse-bg: rgba(255, 255, 255, 0.6);
    --collapse-radius: 12px;

    border: none;
    background: transparent;
}

.collapse-item {
    background: var(--collapse-bg);
    border-radius: var(--collapse-radius);
    margin-bottom: 8px;
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    white-space: nowrap;
}

.collapse-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:deep(.el-collapse-item__header) {
    height: 48px;
    padding: 0 10px 0 10px;
    border-bottom: none !important;
    font-size: 13px;
    color: #333;
}

:deep(.el-collapse-item__content) {
    padding: 10px;
    background: transparent !important;
}

/* 分类选项优化 */
.classification-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 8px;
}

.classification-item {
    margin: 0 !important;
    padding: 0 12px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    transition: background 0.3s;
}

.classification-item:hover {
    background: rgba(245, 247, 250, 0.9);
}

:deep(.classification-item .el-radio__label) {
    white-space: normal;
    line-height: 1.4;
}

/* 响应式优化 */
@media (max-width: 768px) {
    .filter-panel {
        width: 100% !important;
        height: auto;
        border-right: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .selected-tags {
        grid-template-columns: 1fr;
    }

    .classification-group {
        grid-template-columns: 1fr;
    }

    :deep(.el-collapse-item__header) {
        height: 40px;
        padding: 0 12px;
    }
}

.selected-value {
    padding-left: 5px;
}
</style>