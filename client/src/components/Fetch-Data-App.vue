<script>
import config from '../config/config.json'
export default {
  name: "Fetch-Data-App.vue",
  data() {
    return {
      orders:[],
    }
  },
   async created() {
    this.orders = await this.fetchOrders()
  },
  methods: {
    async fetchOrders() {
      this.$store.commit('isLoading', true);

      // Запускаем параллельные запросы на получение заявок, оборудования и зарплат
      let ordersPromise = fetch(config.serverURL + '/get-order-list');
      let equipmentListPromise = fetch(config.serverURL + '/get-equipment-list');
      let currentMonthSalaryPromise = fetch(config.serverURL + '/get-report');
      let prevMonthSalaryPromise = fetch(config.serverURL + '/get-report?variant=Предыдущиймесяц');

      // Обрабатываем результаты
      ordersPromise.then(async res => {
        let orders = await res.json();
        this.orders = orders;
        this.$store.commit('setOrders', orders);

        // Только после получения списка заявок, отправляем запрос на получение дополнительной информации
        let additionalOrdersInfo = await fetch(config.serverURL + '/get-additional-orders-info', {
          method: 'post',
          body: JSON.stringify(this.$store.state.statusFilters.filters.active.orders),
          headers: {
            'content-type': 'application/json'
          }
        }).then(res => res.json());

        let activeOrdersWithTickets = additionalOrdersInfo;
        let ordersToUpdate = this.$store.state.statusFilters.filters.inactive.orders.concat(activeOrdersWithTickets);
        this.$store.commit('setOrders', ordersToUpdate);
      });

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
      Promise.all([ordersPromise, equipmentListPromise, currentMonthSalaryPromise, prevMonthSalaryPromise])
          .then(() => {
            this.$store.commit('isLoading', false);
          });
    },
  }


}
</script>

<style scoped>

</style>
