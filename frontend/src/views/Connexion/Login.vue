
<script>
import { ref } from 'vue';
import router from '../../router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');

    const signup = async () => {
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials : 'include',
          body: JSON.stringify({
            email: email.value,
            password: password.value
          })
        });


        if (response.ok) {
          router.push('/connecter');
        } else {
          // erreur
          const data = await response.json();
          error.value = data.error;
          console.log(error.value);
        }
      } catch (e) {
        // Gestion des erreurs de connexion
        error.value = "Une erreur s'est produite lors de la connexion";
      }
    };

    return {
      email,
      password,
      error,
      signup
    };
  }


};
</script>

<template>
  <main>
  <div>
    <h2>Connexion</h2>
    <form @submit.prevent="signup"><!-- Permet d'envoyer quand le formaulaire est remplis-->
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required>
      </div>
      <div>
        <label for="password">Mot de passe:</label>
        <input type="password" id="password" v-model="password" required>
      </div>
      <button type="submit">Se connecter</button>
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