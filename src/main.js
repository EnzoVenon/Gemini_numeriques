// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { update/*, buildingLayer */ } from "./models/building";
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
import { addShp } from "./models/addShpLayer"
import { addSpecificBuilings } from "./models/extrudedBat"
import { importCsvFile } from "./models/readCsv"
import { getBdnbInfo } from "./models/extractBdnbInfo"
import * as turf from "@turf/turf"
console.log(turf)

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
    // coord: new itowns.Coordinates('EPSG:4326', 3.05, 48.95, 2),
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

// ---------- ADD NAVIGATION WIDGET : ----------

const widgets = new itowns_widgets.Navigation(view);
console.log(itowns_widgets)

// Example on how to add a new button to the widgets menu
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


// Elevation layers
itowns.Fetcher.json('../data/layers/JSONLayers/WORLD_DTM.json')
    .then(result => addElevationLayer(result, view));
itowns.Fetcher.json('../data/layers/JSONLayers/IGN_MNT_HIGHRES.json')
    .then(result => addElevationLayer(result, view));

view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, function () { update(view) });

// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view));

let csvBdnb = importCsvFile("../data/shp/prg/data_bdnb.csv")

let csvIdBdnbBdtopo = importCsvFile("../data/linker/bdnb_bdtopo.csv")

// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    addShp("../data/shp/prg/bdnb_perigeux8", "bdnb", "black", "", view, true)

    addShp("../data/shp/prg/osm", "osm", "red", "", view, false)


});


const tooltip = document.getElementById('tooltip');
console.log(tooltip)
tooltip.addEventListener(
    'DOMSubtreeModified',
    async (event) => {
        console.log(event)
        console.log(tooltip.value);

        console.log(view)

        const mouseevent = document.getElementById('mouseevent')
        console.log(mouseevent.value);

        addSpecificBuilings("../data/shp/prg/bdnb_perigeux8", 100, "batiment_g", tooltip.value.properties.batiment_g, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view)

        console.log(document.getElementById('bat').value.coord);
        console.log(document.getElementById('bat').value.coord[0][0], document.getElementById('bat').value.coord[0][1], 100);

        let batGroupeIdBdnb = tooltip.value.properties.batiment_g

        getBdnbInfo(csvBdnb, batGroupeIdBdnb).then(res => {
            console.log(res),
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
                                    document.getElementById("btnOffcanvasScrollingbat").click()
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

        console.log(getBdtopoInfo(csvIdBdnbBdtopo, tooltip.value.properties.batiment_g))


        shapefile.open("../data/shp/prg/bdnb_perigeux8")
            .then(source => source.read()
                .then(async function log(result) {
                    if (result.done) return "done";
                    // console.log(result.value.properties["batiment_g"])

                    if (result.value.properties["batiment_g"] === tooltip.value.properties.batiment_g) {
                        let selectedBatGeom = result.value.geometry.coordinates
                        let polygon = turf.polygon(selectedBatGeom)
                        let centroid = turf.centroid(polygon)

                        let long = centroid.geometry.coordinates[0]
                        let lat = centroid.geometry.coordinates[1]

                        let osm = await fetch(`https://overpass-api.de/api/interpreter?data=[out:json];(node(around:${3} , ${lat}, ${long})["building"];way(around:${3}, ${lat}, ${long})["building"];);out;`)

                        let osmId = await osm.json()

                        console.log("oosm", osmId.elements)
                        let i = 0

                        osmId.elements.forEach(element => { i++ })

                        // if (i > 0) {
                        //     let distances = []
                        //     shapefile.open("../data/shp/prg/osm")
                        //         .then(source => source.read()
                        //             .then(function log(result) {
                        //                 if (result.done) return "done";
                        //                 // console.log(result.value.properties["osm_id"])



                        //                 osmId.elements.forEach(element => {
                        //                     if (result.value.properties["osm_id"] == element.id) {
                        //                         console.log(result.value.geometry.coordinates)
                        //                         let polygonOsm = turf.polygon(result.value.geometry.coordinates)
                        //                         let centroidOsm = turf.centroid(polygonOsm)
                        //                         let dist = turf.distance(centroid, centroidOsm)
                        //                         console.log(dist)
                        //                         distances.push(dist)

                        //                         console.log("osm_propo", element.id)
                        //                         // addSpecificBuilings("../data/shp/prg/osm", 200, "osm_id", element.id, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view)
                        //                     }

                        //                 });
                        //                 let minimum = Math.min.apply(null, distances);
                        //                 let minIndex = distances.indexOf(minimum);

                        //                 if (!minIndex) {
                        //                     addSpecificBuilings("../data/shp/prg/osm", 200, "osm_id", osmId.elements[minIndex].id, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view)
                        //                     return "done"
                        //                 }
                        //                 return source.read().then(log);
                        //             }))

                        // }


                        console.log("elseeeeeeeeeeeeeeeeeee")
                        shapefile.open("../data/shp/prg/osm")
                            .then(source => source.read()
                                .then(function log(result) {
                                    if (result.done) return "done";
                                    // console.log(result.value.properties["osm_id"])
                                    let polygonOsm = turf.polygon(result.value.geometry.coordinates)
                                    let centroidOsm = turf.centroid(polygonOsm)

                                    console.log(turf.booleanContains(polygon, centroidOsm))
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



    }





)



