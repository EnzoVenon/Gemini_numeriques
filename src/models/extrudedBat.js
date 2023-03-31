//add one or more builing 
/*
databaseType: osm, bdtopo, cadastre, bdnb
hauteur du batiment 
properties: filter accroding to --valuesOfPerperties-- of properties => id, type, usage, .....
Color for the object
*/
export function addSpecificBuilings(databaseType, height, properties, valuesOfPerperties, color, view) {



    if (databaseType === "osm") {
        shapefile.open("../data/shp/prg/osm.shp")
            .then(source => source.read()
                .then(function log(result) {
                    if (result.done) return;
                    // console.log(result.value)
                    try {
                        if (result.value.properties[properties] === valuesOfPerperties) {
                            let src2 = new itowns.FileSource({
                                fetchedData: {
                                    "type": "FeatureCollection",
                                    "features": [
                                        {
                                            "type": "Feature", "properties": { "gid": 80, "station": "MEAUX", "hdysf": 4.860000 }, "geometry": {
                                                "type": "Polygon", "coordinates": [result.value.geometry.coordinates[0]]
                                            }
                                        }]
                                },

                                crs: 'EPSG:4326',
                                format: 'application/json',
                            })

                            let bat = new itowns.FeatureGeometryLayer(result.value.properties.osm_id, {
                                source: src2,
                                transparent: true,
                                opacity: 0.7,
                                zoom: { min: 0 },
                                style: new itowns.Style({
                                    fill: {
                                        color: color,
                                        extrusion_height: height,
                                    }
                                })
                            });

                            view.addLayer(bat)

                            document.getElementById('bat').value = { coord: result.value.geometry.coordinates[0] }

                        }
                    } catch (e) {

                    }
                    return source.read().then(log);
                }))
            .catch(error => console.error(error.stack));
    }
}


