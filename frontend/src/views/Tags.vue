<script setup>
import { onMounted, inject,ref } from 'vue';
import TabLine from '../components/Tags/TabLine.vue';
const env = import.meta.env;

let tags = ref([]);
let defaultMessage = ref('Chargement des tags...');

onMounted(async () => {
  const sdk = inject('sdk');
  sdk.initTags();
  console.log('Tags.vue is mounted');

  const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tags`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  let res = await response.json();
  tags.value = res;
  if (res.length == 0) {
    defaultMessage.value = 'Aucun tag trouvé';
  }
});
</script>

<template>
  <main>
    <div class="container-btn">
      <RouterLink to="/tags/create" class="add-tag">
        Ajouter
      </RouterLink>
    </div>

    <table style="width: 100%;">
      <thead>
        <tr>
          <th>Label</th>
          <th>Token</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="tags.length == 0">
          <td colspan="3" class="loading">{{ defaultMessage }}</td>
        </tr>
        <TabLine v-for="(tag, index) in tags" :key="index" :tag="tag" />
      </tbody>
    </table>

    <button data-tag="6c4t71zz">Click me (tag example)</button>
  </main>
</template>

<style scoped>
table{
  width: 100%;
  border-collapse: collapse;
  border-radius: 0.25em;
  overflow: hidden;
  border: 1px solid black;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.15);
}

thead {
  width: 100%;
  border-collapse: collapse;
  border-radius: 7px;
  background-color: var(--primary);
}

thead tr th {
  padding: 10px 0;
}

.container-btn {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.add-tag {
  display: block;
  text-align: center;
  padding: 10px 20px;
  border-radius: 7px;
  background-color: var(--primary);
  color: var(--secondary);
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 10px;
}

.add-tag:hover {
  background-color: var(--primary-hover);
}

.loading {
  text-align: center;
  padding: 10px;
  background-color: #fff;
}
</style>