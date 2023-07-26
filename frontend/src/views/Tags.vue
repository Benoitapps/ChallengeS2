<script setup>
import {onMounted, inject, ref, onUnmounted} from 'vue';
import TabLine from '../components/Tags/TabLine.vue';
import TabLineTunnel from '../components/Tunnels/TabLineTunnel.vue';
const env = import.meta.env;

let tags = ref([]);
let tunnels = ref([]);
let defaultMessageTag = ref('Chargement des tags...');
let defaultMessageTunnel = ref('Chargement des tunnels...');

const sdk = inject('sdk');
onMounted(async () => {
  // ? Get tags
  const responseTag = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tags`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  let resTag = await responseTag.json();
  tags.value = resTag;
  if (resTag.length == 0) {
    defaultMessageTag.value = 'Aucun tag trouvé';
  }

  // ? Get tunnels
  const responseTunnel = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/tunnels`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  });
  let resTunnel = await responseTunnel.json();
  tunnels.value = resTunnel;
  if (resTunnel.length == 0) {
    defaultMessageTunnel.value = 'Aucun tunnel trouvé';
  }

  sdk.initTracker();
});

onUnmounted(() => {
  sdk.stopTracker();
});
</script>

<template>
  <main>
    <div class="container-btn">
      <h3>
        Tags
      </h3>
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
          <td colspan="3" class="loading">{{ defaultMessageTag }}</td>
        </tr>
        <TabLine v-for="(tag, index) in tags" :key="index" :tag="tag" v-else/>
      </tbody>
    </table>

    <button v-tracker:click.mouseover="'2ocraesx'">Click me (tag example)</button>


    <div class="container-btn">
      <h3>
        Tunnels de conversion
      </h3>
      <RouterLink to="/tunnels/create" class="add-tunnel">
        Ajouter
      </RouterLink>
    </div>
    <table style="width: 100%;">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="tunnels.length == 0">
          <td colspan="3" class="loading">{{ defaultMessageTunnel }}</td>
        </tr>
        <TabLineTunnel v-for="(tunnel, index) in tunnels" :key="index" :tunnel="tunnel" v-else/>
      </tbody>
    </table>
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
  justify-content: space-between;
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

.add-tunnel {
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

.add-tunnel:hover {
  background-color: var(--primary-hover);
}

.loading {
  text-align: center;
  padding: 10px;
  background-color: #fff;
}
</style>