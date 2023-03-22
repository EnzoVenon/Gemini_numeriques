// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { update, buildingLayer, colorBuildings, altitudeBuildings, acceptFeature, extrudeBuildings } from "./models/building";
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
// ----------------- Global variables ----------------- //

let meshes = [];
let scaler;
const extent = {
    west: 0.67289,
    east: 0.74665,
    south: 45.17272,
    north: 45.2135,
};

// ----------------- View Setup ----------------- //
// Define crs projection that we will use (taken from https://epsg.io/3946, Proj4js section)
itowns.proj4.defs('EPSG:3946', '+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

// Define initial camera position
const positionOnGlobe = { longitude: 0.71829, latitude: 45.18260, altitude: 3000 };
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 0.71829, 45.18260),
    range: 3000,
    tilt: 30,
}

const viewerDiv = document.getElementById('viewerDiv');

// Instanciate iTowns GlobeView
const view = new itowns.GlobeView(viewerDiv, placement);
setupLoadingScreen(viewerDiv, view);

const menuGlobe = new GuiTools('menuDiv', view);


// ----------------- Layer Setup ----------------- //
// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view, menuGlobe));


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
    },
    14
);
view.addLayer(wfsBuildingLayer);

// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function () {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');
});

debug.createTileDebugUI(menuGlobe.gui, view);

function picking(event) {
    if (view.controls.isPaused) {
        const htmlInfo = document.getElementById('info');
        const intersects = view.pickObjectsAt(event, 3, 'WFS Building');
        let properties;
        let info;
        let batchId;

        htmlInfo.innerHTML = ' ';

        if (intersects.length) {
            batchId = intersects[0].object.geometry.attributes.batchId.array[intersects[0].face.a];
            properties = intersects[0].object.feature.geometries[batchId].properties;

            Object.keys(properties).map(function (objectKey) {
                const value = properties[objectKey];
                if (value) {
                    const key = objectKey.toString();
                    if (key[0] !== '_' && key !== 'geometry_name') {
                        info = value.toString();
                        htmlInfo.innerHTML += '<li><b>' + key + ': </b>' + info + '</li>';
                    }
                }
            });
        }
    }
}

for (const layer of view.getLayers()) {

    if (layer.id === 'WFS Building') {
        layer.whenReady.then(function _(layer) {
            const gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
            debug.GeometryDebug.addWireFrameCheckbox(gui, view, layer);
            window.addEventListener('mousemove', picking, false);
        });
    }

}