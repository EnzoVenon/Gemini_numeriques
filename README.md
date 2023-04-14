# **Gemini numérique**

## **Présentation**
### <u>Le projet</u>
Cet outil est un prototype d'un projet porté par l'IGN, le CEREMA et l'INRIA qui souhaite créer un *Jumeau Numérique France Entière*.
Le projet étudiant TSI "Gemimi Numérique" permet d'être une base de réflection pour ce projet. Le but est d'**Interconnecter différentes sources de données dans un outil qui permettra de les visualiser**. 
Les informations que nous visualisons sont liées aux bâtiments. De plus, l'outil est centré sur Périgueux et sur le 11ème arrondissement de Paris. 

### <u>Les données</u>
Nous interconnectons les diverses sources de données suivantes : 

- *BD Carto* : https://geoservices.ign.fr/services-web-experts-cartovecto

- *OpenStreetMap (OSM)* : https://download.geofabrik.de/europe/france.html

- *API INSEE* : https://pyris.datajazz.io/
 
- *Base de données nationale des bâtiments (BDNB)* : 
  - https://www.data.gouv.fr/fr/datasets/base-de-donnees-nationale-des-batiments
  - Energie : https://data.ademe.fr/datasets/dpe-france



### <u>Accès et améliorations</u>
Vous pouvez copier ce dépôt (pour accéder à la version en cours) ou alors accéder au visualisateur web à l'adresse suivante (pour accéder à la version stable) : https://enzovenon.github.io/Gemini_numeriques/.

Si vous avez eu un problème avec l'interface, que vous souhaitez laisser des commentaires ou si vous avez des idées d'améliorations, vous pouvez créer des *Issues* :
- Si vous êtes membre du comité de suivi, vous pouvez créer une Issue avec le label : *Comité de suivi*.
- Si vous êtes un utilisateur, vous pouvez créer une Issue avec le label : *Utilisateur*.



## **Installation**   
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

## **Utiliser ESLint**

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
