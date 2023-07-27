<script setup>
import {ref, computed, onMounted, inject, onUnmounted} from 'vue';
const env = import.meta.env
const users = ref([]);
const error = ref('');
import router from '../../router';


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
      console.log("data.apiToken " + data.apiToken);
      userToken.value = data.apiToken;
    } else {
      const data = await response.json();
      error.value = data.error;
      router.push('/login');
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
      getConnectedUser();
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
  <main class="profile">
    <div class="profile__container">
      <h2>Mon profil</h2>
      <ul>
        <li v-for="ligne in users" :key="ligne">
          <p><span>Email:</span> {{ ligne.email }}</p>
          <p><span>Site web:</span> {{ ligne.website }}</p>
        </li>
      </ul>
      <p v-if="error" class="error">{{ error }}</p>
      <router-link to="/profil/modifier" class="modifier-button">Modifier</router-link>
    </div>
    <div class="profile__container">
      <h2>Votre clé API :</h2>
      <div class="show-key">
        <ul>
          <li v-for="ligne in users" :key="ligne">
            <p v-show="!showToken">
              {{ maskedToken }}
            </p>
            <p v-show="showToken">
              {{ userToken }}
            </p>
          </li>
        </ul>
        <button @click="toggleTokenDisplay">
          <svg v-if="!showToken" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
            <path d="M480.118-330Q551-330 600.5-379.618q49.5-49.617 49.5-120.5Q650-571 600.382-620.5q-49.617-49.5-120.5-49.5Q409-670 359.5-620.382q-49.5 49.617-49.5 120.5Q310-429 359.618-379.5q49.617 49.5 120.5 49.5Zm-.353-58Q433-388 400.5-420.735q-32.5-32.736-32.5-79.5Q368-547 400.735-579.5q32.736-32.5 79.5-32.5Q527-612 559.5-579.265q32.5 32.736 32.5 79.5Q592-453 559.265-420.5q-32.736 32.5-79.5 32.5ZM480-200q-146 0-264-83T40-500q58-134 176-217t264-83q146 0 264 83t176 217q-58 134-176 217t-264 83Zm0-300Zm-.169 240Q601-260 702.5-325.5 804-391 857-500q-53-109-154.331-174.5-101.332-65.5-222.5-65.5Q359-740 257.5-674.5 156-609 102-500q54 109 155.331 174.5 101.332 65.5 222.5 65.5Z"/>
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
            <path d="m629-419-44-44q26-71-27-118t-115-24l-44-44q17-11 38-16t43-5q71 0 120.5 49.5T650-500q0 22-5.5 43.5T629-419Zm129 129-40-40q49-36 85.5-80.5T857-500q-50-111-150-175.5T490-740q-42 0-86 8t-69 19l-46-47q35-16 89.5-28T485-800q143 0 261.5 81.5T920-500q-26 64-67 117t-95 93Zm58 226L648-229q-35 14-79 21.5t-89 7.5q-146 0-265-81.5T40-500q20-52 55.5-101.5T182-696L56-822l42-43 757 757-39 44ZM223-654q-37 27-71.5 71T102-500q51 111 153.5 175.5T488-260q33 0 65-4t48-12l-64-64q-11 5-27 7.5t-30 2.5q-70 0-120-49t-50-121q0-15 2.5-30t7.5-27l-97-97Zm305 142Zm-116 58Z"/>
          </svg>
        </button>
      </div>

      <div class="regenerate-key">
        <button v-if="showToken" @click="copyToClipboard" :disabled="!userToken">
          Copier la clé API
        </button>
        <p v-show="showToken && remainingTime > 0" class="timer">
          {{ remainingTime }} secondes avant le masquage automatique
        </p>
        <p v-show="!showToken && remainingTime <= 0">
          La clé a été masquée automatiquement.
        </p>
        <p>Si vous pensez que votre clé API a été divulguée et n'est donc plus sécurisée, merci de générer une nouvelle clé.
        </p>
        <button @click="regenerateToken">
          Générer une nouvelle clé API
        </button>
      </div>
    </div>
  </main>
</template>
  
<style scoped lang="scss">
.profile {
  display: flex;
  justify-content: center;
  gap: 3rem; // 48px
  flex-wrap: wrap;
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

    h3 {
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
      font-weight: 700;
      color: var(--secondary);

      &:hover {
        background-color: var(--accent);
      }
    }

    button:not(.show-key button) {
      display: inline-block;
      padding: 8px 16px;
      background-color: var(--primary);
      text-decoration: none;
      border-radius: 4px;
      text-align: center;
      border: none;
      font-size: 1rem;
      width: 100%;
      margin-top: 1.25rem;
      font-weight: 700;
      color: var(--secondary);

      &:hover {
        background-color: var(--accent);
      }
    }

    .show-key {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        background: none;
        border: none;

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    .regenerate-key {
      p:not(.timer) {
        margin-top: 1rem; // 16px
      }
    }

    .timer {
      color: var(--error);
      margin-top: 0.5rem; // 8px
    }
  }
}
</style>