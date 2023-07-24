<script>
import { ref } from 'vue';
import router from '../../router';
const env = import.meta.env

export default {
  setup() {
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
            //router.push('/login');
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

    return {
      users,
      error,
      login
    };
  }
};
</script>

<template>
    <main>
    <div>
      <h2>Vous avez été déconnecté</h2>
      <button @click="login">Se connecter</button>
    </div>
</main>
  </template>

 
  
  
  
  
  
  
  