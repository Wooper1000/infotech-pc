<template>
  <ModalWindowApp>
    <input ref="file" type='file'  multiple/>
    <MyButtonApp value="Загрузить" @click="handleFileUpload"/>
  </ModalWindowApp>
</template>

<script>
import MyButtonApp from "@/components/My-Button-App";
import ModalWindowApp from "@/components/Modal-Window-App";
import config from "../config/config.json"
import {ref} from "vue"
export default {
  name: "Upload-Photo-App.vue",
  components: {
    ModalWindowApp,
    MyButtonApp
  },
  props:{
    uid:{
      type:Object
    }
  },
  setup(props) {
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
        console.log(response)
    }
    return {
      handleFileUpload,
      file
    }
}
}
</script>

<style scoped>

</style>