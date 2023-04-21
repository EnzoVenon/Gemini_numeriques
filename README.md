# **Gemini numérique**

## **[Accéder au site](https://enzovenon.github.io/Gemini_numeriques/)**

## **[Accéder au manuel utilisateur](manuel_utilisateur.md)**

## **Présentation**
### <u>Le projet</u>
Cet outil est un prototype d'un projet porté par l'IGN, le CEREMA et l'INRIA qui souhaite créer un *Jumeau Numérique France Entière*.
Le projet étudiant TSI "Gemimi Numérique" permet d'être une base de réflection pour ce projet. Le but est d'**Interconnecter différentes sources de données dans un outil qui permettra de les visualiser**. 
Les informations que nous visualisons sont liées aux bâtiments. De plus, l'outil est centré sur Périgueux et sur le 11ème arrondissement de Paris. 

### <u>Les données</u>
Nous interconnectons les diverses sources de données suivantes : 

<u>Couches attributaires</u>
- *INSEE* : https://www.insee.fr/fr/information/3544265
- *Base de données nationale des bâtiments (BDNB)* : 
  - https://www.data.gouv.fr/fr/datasets/base-de-donnees-nationale-des-batiments
  - Energie : https://data.ademe.fr/datasets/dpe-france
- *BD Topo* : https://geoservices.ign.fr/bdtopo

<u>Couches spatiales</u>
- *OpenStreetMap (OSM)* : https://download.geofabrik.de/europe/france.html
- *Données Cadastrales* : https://cadastre.data.gouv.fr/datasets
- *Territoires à risques importants d'inondation* : https://www.georisques.gouv.fr/donnees/bases-de-donnees/zonages-inondation-rapportage-2020

<u>Couches de visualisation</u>
- *BD Ortho* : https://geoservices.ign.fr/bdtopo
- *BD Carto* : https://geoservices.ign.fr/services-web-experts-cartovecto


### <u>Accès et améliorations</u>
La dernière version stable du site se trouve [ici](https://enzovenon.github.io/Gemini_numeriques/). Si vous voulez avoir accès à une version plus avancée, mais moins stable, la version du site la plus récente se trouve sur la branche **dev** (il vous faudra cloner le dépôt).

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
- Pour modifier la version déployé sur GitHub Pages, lancer ces commandes avant de Push, et faites une pull request sur la branche main (là où la page est déployée) :
```bash
npm install
npm run build
```