<script setup>
import Keys from "./Keys.vue";
import Chart from "./Chart.vue";
import More from "./More.vue";
import {onMounted, ref} from "vue";

let props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  favorite: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: "keys"
  },
  title: {
    type: String,
    default: ""
  },
  number: {
    type: String,
    default: ""
  },
  list: {
    type: Array,
    default: () => []
  },
  periods: {
    type: Array,
    default: () => []
  }
});

let isFavorite = ref(props.favorite);

onMounted(() => {
  if(localStorage.getItem(`favorite${+props.index}`) === "true") {
    isFavorite.value = true;
  }
  else {
    isFavorite.value = false;
  }

  handleLocalStorage();
});

function handleLocalStorage() {
  if(
      isFavorite.value &&
      localStorage.getItem(`favorite${+props.index}`) === null
  ) {
    localStorage.setItem(`favorite${+props.index}`, true);
  }
  else if(
      !isFavorite.value &&
      localStorage.getItem(`favorite${+props.index}`) !== null
  )
  {
    localStorage.removeItem(`favorite${+props.index}`);
  }
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;

  handleLocalStorage();
}
</script>

<template>
<div :class="['card', {favorite: isFavorite}]">
  <div class="card__head">
    <h2>{{ props.title }}</h2>
    <More @toggleFavorite="toggleFavorite($event)"/>
  </div>

  <Keys
      v-if="props.type === 'keys'"
      :title="props.title"
      :number="props.number"
      :list="props.list"
  />

  <Chart
      v-if="props.type === 'charts'"
      :title="props.title"
  />

  <div
      class="card__footer"
      v-if="props.periods.length > 0"
  >
    <select class="card__footer__period">
      <option
          v-for="period in props.periods"
          :key="period"
          :value="period.value"
      >
        {{ period.label }}
      </option>
    </select>
  </div>
</div>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--secondary);
  aspect-ratio: 1/1;
  border-radius: 10px;
  padding: 1.25rem; // 20px

  &.favorite {
    background-color: var(--primary) !important;
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 20px;

    h2 {
      color: var(--text-color);
    }
  }

  &__footer {
    padding-top: 1.25rem; // 20px
    width: 100%;

    &__period {
      font-size: 1rem; // 16px
    }
  }
}
</style>