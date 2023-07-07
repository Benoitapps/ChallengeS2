<script>
import { ref } from 'vue';
import router from '../../router';

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
  <p v-if="error">{{ error }}</p>
</main>
</template>

<style lang="scss">

</style>