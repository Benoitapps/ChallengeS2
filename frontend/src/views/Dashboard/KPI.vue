<script setup>
import Card from "../../components/TableauDeBord/Card.vue";
import Modal from "../../components/Modal.vue";
// import ModalProvider from '../../providers/ModalProvider.vue';
// import { getAllKpi , afftab } from "./KPIbdd.vue";
import { inject, onMounted, onUnmounted, ref } from "vue";
import { reactive, watch, watchEffect  } from "vue";
const env = import.meta.env

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

// const visitedPages = ref([
//   {
//     label: "Accueil",
//     value: "50",
//   },
//   {
//     label: "Contact",
//     value: "30",
//   },
//   {
//     label: "A propos",
//     value: "20",
//   },
//   {
//     label: "Blog",
//     value: "10",
//   },
// ]);
// const visitedPages = ref(
//   page.value.result.results.map((item) => ({
//     label: item.path,
//     value: String(item.count) // Convertir en chaîne pour s'assurer que "value" est une chaîne
//   }))
// );
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
      state: testState("e"),
    },
    {
      id: "Moyennedessessions",
      title: "Moyenne des sessions",
      type: "keys",
      number: moysessions,
      periods: periods,
      state: testState("a"),
    },
    {
      id: "visiteur",
      title: "Visiteurs",
      type: "keys",
      number: visiteur,
      periods: periods,
      state: testState("a"),
    },
    {
      id: "visitepage",
      title: "Page les plus visitée",
      type: "keys",
      number: pagevisite,
      periods: periods,
      state: testState("d"),
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
    const userData = localStorage.getItem('myUser');;
    if (userData) {
      const parsedData = JSON.parse(userData);

      userId.value = parsedData.userId;
      userApi.value = parsedData.apiToken;


      console.log("mon id est le : "+ userId.value)
      console.log("mon api est le : "+ userApi.value)
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
    });

    if (response.ok) {
      const data = await response.json();

      if(nameCard.value != "test"){

        cards.value.forEach(element => {
          if(nameCard.value == element.id){
            element.number = data.res;
          }
        });
      }else{

        clics.value = data.totalClicks;
        sessions.value = data.totalSessions;
        moysessions.value = data.resMoyenne;
        visiteur.value = data.resVisiteur;
        moySessionVisiteur.value = 0;
        page.value = data.resPage
        console.log(page.value);
        console.log(page.value.result.results);
        visitedPages.data = page.value.result.results.map((item) => ({
        label: item.path,
        value: String(item.count) // Convertir en chaîne pour s'assurer que "value" est une chaîne
      }));
      console.log(visitedPages.data);

      }
     // clics.value = data.totalClicks;

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
  //console.log("passage getUserKPI");
  try {
    const response = await fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/kpi/bdd/${userApi.value}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    //console.log(response);
    if (response.ok) {
      const data = await response.json();
      kpiUserData.value = data.kpiNames; // Update kpiUserData with the fetched kpiNames array
     // console.log(kpiUserData);

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

onMounted(() => {
  const sdk = inject("sdk");
  sdk.initTracker();

  onUnmounted(() => {
    sdk.stopTracker();
  });
});

function updatePeriod(card, selectedPeriod) {
  
  resperiod.value = selectedPeriod[1];
  nameCard.value = card.id;
  getKPI();
}

</script>

<template>
  <main class="kpi">
    <ul class="kpi__container">
      <Card
        v-for="(card, index) in cards"
        :key="card.title"
        :index="index"
        :title="card.title"
        :type="card.type"
        :number="card.number"
        :list="card.list"
        :periods="card.periods" 
        :state="card.state"
        
        @updatePeriod="updatePeriod(card, $event)"
        @removeCard="getUserdeleteKPI($event)"
      ></Card>
    </ul>
    <Modal>
      <template #activator="{ openModal }">
        <button class="button" title="Ouvrir la modal" @click="openModal" />
      </template>
    
      <template #default>
        Selectioner
        <ul>
          <li v-for="kpiUser in kpiUserData" :key="kpiUser.id">
            {{ kpiUser }}:
            <button @click="getUserdeleteKPI(kpiUser)">{{ kpiUser.value }}suprimmer</button>
          </li>
        </ul>
        Non Selectioner
        <ul>
          <li v-for="kpi in kpiData.unlinkedKpiNames" :key="kpi.id">
            {{ kpi }}:
            <button @click="getUserAddKPI(kpi)">{{ kpi.id }}ajouter</button>
          </li>
        </ul>
      </template>
      <template #close-icon="{ closeModal }">
        <button title="X" @click="closeModal" />
      </template>
    </Modal>
  </main>
</template>


<style lang="scss">
.kpi {
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


.button{
  width: 10em;
  height: 10em;
}
</style>
