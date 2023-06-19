<script setup>
const props = defineProps({
  primary: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ""
  }
});
</script>

<template>
  <div
      class="card__body"
  >
    <h2>{{ props.title }}</h2>
    Graphique
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

    h2 {
      color: var(--text-color);
    }
  }
}
</style>