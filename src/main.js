// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

// ----------------- Imports ----------------- //
import { update/*, buildingLayer */ } from "./models/building";
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
//import { addStreamSurfaceFeature } from "./models/streamSurfaceFeature"
// import { setUpMenu } from "./GUI/BaseMenu";
import { addShp } from "./models/addShpLayer"
import { addSpecificBuilings } from "./models/extrudedBat"
import { importCsvFile } from "./models/readCsv"
import { addChart } from "./models/insee/showChart"
import * as contenuOnglet from "./models/contenuOnglets"
import { getBdnbInfo } from "./models/extractBdnbInfo"
import * as turf from "@turf/turf"
// console.log(turf)

let bat = document.createElement('div');
bat.className = 'bat';
bat.id = 'bat';

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

// ----------------- Navigation widget ----------------- //

const widgets = new itowns_widgets.Navigation(view);
// console.log(itowns_widgets)

widgets.addButton(
    'rotate-up',
    '<p style="font-size: 20px">&#8595</p>',
    'rotate camera up',
    () => {
        view.controls.lookAtCoordinate({
            tilt: view.controls.getTilt() - 10,
            time: 500,
        });
    },
    'button-bar-rotation',
);
widgets.addButton(
    'rotate-down',
    '<p style="font-size: 20px">&#8593</p>',
    'rotate camera down',
    () => {
        view.controls.lookAtCoordinate({
            tilt: view.controls.getTilt() + 10,
            time: 500,
        });
    },
    'button-bar-rotation',
);
widgets.addButton(
    'reset-position',
    '&#8634',
    'reset position',
    () => { view.controls.lookAtCoordinate(placement) },
);



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

    addShp("../data/shp/prg/osm", "osm", "red", "", view, false)


});


const tooltip = document.getElementById('tooltip');
// console.log(tooltip)

tooltip.addEventListener(
    'DOMSubtreeModified',
    async (event) => {
        // console.log(event)
        // console.log(tooltip.value);

        // console.log(view)

        const mouseevent = document.getElementById('mouseevent')
        // console.log(mouseevent.value);

        addSpecificBuilings("../data/shp/prg/bdnb_perigeux8", 100, "batiment_g", tooltip.value.properties.batiment_g, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view)

        // console.log(document.getElementById('bat').value.coord);
        // console.log(document.getElementById('bat').value.coord[0][0], document.getElementById('bat').value.coord[0][1], 100);

        let batGroupeIdBdnb = tooltip.value.properties.batiment_g

        getBdnbInfo(csvBdnb, batGroupeIdBdnb).then(res => {
            // console.log(res),
            // console.log(output)
            document.getElementById('batInfo').innerHTML = JSON.stringify(res)
            document.getElementById('batInfo').value = batGroupeIdBdnb
        })

        function getBdtopoInfo(csvIdBdnbBdtopo, bdnbGoupeBatId) {

            return csvIdBdnbBdtopo.then(res => {
                let bdTopoId = res.filter(obj => obj.batiment_g === bdnbGoupeBatId)[0].bdtopo

                shapefile.open("../data/shp/prg/bd_topo")
                    .then(source => source.read()
                        .then(function log(result) {
                            if (result.done) return "done";
                            if (result.value.properties["ID"] === bdTopoId) {
                                // console.log(result.value.properties)
                                if (document.getElementById('batInfo').value != bdnbGoupeBatId) {
                                    document.getElementById('batInfo').innerHTML += '<br><p>/p><p>"BDTOPO"</p>'
                                    document.getElementById('batInfo').innerHTML += JSON.stringify(result.value.properties)
                                    // document.getElementById("btnOffcanvasScrollingbat").click()
                                }
                                return result.value.properties;
                            }
                            else {
                                return source.read().then(log);
                            }
                        }
                        ))
            })
        }

        // console.log(getBdtopoInfo(csvIdBdnbBdtopo, tooltip.value.properties.batiment_g))


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
                                        addSpecificBuilings("../data/shp/prg/osm", 200, "osm_id", result.value.properties["osm_id"], "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view)
                                        return;
                                    }

                                    return source.read().then(log);
                                }))
                    }
                    return source.read().then(log)


                }
                ))

    })

const htmlTest = document.getElementById('population');
viewerDiv.addEventListener(
    'mouseup',
    () => {

        htmlTest.innerHTML = '';
        let textHtml = '';
        textHtml += '<div class="accordion accordion-flush" id="accordionFlushExample">';

        csv2
            .then(res => {
                // ----------- POPULATION INSEE ----------- //
                console.log('population insee')
                console.log(textHtml)
                // Retrieve elements where Iris number is same as tooltip
                let uniqueData = res.filter(obj => obj.IRIS === Number(tooltip.value.properties.code_iris))[0]
                const currentkey = contenuOnglet.getKeyByValue(uniqueData, Number(tooltip.value.properties.code_iris));

                // Add INSEE value for this IRIS in tooltip properties
                console.log('Add INSEE value for this IRIS in tooltip properties')
                console.log(textHtml)
                Object.entries(uniqueData).forEach(([key, value]) => {
                    if (!(value === Number(tooltip.value.properties.code_iris))) {
                        tooltip.value.properties[key] = value;
                    }
                })

                // Chart for INSEE values
                // ----- Status 15 ans et plus ----- //
                console.log('Status 15 ans et plus')
                console.log(textHtml)
                const relation15OuPlus = ['P19_POP15P_MARIEE', 'P19_POP15P_PACSEE', 'P19_POP15P_CONCUB_UNION_LIBRE', 'P19_POP15P_VEUFS', 'P19_POP15P_DIVORCEE', 'P19_POP15P_CELIBATAIRE']
                const dataRelation15 = contenuOnglet.dataINSEE4Chart(relation15OuPlus, 11, tooltip.value.properties);
                // Generate html accordion item
                textHtml += contenuOnglet.generateAccordionItem("Status_15_ans+", 'status');
                textHtml += contenuOnglet.generateAccordionItem("Status_15_ans+++", 'status+');
                // htmlTest.innerHTML += textHtml;

                // ----- Répartition pop 15 ans et plus ----- //
                // console.log('Répartition pop 15 ans et plus')
                // console.log(textHtml)
                // const repartitionPop = ['P19_POP1524', 'P19_POP2554', 'P19_POP5579', 'P19_POP80P']
                // const dataRepartitionPop = contenuOnglet.dataINSEE4Chart(repartitionPop, 5, tooltip.value.properties);
                // // Generate html accordion item
                // textHtml += contenuOnglet.generateAccordionItem("Repartion_pop_15_ans+", 'repartition');
                // console.log(textHtml)
                htmlTest.innerHTML += textHtml;

                addChart('status', dataRelation15, 'name', 'value', 'Status');
                addChart('status+', dataRelation15, 'name', 'value', 'Status');
                // addChart('repartition', dataRepartitionPop, 'name', 'value', 'Répartion');


                // ----- Nombre enfants -25 ans par famille ----- //


                console.log(htmlTest.innerHTML)


            });


    },
    false
)
htmlTest.innerHTML += '</div>';
