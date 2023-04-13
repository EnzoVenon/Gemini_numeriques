
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
import { getBdtopoInfo } from "./js/models/getBdtopoInfo"
import { bdnbinfoToHtml } from "./js/models/bdnbinfoToHtml"
import { loadBufferDataFromShp } from "./js/recupData/dataFromShpDbf.js"
import { geosjontToFeatureGeom } from "./js/manipShp3d/geosjontToFeatureGeom"
import Style from "./js/models/style.js";
// les constantes et variable globales
const THREE = itowns.THREE
const records = {}
const paths = { "bdnb": "../data/shp/prg/bdnb_perigeux8", "bdtopo": "../data/shp/prg/bd_topo_2", "osm": "../data/shp/prg/osm", "cadastre": "../data/shp/prg/cadastre_perigeux8", "innodation_perigeux": "../data/shp/innondation/forte/n_tri_peri_inondable_01_01for_s_024", "bat_inond_prg": "../data/shp/prg/bat_innondable" }
// console.log(turf)
let bat = document.createElement('div');
bat.className = 'bat';
bat.id = 'bat';
//listBatSelectioner
let listSlect = []
let fidSelectf = [1, 2]
let batInorandomId = { "ino_random_id": "", "bdnb_random_id": "", "bdtopo_radom_id": "", "osm_random_id": "", "cadastre_random_id": "" }

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
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, async function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    await addShp("../data/shp/prg/bdnb_perigeux8", "bdnb", "black", "", view, true)

    let checkbox_3D = document.getElementById("checkbox_style_3D");
    let select_style = document.getElementById("select_style");
    let button_style_apply = document.getElementById("button_style_apply");

    //Styles definition
    let style_list = [];
    style_list.push(
        new Style("Notes consommation d'énergie", view, view.getLayerById("bdnb").source, "dpe_logtype_classe_conso_ener", false, false)
            .setExtrude("altitude_s", "hauteur", false)
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
        new Style("Hauteur dégradée", view, view.getLayerById("bdnb").source, "hauteur", false, true)
            .setExtrude("altitude_s", "hauteur", false)
            .setGradation("rgb(255,0,0)", "", 1, 30)
    );
    style_list.push(
        new Style("Iris", view, view.getLayerById("bdnb").source, "code_iris", false, false)
            .setExtrude("altitude_s", "hauteur", false)
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
            style.to3D(checkbox_3D.checked && style.field_ground != "" && style.field_height != "");
            style.to_itowns_layer();
        }
    });

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

            addSpecificBuilings("../data/shp/prg/bdnb_perigeux8", 20, "batiment_g", tooltip.value.properties.batiment_g, letRandomCOlor, view)

            getBdnbInfo(csvBdnb, tooltip.value.properties.batiment_g).then(res => {
                console.log(res)
                bdnbinfoToHtml(res)
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

document.getElementById("showIgnLayer").addEventListener("change", () => {
    console.log(document.getElementById("showIgnLayer").checked)
    if (document.getElementById("showIgnLayer").checked) {
        addShp("../data/shp/prg/bd_topo", "bd_topo", "green", "", view, false)
    }
    else {
        view.removeLayer("bd_topo")
    }

})

document.getElementById("showOsmLayer").addEventListener("change", () => {
    console.log(document.getElementById("showOsmLayer").checked)
    if (document.getElementById("showOsmLayer").checked) {
        addShp("../data/shp/prg/osm", "osm", "yellow", "", view, false)
    }
    else {
        view.removeLayer("osm")
    }

})

document.getElementById("showCadastreLayer").addEventListener("change", () => {
    console.log(document.getElementById("showCadastreLayer").checked)
    if (document.getElementById("showCadastreLayer").checked) {
        addShp("../data/shp/prg/osm", "cadastre", "red", "", view, false)
    }
    else {
        view.removeLayer("cadastre")
    }

})

document.getElementById("showInnondationLayer").addEventListener("change", () => {
    console.log(document.getElementById("showInnondationLayer").checked)
    if (document.getElementById("showInnondationLayer").checked) {
        addShp(paths.innodation_perigeux, "inno", "black", "blue", view, false)

        let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        loadBufferDataFromShp(paths.bat_inond_prg).then(geojson => {
            geosjontToFeatureGeom(geojson, false, "selectPropValue", ramdoId, true, view, THREE)
            batInorandomId.ino_random_id = ramdoId
        })

    }
    else {
        view.removeLayer(batInorandomId.ino_random_id)
    }
})
document.getElementById("showInnondationLayer").click()
let bdnbPromisedJson = loadBufferDataFromShp(paths.bdnb);
let bdtopoPromisedJson = loadBufferDataFromShp(paths.bdtopo)
let osmPromisedJson = loadBufferDataFromShp(paths.osm)
let cadastrePromisedJson = loadBufferDataFromShp(paths.cadastre)

document.getElementById("exploredata").addEventListener("change", () => {
    console.log(document.getElementById("exploredata").checked)
    if (document.getElementById("exploredata").checked) {
        bdnbPromisedJson.then(geojson => {

            console.log(geojson)

            geojson.features.forEach((feature) => {
                // console.log(feature.properties["batiment_g"])
                // console.log(records[feature.properties["batiment_g"]])
                let data = records[feature.properties["batiment_g"]]
                if (data) {
                    feature.properties = data
                }

            });

            let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            geosjontToFeatureGeom(geojson, true, "code_iris", ramdoId2, false, view, THREE)
            batInorandomId.bdnb_random_id = ramdoId2
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.bdnb_random_id)
    }

})

document.getElementById("exploredataIgn").addEventListener("change", () => {
    console.log(document.getElementById("exploredataIgn").checked)
    if (document.getElementById("exploredataIgn").checked) {
        bdtopoPromisedJson.then(geojson => {
            console.log(geojson)
            let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            geosjontToFeatureGeom(geojson, true, "USAGE1", ramdoId, false, view, THREE)
            batInorandomId.bdtopo_radom_id = ramdoId
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.bdtopo_radom_id)
    }

})

document.getElementById("exploredataOsm").addEventListener("change", () => {
    console.log(document.getElementById("exploredataOsm").checked)
    if (document.getElementById("exploredataOsm").checked) {
        osmPromisedJson.then(geojson => {
            console.log(geojson)
            let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            geosjontToFeatureGeom(geojson, true, "fclass", ramdoId, false, view, THREE)
            batInorandomId.osm_random_id = ramdoId
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.osm_random_id)
    }

})

document.getElementById("exploredataCadastre").addEventListener("change", () => {
    console.log(document.getElementById("exploredataCadastre").checked)
    if (document.getElementById("exploredataCadastre").checked) {
        cadastrePromisedJson.then(geojson => {
            console.log(geojson)
            let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
            geosjontToFeatureGeom(geojson, true, "fclass", ramdoId, false, view, THREE)
            batInorandomId.cadastre_random_id = ramdoId
        }
        )

    }
    else {
        view.removeLayer(batInorandomId.cadastre_random_id)
    }

})



document.getElementById("confirmExporation").addEventListener("click", () => {
    console.log(batInorandomId)

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
            geosjontToFeatureGeom(geojson, false, selectPropValue, ramdoId2, false, view, THREE)
            batInorandomId.bdtopo_radom_id = ramdoId2
        })
    }

    const bdnb = document.getElementById("exploredata").checked;
    if (bdnb) {
        let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        bdnbPromisedJson.then(geojson => {
            geosjontToFeatureGeom(geojson, false, selectPropValue, ramdoId2, false, view, THREE)
            batInorandomId.bdnb_random_id = ramdoId2
        })
    }


    const osm = document.getElementById("exploredataOsm").checked;
    if (osm) {
        let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        osmPromisedJson.then(geojson => {
            geosjontToFeatureGeom(geojson, false, selectPropValue, ramdoId2, false, view, THREE)
            batInorandomId.osm_random_id = ramdoId2
        })
    }

    const cad = document.getElementById("exploredataCadastre").checked;
    if (cad) {
        let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })
        cadastrePromisedJson.then(geojson => {
            geosjontToFeatureGeom(geojson, false, selectPropValue, ramdoId2, false, view, THREE)
            batInorandomId.cadastre_random_id = ramdoId2
        })
    }
})


const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        const data = reader.result;
        const rows = data.split('\n');
        const headers = rows[0].split(',');

        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(',');
            const record = {};

            for (let j = 0; j < headers.length; j++) {
                record[headers[j]] = values[j];
            }

            records[record.batiment_groupe_id] = record;
        }

        console.log(records);
    };

    reader.readAsText(file);
});