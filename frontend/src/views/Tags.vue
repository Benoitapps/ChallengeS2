<script setup>
import { onMounted, inject } from 'vue';

onMounted(() => {
  const sdk = inject('sdk');
  sdk.initTags();
  console.log('Tags.vue is mounted');
});

// on mounted only for this component


</script>

<template>
  <main>
    <h1>Tags</h1>
    <div>
      Créer un nouveau tags
      <div>
        Label du tag
        <input type="text">
      </div>
      <div>
        <div>
          Générer un token pour ce tag 
          <button>Générer</button>
        </div>
        <div>
          <input type="text" placeholder="<button data-tag='4tfjeu24st'>Générer</button>" disabled> 
          <button data-tag="4tfjeu24st">Copier</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">

</style>