<script setup>
import { ref } from 'vue';
import router from '../../router';
const env = import.meta.env
const email = ref('');
const password = ref('');
const website = ref('');
const error = ref('');

const signup = async () => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        website: website.value
      })
    });

    if (response.ok) {
      router.push('/login');
    } else {
      // erreur
      const data = await response.json();
      error.value = data.error;
    }
  } catch (e) {
    // Gestion des erreurs de connexion
    error.value = "Une erreur s'est produite lors de la connexion";
  }
};
</script>

<template>
  <main class="register">
    <div class="register__container">
      <h2>Inscription</h2>
      <form @submit.prevent="signup"><!-- Permet d'envoyer quand le formaulaire est remplis-->
        <div class="inputs">
          <label for="email">Email:</label>
          <input type="email" id="email" placeholder="jeandupont@gmail.com" v-model="email" required>
        </div>
        <div class="inputs">
          <label for="password">Mot de passe:</label>
          <input type="password" id="password" placeholder="************" v-model="password" required>
        </div>
        <div class="inputs">
          <label for="website">Nom du site web:</label>
          <input type="website" id="website" placeholder="monsiteweb.fr" v-model="website" required>
        </div>
        <button type="submit" class="submit">S'inscrire</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <p>Vous êtes déjà inscrit ? <router-link to="/login" class="basic-link">Connectez-vous</router-link></p>
    </div>
</main>
</template>

<style scoped lang="scss">
.register {
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

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem; // 16px

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

      .submit {
        background: var(--primary);
        border: none;
        border-radius: 4px;
        height: 30px;
        cursor: pointer;

        &:hover {
          background: var(--accent);
        }
      }
    }

    .error {
      color: var(--error);
    }
  }
}
</style>