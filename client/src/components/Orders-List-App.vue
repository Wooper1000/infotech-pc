<template>

  <div class="orders-list-container">
    <PreloaderApp v-show="isLoading"/>
    <WorkDayApp
        v-for="day in days"
        :key="day.date"
        :exact-day='day'
    />
  </div>
</template>

<script>
import WorkDayApp from "@/components/Work-Day-App.vue";

import PreloaderApp from "@/components/Preloader-App";



export default {
  name: "Orders-List-App.vue",
  components:  {
    PreloaderApp,
    WorkDayApp
  },
  data() {
    return {

    }
  },
  computed: {
    isLoading(){
      return this.$store.state.isLoading
    },
    filtersStatus(){
     return this.$store.state.statusFilters.currentStatus
    }
    ,
    days() {
      return this.$store.getters.ordersSortedByDays(this.filtersStatus)
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
