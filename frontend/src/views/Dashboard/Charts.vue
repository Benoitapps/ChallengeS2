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
    <Modal class="charts__modal" :title="'Modifier mes charts'">
      <template #activator="{ openModal }">
        <button
            class="open-modal"
            title="Gérer l'affichage des charts"
            @click="openModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
            <path d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z"/>
          </svg>
        </button>
      </template>

      <template #default>
        <div class="charts__modal__blocks">
          <div>
            <h3>Selectionnés</h3>
            <ul>
              <li
                  v-for="chartsUser in chartsUserData"
                  :key="chartsUser.id"
              >
                {{ chartsUser }}
                <button
                    class="charts__modal__button"
                    @click="getUserdeleteCharts(chartsUser)"
                >
                  {{ chartsUser.value }}
                  Supprimer
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3>Non Selectionnés</h3>
            <ul>
              <li
                  v-for="charts in chartsData.unlinkedChartsNames"
                  :key="charts.id"
              >
                {{ charts }}
                <button
                    class="charts__modal__button"
                    @click="getUserAddCharts(charts)"
                >
                  {{ charts.id }}
                  Ajouter
                </button>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template #close-icon="{ closeModal }">
        <button
            class="close-modal"
            title="Fermer"
            @click="closeModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
            <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z"/>
          </svg>
        </button>
      </template>
    </Modal>
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
  </main>
</template>

<style scoped lang="scss">
.charts {
  .open-modal {
    border: none;
    background-color: transparent;
    outline: none;
    margin-bottom: 1.25rem; // 20px
  }

  .close-modal {
    position: absolute;
    top: 1rem; // 16px
    right: 1rem; // 16px
    border: none;
    background-color: transparent;
    outline: none;

    svg {
      width: 35px;
      height: 35px;
    }
  }

  &__modal {
    &__blocks {
      position: relative;
      display: flex;
      justify-content: space-between;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        border-radius: 5px;
        height: 100%;
        background-color: var(--accent);
      }

      div {
        width: 45%;

        h3 {
          margin-bottom: 1rem; // 16px
        }

        ul {
          display: flex;
          flex-direction: column;
          margin-top: 1rem; // 16px
          gap: 0.625rem; // 10px

          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
        }
      }
    }

    &__button {
      background: var(--primary);
      border: none;
      padding: 0.5rem 1rem; // 8px 16px
      border-radius: 4px;

      &:hover {
        background: var(--accent);
      }
    }
  }

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