<script setup>
import Card from "../../components/TableauDeBord/Card.vue";
import AddCard from "../../components/TableauDeBord/AddCard.vue";
import {onMounted, ref, reactive, onUnmounted, inject} from "vue";

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

const data = reactive([
  { date: "24/4/2007 17:05:00", amount: 16 },
  { date: "25/4/2007 09:25:00", amount: 47 },
  { date: "26/4/2007 12:48:00", amount: 41 },
  { date: "27/4/2007 21:47:00", amount: 27 },
  { date: "30/4/2007 00:54:00", amount: 87 },
  { date: "1/5/2007 05:37:00", amount: 32 },
  { date: "2/5/2007 05:37:00", amount: 96 },
  { date: "3/5/2007 05:37:00", amount: 83 },
  { date: "4/5/2007 05:37:00", amount: 99 },
  { date: "7/5/2007 05:37:00", amount: 98 },
  { date: "8/5/2007 05:37:00", amount: 26 },
  { date: "9/5/2007 05:37:00", amount: 25 },
  { date: "10/5/2007 05:37:00", amount: 50 }
]);

const chartSessions = ref([]);
const chartClicks = ref([]);

const cards = reactive(
    [
      {
        title: "Sessions",
        type: "charts",
        data: data,
        periods: periods
      },
      {
        title: "Clics",
        type: "charts",
        data: chartClicks,
        periods: periods
      }
    ]
);

const addingIsEnabled = ref(false);
const cardsRemoved = ref([]);

onMounted(() => {
  const datas = ref();
  const sdk = inject('sdk');
  sdk.initTracker();

  const getData = async () => {
    try {
      const response = await fetch('http://localhost:3000/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials : 'include',
        body: JSON.stringify({
          type: "clicks",
          periods: "24h"
        })
      });

      if (response.ok) {
        datas.value = await response.json();
        getCharts();
      }
    }
    catch (e) {
      console.log(e);
    }
  };

  getData();

  function getCharts() {
    datas.value.forEach(data => {
      let date = new Date(data.date);
      let heureLocale = date.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });

      chartClicks.value.push({
        date: heureLocale,
        amount: data.totalClicks
      })
    });
  }

  if(localStorage.getItem("Charts") !== null) {
    cards.value = JSON.parse(localStorage.getItem("Charts"));

    if(localStorage.getItem("Charts-removed") !== null) {
      cardsRemoved.value = JSON.parse(localStorage.getItem("Charts-removed"));
      addingIsEnabled.value = true;
    }
  }

  onUnmounted(() => {
    sdk.stopTracker();
  });
});

function removeCard(index) {
  addingIsEnabled.value = true;
  cardsRemoved.value.push(cards.value[index]);
  cards.value.splice(index, 1);
  localStorage.setItem("Charts", JSON.stringify(cards.value));
  localStorage.setItem("Charts-removed", JSON.stringify(cardsRemoved.value));
}

function addCard() {
  cards.value.push(cardsRemoved.value[0]);
  cardsRemoved.value.splice(0, 1);
  localStorage.setItem("Charts", JSON.stringify(cards.value));

  if(cardsRemoved.value.length === 0) {
    localStorage.removeItem("Charts-removed");
    addingIsEnabled.value = false;
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
        @removeCard="removeCard($event)"
      />

      <AddCard
          v-show="addingIsEnabled"
          @addCard="addCard()"
      />
    </ul>
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