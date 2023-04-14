import { generateUniqueColors } from "../utile/generaRandomColorFromList"

export function geojsontToFeatureGeom(geojson, updateSlectOptions, selectOption, randomId, uniqueColor, view, THREE, heightAttribut = "", altiSolAttribut = "", uniquecolvalue = "red") {
  // supposons que votre objet GeoJSON est stocké dans la variable 'geojson'
  // obtenir un tableau des noms de propriétés
  const propNames = geojson.features.reduce((acc, feature) => {
    return acc.concat(Object.keys(feature.properties));
  }, []);
  // créer un tableau des clés uniques
  const uniquePropNames = propNames.reduce((acc, propName) => {
    if (!acc.includes(propName)) {
      acc.push(propName);
    }
    return acc;
  }, []);

  // console.log(uniquePropNames)

  if (updateSlectOptions) {
    // Récupération de l'élément HTML de sélection
    const selectElement = document.getElementById('selectProp');
    document.getElementById('selectProp').innerHTML = "";

    // Boucle pour ajouter chaque valeur à la sélection
    uniquePropNames.forEach(value => {
      // Création d'un élément d'option
      const option = document.createElement('option');
      // Ajout de la valeur de l'option
      option.text = value;
      // Ajout de la valeur de l'option en tant que valeur d'attribut
      option.value = value;
      // Ajout de l'option à l'élément de sélection
      selectElement.add(option);

      if (value == selectOption) {
        option.selected = true;
      }
    });

  }

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

  let legendHtml = '<div>';
  for (const [label, color] of Object.entries(uniquecol)) {
    // console.log(color)
    legendHtml += `<div style="display:flex;flex-direction:row"> <div style="background-color:${color};width: 31px;height: 16px; margin-right: 20px;"></div><div>${label}</div></div>`;
  }
  legendHtml += '</div>';

  // create a div element to hold the legend
  document.getElementById("legend").innerHTML = legendHtml;


  let src = new itowns.FileSource({
    fetchedData: geojson,
    crs: 'EPSG:4326',
    format: 'application/json',
  })

  let bat = new itowns.FeatureGeometryLayer(randomId, {
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
      var objectEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(object.geometry),
        new THREE.LineBasicMaterial({ color: 'black' })
      );

      object.add(objectEdges);
    }
  });

  view.addLayer(bat)
}