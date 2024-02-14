<template>
  <div class="order-container">
    <div class="order-header">
      <div class="visit-slot">
        <span style="color: orangered">{{order.idx+1}}</span>
        <div class="visit-date">
          {{new Date(order['ПланДатаНачала']).toLocaleDateString()}}
        </div>
        <div class="visit-time">
          с {{new Date(order['ПланВремяНачала']).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}}
          до
          {{new Date(order['ПланВремяОкончания']).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}}
        </div>
      </div>
      <div class="order-info" >
        <div class="order-status"
             :class="{ 'no-document': order['ТекущийСтатус']==='Не хватает документов' }" @click="showComments"
        >
          {{ order['ТекущийСтатус'] }}
          <br>
         <span :style = "order['ТорговаяМарка']['Name']==='МТС' ? 'color:red' : 'color:green;font-weight:bold'"> {{order['ТорговаяМарка']['Name'] === 'МТС' ? order['ТорговаяМарка']['Name'] +'💩':order['ТорговаяМарка']['Name']}}</span>
        </div>
        <div class="contract-number">
          {{order['ТорговаяМарка']['Name']==='МТС'? order['ДополнительнаяИнформация'].match(/\*(ЛС):\s(\d+-\d+-\d+)/)[2] : order['НомерДоговора'] }}
          <br>
          <span @click="openBarcode">{{order['ТорговаяМарка']['Name']==='МТС'?order['ДополнительнаяИнформация'].match(/1-\d{12}/)[0]:order['Номер'].replace(/^0+/, '')}}</span>
        </div>
      </div>
    </div>
    <hr>
    <div class="order-main" @click="showDetails(true)">
      <div class="order-address">
        {{ order['Адрес'] }}
      </div>
      <div class="is-order-was-connected">
        <i
            v-if="order['АдресБылПодключенРанее']"
           class="is-connected-icon"><img src="../assets/icons/check.png" alt="Was Connected"></i>
        <i v-if="!order['АдресБылПодключенРанее']" class="is-connected-icon"><img src="../assets/icons/cross.png" alt="Was NOT Connected"></i>
      </div>
    </div>
    <MyButtonApp  @click="showDetails(true)" v-if="!detailsVisibility" value="Подробнее"/>
    <OrderDetailsApp :order="order" v-if="detailsVisibility"/>
    <MyButtonApp  @click="showDetails(false)" v-if="detailsVisibility" value="скрыть"/>
  </div>
  <ModalWindowApp :show="historyModalVisibility" @close="historyModalVisibility=!historyModalVisibility" >
    <ol>
      <li v-for="note in orderHistory" :key="note['Период']" style="margin: 10px">
       <strong v-if="note"></strong> {{note['Комментарий']}}
      </li>
    </ol>
  </ModalWindowApp>
  <ModalWindowApp :show="showBarcodeModal" @close="showBarcodeModal=false">
    <img :src="barcodeData" alt="Barcode"/>
    <MyButtonApp @click="showBarcodeModal=false" value="Закрыть"/>
  </ModalWindowApp>
</template>

<script>
import OrderDetailsApp from "@/components/Order-Details-App";
import MyButtonApp from "@/components/My-Button-App";
import {api} from "@/api";
import JsBarcode from 'jsbarcode'

import ModalWindowApp from "@/components/Modal-Window-App";
export default {
  name: "Order-app.vue",
  components: {
    ModalWindowApp,
    OrderDetailsApp,
    MyButtonApp,
  },
  props:{
    order:Object,
  },
  data(){
    return{
      detailsVisibility:false,
      orderHistory:null,
      historyModalVisibility:false,
      barcodeData:null,
      showBarcodeModal:false
    }
  },
  methods:{
    openBarcode(){
      const svg = document.createElement('svg');
      JsBarcode(svg, `ORD-23010${this.order['Номер'].replace(/^0+/, '')}`, {
        format: "CODE128",
        displayValue: false,
        height: 300,
        margin: 0,
        fontSize: 0
      });
      this.barcodeData = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg.outerHTML);
      this.showBarcodeModal = true;
    },
    showDetails(value){
this.detailsVisibility = value
    },
    async showComments(){
      let history = await api.getJobHistory(this.order['Номер'])
      this.orderHistory = history
      this.historyModalVisibility = true
    }
  },
  computed:{
    isLoading(){
      return this.$store.state.isLoading
    }

  }

}
</script>

<style scoped>
.no-document{
  color: red;
  font-weight: bold;
}
.order-container {
  margin: 20px auto;
  min-height: 120px;
  border: black solid 2px;
}

.order-header {
  padding: 5px 10px;
}

.order-header * {
  display: inline-block;
}

.visit-slot {
  font-weight: bold;
  width: 50%;
  text-align: center;
}

.visit-slot * {
  margin: 0 10px
}

.order-info {
  display: inline-table;
  width: 50%;
}
.order-status {
  text-align: center;
  width: 50%;
  display: table-cell;
  vertical-align: middle
}
.contract-number {
  width: 50%;
  text-align: center;
  display: table-cell;
  vertical-align: middle
}

.order-main {
  padding: 5px 10px;
}

.order-address {
  width: 75%;
  margin: 0 auto;
  display: inline-block;
}

.is-order-was-connected {
  width: 25%;
  text-align: center;
  display: inline-block;
}

.is-connected-icon img {
  width: 30px;
  height: 30px;
  display: inline-block;
}

.show-details-button {
  display: block;
  margin: 10px auto;
  background-color: rgba(239, 177, 2, 0.99);
  border: black solid 1px;
  font-weight: bold;
  font-family: sans-serif;
  border-radius: 10px;
}

</style>
