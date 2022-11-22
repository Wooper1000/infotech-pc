<template>
  <img v-if="isLoading" class="preloader-img" src="../assets/icons/spinner.svg" alt="preloader spinner">
</template>

<script>


export default {
  name: "Preloader-App.vue",
 props:{
    isLoading:Boolean
 }
}
</script>

<style scoped>
.preloader-img{
  margin: 0 auto;
  display: block;
  height: 40px;
  width: 40px;
}
</style>