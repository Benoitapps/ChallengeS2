<script setup>
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
  <div
      class="card__body"
      v-if="props.type === 'keys'"
  >
    <h2>{{ props.title }}</h2>
    <p
        class="numbers"
        v-if="props.number"
    >
      {{ props.number }}
    </p>

    <ul
        class="lists"
        v-if="props.list"
    >
      <li
          v-for="(item, index) in props.list"
          :key="index"
          class="lists__item"
      >
        <p class="lists__item__label">{{ item.label }}</p>
        <p class="lists__item__value">{{ item.value }}</p>
      </li>
    </ul>
  </div>

  <div
      class="card__body"
      v-if="props.type === 'charts'"
  >
    <h2>{{ props.title }}</h2>
    Graphique
  </div>

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

  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    gap: 1.25rem; // 20px

    h2 {
      color: var(--text-color);
    }

    .numbers {
      font-size: 3.75rem; // 60px
      line-height: 3.438rem; // 55px
      font-weight: 700;
      color: var(--text-color);
    }

    .lists {
      display: flex;
      flex-direction: column;
      gap: 8px;

      &__item {
        display: flex;
        justify-content: space-between;
        width: 100%;

        &__label {
          font-size: 1.25rem; // 20px
          font-weight: 500;
          color: var(--text-color);
        }

        &__value {
          font-size: 1.25rem; // 20px
          font-weight: 700;
          color: var(--text-color);
        }
      }
    }
  }

  &.primary {
    background-color: var(--primary) !important;

    .card__body {
      h2 {
        color: var(--text-color) !important;
      }

      .numbers {
        color: var(--text-color) !important;
      }
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