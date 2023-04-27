import { generateUniqueColors } from "../../utile/generaRandomColorFromList"
import { setLegend } from "../affichageHtml/legend"

/**
 * add a coloryer layer from geojson
 * @param {Object} geojson - data to represent en 2D
 * @param {string} selectOption - attribut for coloring objects
 * @param {String} randomId - id of the layer
 * @param {Boolean} uniqueColor - using unique color 
 * @param {Object} view - itowns view
 * @param {String} uniquecolvalue - the color
 */
export function geosjontToColorLayer(geojson, selectOption, randomId, uniqueColor, view, uniquecolvalue = "red") {
    // Récupérer les valeurs uniques de la propriété "type"
    let uniquePropValues = geojson.features.reduce((acc, feature) => {
        const propfilter = feature.properties[selectOption];
        if (!acc.includes(propfilter)) {
            acc.push(propfilter);
        }
        return acc;
    }, []);

    let uniquecol = generateUniqueColors(uniquePropValues)

    document.getElementById("exampleModalLabel").innerText = selectOption;

    let src = new itowns.FileSource({
        fetchedData: geojson,
        crs: 'EPSG:4326',
        format: 'application/json',
    })

    let layer = new itowns.ColorLayer(randomId, {
        source: src,
        transparent: true,
        opacity: 0.7,
        zoom: { min: 0 },
        style: new itowns.Style({
            fill: {
                color: (properties) => {
                    if (uniqueColor) {
                        return uniquecolvalue
                    }
                    else {
                        let color = uniquecol[properties[selectOption]];
                        return color
                    }

                }
            },
            stroke: {
                color: "blue",
                width: 1.0
            }
        })
    })
    view.addLayer(layer)
    setLegend(uniquecol)
}