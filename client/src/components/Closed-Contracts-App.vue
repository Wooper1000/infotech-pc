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
        <MyButtonApp value="Найти" @click="getClosedContracts"/>
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
      min: null,
      max: null,
      flats: [],
      flatListVisibility: false,
      isLoading:false,

    }
  },
  props: {
    uid: {
      type: Object
    }
  },
  methods: {
    // async getClosedContracts() {
    //   this.isLoading = true
    //   let promise = await fetch(config.serverURL + '/get-contracts-in-range-of-flats' + `?uid=${this.uid}&min=${this.min}&max=${this.max}`)
    //   this.flats = await promise.json()
    //   this.flatListVisibility = true
    //   this.isLoading = false
    // },

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
            this.flats.push(data);
            await this.$nextTick(); // Ожидаем обновления DOM
            const flatContainer = this.$refs.flatContainer;
            const lastFlatElement = flatContainer[flatContainer.length-1];
            lastFlatElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
        color:flat['disabled'] ? 'orange' : flat['isActive'] ? 'green':flat.isCableAvailable?'red':'gray'
      }
    },
  }
}
</script>

  <style scoped>
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