<script setup>
import { ref } from 'vue';

let downloadComplete = ref(false);
let step = ref(1);

const downloadSDK = () => {
  fetch('/sdk.js')
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sdk.js');

      document.body.appendChild(link);

      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      downloadComplete.value = true;
    })
    .catch(error => {
      console.error(error);
    });
};

const skipStep = () => {
  if (step.value < 3) {
    step.value++;
  }
};

const finishTutorial = () => {
  step.value = 1;
};

</script>

<template>
  <main>
    <h1>Télécharger le SDK</h1>
    <div>
      <button id="downloadButton" @click="downloadSDK">Télécharger</button>

      <div v-if="downloadComplete" class="tutorial">
        <transition name="fade">
          <div v-show="step === 1" class="step">
            <h2>Étape 1</h2>
            <h1>Ajouter</h1>
            <p>Ajoutez le fichier "sdk.js" à la racine de votre serveur.</p>
            <button @click="skipStep" class="buttonSkip">Suivant</button>
          </div>
        </transition>

        <transition name="fade">
          <div v-show="step === 2" class="step">
            <h2>Étape 2</h2>
            <h1>Connecter</h1>
            <p>Récupérez votre clé API dans votre profil, puis ajoutez-la dans votre fichier .env.</p>
            <p>Par la suite, ajoutez "new SDK (VOTRE_CLE_API);" dans votre fichier main.js si applicable, ou bien
              uniquement dans les pages souhaitées, avec VOTRE_CLE_API votre variable d'environnement. N'oubliez pas
              d'inclure le fichier dans les imports.</p>
            <p>Attention, vous ne devez JAMAIS partager votre clé API avec un tiers. Si vous pensez que ce n'est plus le
              cas, vous pouvez re-générer une clé API dans votre profil.</p>
            <button @click="skipStep" class="buttonSkip">Suivant</button>
          </div>
        </transition>

        <transition name="fade">
          <div v-show="step === 3" class="step">
            <h2>Étape 3</h2>
            <h1>Utiliser</h1>
            <p>C'est parti ! Si tout s'est bien déroulé vous pouvez déjà consulter des données dans les divers
              statistiques proposées ; si ce n'est pas le cas veuillez réessayer ce tutoriel.</p>
            <button @click="finishTutorial" class="buttonSkip">Recommencer</button>
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

#downloadButton {
  cursor: pointer;
}

.tutorial {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
}

button {
  background-color: blue;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>