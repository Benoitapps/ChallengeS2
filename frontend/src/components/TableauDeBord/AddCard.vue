<script setup>
const emit = defineEmits(["addCard"]);

const addCard = () => {
  emit("addCard");
};
</script>

<template>
  <button
      class="card__add"
      @click.stop="addCard"
  >
    <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
      <path d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z"/>
    </svg>
  </button>
</template>

<style scoped lang="scss">
.card {
  &__add {
    display: flex;
    justify-content: center;
    align-items: center;
    aspect-ratio: 1/1;
    background: var(--secondary);
    border: var(--border);
    border-radius: 10px;
    cursor: pointer;

    svg {
      width: 100px;

      path {
        fill: var(--text-color);
      }
    }

    &:hover {
      background: var(--accent) !important;
    }
  }
}
</style>