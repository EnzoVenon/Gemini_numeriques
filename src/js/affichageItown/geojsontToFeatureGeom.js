import { generateUniqueColors } from "../utile/generaRandomColorFromList"
import { setLegend } from "../affichageHtml/legend"
import { addEdgeObj3d } from "./contourObj3d"
/**
 * add featuregeomeetry from geojson
 * @param {Object} geojson - data to represent en 3D
 * @param {String} selectOption - attribut for coloring objects
 * @param {String} incrementedId - id of the layer
 * @param {Boolean} uniqueColor - using unique color 
 * @param {Object} view - itowns view
 * @param {Object} THREE - three js lib of itwons
 * @param {String} heightAttribut - the propertie that represent height
 * @param {String} altiSolAttribut - the propertie that represent ground alti
 * @param {String} uniquecolvalue - the color
 */
export function geojsontToFeatureGeom(geojson, selectOption, incrementedId, uniqueColor, view, THREE, heightAttribut = "", altiSolAttribut = "", uniquecolvalue = "red") {
  let uniquePropValues = geojson.features.reduce((acc, feature) => {
    const propfilter = feature.properties[selectOption];
    if (!acc.includes(propfilter)) {
      acc.push(propfilter);
    }
    return acc;
  }, []);
  // generate color for unique value of the propertie
  let uniquecol = generateUniqueColors(uniquePropValues)
  //update select option
  document.getElementById("exampleModalLabel").innerText = selectOption;
  //itown source 
  let src = new itowns.FileSource({
    fetchedData: geojson,
    crs: 'EPSG:4326',
    format: 'application/json',
  })
  //itowns featuregeom 
  let bat = new itowns.FeatureGeometryLayer(incrementedId, {
    source: src,
    transparent: true,
    opacity: 0.7,
    zoom: { min: 0 },
    style: new itowns.Style({
      fill: {
        color: (properties) => {
          if (uniqueColor) {
            return uniquecolvalue
          }
          else {
            let color = uniquecol[properties[selectOption]];
            return color
          }

        }
        ,
        extrusion_height: (properties) => {
          if (heightAttribut !== "") {
            return properties[heightAttribut]
          }

          else if (properties.hauteur) {
            return properties.hauteur
          }
          else if (properties.bdtopo_bat_hauteur_mean) {
            return properties.bdtopo_bat_hauteur_mean
          }

          else if (properties.HAUTEUR) {
            return properties.HAUTEUR
          }
          else {
            return 20
          }
        },
        base_altitude: (properties) => {
          if (altiSolAttribut !== "") {
            return properties[altiSolAttribut]
          }
          else if (properties.altitude_s) {
            return properties.altitude_s

          }
          else if (properties.bdtopo_bat_altitude_sol_mean) {
            return properties.bdtopo_bat_altitude_sol_mean
          }
          else if (properties.Z_MIN_SOL) {
            return properties.Z_MIN_SOL
          }

          else {
            return 100
          }
        }
      }
    }),
    onMeshCreated: (mesh) => {
      let object = mesh.children[0].children[0].children[0].children[0]
      addEdgeObj3d(object, "black", THREE)

    }
  });
  view.addLayer(bat)
  setLegend(uniquecol)
}