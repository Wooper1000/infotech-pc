<template>
  <div class="dialog"
       tabindex="0"
       @click="hideDialog"
       v-if="show"
  >
    <div class="content-container" @click.stop>
      <MyButtonApp class="close-button" autofocus @keydown.esc="hideDialog" @click="hideDialog" value="X"/>
      <div class="content">
      <slot>
      </slot>
      </div>
    </div>
  </div>
</template>

<script>
import MyButtonApp from "@/components/My-Button-App";

export default {
  name: "Modal-Window-App.vue",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    timer:{
      type:Number,
      default: null
    }
  },
  data(){
    return{
      showModal : this.show
    }
  },
  created() {
    if(this.timer){
      setTimeout(()=>this.showModal=false,this.timer)
    }
  },
  methods:{
    hideDialog(){
      this.$emit('update:show',false)
    }
  },
  components:{
    MyButtonApp
  }
}
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
  max-height: 1000px;
  overflow: auto;
}

.content-container{
  margin: auto;
  background: white;
  border-radius: 12px;
  padding: 10px;
  min-height: 50px;
  min-width: 300px;
}
.close-button{
  display: block;
  float: right;
  margin: 5px 2px;
  font-size: 16px;
}
</style>