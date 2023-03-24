

export function addElevationLayer(configElevation, view, menuGlobe) {
    configElevation.source = new itowns.WMTSSource(configElevation.source);
    const layer = new itowns.ElevationLayer(configElevation.id, configElevation);
    view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
}
