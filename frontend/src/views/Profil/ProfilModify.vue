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
      users.value = [parsedData];
      userId.value = parsedData.userId;
      updatedEmail.value = parsedData.email;
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
  <main class="profile-modify">
    <div class="profile-modify__container">
      <h2>Modifier mon profil</h2>
      <ul>
        <li v-for="ligne in users" :key="ligne">
          <div class="inputs">
            <label>Email:</label>
            <input v-model="updatedEmail" />
          </div>
          <div class="inputs">
            <label>Website:</label>
            <input v-model="updatedWebsite" />
          </div>
        </li>
      </ul>
      <p v-if="error">{{ error }}</p>
      <button @click="updateUser" class="modifier-button">Modifier</button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.profile-modify {
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
      gap: 1rem;

      .inputs {
        display: flex;
        flex-direction: column;
        gap: 2px;

        label {
          font-weight: 500;
        }

        input {
          border: var(--border);
          height: 30px;
          border-radius: 4px;
          padding: 0 0.625rem; // 10px

          &:focus {
            outline: 2px solid var(--primary);
            border: none;
          }
        }
      }
    }

    .error {
      color: var(--error);
    }

    .modifier-button {
      display: inline-block;
      border: none;
      padding: 8px 16px;
      background-color: var(--primary);
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
      width: 100%;
      margin-top: 1.25rem;
      color: var(--secondary);
      font-weight: 700;
    }
  }
}
</style>
