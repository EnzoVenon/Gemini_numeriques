import { generateUniqueColors } from "../utile/generaRandomColorFromList"
import { setLegend } from "../affichage/legend"
import { addEdgeObj3d } from "../affichage/contourObj3d"
export function geojsontToFeatureGeom(geojson, updateSlectOptions, selectOption, incrementedId, uniqueColor, view, THREE, heightAttribut = "", altiSolAttribut = "", uniquecolvalue = "red") {
  // Récupérer les valeurs uniques de la propriété "type"
  let uniquePropValues = geojson.features.reduce((acc, feature) => {
    const propfilter = feature.properties[selectOption];
    if (!acc.includes(propfilter)) {
      acc.push(propfilter);
    }
    return acc;
  }, []);

  let uniquecol = generateUniqueColors(uniquePropValues)

  document.getElementById("exampleModalLabel").innerText = selectOption;

  let src = new itowns.FileSource({
    fetchedData: geojson,
    crs: 'EPSG:4326',
    format: 'application/json',
  })

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
            // console.log(properties)
            // console.log(color)
            return color
          }

        }
        ,
        extrusion_height: (properties) => {
          if (heightAttribut !== "") {
            // console.log("personal height")
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
            // console.log("personal alti")
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
      // console.log(mesh.children[0].children[0].children[0].children[0])
      let object = mesh.children[0].children[0].children[0].children[0]
      addEdgeObj3d(object, "black", THREE)

    }
  });
  /**
   * rajouter la couche
  */
  view.addLayer(bat)
  /**
   * rajouter la légende
  */
  setLegend(uniquecol)
}