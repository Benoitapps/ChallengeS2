<script setup>
const props = defineProps({
  favorite: {
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
  }
}
</style>