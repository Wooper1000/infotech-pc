<template>
  <div class="container">
    <div class="salary">{{prevMonthSalary}}</div>
<div class="appName">Инфотех</div>
    <div class="salary">{{thisMonthSalary}}</div>
    <img @click="menuVisibility=true" class="menu-icon" src="../assets/icons/menu-button-of-three-horizontal-lines.png" alt="menu">
  </div>
<ModalWindowApp v-model:show=menuVisibility>
<FiltersListApp v-model:show='menuVisibility'/>
</ModalWindowApp>
</template>


<script>
import ModalWindowApp from "@/components/Modal-Window-App";
import FiltersListApp from "@/components/Filters-List-App";
import config from "@/config/config.json";
export default {
  name :'Header-App',
  components:{
    ModalWindowApp,
    FiltersListApp
  },
  data(){
    return{
      menuVisibility:false,
      thisMonthSalary:null,
      prevMonthSalary:null
    }
  },
 async created() {
   let thisMonthSalaryPromise = await fetch(config.serverURL+'/get-report')
   this.thisMonthSalary  = await thisMonthSalaryPromise.json()
   let prevMonthSalaryPromise = await fetch(config.serverURL+'/get-report?variant=Предыдущиймесяц')
   this.prevMonthSalary  = await prevMonthSalaryPromise.json()
 }
}

</script>
<style>
.container{
  display: flex;
  margin:20px auto;
  background-color: lightgrey;
  max-width: 800px;
  height: 50px;
  text-align: center;
  position: relative;
}
.appName{
  margin:auto;
  font-size: 26px;
  color: darkorange;
  font-weight: bold;
}
.menu-icon{
  width: 40px;
  height: 40px;
  position: absolute;
  right: 10px;
  top: 5px;
}
.salary{
  margin: auto ;
}
</style>