<script setup>
import Card from "../../components/TableauDeBord/Card.vue";
import AddCard from "../../components/TableauDeBord/AddCard.vue";
import { inject, onMounted, onUnmounted, ref } from "vue";

const clics = ref("");
const sessions = ref("");
const moysessions = ref("");
const error = ref("");
const nameCard = ref("");
const resperiod = ref("");
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

const visitedPages = ref([
  {
    label: "Accueil",
    value: "50",
  },
  {
    label: "Contact",
    value: "30",
  },
  {
    label: "A propos",
    value: "20",
  },
  {
    label: "Blog",
    value: "10",
  },
]);

const cards = ref([
  {
    id : "sessions",
    title: "Sessions",
    type: "keys",
    number: sessions,
    periods: periods,
    period: "24h",
  },
  {
    id : "clics",
    title: "Clics",
    type: "keys",
    number: clics,
    periods: periods,
    period: "24h",
  },
  {
    title: "Pages visitées",
    type: "keys",
    number: "100",
    list: visitedPages.value,
    periods: periods,
    period: "24h",
  },
  {
    id : "Moyennedessessions",
    title: "Moyenne des sessions",
    type: "keys",
    number: moysessions,
    periods: periods,
    period: "24h",
  },
]);

nameCard.value = "test";
resperiod.value = "test2";

const getKPI = async () => {
  console.log("je passe");
  
  try {
    const response = await fetch(`http://localhost:3000/kpi/post/${nameCard.value}/${resperiod.value}`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    console.log(response);
    if (response.ok) {
      const data = await response.json();

      if(nameCard.value != "test"){
        console.log("post a ete realiser aec succes");
        cards.value.forEach(element => {
          console.log(nameCard.value+ " et "+element.id);
          if(nameCard.value == element.id){
            element.number = data.res;
          }
        });
      }else{
        clics.value = data.totalClicks;
        sessions.value = data.totalSessions;
        moysessions.value = data.resMoyenne;

      console.log(response);
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

getKPI();


const addingIsEnabled = ref(false);
const cardsRemoved = ref([]);

onMounted(() => {
  if (localStorage.getItem("KPI") !== null) {
    cards.value = JSON.parse(localStorage.getItem("KPI"));

    if (localStorage.getItem("KPI-removed") !== null) {
      cardsRemoved.value = JSON.parse(localStorage.getItem("KPI-removed"));
      addingIsEnabled.value = true;
    }
  }

  const sdk = inject("sdk");
  sdk.initTracker();

  onUnmounted(() => {
    sdk.stopTracker();
  });
});

function removeCard(index) {
  addingIsEnabled.value = true;
  cardsRemoved.value.push(cards.value[index]);
  cards.value.splice(index, 1);
  localStorage.setItem("KPI", JSON.stringify(cards.value));
  localStorage.setItem("KPI-removed", JSON.stringify(cardsRemoved.value));
}

function addCard() {
  cards.value.push(cardsRemoved.value[0]);
  cardsRemoved.value.splice(0, 1);
  localStorage.setItem("KPI", JSON.stringify(cards.value));

  if (cardsRemoved.value.length === 0) {
    localStorage.removeItem("KPI-removed");
    addingIsEnabled.value = false;
  }
}

function updatePeriod(card, selectedPeriod) {
  
  resperiod.value = selectedPeriod;
  nameCard.value = card.id;
  getKPI();
  console.log("la cate est : "+ card.title);
  console.log("la peridoe est : ");
  console.log(selectedPeriod);
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
        @updateSelectPeriod="(selectedPeriod) => updatePeriod(card, selectedPeriod)"
        @removeCard="removeCard($event)"
      >
      </Card>
      <AddCard v-show="addingIsEnabled" @addCard="addCard($event)" />
    </ul>
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
</style>
