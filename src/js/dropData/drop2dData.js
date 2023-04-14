import { generateUniqueColors } from "../utile/generaRandomColorFromList"

export function geosjontToColorLayer(geojson, selectOption, randomId, uniqueColor, view, THREE, uniquecolvalue = "red") {
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

    let legendHtml = '<div>';
    for (const [label, color] of Object.entries(uniquecol)) {
        // console.log(color)
        legendHtml += `<div style="display:flex;flex-direction:row"> <div style="background-color:${color};width: 31px;height: 16px; margin-right: 20px;"></div><div>${label}</div></div>`;
    }
    legendHtml += '</div>';

    // create a div element to hold the legend
    document.getElementById("legend").innerHTML = legendHtml;


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
                        // console.log(properties)
                        // console.log(color)
                        return color
                    }

                }
            },
            stroke: {
                color: "red",
                width: 1.0
            }
        })
    })

    view.addLayer(layer)
}