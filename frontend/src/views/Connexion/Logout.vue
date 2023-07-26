<script setup>
import { onMounted, ref } from 'vue';
import router from '../../router';
const env = import.meta.env
const users = ref([]);
const error = ref('');



const getDecoonnectedUser = async () => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (response.ok) {
        localStorage.clear();
        
        
    } else {
      const data = await response.json();
      error.value = data.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};

const login = () => {
  // Redirection vers la page de connexion ou une autre page appropriée
  router.push('/login');
};

getDecoonnectedUser();
</script>

<template>
  <main class="logout">
    <div class="logout__container">
      <h2>Vous avez été déconnecté</h2>
      <button @click="login">Se connecter</button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.logout {
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

    button {
      background: var(--primary);
      border: none;
      border-radius: 4px;
      height: 30px;
      cursor: pointer;
      width: 100%;

      &:hover {
        background: var(--accent);
      }
    }
  }
}
</style>