<script setup>
import Card from "../../components/TableauDeBord/Card.vue";
import Modal from "../../components/Modal.vue";
import { ref } from "vue";
import { reactive, watchEffect } from "vue";
const env = import.meta.env
import router from '../../router';


const userId = ref('');
const userApi = ref('');
const clics = ref("");
const sessions = ref("");
const moysessions = ref("");
const moySessionVisiteur = ref("");
const page = ref([]);
const pagevisite = ref([]);
const visiteur = ref("");
const error = ref("");
const nameCard = ref("");
const resperiod = ref("");
const kpiData = ref([]);
const kpiUserData = ref([]);
const periods = [
  {
    label: "Tout",
    value: "test",
  },
  {
    label: "Dernières 24h",
    value: "24h",
  },
  {
    label: "Dernières 7 jours",
    value: "7d",
  },
  {
    label: "Derniers 30 jours",
    value: "30d",
  },
  {
    label: "Dernières 12 mois",
    value: "12m",
  },
];

const visitedPages = reactive({
  data: []
});




const cards = ref([]);

watchEffect(() => {
  const reactiveCards = reactive([
    {
      id: "Sessions",
      title: "Sessions",
      type: "keys",
      number: sessions,
      periods: periods,
      state: testState("Sessions"),
    },
    {
      id: "Clics",
      title: "Clics",
      type: "keys",
      number: clics,
      periods: periods,
      state: testState("Clics"),
    },
    {
      id: "page",
      title: "Clics par page",
      type: "keys",
      list: visitedPages.data,
      periods: periods,
      state: testState("Clics par page"),
    },
    {
      id: "Moyennedessessions",
      title: "Moyenne des sessions",
      type: "keys",
      number: moysessions,
      periods: periods,
      state: testState("Durée moyenne des sessions"),
    },
    {
      id: "visiteur",
      title: "Visiteurs",
      type: "keys",
      number: visiteur,
      periods: periods,
      state: testState("Visiteurs"),
    },
    {
      id: "visitepage",
      title: "Page les plus visitée",
      type: "keys",
      number: pagevisite,
      periods: periods,
      state: testState("Top pages"),
    },
  ]);

  cards.value = reactiveCards;
});

nameCard.value = "test";
resperiod.value = "test2";

function testState(name) {
  for (const element of kpiUserData.value) {
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
    } else {
      router.push('/login');
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};

const getKPI = async () => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/kpi/post/${nameCard.value}/${resperiod.value}`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ apiToken: userApi.value })
    });

    if (response.ok) {
      const data = await response.json();

      if (nameCard.value != "test") {

        cards.value.forEach(element => {
          if (nameCard.value == element.id) {
            element.number = data.res;
          }
        });
      } else {

        clics.value = data.totalClicks;
        sessions.value = data.totalSessions;
        moysessions.value = data.resMoyenne;
        visiteur.value = data.resVisiteur;
        moySessionVisiteur.value = 0;
        page.value = data.resPage
        visitedPages.data = page.value.result.results.map((item) => ({
          label: item.path,
          value: String(item.count) // Convertir en chaîne pour s'assurer que "value" est une chaîne
        }));
      }
    } else {
      const data = await response.json();
      error.value = data.error;
    }
  } catch (e) {
    error.value =
      "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};


const getAllKPI = async () => {

  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/kpi/bddnot/${userApi.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      kpiData.value = data; // Update the kpiData variable with the fetched data

    } else {
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération des KPI";
  }
}

const getUserKPI = async () => {
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/kpi/bdd/${userApi.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      kpiUserData.value = data.kpiNames; // Update kpiUserData with the fetched kpiNames array
    } else {
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération des KPI";
  }
}

const getUserAddKPI = async (kpi) => {

  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/kpi/addbdd/${userApi.value}/${kpi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      await getAllKPI();
      await getUserKPI();

    } else {
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération des KPI";
  }
}

const getUserdeleteKPI = async (kpi) => {

  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/kpi/removebdd/${userApi.value}/${kpi}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      await getAllKPI();
      await getUserKPI();
    } else {
      const errorData = await response.json();
      error.value = errorData.error;
    }
  } catch (e) {
    error.value = "Une erreur s'est produite lors de la récupération des KPI";
  }
}


getConnectedUser();
getKPI();
getAllKPI();
getUserKPI();

function updatePeriod(card, selectedPeriod) {

  resperiod.value = selectedPeriod[1];
  nameCard.value = card.id;
  getKPI();
}

</script>

<template>
  <main class="kpi">
    <Modal class="kpi__modal">
      <template #activator="{ openModal }">
        <button class="open-modal" title="Ouvrir la modal" @click="openModal">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
            <path
              d="m388-80-20-126q-19-7-40-19t-37-25l-118 54-93-164 108-79q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521L80-600l93-164 118 54q16-13 37-25t40-18l20-127h184l20 126q19 7 40.5 18.5T669-710l118-54 93 164-108 77q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l108 78-93 164-118-54q-16 13-36.5 25.5T592-206L572-80H388Zm92-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-60q-29 0-49.5-20.5T410-480q0-29 20.5-49.5T480-550q29 0 49.5 20.5T550-480q0 29-20.5 49.5T480-410Zm0-70Zm-44 340h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Z" />
          </svg>
        </button>
      </template>

      <template #default>
        <div class="kpi__modal__blocks">
          <div>
            <h3>Selectionnés</h3>
            <ul>
              <li v-for="kpiUser in kpiUserData" :key="kpiUser.id">
                {{ kpiUser }}
                <button class="kpi__modal__button" @click="getUserdeleteKPI(kpiUser)">
                  {{ kpiUser.value }}
                  Supprimer
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3>Non Selectionnés</h3>
            <ul>
              <li v-for="kpi in kpiData.unlinkedKpiNames" :key="kpi.id">
                {{ kpi }}
                <button class="kpi__modal__button" @click="getUserAddKPI(kpi)">
                  {{ kpi.id }}
                  Ajouter</button>
              </li>
            </ul>
          </div>
        </div>
      </template>
      <template #close-icon="{ closeModal }">
        <button class="close-modal" title="Fermer" @click="closeModal">
          <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
            <path d="m249-207-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
          </svg>
        </button>
      </template>
    </Modal>
    <ul class="kpi__container">
      <Card v-for="(card, index) in cards" :key="card.title" :index="index" :title="card.title" :type="card.type"
        :number="card.number" :list="card.list" :periods="card.periods" :state="card.state"
        @updatePeriod="updatePeriod(card, $event)" @removeCard="getUserdeleteKPI($event)"></Card>
    </ul>

  </main>
</template>


<style lang="scss">
.kpi {
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
      font-weight: 700;
      color: var(--secondary);

      &:hover {
        background: var(--accent);
      }
    }
  }

  &__container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;

    @media screen and (max-width: 1599px) {
      grid-template-columns: repeat(3, 1fr);
    }

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

.card__periods span.active {
  font-weight: bold;
}
</style>
