<template>
  <div class="status-container">
    <div class="quickStatusSelect">
      <div class="quickStatus">
        <MyButtonApp value="Активные" @click="submitFilters('active')"/>
      </div>
      <div class="quickStatus">
        <MyButtonApp value="Закрытые" @click="submitFilters('inactive')"/>
      </div>
    </div>
    <div>
      <MyButtonApp value="Оборудование" @click="equipmentVisibility=true"/>
    </div>
    <ModalWindowApp v-model:show=equipmentVisibility @close="equipmentVisibility=!equipmentVisibility">
<EquipmentApp/>
    </ModalWindowApp>
  </div>

</template>

<script>

import MyButtonApp from "@/components/My-Button-App";
import ModalWindowApp from "@/components/Modal-Window-App";
import EquipmentApp from "@/components/Equipment-App";

export default {
  name: "Filters-List-App.vue",
  components: {
    MyButtonApp,
    ModalWindowApp,
    EquipmentApp
  },
  data() {
    return {
      equipmentVisibility:false
         }
  },
  methods:{
    submitFilters(status){
      this.$emit('update:show',false)
      this.$store.commit('setFiltersStatus',status)
    }
  }
}
</script>

<style scoped>
.quickStatus {
  display: inline-block;
  margin: 15px 15px;
}

.quickStatusSelect {
  text-align: center;
}

.status {
  margin: 10px auto;
}
</style>