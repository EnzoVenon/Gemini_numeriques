import { generateUniqueColors } from "../utile/generaRandomColorFromList"

export function updateSelectOption(geojson, idSelectDrop2d, updateSlectOptions) {
    // supposons que votre objet GeoJSON est stocké dans la variable 'geojson'
    // obtenir un tableau des noms de propriétés
    const propNames = geojson.features.reduce((acc, feature) => {
        return acc.concat(Object.keys(feature.properties));
    }, []);
    // créer un tableau des clés uniques
    const uniquePropNames = propNames.reduce((acc, propName) => {
        if (!acc.includes(propName)) {
            acc.push(propName);
        }
        return acc;
    }, []);

    // console.log(uniquePropNames)

    if (updateSlectOptions) {
        // Récupération de l'élément HTML de sélection
        const selectElement = document.getElementById(idSelectDrop2d);
        selectElement.innerHTML = "";

        // Boucle pour ajouter chaque valeur à la sélection
        uniquePropNames.forEach(value => {
            // Création d'un élément d'option
            const option = document.createElement('option');
            // Ajout de la valeur de l'option
            option.text = value;
            // Ajout de la valeur de l'option en tant que valeur d'attribut
            option.value = value;
            // Ajout de l'option à l'élément de sélection
            selectElement.add(option);
        });

    }

    console.log(uniquePropNames)
}


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