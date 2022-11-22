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
      let response = await fetch(config.serverURL+'/get-additional-orders-info',{method:'post',body:JSON.stringify(orders),headers:{
          'content-type':'application/json'
        }})
      let ordersWithTickets = await response.json()
      this.$store.commit('setOrders', ordersWithTickets)
      this.$store.commit('isLoading',false)
    },
  }
}
</script>

<style scoped>

</style>