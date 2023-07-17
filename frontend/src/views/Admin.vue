<script>
import { ref } from 'vue';

export default {
  setup() {
    const users = ref([]);
    const error = ref('');
    const userId = ref('');

    const getConnectedUser = async () => {
  try {
    const userData = localStorage.getItem('myUser');;
    if (userData) {
      const parsedData = JSON.parse(userData);

      userId.value = parsedData.userId;

      console.log("mon id est le : "+ userId.value)
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};

    const getUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/notverified', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          users.value = data;
        } else {
          const data = await response.json();
          error.value = data.error;
        }
      } catch (e) {
        error.value = "Une erreur s'est produite lors de la récupération des utilisateurs non verified";
      }
    };

    const verifyUser = async (userId) => {
        console.log(userId);
      try {
        const response = await fetch(`http://localhost:3000/admin/verified/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          getUsers(); // Mettre à jour la liste des utilisateurs après la vérification
        } else {
          const data = await response.json();
          error.value = data.error;
        }
      } catch (e) {
        error.value = "Une erreur s'est produite lors de la vérification de l'utilisateur";
      }
    };

    getUsers(); // Récupérer les utilisateurs au chargement de la page

    return {
      users,
      error,
      verifyUser
    };
  }
};
</script>


<template>
  <main>
    <h2>Utilisateurs :</h2>
    <ul>
      <li v-for="user in users" :key="user._id">
        {{ user.email }}
        <button @click="verifyUser(user.id)">Vérifier</button>
      </li>
    </ul>
    <p v-if="error">{{ error }}</p>
  </main>
  </template>
<style lang="scss">

</style>