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
.logo {
    width: 10rem;
    height: 8rem;

}


img {
    width: 100%;
    height: 100%;
}

.logo>img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    display: inline-block;

}
</style>