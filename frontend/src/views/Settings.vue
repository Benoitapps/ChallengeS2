<script setup>
import { onMounted, inject, onUnmounted } from 'vue';

onMounted(() => {
  const sdk = inject('sdk');
  sdk.trackMouseClick();

  onUnmounted(() => {
    sdk.stopTrackingMouseClick();
  });
});

</script>

<template>
  <main>
    <h1>Paramètres</h1>
  </main>
</template>

<style scoped lang="scss">

</style>