<script setup>
import Keys from "./Keys.vue";
import Chart from "./Chart.vue";

const props = defineProps({
  primary: {
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
</script>

<template>
<div :class="['card', {primary: props.primary}]">
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
  overflow-y: auto;
  padding: 1.25rem; // 20px

  &.primary {
    background-color: var(--primary) !important;
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