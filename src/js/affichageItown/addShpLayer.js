import { loadBufferDataFromShp } from "../recupData/dataFromShpDbf"

/**
 * add a shapfile layer front itwon
 * @param {String} filePath - path to the shp 
 * @param {String} layerName -id of the layer
 * @param {String} oulineColor 
 * @param {String} fillColor 
 * @param {Object} view - itowns view
 * @param {Boolean} tooltipAvailable - add raycaster
 */
export function addShp(filePath, layerName, oulineColor, fillColor, view, tooltipAvailable) {
    loadBufferDataFromShp(filePath).then((geojson) => {
        const shp2 = new itowns.FileSource({
            fetchedData: geojson,
            crs: 'EPSG:4326',
            format: 'application/json',
        });
        let colorl = new itowns.ColorLayer(layerName, {
            source: shp2,
            style: new itowns.Style({
                zoom: { min: 0 },
                // point: { color: 'white', line: 'green' },
                fill: {
                    color: fillColor,
                },
                stroke: {
                    color: oulineColor,
                    width: 1.0
                }
            }),
            addLabelLayer: true,
        });
        return view.addLayer(colorl);
    }).then((layer => {
        if (tooltipAvailable) {
            // Finally, we generate tooltip for when the mouse hovers the data displayed within our created layer.
            FeatureToolTip.addLayer(layer, { filterAllProperties: false });
        }
        return layer
    }));
}
