import { addChart } from "./insee/showChart"

// Onglet batiment
let ongletBatiment = [
  "bdtopo_bat_altitude_sol_mean",
  "bdtopo_bat_hauteur_mean",
  "bdtopo_bat_l_etat",
  "ffo_bat_usage_niveau_1_txt",
  "ffo_bat_annee_construction",
  "DATE_CREAT",
  "ETAT",
  "NATURE",
  "NB_ETAGES",
  "USAGE1",
  "USAGE2"
]
// Onglet risque
let ongletRisque = [
  "radon_alea",
  "argiles_alea"
]
// Onglet Infos Générales 
let ongletInfoGen = [
  "code_commune_insee",
  "code_departement_insee",
  "code_iris",
  "fiabilite_cr_adr_niv_1",
  "libelle_adr_principale_ban",
  "libelle_commune_insee",
  "bdtopo_zoa_l_toponyme"

]

export function loadDataToJSON(dictionaryTofill, key, value, base) {

  /* 
  
      Load data into a JSON. 
      The returned variable's format is as follow:
          {
            tabInfoGen: [ { attribute: key, val: value, source: base },
                          { attribute: key, val: value, source: base },
                          ... ]
            tabBatiment: [ { attribute: key, val: value, source: base },
                          { attribute: key, val: value, source: base },
                          ... ]
            tabRisques: [ { attribute: key, val: value, source: base },
                          { attribute: key, val: value, source: base },
                          ... ]
          }
  
  */

  const jsonData = {
    attribut: key,
    val: value,
    source: base
  }
  if (ongletInfoGen.includes(key)) {
    dictionaryTofill.tabInfoGen.push(jsonData)
  } else if (ongletBatiment.includes(key)) {
    dictionaryTofill.tabBatiment.push(jsonData)
  } else if (ongletRisque.includes(key)) {
    dictionaryTofill.tabRisques.push(jsonData)
  }

  return dictionaryTofill;
}

export function generateAttributes4Tab(htmlID, tabName, listOfAttributes, keyTab) {
  /*

    Generates html accordion item for each attribute in the list of attributes given

  */

  let textTest = ''
  const htmlElement = document.getElementById(htmlID);

  if (keyTab.includes(tabName)) {
    htmlElement.innerHTML = ''
    listOfAttributes.forEach((value) => {
      textTest = generateAccordion4Attribute(value.attribut, value.val, value.source)
      htmlElement.innerHTML += textTest
    })
  }

}

export function generateAccordion4Attribute(attributeName, value, source) {

  /*

    Generate html accordion for the given attribute

  */

  let htmlText = '';
  htmlText += '<div class="accordion-item">'
  htmlText += '<h2 class="accordion-header" id="heading' + attributeName + '">'
  htmlText += '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse' + attributeName + '" aria-expanded="false" aria-controls="collapse' + attributeName + '">'
  htmlText += attributeName
  htmlText += '</button></h2></div>'
  htmlText += '<div id="collapse' + attributeName + '" class="accordion-collapse collapse" aria-labelledby="heading' + attributeName + '">'
  htmlText += '<div class="accordion-body" id="info' + attributeName + '">'
  htmlText += '<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around">'
  htmlText += '<span>' + value + '</span>'
  htmlText += '<a href="#" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="custom-tooltip" data-bs-title="donnée issue de la ' + source + ' sur ' + attributeName + '">'
  htmlText += 'info'
  htmlText += '</a></div></div></div>'
  return htmlText;
}



export async function picking(event, view) {
  if (view.controls.isPaused) {

    const htmlInfo = document.getElementById('info');
    const intersects = view.pickObjectsAt(event, 3, 'WFS Building');
    let properties;
    let info;
    let batchId;

    htmlInfo.innerHTML = ' ';

    if (intersects.length) {
      batchId = intersects[0].object.geometry.attributes.batchId.array[intersects[0].face.a];
      properties = intersects[0].object.feature.geometries[batchId].properties;
      let iris_code;
      let importantKey = ["usage_1", "usage_2", "hauteur", "nombre_de_logements", "nombre_d_etage"]

      let keys = Object.keys(properties)
      for (let i = 0; i < keys.length; i++) {
        let objectKey = keys[i]

        const value = properties[objectKey];

        if (value) {
          const key = objectKey.toString();
          if (key === 'bbox') {
            const lon = (value[0] + value[2]) / 2;
            const lat = (value[1] + value[3]) / 2;
            const res = await fetch("https://pyris.datajazz.io/api/coords?lat=" + lat + "&lon=" + lon)
            const json = await res.json();

            iris_code = json.complete_code
          }
          if (key[0] !== '_' && key !== 'geometry_name' && (importantKey.includes(key))) {
            info = value.toString();
            htmlInfo.innerHTML += '<li><b>' + key + ': </b>' + info + '</li>';
          }
        }
      }
      htmlInfo.innerHTML += '<li>' + 'test iris' + '</li>';


      // getPopdata
      let apiUrl = "https://pyris.datajazz.io/api/insee/population/" + iris_code

      let apiUrl2 = "https://pyris.datajazz.io/api/insee/population/distribution/" + iris_code + "?by=age"


      let dataPromise = await fetch(apiUrl)
      let dataJson = await dataPromise.json()

      let dataPromiseAge = await fetch(apiUrl2)
      let dataJsonAge = await dataPromiseAge.json()
      delete dataJsonAge.data.census;

      htmlInfo.innerHTML += '<li>' + 'population par groupe paté de maison' + '</li>';
      htmlInfo.innerHTML += '<div style="width:100%;"><canvas id="pop"></canvas></div>';
      htmlInfo.innerHTML += '<li>' + 'population par age par groupe paté de maison' + '</li>';
      htmlInfo.innerHTML += '<div style="width:100%;"><canvas id="pop2"></canvas></div>';


      const data = [
        { pop: "total", count: dataJson.population },
        { pop: "homme", count: dataJson.population_male },
        { pop: "femme", count: dataJson.population_female },
      ];

      let dataAge = [];
      Object.entries(dataJsonAge.data).forEach(([key, val]) => {
        dataAge.push({ age: key, count: val })

      })

      addChart('pop', data, "pop", "count", 'population')
      addChart('pop2', dataAge, "age", "count", 'population par age')


    }
  }
}