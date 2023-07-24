
<script>
import { ref } from 'vue';
import router from '../../router';
const env = import.meta.env

export default {
  setup() {
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
          error.value = data.message;
        }
      } catch (e) {
        // Gestion des erreurs de connexion
        error.value = "Une erreur s'est produite lors de la connexion";
      }
    };

    return {
      email,
      password,
      website,
      error,
      signup
    };
  }
};
</script>

<template>
  <main>
  <div>
    <h2>Inscription</h2>
    <form @submit.prevent="signup"><!-- Permet d'envoyer quand le formaulaire est remplis-->
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <div>
        <label for="website">Nom du site web:</label>
        <input type="website" id="website" v-model="website" required>
      </div>
      <button type="submit">S'inscrire</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</main>
</template>

<style scoped>
.error {
  color: red;
}
</style>