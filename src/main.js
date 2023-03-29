// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { update, buildingLayer } from "./models/building";
import { picking } from "./models/connectDataToBuidlings"
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
import { addStreamSurfaceFeature } from "./models/streamSurfaceFeature"
import { setUpMenu } from "./GUI/BaseMenu";
import { addShp } from "./models/addShpLayer"

import { addSpecificBuilings } from "./models/extrudedBat"



// var shapefile = require("shapefile");

setUpMenu();


// ----------------- View Setup ----------------- //
// Define crs projection that we will use (taken from https://epsg.io/3946, Proj4js section)
//  itowns.proj4.defs('EPSG:3946', '+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

// Define initial camera position
const placement = {
    // coord: new itowns.Coordinates('EPSG:4326', 3.05, 48.95, 2),
    coord: new itowns.Coordinates('EPSG:4326', 0.72829, 45.18260, 2),


    range: 500,
    tilt: 7,
}

const viewerDiv = document.getElementById('viewerDiv');

// Instanciate iTowns GlobeView
const view = new itowns.GlobeView(viewerDiv, placement);
setupLoadingScreen(viewerDiv, view);

const menuGlobe = new GuiTools('menuDiv', view);


// ----------------- Layer Setup ----------------- //

// Elevation layers
itowns.Fetcher.json('../data/layers/JSONLayers/WORLD_DTM.json')
    .then(result => addElevationLayer(result, view, menuGlobe));
itowns.Fetcher.json('../data/layers/JSONLayers/IGN_MNT_HIGHRES.json')
    .then(result => addElevationLayer(result, view, menuGlobe));

view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, function () { update(view) });


function addBdTopo() {

    console.log("bd_topo")
    // console.log(itowns)
    console.log(view)
    console.log(document.getElementById("affiche_bd_topo").checked)
    if (document.getElementById("affiche_bd_topo").checked) {
        view.getLayerById("bd_topo").opacity = 1
    }
    else {
        if (view.getLayerById("bd_topo")) {
            // view.removeLayer("bd_topo")
            console.log(view.getLayerById("bd_topo"))
            view.getLayerById("bd_topo").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdnb() {

    console.log("addBdnb")
    // console.log(itowns)
    console.log(view)
    console.log(document.getElementById("affiche_bd_nb").checked)
    if (document.getElementById("affiche_bd_nb").checked) {
        view.getLayerById("bdnb").opacity = 1
    }
    else {
        if (view.getLayerById("bdnb")) {
            // view.removeLayer("bdnb")
            console.log(view.getLayerById("bdnb"))
            view.getLayerById("bdnb").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdCadastre() {

    console.log("addCadastre")
    // console.log(itowns)
    console.log(view)
    console.log(document.getElementById("affiche_bd_cadastre").checked)
    if (document.getElementById("affiche_bd_cadastre").checked) {
        view.getLayerById("cadastre").opacity = 1
    }
    else {
        if (view.getLayerById("cadastre")) {
            // view.removeLayer("bdnb")
            console.log(view.getLayerById("cadastre"))
            view.getLayerById("cadastre").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdOsm() {

    console.log("addOsm")
    // console.log(itowns)
    console.log(view)
    console.log(document.getElementById("affiche_bd_osm").checked)
    if (document.getElementById("affiche_bd_osm").checked) {
        view.getLayerById("osm").opacity = 1
    }
    else {
        if (view.getLayerById("osm")) {
            // view.removeLayer("bdnb")
            console.log(view.getLayerById("osm"))
            view.getLayerById("osm").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}


// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view, menuGlobe));

// let iris_layer = addStreamSurfaceFeature(
//     'https://wxs.ign.fr/parcellaire/geoportail/wfs?',
//     '2.0.0',
//     'CADASTRALPARCELS.PARCELLAIRE_EXPRESS:commune',
//     'EPSG:4326',
//     10,
//     "iris",
//     {
//         west: 0.74289,
//         east: 0.74665,
//         south: 45.19272,
//         north: 45.2135,
//     }
// )


// let iris_surface_layer = iris_layer.surface_layer
// let iris_geom_layer = iris_layer.geom

var src = new itowns.FileSource({
    fetchedData: {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature", "properties": { "gid": 80, "station": "MEAUX", "hdysf": 4.860000 }, "geometry": {
                    "type": "Polygon", "coordinates": [
                        [
                            [2.835295595710605, 49.026303143046405],
                            [3.262550657367586, 49.026303143046405],
                            [3.262550657367586, 48.90335704268021],
                            [2.835295595710605, 48.90335704268021],
                            [2.835295595710605, 49.026303143046405]
                        ]


                    ]
                }
            }]
    },

    crs: 'EPSG:4326',
    format: 'application/json',
})

console.log(src)
// 3.05, 48.95

var marne = new itowns.FeatureGeometryLayer('Marne', {
    // Use a FileSource to load a single file once
    source: src,
    transparent: true,
    opacity: 0.7,
    zoom: { min: 0 },
    style: new itowns.Style({
        fill: {
            color: new itowns.THREE.Color(0xbbffbb),
            extrusion_height: 10000,
        }
    })
});

view.addLayer(marne)



// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    // document.getElementById("affiche_bd_topo").addEventListener("change", addBdTopo)

    // document.getElementById("affiche_bd_nb").addEventListener("change", addBdnb)

    // document.getElementById("affiche_bd_cadastre").addEventListener("change", addBdCadastre)

    // document.getElementById("affiche_bd_osm").addEventListener("change", addBdOsm)

    // addShp("../data/shp/prg/bdnb_perigeux7", "bdnb", "red", "pink", view)

    // addShp("../data/shp/prg/cadastre_perigeux8", "cadastre", "orange", "purple", view)

    // addShp("../data/shp/prg/bd_topo", "bd_topo", "green", "blue", view)

    // addShp("../data/shp/communes/perigeux", "com", "yellow", "", view)

    addShp("../data/shp/prg/osm", "osm", "black", "grey", view)

    addSpecificBuilings("osm", 1000, "type", "apartments", "red", view)

    // i = 0;
    // shapefile.open("../data/shp/prg/osm.shp")
    //     .then(source => source.read()
    //         .then(function log(result) {
    //             if (result.done) return;
    //             // console.log(result.value)



    //             try {
    //                 if (result.value.properties.type === "apartments") {
    //                     console.log(result.value.geometry.coordinates)

    //                     let list = []
    //                     // result.value.geometry.coordinates[0].forEach(element => {
    //                     //     console.log(element)
    //                     // });
    //                     var src2 = new itowns.FileSource({
    //                         fetchedData: {
    //                             "type": "FeatureCollection",
    //                             "features": [
    //                                 {
    //                                     "type": "Feature", "properties": { "gid": 80, "station": "MEAUX", "hdysf": 4.860000 }, "geometry": {
    //                                         "type": "Polygon", "coordinates": [result.value.geometry.coordinates[0]]
    //                                     }
    //                                 }]
    //                         },

    //                         crs: 'EPSG:4326',
    //                         format: 'application/json',
    //                     })

    //                     var bat = new itowns.FeatureGeometryLayer(result.value.properties.osm_id, {
    //                         // Use a FileSource to load a single file once
    //                         source: src2,
    //                         transparent: true,
    //                         opacity: 0.7,
    //                         zoom: { min: 0 },
    //                         style: new itowns.Style({
    //                             fill: {
    //                                 color: new itowns.THREE.Color(0xbbffbb),
    //                                 extrusion_height: 100,
    //                             }
    //                         })
    //                     });

    //                     view.addLayer(bat)

    //                 }
    //             } catch (e) {

    //             }






    //             return source.read().then(log);
    //         }))
    //     .catch(error => console.error(error.stack));
});

debug.createTileDebugUI(menuGlobe.gui, view);


// for (const layer of view.getLayers()) {
//     if (layer.id === 'WFS Building') {
//         layer.whenReady.then(function _(layer) {
//             const gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
//             debug.GeometryDebug.addWireFrameCheckbox(gui, view, layer);
//             window.addEventListener(
//                 'click',
//                 (event) => { picking(event, view) },
//                 false);
//         });
//     }

// }

