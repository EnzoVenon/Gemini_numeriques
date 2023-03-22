// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { update, buildingLayer, picking } from "./models/building";
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
import { addStreamSurfaceFeature } from "./models/streamSurfaceFeature"

// ----------------- View Setup ----------------- //
// Define crs projection that we will use (taken from https://epsg.io/3946, Proj4js section)
// itowns.proj4.defs('EPSG:3946', '+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

// Define initial camera position
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 0.71829, 45.18260),
    range: 3000,
    tilt: 20,
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


const wfsBuildingLayer = buildingLayer(
    'https://wxs.ign.fr/topographie/geoportail/wfs?',
    '2.0.0',
    'BDTOPO_V3:batiment',
    'EPSG:4326',
    'IGN',
    'application/json',
    {
        west: 0.67289,
        east: 0.74665,
        south: 45.17272,
        north: 45.2135,
    }
);
view.addLayer(wfsBuildingLayer);

var wfsCartoSource = new itowns.WFSSource({
    url: 'https://wxs.ign.fr/cartovecto/geoportail/wfs?',
    version: '2.0.0',
    typeName: 'BDCARTO_BDD_WLD_WGS84G:departement',
    crs: 'EPSG:4326',
    ipr: 'IGN',
    format: 'application/json',
});

var wfsCartoStyle = new itowns.Style({
    zoom: { min: 10, max: 20 },
    // point: { color: 'white', line: 'green' },
    fill: {
        color: setColor
    },
    stroke: { color: "red" }
});

var wfsCartoLayer = new itowns.ColorLayer('testWFSDEP', {
    source: wfsCartoSource,
    style: wfsCartoStyle,

    addLabelLayer: true,
});


view.addLayer(wfsCartoLayer).then(menuGlobe.addLayerGUI.bind(menuGlobe));


// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view, menuGlobe));


// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');



});

debug.createTileDebugUI(menuGlobe.gui, view);


for (const layer of view.getLayers()) {
    if (layer.id === 'WFS Building') {
        layer.whenReady.then(function _(layer) {
            const gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
            debug.GeometryDebug.addWireFrameCheckbox(gui, view, layer);
            window.addEventListener(
                'mousemove',
                (event) => { picking(event, view) },
                false);
        });
    }

}

function setColor(properties) {
    console.log(properties)

    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', 0.3)';
}