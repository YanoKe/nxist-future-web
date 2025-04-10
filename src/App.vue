<template>
    <div class="app-bg">
        <div class="app-layout">
        <router-view/>
        </div>
    </div>
</template>

<script lang="ts" setup>


defineOptions({
    name: "App",
})
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}



.app-layout {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
    padding: 20px;
    max-width: 1650px;
    margin: 0 auto;
}


</style>
