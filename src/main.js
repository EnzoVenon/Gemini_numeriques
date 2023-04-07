
// ----------------- Imports ----------------- //
import { update/*, buildingLayer */ } from "./models/building";
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
import { addShp } from "./models/addShpLayer"
import { addSpecificBuilings } from "./models/extrudedBat"
import { importCsvFile } from "./models/readCsv"
import { addChart } from "./models/insee/showChart"
import * as contenuOnglet from "./models/contenuOnglets"
import { getBdnbInfo } from "./models/extractBdnbInfo"
import * as turf from "@turf/turf"
import { widgetNavigation } from "./jsItown/widgetNavigation"
import { getBdtopoInfo } from "./models/getBdtopoInfo"

// console.log(turf)
let bat = document.createElement('div');
bat.className = 'bat';
bat.id = 'bat';
//listBatSelectioner
let listSlect = []
let fidSelectf = [1, 2]
// Create a custom div which will be displayed as a label
const customDiv = document.createElement('div');
const bubble = document.createElement('div');
bubble.classList.add('bubble');
customDiv.appendChild(bubble);
const pointer = document.createElement('div');
pointer.classList.add('pointer');
customDiv.appendChild(pointer);


// ----------------- View Setup ----------------- //
// Define initial camera position
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 0.72829, 45.18260, 2),
    range: 200,
    tilt: 33,
}

const viewerDiv = document.getElementById('viewerDiv');
viewerDiv.appendChild(bat)

// Instanciate iTowns GlobeView
const view = new itowns.GlobeView(viewerDiv, placement);
setupLoadingScreen(viewerDiv, view);
FeatureToolTip.init(viewerDiv, view);
// ajout de widget de navigation
widgetNavigation(view)

// ----------------- Layers Setup ----------------- //
// Elevation layers
itowns.Fetcher.json('../data/layers/JSONLayers/WORLD_DTM.json')
    .then(result => addElevationLayer(result, view));
itowns.Fetcher.json('../data/layers/JSONLayers/IGN_MNT_HIGHRES.json')
    .then(result => addElevationLayer(result, view));

view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, function () { update(view) });

// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view));

// CSV files
let csv2 = importCsvFile("../data/csv/base-ic-couples-familles-menages-2019.CSV")
let csvBdnb = importCsvFile("../data/shp/prg/data_bdnb.csv")
let csvIdBdnbBdtopo = importCsvFile("../data/linker/bdnb_bdtopo.csv")

// ----------------- Globe Initialisatioin ----------------- //
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    addShp("../data/shp/prg/bdnb_perigeux8", "bdnb", "black", "", view, true)

});

const tooltip = document.getElementById('tooltip');
const htmlTest = document.getElementById('population');
viewerDiv.addEventListener(
    'mouseup',
    () => {

        fidSelectf.push(tooltip.value.properties.fid)
        console.log(tooltip.value.properties.fid)

        console.log(fidSelectf)

        if (fidSelectf[fidSelectf.length - 1] != fidSelectf[fidSelectf.length - 2]) {
            fidSelectf = [fidSelectf[fidSelectf.length - 1]]


            htmlTest.innerHTML = '';
            let textHtml = '';
            textHtml += '<div class="accordion" id="accordionPanelsStayOpenExample">';

            csv2
                .then(res => {
                    // ----------- POPULATION INSEE ----------- //
                    // Retrieve elements where Iris number is same as tooltip
                    let uniqueData = res.filter(obj => obj.IRIS === Number(tooltip.value.properties.code_iris))[0]
                    // const currentkey = contenuOnglet.getKeyByValue(uniqueData, Number(tooltip.value.properties.code_iris));

                    // Add INSEE value for this IRIS in tooltip properties
                    Object.entries(uniqueData).forEach(([key, value]) => {
                        if (!(value === Number(tooltip.value.properties.code_iris))) {
                            tooltip.value.properties[key] = value;
                        }
                    })

                    // Chart for INSEE values
                    // ----- Status 15 ans et plus ----- //
                    const relation15OuPlus = ['P19_POP15P_MARIEE', 'P19_POP15P_PACSEE', 'P19_POP15P_CONCUB_UNION_LIBRE', 'P19_POP15P_VEUFS', 'P19_POP15P_DIVORCEE', 'P19_POP15P_CELIBATAIRE']
                    const dataRelation15 = contenuOnglet.dataINSEE4Chart(relation15OuPlus, 11, tooltip.value.properties);
                    // Generate html accordion item
                    textHtml += contenuOnglet.generateAccordionItem("Status_15_ans+", 'status');

                    // ----- Répartition pop 15 ans et plus ----- //
                    const repartitionPop = ['P19_POP1524', 'P19_POP2554', 'P19_POP5579', 'P19_POP80P']
                    const dataRepartitionPop = contenuOnglet.dataINSEE4Chart(repartitionPop, 4, tooltip.value.properties);
                    // Generate html accordion item
                    textHtml += contenuOnglet.generateAccordionItem("Repartion_pop_15_ans+", 'repartition');

                    // ----- Nombre de familles avec enfants -25 ans ----- //
                    const enfant25 = ['C19_NE24F0', 'C19_NE24F1', 'C19_NE24F2', 'C19_NE24F3', 'C19_NE24F4P']
                    const dataEnfant25 = contenuOnglet.dataINSEE4Chart(enfant25, 4, tooltip.value.properties);
                    // Generate html accordion item
                    textHtml += contenuOnglet.generateAccordionItem("Nombre_famille_enfants_-25ans", 'enfant');

                    htmlTest.innerHTML += textHtml;

                    // Create charts
                    addChart('status', dataRelation15, 'name', 'value', 'Nombre de personnes');
                    addChart('repartition', dataRepartitionPop, 'name', 'value', "Nombre d'individus");
                    addChart('enfant', dataEnfant25, 'name', 'value', 'Nombre de familles');

                    // console.log(htmlTest.innerHTML)

                });

            let letRandomCOlor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            let randomId = tooltip.value.properties.batiment_g + letRandomCOlor

            listSlect.push(randomId)

            if (listSlect[1]) {

                let layerToRemove = view.getLayerById(listSlect[0]);
                view.removeLayer(listSlect[0]);
                console.log(layerToRemove)
                console.log(view)
                layerToRemove.delete()
                view.notifyChange()
                view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)

                listSlect = [listSlect[1]]
            } else {
                console.log("non")
            }

            console.log(tooltip.value)

            addSpecificBuilings("../data/shp/prg/bdnb_perigeux8", 100, "batiment_g", tooltip.value.properties.batiment_g, letRandomCOlor, view)

            let batGroupeIdBdnb = tooltip.value.properties.batiment_g

            getBdnbInfo(csvBdnb, batGroupeIdBdnb).then(res => {

                console.log(res),
                    // console.log(output)
                    // document.getElementById('batInfo').innerHTML = JSON.stringify(res)
                    document.getElementById('listHauteur').innerHTML = `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${res["bdtopo_bat_hauteur_mean"]} m</span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                    data-bs-custom-class="custom-tooltip"
                    data-bs-title="donnée issue de la bdnb sur l'attribut bdtopo_bat_hauteur_mean">
                    info
                </a>
                </div>
                  `

                document.getElementById('listConsoEnergie').innerHTML = `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${res["dpe_logtype_classe_conso_ener"]} m</span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                  data-bs-custom-class="custom-tooltip"
                  data-bs-title="donnée issue de la bdnb sur l'attribut dpe_logtype_classe_conso_ener">
                  info
              </a>
              </div>
                `

                document.getElementById('listConsoEnergie').innerHTML = `<div style="width:100%;display:flex; flex-direction:row;justify-content:space-around"> <span>${res["dpe_logtype_classe_conso_ener"]} m</span><a  href="#" data-bs-toggle="tooltip" data-bs-placement="right"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="donnée issue de la bdnb sur l'attribut dpe_logtype_classe_conso_ener">
                info
            </a>
            </div>
              `


                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
                const tooltipList = [...tooltipTriggerList]
                tooltipList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

                document.getElementById('batInfo').value = batGroupeIdBdnb
            })



            getBdtopoInfo(csvIdBdnbBdtopo, tooltip.value.properties.batiment_g)

            shapefile.open("../data/shp/prg/bdnb_perigeux8")
                .then(source => source.read()
                    .then(async function log(result) {
                        if (result.done) return "done";
                        // console.log(result.value.properties["batiment_g"])

                        if (result.value.properties["batiment_g"] === tooltip.value.properties.batiment_g) {
                            let selectedBatGeom = result.value.geometry.coordinates
                            let polygon = turf.polygon(selectedBatGeom)
                            shapefile.open("../data/shp/prg/osm")
                                .then(source => source.read()
                                    .then(function log(result) {
                                        if (result.done) return "done";
                                        // console.log(result.value.properties["osm_id"])
                                        let polygonOsm = turf.polygon(result.value.geometry.coordinates)

                                        // console.log(turf.booleanContains(polygon, centroidOsm))
                                        if (turf.intersect(polygonOsm, polygon)) {
                                            // addSpecificBuilings("../data/shp/prg/osm", 200, "osm_id", result.value.properties["osm_id"], "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view)
                                            return;
                                        }

                                        return source.read().then(log);
                                    }))
                        }
                        return source.read().then(log)


                    }
                    ))



        }



    },
)
htmlTest.innerHTML += '</div>';

