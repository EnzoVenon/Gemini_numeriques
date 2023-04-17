import { addChart } from "./insee/showChart"

// Json attribute name in source to name for user
const attribut2UserName = {
  libelle_adr_principale_ban: "Adresse",
  fiabilite_cr_adr_niv_1: "Fiabilité de l'adresse ",
  code_iris: "Code IRIS",
  libelle_commune_insee: "Commune",
  code_departement_insee: "Numéro de département",
  bdtopo_zoa_l_toponyme: "Toponyme",
  code_commune_insee: "Code INSEE",

  ffo_bat_annee_construction: "Année de construction",
  ETAT: "État du bâtiment",
  NATURE: "Nature",
  ffo_bat_usage_niveau_1_txt: "Usage",
  USAGE1: "Usage 1",
  USAGE2: "Usage 2",
  bdtopo_bat_altitude_sol_mean: "Altitude au sol",
  bdtopo_bat_hauteur_mean: "Hauteur du bâtiment",
  NB_ETAGES: "Nombre d'étages",
  DATE_CREAT: "Date de Création",
  nbEntrances: "Nombre d'entrées",
  nbHousing: "Nombre de logements",
  nbWorkingPlace: "Nombre de lieux de travail",

  argiles_alea: "Risque argile",
  radon_alea: "Risque radon",

  dpe_arrete_2021_nb_classe_conso_energie_arrete_2012: "Notes énergétique des logements",
  dpe_nb_classe_ener_a: "Notes énergétique des logements",
  dpe_nb_classe_ener_b: "Notes énergétique des logements",
  dpe_nb_classe_ener_c: "Notes énergétique des logements",
  dpe_nb_classe_ener_d: "Notes énergétique des logements",
  dpe_nb_classe_ener_e: "Notes énergétique des logements",
  dpe_nb_classe_ener_f: "Notes énergétique des logements",
  dpe_nb_classe_ener_g: "Notes énergétique des logements",
  dpe_nb_classe_ener_nc: "Notes énergétique des logements",
  dpe_nb_classe_ges_a: "Notes énergétique des logements",
  dpe_nb_classe_ges_b: "Notes énergétique des logements",
  dpe_nb_classe_ges_c: "Notes énergétique des logements",
  dpe_nb_classe_ges_d: "Notes énergétique des logements",
  dpe_nb_classe_ges_e: "Notes énergétique des logements",
  dpe_nb_classe_ges_f: "Notes énergétique des logements",
  dpe_nb_classe_ges_g: "Notes énergétique des logements",
  dpe_nb_classe_ges_nc: "Notes énergétique des logements",
  dpe_class_conso_ener_mean: "Notes énergétique des logements",
  dpe_conso_ener_mean: "Notes énergétique des logements",
  dpe_conso_ener_std: "Notes énergétique des logements",
  dpe_class_estim_ges_mean: "Notes énergétique des logements",
  dpe_estim_ges_mean: "Notes énergétique des logements",
  dpe_estim_ges_std: "Notes énergétique des logements",
  dpe_logtype_mur_pos_isol_ext: "Notes énergétique des logements",
  dpe_logtype_pb_pos_isol: "Notes énergétique des logements",
  dpe_logtype_ph_pos_isol: "Notes énergétique des logements",


  P19_POP15P_MARIEE: "Marié",
  P19_POP15P_PACSEE: "Pacsé",
  P19_POP15P_CONCUB_UNION_LIBRE: "Concubinage - union libre",
  P19_POP15P_VEUFS: "Veuf",
  P19_POP15P_DIVORCEE: "Divorcé",
  P19_POP15P_CELIBATAIRE: "Célibataire",
  P19_POP1524: "15-24 ans",
  P19_POP2554: "25-54 ans",
  P19_POP5579: "55-79 ans",
  P19_POP80P: "80+ ans",
  C19_NE24F0: "0 enfant",
  C19_NE24F1: "1 enfant",
  C19_NE24F2: "2 enfants",
  C19_NE24F3: "3 enfants",
  C19_NE24F4P: "4 enfants",
}

// Onglet batiment
const tabs = {
  ongletBatiment: [
    "bdtopo_bat_altitude_sol_mean",
    "bdtopo_bat_hauteur_mean",
    "ffo_bat_usage_niveau_1_txt",
    "ffo_bat_annee_construction",
    "DATE_CREAT",
    "ETAT",
    "NATURE",
    "NB_ETAGES",
    "USAGE1",
    "USAGE2",
    "nbEntrances",
    "nbHousing",
    "nbWorkingPlace"

  ],
  ongletRisque: [
    "radon_alea",
    "argiles_alea"
  ],
  ongletInfoGen: [
    "code_commune_insee",
    "code_departement_insee",
    "code_iris",
    "fiabilite_cr_adr_niv_1",
    "libelle_adr_principale_ban",
    "libelle_commune_insee",
    "bdtopo_zoa_l_toponyme"

  ],
  ongletEnergie: [
    "dpe_arrete_2021_nb_classe_conso_energie_arrete_2012",
    "dpe_nb_classe_ener_a",
    "dpe_nb_classe_ener_b",
    "dpe_nb_classe_ener_c",
    "dpe_nb_classe_ener_d",
    "dpe_nb_classe_ener_e",
    "dpe_nb_classe_ener_f",
    "dpe_nb_classe_ener_g",
    "dpe_nb_classe_ener_nc",
    "dpe_nb_classe_ges_a",
    "dpe_nb_classe_ges_b",
    "dpe_nb_classe_ges_c",
    "dpe_nb_classe_ges_d",
    "dpe_nb_classe_ges_e",
    "dpe_nb_classe_ges_f",
    "dpe_nb_classe_ges_g",
    "dpe_nb_classe_ges_nc",
    "dpe_class_conso_ener_mean",
    "dpe_conso_ener_mean",
    "dpe_conso_ener_std",
    "dpe_class_estim_ges_mean",
    "dpe_estim_ges_mean",
    "dpe_estim_ges_std",
    "dpe_logtype_mur_pos_isol_ext",
    "dpe_logtype_pb_pos_isol",
    "dpe_logtype_ph_pos_isol"
  ],
  ongletPopulation: [
    'P19_POP15P_MARIEE',
    'P19_POP15P_PACSEE',
    'P19_POP15P_CONCUB_UNION_LIBRE',
    'P19_POP15P_VEUFS',
    'P19_POP15P_DIVORCEE',
    'P19_POP15P_CELIBATAIRE',
    'P19_POP1524',
    'P19_POP2554',
    'P19_POP5579',
    'P19_POP80P',
    'C19_NE24F0',
    'C19_NE24F1',
    'C19_NE24F2',
    'C19_NE24F3',
    'C19_NE24F4P'
  ]
}


export function loadDataToJSON(dictionaryTofill, key, value, base) {

  /* 
  
      Load data into a JSON. 
      The returned variable's format is as follow:
          {
            tabInfoGen: [ { attribute: key, name4User: name4User, val: value, source: base },
                          { attribute: key, name4User: name4User, val: value, source: base },
                          ... ],
            tabBatiment: [ { attribute: key, name4User: name4User, val: value, source: base },
                          { attribute: key, name4User: name4User, val: value, source: base },
                          ... ],
            tabRisques: [ { attribute: key, name4User: name4User, val: value, source: base },
                          { attribute: key, name4User: name4User, val: value, source: base },
                          ... ],
            tabEnergie: [ { attribute: key, name4User: name4User, val: value, source: base },
                          { attribute: key, name4User: name4User, val: value, source: base },
                          ... ]
          }
  
  */
  let name4User = attribut2UserName[key];


  const jsonData = {
    attribut: key,
    name4User: name4User,
    val: value,
    source: base
  }
  if (tabs.ongletInfoGen.includes(key)) {
    dictionaryTofill.tabInfoGen.push(jsonData)
  } else if (tabs.ongletBatiment.includes(key)) {
    dictionaryTofill.tabBatiment.push(jsonData)
  } else if (tabs.ongletRisque.includes(key)) {
    dictionaryTofill.tabRisques.push(jsonData)
  } else if (tabs.ongletEnergie.includes(key)) {
    dictionaryTofill.tabEnergie.push(jsonData)
  } else if (tabs.ongletPopulation.includes(key)) {
    dictionaryTofill.tabPopulation.push(jsonData)
  }

  return dictionaryTofill;
}

export function generateAttributes4Tab(htmlID, tabName, listOfAttributes, keyTab) {
  /*

    Generates html accordion item for each attribute in the list of attributes given

  */

  if (listOfAttributes.length !== 0) {
    let textTest = ''
    const htmlElement = document.getElementById(htmlID);

    if (keyTab.includes(tabName)) {
      htmlElement.innerHTML = ''
      listOfAttributes.forEach((value) => {
        textTest = generateAccordion4Attribute(value.attribut, value.name4User, value.val, value.source)
        htmlElement.innerHTML += textTest
      })
    }
  }


}

export function generateAccordion4Attribute(attributeName, name4User, value, source) {

  /*

    Generate html accordion for the given attribute

  */

  let htmlText = '';
  htmlText += '<div class="accordion-item">'
  htmlText += '<h2 class="accordion-header" id="heading' + attributeName + '">'
  htmlText += '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse' + attributeName + '" aria-expanded="false" aria-controls="collapse' + attributeName + '">'
  htmlText += name4User
  htmlText += '</button></h2></div>'
  htmlText += '<div id="collapse' + attributeName + '" class="accordion-collapse collapse" aria-labelledby="heading' + attributeName + '">'
  htmlText += '<div class="accordion-body" id="info' + attributeName + '">'
  htmlText += '<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around">'
  htmlText += '<span>' + value + '</span>'
  htmlText += '<a href="#" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="custom-tooltip" data-bs-title="Donnée issue de la ' + source + ' sur ' + attributeName + '">'
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