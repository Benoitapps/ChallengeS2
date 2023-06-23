<script setup>
const props = defineProps({
  number: {
    type: String,
    default: ""
  },
  list: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div
      class="card__body"
  >
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
</template>

<style scoped lang="scss">
.card  {
  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: auto;
    gap: 1.25rem; // 20px

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
      flex: 1;
      overflow-y: auto;

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
}
</style>