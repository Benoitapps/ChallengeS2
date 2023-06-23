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

const emits = defineEmits(["removeCard"]);

let isFavorite = ref(false);

onMounted(() => {
  if(localStorage.getItem(props.title) !== null) {
    isFavorite.value = true;
  }

  handleLocalStorage();
});

function handleLocalStorage() {
  if(
      isFavorite.value === true &&
      localStorage.getItem(props.title) === null
  ) {
    localStorage.setItem(props.title, "true");
  }
  else if(
      isFavorite.value === false &&
      localStorage.getItem(props.title) === "true"
  )
  {
    localStorage.removeItem(props.title);
  }
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;

  handleLocalStorage();
}

function removeCard() {
  emits("removeCard", props.index);
}
</script>

<template>
  <div
      :class="['card', {favorite: isFavorite}]"
  >
    <div class="card__head">
      <h2>{{ props.title }}</h2>
      <More @toggleFavorite="toggleFavorite($event)" @removeCard="removeCard($event)"/>
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