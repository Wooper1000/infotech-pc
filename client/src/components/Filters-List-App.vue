<template>
  <div class="status-container">
    <div class="quickStatusSelect">
      <div class="quickStatus">
        <MyButtonApp value="Активные" @click="submitFilters('active')"/>
      </div>
      <div class="quickStatus">
        <MyButtonApp value="Выполненные" @click="submitFilters('closed')"/>
      </div>
    </div>
    <div class="status" v-for="status in statusList" :key="status">
      <input type="checkbox" :id="status" :value="status" name="status" v-model="quickStatusList.checked">
      <label for="status">{{ status }}</label>
    </div>
    <MyButtonApp @click='submitFilters("checked")' value="Применить"/>
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
      quickStatus:this.$store.state.statusFilters.quickStatus,
      statusList: ['Не хватает документов', 'Работы выполнены', 'В работе', 'Собрана', 'На сборку', 'В очереди','Отрисовка Visio'],
      quickStatusList: {
        active: ['Не хватает документов', 'В работе', 'Собрана', 'На сборку', 'В очереди'],
        closed: ['Работы выполнены','Отрисовка Visio'],
        checked:this.$store.state.statusFilters.filters
      },

    }
  },
  methods:{
    submitFilters(status){
      this.$emit('update:show',false)
      this.$store.commit('setStatusFilters',{
        quickStatus:status,
        filters:this.quickStatusList[status],
      })
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