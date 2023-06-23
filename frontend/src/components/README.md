# Implémentation des composants

Ce document décrit les différentes propriétés des composants et comment les utiliser.
Il doit être mis à jour à chaque fois qu'un composant est modifié ou ajouté.

## Card

### :index
Type: `number` <br>
Description : Index de la card.

### :type
Type: `string` <br>
Description : Défini le type de card à afficher (`keys` ou `chart`).

### :title
Type: `string` <br>
Description : Titre de la card qui sera affiché en haut.

### :number
Type: `string` <br>
Description : Si vous souhaitez afficher qu'une valeur.

### :list
Type: `array` <br>
Description : Si vous souhaitez afficher plusieurs valeurs.

Options:

| Propriété   | Type | Description       |
|-------------| --- |-------------------|
| `label`     | string | Label de valeur   |
| `value`     | string | Valeur à afficher |

### :periods
Type: `array` <br>
Description : Options du select qui permet de choisir la période à afficher.

Options:

| Propriété | Type | Description       |
|-----------| --- |-------------------|
| `label`   | string | Texte de l'option |
| `value`   | string | Value de l'option |

### @removeCard
Description : Evenement qui permet de supprimer la card.

### @addCard
Description : Evenement qui permet d'ajouter la card.