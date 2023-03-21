// https://github.com/iTowns/itowns/blob/master/examples/source_stream_wfs_3d.html
// Define crs projection that we will use (taken from https://epsg.io/3946, Proj4js section)
itowns.proj4.defs("EPSG:3946", "+proj=lcc +lat_1=45.25 +lat_2=46.75 +lat_0=46 +lon_0=3 +x_0=1700000 +y_0=5200000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
// # Simple Globe viewer
// Define initial camera position
var positionOnGlobe = {
    longitude: 4.818,
    latitude: 45.7354,
    altitude: 3000
};
var placement = {
    coord: new itowns.Coordinates("EPSG:4326", 4.818, 45.7354),
    range: 3000,
    tilt: 45
};
var meshes = [];
var linesBus = [];
var scaler;
// `viewerDiv` will contain iTowns' rendering area (`<canvas>`)
var viewerDiv = document.getElementById("viewerDiv");
// Instanciate iTowns GlobeView*
var view = new itowns.GlobeView(viewerDiv, placement);
setupLoadingScreen(viewerDiv, view);
// Add one imagery layer to the scene
// This layer is defined in a json file but it could be defined as a plain js
// object. See Layer* for more info.
itowns.Fetcher.json("./layers/JSONLayers/Ortho.json").then(function _(config) {
    config.source = new itowns.WMTSSource(config.source);
    var layer = new itowns.ColorLayer("Ortho", config);
    view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
});
// Add two elevation layers.
// These will deform iTowns globe geometry to represent terrain elevation.
function addElevationLayerFromConfig(config) {
    config.source = new itowns.WMTSSource(config.source);
    var layer = new itowns.ElevationLayer(config.id, config);
    view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
}
itowns.Fetcher.json("./layers/JSONLayers/WORLD_DTM.json").then(addElevationLayerFromConfig);
itowns.Fetcher.json("./layers/JSONLayers/IGN_MNT_HIGHRES.json").then(addElevationLayerFromConfig);
var color = new itowns.THREE.Color();
var tile;
function altitudeLine(properties, contour) {
    var result;
    var z = 0;
    if (contour) {
        result = itowns.DEMUtils.getTerrainObjectAt(view.tileLayer, contour, 0, tile);
        if (!result) result = itowns.DEMUtils.getTerrainObjectAt(view.tileLayer, contour, 0);
        tile = [
            result.tile
        ];
        if (result) z = result.coord.z;
        return z + 5;
    }
}
function colorLine(properties) {
    return color.set(Math.round(Math.random() * 0xffffff));
}
function acceptFeatureBus(properties) {
    if (properties.sens == "Aller") {
        var line = properties.ligne;
        if (linesBus.indexOf(line) === -1) {
            linesBus.push(line);
            return true;
        }
    }
    return false;
}
var lyonTclBusSource = new itowns.WFSSource({
    protocol: "wfs",
    url: "https://download.data.grandlyon.com/wfs/rdata?",
    version: "2.0.0",
    typeName: "tcl_sytral.tcllignebus",
    crs: "EPSG:3946",
    extent: {
        west: 1822174.60,
        east: 1868247.07,
        south: 5138876.75,
        north: 5205890.19
    },
    format: "geojson"
});
var lyonTclBusLayer = new itowns.FeatureGeometryLayer("WFS Bus lines", {
    name: "lyon_tcl_bus",
    filter: acceptFeatureBus,
    source: lyonTclBusSource,
    zoom: {
        min: 9
    },
    style: new itowns.Style({
        stroke: {
            color: colorLine,
            base_altitude: altitudeLine,
            width: 5
        }
    })
});
view.addLayer(lyonTclBusLayer);
function colorBuildings(properties) {
    if (properties.usage_1 === "R\xe9sidentiel") return color.set(0xFDFDFF);
    else if (properties.usage_1 === "Annexe") return color.set(0xC6C5B9);
    else if (properties.usage_1 === "Commercial et services") return color.set(0x62929E);
    else if (properties.usage_1 === "Religieux") return color.set(0x393D3F);
    else if (properties.usage_1 === "Sportif") return color.set(0x546A7B);
    return color.set(0x555555);
}
function altitudeBuildings(properties) {
    return properties.altitude_minimale_sol;
}
function extrudeBuildings(properties) {
    return properties.hauteur;
}
function acceptFeature(properties) {
    return !!properties.hauteur;
}
scaler = function update() {
    var i;
    var mesh;
    if (meshes.length) view.notifyChange(view.camera.camera3D, true);
    for(i = 0; i < meshes.length; i++){
        mesh = meshes[i];
        if (mesh) {
            mesh.scale.z = Math.min(1.0, mesh.scale.z + 0.1);
            mesh.updateMatrixWorld(true);
        }
    }
    meshes = meshes.filter(function filter(m) {
        return m.scale.z < 1;
    });
};
view.addFrameRequester(itowns.MAIN_LOOP_EVENTS.BEFORE_RENDER, scaler);
var wfsBuildingSource = new itowns.WFSSource({
    url: "https://wxs.ign.fr/topographie/geoportail/wfs?",
    version: "2.0.0",
    typeName: "BDTOPO_V3:batiment",
    crs: "EPSG:4326",
    ipr: "IGN",
    format: "application/json",
    extent: {
        west: 4.568,
        east: 5.18,
        south: 45.437,
        north: 46.03
    }
});
var wfsBuildingLayer = new itowns.FeatureGeometryLayer("WFS Building", {
    batchId: function(property, featureId) {
        return featureId;
    },
    onMeshCreated: function scaleZ(mesh) {
        mesh.children.forEach((c)=>{
            c.scale.z = 0.01;
            meshes.push(c);
        });
    },
    filter: acceptFeature,
    source: wfsBuildingSource,
    zoom: {
        min: 14
    },
    style: new itowns.Style({
        fill: {
            color: colorBuildings,
            base_altitude: altitudeBuildings,
            extrusion_height: extrudeBuildings
        }
    })
});
view.addLayer(wfsBuildingLayer);
var menuGlobe = new GuiTools("menuDiv", view);
// Listen for globe full initialisation event
view.addEventListener(itowns.GLOBE_VIEW_EVENTS.GLOBE_INITIALIZED, function() {
    // eslint-disable-next-line no-console
    console.info("Globe initialized");
});
debug.createTileDebugUI(menuGlobe.gui, view);
function picking(event) {
    if (view.controls.isPaused) {
        var htmlInfo = document.getElementById("info");
        var intersects = view.pickObjectsAt(event, 3, "WFS Building");
        var properties;
        var info;
        var batchId;
        htmlInfo.innerHTML = " ";
        if (intersects.length) {
            batchId = intersects[0].object.geometry.attributes.batchId.array[intersects[0].face.a];
            properties = intersects[0].object.feature.geometries[batchId].properties;
            Object.keys(properties).map(function(objectKey) {
                var value = properties[objectKey];
                if (value) {
                    var key = objectKey.toString();
                    if (key[0] !== "_" && key !== "geometry_name") {
                        info = value.toString();
                        htmlInfo.innerHTML += "<li><b>" + key + ": </b>" + info + "</li>";
                    }
                }
            });
        }
    }
}
for (var layer of view.getLayers()){
    if (layer.id === "WFS Bus lines") layer.whenReady.then(function _(layer) {
        var gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
        debug.GeometryDebug.addMaterialLineWidth(gui, view, layer, 1, 10);
    });
    if (layer.id === "WFS Building") layer.whenReady.then(function _(layer) {
        var gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
        debug.GeometryDebug.addWireFrameCheckbox(gui, view, layer);
        window.addEventListener("mousemove", picking, false);
    });
    if (layer.id === "WFS Route points") layer.whenReady.then(function _(layer) {
        var gui = debug.GeometryDebug.createGeometryDebugUI(menuGlobe.gui, view, layer);
        debug.GeometryDebug.addMaterialSize(gui, view, layer, 1, 200);
    });
}

//# sourceMappingURL=index.de158e3a.js.map
