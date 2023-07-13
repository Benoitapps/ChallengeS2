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

const chartSessions = ref([]);
const chartClicks = ref([]);

const cards = reactive(
    [
      {
        title: "Sessions",
        type: "charts",
        data: chartSessions,
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

const datas = ref([]);
const addingIsEnabled = ref(false);
const cardsRemoved = ref([]);
const title = ref('');
const period = ref('');

onMounted(() => {
  const sdk = inject('sdk');
  sdk.initTracker();

  if(period.value === '') {
    period.value = periods[0].value;
  }

  function getData() {
    cards.forEach(card => {
      fetch('http://localhost:3000/charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials : 'include',
        body: JSON.stringify({
          title: card.title.toLowerCase(),
          periods: period.value
        })
      })
        .then(response => response.json())
        .then(data => {
          if(datas.value.length > 0) {
            datas.value.splice(0, datas.value.length);
          }

          datas.value = data;
          getCharts(card.title.toLowerCase());
        })
        .catch(e => console.log(e));
    });
  }

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

function getCharts(title) {
  chartSessions.value.splice(0, chartClicks.value.length);
  chartClicks.value.splice(0, chartClicks.value.length);

  datas.value.forEach(data => {
    if(title === 'sessions') {
      chartSessions.value.push({
        date: data.date,
        amount: data.totalSessions
      })
    } else if(title === 'clics') {
      chartClicks.value.push({
        date: data.date,
        amount: data.totalClicks
      })
    }
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

  fetch('http://localhost:3000/charts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials : 'include',
    body: JSON.stringify({
      title: title.value.toLowerCase(),
      periods: period.value
    })
  })
    .then(response => response.json())
    .then(data => {
      if(datas.value.length > 0) {
        datas.value.splice(0, datas.value.length);
      }

      datas.value = data;
      getCharts(title.value.toLowerCase());
    })
    .catch(e => console.log(e));
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