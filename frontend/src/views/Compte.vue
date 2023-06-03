<script setup>
  import { ref } from 'vue'

  const email = ref('')
  const password = ref('')

  const signup = () => {
    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })
  }
</script>

<template>
  <h2>Compte</h2>
  <input type="email" placeholder="email" v-model="email">
  <input type="password" placeholder="password" v-model="password">
  <button @click="signup">S'inscrire</button>
</template>

<style scoped lang="scss">

</style>