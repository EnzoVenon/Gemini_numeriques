export function addStreamSurfaceFeature(url, version, typeName, crs, zoomMin, layerName, extent) {

    const wfsCartoSource = new itowns.WFSSource({
        url: url,
        version: version,
        typeName: typeName,
        crs: crs,
        ipr: 'IGN',
        format: 'application/json',
        extent: extent,
        zoom: { min: zoomMin, max: 20 },

    });

    console.log(wfsCartoSource)


    var wfsCartoStyle = new itowns.Style({
        zoom: { min: zoomMin, max: 20 },
        // point: { color: 'white', line: 'green' },
        fill: {
            color: setColor
        },
        stroke: { color: "red" },
    });

    var wfsCartoLabelStyle = new itowns.Style({
        zoom: { min: 0, max: 20 },
        text: {
            field: '{toponyme}',
            color: 'white',
            transform: 'uppercase',
            size: 15,
            haloColor: 'rgba(20,20,20, 0.8)',
            haloWidth: 3,
        },
        fill: {
            color: setColorLabel
        },

    });




    var wfsCartoLayer = new itowns.ColorLayer(layerName, {
        source: wfsCartoSource,
        style: wfsCartoStyle,
        addLabelLayer: true,
    });

    var wfsCartoSource2 = new itowns.WFSSource({
        url: 'https://wxs.ign.fr/cartovecto/geoportail/wfs?',
        version: '2.0.0',
        typeName: 'BDCARTO_BDD_WLD_WGS84G:zone_habitat_mairie',
        crs: 'EPSG:4326',
        ipr: 'IGN',
        format: 'application/json',
        extent: extent
    });



    var wfsCartoLabelLayer = new itowns.LabelLayer('wfsCartoLabelLayer', {
        source: wfsCartoSource2,
        style: wfsCartoLabelStyle,
        addLabelLayer: true,
    });

    const geomLayer = new itowns.FeatureGeometryLayer(layerName + "_geom", {
        source: wfsCartoSource,
        style: wfsCartoStyle,
    });



    return { surface_layer: wfsCartoLayer, label_layer: wfsCartoLabelLayer, geom: geomLayer }
}

function setColor() {
    // console.log(properties)
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', 0.1)';
}


function setColorLabel() {
    // console.log(properties)
    var num = Math.round(0xffffff * Math.random());
    var r = num >> 16;
    var g = num >> 8 & 255;
    var b = num & 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
}
