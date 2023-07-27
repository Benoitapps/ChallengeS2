# Intégration du SDK pour le suivi d'analytiques

Ce guide vous explique comment intégrer le SDK de suivi d'analytiques dans votre projet. Le SDK permet de collecter des données telles que les mouvements de souris et les clics des utilisateurs sur votre site.

## Étape 1 : Installation et configuration du SDK

1. Téléchargez le SDK et placez-le dans votre projet.

2. Mise en place du plugin de suivi d'analytiques :
    - Créez un fichier `trackingPlugin.js` dans votre projet et collez le code suivant :

    ```javascript
    import SDK from 'chemin/vers/le/fichier/SDK';

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
    };
    ```

3. Pour rendre accessible le plugin dans tout le projet, vous devez l'installer dans le fichier `main.js` de votre projet Vue.js :

    ```javascript
    import { createApp } from 'vue';
    import App from './App.vue';
    import trackingPlugin from 'chemin/vers/le/fichier/trackingPlugin';

    const app = createApp(App);
    app.use(trackingPlugin, apiToken);
    app.mount('#app');
    ```

- Veillez à remplacer `apiToken` par votre token qui doit être récupéré sur le site.

4. Pour utiliser le plugin dans un composant, vous devez l'importer et l'injecter dans le composant :

    ```javascript
    import { inject } from 'vue';

    sdk = inject('sdk');
    onMounted(() => {
        // Utilisez le SDK ici
        // Exemple : 
        sdk.initTracker();
    }
    ```

Si vous voulez arreter le suivi, vous pouvez utiliser la fonction `stopTracker()` du SDK :
```javascript

onUnmounted(() => {
    sdk.stopTracker();
});

```


## Étape 2 : Utilisation du SDK

Maintenant que le suivi est initialisé, vous pouvez utiliser les fonctionnalités du SDK pour collecter des données d'analytiques. Voici quelques exemples d'utilisation :

- Pour tracker les mouvements de souris :
    
    ```javascript
    sdk.trackMouseMovement();
    // sdk.stopTrackingMouseMovement(); // Pour arrêter le suivi
    ```

- Pour tracker les clics de souris :
    
    ```javascript
    sdk.trackMouseClick();
    // sdk.stopTrackingMouseClick(); // Pour arrêter le suivi
    ```

- Si vous voulez tracker les mouvements de souris et les clics de souris en même temps :
    
    ```javascript
    sdk.initTracker();
    // sdk.stopTracker(); // Pour arrêter le suivi
    ```

## Étape 3 : Personnalisation du suivi (Tags)

Le plugin de suivi ajoute une directive personnalisée appelée v-tracker qui peut être utilisée pour suivre les événements sur les éléments du DOM. La directive prend un argument obligatoire qui est le nom du tag à suivre. Vous pouvez également ajouter des modificateurs pour suivre des événements spécifiques. Voici un exemple :

```html
<button v-tracker.mouseover.click="'token_de_votre_tag'">Click me</button>
```
### Détails sur la directive
La directive v-tracker permet de suivre différents types d'événements sur un élément du DOM et d'enregistrer les données associées dans le SDK. Voici comment cela fonctionne :

- `v-tracker`: La directive principale, suivie du type d'événement ou d'une combinaison d'événements que vous souhaitez suivre.

- `v-tracker.[événement]`: Vous pouvez spécifier un ou plusieurs événements séparés par des points pour lesquels vous souhaitez effectuer le suivi. Par exemple, `v-tracker.click.input` suivra à la fois les événements click et input.


Notez que vous pouvez personnaliser la tag selon vos besoins et l'utiliser pour différencier différents événements dans le SDK.

