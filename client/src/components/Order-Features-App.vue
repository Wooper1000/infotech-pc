<template>
  <div class="order-features-container">
    <div class="closed-contracts-icon">
      <img class="feature-icon" @click="showClosedContracts=true" src="../assets/icons/closed-contracts.png"
           alt="closed-contracts">
      <img class="feature-icon" @click="showIpConfigurations(!ipConfigurationsVisibility)"
           src="../assets/icons/free-icon-ip-1674968.png" alt="ip-configurations">
      <img class="feature-icon" @click="showUploadPhotoModal(true)"
           src="../assets/icons/photo.png" alt="add-photo">
    </div>
  </div>
  <ModalWindowApp  :show="showClosedContracts" :uid='addressUid' @close="showClosedContracts=!showClosedContracts">
   <ClosedContractsApp :uid='addressUid'/>
  </ModalWindowApp>
  <IPConfigurationsApp v-if="ipConfigurationsVisibility" :order="order"/>
  <UploadPhotoApp v-model:show="uploadPhotoModalVisibility" :uid='ticketUid'/>
</template>
<script>

import ClosedContractsApp from "@/components/Closed-Contracts-App";
import IPConfigurationsApp from "@/components/IP-Configurations-App";
import UploadPhotoApp from "@/components/Upload-Photo-App";
import ModalWindowApp from "@/components/Modal-Window-App";

export default {
  name: "Order-Features-App.vue",
  components: {
    ModalWindowApp,
    ClosedContractsApp,
    IPConfigurationsApp,
    UploadPhotoApp
  },
  props: {
    order: {
      type: Object
    }
  },
  data() {
    return {
      closedContractsVisibility: false,
      ipConfigurationsVisibility: false,
      uploadPhotoModalVisibility: false,
      addressUid: this.order['ФизическийАдрес'].uid,
      ticketUid:this.order.uid,
      showClosedContracts:false
    }
  },
  methods: {
    showIpConfigurations(value) {
      this.ipConfigurationsVisibility = value
    },
    showUploadPhotoModal(value) {
      this.uploadPhotoModalVisibility = value
    }
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