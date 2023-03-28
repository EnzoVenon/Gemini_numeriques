// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { update, buildingLayer } from "./models/building";
import { picking } from "./models/connectDataToBuidlings"
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
import { addStreamSurfaceFeature } from "./models/streamSurfaceFeature"
import { setUpMenu } from "./GUI/BaseMenu";

setUpMenu();


// ----------------- View Setup ----------------- //
// Define crs projection that we will use (taken from https://epsg.io/3946, Proj4js section)
//  itowns.proj4.defs('EPSG:3946', '+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

// Define initial camera position
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

// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view, menuGlobe));

let iris_layer = addStreamSurfaceFeature(
    'https://wxs.ign.fr/cartovecto/geoportail/wfs?',
    '2.0.0',
    'STATISTICALUNITS.IRIS:contours_iris',
    'EPSG:4326',
    10,
    "iris",
    {
        west: 0.67289,
        east: 0.74665,
        south: 45.17272,
        north: 45.2135,
    }
)


let iris_surface_layer = iris_layer.surface_layer
let iris_geom_layer = iris_layer.geom

// console.log(departement_layer)

// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');


    // view.addLayer(surface_layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
    // view.addLayer(label_layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));

    view.addLayer(iris_geom_layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));


    view.addLayer(iris_surface_layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));

    console.log(iris_surface_layer)

});

debug.createTileDebugUI(menuGlobe.gui, view);


for (const layer of view.getLayers()) {
    if (layer.id === 'WFS Building') {
        layer.whenReady.then(function _(layer) {
            const gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
            debug.GeometryDebug.addWireFrameCheckbox(gui, view, layer);
            window.addEventListener(
                'click',
                (event) => { picking(event, view) },
                false);
        });
    }

}


let meshes = [];
// Je crois que je suis obligé de faire l'event listener ici pour avoir accès à la constante view
// Fonction qui applique un style à la couche BD Topo
document.getElementById("bouton_ok_style").addEventListener('click', () => {
    meshes = [];
    // On récupère les infos de style
    const champ = document.getElementById("in_ch1Topo").value;
    const valeur = document.getElementById("in_v1Topo").value;
    const couleur = document.getElementById("in_co1Topo").value;

    // Nouvelle fonction colorBuildings qui correspond aux infos
    function colorBuildings(properties) {
        let color = new itowns.THREE.Color();
        if (properties[champ] === valeur) {
            return color.set(couleur);
        }

        return color.set(0x555555);
    }

    // Pas changée Placing the data on the ground
    function altitudeBuildings(properties) {
        return properties.altitude_minimale_sol;
    }

    // Pas changée Extruding the data 
    function extrudeBuildings(properties) {
        return properties.hauteur;
    }

    // Pas changée 
    function acceptFeature(properties) {
        return !!properties.hauteur;
    }

    // Comme iTowns ne possède pas de modification dynamique de style, on supprime la couche et on la recrée
    const layer = view.getLayerById('WFS Building');
    view.removeLayer('WFS Building');
    layer.delete();

    // Source
    const geometrySource = new itowns.WFSSource({
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
        }
    });

    // Geometry Layer
    const geomLayer = new itowns.FeatureGeometryLayer('WFS Building', {
        batchId: function (property, featureId) { return featureId; },
        onMeshCreated: function scaleZ(mesh) {
            mesh.children.forEach(c => {
                c.scale.z = 0.01;
                meshes.push(c);
            })
        },
        filter: acceptFeature,
        source: geometrySource,
        zoom: { min: 14 },

        style: new itowns.Style({
            fill: {
                color: colorBuildings,
                base_altitude: altitudeBuildings,
                extrusion_height: extrudeBuildings,
            }
        })
    });

    view.addLayer(geomLayer);
});