// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { update/*, buildingLayer */ } from "./models/building";
//import { picking } from "./models/connectDataToBuidlings"
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
//import { addStreamSurfaceFeature } from "./models/streamSurfaceFeature"
import { setUpMenu } from "./GUI/BaseMenu";

import { addShp } from "./models/addShpLayer"

import { addSpecificBuilings } from "./models/extrudedBat"


setUpMenu();


// ----------------- View Setup ----------------- //
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


// ---------- ADD NAVIGATION WIDGET : ----------

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



// Elevation layers
itowns.Fetcher.json('../data/layers/JSONLayers/WORLD_DTM.json')
    .then(result => addElevationLayer(result, view, menuGlobe));
itowns.Fetcher.json('../data/layers/JSONLayers/IGN_MNT_HIGHRES.json')
    .then(result => addElevationLayer(result, view, menuGlobe));

view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, function () { update(view) });


function addBdTopo() {

    console.log("bd_topo")
    if (document.getElementById("affiche_bd_topo").checked) {
        view.getLayerById("bd_topo").opacity = 1
    }
    else {
        if (view.getLayerById("bd_topo")) {
            view.getLayerById("bd_topo").opacity = 0
        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdnb() {

    console.log("addBdnb")
    if (document.getElementById("affiche_bd_nb").checked) {
        view.getLayerById("bdnb").opacity = 1
    }
    else {
        if (view.getLayerById("bdnb")) {
            view.getLayerById("bdnb").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdCadastre() {

    console.log("addCadastre")
    if (document.getElementById("affiche_bd_cadastre").checked) {
        view.getLayerById("cadastre").opacity = 1
    }
    else {
        if (view.getLayerById("cadastre")) {
            view.getLayerById("cadastre").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdinnond_fr() {

    console.log("addinnond_fr")
    // console.log(itowns)
    // console.log(view)
    // console.log(document.getElementById("affiche_innondation_forte").checked)
    if (document.getElementById("affiche_innondation_forte").checked) {
        view.getLayerById("innond_fr").opacity = 1
    }
    else {
        if (view.getLayerById("innond_fr")) {
            // view.removeLayer("bdnb")
            // console.log(view.getLayerById("cadastre"))
            view.getLayerById("innond_fr").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}

function addBdOsm() {

    console.log("addOsm")
    if (document.getElementById("affiche_bd_osm").checked) {
        view.getLayerById("osm").opacity = 1
    }
    else {
        if (view.getLayerById("osm")) {
            view.getLayerById("osm").opacity = 0


        }

    }
    view.mainLoop.gfxEngine.renderer.render(view.scene, view.camera.camera3D)
}


// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view, menuGlobe));


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

    document.getElementById("affiche_bd_osm").addEventListener("change", addBdOsm)


    // addShp("../data/shp/prg/bdnb_perigeux7", "bdnb", "red", "pink", view)

    document.getElementById("affiche_innondation_forte").addEventListener("change", addBdOsm)

    addShp("../data/shp/prg/bdnb_perigeux7", "bdnb", "red", "pink", view)


    // addShp("../data/shp/prg/cadastre_perigeux8", "cadastre", "orange", "purple", view)

    // addShp("../data/shp/prg/bd_topo", "bd_topo", "green", "blue", view)

    // addShp("../data/shp/communes/perigeux", "com", "yellow", "", view)

    addShp("../data/shp/prg/osm", "osm", "black", "grey", view)


    addSpecificBuilings("osm", 100, "type", "apartments", "red", view)

    addShp("../data/shp/innondation/forte/n_tri_peri_inondable_01_01for_s_024", "innondation_fr", "yellow", "yellow", view)




});


const tooltip = document.getElementById('tooltip');
console.log(tooltip)
tooltip.addEventListener(
    'click',
    () => {
        console.log(tooltip.value);

        addSpecificBuilings("osm", 100, "osm_id", tooltip.value.osm_id, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view)


    },
    false
)
debug.createTileDebugUI(menuGlobe.gui, view);
