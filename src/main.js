
// ----------------- Imports ----------------- //
import { addOrthoLayer } from "./js/affichage/affichageItown/ortho";
import { addElevationLayer } from "./js/affichage/affichageItown/elevation";
import { addShp } from "./js/affichage/affichageItown/addShpLayer"
import { addSpecificBuilings } from "./js/affichage/affichageItown/extrudedBat"
import { importCsvFile } from "./js/recuperationDonnee/readCsv"
import { getBdnbInfo } from "./js/connectionDonnee/extractBdnbInfo"
import * as turf from "@turf/turf"
import { widgetNavigation } from "./js/jsItown/widgetNavigation"
import { loadBufferDataFromShp } from "./js/recuperationDonnee/dataFromShpDbf.js"
import { geojsontToFeatureGeom } from "./js/affichageItown/geojsontToFeatureGeom"
import Style from "./js/affichage/affichageItown/style.js";
import { spreadDataToTabs, generateAttributes4Tab } from "./js/affichage/affichageHtml/connectDataToTabs";
import { geosjontToColorLayer } from "./js/affichage/affichageItown/drop2dData"
import { updateSelectOption } from "./js/affichageHtml/updateSelectionFromGeojson"
import { updateSelectOptionFromList } from "./js/affichageHtml/updateSelectOptionFromList"
import { getUniquePropNames } from "./js/utile/getUniquePropertiesNamesFromGeojson"
import { addShpLayerOnChange } from "./js/affichageItown/addShpLayerOnchange";
import { exploreData } from "./js/affichageItown/exploreData";
import * as shp from "shpjs";
import { getDataICI } from "./js/recuperationDonnee/getDataIciPop";
import { getDataBDTOPO } from "./js/recuperationDonnee/getDataBdtopo.js";
import { getDataINSEE } from "./js/recuperationDonnee/getDataINSEEpopIRIS";
import * as contenuOnglet from "./js/affichage/affichageHtml/contenuOnglets"
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
let batInorandomId = { "ino_random_id": { name: "innondation", num: 0, id: "innondation_0" }, "bdnb_random_id": { name: "bdnb", num: 0, id: "bdnb_0", "dataGeojson": {} }, "bdtopo_radom_id": { name: "bdtopo", num: 0, id: "bdtopo_0", "dataGeojson": {} }, "osm_random_id": { name: "osm", num: 0, id: "osm_0", "dataGeojson": {} }, "cadastre_random_id": { name: "cadastre", num: 0, id: "cadastre_0", "dataGeojson": {} } }
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
let bdtopoParis11PromisedJson = loadBufferDataFromShp(paths.bdtopoParis)

// let geojson 
let bdnbGeoJson

// ----------------- Globe Initialisatioin ----------------- //
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, async function globeInitialized() {
    // eslint-disable-next-line no-console
    // console.info('Globe initialized');


    await csvBdnb.then(res => {
        // Récupérer les valeurs uniques de la propriété "type"
        dataBdnb = res.reduce((result, prop) => {
            result[prop.batiment_groupe_id] = Object.entries(prop).reduce((a, [k, v]) => (v === null ? a : (a[k] = v, a)), {})

            return result;
        }, {});
    });

    //add clickable layer
    await addShp("../data/shp/paris_11/paris11_bdnb", "bdnbParis", "red", "", view, true)
    await addShp("../data/shp/prg/bdnb_perigeux8", "bdnb", "black", "", view, true);

    //add geojson to layer config
    bdnbGeoJson = await bdnbPromisedJson;
    bdnbGeoJson.features.forEach((feature) => {
        let data = dataBdnb[feature.properties["batiment_g"]]
        if (data) {
            feature.properties = data
        }
    });
    batInorandomId.bdnb_random_id.dataGeojson = bdnbGeoJson
    batInorandomId.bdtopo_radom_id.dataGeojson = await bdtopoPromisedJson
    batInorandomId.osm_random_id.dataGeojson = await osmPromisedJson
    batInorandomId.cadastre_random_id.dataGeojson = await cadastrePromisedJson

    //list checkbox
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
    // style lié au contexte géographique
    style_list.push(
        new Style("Iris", view, src_bdnb, "code_iris", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
    );
    // styles liés à l'objet
    style_list.push(
        new Style("Hauteur", view, src_bdnb, "bdtopo_bat_hauteur_mean", true)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setGradation("rgb(255,0,0)")
    );
    style_list.push(
        new Style("Nature du bâtiment", view, src_bdnb, "bdtopo_bat_l_nature", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
    );
    // Problème de stylisation sur ce style
    style_list.push(
        new Style("Année de construction", view, src_bdnb, "ffo_bat_annee_construction", true)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setGradation("rgb(0,0,255)")
    );
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
    // styles liées au risques
    style_list.push(
        new Style("Risques liés aux argiles", view, src_bdnb, "argiles_alea", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setClasses({
                "Faible": "rgb(82,255,71)",
                "Moyen": "rgb(255,165,0)",
                "Fort": "rgb(255,0,0)"
            })
    );
    style_list.push(
        new Style("Risques liés au radon", view, src_bdnb, "radon_alea", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setClasses({
                "Faible": "rgb(82,255,71)",
                "Moyen": "rgb(255,165,0)",
                "Fort": "rgb(255,0,0)"
            })
    );
    // styles liés à la fiabilité
    style_list.push(
        new Style("Fiabilité de la hauteur", view, src_bdnb, "fiabilite_hauteur", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setClasses({
                "BONNE": "rgb(82,255,71)",
                "MOYENNE": "rgb(255,165,0)",
                "FAIBLE": "rgb(255,0,0)"

            })
    );
    style_list.push(
        new Style("Fiabilité de l'emprise au sol", view, src_bdnb, "fiabilite_emprise_sol", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setClasses({
                "BONNE": "rgb(82,255,71)",
                "MOYENNE": "rgb(255,165,0)",
                "FAIBLE": "rgb(255,0,0)"
            })
    );
    style_list.push(
        new Style("Fiabilité de l'adresse", view, src_bdnb, "fiabilite_cr_adr_niv_1", false)
            .setExtrude("bdtopo_bat_altitude_sol_mean", "bdtopo_bat_hauteur_mean")
            .setClasses({
                "données croisées à l'adresse fiables": "rgb(82,255,71)",
                "données croisées à l'adresse fiables à l'echelle de la parcelle unifiee": "rgb(255,255,0)",
                "données croisées à l'adresse moyennement fiables": "rgb(255,165,0)",
                "problème de géocodage": "rgb(255,0,0)"
            })
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
            style.to_itowns_layer().then(() => {
                document.getElementById("legend").replaceChildren(style.getLegend());
            });
        }
    });



});

// ----------------- Variables to display content in tabs ----------------- //
const tooltip = document.getElementById('tooltip');
const htmlTest = document.getElementById('listConsoPopulationIris');
const htmlICI = document.getElementById('listConsoPopulationICI')
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
            }


            addSpecificBuilings("../data/shp/prg/bdnb_perigeux8", "batiment_c", tooltip.value.properties.batiment_c, letRandomCOlor, view, THREE)
            addSpecificBuilings("../data/shp/paris_11/paris11_bdnb", "batiment_c", tooltip.value.properties.batiment_c, letRandomCOlor, view, THREE)

            let tooltipBuildingID = tooltip.value.properties.batiment_c
            if (tooltipBuildingID.includes('-')) {
                tooltipBuildingID = tooltipBuildingID.slice(0, -2)
            }


            getBdnbInfo(csvBdnbParis, "batiment_g", tooltip.value.properties.batiment_g)
                .then(async (res) => {
                    // ----------- Get Bdnb data ----------- //
                    // Dispatch Bdnb data for each tab
                    let dataBDNB2Display = await spreadDataToTabs(res, valuesToDisplay, 'BDNB')
                    let dataWithINSEE2Display = await getDataINSEE(csvMenageINSEE, tooltip, dataBDNB2Display, textHtml, htmlTest)
                    let dataWithBdTopo2Display = await getDataBDTOPO(bdtopoParis11PromisedJson, tooltip, dataWithINSEE2Display)
                    let dataWithICI2Display = await getDataICI(dataWithBdTopo2Display, csvBuildingICI, csvHousingICI, csvHouseholdICI, csvIndividualICI, tooltipBuildingID)
                    return dataWithICI2Display
                })
                .then(res => {
                    // ----------- Generate html accordion item for each value ----------- //
                    Object.entries(res).forEach(([key, value]) => {
                        generateAttributes4Tab('infoGenAccordion', 'tabInfoGen', value, key)
                        generateAttributes4Tab('batimentAccordion', 'tabBatiment', value, key)
                    })

                    let testPop = '';
                    let householdbody = '';
                    let indbody;
                    let individubody;
                    let divHoushold;
                    let divIndividu;
                    let count = 0;
                    let countIndividu;
                    Object.entries(res.tabPopulation).forEach(([key, value]) => {
                        count++;

                        individubody = '';
                        value.individuals.forEach((val, idx) => {
                            countIndividu = idx + 1
                            indbody = '';
                            indbody += contenuOnglet.createAccordionForListValues(val, '', true)
                            individubody += contenuOnglet.createAccordion('individu' + key + countIndividu, 'Individu ' + countIndividu, indbody).innerHTML
                        })
                        householdbody = contenuOnglet.createAccordionForListValues(value.household, key)
                        divIndividu = contenuOnglet.createAccordion('individu', 'Individu(s)', individubody, true).outerHTML
                        divHoushold = contenuOnglet.createAccordion('household' + key, 'Ménage ' + count, householdbody + divIndividu, true)
                        testPop += divHoushold.outerHTML
                    })

                    htmlICI.innerHTML = testPop

                    // for info link
                    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
                    const tooltipList = [...tooltipTriggerList]
                    tooltipList.map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
                })

            getBdnbInfo(csvBdnb, "batiment_groupe_id", tooltip.value.properties.batiment_g)
                .then(async (res) => {

                    let dataPerigueuxBDNB2display = await spreadDataToTabs(res, valuesToDisplay, 'BDNB')
                    let dataPerigueuxWithINSEE2Display = await getDataINSEE(csvMenageINSEE, tooltip, dataPerigueuxBDNB2display, textHtml, htmlTest)
                    let dataPerigueuxWithBdTopo2Display = await getDataBDTOPO(bdtopoPromisedJson, tooltip, dataPerigueuxWithINSEE2Display)
                    return dataPerigueuxWithBdTopo2Display
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

// layer en savoir plus
addShpLayerOnChange("showIgnLayer", paths.bdtopo, "bd_topo", "red", "", view)
addShpLayerOnChange("showOsmLayer", paths.osm, "osm", "yellow", "", view)
addShpLayerOnChange("showCadastreLayer", paths.cadastre, "cadastre", "red", "", view)


//layer innondation event listnter 
document.getElementById("showInnondationLayer").addEventListener("change", () => {
    if (document.getElementById("showInnondationLayer").checked) {
        addShp(paths.innodation_perigeux, "inno", "black", "blue", view, false)

            .num += 1;
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

//========================= exploration des sources====================== 
document.getElementById("exploredata").addEventListener("change", () => {
    let layerStructureId = exploreData("exploredata", bdnbGeoJson, batInorandomId.bdnb_random_id, "selectProp", "argiles_alea", view, THREE)
    batInorandomId.bdnb_random_id.num = layerStructureId.num
    batInorandomId.bdnb_random_id.id = layerStructureId.id
}
)
document.getElementById("exploredataIgn").addEventListener("change", () => {
    let layerStructureId = exploreData("exploredataIgn", batInorandomId.bdtopo_radom_id.dataGeojson, batInorandomId.bdtopo_radom_id, "selectProp", "USAGE1", view, THREE)
    batInorandomId.bdtopo_radom_id.num = layerStructureId.num
    batInorandomId.bdtopo_radom_id.id = layerStructureId.id
})
document.getElementById("exploredataOsm").addEventListener("change", () => {
    let layerStructureId = exploreData("exploredataOsm", batInorandomId.osm_random_id.dataGeojson, batInorandomId.osm_random_id, "selectProp", "USAGE1", view, THREE)
    batInorandomId.osm_random_id.num = layerStructureId.num
    batInorandomId.osm_random_id.id = layerStructureId.id
})
document.getElementById("exploredataCadastre").addEventListener("change", () => {
    let layerStructureId = exploreData("exploredataCadastre", batInorandomId.cadastre_random_id.dataGeojson, batInorandomId.cadastre_random_id, "selectProp", "created", view, THREE)
    batInorandomId.cadastre_random_id.num = layerStructureId.num
    batInorandomId.cadastre_random_id.id = layerStructureId.id
})


document.getElementById("confirmExporation").addEventListener("click", () => {
    const selectPropValue = document.getElementById('selectProp').value;
    const ign = document.getElementById("exploredataIgn").checked;
    if (ign) {
        view.removeLayer(batInorandomId.bdtopo_radom_id.id)
        batInorandomId.bdtopo_radom_id.num += 1;
        batInorandomId.bdtopo_radom_id.id = batInorandomId.bdtopo_radom_id.name + "_" + batInorandomId.bdtopo_radom_id.num
        let geojson = batInorandomId.bdtopo_radom_id.dataGeojson
        updateSelectOption("selectProp", geojson, selectPropValue)
        geojsontToFeatureGeom(geojson, selectPropValue, batInorandomId.bdtopo_radom_id.id, false, view, THREE)
    }

    const bdnb = document.getElementById("exploredata").checked;
    if (bdnb) {
        view.removeLayer(batInorandomId.bdnb_random_id.id)
        batInorandomId.bdnb_random_id.num += 1;
        batInorandomId.bdnb_random_id.id = batInorandomId.bdnb_random_id.name + "_" + batInorandomId.bdnb_random_id.num
        let geojson = bdnbGeoJson
        updateSelectOption("selectProp", geojson, selectPropValue)
        geojsontToFeatureGeom(geojson, selectPropValue, batInorandomId.bdnb_random_id.id, false, view, THREE)
    }


    const osm = document.getElementById("exploredataOsm").checked;
    if (osm) {
        view.removeLayer(batInorandomId.osm_random_id.id)
        batInorandomId.osm_random_id.num += 1;
        batInorandomId.osm_random_id.id = batInorandomId.osm_random_id.name + "_" + batInorandomId.osm_random_id.num
        let geojson = batInorandomId.osm_random_id.dataGeojson
        updateSelectOption("selectProp", geojson, selectPropValue)
        geojsontToFeatureGeom(geojson, selectPropValue, batInorandomId.osm_random_id.id, false, view, THREE)
    }

    const cad = document.getElementById("exploredataCadastre").checked;
    if (cad) {
        view.removeLayer(batInorandomId.cadastre_random_id.id)
        batInorandomId.cadastre_random_id.num += 1;
        batInorandomId.cadastre_random_id.id = batInorandomId.cadastre_random_id.name + "_" + batInorandomId.cadastre_random_id.num
        let geojson = batInorandomId.cadastre_random_id.dataGeojson
        updateSelectOption("selectProp", geojson, selectPropValue)
        geojsontToFeatureGeom(geojson, selectPropValue, batInorandomId.cadastre_random_id.id, false, view, THREE)
    }
})

//=============================== drop ziped shp panel=========================================//
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
        if (file.type.includes('zip')) {
            // Handle the ZIP file
            var reader = new FileReader();
            reader.onload = function (event) {
                var arrayBuffer = event.target.result;
                // Handle the arrayBuffer
                //for the shapefiles in the files folder called pandr.shp
                shp(arrayBuffer).then(function (geojson) {
                    //see bellow for whats here this internally call shp.parseZip()
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

// display la 2d drop layer 
var affiche2dFile = document.getElementById('afficheDrop2d');
affiche2dFile.addEventListener("click", () => {
    dropedGeojson["2dDropId"].num += 1;
    dropedGeojson["2dDropId"].id = dropedGeojson["2dDropId"].name + "_" + dropedGeojson["2dDropId"].num
    let geojson = dropedGeojson["2dDrop"]
    const select2dZiped = document.getElementById('select2dZiped').value;
    geosjontToColorLayer(geojson, select2dZiped, dropedGeojson["2dDropId"].id, false, view)
}
)

document.getElementById("checkbox-supprime-2ddrop").addEventListener("click", () => {
    view.removeLayer(dropedGeojson["2dDropId"].id)
})


//================================== Drop zone 3d (4326) =========================================//
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
        if (file.type.includes('zip')) {
            // Handle the ZIP file
            var reader = new FileReader();
            reader.onload = function (event) {
                var arrayBuffer = event.target.result;
                // Handle the arrayBuffer
                //for the shapefiles in the files folder called pandr.shp
                shp(arrayBuffer).then(function (geojson) {
                    //see bellow for whats here this internally call shp.parseZip()
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
    view.removeLayer(dropedGeojson["3dDropId"].id)
})

//========================== csv join ===================================//

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

        //update selection div with csv attribut
        updateSelectOptionFromList("attJointureCsv", headers)
        //update selection div with csv attribut cor colorling the layer
        updateSelectOptionFromList("selectCouleurCsv", headers)

        //create a list containg the csv data in records
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
    };

    reader.readAsText(file);

    //=============== get all active layer and remove useless local active layer ===========//
    let LayersName = view.getLayers().reduce((result, layer) => {
        result.push(layer.id)
        return result
    }, [])
    function removeLayername(layerName) {
        return layerName !== "globe" && layerName !== "atmosphere" && layerName !== "Ortho" && layerName !== "IGN_MNT_HIGHRES" && layerName !== "MNT_WORLD_SRTM3" && !layerName.includes("label");
    }
    LayersName = LayersName.filter(removeLayername);
    updateSelectOptionFromList("selectJoinLayer", LayersName)
    //=========================================================================================
});
//=============== csv update select attribut of selected layer ===========//
document.getElementById("selectJoinLayer").addEventListener("change", () => {
    let selectedValue = document.getElementById("selectJoinLayer").value
    let geojson = view.getLayerById(selectedValue).source.fetchedData
    let uniquenames = getUniquePropNames(geojson)
    updateSelectOptionFromList("selectJoinAttribut", uniquenames)
    csvJoinAtt.updatedGeojson = geojson;
})
//=========================================================================================

//=============== join layer and create a new geojson ===========//
document.getElementById("selectJoinAttribut").addEventListener("change", () => {
    let selectChampJointure = document.getElementById("attJointureCsv").value
    let selectCibleChampJointure = document.getElementById("selectJoinAttribut").value

    let csvTojson = dataFromCsv.reduce((result, prop) => {
        result[prop[selectChampJointure]] = prop
        return result
    }, {})

    let geojson = csvJoinAtt.updatedGeojson;

    geojson.features.forEach((feature) => {
        let data = csvTojson[feature.properties[selectCibleChampJointure]]

        if (data) {
            Object.entries(data).forEach(([key, val]) => {
                feature.properties[key] = val
            })
        }
    });

})
//=========================================================================================

//=============== show new layer  ===========//
document.getElementById("afficheDropCsv").addEventListener("click", () => {
    csvJoinAtt["csvLayerId"].num += 1;
    csvJoinAtt["csvLayerId"].id = csvJoinAtt["csvLayerId"].name + "_" + csvJoinAtt["csvLayerId"].num
    let geojson = csvJoinAtt.updatedGeojson
    const selectCol3dZiped = document.getElementById('selectCouleurCsv').value;
    geojsontToFeatureGeom(geojson, selectCol3dZiped, csvJoinAtt["csvLayerId"].id, false, view, THREE)
}
)
//=========================================================================================

//=========remove layer with joined attribute 

document.getElementById("checkbox-supprime-csv").addEventListener("click", () => {
    view.removeLayer(csvJoinAtt["csvLayerId"].id)
})