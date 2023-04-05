// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html

// ----------------- Imports ----------------- //
import { update/*, buildingLayer */ } from "./models/building";
//import { picking } from "./models/connectDataToBuidlings"
import { addOrthoLayer } from "./models/ortho";
import { addElevationLayer } from "./models/elevation";
//import { addStreamSurfaceFeature } from "./models/streamSurfaceFeature"
// import { setUpMenu } from "./GUI/BaseMenu";
import { addShp } from "./models/addShpLayer"
import { addSpecificBuilings } from "./models/extrudedBat"
import { importCsvFile } from "./models/readCsv"
import { importCsvFile } from "./models/readCsv"
import { addChart } from "./models/insee/showChart"
import * as contenuOnglet from "./models/contenuOnglets"


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



// ----------------- Navigation widget ----------------- //

const widgets = new itowns_widgets.Navigation(view);
console.log(itowns_widgets)

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



// ----------------- Layers Setup ----------------- //
// Elevation layers
itowns.Fetcher.json('../data/layers/JSONLayers/WORLD_DTM.json')
    .then(result => addElevationLayer(result, view));
itowns.Fetcher.json('../data/layers/JSONLayers/IGN_MNT_HIGHRES.json')
    .then(result => addElevationLayer(result, view));

view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, function () { update(view) });

// Ortho Layer
itowns.Fetcher.json('../data/layers/JSONLayers/Ortho.json')
    .then(result => addOrthoLayer(result, view));

// CSV files
let csv = importCsvFile("../data/shp/prg/data_bdnb.csv")
let csv2 = importCsvFile("../data/csv/base-ic-couples-familles-menages-2019.CSV")




// ----------------- Globe Initialisatioin ----------------- //
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function globeInitialized() {
    // eslint-disable-next-line no-console
    console.info('Globe initialized');

    addShp("../data/shp/prg/bdnb_perigeux8", "bdnb", "black", "", view, true)

});


const tooltip = document.getElementById('tooltip');
console.log(tooltip)

tooltip.addEventListener(
    'DOMSubtreeModified',
    () => {
        console.log(tooltip.value);

        const mouseevent = document.getElementById('mouseevent')
        console.log(mouseevent.value);

        addSpecificBuilings("../data/shp/prg/bdnb_perigeux8", 100, "batiment_g", tooltip.value.properties.batiment_g, "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); }), view)

        console.log(document.getElementById('bat').value.coord);
        console.log(document.getElementById('bat').value.coord[0][0], document.getElementById('bat').value.coord[0][1], 100);

        csv.then(res => {
            console.log(res)
            let uniqueData = res.filter(obj => obj.batiment_groupe_id === tooltip.value.properties.batiment_g)[0]


            const entries = Object.entries(uniqueData)
            console.log(entries)
            const nonEmptyOrNull = entries.filter(([key, val]) => val !== '' && val !== null && key !== null)
            const output = Object.fromEntries(nonEmptyOrNull)

            console.log(output)

            document.getElementById('batInfo').innerHTML = JSON.stringify(output)
            // document.getElementById("btnOffcanvasScrollingbat").click()

        });

    },
    false
)


const htmlTest = document.getElementById('infoGen');
viewerDiv.addEventListener(
    'mouseup',
    () => {

        htmlTest.innerHTML = '';
        textHtml = '';
        textHtml += '<div class="accordion accordion-flush" id="accordionFlushExample">';

        csv2
            .then(res => {
                // ----------- POPULATION INSEE ----------- //
                // Retrieve elements where Iris number is same as tooltip
                let uniqueData = res.filter(obj => obj.IRIS === Number(tooltip.value.properties.code_iris))[0]
                const currentkey = contenuOnglet.getKeyByValue(uniqueData, Number(tooltip.value.properties.code_iris));

                // Add INSEE value for this IRIS in tooltip properties
                Object.entries(uniqueData).forEach(([key, value]) => {
                    if (!(value === Number(tooltip.value.properties.code_iris))) {
                        tooltip.value.properties[key] = value;
                    }
                })

                // Chart for INSEE values
                const relation15OuPlus = ['P19_POP15P_MARIEE', 'P19_POP15P_PACSEE', 'P19_POP15P_CONCUB_UNION_LIBRE', 'P19_POP15P_VEUFS', 'P19_POP15P_DIVORCEE', 'P19_POP15P_CELIBATAIRE']
                const dataRelation15 = contenuOnglet.dataINSEE4Chart(relation15OuPlus, 4, tooltip.value.properties);

                // Generate html accordion item
                htmlTest.innerHTML += contenuOnglet.generateAccordionItem(currentkey, 'pop');
                addChart('pop', dataRelation15, 'name', 'value', 'Population');


                console.log(htmlTest.innerHTML)


            });


    },
    false
)
htmlTest.innerHTML += '</div>';
