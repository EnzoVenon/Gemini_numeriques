// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

// ------------ Imports ------------ //
import { wmtsLayer } from "./models/wmts";
import { elevationLayer } from "./models/elevation";
import { buildingLayer, addMeshToScene } from "./models/building";

// ------------ View ------------ //
const viewerDiv = document.getElementById('viewerDiv');

// Perigueux extent
const extent = {
    west: 0.67289,
    east: 0.74665,
    south: 45.17272,
    north: 45.2135
};

// camera seetup
const placement = {
    coord: new itowns.Coordinates('EPSG:4326', 0.71829, 45.18260),
    range: 3000,
    tilt: 20
};

let view = new itowns.GlobeView(viewerDiv, placement);

// ------------ Layers ------------ //
// WMTS Layer
const wmts_layer = wmtsLayer('http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    'EPSG:3857',
    'ORTHOIMAGERY.ORTHOPHOTOS',
    'PM',
    'image/jpeg');

view.addLayer(wmts_layer);

// Elevation Layer
const elevation_layer = elevationLayer('http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wmts',
    'EPSG:4326',
    'ELEVATION.ELEVATIONGRIDCOVERAGE.HIGHRES',
    'WGS84G',
    'image/x-bil;bits=32');

view.addLayer(elevation_layer);

// Geometry Layer
const layerCoord = buildingLayer('http://wxs.ign.fr/3ht7xcw6f7nciopo16etuqp2/geoportail/wfs?',
    'BDTOPO_BDD_WLD_WGS84G:bati_indifferencie',
    'EPSG:4326',
    14,
    extent,
    view);

view.addLayer(geometry_layer);


// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

});