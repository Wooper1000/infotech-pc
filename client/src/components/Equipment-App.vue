<template>
  <div>
    <div class="equipment-list">
      <h2>Обит оборудование</h2>
      <ul>
        <li v-for="category in otherCategories" :key="category">
          <span @click="toggleCategory(category)">
            {{ category }} (<strong>{{ equipmentList[category].length }} шт.</strong>)
          </span>
          <ul v-show="openCategories.includes(category)">
            <li v-for="(item, index) in equipmentList[category]" :key="index">
              <span @click="showDetails(item)">
                {{ item.Presentation }} ({{ item.СерийныйНомер }}, {{ item.Заявка }})
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="equipment-list">
      <h2>Оборудование МТС</h2>
      <ul>
        <li v-for="category in mtsCategories" :key="category">
          <span @click="toggleCategory(category)">
            {{ category }} (<strong>{{ equipmentList[category].length }} шт.</strong>)
          </span>
          <ul v-show="openCategories.includes(category)">
            <li v-for="(item, index) in equipmentList[category]" :key="index">
              <span @click="showDetails(item)">
                {{ item.Presentation }} ({{ item.СерийныйНомер }}, {{ item.Заявка }})
              </span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "EquipmentApp",
  data() {
    return {
      openCategories: [],
      selectedItem: null,
    };
  },
  computed: {
    equipmentList() {
      return this.$store.state.equipment;
    },
    mtsCategories() {
      return Object.keys(this.equipmentList).filter((category) =>
          category.toLowerCase().includes("мтс")
      );
    },
    otherCategories() {
      return Object.keys(this.equipmentList).filter(
          (category) => !category.toLowerCase().includes("мтс")
      );
    },
  },
  methods: {
    toggleCategory(category) {
      if (this.openCategories.includes(category)) {
        this.openCategories = this.openCategories.filter(
            (c) => c !== category
        );
      } else {
        this.openCategories.push(category);
      }
    },
    showDetails(item) {
      if (this.selectedItem === item) {
        this.selectedItem = null;
      } else {
        this.selectedItem = item;
      }
    },
  },
};
</script>

<style scoped>
.equipment-list {
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #333;
}

ul {
  list-style-type: none;
  padding-left: 10px;
  cursor: pointer;
}

span {
  cursor: pointer;
}

li {
  margin-bottom: 5px;
}

ul ul {
  margin-top: 5px;
  margin-left: 15px;
}

strong {
  font-weight: bold;
}
</style>
