<script setup>
import Card from "../../components/TableauDeBord/Card.vue";
import {onMounted, ref} from "vue";

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

const data = [
  { date: "24-Apr-07", amount: 93.24 },
  { date: "25-Apr-07", amount: 95.35 },
  { date: "26-Apr-07", amount: 98.84 },
  { date: "27-Apr-07", amount: 99.92 },
  { date: "30-Apr-07", amount: 99.8 },
  { date: "1-May-07", amount: 99.47 },
  { date: "2-May-07", amount: 100.39 },
  { date: "3-May-07", amount: 100.4 },
  { date: "4-May-07", amount: 100.81 },
  { date: "7-May-07", amount: 103.92 },
  { date: "8-May-07", amount: 105.06 },
  { date: "9-May-07", amount: 106.88 },
  { date: "10-May-07", amount: 107.34 },
];

const data2 = [
  { date: "24-Apr-07", amount: 16 },
  { date: "25-Apr-07", amount: 47 },
  { date: "26-Apr-07", amount: 41 },
  { date: "27-Apr-07", amount: 27 },
  { date: "30-Apr-07", amount: 87 },
  { date: "1-May-07", amount: 32 },
  { date: "2-May-07", amount: 96 },
  { date: "3-May-07", amount: 83 },
  { date: "4-May-07", amount: 99 },
  { date: "7-May-07", amount: 98 },
  { date: "8-May-07", amount: 26 },
  { date: "9-May-07", amount: 25 },
  { date: "10-May-07", amount: 50 }
];

const cards = ref(
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
        data: data2,
        periods: periods
      }
    ]
);
</script>

<template>
  <main class="charts">
    <div class="charts__container">
      <Card
        v-for="(card, index) in cards"
        :key="card.title"
        :index="index"
        :title="card.title"
        :type="card.type"
        :periods="card.periods"
        :data="card.data"
      />
    </div>
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

      &__add {
        display: flex;
        justify-content: center;
        align-items: center;
        aspect-ratio: 1/1;
        background: var(--secondary);
        border: var(--border);
        border-radius: 10px;
        cursor: pointer;

        svg {
          width: 100px;

          path {
            fill: var(--text-color);
          }
        }

        &:hover {
          background: var(--accent) !important;
        }
      }
    }
  }
}
</style>