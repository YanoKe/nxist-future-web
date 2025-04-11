<template>
    <div class="logo">
        <img src="/images/logo.png" alt="">
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'schoolLogo',
})
</script>

<style scoped>

img {
    width: 100%;
    height: 100%;
}

.logo>img {
    width: 6rem;
    height: auto;
    display: inline-block;

}
</style>