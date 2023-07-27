<script setup>
import { inject, onMounted, onUnmounted, ref } from 'vue';
import 'prismjs';
import 'prismjs/themes/prism.css';
import router from '../router';

const env = import.meta.env
let step = ref(1);

const getConnectedUser = async () => {
  try {
    const userData = localStorage.getItem('myUser');
    if (userData) {
      JSON.parse(userData);
    } else {
      router.push('/login');
    }
  } catch (error) {
    error.value = "Une erreur s'est produite lors de la récupération de l'utilisateur connecté";
  }
};
getConnectedUser();

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
        if (response.ok) {
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
    console.error(error);
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
        console.log("Tracking plugin is installed");
        const sdk = new SDK(apiToken);
        
        app.provide('sdk', sdk);

        app.directive('tracker', {
            mounted(el, binding){
                const tag = binding.value;
                const events = Object.keys(binding.modifiers);

                events.forEach(event => {
                    el.addEventListener(event, () => {
                        sdk.addTagToQueue({
                            token: tag,
                            path: window.location.pathname,
                            timestamp: Date.now(),
                            eventType: event,
                        });
                    });
                });
            }
        });
    }
};`;

const codeStep1_1 = `import { createApp } from 'vue';
import App from './App.vue';
import trackingPlugin from 'chemin/vers/le/fichier/trackingPlugin';

const app = createApp(App);
app.use(trackingPlugin, apiToken);
app.mount('#app');`;

const codeStep1_2 = `import { inject } from 'vue';

sdk = inject('sdk');
onMounted(() => {
    // Utilisez le SDK ici
    // Exemple : 
    sdk.initTracker();
}`;

const codeStep1_3 = `onUnmounted(() => {
    sdk.stopTracker();
});`;

const codeStep2 = `sdk.trackMouseMovement();
    // sdk.stopTrackingMouseMovement(); // Pour arrêter le suivi`;
const codeStep2_1 = `sdk.trackMouseClick();
    // sdk.stopTrackingMouseClick(); // Pour arrêter le suivi`;
const codeStep2_2 = `sdk.initTracker();
    // sdk.stopTracker(); // Pour arrêter le suivi`;
const codeStep3 = `<button v-tracker.mouseover.click="'token_de_votre_tag'">Click me</button>`;
</script>

<template>
  <main>
    <h1>Télécharger le SDK</h1>
    <div>
      <button id="downloadButton" @click="downloadSDK">Télécharger</button>

      <div class="tutorial">
        <Transition name="fade" mode="out-in">
          <div v-if="step === 1" class="step">
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
              site.</p>
            <CodeBlock :prismjs=true :code="codeStep1_3" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <br>
            <p>4. Pour utiliser le plugin dans un composant, vous devez l'importer et l'injecter dans le composant :</p>
            <CodeBlock :prismjs=true :code="codeStep1_2" lang="javascript" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" />
            <p>Si vous voulez arreter le suivi, vous pouvez utiliser la fonction <code
                class="highlight">stopTracker()</code> du SDK :</p><br>
            <button @click="skipStep" class="buttonSkip">Suivant</button>
          </div>

          <div v-else-if="step === 2" class="step">
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

          <div v-else-if="step === 3" class="step">
            <h2>Étape 3 : Personnalisation du suivi (Tags)</h2>
            <p>Le plugin de suivi ajoute une directive personnalisée appelée v-tracker qui peut être utilisée pour suivre
              les événements sur les éléments du DOM. La directive prend un argument obligatoire qui est le nom du tag à
              suivre. Vous pouvez également ajouter des modificateurs pour suivre des événements spécifiques.<br>Voici un
              exemple :</p>
            <CodeBlock :prismjs=true :code="codeStep3" lang="html" theme="default" :tabs=true copyText="Copier"
              copySuccessText="Copié !" /><br>
            <h3>Détails sur la directive</h3>
            <p>La directive v-tracker permet de suivre différents types d'événements sur un élément du DOM et
              d'enregistrer les données associées dans le SDK.<br>Voici comment cela fonctionne :</p><br>
            <p><code class="highlight">v-tracker</code> : La directive principale, suivie du type d'événement ou d'une
              combinaison d'événements que vous souhaitez suivre.</p><br>
            <p><code class="highlight">v-tracker.[événement]</code> : Vous pouvez spécifier un ou plusieurs événements
              séparés par des points pour lesquels vous souhaitez effectuer le suivi. Par exemple, v-tracker.click.input
              suivra à la fois les événements click et input.</p><br>
            <p>Notez que vous pouvez personnaliser la tag selon vos besoins et l'utiliser pour différencier différents
              événements dans le SDK.</p>
            <button @click="finishTutorial" class="buttonSkip">Recommencer le tutoriel</button>
          </div>
        </Transition>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

button {
  background-color: var(--primary);
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 700;
  color: var(--secondary);

  &:hover {
    background-color: var(--accent);
  }
}

h1,
h2 {
  margin-bottom: 1rem; // 16px
}

.tutorial {
  display: flex;
  border: var(--border);
  padding: 20px;
  margin-top: 20px;
  border-radius: 8px;

  .highlight {
    background-color: var(--accent);
    padding: 2px 4px;
    font-family: 'Courier New', monospace;
    color: #d45d00;
    font-size: 18px;
    font-weight: bold;
  }
}</style>