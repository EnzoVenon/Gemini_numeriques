
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
import { loadDataFromShp, loadBufferDataFromShp } from "./js/recupData/dataFromShpDbf.js"
import { generateUniqueColors } from "./js/utile/generaRandomColorFromList"
import { geosjontToFeatureGeom } from "./js/manipShp3d/geosjontToFeatureGeom"
// les constantes et variable globales
const THREE = itowns.THREE
const paths = { "bdnb": "../data/shp/prg/bdnb_perigeux8", "bdtopo": "../data/shp/prg/bd_topo", "osm": "../data/shp/prg/osm", "cadastre": "../data/shp/prg/bdnb_perigeux8" }
// console.log(turf)
let bat = document.createElement('div');
bat.className = 'bat';
bat.id = 'bat';
//listBatSelectioner
let listSlect = []
let fidSelectf = [1, 2]
let batInorandomId = []
let batInorandomId2 = []
let uniqueTypes;
let uniquecol;

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

let path = "../data/shp/prg/bat_innondable"
let list = loadDataFromShp(path)
let selectedPoropo = ""

document.getElementById("showInnondationLayer").addEventListener("change", () => {
    console.log(document.getElementById("showInnondationLayer").checked)
    if (document.getElementById("showInnondationLayer").checked) {
        addShp("../data/shp/innondation/forte/n_tri_peri_inondable_01_01for_s_024", "inno", "black", "blue", view, false)
        Promise.all(list).then(([geom, att]) => {
            // Générer un GeoJSON à partir des features et des propriétés
            const geojson = {
                type: 'FeatureCollection',
                features: geom.map((feature) => ({
                    type: 'Feature',
                    geometry: feature,
                    properties: att[att.id]
                }))
            };

            // Utiliser le GeoJSON
            console.log(geojson);

            let src2 = new itowns.FileSource({
                fetchedData: geojson,
                crs: 'EPSG:4326',
                format: 'application/json',
            })
            // console.log(result.value.geometry.coordinates[0])
            let ramdoId = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })

            batInorandomId.push(ramdoId)


            let bat = new itowns.FeatureGeometryLayer(ramdoId, {
                source: src2,
                transparent: true,
                opacity: 0.7,
                zoom: { min: 0 },
                style: new itowns.Style({
                    fill: {
                        color: "red",
                        extrusion_height: 100,
                        base_altitude: 20
                    }
                }),
                onMeshCreated: (mesh) => {
                    console.log(mesh.children[0].children[0].children[0].children[0])
                    let object = mesh.children[0].children[0].children[0].children[0]
                    var objectEdges = new THREE.LineSegments(
                        new THREE.EdgesGeometry(object.geometry),
                        new THREE.LineBasicMaterial({ color: 'black' })
                    );

                    object.add(objectEdges);
                }
            });
            view.addLayer(bat)
        })

    }
    else {
        view.removeLayer("inno")
        view.removeLayer(batInorandomId[0])
        batInorandomId = []
    }
})
document.getElementById("showInnondationLayer").click()

let path2 = "../data/shp/prg/bdnb_perigeux8"

document.getElementById("exploredata").addEventListener("change", () => {
    console.log(document.getElementById("exploredata").checked)
    if (document.getElementById("exploredata").checked) {
        loadBufferDataFromShp(paths.bdnb).then(geojson => {
            let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })

            geosjontToFeatureGeom(geojson, true, "code_iris", ramdoId2, view, THREE)
            batInorandomId2.push(ramdoId2)


            //     // supposons que votre objet GeoJSON est stocké dans la variable 'geojson'
            //     // obtenir un tableau des noms de propriétés
            //     const propNames = geojson.features.reduce((acc, feature) => {
            //         return acc.concat(Object.keys(feature.properties));
            //     }, []);

            //     // créer un tableau des clés uniques
            //     const uniquePropNames = propNames.reduce((acc, propName) => {
            //         if (!acc.includes(propName)) {
            //             acc.push(propName);
            //         }
            //         return acc;
            //     }, []);

            //     console.log(uniquePropNames)

            //     // Récupération de l'élément HTML de sélection
            //     const selectElement = document.getElementById('selectProp');
            //     document.getElementById('selectProp').innerHTML = "";

            //     // Boucle pour ajouter chaque valeur à la sélection
            //     uniquePropNames.forEach(value => {
            //         // Création d'un élément d'option
            //         const option = document.createElement('option');
            //         // Ajout de la valeur de l'option
            //         option.text = value;
            //         // Ajout de la valeur de l'option en tant que valeur d'attribut
            //         option.value = value;
            //         // Ajout de l'option à l'élément de sélection
            //         selectElement.add(option);
            //     });



            //     console.log(geojson);

            //     selectedPoropo = "code_iris";

            //     // Récupérer les valeurs uniques de la propriété "type"
            //     uniqueTypes = geojson.features.reduce((acc, feature) => {
            //         const propfilter = feature.properties[selectedPoropo];
            //         if (!acc.includes(propfilter)) {
            //             acc.push(propfilter);
            //         }
            //         return acc;
            //     }, []);

            //     uniquecol = generateUniqueColors(uniqueTypes)

            //     console.log(uniquecol); // Output: ["A", "B"]


            //     let src2 = new itowns.FileSource({
            //         fetchedData: geojson,
            //         crs: 'EPSG:4326',
            //         format: 'application/json',
            //     })
            //     // console.log(result.value.geometry.coordinates[0])
            //     let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })

            //     batInorandomId2.push(ramdoId2)


            //     let bat = new itowns.FeatureGeometryLayer(ramdoId2, {
            //         source: src2,
            //         transparent: true,
            //         opacity: 0.7,
            //         zoom: { min: 0 },
            //         style: new itowns.Style({
            //             fill: {
            //                 color: colorBuildings,
            //                 extrusion_height: 100,
            //                 base_altitude: 20
            //             }
            //         }),
            //         onMeshCreated: (mesh) => {
            //             console.log(mesh.children[0].children[0].children[0].children[0])
            //             let object = mesh.children[0].children[0].children[0].children[0]
            //             var objectEdges = new THREE.LineSegments(
            //                 new THREE.EdgesGeometry(object.geometry),
            //                 new THREE.LineBasicMaterial({ color: 'black' })
            //             );

            //             object.add(objectEdges);
            //         }
            //     });
            //     view.addLayer(bat)

        }


        )

    }
    else {
        view.removeLayer(batInorandomId2[0])
        batInorandomId2 = []
    }

})


function colorBuildings(properties) {
    let color = uniquecol[properties[selectedPoropo]];
    // console.log(color)
    // console.log(color)
    return color;
}
document.getElementById("confirmExporation").addEventListener("click", () => {
    const selectElement = document.getElementById('selectProp');

    console.log(selectElement.value)

    selectedPoropo = selectElement.value;

    loadBufferDataFromShp(path2).then(geojson => {
        console.log(geojson);

        // Récupérer les valeurs uniques de la propriété "type"
        uniqueTypes = geojson.features.reduce((acc, feature) => {
            const prop = feature.properties[selectElement.value];
            if (!acc.includes(prop)) {
                acc.push(prop);
            }
            return acc;
        }, []);

        uniquecol = generateUniqueColors(uniqueTypes)

        console.log(uniquecol)

        console.log(uniquecol); // Output: ["A", "B"]


        let src2 = new itowns.FileSource({
            fetchedData: geojson,
            crs: 'EPSG:4326',
            format: 'application/json',
        })
        // console.log(result.value.geometry.coordinates[0])
        let ramdoId2 = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); })

        view.removeLayer(batInorandomId2[0])
        batInorandomId2 = []

        batInorandomId2.push(ramdoId2)



        let bat = new itowns.FeatureGeometryLayer(ramdoId2, {
            source: src2,
            transparent: true,
            opacity: 0.7,
            zoom: { min: 0 },
            style: new itowns.Style({
                fill: {
                    color: colorBuildings,
                    extrusion_height: 100,
                    base_altitude: 20
                }
            }),
            onMeshCreated: (mesh) => {
                console.log(mesh.children[0].children[0].children[0].children[0])
                let object = mesh.children[0].children[0].children[0].children[0]
                var objectEdges = new THREE.LineSegments(
                    new THREE.EdgesGeometry(object.geometry),
                    new THREE.LineBasicMaterial({ color: 'black' })
                );

                object.add(objectEdges);
            }
        });
        view.addLayer(bat)

    })

})
