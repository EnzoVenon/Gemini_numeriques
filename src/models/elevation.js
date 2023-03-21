export function elevationLayer(serverURL, crs, name, tileMatrixSet, format) {
    // Source
    const elevationSource = new itowns.WMTSSource({
        url: serverURL,
        crs: crs,
        name: name,
        tileMatrixSet: tileMatrixSet,
        format: format,
        tileMatrixSetLimits: {
            11: {
                minTileRow: 442,
                maxTileRow: 1267,
                minTileCol: 1344,
                maxTileCol: 2683
            },
            12: {
                minTileRow: 885,
                maxTileRow: 2343,
                minTileCol: 3978,
                maxTileCol: 5126
            },
            13: {
                minTileRow: 1770,
                maxTileRow: 4687,
                minTileCol: 7957,
                maxTileCol: 10253
            },
            14: {
                minTileRow: 3540,
                maxTileRow: 9375,
                minTileCol: 15914,
                maxTileCol: 20507
            }
        },
    });

    // Layer
    const eleLayer = new itowns.ElevationLayer('MNT_WORLD', {
        source: elevationSource,
    });

    return eleLayer;
}