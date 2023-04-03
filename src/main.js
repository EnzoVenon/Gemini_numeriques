// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

import { update/*, buildingLayer */ } from "./models/building";
//import { picking } from "./models/connectDataToBuidlings"
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
//import { addStreamSurfaceFeature } from "./models/streamSurfaceFeature"
// import { setUpMenu } from "./GUI/BaseMenu";

import { addShp } from "./models/addShpLayer"

import { addSpecificBuilings } from "./models/extrudedBat"


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



// setUpMenu();


// ----------------- View Setup ----------------- //
// Define initial camera position
const placement = {
    // coord: new itowns.Coordinates('EPSG:4326', 3.05, 48.95, 2),
    coord: new itowns.Coordinates('EPSG:4326', 0.72829, 45.18260, 2),


    range: 500,
    tilt: 30,
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




// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    addShp("../data/shp/prg/osm", "osm", "black", "", view, true)


});


const tooltip = document.getElementById('tooltip');
// console.log(tooltip)
tooltip.addEventListener(
    'DOMSubtreeModified',
    () => {
        // console.log(tooltip.value);

        const mouseevent = document.getElementById('mouseevent')
        // console.log(mouseevent.value);

        addSpecificBuilings("osm", 100, "osm_id", tooltip.value.properties.osm_id, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view);

        // console.log(document.getElementById('bat').value.coord);
        // console.log(document.getElementById('bat').value.coord[0][0], document.getElementById('bat').value.coord[0][1], 100);

    },
    false
)