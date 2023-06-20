<template>
  <div class="container">
    <div class="salary">{{ prevMonthSalary }}</div>
    <div class="appName">Инфотех</div>
    <div class="salary">{{ thisMonthSalary }}</div>
    <img @click="menuVisibility=true" class="menu-icon" src="../assets/icons/menu-button-of-three-horizontal-lines.png"
         alt="menu">
  </div>
  <ModalWindowApp v-model:show="menuVisibility" @close="menuVisibility=!menuVisibility">
    <FiltersListApp v-model:show="menuVisibility"/>
    <div class="input-wrapper">
      <input
          autofocus
          @keydown.enter="getPorts"
          v-model="switchObit"
          type="text"
          inputmode="text"
          placeholder="OBIT номер свитча"
      >
    </div>
    <MyButtonApp value="Проверить" @click="getPorts"/>

    <div v-for="port in ports" :key="port" style="max-width: 500px" ref="portsRefs">
      <hr>

      <div v-if="port.port.status"><b
          :style="{color:port.port.status==='DOWN'?'black':'red'}">
        <div style='text-align:center'>Порт {{ port.port.portNumber }}</div>
        Статус:</b>
        {{ port.port.status }}
      </div>
      <div v-if="port.port.description"><b style="color: red">Описание: </b>{{ port.port.description }}</div>
      <div v-if="port.port.obithome"><b style="color: red">Клиент: </b>{{ port.port.obithome }}</div>
      <pre>{{ port.data }}</pre>
      <hr>
    </div>
    <PreloaderApp :isLoading="loading"/>
  </ModalWindowApp>
</template>


<script>
import ModalWindowApp from "@/components/Modal-Window-App";
import FiltersListApp from "@/components/Filters-List-App";
import getPorts from "@/components/getPorts";
import {ref} from "vue";
import MyButtonApp from "@/components/My-Button-App";
import PreloaderApp from "@/components/Preloader-App";


export default {
  name: 'Header-App',
  components: {
    PreloaderApp,
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
      itemRefs: ref([]),
      loading:false
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
    async getPorts() {

      const inputs = document.querySelectorAll('input');
      inputs.forEach((input) => {
        input.blur();
      });
      if (this.switchObit) {
        this.loading = true;
        this.ports = [];
        await getPorts(this.switchObit, async (data) => {
          this.ports.push(JSON.parse(data));
          await this.$nextTick(); // Ожидаем обновления DOM
          const portsContainer = this.$refs.portsRefs;
          const lastFlatElement = portsContainer[portsContainer.length - 1];
          lastFlatElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
        this.loading=false
      }

    }
  }
}

</script>
<style scoped>
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

.input-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}

input[type="text"] {
  width: 100%;
  font-size: 16px;
  padding: 5px;
  box-sizing: border-box;
}
</style>