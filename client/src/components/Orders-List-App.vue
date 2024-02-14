<template>
  <div class="orders-list-container">
    <PreloaderApp :isLoading="isLoading"/>
    <h3 :class="{ updating: isUpdating }" v-if="!isLoading && days.length" style="text-align: center">Обновлено: {{updated}} <button @click="update" v-if="!isLoading"><strong v-if="!isUpdating">o</strong><PreloaderApp :isLoading="isUpdating"/></button></h3>
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
    WorkDayApp,
  },
  data(){
    return{
    isUpdating:false
    }
  },
  methods:{
  update(){
    this.isUpdating = true
    this.$store.state.socket.send("update");
    this.$store.state.socket.onmessage = (event)=>{
      let orders = JSON.parse(event.data).orders
      this.$store.commit('setOrders', orders);
      this.$store.commit('setUpdateTime',JSON.parse(event.data).updateTime)
      this.isUpdating=false
    }
  }
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
.updating {
  transition: opacity 0.5s ease-in-out; /* Анимация для свойства opacity */
  opacity: 0.7; /* Прозрачность во время анимации */
}
</style>
