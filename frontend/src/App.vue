<script setup>
import Navbar from "./components/Navbar.vue";
import {inject, onMounted, onUnmounted, ref, watch} from "vue";
import { useRoute } from 'vue-router';

const route = useRoute();
const env = import.meta.env
const user = ref([]);
const userRole = ref("");
const error = ref("");
const showNavbar = ref(true);
const isAdmin = ref(false);

const getConnectedUser = async () => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/connecter/navbar`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      user.value.push(data);
      userRole.value = data.role;
    } else {
      const data = await response.json();
      error.value = data.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};

if(route.path === "/login" || route.path === "/register" || route.path === "/logout"){
  showNavbar.value = false;
}

watch(route, () => {
  if(route.path === "/login" || route.path === "/register" || route.path === "/logout"){
    showNavbar.value = false;
  } else {
    showNavbar.value = true;
  }
});

onMounted(() => {
  getConnectedUser();
});

watch(userRole, () => {
  if(userRole.value === "admin"){
    isAdmin.value = true;
  } else {
    isAdmin.value = false;
  }
});
</script>

<template>
  <Navbar v-if="showNavbar" :admin="isAdmin"/>

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
  --primary-hover: #88fd9b;
  --secondary: #ffffff;
  --accent: #b8ffc3;
  --error: #f23030;

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
table,
span,
button {
  font-family: Roboto, sans-serif;
  color: var(--text-color);
}

button {
  cursor: pointer;
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

input {
  &:-webkit-autofill,
  &:autofill {
    outline: var(--primary);
    box-shadow: 0 0 0 1000px var(--accent) inset;
  }
}

#app {
  display: flex;
  height: 100vh;
}

main {
  position: relative;
  z-index: 1;
  flex: 1;
  overflow-y: auto;
  padding: 3.125rem; // 50px
  background: var(--background);
  overflow-x: auto;
}

.basic-link {
  color: var(--primary);
  font-weight: 500;

  &:hover {
    color: var(--accent);
  }
}
</style>
