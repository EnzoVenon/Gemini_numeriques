const getUniquePropNames = require("../utile/getUniquePropertiesNamesFromGeojson");

test('generate random color', () => {

    let geojson = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature", "properties": { "ID": 11, "hauteur": 12 }, "geometry": {
                    "type": "Polygon", "coordinates": [22, 12, 12]
                }
            }]
    }
    expect(getUniquePropNames(geojson)).toStrictEqual(["ID", "hauteur"]);
});
