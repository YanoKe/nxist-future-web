<template>
    <div  class="title">
        <img src="/images/logo2.png" alt="">
        <div  class="text">藏书书目查询</div>
        
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'logo-name',
})
</script>

<style  scoped>

.title {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.title>img {
    object-fit: cover;
    width: 18rem;
    height: auto;
    display: inline-block;

}
.text{
    white-space: nowrap;
}


</style>