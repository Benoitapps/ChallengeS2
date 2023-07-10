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
            app.provide('sdk', new SDK(apiToken));
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

- Veuillez à remplacer `apiToken` par votre token qui doit être récupéré sur le site.

4. Pour utiliser le plugin dans un composant, vous devez l'importer et l'injecter dans le composant :

    ```javascript
    import { inject } from 'vue';

    onMounted(() => {
        this.sdk = inject('sdk');
        // Utilisez le SDK ici
        // Exemple : this.sdk.trackMouseMovement();
    }
    ```


## Étape 2 : Utilisation du SDK

Maintenant que le suivi est initialisé, vous pouvez utiliser les fonctionnalités du SDK pour collecter des données d'analytiques. Voici quelques exemples d'utilisation :

- Pour tracker les mouvements de souris :
    
    ```javascript
    sdk.trackMouseMovement();
    ```

- Pour tracker les clics de souris :
    
    ```javascript
    sdk.trackMouseClick();
    ```

- Sinon vous voulez tracker les mouvements de souris et les clics de souris en même temps :
    
    ```javascript
    sdk.initTracker();
    ```

## Étape 3 : Personnalisation du suivi

Vous pouvez également personnaliser le suivi en modifiant les paramètres du SDK. Par exemple, vous pouvez ajuster le délai entre les mouvements de souris à suivre. Voici un exemple :

```javascript
const MOUSE_DELAY = 5000;
```

