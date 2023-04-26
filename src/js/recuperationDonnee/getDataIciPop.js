import { spreadDataToTabs } from "../affichage/affichageHtml/connectDataToTabs";
import { loadDataToJSON } from "../affichage/affichageHtml/connectDataToTabs";
/**
 * 
 * @param {Object} val2display Dictionary to fill (can already be filled) with the following format :
     *    {
     *      tabInfoGen: [{ attribut: key, name4User: name4User, val: value, source: base },..],
     *      tabBatiment: [],
     *      tabRisques: [],
     *      tabEnergie: [],
     *      tabPopulation: {}
     *    }
 * @param {Array} csvBuildingICI Array containing csv data for building ICI data
 * @param {Array} csvHousingICI Array containing csv data for housing ICI data
 * @param {Array} csvHouseholdICI Array containing csv data for household ICI data
 * @param {Array} csvIndividualICI Array containing csv data for Individual ICI data
 * @param {String} tooltipBuildingID Building bdtopo id 
 * @returns {Object} Dictionnary of the data spread over each tabs
 */
export async function getDataICI(val2display, csvBuildingICI, csvHousingICI, csvHouseholdICI, csvIndividualICI, tooltipBuildingID) {
    // ----------- Ge, t Building ICI data ----------- //
    let displayICI = await csvBuildingICI
    let dataBuildingICI;
    Object.entries(displayICI).forEach((value) => {
        if (value[1].idBdTopo) {
            if (value[1].idBdTopo.includes(tooltipBuildingID)) {
                dataBuildingICI = value[1];
                return dataBuildingICI;
            }
        }
    })

    let valDisplayBuildingICI = spreadDataToTabs(dataBuildingICI, val2display, 'Building ICI')

    // ----------- Get Housing ICI IDs ----------- //
    let displayHousing = await csvHousingICI
    let housings_IDs = []
    Object.entries(displayHousing).forEach((value) => {
        if (value[1].BuildingID) {
            if (value[1].BuildingID.includes(dataBuildingICI.ID)) {
                housings_IDs.push(value[1].ID)
            }
        }
    })

    // ----------- Get Household ICI data ----------- //
    let housingDictionnary = {}
    let displayHousehold = await csvHouseholdICI
    let dataJSONattributeHousehold;
    Object.entries(displayHousehold).forEach((value) => {
        if (housings_IDs.includes(value[1].HousingID)) {
            housingDictionnary[value[1].ID] = {}
            housingDictionnary[value[1].ID]["household"] = []
            Object.entries(value[1]).forEach(([key, val]) => {
                dataJSONattributeHousehold = loadDataToJSON({}, key, val, "Household ICI", true)
                if (Object.keys(dataJSONattributeHousehold).length !== 0) {
                    housingDictionnary[value[1].ID]["household"].push(dataJSONattributeHousehold)
                }
            })
        }
    })
    Object.entries(housingDictionnary).forEach(([key, value]) => {
        if (Object.keys(value).length === 0) {
            delete housingDictionnary[key]
        }
    })
    // for each housing get associated household
    let householdIDs = []
    Object.entries(housingDictionnary).forEach((val) => {
        householdIDs.push(val[0])
    })

    // ----------- Get Individual ICI data ----------- //
    let displayIndividual = await csvIndividualICI
    let dataJSONattributeIndividual;
    Object.entries(displayIndividual).forEach((value) => {
        if (value[1].IDHousehold) {
            let individualList = []
            if (householdIDs.includes(value[1].IDHousehold)) {
                Object.entries(value[1]).forEach(([key, val]) => {
                    dataJSONattributeIndividual = loadDataToJSON({}, key, val, "Individual ICI", true)
                    if (Object.keys(dataJSONattributeIndividual).length !== 0) {
                        individualList.push(dataJSONattributeIndividual)

                    }
                })
                if (housingDictionnary[value[1].IDHousehold]["individuals"]) {
                    housingDictionnary[value[1].IDHousehold]["individuals"].push(individualList)
                } else {
                    housingDictionnary[value[1].IDHousehold]["individuals"] = [individualList]
                }
            }
        }
    })
    valDisplayBuildingICI.tabPopulation = housingDictionnary;
    return valDisplayBuildingICI

}