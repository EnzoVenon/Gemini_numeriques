import { spreadDataToTabs } from "../affichage/affichageHtml/connectDataToTabs";

/**
 * Retrieve BdTopo data for the selected building
 * @param {Array} bdtopoJson Geojson promise of the data for the selected building from BDTopo
 * @param {Object} tooltip div element
 * @param {Object} dictionaryTofill Dictionary to fill (can already be filled) with the following format :
     *    {
     *      tabInfoGen: [{ attribut: key, name4User: name4User, val: value, source: base },..],
     *      tabBatiment: [],
     *      tabRisques: [],
     *      tabEnergie: [],
     *      tabPopulation: {}
     *    }
 * @returns {Object} Dictionnary of the data spread over each tabs
 */
export function getDataBDTOPO(bdtopoJson, tooltip, dictionaryTofill) {

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
