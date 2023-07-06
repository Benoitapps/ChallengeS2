<script>
import { ref } from 'vue';

export default {
  setup() {
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

    getConnectedUser();

    return {
      users,
      error
    };
  }
};
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
 
  
  
  
  
  
  
  