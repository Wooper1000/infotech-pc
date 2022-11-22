<template>
  <div class="orders-list-container">
    <WorkDayApp
        v-for="day in days"
        :key="day.date"
        :exact-day='day'
    />
  </div>
</template>

<script>
import WorkDayApp from "@/components/Work-Day-App.vue";



export default {
  name: "Orders-List-App.vue",
  components: {
    WorkDayApp
  },
  data() {
    return {
      orders:[]
    }
  },
  computed: {
    days() {
      return this.$store.getters.ordersSortedByDays
    }
  }
}
</script>

<style scoped>
.orders-list-container {
  max-width: 800px;
  margin: 0 auto;
  display: block;
}
</style>