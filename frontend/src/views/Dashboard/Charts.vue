<script setup>
import Card from "../../components/TableauDeBord/Card.vue";
import {onMounted, ref, reactive, onUnmounted, inject} from "vue";
const env = import.meta.env
import Modal from "../../components/Modal.vue";

const userId = ref('');
const userApi = ref('');
const chartsData = ref([]);
const chartsUserData = ref([]);
const periods = [
  {
    label: "Dernières 24h",
    value: "24h"
  },
  {
    label: "Derniers 7 jours",
    value: "7d"
  },
  {
    label: "Derniers 30 jours",
    value: "30d"
  },
  {
    label: "Derniers 12 mois",
    value: "12m"
  }
];
const cards = reactive([
  {
    title: "Sessions",
    type: "charts",
    data: [],
    periods: periods,
    state: false,
  },
  {
    title: "Clics",
    type: "charts",
    data: [],
    periods: periods,
    state: false,
  }
]);
const title = ref('');
const period = ref('');
const error = ref('');

function testState(name) {
  for (const element of chartsUserData.value) {
    if (element === name) {
      return true;
    }
  }
  return false;
}

const getConnectedUser = async () => {
  try {
    const userData = localStorage.getItem('myUser');
    if (userData) {
      const parsedData = JSON.parse(userData);

      userId.value = parsedData.userId;
      userApi.value = parsedData.apiToken;
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};

const getAllCharts = async () => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/charts/bddnot/${userApi.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      chartsData.value = data; // Update the chartsData variable with the fetched data
    } else {
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération des Charts";
  }
}

const getUserCharts = async () => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/charts/bdd/${userApi.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      chartsUserData.value = data.chartsNames; // Update chartsUserData with the fetched chartsNames array

    } else {
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération des Charts";
  }
}

async function getData() {
  try {
    for (const card of cards) {
      const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/charts/post/${card.title.toLowerCase()}/${period.value}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials : 'include'
      });
      const data = await response.json();

      card.data = data;
      card.state = testState(card.title);
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération des données";
  }
}

if(period.value === '') {
  period.value = periods[0].value;
}

getConnectedUser();
getAllCharts();
getUserCharts();

onMounted(() => {
  const sdk = inject('sdk');
  sdk.initTracker();

  getData();

  onUnmounted(() => {
    sdk.stopTracker();
  });
});

const updateChart = async (values) => {
  title.value = values[0].toLowerCase();
  period.value = values[1];

  try {
      const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/charts/post/${title.value.toLowerCase()}/${period.value}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials : 'include'
      });
      const data = await response.json();

      cards.forEach(card => {
        if(card.title.toLowerCase() === title.value.toLowerCase()) {
          card.data = data;
        }
      });
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération des données";
  }
}

const getUserAddCharts = async (charts) => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/charts/addbdd/${userApi.value}/${charts}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      await getAllCharts();
      await getUserCharts();

      cards.forEach(card => {
        if(card.title.toLowerCase() === charts.toLowerCase()) {
          card.state = true;
        }
      });
    } else {
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération des Charts";
  }
}

const getUserdeleteCharts = async (charts) => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/charts/removebdd/${userApi.value}/${charts}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      await getAllCharts();
      await getUserCharts();

      cards.forEach(card => {
        if(card.title.toLowerCase() === charts.toLowerCase()) {
          card.state = false;
        }
      });
    } else {
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération des Charts";
  }
}
</script>

<template>
  <main class="charts">
    <ul class="charts__container">
      <Card
        v-for="(card, index) in cards"
        :key="card.title"
        :index="index"
        :title="card.title"
        :type="card.type"
        :periods="card.periods"
        :data="card.data"
        :state="card.state"
        @removeCard="getUserdeleteCharts($event)"
        @updatePeriod="updateChart($event)"
      />
    </ul>
    <Modal :title="'Modifier mes charts'">
      <template #activator="{ openModal }">
        <button class="button" title="Ouvrir la modal" @click="openModal" />
      </template>

      <template #default>
        Selectionnés
        <ul>
          <li v-for="chartsUser in chartsUserData" :key="chartsUser.id">
            {{ chartsUser }}:
            <button @click="getUserdeleteCharts(chartsUser)">{{ chartsUser.value }}supprimer</button>
          </li>
        </ul>
        Non Selectionnés
        <ul>
          <li v-for="charts in chartsData.unlinkedChartsNames" :key="charts.id">
            {{ charts }}:
            <button @click="getUserAddCharts(charts)">{{ charts.id }}ajouter</button>
          </li>
        </ul>
      </template>
      <template #close-icon="{ closeModal }">
        <button title="X" @click="closeModal" />
      </template>
    </Modal>
  </main>
</template>

<style scoped lang="scss">
.charts {
  &__container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;

    @media screen and (max-width: 1199px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 767px) {
      grid-template-columns: repeat(1, 1fr);
    }

    .card {
      * {
        scrollbar-width: none !important;

        &::-webkit-scrollbar {
          display: none !important;
        }
      }
    }
  }
}
</style>