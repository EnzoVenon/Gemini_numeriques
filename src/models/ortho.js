

export function addOrthoLayer(configOrtho, view) {
    configOrtho.source = new itowns.WMTSSource(configOrtho.source);
    const layer = new itowns.ColorLayer('Ortho', configOrtho);
    view.addLayer(layer);
}
