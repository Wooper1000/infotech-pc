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

      //Тестовый запрос

      // fetch(config.serverURL+'/test').then(data=>data.json().then(data=>console.log(
      //     data.filter(el=>{
      //       console.log(el['Наименование'])
      //   el['Код']='396412'
      // }))))

      //Тестовый запрос


      this.$store.commit('isLoading', true)
      let promise = await fetch(config.serverURL+'/get-order-list')
      let orders = await promise.json()
      this.orders = orders
      this.$store.commit('setOrders', orders)
      let activeOrders = this.$store.state.statusFilters.filters.active.orders
      let response = await fetch(config.serverURL+'/get-additional-orders-info',{method:'post',body:JSON.stringify(activeOrders),headers:{
          'content-type':'application/json'
        }})
       let activeOrdersWithTickets = await response.json()
        let ordersToUpdate = this.$store.state.statusFilters.filters.inactive.orders.concat(activeOrdersWithTickets)
      this.$store.commit('setOrders', ordersToUpdate)
      let thisMonthSalaryPromise = await fetch(config.serverURL+'/get-report')
      let currentMonthSalary  = await thisMonthSalaryPromise.json()
      let prevMonthSalaryPromise = await fetch(config.serverURL+'/get-report?variant=Предыдущиймесяц')
      let prevMonthSalary  = await prevMonthSalaryPromise.json()
      this.$store.commit('setSalary',{currentMonthSalary,prevMonthSalary})
      this.$store.commit('isLoading',false)
    },
  }
}
</script>

<style scoped>

</style>