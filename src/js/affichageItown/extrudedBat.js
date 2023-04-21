/**
 * extrude one building => it is a new layer 
 * @param {String} filePath =>  path to the shp 
 * @param {Number} height => deafult height if there is no height attribute height 
 * @param {String} properties => id properties
 * @param {String} valuesOfPerperties => value of the id
 * @param {String} color => color of the building
 * @param {Object} view 
 */
import { addEdgeObj3d } from "./contourObj3d"
export function addSpecificBuilings(filePath, properties, valuesOfPerperties, color, view, THREE, height = 20) {
    shapefile.open(filePath)
        .then(source => source.read()
            .then(function log(result) {
                //recursive function to loop on all shape in the geojson
                if (result.done) return;
                try {

                    if (result.value.properties[properties] == valuesOfPerperties) {
                        let src2 = new itowns.FileSource({
                            fetchedData: {
                                "type": "FeatureCollection",
                                "features": [
                                    {
                                        "type": "Feature", "properties": result.value.properties, "geometry": {
                                            "type": "Polygon", "coordinates": [result.value.geometry.coordinates[0]]
                                        }
                                    }]
                            },

                            crs: 'EPSG:4326',
                            format: 'application/json',
                        })
                        let bat = new itowns.FeatureGeometryLayer(result.value.properties[properties] + color, {
                            source: src2,
                            transparent: true,
                            opacity: 0.7,
                            zoom: { min: 0 },
                            style: new itowns.Style({
                                fill: {
                                    color: "yellow",
                                    extrusion_height: (properties) => {
                                        if (properties.hauteur) {
                                            return properties.hauteur
                                        }
                                        else if (properties.HAUTEUR) {
                                            return properties.HAUTEUR
                                        }

                                        else {
                                            return height
                                        }
                                    },
                                    base_altitude: (properties) => {
                                        if (properties.altitude_s) {
                                            return properties.altitude_s
                                        }
                                        else if (properties.Z_MIN_SOL) {
                                            return properties.Z_MIN_SOL
                                        }
                                        else {
                                            return 20
                                        }
                                    }

                                }
                            }),
                            onMeshCreated: (mesh) => {
                                let object = mesh.children[0].children[0].children[0].children[0]
                                addEdgeObj3d(object, "black", THREE)
                            }
                        });

                        view.addLayer(bat)
                    }
                } catch (e) {
                    console.log(e)
                }
                return source.read().then(log);
            }))
        .catch(error => console.error(error.stack));

}


