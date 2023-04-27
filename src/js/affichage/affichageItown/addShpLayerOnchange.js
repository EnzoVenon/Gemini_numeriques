import { addShp } from "./addShpLayer"
/**
 * add shp on switch checked
 * @param {String} divId => id of the switch div
 * @param {String} filePath => path to the shp
 * @param {String} layerId => id of the color layer to be created
 * @param {String} OutlineColor => outline color of shapes
 * @param {String} fillColor => fill color of shapes
 * @param {Object} view => view of itwon 
 */
export function addShpLayerOnChange(divId, filePath, layerId, OutlineColor, fillColor, view) {
    document.getElementById(divId).addEventListener("change", () => {
        if (document.getElementById(divId).checked) {
            addShp(filePath, layerId, OutlineColor, fillColor, view, false)
        }
        else {
            view.removeLayer(layerId)
        }
    })
}
