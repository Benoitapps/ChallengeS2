<script setup>
import { ref } from 'vue';
import 'prismjs';
import 'prismjs/themes/prism.css';

const env = import.meta.env
let step = ref(1);

const downloadSDK = () => {
  try {
    const response = fetch(`${env.VITE_URL}:${env.VITE_PORT_BACK}/downloadsdk`, {
      // la méthode permet de demander la récupération d'un fichier js
      method: 'GET',
      // le header permet de préciser le type de fichier attendu
      headers: {
        'Content-Type': 'application/javascript'
      },
      credentials: 'include'
    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          console.log(response);
          return response;
        }
        else {
          throw new Error('Erreur lors de la récupération du fichier');
        }
      })
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
      })
      .catch(error => {
        console.error(error);
      });
  }
  catch (error) {
    console.log(error);
  }
};

// const downloadSDK = () => {
//   fetch('http://localhost:3000/downloadsdk')
//     //fetch('/sdk.js')
//     .then(response => response.blob())
//     .then(blob => {
//       const url = window.URL.createObjectURL(blob);

//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'sdk.js');

//       document.body.appendChild(link);

//       link.click();

//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(link);
//     })
//     .catch(error => {
//       console.error(error);
//     });
// };

const skipStep = () => {
  if (step.value < 3) {
    step.value++;
  }
};

const finishTutorial = () => {
  step.value = 1;
};

const codeStep1 = `import SDK from 'chemin/vers/le/fichier/SDK';

export default {
    install(app, apiToken) {
        app.provide('sdk', new SDK(apiToken));
    }
};`;

const codeStep1_1 = `import { createApp } from 'vue';
import App from './App.vue';
import trackingPlugin from 'chemin/vers/le/fichier/trackingPlugin';

const app = createApp(App);
app.use(trackingPlugin, apiToken);
app.mount('#app');`;

const codeStep1_2 = `import { inject } from 'vue';

onMounted(() => {
    this.sdk = inject('sdk');
    // Utilisez le SDK ici
    // Exemple : this.sdk.trackMouseMovement();
}`;

const codeStep2 = `sdk.trackMouseMovement();`;
const codeStep2_1 = `sdk.trackMouseClick();`;
const codeStep2_2 = `sdk.initTracker();`;
const codeStep3 = `const MOUSE_DELAY = 5000;`;
</script>

<template>
  <main>
    <h1>Télécharger le SDK</h1>
    <div>
      <button id="downloadButton" @click="downloadSDK">Télécharger</button>

      <div class="tutorial">
        <transition name="fade">
          <div v-show="step === 1" class="step">
            <h1>Intégration du SDK pour le suivi d'analytiques</h1>
            <p>Ce guide vous explique comment intégrer le SDK de suivi d'analytiques dans votre projet. Le SDK permet de
              collecter des données telles que les mouvements de souris et les clics des utilisateurs sur votre site.</p>
            <br>
            <h2>Étape 1 : Installation et configuration du SDK</h2>
            <p>1. Téléchargez le SDK et placez-le dans votre projet.</p><br>
            <p>2. Mise en place du plugin de suivi d'analytiques :<br><br>Créez un fichier <code
                class="highlight">trackingPlugin.js</code> dans votre projet et collez le code suivant :</p>
            <CodeBlock :prismjs=true :code="codeStep1" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <p>3. Pour rendre accessible le plugin dans tout le projet, vous devez l'installer dans le fichier <code
                class="highlight">main.js</code> de votre projet Vue.js :</p>
            <CodeBlock :prismjs=true :code="codeStep1_1" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <p>Veillez à remplacer <code class="highlight">apiToken</code> par votre token qui doit être récupéré sur le
              site.</p><br>
            <p>4. Pour utiliser le plugin dans un composant, vous devez l'importer et l'injecter dans le composant :</p>
            <CodeBlock :prismjs=true :code="codeStep1_2" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <button @click="skipStep" class="buttonSkip">Suivant</button>
          </div>
        </transition>

        <transition name="fade">
          <div v-show="step === 2" class="step">
            <h2>Étape 2 : Utilisation du SDK</h2>
            <p>Maintenant que le suivi est initialisé, vous pouvez utiliser les fonctionnalités du SDK pour collecter des
              données d'analytiques.<br>Voici quelques exemples d'utilisation :</p><br>
            <p>Pour tracker les mouvements de souris :</p>
            <CodeBlock :prismjs=true :code="codeStep2" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <p>Pour tracker les clics de souris :</p>
            <CodeBlock :prismjs=true :code="codeStep2_1" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <p>Si vous voulez tracker les mouvements de souris et les clics de souris en même temps :</p>
            <CodeBlock :prismjs=true :code="codeStep2_2" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <button @click="skipStep" class="buttonSkip">Suivant</button>
          </div>
        </transition>

        <transition name="fade">
          <div v-show="step === 3" class="step">
            <h2>Étape 3 : Personnalisation du suivi</h2>
            <p>Vous pouvez également personnaliser le suivi en modifiant les paramètres du SDK. Par exemple, vous pouvez
              ajuster le délai entre les mouvements de souris à suivre.<br>Voici un exemple :</p>
            <CodeBlock :prismjs=true :code="codeStep3" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <button @click="finishTutorial" class="buttonSkip">Recommencer le tutoriel</button>
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
  // justify-content: center;
  // align-items: center;
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

.highlight {
  background-color: #ffe8bf;
  padding: 2px 4px;
  font-family: 'Courier New', monospace;
  color: #d45d00;
  font-size: 18px;
  font-weight: bold;
}
</style>