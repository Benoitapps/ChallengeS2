<script>
import { ref } from 'vue';
import router from '../../router';
const env = import.meta.env
export default {
  setup() {
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
          console.log("stocke donne");
          const data = await response.json();
          users.value = [data.email];
          localStorage.setItem('myUser', JSON.stringify(data));
          router.push('/');
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
    <li v-for="user in users" :key="user">{{ user }}</li>
  </ul>
  <p v-if="error">{{ error.value }}</p>
</main>
</template>

<style lang="scss">

</style>