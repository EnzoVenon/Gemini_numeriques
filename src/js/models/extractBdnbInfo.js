
export function getBdnbInfo(csvBdnb, idAttributBatiment, batiment_groupe_id_to_select) {
    return csvBdnb.then(res => {
        // console.log(res)
        let uniqueData = res.filter(obj => obj[idAttributBatiment] === batiment_groupe_id_to_select)[0]
        console.log(uniqueData)
        if (uniqueData) {
            const entries = Object.entries(uniqueData)
            // console.log(entries)
            const nonEmptyOrNull = entries.filter(([key, val]) => val !== '' && val !== null && key !== null)
            const output = Object.fromEntries(nonEmptyOrNull)
            return output;
        }

    });

}