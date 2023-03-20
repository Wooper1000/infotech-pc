<template>
<ol v-for="(equip,name) in equipment" :key="name"><b>{{name}}</b>
<!--  <li v-for="equipItem in equip[idx]" :key="equipItem['Заявка']">{{equipItem['СерийныйНомер']}}</li>-->
  <li v-for="(equipItem,idx) in equip" :key="idx">
    <b>Серийный Номер:</b> {{equip[idx]['СерийныйНомер']}} <b>Заявка:</b>{{equip[idx]['Заявка']}}
  </li>
</ol>


</template>

<script>


export default {
  name: "Equipment-App.vue",
  computed : {
    equipment(){
      return this.$store.state.equipment
    }
  }
}

</script>

<style scoped>

</style>