// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { buildingLayer, colorBuildings, altitudeBuildings, acceptFeature, extrudeBuildings } from "./models/building";

// ----------------- Global variables ----------------- //

let meshes = [];
let linesBus = [];
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

// Instanciate iTowns GlobeView*
const view = new itowns.GlobeView(viewerDiv, placement);
setupLoadingScreen(viewerDiv, view);



// ----------------- Layer Setup ----------------- //
// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json').then(function _(config) {
    config.source = new itowns.WMTSSource(config.source);
    const layer = new itowns.ColorLayer('Ortho', config);
    view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
});

// Elevation layers
// These will deform iTowns globe geometry to represent terrain elevation.
function addElevationLayerFromConfig(config) {
    config.source = new itowns.WMTSSource(config.source);
    const layer = new itowns.ElevationLayer(config.id, config);
    view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
}
itowns.Fetcher.json('../data/layers/JSONLayers/WORLD_DTM.json').then(addElevationLayerFromConfig);
itowns.Fetcher.json('../data/layers/JSONLayers/IGN_MNT_HIGHRES.json').then(addElevationLayerFromConfig);


scaler = function update(/* dt */) {
    let i;
    let mesh;
    // console.log("update")
    if (meshes.length) {
        view.notifyChange(view.camera.camera3D, true);
    }
    for (i = 0; i < meshes.length; i++) {
        mesh = meshes[i];
        if (mesh) {
            mesh.scale.z = Math.min(
                1.0, mesh.scale.z + 0.1);
            mesh.updateMatrixWorld(true);
        }
    }
    meshes = meshes.filter(function filter(m) { return m.scale.z < 1; });
};

view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, scaler);

// Buildings Layer
const wfsBuildingSource = new itowns.WFSSource({
    url: 'https://wxs.ign.fr/topographie/geoportail/wfs?',
    version: '2.0.0',
    typeName: 'BDTOPO_V3:batiment',
    crs: 'EPSG:4326',
    ipr: 'IGN',
    format: 'application/json',
    extent: {
        west: 0.67289,
        east: 0.74665,
        south: 45.17272,
        north: 45.2135,
    },
});


const wfsBuildingLayer = new itowns.FeatureGeometryLayer('WFS Building', {
    batchId: function (property, featureId) { return featureId; },
    onMeshCreated: function scaleZ(mesh) {
        mesh.children.forEach(c => {
            c.scale.z = 0.01;
            meshes.push(c);
        })
    },
    filter: acceptFeature,
    source: wfsBuildingSource,
    zoom: { min: 14 },

    style: new itowns.Style({
        fill: {
            color: colorBuildings,
            base_altitude: altitudeBuildings,
            extrusion_height: extrudeBuildings,
        }
    })
});
view.addLayer(wfsBuildingLayer);

const menuGlobe = new GuiTools('menuDiv', view);
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