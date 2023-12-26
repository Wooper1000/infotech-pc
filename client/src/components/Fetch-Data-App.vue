<script>
import config from '../config/config.json'

export default {
  name: "Fetch-Data-App.vue",
  data() {
    return {
      orders:[],
    }
  },
   created() {
     this.$store.commit('isLoading', true);
    this.socket = new WebSocket(`${config.websocketURL}/get-orders-list`)
     this.$store.commit('setSocket',this.socket)
     this.socket.onopen = ()=>{
       console.log('WebSocket соеденение налажено')
       this.socket.send('refresh')
     }
     this.socket.onmessage = (event)=>{
      let orders = JSON.parse(event.data).orders
       this.$store.commit('setOrders', orders);
        this.$store.commit('setUpdateTime',JSON.parse(event.data).updateTime)
       this.$store.commit('isLoading', false);
     }
     this.socket.onerror = function() {
       console.log('Socket оборвался')
     };
    this.fetchOrders()
  },
  methods: {
    async fetchOrders() {

      // Запускаем параллельные запросы на получение заявок, оборудования и зарплат

      let equipmentListPromise = fetch(config.serverURL + '/get-equipment-list');
      let currentMonthSalaryPromise = fetch(config.serverURL + '/get-report');
      let prevMonthSalaryPromise = fetch(config.serverURL + '/get-report?variant=Предыдущиймесяц');


      equipmentListPromise.then(async res => {
        let equipmentList = await res.json();
        this.$store.commit('setEquipment', equipmentList);
      });

      currentMonthSalaryPromise.then(async res => {
        let currentMonthSalaryData = await res.json();
        let currentSalaries = this.$store.state.salary;
        this.$store.commit('setSalary', {
          ...currentSalaries,
          currentMonthSalary: currentMonthSalaryData
        });
      });

      prevMonthSalaryPromise.then(async res => {
        let prevMonthSalaryData = await res.json();
        let currentSalaries = this.$store.state.salary;
        this.$store.commit('setSalary', {
          ...currentSalaries,
          prevMonthSalary: prevMonthSalaryData
        });
      });

      // После выполнения всех запросов устанавливаем флаг isLoading в false
      Promise.all([equipmentListPromise, currentMonthSalaryPromise, prevMonthSalaryPromise])
          .then(() => {

          });
    },
  }


}
</script>

<style scoped>

</style>
