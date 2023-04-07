
import * as shp from "shpjs"
export function loadDataFromShp(path) {
  let shpdata = fetch(path + '.shp')
    .then(function (response) {
      // Récupérer les données du fichier .shp en ArrayBuffer
      return response.arrayBuffer();
    })
    .then(function (buffer) {
      // Parser les données géométriques
      console.log(buffer)

      const features = shp.parseShp(buffer);

      console.log(features)

      // Récupérer les données du fichier .dbf en utilisant fetch
      return features;
    })

  let dbfdata = fetch(path + '.dbf')
    .then(function (response) {
      // Récupérer les données du fichier .dbf en ArrayBuffer
      return response.arrayBuffer();
    })
    .then(function (buffer) {
      // Parser les données attributaires
      const attributes = shp.parseDbf(buffer);
      console.log(attributes)

      // Générer un tableau de propriétés pour chaque feature
      const properties = attributes.reduce((result, attribute) => {
        result[attribute.fid] = attribute;
        // console.log(result)
        return result
      }, {});

      console.log(properties)

      return properties
    })

  return [shpdata, dbfdata]
}

export function loadBufferDataFromShp(path) {
  let shpdata = fetch(path + '.shp')
    .then(function (response) {
      // Récupérer les données du fichier .shp en ArrayBuffer
      return response.arrayBuffer();
    })

  let dbfdata = fetch(path + '.dbf')
    .then(function (response) {
      // Récupérer les données du fichier .dbf en ArrayBuffer
      return response.arrayBuffer();
    })

  return [shpdata, dbfdata]
}



