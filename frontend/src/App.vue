<script setup>
import Navbar from "./components/Navbar.vue";
</script>

<template>
  <Navbar />

  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

video,
img,
svg,
object {
  max-width: 100%;
  height: auto;
  vertical-align: middle;
}

html,
body {
  min-height: 100%;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

#app {
  display: flex;
}

main {
  width: calc(100% - 200px);
  min-height: 100vh;
  margin-left: 200px;
  padding: 50px;
  background: #F8F9FA;
}
</style>
