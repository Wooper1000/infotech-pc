<template>
  <div class="dialog" tabindex="0" v-if="show">
    <div class="content-container">
      <div class="close-button-container">
        <MyButtonApp class="close-button" @click.stop="hideDialog" value="X" />
      </div>
      <div class="content" ref="content" @keydown.esc="hideDialog">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import MyButtonApp from "@/components/My-Button-App.vue";

export default {
  name: "ModalWindowApp",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    MyButtonApp
  },
  methods: {
    hideDialog() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.content {
  max-height: 80vh;
  overflow-y: auto;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
}

.content-container {
  margin: auto;
  background: white;
  border-radius: 12px;
  min-height: 50px;
  min-width: 300px;
}

.close-button-container {
  text-align: right;
}

.close-button {
  display: inline-block;
  margin: 5px 2px;
  font-size: 16px;
}
</style>
