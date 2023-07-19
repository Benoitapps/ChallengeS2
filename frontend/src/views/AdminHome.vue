<script>
import { ref } from 'vue';

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
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};


    const getUsersNotVerified = async () => {
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
        const response = await fetch('http://localhost:3000/admin/alluser', {
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
        const response = await fetch(`http://localhost:3000/admin/verified/${theuserId}`, {
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

    const takeToken = async (tokenid) => {
        console.log(tokenid);
      try {
        const response = await fetch(`http://localhost:3000/admin/taketoken/${userId.value}/${tokenid}`, {
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
  <main>
    <div class="content">
      <div class="notverified">
        <div class="title">
          <h2>Utilisateurs non vérifiés :</h2>
        </div>
        <ul>
          <li v-for="user in usersNotVerified" :key="user._id">
            <div class="line" :class="{ 'selected': user.selected }">
              <div class="email">
                {{ user.email }}
              </div>
              <div class="boutton">
                <button @click="verifyUser(user.id)">Vérifier</button>
              </div>
            </div>
          </li>
        </ul>
        <p v-if="error">{{ error }}</p>
      </div>
      <div class="verified">
        <div class="title">
          <h2>Utilisateurs vérifiés :</h2>
        </div>
        <div>
          <ul>
            <li v-for="user in users" :key="user._id">
              <div class="line" :class="{ 'selected': user.selected }">
                <div class="email">
                  {{ user.email }}
                </div>
                <div class="boutton">
                  <button @click="takeToken(user.id)">Prendre le contrôle</button>
                </div>
              </div>
            </li>
          </ul>
          <p v-if="error">{{ error }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.content {
  display: flex;
  justify-content: space-around;
}

.notverified {
  background-color: white;
  padding: 2em;
  width: 40%;
}

.verified {
  background-color: white;
  padding: 2em;
  width: 40%;
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

.boutton {}

.email {}

.selected {
  /* Ajoutez le style de surlignage ici */
  background-color: yellow;
}
</style>
