<template>
    <div class="SearchHome">
        <schoolLogo class="SearchHome-round" />
        <schoolTitle class="SearchHome-title"/>
    </div>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'SearchHome',
})
import schoolLogo from '@/components/logo.vue'
import schoolTitle from '@/components/title.vue'
</script>

<style scoped>
:root{
    font-size: 12px;
}
.SearchHome{
    display: flex;
    gap:1rem;
}
.SearchHome-title{

}

</style>