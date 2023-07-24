<script setup>
import { ref, computed } from 'vue';

const users = ref([]);
const error = ref('');

const getConnectedUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/connecter', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      users.value = [data];
      localStorage.setItem('myUser', JSON.stringify(data));
    } else {
      const data = await response.json();
      error.value = data.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};

const userToken = ref('your-user-token'); // Remplacez cette valeur par le token réel de l'utilisateur
const showToken = ref(false);

const maskedToken = computed(() => {
  // Masquer le token par des points
  return userToken.value.replace(/./g, '*');
});

function toggleTokenDisplay() {
  showToken.value = !showToken.value;
}

getConnectedUser();
</script>


<template>
  <main>
    <h2>Utilisateur connecté :</h2>
    <ul>
      <li v-for="ligne in users" :key="ligne">
        <div>{{ ligne.email }}</div>
        <div>{{ ligne.website }}</div>
      </li>
    </ul>
    <p v-if="error">{{ error }}</p>
    <router-link to="/profil/modifier" class="modifier-button">Modifier</router-link>

    <div>
      <h3>Votre clé API :</h3>
      <li v-for="ligne in users" :key="ligne">
        <div v-show="!showToken">
          {{ maskedToken }}
        </div>
        <div v-show="showToken">
          {{ userToken=ligne.api_token }}
        </div>
      </li>

      <button @click="toggleTokenDisplay">
        {{ showToken ? 'Masquer le token' : 'Afficher le token' }}
      </button>
    </div>

  </main>
</template>
  
<style scoped lang="scss">
.modifier-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}
</style>