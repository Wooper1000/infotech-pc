<template>
  <div class="status-container">
    <div class="quickStatusSelect">
      <div class="quickStatus">
        <MyButtonApp value="Активные" @click="submitFilters('active')"/>
      </div>
      <div class="quickStatus">
        <MyButtonApp value="Выполненные" @click="submitFilters('inactive')"/>
      </div>
    </div>
  </div>
</template>

<script>

import MyButtonApp from "@/components/My-Button-App";

export default {
  name: "Filters-List-App.vue",
  components: {
    MyButtonApp
  },
  data() {
    return {
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