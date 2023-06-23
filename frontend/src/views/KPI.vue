<script setup>
import Card from "../components/Card.vue";
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

let cards = ref(
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

let addingIsEnabled = ref(false);
let cardsRemoved = ref([]);

onMounted(() => {
  if(localStorage.getItem("Cards") !== null) {
    cards.value = JSON.parse(localStorage.getItem("Cards"));

    if(localStorage.getItem("Cards-removed") !== null) {
      cardsRemoved.value = JSON.parse(localStorage.getItem("Cards-removed"));
      addingIsEnabled.value = true;
    }
  }
});

function removeCard(index) {
  addingIsEnabled.value = true;
  cardsRemoved.value.push(cards.value[index]);
  cards.value.splice(index, 1);
  localStorage.setItem("Cards", JSON.stringify(cards.value));
  localStorage.setItem("Cards-removed", JSON.stringify(cardsRemoved.value));
}

function addCard() {
  cards.value.push(cardsRemoved.value[0]);
  cardsRemoved.value.splice(0, 1);
  localStorage.setItem("Cards", JSON.stringify(cards.value));

  if(cardsRemoved.value.length === 0) {
    localStorage.removeItem("Cards-removed");
    addingIsEnabled.value = false;
  }
}
</script>

<template>
  <main class="kpi">
    <div class="kpi__container">
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

      <button
          v-if="addingIsEnabled"
          class="card__add"
          @click.stop="addCard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48">
          <path d="M450-200v-250H200v-60h250v-250h60v250h250v60H510v250h-60Z"/>
        </svg>
      </button>
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