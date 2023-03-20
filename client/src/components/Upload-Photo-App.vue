<template>

    <input ref="file" type='file'  multiple/>
    <MyButtonApp value="Загрузить" @click="handleFileUpload"/>

</template>

<script>
import MyButtonApp from "@/components/My-Button-App";

import config from "../config/config.json"
import {ref} from "vue"
import {useToast} from "vue-toastification"
export default {
  name: "Upload-Photo-App.vue",
  components: {
    MyButtonApp
  },
  props:{
    uid:{
      type:Object
    }
  },
  setup(props) {
    const toast = useToast();
    const file = ref(null)
    const handleFileUpload = async() => {
      let photos = file.value.files
      let data = new FormData()
      for (const image of photos) {
        data.append('files', image);
      }
        let response = await fetch(config.serverURL+`/upload-photo?uid=${props.uid}`,{
          method:'POST',
          body:data
        })
 let textResult = await response.json()
      textResult.forEach((result,idx)=>{toast.info(idx+1 + '-я фотография- '+result)})
      this.$emit('close')
    }
    return {
      handleFileUpload,
      file,
    }
}
}
</script>

<style scoped>

</style>