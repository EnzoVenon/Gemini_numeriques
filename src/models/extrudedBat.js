//add one or more builing 
/*
databaseType: osm, bdtopo, cadastre, bdnb
hauteur du batiment 
properties: filter accroding to --valuesOfPerperties-- of properties => id, type, usage, .....
Color for the object
*/
const THREE = itowns.THREE

export function addSpecificBuilings(databaseType, height, properties, valuesOfPerperties, color, view) {

    shapefile.open(databaseType)
        .then(source => source.read()
            .then(function log(result) {
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
                        // console.log(result.value.geometry.coordinates[0])


                        let bat = new itowns.FeatureGeometryLayer(result.value.properties[properties] + color, {
                            source: src2,
                            transparent: true,
                            opacity: 0.7,
                            zoom: { min: 0 },
                            style: new itowns.Style({
                                fill: {
                                    color: color,
                                    extrusion_height: height,
                                }
                            }),
                            onMeshCreated: (mesh) => {
                                console.log(mesh.children[0].children[0].children[0].children[0])
                                let object = mesh.children[0].children[0].children[0].children[0]
                                var objectEdges = new THREE.LineSegments(
                                    new THREE.EdgesGeometry(object.geometry),
                                    new THREE.LineBasicMaterial({ color: 'black' })
                                );

                                object.add(objectEdges);
                            }
                        });

                        view.addLayer(bat)


                        document.getElementById('bat').value = { coord: result.value.geometry.coordinates[0] }






                    }
                } catch (e) {
                    console.log(e)
                }
                return source.read().then(log);
            }))
        .catch(error => console.error(error.stack));

}


