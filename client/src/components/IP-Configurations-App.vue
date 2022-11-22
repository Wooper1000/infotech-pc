<template>
<div
    class="service-configurations-list"
    v-for="service in order.configurations"
    :key="service['ServiceName']"
>
<div
    class="internet-ip"
    v-if="service.ip.length"
>
  <ul>
    <li>{{service.ip[0].ip}}</li>
    <li>{{service.ip[0].mask}}</li>
    <li>{{service.ip[0]['gw']}}</li>
  </ul>
</div>
</div>
</template>

<script>
export default {
  name: "IP-Configurations-App.vue",
  props:{
    order:Object
  }
}
</script>

<style scoped>

</style>