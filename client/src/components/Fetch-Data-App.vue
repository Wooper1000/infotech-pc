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
      this.$store.commit('isLoading', true)
      let promise = await fetch(config.serverURL+'/get-order-list')
      let orders = await promise.json()
      this.orders = orders
      this.$store.commit('setOrders', orders)
      let activeOrders = this.$store.state.statusFilters.filters.active.orders
          //.filter(order=>order['ТекущийСтатус']!=='Не хватает документов')
      let response = await fetch(config.serverURL+'/get-additional-orders-info',{method:'post',body:JSON.stringify(activeOrders),headers:{
          'content-type':'application/json'
        }})
       let activeOrdersWithTickets = await response.json()
       let ordersToUpdate = this.$store.state.statusFilters.filters.inactive.orders.concat(activeOrdersWithTickets)
      console.log(ordersToUpdate)
      this.$store.commit('setOrders', ordersToUpdate)
      this.$store.commit('isLoading',false)
    },
  }
}
</script>

<style scoped>

</style>