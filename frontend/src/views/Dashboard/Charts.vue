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
  { date: "2007-04-24T17:05:00.188Z", amount: 16 },
  { date: "2007-04-25T09:25:00.188Z", amount: 47 },
  { date: "2007-04-26T12:48:00.188Z", amount: 41 },
  { date: "2007-04-27T21:47:00.188Z", amount: 27 },
  { date: "2007-04-30T00:54:00.188Z", amount: 87 },
  { date: "2007-05-01T05:37:00.188Z", amount: 32 },
  { date: "2007-05-02T05:37:00.188Z", amount: 96 },
  { date: "2007-05-03T05:37:00.188Z", amount: 83 },
  { date: "2007-05-04T05:37:00.188Z", amount: 99 },
  { date: "2007-05-07T05:37:00.188Z", amount: 98 },
  { date: "2007-05-08T05:37:00.188Z", amount: 26 },
  { date: "2007-05-09T05:37:00.188Z", amount: 25 },
  { date: "2007-05-10T05:37:00.188Z", amount: 50 }
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

const datas = ref();
const addingIsEnabled = ref(false);
const cardsRemoved = ref([]);
const title = ref('');
const type = ref('');
const period = ref('');

onMounted(() => {
  const sdk = inject('sdk');
  sdk.initTracker();

  if(period.value === '') {
    period.value = periods[0].value;
  }

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
          periods: period.value
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

function getCharts() {
  chartClicks.value.splice(0, chartClicks.value.length);

  datas.value.forEach(data => {
    console.log(data.date);
    chartClicks.value.push({
      date: data.date,
      amount: data.totalClicks
    })
  });
}

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

const updateChart = async (values) => {
  title.value = values[0].toLowerCase();
  period.value = values[1];

  if(title.value === 'clics') {
    type.value = 'clicks';
  }

  try {
    const response = await fetch('http://localhost:3000/charts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials : 'include',
      body: JSON.stringify({
        type: type.value,
        periods: period.value
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
        @updatePeriod="updateChart($event)"
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