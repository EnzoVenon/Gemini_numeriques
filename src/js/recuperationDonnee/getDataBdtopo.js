import { spreadDataToTabs } from "../models/connectDataToTabs";

/**
 * 
 * @param {*} bdtopoJson 
 * @param {*} tooltip 
 * @param {*} dictionaryTofill 
 * @returns 
 */
export function getDataBDTOPO(bdtopoJson, tooltip, dictionaryTofill) {
    // ----------- Get BdTopo data ----------- //
    let valDisplaybdtopo = bdtopoJson
        .then(geojson => {
            let dataBdTopo = geojson.features.filter(obj => {
                if (tooltip.value.properties.batiment_c.includes(obj.properties.ID)) {
                    return obj;
                }
            })
            return dataBdTopo[0]
        })
        .then(res => {
            if (res.properties) {
                return spreadDataToTabs(res.properties, dictionaryTofill, 'BDTopo');
            }
        })
    return valDisplaybdtopo
}
