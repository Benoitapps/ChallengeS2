<script setup>
import { onMounted, inject, onUnmounted } from 'vue';

onMounted(() => {
  const sdk = inject('sdk');
  sdk.initTracker();

  onUnmounted(() => {
    sdk.stopTracker();
  });
});
</script>

<template>
  <main>
    <h1>Graphiques</h1>
  </main>
</template>

<style scoped lang="scss">

</style>