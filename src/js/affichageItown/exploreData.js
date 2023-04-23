import { updateSelectOption } from "../affichageHtml/updateSelectionFromGeojson";
import { geojsontToFeatureGeom } from "./geojsontToFeatureGeom";
/**
 * add layer to explore source data
 * @param {*} swhitchDivId => id switch of the explore source panel 
 * @param {*} geojson => geojson to add to itwons layer
 * @param {*} layerStructureId => the source param 
 * @param {*} selctionDivId => div of the selection for attribut to color
 * @param {*} selectProperty => the name of the property
 * @param {*} view => itwons viewn 
 * @param {*} THREE => itwons THREE 
 * @returns 
 */
export function exploreData(swhitchDivId, geojson, layerStructureId, selctionDivId, selectProperty, view, THREE) {
  if (document.getElementById(swhitchDivId).checked) {
    layerStructureId.num += 1;
    layerStructureId.id = layerStructureId.name + "_" + layerStructureId.num
    updateSelectOption(selctionDivId, geojson, selectProperty)
    geojsontToFeatureGeom(geojson, selectProperty, layerStructureId.id, false, view, THREE)

  }
  else {
    view.removeLayer(layerStructureId.id)
  }
  return layerStructureId
}