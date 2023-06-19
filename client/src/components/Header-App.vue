<template>
  <div class="container">
    <div class="salary">{{ prevMonthSalary }}</div>
    <div class="appName">Инфотех</div>
    <div class="salary">{{ thisMonthSalary }}</div>
    <img @click="menuVisibility=true" class="menu-icon" src="../assets/icons/menu-button-of-three-horizontal-lines.png"
         alt="menu">
  </div>
  <ModalWindowApp v-model:show=menuVisibility @close="menuVisibility=!menuVisibility">
    <FiltersListApp v-model:show='menuVisibility'/>
    <input style="align-content: center" autofocus @keydown.enter="getPorts" v-model="switchObit" type="text" inputmode="numeric"
           placeholder="OBIT номер свитча">
    <MyButtonApp value="Проверить"  @click="getPorts"/>
      <div v-for="port in ports" :key="port" style="max-width: 500px" ref="itemRefs">
<hr>
         
          <div v-if="port.port.status"><b
              :style="{color:port.port.status==='DOWN'?'black':'red'}"><div style='text-align:center'>Порт {{ port.port.portNumber }}</div> Статус:</b>
            {{ port.port.status }}
          </div>
          <div v-if="port.port.description"><b style="color: red">Описание: </b>{{ port.port.description }}</div>
          <div v-if="port.port.obithome"><b style="color: red">Клиент: </b>{{ port.port.obithome }}</div>
 <pre>{{ port.data }}</pre>
          <hr>
      </div>
  </ModalWindowApp>
</template>


<script>
import ModalWindowApp from "@/components/Modal-Window-App";
import FiltersListApp from "@/components/Filters-List-App";
import getPorts from "@/components/getPorts";
import {ref} from "vue";
import MyButtonApp from "@/components/My-Button-App";

export default {
  name: 'Header-App',
  components: {
    ModalWindowApp,
    FiltersListApp,
    MyButtonApp
  },

  data() {
    return {
      menuVisibility: false,
      portsListVisibility: false,
      ports: ref([]),
      switchObit: null,
      itemRefs : ref([])
    }
  },
  computed: {
    thisMonthSalary() {
      return this.$store.state.salary?.currentMonthSalary
    },
    prevMonthSalary() {
      return this.$store.state.salary?.prevMonthSalary
    }
  },

  methods: {

    getPorts() {
      if (this.switchObit) {
        this.ports = [];
         getPorts(this.switchObit, data => {
          this.ports.push(JSON.parse(data));
           this.$refs?.itemRefs?.[this.$refs?.itemRefs?.length-1]?.scrollIntoView()
        });
      }
    }
  }
}

</script>
<style>
.container {
  align-items: center;
  display: flex;
  margin: 20px auto;
  background-color: lightgrey;
  max-width: 800px;
  height: 50px;
  position: relative;
}

.appName {
  margin-left: 30px;
  display: inline-block;
  font-size: 26px;
  color: darkorange;
  font-weight: bold;
}

.menu-icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  position: relative;
  top: 1px;
  right: 10px;

}

.salary {
  display: inline-block;
  margin: auto;
}
</style>