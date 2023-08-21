<template>
  <h2 class="date" @click="hideWorkDay">{{ new Date(exactDay.date).toLocaleDateString()}}</h2>
  <div v-if="workDayVisibility">
    <OrderApp
        v-for="(order,idx) in exactDay.orders"
        :key="order['Номер']"
        :order="{...order,idx:idx}"
    />
  </div>
</template>
<script>
import OrderApp from "@/components/Order-App";
export default {
  name: "Work-Day-App.vue",
  components:{
    OrderApp
  },
  data(){
    return{
      workDayVisibility : undefined
    }
  },
  props:{
    exactDay:Object
  },
  methods:{
    hideWorkDay(){
      this.workDayVisibility=!this.workDayVisibility
    }
  },
  created(){
    this.workDayVisibility = this.exactDay.orders
        .map(order=>{
          return !(order['ТекущийСтатус']==='Не хватает документов')
        }).includes(true)

  }
}
</script>

<style scoped>
.date{
  text-align: center;
}
</style>
