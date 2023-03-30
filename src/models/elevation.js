

export function addElevationLayer(configElevation, view) {
    configElevation.source = new itowns.WMTSSource(configElevation.source);
    const layer = new itowns.ElevationLayer(configElevation.id, configElevation);
    view.addLayer(layer);
}
