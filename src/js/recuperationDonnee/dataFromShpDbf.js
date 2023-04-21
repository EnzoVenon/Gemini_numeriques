
import * as shp from "shpjs"
/**
 * Récupérationd de données shp en geojson
 * @param {String} path 
 * @returns 
 */
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