<template>
  <FetchDataApp/>
  <HeaderApp/>
  <OrdersListApp/>
</template>

<script>

import HeaderApp from "@/components/Header-App";
import OrdersListApp from "@/components/Orders-List-App";
import FetchDataApp from "@/components/Fetch-Data-App";


export default {
  name: 'App',
  components: {
    FetchDataApp,
    HeaderApp,
    OrdersListApp
  },
  data(){
    return{
      huita:this.$store.isLoading
    }
  }

}
</script>

<style>

</style>
