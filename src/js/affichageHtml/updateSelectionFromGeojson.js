import { getUniquePropNames } from "../utile/getUniquePropertiesNamesFromGeojson"
import { updateSelectOptionFromList } from "./updateSelectOptionFromList"

/**
 * udpate a selection div fron geojson 
 * @param {String} idSelect - id of the select html tag
 * @param {Object} geojson - geojson from shp 
 */
export function updateSelectOption(idSelect, geojson, selected = "") {
    // list of unique prop name
    const uniquePropNames = getUniquePropNames(geojson)
    // get html element
    const selectElement = document.getElementById(idSelect);
    selectElement.innerHTML = "";
    // update option of the select tag
    updateSelectOptionFromList(idSelect, uniquePropNames, selected)
}