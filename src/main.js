
// ----------------- Imports ----------------- //
import { update/*, buildingLayer */ } from "./js/models/building";
import { addOrthoLayer } from "./js/models/ortho";
import { addElevationLayer } from "./js/models/elevation";
import { addShp } from "./js/models/addShpLayer"
import { addSpecificBuilings } from "./js/models/extrudedBat"
import { importCsvFile } from "./js/models/readCsv"
import { addChart } from "./js/models/insee/showChart"
import * as contenuOnglet from "./js/models/contenuOnglets"
import { getBdnbInfo } from "./js/models/extractBdnbInfo"
import * as turf from "@turf/turf"
import { widgetNavigation } from "./js/jsItown/widgetNavigation"
import { loadBufferDataFromShp } from "./js/recupData/dataFromShpDbf.js"
import { geojsontToFeatureGeom } from "./js/manipShp3d/geojsontToFeatureGeom"
import Style from "./js/models/style.js";
import { loadDataToJSON, generateAttributes4Tab } from "./js/models/connectDataToBuidlings";
import { geosjontToColorLayer, updateSelectOption } from "./js/dropData/drop2dData"
import * as shp from "shpjs";


// ----------------- Variables ----------------- //
// les constantes et variable globales
const THREE = itowns.THREE
const paths = { "bdnb": "../data/shp/prg/bdnb_perigeux8", "bdtopo": "../data/shp/prg/bd_topo_2", "osm": "../data/shp/prg/osm", "cadastre": "../data/shp/prg/cadastre_perigeux8", "innodation_perigeux": "../data/shp/innondation/forte/n_tri_peri_inondable_01_01for_s_024", "bat_inond_prg": "../data/shp/prg/bat_innondable" }
let bat = document.createElement('div');
bat.className = 'bat';
bat.id = 'bat';
//listBatSelectioner
let listSlect = []
let fidSelectf = [1, 2]
let batInorandomId = { "ino_random_id": "", "bdnb_random_id": "", "bdtopo_radom_id": "", "osm_random_id": "", "cadastre_random_id": "" }

let dropedGeojson = { "2dDrop": {}, "2dDropId": "", "3dDropId": "" };

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

let dataBdnb;


// Geojson for each source
let bdnbPromisedJson = loadBufferDataFromShp(paths.bdnb);
let bdtopoPromisedJson = loadBufferDataFromShp(paths.bdtopo)
let osmPromisedJson = loadBufferDataFromShp(paths.osm)
let cadastrePromisedJson = loadBufferDataFromShp(paths.cadastre)

// ----------------- Globe Initialisatioin ----------------- //
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, async function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    await addShp("../data/shp/prg/bdnb_perigeux8", "bdnb", "black", "", view, true);

    let checkbox_3D = document.getElementById("checkbox_style_3D");
    let select_style = document.getElementById("select_style");
    let button_style_apply = document.getElementById("button_style_apply");

    //Getting the source (as something other than a Shp because itowns can't extrude them)
    let src_bdnb;
    await loadBufferDataFromShp(paths.bdnb).then(geojson => {
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
            .setExtrude("altitude_s", "hauteur")
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
        new Style("Hauteur dégradée", view, src_bdnb, "hauteur", true)
            .setExtrude("altitude_s", "hauteur")
            .setGradation("rgb(255,0,0)", "", 1, 28)
    );
    style_list.push(
        new Style("Iris", view, src_bdnb, "code_iris", false)
            .setExtrude("altitude_s", "hauteur")
    );

    //Setting the predefined styles
    for (let i = 0; i < style_list.length; i++) {
        select_style.innerHTML += "<option value='" + i + "'>" + style_list[i].name + "</option>";
    }

    button_style_apply.addEventListener("click", () => {
        if (select_style.value == -1) {
            style_list[0].clean(100000);
        } else {
            const style = style_list[select_style.value];
            //If the 3D checkbox is checked and the ground and height fields values are filled, style is set to 3D
            style.to3D(checkbox_3D.checked);
            style.to_itowns_layer();
        }
    });

    csvBdnb.then(res => {
        // Récupérer les valeurs uniques de la propriété "type"
        dataBdnb = res.reduce((result, prop) => {
            result[prop.batiment_groupe_id] = Object.entries(prop).reduce((a, [k, v]) => (v === null ? a : (a[k] = v, a)), {})

            return result;
        }, {});
    }

    )

});

// ----------------- Variables to display content in tabs ----------------- //
const tooltip = document.getElementById('tooltip');
const htmlTest = document.getElementById('population');
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
                tabEnergie: []
            }
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


                });


            let letRandomCOlor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            let randomId = tooltip.value.properties.batiment_c + letRandomCOlor

            listSlect.push(randomId)


            if (listSlect[1]) {

                let layerToRemove = view.getLayerById(listSlect[0]);
                view.removeLayer(listSlect[0]);
                layerToRemove.delete()
                view.notifyChange()
                console.log(view.camera)
                view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)

                listSlect = [listSlect[1]]
            } else {
                console.log("non")
            }


            addSpecificBuilings("../data/shp/prg/bdnb_perigeux8", 12, "batiment_c", tooltip.value.properties.batiment_c, letRandomCOlor, view)

            getBdnbInfo(csvBdnb, tooltip.value.properties.batiment_g).then(res => {

                // ----------- Get Bdnb data ----------- //
                // Dispatch Bdnb data for each tab
                let valDisplayed;
                Object.entries(res).forEach(([key, value]) => {
                    valDisplayed = loadDataToJSON(valuesToDisplay, key, value, "bdnb")
                })
                return valDisplayed;

            }).then(result => {
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
                                valDisplayedBdTopo = loadDataToJSON(result, key, value, "bdtopo")
                            })
                            return valDisplayedBdTopo;
                        }
                    })
                    .then(res => {
                        console.log(res)
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

document.getElementById("showIgnLayer").addEventListener("change", () => {
    if (document.getElementById("showIgnLayer").checked) {
        addShp("../data/shp/prg/bd_topo", "bd_topo", "green", "", view, false)
    }
    else {
        view.removeLayer("bd_topo")
    }

})

document.getElementById("showOsmLayer").addEventListener("change", () => {
    if (document.getElementById("showOsmLayer").checked) {
        addShp("../data/shp/prg/osm", "osm", "yellow", "", view, false)
    }
    else {
        view.removeLayer("osm")
    }

})

document.getElementById("showCadastreLayer").addEventListener("change", () => {
    if (document.getElementById("showCadastreLayer").checked) {
        addShp("../data/shp/prg/osm", "cadastre", "red", "", view, false)
    }
    else {
        view.removeLayer("cadastre")
    }

})

document.getElementById("showInnondationLayer").addEventListener("change", () => {
    if (document.getElementById("showInnondationLayer").checked) {
        addShp(paths.innodation_perigeux, "inno", "black", "blue", view, false)

        let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        loadBufferDataFromShp(paths.bat_inond_prg).then(geojson => {
            geojsontToFeatureGeom(geojson, false, "selectPropValue", ramdoId, true, view, THREE)
            batInorandomId.ino_random_id = ramdoId
        })

    }
    else {
        view.removeLayer(batInorandomId.ino_random_id)
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

            let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            geojsontToFeatureGeom(geojson, true, "argiles_alea", ramdoId2, false, view, THREE)
            batInorandomId.bdnb_random_id = ramdoId2
        }
        )
    }
    else {
        view.removeLayer(batInorandomId.bdnb_random_id)
        batInorandomId.bdnb_random_id = ""
    }

})

document.getElementById("exploredataIgn").addEventListener("change", () => {
    if (document.getElementById("exploredataIgn").checked) {
        bdtopoPromisedJson.then(geojson => {
            let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            geojsontToFeatureGeom(geojson, true, "USAGE1", ramdoId, false, view, THREE)
            batInorandomId.bdtopo_radom_id = ramdoId
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.bdtopo_radom_id)
        batInorandomId.bdtopo_radom_id = ""
    }

})

document.getElementById("exploredataOsm").addEventListener("change", () => {
    if (document.getElementById("exploredataOsm").checked) {
        osmPromisedJson.then(geojson => {
            let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            geojsontToFeatureGeom(geojson, true, "fclass", ramdoId, false, view, THREE)
            batInorandomId.osm_random_id = ramdoId
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.osm_random_id)
        batInorandomId.osm_random_id = ""
    }

})

document.getElementById("exploredataCadastre").addEventListener("change", () => {
    if (document.getElementById("exploredataCadastre").checked) {
        cadastrePromisedJson.then(geojson => {
            let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            geojsontToFeatureGeom(geojson, true, "fclass", ramdoId, false, view, THREE)
            batInorandomId.cadastre_random_id = ramdoId
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.cadastre_random_id)
        batInorandomId.cadastre_random_id = ""
    }

})



document.getElementById("confirmExporation").addEventListener("click", () => {
    Object.entries(batInorandomId).forEach(([key, val]) => {
        if (key != "ino_random_id" && val != "") {
            view.removeLayer(val)
        }
    })

    const selectPropValue = document.getElementById('selectProp').value;
    const ign = document.getElementById("exploredataIgn").checked;
    if (ign) {
        let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        bdtopoPromisedJson.then(geojson => {
            geojsontToFeatureGeom(geojson, false, selectPropValue, ramdoId2, false, view, THREE)
            batInorandomId.bdtopo_radom_id = ramdoId2
        })
    }

    const bdnb = document.getElementById("exploredata").checked;
    if (bdnb) {
        let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        bdnbPromisedJson.then(geojson => {
            geojsontToFeatureGeom(geojson, false, selectPropValue, ramdoId2, false, view, THREE)
            batInorandomId.bdnb_random_id = ramdoId2
        })
    }


    const osm = document.getElementById("exploredataOsm").checked;
    if (osm) {
        let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        osmPromisedJson.then(geojson => {
            geojsontToFeatureGeom(geojson, false, selectPropValue, ramdoId2, false, view, THREE)
            batInorandomId.osm_random_id = ramdoId2
        })
    }

    const cad = document.getElementById("exploredataCadastre").checked;
    if (cad) {
        let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        cadastrePromisedJson.then(geojson => {
            geojsontToFeatureGeom(geojson, false, selectPropValue, ramdoId2, false, view, THREE)
            batInorandomId.cadastre_random_id = ramdoId2
        })
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

                    updateSelectOption(geojson, "select2dZiped", true)

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
    console.log("sqfsqfsqdfd")
    console.log(dropedGeojson["2dDropId"] === "")

    if (dropedGeojson["2dDropId"] !== '') {
        view.removeLayer(dropedGeojson["2dDropId"])
        dropedGeojson["2dDropId"] = ""
    }

    let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
    dropedGeojson["2dDropId"] = ramdoId2
    let geojson = dropedGeojson["2dDrop"]
    console.log(geojson)
    const select2dZiped = document.getElementById('select2dZiped').value;
    geosjontToColorLayer(geojson, select2dZiped, ramdoId2, false, view, THREE)
}
)

document.getElementById("checkbox-supprime-2ddrop").addEventListener("click", () => {
    console.log(dropedGeojson)
    view.removeLayer(dropedGeojson["2dDropId"])
    dropedGeojson["2dDropId"] = ""
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

                    updateSelectOption(geojson, "selectHauteur3dZiped", true)

                    updateSelectOption(geojson, "selectAltiSol3dZiped", true)

                    updateSelectOption(geojson, "selectCol3dZiped", true)

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
    let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
    let geojson = dropedGeojson["3dDrop"]
    console.log(geojson)

    if (dropedGeojson["3dDropId"] !== '') {
        view.removeLayer(dropedGeojson["3dDropId"])
        dropedGeojson["3dDropId"] = ""
    }

    dropedGeojson["3dDropId"] = ramdoId2

    const selectHauteur3dZiped = document.getElementById('selectHauteur3dZiped').value;
    const selectAltiSol3dZiped = document.getElementById('selectAltiSol3dZiped').value;
    const selectCol3dZiped = document.getElementById('selectCol3dZiped').value;

    geojsontToFeatureGeom(geojson, false, selectCol3dZiped, ramdoId2, false, view, THREE, selectHauteur3dZiped, selectAltiSol3dZiped)

    console.log(selectCol3dZiped)
    // geosjontToColorLayer(geojson, select2dZiped, ramdoId2, false, view, THREE)
}
)



document.getElementById("checkbox-supprime-3ddrop").addEventListener("click", () => {
    console.log("suprime3D")
    console.log(dropedGeojson)
    view.removeLayer(dropedGeojson["3dDropId"])
    dropedGeojson["3dDropId"] = ""

})





