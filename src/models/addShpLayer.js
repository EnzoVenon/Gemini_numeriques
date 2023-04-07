
import * as shp from "shpjs"

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
        // Once our Shapefile data is fetched, we can parse it by running itowns built-in Shapefile parser.
        console.log(fetched)

        const features = shp.parseShp(fetched.shp);

        console.log(features)


        return itowns.ShapefileParser.parse(fetched, {
            // Options indicating how the features should be built from data.
            out: {
                // Specitfy the crs to convert the input coordinates to.
                crs: view.tileLayer.extent.crs,
            },
        });
    }).then((parsed) => {
        // We can then instantiate a FileSource, passing the parsed data,
        // and create a Layer bound to this source.
        console.log(parsed)
        const shp2 = new itowns.FileSource({ features: parsed });


        let colorl = new itowns.ColorLayer(layerName, {
            source: shp2,
            style: new itowns.Style({
                zoom: { min: 0, max: 20 },
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

        // console.log(colorl)


        return view.addLayer(colorl);
    }).then((layer => {
        if (tooltipAvailable) {
            // Finally, we generate tooltip for when the mouse hovers the data displayed within our created layer.
            FeatureToolTip.addLayer(layer, { filterAllProperties: false });
        }

        return layer
    }));

    /*
    function setColor(properties) {
        // console.log(properties)
        var num = Math.round(0xffffff * Math.random());
        var r = num >> 16;
        var g = num >> 8 & 255;
        var b = num & 255;
        return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
    }
    */}
