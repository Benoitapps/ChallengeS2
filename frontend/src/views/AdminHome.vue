<script>
import { ref } from 'vue';
const env = import.meta.env
import router from '../router';


export default {
  setup() {
    const usersNotVerified = ref([]);
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
    }else{
      router.push('/login');
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};

const getConnectedUserAfter = async () => {
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
          
          localStorage.setItem('myUser', JSON.stringify(data));
        } else {
          const data = await response.json();
          error.value = data.error;
        }
      } catch (e) {
        error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
      }
    };


    const getUsersNotVerified = async () => {
      try {
        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/admin/notverified`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          usersNotVerified.value = data;
        } else {
          const data = await response.json();
          error.value = data.error;
        }
      } catch (e) {
        error.value = "Une erreur s'est produite lors de la récupération des utilisateurs non verified";
      }
    };

    const getUsers = async () => {
      try {
        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/admin/alluser`, {
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

    const verifyUser = async (theuserId) => {
        console.log(theuserId);
      try {
        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/admin/verified/${theuserId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

        if (response.ok) {
            getUsersNotVerified(); // Mettre à jour la liste des utilisateurs après la vérification
            getUsers();
        } else {
          const data = await response.json();
          error.value = data.error;
        }
      } catch (e) {
        error.value = "Une erreur s'est produite lors de la vérification de l'utilisateur";
      }
    };

    const takeToken = async (tokenid,website) => {
        console.log(tokenid);
      try {
        const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/admin/taketoken/${userId.value}/${tokenid}/${website}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        console.log(response);
        if (response.ok) {
          const data = await response.json();
            console.log(data) // Mettre à jour la liste des utilisateurs après la vérification
            getConnectedUserAfter();
            
            localStorage.setItem('myUser', JSON.stringify());


        } else {
          const data = await response.json();
          error.value = data.error;
        }
      } catch (e) {
        error.value = "Une erreur s'est produite lors de la vérification de l'utilisateur";
      }
    };

    getConnectedUser();
    getUsersNotVerified(); // Récupérer les utilisateurs au chargement de la page
    getUsers();

    return {
      usersNotVerified,
      error,
      users,
      verifyUser,
      takeToken
    };
  }
};
</script>


<template>
  <main class="admin">
    <div class="admin__container">
      <div class="notverified">
        <div class="title">
          <h2>Utilisateurs non vérifiés :</h2>
        </div>
        <ul>
          <li v-for="user in usersNotVerified" :key="user._id">
            <div class="line" :class="{ 'selected': user.selected }">
              <p class="email">
                {{ user.email }}
              </p>
              <div class="buttons">
                <button @click="verifyUser(user.id)">Vérifier</button>
              </div>
            </div>
          </li>
        </ul>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
      <div class="verified">
        <div class="title">
          <h2>Utilisateurs vérifiés :</h2>
        </div>
        <div>
          <ul>
            <li v-for="user in users" :key="user._id">
              <div class="line" :class="{ 'selected': user.selected }">
                <p class="email">
                  {{ user.email }}
                </p>
                <div class="buttons">
                  <button @click="takeToken(user.id, user.website)">Prendre le contrôle</button>
                </div>
              </div>
            </li>
          </ul>
          <p v-if="error" class="error">{{ error }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.admin {
  &__container {
    display: flex;
    justify-content: space-around;

    .buttons {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        background: var(--primary);
        border: none;
        padding: 0.5rem 1rem; // 8px 16px
        border-radius: 4px;
        font-weight: 700;
        color: var(--secondary);

        &:hover {
          background: var(--accent);
        }
      }
    }

    .notverified {
      background-color: white;
      padding: 2em;
      width: 40%;
    }

    .verified {
      background-color: white;
      padding: 2em;
      width: 45%;
    }

    .line {
      display: flex;
      padding: 5px;
      border-radius: 10px;
      justify-content: space-between;
    }

    .title {
      margin-bottom: 15px;
    }


    .selected {
      /* Ajoutez le style de surlignage ici */
      background-color: yellow;
    }

    .error {
      color: var(--error);
    }
  }
}
</style>
