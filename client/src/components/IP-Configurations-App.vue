<template>
  <div
      class="service-configurations-list service"
      v-for="service in order.configurations"
      :key="service['ServiceName']"
  >
    <div
        v-if="service.ip.length"
    >
      <h5>{{ service['ServiceName'] }}</h5>
      <ul>
        <li>{{ service.ip[0].ip }}</li>
        <li>{{ service.ip[0].mask }}</li>
        <li>{{ service.ip[0]['gw'] }}</li>
      </ul>
    </div>
    <div
        v-if="service['smartLogin']"
    >
      <h5>{{ service['ServiceName'] }}</h5>
      <ul>
        <li>{{ service['smartLogin'] }}</li>
        <li>{{ service['smartPassword'] }}</li>
        <li></li>
      </ul>
    </div>
    <div
        v-if="service['tvip'].length"
    >
      <h5>{{ service['ServiceName'] }}</h5>
      <ul>
        <li>{{ service['tvip'][0].ip }}</li>
        <li>{{ service['tvip'][0].mask }}</li>
        <li>{{ service['tvip'][0]['gw'] }}</li>
      </ul>
    </div>


  </div>
</template>

<script>
export default {
  name: "IP-Configurations-App.vue",
  props: {
    order: Object
  }
}
</script>

<style scoped>
.service {
  display: inline-block;
  text-align: center;
}
</style>