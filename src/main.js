
// ----------------- Imports ----------------- //
import { addOrthoLayer } from "./js/affichageItown/ortho";
import { addElevationLayer } from "./js/affichageItown/elevation";
import { addShp } from "./js/affichageItown/addShpLayer"
import { addSpecificBuilings } from "./js/affichageItown/extrudedBat"
import { importCsvFile } from "./js/models/readCsv"
import { addChart } from "./js/models/insee/showChart"
import * as contenuOnglet from "./js/models/contenuOnglets"
import { getBdnbInfo } from "./js/models/extractBdnbInfo"
import * as turf from "@turf/turf"
import { widgetNavigation } from "./js/jsItown/widgetNavigation"
import { loadBufferDataFromShp } from "./js/recuperationDonnee/dataFromShpDbf.js"
import { geojsontToFeatureGeom } from "./js/affichageItown/geojsontToFeatureGeom"
import Style from "./js/models/style.js";
import { loadDataToJSON, generateAttributes4Tab } from "./js/models/connectDataToBuidlings";
import { geosjontToColorLayer } from "./js/affichageItown/drop2dData"
import { updateSelectOption } from "./js/affichageHtml/updateSelectionFromGeojson"
import { updateSelectOptionFromList } from "./js/affichageHtml/updateSelectOptionFromList"
import { getUniquePropNames } from "./js/utile/getUniquePropertiesNamesFromGeojson"
import { addShpLayerOnChange } from "./js/affichageItown/addShpLayerOnchange";
import * as shp from "shpjs";

// ----------------- Variables ----------------- //
// les constantes et variable globales
const THREE = itowns.THREE
const paths = { "bdnb": "../data/shp/prg/bdnb_perigeux8", "bdtopo": "../data/shp/prg/bd_topo_2", "bdtopoParis": "../data/shp/paris_11/bdtopo_paris11", "osm": "../data/shp/prg/osm", "cadastre": "../data/shp/prg/cadastre_perigeux8", "innodation_perigeux": "../data/shp/innondation/forte/n_tri_peri_inondable_01_01for_s_024", "bat_inond_prg": "../data/shp/prg/bat_innondable" }
let bat = document.createElement('div');
bat.className = 'bat';
bat.id = 'bat';
//listBatSelectioner
let listSlect = []
let fidSelectf = [1, 2]
let batInorandomId = { "ino_random_id": { name: "innondation", num: 0, id: "innondation_0" }, "bdnb_random_id": { name: "bdnb", num: 0, id: "bdnb_0" }, "bdtopo_radom_id": { name: "bdtopo", num: 0, id: "bdtopo_0" }, "osm_random_id": { name: "osm", num: 0, id: "osm_0" }, "cadastre_random_id": { name: "cadastre", num: 0, id: "cadastre_0" } }

let dropedGeojson = { "2dDrop": {}, "2dDropId": { name: "2dDropId", num: 0, id: "2dDropId_0" }, "3dDropId": { name: "3dDropId", num: 0, id: "3dDropId_0" }, };

let csvJoinAtt = { "updatedGeojson": {}, "csvLayerId": { name: "updatedLayerWithCsv", num: 0, id: "updatedLayerWithCsv_0" } };


let dataFromCsv;
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


let placement = {
    //  Coordinates of Perigueux
    coord: new itowns.Coordinates('EPSG:4326', 0.72829, 45.18260, 2),
    // coord: new itowns.Coordinates('EPSG:4326', 2.380015, 48.859424, 2),
    range: 200,
    tilt: 33,
}


const switchbutton = document.getElementById('site_state')

const viewerDiv = document.getElementById('viewerDiv');
viewerDiv.appendChild(bat)

// Instanciate iTowns GlobeView
const view = new itowns.GlobeView(viewerDiv, placement);
setupLoadingScreen(viewerDiv, view);
FeatureToolTip.init(viewerDiv, view);
// add de widget navigation
widgetNavigation(view)

// Instanciate changement localisation
document.getElementById("changloc").addEventListener("click", () => {
    let cameraTargetPosition = view.controls.getLookAtCoordinate();

    if (switchbutton.checked) {
        cameraTargetPosition.x = 2.380015
        cameraTargetPosition.y = 48.859424
        cameraTargetPosition.z = 86


    }

    else {
        cameraTargetPosition.x = 0.72829
        cameraTargetPosition.y = 45.18260
        cameraTargetPosition.z = 86

    }
    view.camera.camera3D.position.copy(cameraTargetPosition.as(view.referenceCrs));
    view.camera.camera3D.updateMatrixWorld();
    view.notifyChange(view.camera.camera3D, true);


})

document.getElementById("changloc").addEventListener("click", () => {
    let cameraTargetPosition = view.controls.getLookAtCoordinate();

    if (switchbutton.unchecked) {
        cameraTargetPosition.x = 0.72829
        cameraTargetPosition.y = 45.18260
        cameraTargetPosition.z = 86

    }
    view.camera.camera3D.position.copy(cameraTargetPosition.as(view.referenceCrs));
    view.camera.camera3D.updateMatrixWorld();
    view.notifyChange(view.camera.camera3D, true);


})



// ----------------- Layers Setup ----------------- //
// Elevation layers
itowns.Fetcher.json('../data/layers/JSONLayers/WORLD_DTM.json')
    .then(result => addElevationLayer(result, view));
itowns.Fetcher.json('../data/layers/JSONLayers/IGN_MNT_HIGHRES.json')
    .then(result => addElevationLayer(result, view));

// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view));

// CSV files
let csvMenageINSEE = importCsvFile("../data/csv/base-ic-couples-familles-menages-2019.CSV")
let csvBdnb = importCsvFile("../data/shp/prg/data_bdnb.csv")
let csvBdnbParis = importCsvFile("../data/csv/bdnb_paris11.csv")

let csvBuildingICI = importCsvFile("../data/csv/ICI-csv/building.csv")
let csvHouseholdICI = importCsvFile("../data/csv/ICI-csv/household.csv")
let csvHousingICI = importCsvFile("../data/csv/ICI-csv/housing.csv")
let csvIndividualICI = importCsvFile("../data/csv/ICI-csv/individual.csv")
let dataBdnb;


// Promise Geojson for each source
let bdnbPromisedJson = loadBufferDataFromShp(paths.bdnb);
let bdtopoPromisedJson = loadBufferDataFromShp(paths.bdtopo)
let osmPromisedJson = loadBufferDataFromShp(paths.osm)
let cadastrePromisedJson = loadBufferDataFromShp(paths.cadastre)

// let geojson 
let bdnbGeoJson

// ----------------- Globe Initialisatioin ----------------- //
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, async function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    addShp("../data/shp/paris_11/paris11_bdnb", "bdnbParis", "red", "", view, true)

    bdnbGeoJson = await bdnbPromisedJson

    bdnbGeoJson.features.forEach((feature) => {
        let data = dataBdnb[feature.properties["batiment_g"]]
        if (data) {
            feature.properties = data
        }
    });

    await addShp("../data/shp/prg/bdnb_perigeux8", "bdnb", "black", "", view, true);

    await csvBdnb.then(res => {
        // Récupérer les valeurs uniques de la propriété "type"
        dataBdnb = res.reduce((result, prop) => {
            result[prop.batiment_groupe_id] = Object.entries(prop).reduce((a, [k, v]) => (v === null ? a : (a[k] = v, a)), {})

            return result;
        }, {});
    });

    let checkbox_3D = document.getElementById("checkbox_style_3D");
    let select_style = document.getElementById("select_style");
    let button_style_apply = document.getElementById("button_style_apply");

    //Getting the source (as something other than a Shp because itowns can't extrude them)
    let src_bdnb;
    await loadBufferDataFromShp(paths.bdnb).then(geojson => {
        geojson.features.forEach((feature) => {
            let data = dataBdnb[feature.properties["batiment_g"]]
            if (data) {
                feature.properties = data
            }
        });
        src_bdnb = new itowns.FileSource({
            fetchedData: geojson,
            crs: 'EPSG:4326',
            format: 'application/json',
        })
    });

    //Styles definition
    let style_list = [];
    style_list.push(
        new Style("Notes consommation d'énergie", view, src_bdnb, "dpe_logtype_classe_conso_ener", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setClasses({
                "A": "rgb(1,149,65)",
                "B": "rgb(83,174,50)",
                "C": "rgb(202,211,0)",
                "D": "rgb(255,223,1)",
                "E": "rgb(251,185,1)",
                "F": "rgb(237,102,7)",
                "G": "rgb(228,19,18)"
            })
    );
    style_list.push(
        new Style("Hauteur", view, src_bdnb, "bdtopo_bat_hauteur_mean", true)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setGradation("rgb(255,0,0)")
    );
    style_list.push(
        new Style("Iris", view, src_bdnb, "code_iris", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
    );

    //Setting the predefined styles
    for (let i = 0; i < style_list.length; i++) {
        select_style.innerHTML += "<option value='" + i + "'>" + style_list[i].name + "</option>";
    }

    button_style_apply.addEventListener("click", () => {
        if (select_style.value == -1) {
            style_list[0].clean();
        } else {
            const style = style_list[select_style.value];
            //If the 3D checkbox is checked and the ground and height fields values are filled, style is set to 3D
            style.to3D(checkbox_3D.checked);
            style.to_itowns_layer();
            document.getElementById("legend").replaceChildren(style.getLegend());
        }
    });



});

// ----------------- Variables to display content in tabs ----------------- //
const tooltip = document.getElementById('tooltip');
const htmlTest = document.getElementById('listConsoPopulationIris');
viewerDiv.addEventListener(
    'mouseup',
    () => {

        fidSelectf.push(tooltip.value.properties.fid)

        if (fidSelectf[fidSelectf.length - 1] != fidSelectf[fidSelectf.length - 2]) {
            fidSelectf = [fidSelectf[fidSelectf.length - 1]]

            let valuesToDisplay = {
                tabInfoGen: [],
                tabBatiment: [],
                tabRisques: [],
                tabEnergie: [],
                tabPopulation: []
            }
            htmlTest.innerHTML = '';
            let textHtml = '';
            textHtml += '<div class="accordion" id="accordionPanelsStayOpenExample">';

            let letRandomCOlor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            let randomId = tooltip.value.properties.batiment_c + letRandomCOlor

            listSlect.push(randomId)


            if (listSlect[1]) {

                let layerToRemove = view.getLayerById(listSlect[0]);
                view.removeLayer(listSlect[0]);
                layerToRemove.delete()
                view.notifyChange()
                view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)

                listSlect = [listSlect[1]]
            } else {
                console.log("non")
            }


            addSpecificBuilings("../data/shp/prg/bdnb_perigeux8", "batiment_c", tooltip.value.properties.batiment_c, letRandomCOlor, view, THREE)
            addSpecificBuilings("../data/shp/paris_11/paris11_bdnb", "batiment_c", tooltip.value.properties.batiment_c, letRandomCOlor, view, THREE)
            console.log(tooltip.value)

            let tooltipBuildingID = tooltip.value.properties.batiment_c
            if (tooltipBuildingID.includes('-')) {
                tooltipBuildingID = tooltipBuildingID.slice(0, -2)
            }


            getBdnbInfo(csvBdnbParis, "batiment_g", tooltip.value.properties.batiment_g)
                .then(res => {
                    // ----------- Get Bdnb data ----------- //
                    // Dispatch Bdnb data for each tab
                    let valDisplayed;
                    Object.entries(res).forEach(([key, value]) => {
                        valDisplayed = loadDataToJSON(valuesToDisplay, key, value, "bdnb")
                    })
                    return valDisplayed;

                })
                .then(async (val2display) => {
                    // ----------- Get Building ICI data ----------- //
                    let displayICI = await csvBuildingICI
                    let dataBuildingICI;
                    let valDisplayBuildingICI
                    Object.entries(displayICI).forEach((value) => {
                        if (value[1].idBdTopo) {
                            if (value[1].idBdTopo.includes(tooltipBuildingID)) {
                                dataBuildingICI = value[1];
                                return dataBuildingICI;
                            }
                        }
                    })
                    Object.entries(dataBuildingICI).forEach(([key, value]) => {
                        valDisplayBuildingICI = loadDataToJSON(val2display, key, value, "Building ICI")
                    })

                    // ----------- Get Housing ICI IDs ----------- //
                    let displayHousing = await csvHousingICI
                    let housings_IDs = []
                    Object.entries(displayHousing).forEach((value) => {
                        if (value[1].BuildingID) {
                            if (value[1].BuildingID.includes(dataBuildingICI.ID)) {
                                housings_IDs.push(value[1].ID)
                            }
                        }
                    })

                    // ----------- Get Household ICI data ----------- //
                    let housingDictionnary = {}
                    let displayHousehold = await csvHouseholdICI
                    let dataJSONattributeHousehold;
                    Object.entries(displayHousehold).forEach((value) => {
                        if (housings_IDs.includes(value[1].HousingID)) {
                            housingDictionnary[value[1].ID] = {}
                            housingDictionnary[value[1].ID]["household"] = []
                            Object.entries(value[1]).forEach(([key, val]) => {
                                dataJSONattributeHousehold = loadDataToJSON({}, key, val, "Household ICI", true)
                                if (Object.keys(dataJSONattributeHousehold).length !== 0) {
                                    housingDictionnary[value[1].ID]["household"].push(dataJSONattributeHousehold)
                                }
                            })
                        }
                    })
                    Object.entries(housingDictionnary).forEach(([key, value]) => {
                        if (Object.keys(value).length === 0) {
                            delete housingDictionnary[key]
                        }
                    })
                    // for each housing get associated household
                    let householdIDs = []
                    Object.entries(housingDictionnary).forEach((val) => {
                        householdIDs.push(val[0])
                    })

                    // ----------- Get Individual ICI data ----------- //
                    let displayIndividual = await csvIndividualICI
                    let dataJSONattributeIndividual;
                    Object.entries(displayIndividual).forEach((value) => {
                        if (value[1].IDHousehold) {
                            let individualList = []
                            if (householdIDs.includes(value[1].IDHousehold)) {
                                Object.entries(value[1]).forEach(([key, val]) => {
                                    dataJSONattributeIndividual = loadDataToJSON({}, key, val, "Individual ICI", true)
                                    if (Object.keys(dataJSONattributeIndividual).length !== 0) {
                                        individualList.push(dataJSONattributeIndividual)
                                    }
                                })
                                if (housingDictionnary[value[1].IDHousehold]["individuals"]) {
                                    housingDictionnary[value[1].IDHousehold]["individuals"].push(individualList)
                                } else {
                                    housingDictionnary[value[1].IDHousehold]["individuals"] = [individualList]
                                }
                            }
                        }

                    })
                    valDisplayBuildingICI.tabPopulation = housingDictionnary;
                    console.log(valDisplayBuildingICI)
                    return valDisplayBuildingICI

                })
                .then(res => console.log(res))

            getBdnbInfo(csvBdnb, "batiment_groupe_id", tooltip.value.properties.batiment_g)
                .then(res => {

                    // ----------- Get Bdnb data ----------- //
                    // Dispatch Bdnb data for each tab
                    let valDisplayed;
                    Object.entries(res).forEach(([key, value]) => {
                        valDisplayed = loadDataToJSON(valuesToDisplay, key, value, "bdnb")
                    })
                    return valDisplayed;

                })
                .then(result => {
                    let valDisplay2 = csvMenageINSEE
                        .then(res => {
                            // ----------- POPULATION INSEE ----------- //
                            let valDisplayedPop;
                            // Retrieve elements where Iris number is same as tooltip
                            let uniqueData = res.filter(obj => obj.IRIS === Number(tooltip.value.properties.code_iris))[0]

                            // Add INSEE value for this IRIS in tooltip properties
                            Object.entries(uniqueData).forEach(([key, value]) => {
                                valDisplayedPop = loadDataToJSON(result, key, value, "INSEE")
                            })

                            // Chart for INSEE values
                            const dataList4Chart = {
                                status15OuPlus: ['P19_POP15P_MARIEE', 'P19_POP15P_PACSEE', 'P19_POP15P_CONCUB_UNION_LIBRE', 'P19_POP15P_VEUFS', 'P19_POP15P_DIVORCEE', 'P19_POP15P_CELIBATAIRE'],
                                repartitionPop: ['P19_POP1524', 'P19_POP2554', 'P19_POP5579', 'P19_POP80P'],
                                enfant25: ['C19_NE24F0', 'C19_NE24F1', 'C19_NE24F2', 'C19_NE24F3', 'C19_NE24F4P']
                            }
                            let data4Chart = [];
                            Object.entries(dataList4Chart).forEach(([key, value]) => {
                                console.log(key)
                                data4Chart.push(contenuOnglet.dataINSEE4Chart(value, valDisplayedPop.tabPopulation))
                            })

                            // ----- Generate HTML text ----- //
                            textHtml += contenuOnglet.generateAccordionItem("Status_15_ans+", 'status');
                            textHtml += contenuOnglet.generateAccordionItem("Repartion_pop_15_ans+", 'repartition');
                            textHtml += contenuOnglet.generateAccordionItem("Nombre_famille_enfants_-25ans", 'enfant');

                            htmlTest.innerHTML += textHtml;

                            // Create charts
                            addChart('status', data4Chart[0], 'name', 'value', 'Nombre de personnes');
                            addChart('repartition', data4Chart[1], 'name', 'value', "Nombre d'individus");
                            addChart('enfant', data4Chart[2], 'name', 'value', 'Nombre de familles');

                            return valDisplayedPop;
                        })
                    return valDisplay2
                })
                .then(result => {
                    // ----------- Get BdTopo data ----------- //
                    bdtopoPromisedJson
                        .then(geojson => {
                            let dataBdTopo = geojson.features.filter(obj => {
                                if (tooltip.value.properties.batiment_c.includes(obj.properties.ID)) {
                                    return obj;
                                }
                            })
                            return dataBdTopo[0]
                        })
                        .then(res => {
                            let valDisplayedBdTopo;
                            if (res.properties) {
                                Object.entries(res.properties).forEach(([key, value]) => {
                                    valDisplayedBdTopo = loadDataToJSON(result, key, value, "BDTopo")
                                })
                                return valDisplayedBdTopo;
                            }
                        })
                        .then(res => {
                            // ----------- Generate html accordion item for each value ----------- //
                            Object.entries(res).forEach(([key, value]) => {
                                generateAttributes4Tab('infoGenAccordion', 'tabInfoGen', value, key)
                                generateAttributes4Tab('batimentAccordion', 'tabBatiment', value, key)
                                generateAttributes4Tab('RisquesAccordion', 'tabRisques', value, key)
                                generateAttributes4Tab('energieAccordion', 'tabEnergie', value, key)

                            })
                            // for info link
                            const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
                            const tooltipList = [...tooltipTriggerList]
                            tooltipList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
                        })

                })

            shapefile.open("../data/shp/prg/bdnb_perigeux8")
                .then(source => source.read()
                    .then(async function log(result) {
                        if (result.done) return "done";

                        if (result.value.properties["batiment_g"] === tooltip.value.properties.batiment_g) {
                            let selectedBatGeom = result.value.geometry.coordinates
                            let polygon = turf.polygon(selectedBatGeom)
                            shapefile.open("../data/shp/prg/osm")
                                .then(source => source.read()
                                    .then(function log(result) {
                                        if (result.done) return "done";
                                        let polygonOsm = turf.polygon(result.value.geometry.coordinates)

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

// layer savoir plus
addShpLayerOnChange("showIgnLayer", paths.bdtopo, "bd_topo", "red", "", view)
addShpLayerOnChange("showOsmLayer", paths.osm, "osm", "yellow", "", view)
addShpLayerOnChange("showCadastreLayer", paths.cadastre, "cadastre", "red", "", view)



document.getElementById("showInnondationLayer").addEventListener("change", () => {
    if (document.getElementById("showInnondationLayer").checked) {
        addShp(paths.innodation_perigeux, "inno", "black", "blue", view, false)

        batInorandomId.ino_random_id.num += 1;
        batInorandomId.ino_random_id.id = batInorandomId.ino_random_id.name + "_" + batInorandomId.ino_random_id.num
        loadBufferDataFromShp(paths.bat_inond_prg).then(geojson => {
            geojsontToFeatureGeom(geojson, "selectPropValue", batInorandomId.ino_random_id.id, true, view, THREE)
        })

    }
    else {
        view.removeLayer(batInorandomId.ino_random_id.id)
        view.removeLayer("inno")

    }
})


document.getElementById("exploredata").addEventListener("change", () => {
    if (document.getElementById("exploredata").checked) {
        bdnbPromisedJson.then(geojson => {
            geojson.features.forEach((feature) => {
                let data = dataBdnb[feature.properties["batiment_g"]]
                if (data) {
                    feature.properties = data
                }

            });
            batInorandomId.bdnb_random_id.num += 1;
            batInorandomId.bdnb_random_id.id = batInorandomId.bdnb_random_id.name + "_" + batInorandomId.bdnb_random_id.num
            updateSelectOption("selectProp", geojson)
            geojsontToFeatureGeom(geojson, "argiles_alea", batInorandomId.bdnb_random_id.id, false, view, THREE)

        })



    }
    else {
        view.removeLayer(batInorandomId.bdnb_random_id.id)
    }

})

document.getElementById("exploredataIgn").addEventListener("change", () => {
    if (document.getElementById("exploredataIgn").checked) {
        batInorandomId.bdtopo_radom_id.num += 1;
        batInorandomId.bdtopo_radom_id.id = batInorandomId.bdtopo_radom_id.name + "_" + batInorandomId.bdtopo_radom_id.num
        bdtopoPromisedJson.then(geojson => {
            updateSelectOption("selectProp", geojson)
            geojsontToFeatureGeom(geojson, "USAGE1", batInorandomId.bdtopo_radom_id.id, false, view, THREE)
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.bdtopo_radom_id.id)
    }

})

document.getElementById("exploredataOsm").addEventListener("change", () => {
    if (document.getElementById("exploredataOsm").checked) {
        batInorandomId.osm_random_id.num += 1;
        batInorandomId.osm_random_id.id = batInorandomId.osm_random_id.name + "_" + batInorandomId.osm_random_id.num
        osmPromisedJson.then(geojson => {
            updateSelectOption("selectProp", geojson)
            geojsontToFeatureGeom(geojson, "fclass", batInorandomId.osm_random_id.id, false, view, THREE)

        }
        )

    }
    else {
        view.removeLayer(batInorandomId.osm_random_id.id)
    }

})

document.getElementById("exploredataCadastre").addEventListener("change", () => {
    if (document.getElementById("exploredataCadastre").checked) {
        batInorandomId.cadastre_random_id.num += 1;
        batInorandomId.cadastre_random_id.id = batInorandomId.cadastre_random_id.name + "_" + batInorandomId.cadastre_random_id.num
        cadastrePromisedJson.then(geojson => {
            updateSelectOption("selectProp", geojson)
            geojsontToFeatureGeom(geojson, "fclass", batInorandomId.cadastre_random_id.id, false, view, THREE)
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.cadastre_random_id.id)
        batInorandomId.cadastre_random_id = ""
    }

})

document.getElementById("confirmExporation").addEventListener("click", () => {
    // Object.entries(batInorandomId).forEach(([key, val]) => {
    //     if (key != "ino_random_id" && val != "") {
    //         view.removeLayer(val)
    //     }
    // })

    const selectPropValue = document.getElementById('selectProp').value;
    const ign = document.getElementById("exploredataIgn").checked;
    if (ign) {
        view.removeLayer(batInorandomId.bdtopo_radom_id.id)
        batInorandomId.bdtopo_radom_id.num += 1;
        batInorandomId.bdtopo_radom_id.id = batInorandomId.bdtopo_radom_id.name + "_" + batInorandomId.bdtopo_radom_id.num
        bdtopoPromisedJson.then(geojson => {
            updateSelectOption("selectProp", geojson)
            geojsontToFeatureGeom(geojson, selectPropValue, batInorandomId.bdtopo_radom_id.id, false, view, THREE)
        }
        )
    }

    const bdnb = document.getElementById("exploredata").checked;
    if (bdnb) {
        view.removeLayer(batInorandomId.bdnb_random_id.id)
        batInorandomId.bdnb_random_id.num += 1;
        batInorandomId.bdnb_random_id.id = batInorandomId.bdnb_random_id.name + "_" + batInorandomId.bdnb_random_id.num
        console.log(batInorandomId.bdnb_random_id)
        bdnbPromisedJson.then(geojson => {
            geojsontToFeatureGeom(geojson, false, selectPropValue, batInorandomId.bdnb_random_id.id, false, view, THREE)
        })
    }


    const osm = document.getElementById("exploredataOsm").checked;
    if (osm) {
        view.removeLayer(batInorandomId.osm_random_id.id)
        batInorandomId.osm_random_id.num += 1;
        batInorandomId.osm_random_id.id = batInorandomId.osm_random_id.name + "_" + batInorandomId.osm_random_id.num
        osmPromisedJson.then(geojson => {
            updateSelectOption("selectProp", geojson)
            geojsontToFeatureGeom(geojson, selectPropValue, batInorandomId.osm_random_id.id, false, view, THREE)

        }
        )
    }

    const cad = document.getElementById("exploredataCadastre").checked;
    if (cad) {
        view.removeLayer(batInorandomId.cadastre_random_id.id)
        batInorandomId.cadastre_random_id.num += 1;
        batInorandomId.cadastre_random_id.id = batInorandomId.cadastre_random_id.name + "_" + batInorandomId.cadastre_random_id.num
        cadastrePromisedJson.then(geojson => {
            updateSelectOption("selectProp", geojson)
            geojsontToFeatureGeom(geojson, true, selectPropValue, batInorandomId.cadastre_random_id.id, false, view, THREE)
        }
        )
    }
})


let dropZone = document.getElementById('drop-zone');

dropZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', function () {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    var files = e.dataTransfer.files;
    if (files.length > 0) {
        var file = files[0];
        if (file.type === 'application/zip') {
            // Handle the ZIP file
            // console.log(file);
            var reader = new FileReader();
            reader.onload = function (event) {
                var arrayBuffer = event.target.result;
                // Handle the arrayBuffer
                console.log(arrayBuffer);
                //for the shapefiles in the files folder called pandr.shp
                shp(arrayBuffer).then(function (geojson) {
                    //see bellow for whats here this internally call shp.parseZip()
                    console.log(geojson)

                    updateSelectOption("select2dZiped", geojson)

                    dropedGeojson["2dDrop"] = geojson
                });

            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Please drop a ZIP file');
        }
    }
});


var affiche2dFile = document.getElementById('afficheDrop2d');

affiche2dFile.addEventListener("click", () => {

    if (dropedGeojson["2dDropId"].id !== "2dDropId_0") {
        view.removeLayer(dropedGeojson["2dDropId"].id)
    }

    dropedGeojson["2dDropId"].num += 1;
    dropedGeojson["2dDropId"].id = dropedGeojson["2dDropId"].name + "_" + dropedGeojson["2dDropId"].num

    let geojson = dropedGeojson["2dDrop"]
    console.log(geojson)
    const select2dZiped = document.getElementById('select2dZiped').value;
    geosjontToColorLayer(geojson, select2dZiped, dropedGeojson["2dDropId"].id, false, view)
}
)

document.getElementById("checkbox-supprime-2ddrop").addEventListener("click", () => {
    console.log(dropedGeojson)
    view.removeLayer(dropedGeojson["2dDropId"].id)
    dropedGeojson["2dDropId"].num = 0
    dropedGeojson["2dDropId"].id = "2dDropId_0"
})


//================================== Drop zone 3d =========================================//
let dropZone3d = document.getElementById('drop-zone-3D');

dropZone3d.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZone3d.classList.add('drag-over');
});

dropZone3d.addEventListener('dragleave', function () {
    dropZone3d.classList.remove('drag-over');
});

dropZone3d.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZone3d.classList.remove('drag-over');
    var files = e.dataTransfer.files;
    if (files.length > 0) {
        var file = files[0];
        if (file.type === 'application/zip') {
            // Handle the ZIP file
            // console.log(file);
            var reader = new FileReader();
            reader.onload = function (event) {
                var arrayBuffer = event.target.result;
                // Handle the arrayBuffer
                console.log(arrayBuffer);
                //for the shapefiles in the files folder called pandr.shp
                shp(arrayBuffer).then(function (geojson) {
                    //see bellow for whats here this internally call shp.parseZip()
                    console.log(geojson)

                    updateSelectOption("selectHauteur3dZiped", geojson)

                    updateSelectOption("selectAltiSol3dZiped", geojson)

                    updateSelectOption("selectCol3dZiped", geojson)

                    dropedGeojson["3dDrop"] = geojson
                });

            };
            reader.readAsArrayBuffer(file);
        } else {
            alert('Please drop a ZIP file');
        }
    }
});



var affiche3dFile = document.getElementById('afficheDrop3d');

affiche3dFile.addEventListener("click", () => {
    if (dropedGeojson["3dDropId"].id !== "3dDropId_0") {
        view.removeLayer(dropedGeojson["3dDropId"].id)
    }

    dropedGeojson["3dDropId"].num += 1;
    dropedGeojson["3dDropId"].id = dropedGeojson["3dDropId"].name + "_" + dropedGeojson["3dDropId"].num

    let geojson = dropedGeojson["3dDrop"]

    const selectHauteur3dZiped = document.getElementById('selectHauteur3dZiped').value;
    const selectAltiSol3dZiped = document.getElementById('selectAltiSol3dZiped').value;
    const selectCol3dZiped = document.getElementById('selectCol3dZiped').value;

    geojsontToFeatureGeom(geojson, selectCol3dZiped, dropedGeojson["3dDropId"].id, false, view, THREE, selectHauteur3dZiped, selectAltiSol3dZiped)
}
)



document.getElementById("checkbox-supprime-3ddrop").addEventListener("click", () => {
    console.log(dropedGeojson)
    view.removeLayer(dropedGeojson["3dDropId"].id)
    dropedGeojson["3dDropId"].num = 0
    dropedGeojson["3dDropId"].id = "3dDropId_0"
})

//========================== csv join 

let dropZoneCsv = document.getElementById('drop-zone-csv');

dropZoneCsv.addEventListener('dragover', function (e) {
    e.preventDefault();
    dropZoneCsv.classList.add('drag-over');
});

dropZoneCsv.addEventListener('dragleave', function () {
    dropZoneCsv.classList.remove('drag-over');
});

dropZoneCsv.addEventListener('drop', function (e) {
    e.preventDefault();
    dropZoneCsv.classList.remove('drag-over');

    let file;
    var files = e.dataTransfer.files;
    if (files.length > 0) {
        file = files[0];
    }

    const reader = new FileReader();

    reader.onload = () => {
        let records = [];

        const data = reader.result;
        const rows = data.split('\n');
        const headers = rows[0].split(',');

        updateSelectOptionFromList("attJointureCsv", headers)

        updateSelectOptionFromList("selectCouleurCsv", headers)


        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(',');
            let record = {};

            for (let j = 0; j < headers.length; j++) {
                record[headers[j]] = values[j];
            }


            record = Object.entries(record).reduce((a, [k, v]) => (v === null || v === "" ? a : (a[k] = v, a)), {})
            records.push(record);
        }
        dataFromCsv = records

        // console.log(records);
    };

    reader.readAsText(file);

    console.log(view.getLayers())

    let LayersName = view.getLayers().reduce((result, layer) => {
        result.push(layer.id)
        return result
    }, [])

    updateSelectOptionFromList("selectJoinLayer", LayersName)



});

document.getElementById("selectJoinLayer").addEventListener("change", () => {
    let selectedValue = document.getElementById("selectJoinLayer").value
    console.log(selectedValue)
    console.log(view.getLayerById(selectedValue))
    let geojson = view.getLayerById(selectedValue).source.fetchedData

    let uniquenames = getUniquePropNames(geojson)

    updateSelectOptionFromList("selectJoinAttribut", uniquenames)

    let selectChampJointure = document.getElementById("attJointureCsv").value
    let selectCibleChampJointure = document.getElementById("selectJoinAttribut").value

    console.log(dataFromCsv)

    let csvTojson = dataFromCsv.reduce((result, prop) => {
        result[prop[selectChampJointure]] = prop
        // console.log(prop)
        return result
    }, {})

    console.log(csvTojson)

    console.log(geojson)

    geojson.features.forEach((feature) => {
        let data = csvTojson[feature.properties[selectCibleChampJointure]]

        if (data) {
            Object.entries(data).forEach(([key, val]) => {
                feature.properties[key] = val
                console.log(feature.properties)
            })
        }
    });

    console.log(geojson)

    view.removeLayer(selectedValue)

    csvJoinAtt.updatedGeojson = geojson;




})

document.getElementById("afficheDropCsv").addEventListener("click", () => {
    if (csvJoinAtt.csvLayerId.id !== "updatedLayerWithCsv_0") {
        view.removeLayer(csvJoinAtt["csvLayerId"].id)
    }

    csvJoinAtt["csvLayerId"].num += 1;
    csvJoinAtt["csvLayerId"].id = csvJoinAtt["csvLayerId"].name + "_" + csvJoinAtt["csvLayerId"].num

    let geojson = csvJoinAtt.updatedGeojson

    console.log(geojson)

    const selectCol3dZiped = document.getElementById('selectCouleurCsv').value;

    geojsontToFeatureGeom(geojson, selectCol3dZiped, "fsdfdsfgdsg", false, view, THREE)
}
)