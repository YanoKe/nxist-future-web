<template>
    <div class="box">
        <div class="content-wrapper">
            <div class="poem-line">
                <span class="poem">{{ processedPoem || loadingText }}</span>
                <!-- 修改后模板 -->
                <span class="author" v-if="!error && processedAuthor">
                    {{ processedAuthor }}
                </span>
                <span class="author" v-else-if="!error">
                    {{ loadingText }}
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

// 类型定义
interface HitokotoResponse {
    hitokoto: string
    from: string
    length: number  // 新增 length 字段
    [key: string]: any
}

// 配置常量
const MAX_RETRY = 5              // 最大重试次数
const MAX_ALLOWED_LENGTH = 40    // 最大允许长度
const POLLING_INTERVAL = 20000   // 正常轮询间隔
const RETRY_INTERVAL = 3000      // 重试间隔
const loadingText = '正在加载...'

// 响应式数据
const rawPoem = ref<string>('')
const rawAuthor = ref<string>('')
const error = ref<string>('')
const retryCount = ref(0)        // 当前重试次数

// 计算属性
const processedPoem = computed(() => rawPoem.value)
const processedAuthor = computed(() => rawAuthor.value)

// 数据获取逻辑
const getData = async (isRetry = false): Promise<void> => {
    try {
        const { data } = await axios.get<HitokotoResponse>('https://international.v1.hitokoto.cn/')

        // 检查内容长度
        if (data.length > MAX_ALLOWED_LENGTH) {
            if (isRetry) retryCount.value++

            // 超过最大重试次数
            if (retryCount.value >= MAX_RETRY) {
                throw new Error(`未找到${MAX_ALLOWED_LENGTH}字以内的内容`)
            }

            // 延迟重试
            setTimeout(() => getData(true), RETRY_INTERVAL)
            return
        }

        // 有效数据
        rawPoem.value = data.hitokoto
        rawAuthor.value = data.from
        retryCount.value = 0  // 重置重试计数器
        error.value = ''

    } catch (err) {
        handleError(err)
    }
}

// 错误处理
const handleError = (err: unknown) => {
    rawPoem.value = '永远相信美好的事情即将发生'
    rawAuthor.value = ''
    error.value = ' '
}


// 定时器管理
let timer: number
const startPolling = () => {
    getData()
    timer = window.setInterval(getData, POLLING_INTERVAL)
}

// 生命周期
onMounted(startPolling)
onUnmounted(() => {
    clearInterval(timer)
})
</script>
<style scoped>
.error-message {
    color: #ff4d4f;
    font-size: 0.9rem;
    margin-top: 0.5rem;
    text-align: center;
}

.box {
    width: 100%;
    padding: 1rem 0;
}

.content-wrapper {
    max-width: 80%;
    margin: 0 auto;
}

.poem-line {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    background-color: red;
    position: fixed;
    z-index: 10000;
}

.poem {
    font-family: '优设鲨鱼菲特健康体';
    font-size: 2rem;
    line-height: 1.4;
    white-space: nowrap;
}

.author::before {
    content: "——";
    position: absolute;
    left: 0;
    color: #999;
    font-weight: 300;
}

.author {
    font-family: '得意黑';
    font-size: 1.6rem;
    color: #666;
    white-space: nowrap;
    position: relative;
    padding-left: 2.5rem;
}

@media (max-width: 768px) {
    .content-wrapper {
        max-width: 95%;
    }

    .poem-line {
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .poem {
        font-size: 1.5rem;
        white-space: normal;
        text-align: center;
    }

    .author {
        font-size: 1.2rem;
        padding-left: 1rem;
    }
}
</style>