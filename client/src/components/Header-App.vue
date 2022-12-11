<template>
  <div class="container">
    <div class="salary">{{ prevMonthSalary }}</div>
    <div class="appName">Инфотех</div>
    <div class="salary">{{ thisMonthSalary }}</div>
    <img @click="menuVisibility=true" class="menu-icon" src="../assets/icons/menu-button-of-three-horizontal-lines.png"
         alt="menu">
  </div>
  <ModalWindowApp v-model:show=menuVisibility>
    <FiltersListApp v-model:show='menuVisibility'/>
  </ModalWindowApp>
</template>


<script>
import ModalWindowApp from "@/components/Modal-Window-App";
import FiltersListApp from "@/components/Filters-List-App";

export default {
  name: 'Header-App',
  components: {
    ModalWindowApp,
    FiltersListApp
  },
  data() {
    return {
      menuVisibility: false,
    }
  },
  computed: {
    thisMonthSalary() {
      return this.$store.state.salary?.currentMonthSalary
    },
    prevMonthSalary() {
      return this.$store.state.salary?.prevMonthSalary
    }
  }
}

</script>
<style>
.container {
  align-items: center;
  display: flex;
  margin: 20px auto;
  background-color: lightgrey;
  max-width: 800px;
  height: 50px;
  position: relative;
}

.appName {
  margin-left: 30px;
 display: inline-block;
  font-size: 26px;
  color: darkorange;
  font-weight: bold;
}

.menu-icon {
  display:inline-block;
  width: 40px;
  height: 40px;
  position:relative;
  top: 1px;
  right: 10px;

}

.salary {
  display: inline-block;
  margin: auto;
}
</style>