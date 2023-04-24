import * as  Papa from 'papaparse'

/**
 * read csv data  as array
 * @param {String} csvFile => csv file path 
 * @returns {Array} containsthe csv data 
 */
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
