<script setup>
import { ref } from 'vue';

defineProps({
  title: { type: String, default: 'Modifier mes KPI' }
});

const openModal = ref(false);

function toggleModal() {
  openModal.value = !openModal.value;
}
</script>

<template>
  <slot
      name="activator"
      :openModal="toggleModal"
  >
    <button @click="toggleModal">Open Modal</button>
  </slot>
  <div v-show="openModal" class="modal">
    <div class="backdrop" @click.self="toggleModal"></div>
    <div class="modal-box">
      <div class="modal-title">
        {{ title }}
        <slot name="close-icon" :closeModal="toggleModal"></slot>
      </div>
      <div class="modal-content">
        <slot>Content</slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  color: black;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Roboto, sans-serif;

  .backdrop {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1001;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1002;
    width: 100%;
    max-width: 500px;
    background-color: var(--background);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    padding: 2.5rem; // 40px
  }

  .modal-title {
    margin-bottom: 1.25rem;
    font-size: 1.5rem;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
