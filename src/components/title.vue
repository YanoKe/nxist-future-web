<template>
    <div class="title">
        <img src="/images/logo2.png" alt="">
        
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'logo-name',
})
</script>

<style  scoped>

.title {
    width: 100%;
    height: 100%;
}

img {
    width: 100%;
    height: 100%;
}

.title>img {
    object-fit: cover;
    width: 50vw;
    height: auto;
    display: inline-block;
    border: none;
    border-radius: 10px;
}
</style>