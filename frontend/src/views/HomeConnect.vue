<script>
import { ref } from 'vue';

export default {
  setup() {
    const users = ref([]);
    const error = ref('');

    const getUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/connecter',{
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
      },
        credentials : "include"
        });
        

        if (response.ok) {
          const data = await response.json();
          users.value = data.map(user => user.email);
        } else {
          const data = await response.json();
          error.value = data.error;
        }
      } catch (e) {
        error.value = "Une erreur s'est produite lors de la récupération des utilisateurs";
      }
    };
    getUser();
    return {
      users,
      error,
      getUser
      
    };
    
  }
  
};
</script>


<template>
  <h2>Utilisateurs :</h2>
  <ul>
    <li v-for="user in users" :key="user">{{ user }}</li>
  </ul>
  <p v-if="error">{{ error }}</p>
</template>

<style lang="scss">

</style>