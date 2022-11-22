<template>
  <ModalWindowApp>
    <ModalWindowApp v-if="show" :timer="3000"> Суп из тысячи залуп </ModalWindowApp>
    <div class="inputList">
      <div class="input-list-item">
        <input class='input-list-content' type="number" id="start" v-model="min" @keydown.enter="getClosedContracts">
        <label class='input-list-content' for="start">Начало</label>
      </div>
      <div class="input-list-item">
        <input class='input-list-content' type="number" id="finish" v-model="max" @keydown.enter="getClosedContracts">
        <label class='input-list-content' for="finish">Конец</label>
      </div>
    </div>
    <PreloaderApp :isLoading="isLoading"/>
    <MyButtonApp value="Найти" @click="getClosedContracts"/>
    <div :style="msgStyle(flat)" class="flat-info" v-for="flat in flats" :key="flat.flat">
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
    <div @click="show=true">Показать залупу</div>
  </ModalWindowApp>
</template>

<script>
import MyButtonApp from "@/components/My-Button-App";
import ModalWindowApp from "@/components/Modal-Window-App";
import config from "../config/config.json"
import PreloaderApp from "@/components/Preloader-App";


export default {
  name: "Closed-Contract-App.vue",
  components: {
    ModalWindowApp,
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
      show:false
    }
  },
  props: {
    uid: {
      type: Object
    }
  },
  methods: {
    async getClosedContracts() {
      this.isLoading = true
      let promise = await fetch(config.serverURL + '/get-contracts-in-range-of-flats' + `?uid=${this.uid}&min=${this.min}&max=${this.max}`)
      this.flats = await promise.json()
      this.flatListVisibility = true
      this.isLoading = false

    },
    msgStyle(flat) {
      return {
        color:flat['disabled'] ? 'orange' : flat['isActive'] ? 'green':flat.isCableAvailable?'red':'gray'
      }
    }
  },
  computed: {}
}
</script>

<style scoped>
.input-list-item {
  display: inline-block;
  width: 33%;
  margin: 5px 15px;
}

.input-list-content {
  font-size: 16px;
  width: 100%;
  display: block;
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