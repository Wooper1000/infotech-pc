    <template>
      <div class="inputList">
        <div class="input-list-item">
          <div class="input-wrapper">
            <input class="input-list-content" autofocus type="number" id="start" v-model="min" @keydown.enter="getClosedContracts">
            <label class="input-list-content" for="start">Начало</label>
          </div>
        </div>
        <div class="input-list-item">
          <div class="input-wrapper">
            <input class="input-list-content" type="number" id="finish" v-model="max" @keydown.enter="getClosedContracts">
            <label class="input-list-content" for="finish">Конец</label>
          </div>
        </div>
      </div>
        <PreloaderApp :isLoading="isLoading"/>
        <MyButtonApp value="Найти" @click="()=>{getClosedContracts();this.useManualSearch=true}"/>
      <div v-show="useManualSearch">
      <div :style="msgStyle(flat)" class="flat-info" v-for="flat in flats" :key="flat.flat" ref="flatContainer">
          <div class="flat-msg">
            {{ flat.msg }}
          </div>
          <div class="flat-status">
            <img class="flat-status-icon" v-if="!flat.isCableAvailable" src="../assets/icons/cross.png" alt="not connected"
                 style="{width: 40px}"/>
            <img class="flat-status-icon" v-if="flat.isCableAvailable" src="../assets/icons/check.png" alt="connected">
            <a v-if="flat.disabled && !flat.isCableAvailable" :href="'tel:'+flat.disabledContractTelephone"><img class="flat-status-icon"  src="../assets/icons/telephone-call.png" alt="need to call"></a>
          </div>
        </div>
        <MyButtonApp value="Скрыть" @click="useManualSearch=false"/>
      </div>
      <div v-if="addressStructure && addressStructure.length">
        <hr>
        <div v-for="entrance in addressStructure" :key="entrance.number" class="entrance">
          <div class="entrance-title" @click="entrance.expanded = !entrance.expanded">
            <div class="flex-container">
              <div class="content">
                <strong>Подъезд</strong> {{ entrance.number }} (Квартиры: {{ entranceFlatsRange(entrance) }})
              </div>
              <button class="search-button" @click.stop="toggleEntrance(entrance); getClosedContractsForRange(entranceFlatsRange(entrance).split('-')[0], entranceFlatsRange(entrance).split('-')[1])">
                <i v-if="!isLoading" style="color: red" class="mdi mdi-database-search-outline"></i>
                <i v-if="isLoading" style="color: red" class="mdi mdi-loading"></i>
              </button>
            </div>
          </div>
          <div v-show="entrance.expanded" v-for="floor in entrance.floors" :key="floor.number" class="floor">
            <div class="floor-title" @click="floor.expanded = !floor.expanded">
              <div class="flex-container">
                <div class="content">
              <strong>Этаж</strong> {{ floor.number }} (Квартиры: {{ floorFlatsRange(floor) }})
                </div>
                <button class="search-button" @click="getClosedContractsForRange(floorFlatsRange(floor).split('-')[0], floorFlatsRange(floor).split('-')[1])">
                  <i v-if="!isLoading" style="color: red" class="mdi mdi-database-search-outline"></i>
                  <i v-if="isLoading" style="color: red" class="mdi mdi-loading"></i>
                </button>
              </div>
            </div>
            <div v-show="floor.expanded" v-for="appart in floor.apparts" :key="appart" class="appart">
              <div class="flex-container">
                <div class="content">
                  <div v-if="flats[appart]">
                    <div :style="msgStyle(flats[appart])" class="flat-info">
                      <div class="flat-msg">
                        {{ flats[appart].msg ? flats[appart].msg : appart }}
                      </div>
                      <div class="flat-status">
                        <i v-if="!flats[appart].isCableAvailable" class="mdi mdi-close-circle-outline" style="font-size: 20px; color: red;"></i>
                        <i v-if="flats[appart].isCableAvailable" class="mdi mdi-check-circle-outline" style="font-size: 20px; color: green;"></i>
                        <a v-if="flats[appart].disabled && !flats[appart].isCableAvailable" :href="'tel:'+flats[appart].disabledContractTelephone">
                          <i class="mdi mdi-phone" style="font-size: 40px; color: blue;"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    {{ appart }}
                  </div>
                </div>
                <button class="search-button" @click.stop="getClosedContractsForRange(appart,appart)">
                  <i v-if="!isLoading" style="color: red" class="mdi mdi-database-search-outline"></i>
                  <i v-if="isLoading" style="color: red" class="mdi mdi-loading"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center" v-if="errorInFormationAddressStructure">
        <hr>Структура дома не загружена</div>
    </template>

<script>
import MyButtonApp from "@/components/My-Button-App";
import config from "../config/config.json"
import PreloaderApp from "@/components/Preloader-App";


export default {
  name: "Closed-Contract-App.vue",
  components: {
    MyButtonApp,
    PreloaderApp
  },
  data() {
    return {
      useManualSearch:false,
      min: null,
      max: null,
      flats: {},
      flatListVisibility: false,
      isLoading:false,
      addressStructure:null,
      errorInFormationAddressStructure: null
    }
  },
  computed: {
        entranceFlatsRange() {
  return entrance => {
    const minFlat = Math.min(...entrance.floors.flatMap(floor => floor.apparts));
    const maxFlat = Math.max(...entrance.floors.flatMap(floor => floor.apparts));
    return `${minFlat}-${maxFlat}`;
  }
},
floorFlatsRange() {
  return floor => {
    const minFlat = Math.min(...floor.apparts);
    const maxFlat = Math.max(...floor.apparts);
    return `${minFlat}-${maxFlat}`;
  }
}
},
  props: {
    uid: {
      type: String
    },
    address:String
  },
  async created() {
    let response = await fetch(config.serverURL+`/get-address-structure?address=${this.uid}`)
    if(response.status===200){
      this.addressStructure = await response.json()
      this.addressStructure.forEach(entrance => {
        entrance.expanded = false;
        entrance.floors.forEach(floor => {
          floor.expanded = false;
        });
      });
    }
    else this.errorInFormationAddressStructure = true
  },
  methods: {
    toggleEntrance(entrance) {
      entrance.expanded = !entrance.expanded;
      entrance.floors.forEach(floor => {
        floor.expanded = entrance.expanded;
      });
    },
    async getClosedContractsForRange(min, max) {
      this.min = min;
      this.max = max;
      await this.getClosedContracts()
    },
    async getClosedContracts() {
      const inputs = document.querySelectorAll('input');
      inputs.forEach((input) => {
        input.blur();
      });
      this.isLoading = true;
this.flats= []
      const response = await fetch(config.serverURL + '/get-contracts-in-range-of-flats' + `?uid=${this.uid}&min=${this.min}&max=${this.max}`);

      if (!response.ok) {
        console.error('Ошибка при получении данных:', response.status);
        this.isLoading = false;
        return;
      }
      const reader = response.body.getReader();
      let receivedData = '';

      const processStream = async () => {
        let condition = 1
        while (condition) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = new TextDecoder().decode(value);
          receivedData += chunk;

          // Проверяем, если в полученных данных есть полные JSON объекты
          while (receivedData.includes('\n')) {
            const index = receivedData.indexOf('\n');
            const jsonData = receivedData.substring(0, index);
            receivedData = receivedData.substring(index + 1);
            const data = JSON.parse(jsonData);
            this.flats = { ...this.flats, [data.flat]: data };
            await this.$nextTick(); // Ожидаем обновления DOM
            const flatContainer = this.$refs.flatContainer;
            if(flatContainer && this.useManualSearch){
              const lastFlatElement = flatContainer[flatContainer.length-1];
              lastFlatElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }

          }
        }
        // Закрываем соединение и завершаем процесс загрузки данных
        reader.releaseLock();
        this.flatListVisibility = true;
        this.isLoading = false;
      };

      await processStream();
    },
    msgStyle(flat) {
      return {
        color:flat['disabled'] ? 'orange' : flat['isActive'] ? 'green':flat.isCableAvailable?'red':'black'
      }
    },
  }
}
</script>

  <style scoped>
  .flex-container {
    display: flex;
    justify-content: space-between;
    align-items: center; /* Чтобы выровнять элементы по вертикали */
  }
  .search-button{
    text-align: right;
  }
  .entrance-title, .floor-title, .appart {
    cursor: pointer;
    padding: 10px;
    margin-top: 5px;
    color: white;
  }

  .floor-title {
    color: white;
  }

  .entrance {
    padding: 10px;
    background-color: #003366;
    margin-top: 5px;
  }

  .floor {
    background: #469df3;
    margin-left: 10px;
    width: 95%;
  }

  .appart {
    background: #6EB3EFFF;
    margin-left: 20px;
    width: 85%;
  }


  .inputList {
    display: flex;
    justify-content: center;
    align-items: center;
  }


  .input-list-item {
    margin: 5px 15px;
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .input-list-content {
    font-size: 16px;
    width: 80%;
    text-align: center;
    margin: 5px auto;
  }
  .flat-info {
    margin: 10px 5px;
  }
  .flat-status-icon {
    width: 20px;
    height: 20px;

  }

  .flat-status {
    float: right;
    display: inline-block;
  }

  .flat-msg {
    display: inline-block;
  }

  </style>
