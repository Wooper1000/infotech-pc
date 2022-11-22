<template>
  <img :src="src" :alt="alt" :style="style">
</template>

<script>
export default {
  name: "Cross-Icon-App.vue",
  props:{
    src:String,
    alt:String,
    style:Object
  }
}
</script>

<style scoped>

</style>