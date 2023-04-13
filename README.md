# Jumeaux_numériques

Lien vers le visualisateur web : https://enzovenon.github.io/Gemini_numeriques/

Si vous avez eu un problème avec l'interface, que vous souhaitez laisser des commentaires ou même pour des idées d'améliorations, vous pouvez créer des Issues :
- Si vous êtes memebre du comité de suivi, vous pouvez créer une Issue avec le label : Comité de suivi.
- Si vous êtes un utilisateur, vous pouvez créer une Issue avec le label : Utilisateur.

## Sources de données
### BD Carto:
 - https://geoservices.ign.fr/services-web-experts-cartovecto

### Openstreet Map data (OSM)
 - https://download.geofabrik.de/europe/france.html
 
### Base de données nationale des bâtiments (BDNB)
 - https://www.data.gouv.fr/fr/datasets/base-de-donnees-nationale-des-batiments
 - Energie : https://data.ademe.fr/datasets/dpe-france

### API INSEE: 
  - https://pyris.datajazz.io/

## Installation:    
```
git clone https://github.com/EnzoVenon/Gemini_numeriques.git
```
- Installer Node (et npm)
- Aller dans le dossier:  Gemini_numeriques et l'ouvrir dans le terminal 
- Dans le terminal, lancer ces commandes pour tester en local : 

```bash
npm install
npm start
```
- Pour avoir une version utilisable sur Git, lancer ces commandes avant de Push : 
```bash
npm install
npm run build
```

## Utiliser ESLint

Pour lancer les tests en local (analyse statique et tests unitaires), lancer ces commandes : 
```bash
npm install
npm test
```

### Si ESLint affiche une erreur, que dois-je faire ?
---

### no-unused-var
Si l'erreur est :
```bash
/chemin/du/fichier.js
  79:14  error  'myVar' is defined but never used   no-unused-vars
```
Il faut aller voir dans le fichier indiqué, à la ligne indiqué (ici ```/chemin/du/fichier.js``` et ligne ```79```) pour trouver la variable.

Si elle ne sert pas et ne servira pas plus tard, on la supprime.

Sinon, si elle sera utile plus tard, on rajoute ce commentaire à la ligne précédente :
```js
// eslint-disable-next-line no-unused-vars
```

### no-undef
Si l'erreur est :
```bash
/chemin/du/fichier.js
  13:9  error  'myVar' is not defined  no-undef
```
Il faut aller voir dans le fichier indiqué, à la ligne indiqué (ici ```/chemin/du/fichier.js``` et ligne ```13```) pour trouver la variable.

Si elle sert, il faut la définir. Ça peut être un oubli de ```let``` ou de ```const``` au moment de la déclaration de la variable.

Si c'est une variable globale, il faut se rendre dans le fichier [.eslintrc.json](/.eslintrc.json) qui est à la racine du projet, et la rajouter dans les variables globales.
Exemple :
```json
{
  "globals": {
    "myVar": "readonly",
  }
}
```
---
