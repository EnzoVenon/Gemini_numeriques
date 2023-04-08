
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

  let promise = itowns.Fetcher.multiple(
    path,
    {
      // fetch all files whose name match the `url` parameter value, and whose format is either `shp`,
      // `dbf`, `shx` or `prj`.
      arrayBuffer: ['shp', 'dbf', 'shx'],
      text: ['prj'],
    },
  ).then((fetched) => {
    // Once our Shapefile data is fetched, we can parse it by running itowns built-in Shapefile parser.
    console.log(fetched)

    return Promise.all([
      fetched.shp,
      fetched.dbf
    ])
  }).then(buffers => {
    const shpBuffer = buffers[0];
    const dbfBuffer = buffers[1];
    const geojsonPromise = shp.combine([shp.parseShp(shpBuffer, /*optional prj str*/), shp.parseDbf(dbfBuffer)])
    return geojsonPromise
  })

  return promise
}