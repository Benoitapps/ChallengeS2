<script setup>

</script>

<template>
  <main>
    <h1>Télécharger le SDK</h1>
    <div>
      <a id="downloadButton" @click="downloadSDK">Télécharger</a>

      <div v-if="downloadComplete" class="tutorial">
      <transition name="fade">
        <div v-if="step === 1" class="step">
          <h2>Étape 1</h2>
          <p>Explication de l'étape 1...</p>
          <button @click="skipStep">Suivant</button>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="step === 2" class="step">
          <h2>Étape 2</h2>
          <p>Explication de l'étape 2...</p>
          <button @click="skipStep">Suivant</button>
        </div>
      </transition>

      <transition name="fade">
        <div v-if="step === 3" class="step">
          <h2>Étape 3</h2>
          <p>Explication de l'étape 3...</p>
          <button @click="finishTutorial">Réinitialiser</button>
        </div>
      </transition>
    </div>

    </div>
  </main>
</template>

<style scoped lang="scss">
  .fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.step {
  margin-bottom: 20px;
}
</style>

<script>
export default {
  data() {
    return {
      downloadComplete: false,
      step: 1,
    };
  },
  methods: {
    downloadSDK() {
      fetch('/sdk.js')
        .then(response => response.blob())
        .then(blob => {
          // Créer un lien temporaire pour le téléchargement
          const url = window.URL.createObjectURL(blob);

          // Créer un élément d'ancrage invisible pour le téléchargement
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'sdk.js');

          // Ajouter l'élément d'ancrage à la page
          document.body.appendChild(link);

          // Simuler le clic sur le lien pour déclencher le téléchargement
          link.click();

          // Nettoyer les ressources
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);

          // Après le téléchargement, définir la variable pour afficher le tutoriel
          this.downloadComplete = true;
        })
        .catch(error => {
          console.error(error);
        });
    },
    skipStep() {
      if (this.step < 3) {
        this.step++;
      }
    },
    finishTutorial() {
      // Réinitialiser les variables ou effectuer d'autres actions après la fin du tutoriel
      this.step = 1;
    },
  },
};
</script>