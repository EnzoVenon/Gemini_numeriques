
export function getBdnbInfo(csvBdnb, batiment_groupe_id_to_select) {
    return csvBdnb.then(res => {
        // console.log(res)
        let uniqueData = res.filter(obj => obj.batiment_groupe_id === batiment_groupe_id_to_select)[0]
        const entries = Object.entries(uniqueData)
        // console.log(entries)
        const nonEmptyOrNull = entries.filter(([key, val]) => val !== '' && val !== null && key !== null)
        const output = Object.fromEntries(nonEmptyOrNull)
        return output;

    });

}