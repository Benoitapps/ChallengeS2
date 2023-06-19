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
:root {
  // Colors
  // watch this page to know how colors works: https://realtimecolors.com/?colors=0f000d-fff0fc-67fe80-ffffff-b8ffc3
  --text-color: #0f000d;
  --background: #fff0fc;
  --primary: #67fe80;
  --secondary: #ffffff;
  --accent: #b8ffc3;

  // Others
  --border: 1px solid #dadce0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  accent-color: var(--primary);
  scrollbar-width: thin;
  scrollbar-color: var(--primary) var(--secondary);

  &::-webkit-scrollbar {
    width: 10px;

    &-thumb {
      background: var(--primary);
      border-radius: 10px;
    }

    &-track {
      background: var(--secondary);
    }
  }
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

h1,
h2,
h3,
h4,
h5,
h6,
p,
label,
a,
input,
button, {
  font-family: Roboto, sans-serif;
  color: var(--text-color);
}

select {
  border: none;
  font-weight: 600;
  background: none;

  &:focus {
    outline: 2px solid var(--primary);
    border-radius: 4px;
  }
}

#app {
  display: flex;
}

main {
  width: calc(100% - 200px);
  min-height: 100vh;
  margin-left: 200px;
  padding: 3.125rem; // 50px
  background: var(--background);
}
</style>
