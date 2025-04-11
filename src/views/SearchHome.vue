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
            <schoolTitle class="title" />
            <SearchBox />

        </el-main>
        <el-footer></el-footer>
    </el-container>

</template>

<script lang="ts" setup>
defineOptions({
    name: 'SearchHome',
})
import { ref } from 'vue'
import schoolLogo from '@/components/SearchHome/logo.vue'
import schoolTitle from '@/components/SearchHome/title.vue'
import user from '@/components/SearchHome/user.vue'
import oneWord from '@/components/SearchHome/oneWord.vue'
import SearchBox from '@/components/SearchHome/SearchBox.vue'

</script>

<style scoped>
.search-home {
    /* height: 100vh; */
    display: flex;
    flex-direction: column;
}

.header {
    height: auto; 
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
    height: 100%;
}





</style>