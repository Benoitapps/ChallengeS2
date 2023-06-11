<script setup>

</script>

<template>
  <header>
    <nav>
      <h1>Menu</h1>
      <ul>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/register">Inscription</router-link>
        </li>
        <li>
          <router-link to="/login">Connexion</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
  header,
  nav {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
  }

  header {
    background: green;
    padding: 0 30px;
  }

  ul {
    display: flex;
    margin-left: 20px;
    gap: 15px;
  }
</style>