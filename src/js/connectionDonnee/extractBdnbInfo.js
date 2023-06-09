
export function getBdnbInfo(csvBdnb, idAttributBatiment, batiment_groupe_id_to_select) {
    return csvBdnb.then(res => {

        let uniqueData = res.filter(obj => obj[idAttributBatiment] === batiment_groupe_id_to_select)[0]
        if (uniqueData) {
            const entries = Object.entries(uniqueData)
            const nonEmptyOrNull = entries.filter(([key, val]) => val !== '' && val !== null && key !== null)
            const output = Object.fromEntries(nonEmptyOrNull)
            return output;
        }

    });

}