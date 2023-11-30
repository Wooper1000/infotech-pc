<template>
  <div v-if="isLoading" class="lds-circle"><div></div></div>
</template>

<script>
export default {
  name: "Preloader-App.vue",
  props: {
    isLoading: Boolean
  }
}
</script>

<style scoped>
.lds-circle {
  transform: translateZ(1px);
}
.lds-circle > div {
  margin: 0 auto;
  display: block;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background: orange;
  animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

@keyframes lds-circle {
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
}
</style>

