<script setup>
import { ref } from 'vue';
const env = import.meta.env
const users = ref([]);
const error = ref('');

const getConnectedUser = async () => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/connecter`, {
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
</script>


<template>
  <main class="profile">
    <div class="profile__container">
      <h2>Mon profil</h2>
      <ul>
        <li v-for="ligne in users" :key="ligne">
          <p><span>Email:</span> {{ ligne.email }}</p>
          <p><span>Site web:</span> {{ ligne.website }}</p>
        </li>
      </ul>
      <p v-if="error" class="error">{{ error }}</p>
      <router-link to="/profil/modifier" class="modifier-button">Modifier</router-link>
    </div>
  </main>
</template>
  
<style scoped lang="scss">
  .profile {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;

    &__container {
      max-width: 450px;
      width: 100%;
      height: fit-content;
      background: var(--secondary);
      padding: 2.5rem; // 40px
      border-radius: 5px;

      h2 {
        text-align: center;
        margin-bottom: 1.25rem;
      }

      li {
        display: flex;
        flex-direction: column;
        gap: 0.5rem; // 8px

        span {
          font-weight: 500;
        }
      }

      .error {
        color: var(--error);
      }

      .modifier-button {
        display: inline-block;
        padding: 8px 16px;
        background-color: var(--primary);
        text-decoration: none;
        border-radius: 4px;
        text-align: center;
        width: 100%;
        margin-top: 1.25rem;
      }
    }
  }
</style>
 
  
  
  
  
  
  
  