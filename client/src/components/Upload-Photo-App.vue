<template>
  <div>
    <input v-if="!isLoading" ref="file" type="file" multiple />
    <PreloaderApp :isLoading="isLoading" />
    <MyButtonApp value="Загрузить" @click="handleFileUpload" />
  </div>
</template>

<script>
import { ref } from "vue";
import { useToast } from "vue-toastification";
import MyButtonApp from "@/components/My-Button-App";
import config from "../config/config.json";
import PreloaderApp from "@/components/Preloader-App";

export default {
  name: "Upload-Photo-App.vue",
  components: {
    PreloaderApp,
    MyButtonApp,
  },
  props: {
    uid: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    const toast = useToast();
    const file = ref(null);
    const isLoading = ref(false);

    const handleFileUpload = async () => {
      isLoading.value = true;
      let photos = file.value.files;
      let data = new FormData();
      for (const image of photos) {
        data.append("files", image);
      }
      let response = await fetch(
          config.serverURL + `/upload-photo?uid=${props.uid}`,
          {
            method: "POST",
            body: data,
          }
      );
      let textResult = await response.json();
      isLoading.value = false;
      emit("close");
      textResult.forEach((result, idx) => {
        toast.info(idx + 1 + "-я фотография- " + result);
      });
    };

    // Возвращаем isLoading вместе с другими значениями
    return {
      handleFileUpload,
      file,
      isLoading,
    };
  },
};
</script>

<style scoped>

</style>
