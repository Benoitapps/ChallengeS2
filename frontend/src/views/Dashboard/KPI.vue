<script setup>
import Card from "../../components/TableauDeBord/Card.vue";
import AddCard from "../../components/TableauDeBord/AddCard.vue";
import {inject, onMounted, onUnmounted, ref} from "vue";

const periods = [
  {
    label: "Dernières 24h",
    value: "24h"
  },
  {
    label: "Dernières 7 jours",
    value: "7d"
  },
  {
    label: "Derniers 30 jours",
    value: "30d"
  },
  {
    label: "Dernières 12 mois",
    value: "12m"
  }
];

const visitedPages = ref(
    [
    {
      label: "Accueil",
      value: "50"
    },
    {
      label: "Contact",
      value: "30"
    },
    {
      label: "A propos",
      value: "20"
    },
    {
      label: "Blog",
      value: "10"
    }
  ]
);

const cards = ref(
      [
    {
      title: "Sessions",
      type: "keys",
      number: "50",
      periods: periods
    },
    {
      title: "Clics",
      type: "keys",
      number: "30300",
      periods: periods
    },
    {
      title: "Pages visitées",
      type: "keys",
      number: "100",
      list: visitedPages.value,
      periods: periods
    },
    {
      title: "Moyenne des sessions",
      type: "keys",
      number: "03m 30s",
      periods: periods
    }
  ]
);

const addingIsEnabled = ref(false);
const cardsRemoved = ref([]);

onMounted(() => {
  if(localStorage.getItem("KPI") !== null) {
    cards.value = JSON.parse(localStorage.getItem("KPI"));

    if(localStorage.getItem("KPI-removed") !== null) {
      cardsRemoved.value = JSON.parse(localStorage.getItem("KPI-removed"));
      addingIsEnabled.value = true;
    }
  }

  const sdk = inject('sdk');
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

  if(cardsRemoved.value.length === 0) {
    localStorage.removeItem("KPI-removed");
    addingIsEnabled.value = false;
  }
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
          @removeCard="removeCard($event)"
      />

      <AddCard
          v-show="addingIsEnabled"
          @addCard="addCard($event)"
      />
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
</style>