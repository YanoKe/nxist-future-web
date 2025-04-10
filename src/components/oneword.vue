<template>
    <div class="box">
        <div class="poem">
            {{ poem || '正在加载...' }}
        </div>
        <div class="anthor">{{ anthor || '正在加载...' }}</div>
    </div>
</template>


<script lang="ts" setup>
import { idText } from 'typescript';
import { ref } from 'vue'
import axios from 'axios';
defineOptions({
    name: 'oneWord',
})
import { onMounted, onUnmounted } from 'vue'


const poem = ref('')
const anthor = ref('')

// 定义获取数据的函数
const getData = async () => {
    try {
        const response = await axios.get('https://international.v1.hitokoto.cn/')
        poem.value = response.data.hitokoto
        anthor.value = response.data.from
    } catch (error) {
        console.log('出错啦:', error)
        poem.value = '加载失败，稍后重试...'
        anthor.value = '加载失败，稍后重试...'

    }
}

// 组件挂载时启动定时器
let timer: number
onMounted(() => {
    getData() // 立即获取第一次数据
    timer = window.setInterval(getData, 20000) // 
})

// // 组件卸载时清除定时器
// onUnmounted(() => {
//     clearInterval(timer)
// })

</script>


<style scoped>


</style>
