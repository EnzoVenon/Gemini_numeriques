export async function addStreamSurfaceFeature(url, version, typeName, crs, zoomMin, view) {

    const wfsCartoSource = new itowns.WFSSource({
        url: 'https://wxs.ign.fr/cartovecto/geoportail/wfs?',
        version: '2.0.0',
        typeName: 'BDCARTO_V5:arrondissement',
        crs: 'EPSG:4326',
        ipr: 'IGN',
        format: 'application/json',
    });

    console.log("stream")

    const wfsCartoStyle = new itowns.Style({
        zoom: { min: 10, max: 20 },
        fill: {
            color: "red"
        }
    });

    let wfsCartoLayer = new itowns.ColorLayer('stream', {
        source: wfsCartoSource,
        style: wfsCartoStyle,
        addLabelLayer: true,
    });

    return wfsCartoLayer
}

