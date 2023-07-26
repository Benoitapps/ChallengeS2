<script setup>
import { ref, computed } from 'vue';
const env = import.meta.env
const users = ref([]);
const error = ref('');

const userToken = ref('');

let countdownTimer;

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
      const data = await response.json();
      users.value = [data];
      localStorage.setItem('myUser', JSON.stringify(data));
      console.log("data.api_token " + data.api_token);
      userToken.value = data.api_token;
    } else {
      const data = await response.json();
      error.value = data.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};

const showToken = ref(false);

const maskedToken = computed(() => {
  return userToken.value.replace(/./g, '*');
});

let remainingTime = ref(35);

function toggleTokenDisplay() {
  showToken.value = !showToken.value;
  if (showToken.value) {
    remainingTime.value = 35;
    countdown();
  }
  else {
    clearTimeout(countdownTimer);
  }
}

function generateToken(length) {
  return [...Array(length)].map(() => Math.random().toString(36)[2]).join('');
}

function countdown() {
  if (remainingTime.value > 0 && showToken.value) {
    countdownTimer = setTimeout(() => {
      remainingTime.value--;
      countdown();
    }, 1000);
  } else {
    showToken.value = false;
  }
}

function copyToClipboard() {
  if (userToken.value) {
    navigator.clipboard.writeText(userToken.value).then(() => {
      alert("Clé API copiée en presse-papiers !");
    }).catch(() => {
      alert("Impossible de copier la clé API.");
    });
  }
}

const userId = ref('');

const regenerateToken = async () => {
  try {
    const userData = localStorage.getItem('myUser');
    if (userData) {
      const parsedData = JSON.parse(userData);
      userId.value = parsedData.userId;
    }
    const updatedUserToken = {
      oldToken: userToken.value,
      newToken: generateToken(32)
    };

    console.log("updatedUserToken " + updatedUserToken);

    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/userstoken/${userId.value}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(updatedUserToken)
    });
    if (response.ok) {
      console.log("updatedUserToken.newToken " + updatedUserToken.newToken);
      console.log(userToken);
      console.log(updatedUserToken.newToken);
      userToken.value = updatedUserToken.newToken;
      console.log(userToken.value);

      const data = await response.json();
      users.value = [data];
      localStorage.setItem('myUser', JSON.stringify(data));
    } else {
      //const data = await response.json();
      error.value = data.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la mise à jour de l'utilisateur";
    console.log("erreur" + e)
  }
};

getConnectedUser();
</script>


<template>
  <main  class="profile">
    <div class="profile__container"></div>
    <ul>
      <li v-for="ligne in users" :key="ligne">
        <p><span>Email:</span> {{ ligne.email }}</p>
        <p><span>Site web:</span> {{ ligne.website }}</p>
      </li>
    </ul>
    <p v-if="error" class="error">{{ error }}</p>
    <router-link to="/profil/modifier" class="modifier-button">Modifier</router-link>

    <div>
      <h3>Votre clé API :</h3>
      <li v-for="ligne in users" :key="ligne">
        <div v-show="!showToken">
          {{ maskedToken }}
        </div>
        <div v-show="showToken">
          {{ userToken }}
        </div>
      </li>
      <button v-if="showToken" @click="copyToClipboard" :disabled="!userToken">
        Copier la clé API
      </button>
      <div v-show="showToken && remainingTime > 0">
        {{ remainingTime }} secondes avant le masquage automatique
      </div>
      <p v-show="!showToken && remainingTime <= 0">
        La clé a été masquée automatiquement.
      </p>

      <button @click="toggleTokenDisplay">
        {{ showToken ? 'Masquer la clé' : 'Afficher la clé' }}
      </button>
      <br><br>
      <p>Si vous pensez que votre clé API a été divulguée et n'est donc plus sécurisée, merci de générer une nouvelle clé.
      </p>
      <button @click="regenerateToken">
        Générer une nouvelle clé API
      </button>
    </div>

  </main>
</template>
  
<style scoped lang="scss">
  .profile {
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
        gap: 0.5rem; // 8px

        span {
          font-weight: 500;
        }
      }

      .error {
        color: var(--error);
      }

      .modifier-button {
        display: inline-block;
        padding: 8px 16px;
        background-color: var(--primary);
        text-decoration: none;
        border-radius: 4px;
        text-align: center;
        width: 100%;
        margin-top: 1.25rem;
      }
    }
  }
</style>
 
  
  
  
  
  
  
  