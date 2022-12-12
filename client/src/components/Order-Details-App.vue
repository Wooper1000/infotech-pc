  <template>
  <div class="order-details-container">
  <div class="communication">
    <div class="client-name">
      {{order['Контрагент']}}
    </div>
    <div class="telephone">
      <div class="client-telephone"><a :href="'tel:'+order['КонтактныеДанные'][0]?.['Телефон']">{{order['КонтактныеДанные'][0]?.['Телефон']}}</a></div>
      <div class="call-icon" @click="toggleAcceptToCallDialog(true)"><img  src="../assets/icons/telephone-call.png" alt="telephone"></div>
    </div>
  </div>
    <div class="creator-and-type-of-work">
      <div class="creator">
        {{ order['Ответственный'].Name }}
      </div>
      <div class="type-of-work">
        {{ order['ТипРабот'] }}
      </div>
    </div>
    <div class="description">
      <h3 class="description-header">Описание Работ</h3>
      <div class="description-text">
        {{order['ДополнительнаяИнформация']}}
      </div>
    </div>
    <div v-if=order.ticket class="description">
      <h4 class="description-header">Услуги</h4>
        <ol class="description-text" >
          <li v-for="service in order.ticket['Services']" :key="service['УслугаИД']">
            {{service['УслугаНаименование']}}
          </li>
        </ol>
    </div>
  <OrderFeaturesApp :order="order"/>
  </div>
  <ModalWindowApp v-model:show="acceptToCallDialogVisibility">
    <h2>Звоним {{ order['КонтактныеДанные'][0]?.['Телефон'] }} ?</h2>
    <div class="accept-to-call">
      <MyButtonApp @click="makeCall" value="Да"/>
      <MyButtonApp @click="toggleAcceptToCallDialog(false)" value="Я передумал"/>
    </div>
    </ModalWindowApp>
</template>

<script>
import ModalWindowApp from "@/components/Modal-Window-App";
import MyButtonApp from "@/components/My-Button-App";
import OrderFeaturesApp from "@/components/Order-Features-App";
import config from '../config/config.json'

export default {
  name: "Order-Detail-App.vue",
  props:{
    order:Object
  },
  data(){
    return{
      acceptToCallDialogVisibility:false
    }
  },
  components:{
    ModalWindowApp,
    MyButtonApp,
    OrderFeaturesApp
  },
  methods:{
    async makeCall(){
      let promise = await fetch(config.serverURL+'/make-call?key='+(+(this.order['Номер'].slice(4) + "01")).toString())
      this.toggleAcceptToCallDialog(false)
      let response = await promise.json()
      console.log(response)
        return response
    },
    toggleAcceptToCallDialog(value){
      this.acceptToCallDialogVisibility = value
    }
  }
}
</script>

<style scoped>
.accept-to-call *{
  width: 50%;
  display: inline-block;
}
.communication{
  padding: 5px 10px;
}
.communication *{
  display: inline-block;
}
.client-name{
  width: 50%;
  font-weight: bold;
  text-align: center;
  }
.telephone{
  font-size:20px;
}
.telephone{
  width: 50%;
}
.client-telephone{
  width: 75%;
}
.call-icon{
  width: 25%;
  text-align: center;
}
.call-icon img{
  width: 24px;
  height: 24px;
  vertical-align: middle;
}
.creator-and-type-of-work *{
  display: inline-block;
  margin: 10px 10px;
}
.description-header{
  text-align: center;
  margin: 5px auto;
}
.description-text{
  text-align: center;
  font-style: italic ;
  margin: 5px auto;
}
</style>