<template>
  <div class="order-features-container">
    <div class="closed-contracts-icon">
      <img class="feature-icon" @click="showClosedContracts2=true" src="../assets/icons/closed-contracts.png"
           alt="closed-contracts">
      <img class="feature-icon" @click="showIpConfigurations(!ipConfigurationsVisibility)"
           src="../assets/icons/free-icon-ip-1674968.png" alt="ip-configurations">
      <img class="feature-icon" @click="uploadPhotoModalVisibility=true"
           src="../assets/icons/photo.png" alt="add-photo">
    </div>
  </div>

    <ModalWindowApp2 v-if="showClosedContracts2" @close="showClosedContracts2=false">
      <ClosedContractsApp :uid='addressUid'/>
    </ModalWindowApp2>



  <IPConfigurationsApp v-if="ipConfigurationsVisibility" :order="order"/>

  <ModalWindowApp :show="uploadPhotoModalVisibility" @close="uploadPhotoModalVisibility=!uploadPhotoModalVisibility">
    <UploadPhotoApp :uid='ticketUid'/>
  </ModalWindowApp>
</template>
<script>

import ClosedContractsApp from "@/components/Closed-Contracts-App";
import IPConfigurationsApp from "@/components/IP-Configurations-App";
import UploadPhotoApp from "@/components/Upload-Photo-App";
import ModalWindowApp from "@/components/Modal-Window-App";
import ModalWindowApp2 from "@/components/Modal-Window-App2";
import {ref} from "vue";

export default {
  name: "Order-Features-App.vue",
  components: {
    ModalWindowApp,
    ClosedContractsApp,
    IPConfigurationsApp,
    UploadPhotoApp,
    ModalWindowApp2
  },
  props: {
    order: {
      type: Object
    }
  },
  setup(){
    const showClosedContracts2 = ref(false)
    return {
      showClosedContracts2
    }
  },
  data() {
    return {
      closedContractsVisibility: false,
      ipConfigurationsVisibility: false,
      uploadPhotoModalVisibility: false,
      addressUid: this.order['ФизическийАдрес'].uid,
      ticketUid: this.order.uid,
      showClosedContracts: false,

    }
  },
  methods: {
    showIpConfigurations(value) {
      this.ipConfigurationsVisibility = value
    },
  }
}
</script>

<style scoped>
.feature-icon {
  width: 40px;
  height: 40px;
}

.order-features-container {
  margin: 0 10px;
  padding: 5px;
}

</style>