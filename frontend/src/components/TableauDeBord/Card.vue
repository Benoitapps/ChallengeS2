<script setup>
import Keys from "./Keys.vue";
import Chart from "./Chart.vue";
import More from "./More.vue";
import {onMounted, ref, watch} from "vue";
import TimeScale from "./TimeScale.vue";


let props = defineProps({
  index: {
    type: Number,
    default: 0
  },
  id: {
    type: String,
    default: ""
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
  },
  data: {
    type: Array,
    default: () => []
  },
  state: {
    type: Boolean,
    default: true
  }
});

defineEmits(["removeCard", "updatePeriod","updateSelectPeriod"]);

const isFavorite = ref(false);

onMounted(() => {
  if(localStorage.getItem(`${props.type}-${props.title}`) !== null) {
    isFavorite.value = true;
  }

  handleLocalStorage();
});

function handleLocalStorage() {
  if(
      isFavorite.value === true &&
      localStorage.getItem(`${props.type}-${props.title}`) === null
  ) {
    localStorage.setItem(`${props.type}-${props.title}`, "true");
  }
  else if(
      isFavorite.value === false &&
      localStorage.getItem(`${props.type}-${props.title}`) === "true"
  )
  {
    localStorage.removeItem(`${props.type}-${props.title}`);
  }
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value;
  handleLocalStorage();
}
</script>

<template>
  <li
      :class="['card', {favorite: isFavorite}]"  v-if="props.state">
  
    <div class="card__head">
      <h2>{{ props.title }}</h2>
      <More
          @toggleFavorite="toggleFavorite()"
          @removeCard="$emit('removeCard', props.title)"
      />
    </div>

    <Keys
        v-if="props.type === 'keys'"
        :number="props.number"
        :list="props.list"
    />

    <Chart
        v-if="props.type === 'charts'"
        :index="props.index"
        :title="props.title"
        :data="props.data"
    />

    <div class="card__footer" v-if="props.periods.length > 0">
      <TimeScale
          :periods="props.periods"
          @updatePeriod="$emit('updatePeriod', [props.title, $event])"
      />
    </div>
  </li>
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
  }
}
</style>