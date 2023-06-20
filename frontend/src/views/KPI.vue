<script setup>
import Card from "../components/Card.vue";
import {ref} from "vue";

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

let visitedPages = ref(
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

const cards = [
  {
    favorite: true,
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
    list: visitedPages.value,
    periods: periods
  },
  {
    title: "Moyenne des sessions",
    type: "keys",
    number: "03m 30s",
    periods: periods
  }
];
</script>

<template>
  <main class="kpi">
    <div class="kpi__container">
      <Card
          v-for="(card, index) in cards"
          :key="index"
          :index="index"
          :favorite="card.favorite"
          :title="card.title"
          :type="card.type"
          :number="card.number"
          :list="card.list"
          :periods="card.periods"
      />
    </div>
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
  }
}
</style>