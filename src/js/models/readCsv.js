import * as  Papa from '../../../node_modules/papaparse/papaparse'

export async function importCsvFile(csvFile) {
    // '../data/shp/prg/data_bdnb.csv'
    function parseFile() {
        return new Promise(resolve => {
            Papa.parse(csvFile, {
                header: true,
                download: true,
                dynamicTyping: true,
                complete: results => {
                    resolve(results.data)
                }
            });
        });
    }
    return await parseFile()
}
