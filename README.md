# Jumeaux_numériques

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
- Pour lancer les tests en local (analyse statique et tests unitaires), lancer ces commandes : 
```bash
npm install
npm test
```
