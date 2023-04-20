
/**
 * 
 * @param {String} filePath - path to the shp 
 * @param {String} layerName -id of the layer
 * @param {String} oulineColor 
 * @param {String} fillColor 
 * @param {Object} view - itowns view
 * @param {Boolean} tooltipAvailable - add raycaster
 */
export async function addShp(filePath, layerName, oulineColor, fillColor, view, tooltipAvailable) {
    await itowns.Fetcher.multiple(
        filePath,
        {
            // fetch all files whose name match the `url` parameter value, and whose format is either `shp`,
            // `dbf`, `shx` or `prj`.
            arrayBuffer: ['shp', 'dbf', 'shx'],
            text: ['prj'],
        },
    ).then((fetched) => {
        return itowns.ShapefileParser.parse(fetched, {
            // Options indicating how the features should be built from data.
            out: {
                // Specitfy the crs to convert the input coordinates to.
                crs: view.tileLayer.extent.crs,
            },
        })
    }).then((parsed) => {
        const shp2 = new itowns.FileSource({ features: parsed });
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
