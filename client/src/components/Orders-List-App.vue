<template>
  <div class="orders-list-container">
    <PreloaderApp :isLoading="isLoading"/>
    <h3 v-if="!isLoading && days.length" style="text-align: center">Обновлено: {{updated}}</h3>
    <WorkDayApp
        v-for="day in days"
        :key="day.date"
        :exact-day='day'
    />
    <h1 v-if="!isLoading && !days.length" style="text-align: center">Заявок нет</h1>
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

  computed: {
    updated(){
      return this.$store.state.updateTime
    },
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
