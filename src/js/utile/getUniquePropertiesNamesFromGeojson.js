/**
 * filter unique property name in geojson 
 * @param {Object} geojson 
 * @returns lis of unique property name in geojson
 */
export function getUniquePropNames(geojson) {
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

    return uniquePropNames
}
