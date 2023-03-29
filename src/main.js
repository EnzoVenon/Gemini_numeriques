// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { update, buildingLayer } from "./models/building";
import { picking } from "./models/connectDataToBuidlings"
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
import { addStreamSurfaceFeature } from "./models/streamSurfaceFeature"
import { setUpMenu } from "./GUI/BaseMenu";

import { addShp } from "./models/addShpLayer"

import { addSpecificBuilings } from "./models/extrudedBat"

import * as itowns_widgets from "../node_modules/itowns/dist/itowns_widgets";


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
FeatureToolTip.init(viewerDiv, view);

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
    // console.log(view)
    // console.log(document.getElementById("affiche_bd_topo").checked)
    if (document.getElementById("affiche_bd_topo").checked) {
        view.getLayerById("bd_topo").opacity = 1
    }
    else {
        if (view.getLayerById("bd_topo")) {
            // view.removeLayer("bd_topo")
            // console.log(view.getLayerById("bd_topo"))
            view.getLayerById("bd_topo").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdnb() {

    console.log("addBdnb")
    // console.log(itowns)
    // console.log(view)
    // console.log(document.getElementById("affiche_bd_nb").checked)
    if (document.getElementById("affiche_bd_nb").checked) {
        view.getLayerById("bdnb").opacity = 1
    }
    else {
        if (view.getLayerById("bdnb")) {
            // view.removeLayer("bdnb")
            // console.log(view.getLayerById("bdnb"))
            view.getLayerById("bdnb").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdCadastre() {

    console.log("addCadastre")
    // console.log(itowns)
    // console.log(view)
    // console.log(document.getElementById("affiche_bd_cadastre").checked)
    if (document.getElementById("affiche_bd_cadastre").checked) {
        view.getLayerById("cadastre").opacity = 1
    }
    else {
        if (view.getLayerById("cadastre")) {
            // view.removeLayer("bdnb")
            // console.log(view.getLayerById("cadastre"))
            view.getLayerById("cadastre").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdOsm() {

    console.log("addOsm")
    // console.log(itowns)
    // console.log(view)
    // console.log(document.getElementById("affiche_bd_osm").checked)
    if (document.getElementById("affiche_bd_osm").checked) {
        view.getLayerById("osm").opacity = 1
    }
    else {
        if (view.getLayerById("osm")) {
            // view.removeLayer("bdnb")
            // console.log(view.getLayerById("osm"))
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

const widgets = new itowns_widgets.Navigation(view);

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

// Geometry.properties
// Couche com
    // CAPITALE: "Non"
    // CL_ARROND: "Oui"
    // CL_COLLTER: "Oui"
    // CL_DEPART: "Oui"
    // CL_REGION: "Non"
    // CODE_POST: "24000"
    // CODE_SIREN: "212403224"
    // DATE_APP: Date Thu Nov 30 1899 00:00:00 GMT+0009 (heure normale d’Europe centrale)
    // DATE_CONF: Date Thu Nov 30 1899 00:00:00 GMT+0009 (heure normale d’Europe centrale)
    // DATE_CREAT: "2006-08-02 08:36:54"
    // DATE_MAJ: "2022-05-16 17:06:46"
    // DATE_RCT: Date Tue Jan 01 2019 00:00:00 GMT+0100 (heure normale d’Europe centrale)
    // ID: "COMMUNE_0000000009754332"
    // ID_AUT_ADM: "SURFACTI0000000049445044"
    // ID_CH_LIEU: "PAIHABIT0000000049513040"
    // INSEE_ARR: "3"
    // INSEE_COL: "24D"
    // INSEE_COM: "24322"
    // INSEE_DEP: "24"
    // INSEE_REG: "75"
    // NOM: "Périgueux"
    // POPULATION: 29896
    // RECENSEUR: "INSEE"
    // SIREN_EPCI: "200040392"
    // SURFACE_HA: 982
    // style: Object { isStyle: true, order: 0, parent: {…}, … }
    //     fill: Object { color: Getter & Setter, opacity: Getter & Setter, pattern: Getter & Setter, … }
    //     icon: Object { source: Getter & Setter, key: Getter & Setter, anchor: Getter & Setter, … }
    //     isStyle: true
    //     order: 0
    //     parent: Object { isStyle: true, order: 0, parent: {…}, … }
    //     point: Object { color: Getter & Setter, line: Getter & Setter, opacity: Getter & Setter, … }
    //     stroke: Object { color: Getter & Setter, opacity: Getter & Setter, width: Getter & Setter, … }
    //     text: Object { field: Getter & Setter, zOrder: Getter & Setter, color: Getter & Setter, … }
    //     zoom: Object { min: Getter & Setter, max: Getter & Setter }

// Couche Bd Topo
    // ACQU_ALTI: "Interpolation bâti BDTopo"
    // ACQU_PLANI: "BDParcellaire recalée"
    // APP_FF: "C 0.9"
    // DATE_APP: Date Tue Jan 01 1850 00:00:00 GMT+0009 (heure normale d’Europe centrale)
    // DATE_CONF: Date Thu Nov 30 1899 00:00:00 GMT+0009 (heure normale d’Europe centrale)
    // DATE_CREAT: "2012-02-13 11:09:07"
    // DATE_MAJ: "2022-05-13 00:43:33"
    // ETAT: "En service"
    // HAUTEUR: 8.3
    // ID: "BATIMENT0000000295374782"
    // ID_SOURCE: ""
    // LEGER: "Non"
    // MAT_MURS: "19"
    // MAT_TOITS: "10"
    // NATURE: "Indifférenciée"
    // NB_ETAGES: 3
    // NB_LOGTS: 3
    // ORIGIN_BAT: "Cadastre"
    // PREC_ALTI: 2.5
    // PREC_PLANI: 3
    // SOURCE: ""
    // USAGE1: "Résidentiel"
    // USAGE2: "Commercial et services"
    // Z_MAX_SOL: 86.6
    // Z_MAX_TOIT: 95.2
    // Z_MIN_SOL: 86
    // Z_MIN_TOIT: 94.3
    // style: Object { isStyle: true, order: 0, parent: {…}, … }
    //     fill: Object { color: Getter & Setter, opacity: Getter & Setter, pattern: Getter & Setter, … }
    //     icon: Object { source: Getter & Setter, key: Getter & Setter, anchor: Getter & Setter, … }
    //     isStyle: true
    //     order: 0
    //     parent: Object { isStyle: true, order: 0, parent: {…}, … }
    //     point: Object { color: Getter & Setter, line: Getter & Setter, opacity: Getter & Setter, … }
    //     stroke: Object { color: Getter & Setter, opacity: Getter & Setter, width: Getter & Setter, … }
    //     text: Object { field: Getter & Setter, zOrder: Getter & Setter, color: Getter & Setter, … }
    //     zoom: Object { min: Getter & Setter, max: Getter & Setter }

// Couche Cadastre
    // commune: "24322"
    // created: Date Mon Oct 23 2006 00:00:00 GMT+0200 (heure d’été d’Europe centrale)
    // nom: ""
    // style: Object { isStyle: true, order: 0, parent: {…}, … }
    //     fill: Object { color: Getter & Setter, opacity: Getter & Setter, pattern: Getter & Setter, … }
    //     icon: Object { source: Getter & Setter, key: Getter & Setter, anchor: Getter & Setter, … }
    //     isStyle: true
    //     order: 0
    //     parent: Object { isStyle: true, order: 0, parent: {…}, … }
    //     point: Object { color: Getter & Setter, line: Getter & Setter, opacity: Getter & Setter, … }
    //     stroke: Object { color: Getter & Setter, opacity: Getter & Setter, width: Getter & Setter, … }
    //     text: Object { field: Getter & Setter, zOrder: Getter & Setter, color: Getter & Setter, … }
    //     zoom: Object { min: Getter & Setter, max: Getter & Setter }
    //     <prototype>: Object { … }
    //     type: "01"
    // updated: Date Tue Jun 12 2018 00:00:00 GMT+0200 (heure d’été d’Europe centrale)

// Couche osm
    // code: 1500
    // fclass: "building"
    // name: ""
    // osm_id: "75344703"
    // style: Object { isStyle: true, order: 0, parent: {…}, … }
    //     fill: Object { color: Getter & Setter, opacity: Getter & Setter, pattern: Getter & Setter, … }
    //     icon: Object { source: Getter & Setter, key: Getter & Setter, anchor: Getter & Setter, … }
    //     isStyle: true
    //     order: 0
    //     parent: Object { isStyle: true, order: 0, parent: {…}, … }
    //     point: Object { color: Getter & Setter, line: Getter & Setter, opacity: Getter & Setter, … }
    //     stroke: Object { color: Getter & Setter, opacity: Getter & Setter, width: Getter & Setter, … }
    //     text: Object { field: Getter & Setter, zOrder: Getter & Setter, color: Getter & Setter, … }
    //     zoom: Object { min: Getter & Setter, max: Getter & Setter }
    //     <prototype>: Object { … }
    //     type: ""


// Couche bdnb

    // altitude_s: 86
    // batiment_c: "BATIMENT0000000295375054-2"
    // batiment_g: "24322000BR0208_c7642ee6a31bfc8"
    // code_commu: "24322"
    // code_depar: "24"
    // code_iris: "243220101"
    // fictive_ge: 0
    // fid: 25191
    // hauteur: 5.9
    // s_geom_cst: 125
    // style: Object { isStyle: true, order: 0, parent: {…}, … }
    //     fill: Object { color: Getter & Setter, opacity: Getter & Setter, pattern: Getter & Setter, … }
    //     icon: Object { source: Getter & Setter, key: Getter & Setter, anchor: Getter & Setter, … }
    //     isStyle: true
    //     order: 0
    //     parent: Object { isStyle: true, order: 0, parent: {…}, … }
    //     point: Object { color: Getter & Setter, line: Getter & Setter, opacity: Getter & Setter, … }
    //     stroke: Object { color: Getter & Setter, opacity: Getter & Setter, width: Getter & Setter, … }
    //     text: Object { field: Getter & Setter, zOrder: Getter & Setter, color: Getter & Setter, … }
    //     zoom: Object { min: Getter & Setter, max: Getter & Setter }