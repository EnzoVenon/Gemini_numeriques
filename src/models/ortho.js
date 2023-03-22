

export function addOrthoLayer(configOrtho, view, menuGlobe) {
    configOrtho.source = new itowns.WMTSSource(configOrtho.source);
    const layer = new itowns.ColorLayer('Ortho', configOrtho);
    view.addLayer(layer).then(menuGlobe.addLayerGUI.bind(menuGlobe));
}
