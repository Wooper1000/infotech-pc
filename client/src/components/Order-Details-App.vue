  <template>
  <div class="order-details-container">
  <div class="communication">
    <div class="client-name">
      {{order['Контрагент']}}
    </div>
    <div v-for="(tel,idx) in primaryTelephone" :key="tel" class="telephone">
      <div class="client-telephone"><a :href="'tel:'+tel?.['Телефон']">{{tel?.['Телефон']}}</a></div>
      <div class="call-icon" @click="toggleAcceptToCallDialog(true,idx)"><img  src="../assets/icons/telephone-call.png" alt="telephone"></div>
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
      <div class="description-text" >
        <pre style="white-space: pre-wrap">
        {{order['ДополнительнаяИнформация']}}
          </pre>
      </div>
    </div>
    <div v-if=order.ticket class="description" >
      <h4 class="description-header">Услуги</h4>
      <ol class="description-text">
        <li v-for="service in services" :key="service['УслугаИД']" style="margin-top: 7px">
          <!-- Разделяем строку по пробелам и обрабатываем каждое слово -->
          <span v-for="(word, index) in service.split(' ')" :key="index" style="word-wrap:break-word ">
      <!-- Если это первое слово, делаем его зеленым -->
      <span v-if="index === 0" style="color: green;font-weight: bold;background-color: rgba(211,211,211,0.5)">{{word}}</span>
            <!-- Иначе, просто выводим слово как есть -->
      <span v-else>{{word}}</span>
            <!-- Добавляем пробелы между словами, кроме последнего слова -->
      <span v-if="index !== service.split(' ').length - 1">&nbsp;</span>
    </span>
        </li>
      </ol>
    </div>
  <OrderFeaturesApp :order="order"/>
  </div>
    <ModalWindowApp :show="acceptToCallDialogVisibility" @close="acceptToCallDialogVisibility = false">
      <p>Звоним <strong>{{ order['Контрагент'] }}</strong> ?<br></p>
      <div class="accept-to-call">
        <MyButtonApp @click="makeCall" value="Да" />
        <MyButtonApp @click="toggleAcceptToCallDialog(false)" value="Я передумал" />
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
      acceptToCallDialogVisibility:false,
      indexPhoneToCall:null
    }
  },
  components:{
    ModalWindowApp,
    MyButtonApp,
    OrderFeaturesApp
  },
  methods:{
    async makeCall(){
       let promise =await fetch(config.serverURL+'/make-call?key='+(+(this.order['Номер'].slice(4)+"0"+this.indexPhoneToCall)).toString())
       this.toggleAcceptToCallDialog(false)
       let response = await promise.json()
       console.log(response)
         return response
    },
    toggleAcceptToCallDialog(value,idx=null){
      this.indexPhoneToCall = idx+1
      this.acceptToCallDialogVisibility = value
    },
  },
  computed:{
    primaryTelephone(){
     return this.order['КонтактныеДанные'].filter(tel=>tel['Ключ']==="PRIMARY")
    },
    services(){
      let services = []
      this.order.ticket.Ticket.Services.forEach(service=>{
        if(service['номерУслуги']>=services.length){
          if(!services[service['номерУслуги']-1]){
            services[service['номерУслуги']-1] = ''
            return  services[service['номерУслуги']-1]+=service['ТорговоеПредложение']['Presentation']+` `
          }
          if(service['ДопЗначение']){
            services[service['номерУслуги']-1]+=service['ДопЗначение']+' '
          }
          else services[service['номерУслуги']-1]+=service['Свойство']['Name']+` `
        }
      })
      return services
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
  margin: 5px 5px;
}
</style>
