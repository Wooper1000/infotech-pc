<template>
  <div class="container">
    <div class="salary">{{ prevMonthSalary }}
      <PreloaderApp :isLoading="!prevMonthSalary"/>
    </div>
    <div class="appName">Инфотех</div>
    <div class="salary">{{ thisMonthSalary }}
      <PreloaderApp :isLoading="!thisMonthSalary"/>
    </div>
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

    <div :style="{background:getBackgroundColor(port.status)}" v-show="ports" v-for="port in ports" :key="port" style="max-width: 500px" ref="portsRefs">
      <hr>
      <div style="display: flex; justify-content: space-between;">
        <span style="text-align: center;">{{ port.port }}</span>
        <b :style="{ color: getStatusColor(port.status) }">{{ port.status }}</b>
      </div>

      <div> <b>{{ port?.description }}</b></div>
      <div> <b>{{ port.fvno?.[0]['Адрес'] }}</b></div>
      <div :style="{color:port.binding === 'Активен'?'black':'red'}"> {{ port?.obithome }},<b style="color: black">{{port?.binding}}</b></div>
      <button :disabled="!port.cabdiag" @click="togglePre(port)">КабДиаг</button>
      <pre v-if="port.showPre">{{ port.cabdiag }}</pre>
      <hr>
    </div>
    <PreloaderApp :isLoading="loading"/>
  </ModalWindowApp>
</template>


<script>
import ModalWindowApp from "@/components/Modal-Window-App";
import FiltersListApp from "@/components/Filters-List-App";
// import getPorts from "@/components/getPorts";
import {ref} from "vue";
import MyButtonApp from "@/components/My-Button-App";
import PreloaderApp from "@/components/Preloader-App";
import config from "@/config/config.json";


export default {
  name: 'Header-App',
  components: {
    PreloaderApp,
    ModalWindowApp,
    FiltersListApp,
    MyButtonApp
  },
  mounted() {
    console.log(this.$store.state.salary?.currentMonthSalary)
  },
  data() {
    return {
      menuVisibility: false,
      portsListVisibility: false,
      ports: ref([]),
      switchObit: null,
      itemRefs: ref([]),
      loading: false,
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
    togglePre(port) {
      console.log(port)
            // Переключение состояния отображения <pre> для конкретного порта
      port.showPre = !port.showPre;
    },
    getStatusColor(status) {
      switch (status) {
        case 'DOWN':
          return 'black';
        case '1G':
          return 'green';
        case '100M':
          return 'green';
        case '10M':
          return 'green';
        case '10G':
          return 'green';
        case 'BLOCKED':
          return 'gray';
        default:
          return 'black'; // Цвет по умолчанию, если статус неизвестен
      }
    },
    getBackgroundColor(status) {
      switch (status) {
        case '1G':
          return 'rgba(0, 255, 0, 0.05)';
        case '100M':
          return 'rgba(0, 255, 0, 0.05)';
        case '10M':
          return 'rgba(0, 255, 0, 0.05)';
        case '10G':
          return 'rgba(0, 255, 0, 0.05)';

      }
    },
    async getPorts() {
      // const inputs = document.querySelectorAll('input');
      // inputs.forEach((input) => {
      //   input.blur();
      // });
      if (this.switchObit) {
        this.ports=[]
        this.loading = true;
        let response = await fetch(config.serverURL + '/get-ports' + `?obit=${this.switchObit}`);
        const reader = response.body.getReader();
        let a = true
        while (a) {
          const {done, value} = await reader.read();
          if (done) {
            break;
          }
          let ports = JSON.parse(new TextDecoder().decode(value))

          this.ports = Object.keys(ports).map(port => {
            return {...ports[port], port}
          }).sort((port1, port2) => {
            const num1 = parseInt(port1.port.split('/').pop(), 10);
            const num2 = parseInt(port2.port.split('/').pop(), 10);
            return num1 - num2;
          });
        }
      }

      // await getPorts(this.switchObit, async (data) => {
      //   this.ports.push(JSON.parse(data));
      //   await this.$nextTick(); // Ожидаем обновления DOM
      //   const portsContainer = this.$refs.portsRefs;
      //   const lastFlatElement = portsContainer[portsContainer.length - 1];
      //   lastFlatElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      // });
      this.loading = false
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
