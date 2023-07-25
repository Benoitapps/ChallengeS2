<script setup>
import { ref } from 'vue';
const env = import.meta.env

    const users = ref([]);
    const error = ref('');
    const updatedEmail = ref('');
    const updatedWebsite = ref('');
    const userId = ref('');

    const getConnectedUser = async () => {
      try {
        const userData = localStorage.getItem('myUser');
        if (userData) {
          const parsedData = JSON.parse(userData);
          //console.log(parsedData);
          users.value = [parsedData];
          userId.value = parsedData.userId;
          //console.log("monID"+ userId.value);
          updatedEmail.value = parsedData.email;
          //console.log("monEMAIL"+ updatedEmail.value);
          updatedWebsite.value = parsedData.website;
        }
      } catch (error) {
        error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
      }
    };

    const updateUser = async () => {
      try {
        const updatedUser = {
          email: updatedEmail.value,
          website: updatedWebsite.value
        };

        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/users/${userId.value}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Utilisateur mis à jour :', data);
          localStorage.setItem('myUser', JSON.stringify(data));
          users.value = [data];
        } else {
          const data = await response.json();
          error.value = data.error;
        }
      } catch (e) {
        error.value = "Une erreur s'est produite lors de la mise à jour de l'utilisateur";
      }
    };

    getConnectedUser();
</script>

<template>
  <main>
    <h2>Utilisateur connecté :</h2>
    <ul>
      <li v-for="ligne in users" :key="ligne">
        <div>
          <label>Email:</label>
          <input v-model="updatedEmail" />
        </div>
        <div>
          <label>Website:</label>
          <input v-model="updatedWebsite" />
        </div>
      </li>
    </ul>
    <p v-if="error">{{ error }}</p>
    <button @click="updateUser" class="modifier-button">Modifier</button>
  </main>
</template>

<style scoped lang="scss">
.modifier-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: #4caf50;
}
</style>
