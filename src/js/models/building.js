

let meshes = [];

export function update(/* dt */view) {
    let i;
    let mesh;
    // console.log("update")
    if (meshes.length) {
        view.notifyChange(view.camera.camera3D, true);
    }
    for (i = 0; i < meshes.length; i++) {
        mesh = meshes[i];
        if (mesh) {
            mesh.scale.z = Math.min(
                1.0, mesh.scale.z + 0.1);
            mesh.updateMatrixWorld(true);
        }
    }
    meshes = meshes.filter(function filter(m) { return m.scale.z < 1; });
}

export function buildingLayer(serverURL, version, nameType, crs, ipr, format, extent) {

    // Source
    const geometrySource = new itowns.WFSSource({
        url: serverURL,
        version: version,
        typeName: nameType,
        crs: crs,
        ipr: ipr,
        networkOptions: {
            "crossOrigin": "allow"
        },
        format: format,
        extent: extent
    });

    // Geometry Layer
    const geomLayer = new itowns.FeatureGeometryLayer('WFS Building', {
        batchId: function (property, featureId) { return featureId; },
        onMeshCreated: function scaleZ(mesh) {
            mesh.children.forEach(c => {
                c.scale.z = 0.01;
                meshes.push(c);
            })
        },
        filter: acceptFeature,
        source: geometrySource,
        zoom: { min: 0 },

        style: new itowns.Style({
            fill: {
                color: colorBuildings,
                base_altitude: altitudeBuildings,
                extrusion_height: extrudeBuildings,
            }
        })
    });

    return geomLayer;
}




// Coloring the data
function colorBuildings(properties) {

    let color = new itowns.THREE.Color();
    if (properties.usage_1 === 'Résidentiel') {
        return color.set(0xFDFDFF);
    } else if (properties.usage_1 === 'Annexe') {
        return color.set(0xC6C5B9);
    } else if (properties.usage_1 === 'Commercial et services') {
        return color.set(0x62929E);
    } else if (properties.usage_1 === 'Religieux') {
        return color.set(0x393D3F);
    } else if (properties.usage_1 === 'Sportif') {
        return color.set(0x546A7B);
    }

    return color.set(0x555555);
}

// Placing the data on the ground
function altitudeBuildings(properties) {
    return properties.altitude_minimale_sol;
}

// Extruding the data 
function extrudeBuildings(properties) {
    return properties.hauteur;
}

function acceptFeature(properties) {
    return !!properties.hauteur;
}

/* Properties example:
    altitude_maximale_sol: 190.9
     altitude_maximale_toit: 194
    altitude_minimale_sol: 190.1
    altitude_minimale_toit: 193.5
    appariement_fichiers_fonciers: null
    bbox: Array(4) [ 0.74671617, 45.1690315, 0.74672584, … ]
    construction_legere: true
    date_creation: "2012-02-22T12:29:23.469Z"
    date_d_apparition: null
    date_de_confirmation: null
    date_modification: "2022-05-12T23:19:01.410Z"
    etat_de_l_objet: "En service"
    geojson: Object { id: "batiment.BATIMENT0000000296089808", geometry_name: "geometrie" }
    hauteur: 3.4
    identifiants_sources: ""
    materiaux_de_la_toiture: null
    materiaux_des_murs: null
    methode_d_acquisition_altimetrique: "Interpolation bâti BDTopo"
    methode_d_acquisition_planimetrique: "BDParcellaire recalée"
    nature: "Indifférenciée"
    nombre_d_etages: null
    nombre_de_logements: null
    origine_du_batiment: "Cadastre"
    precision_altimetrique: 2.5
    precision_planimetrique: 3
    sources: null
    style: Object { isStyle: true, order: 0, parent: {…}, … }
    usage_1: "Indifférencié"
    usage_2: null
    <prototype>: Object { … }
*/