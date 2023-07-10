<script setup>
import { onMounted, inject, onUnmounted } from 'vue';

onMounted(() => {
  const sdk = inject('sdk');
  sdk.trackMouseMovement();

  onUnmounted(() => {
    sdk.stopTrackingMouseMovement();
  });
});

</script>

<template>
  <main>
    <h1>Heatmap</h1>
  </main>
</template>

<style scoped lang="scss">

</style>