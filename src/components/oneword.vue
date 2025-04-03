<template>
    <div class="box">
        <ul>
            <p>{{ poem || '正在加载...' }}</p>
        </ul>
    </div>
</template>


<script lang="ts" setup>
import { idText } from 'typescript';
import { ref } from 'vue'
import axios from 'axios';
defineOptions({
    name: 'oneword',
})
import {onMounted, onUnmounted } from 'vue'


const poem = ref('')

// 定义获取数据的函数
const getData = async () => {
    try {
        const response = await axios.get('https://v1.hitokoto.cn/')
        poem.value = response.data.hitokoto
    } catch (error) {
        console.log('出错啦:', error)
        poem.value = '加载失败，稍后重试...'
    }
}

// 组件挂载时启动定时器
let timer: number
onMounted(() => {
    getData() // 立即获取第一次数据
    timer = window.setInterval(getData, 5000) // 每5秒执行
})

// 组件卸载时清除定时器
onUnmounted(() => {
    clearInterval(timer)
})

</script>


<style scoped >
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

}
ul{
    position: fixed;
    left: 200px;
    top: 200px;
}
p{
    color: #fff;
}
</style>
