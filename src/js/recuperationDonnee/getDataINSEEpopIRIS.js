import * as contenuOnglet from "../models/contenuOnglets"
import { addChart } from "../models/insee/showChart"
import { spreadDataToTabs } from "../models/connectDataToTabs"

export function getDataINSEE(csvMenageINSEE, tooltip, dictionaryTofill, textHtml, htmlTest) {
    let valDisplay2 = csvMenageINSEE
        .then(res => {
            // ----------- POPULATION INSEE ----------- //
            // Retrieve elements where Iris number is same as tooltip
            let uniqueData = res.filter(obj => obj.IRIS === Number(tooltip.value.properties.code_iris))[0]

            // Add INSEE value for this IRIS in tooltip properties
            let valDisplayedPop = spreadDataToTabs(uniqueData, dictionaryTofill, 'INSEE')

            // Chart for INSEE values
            const dataList4Chart = {
                status15OuPlus: ['P19_POP15P_MARIEE', 'P19_POP15P_PACSEE', 'P19_POP15P_CONCUB_UNION_LIBRE', 'P19_POP15P_VEUFS', 'P19_POP15P_DIVORCEE', 'P19_POP15P_CELIBATAIRE'],
                repartitionPop: ['P19_POP1524', 'P19_POP2554', 'P19_POP5579', 'P19_POP80P'],
                enfant25: ['C19_NE24F0', 'C19_NE24F1', 'C19_NE24F2', 'C19_NE24F3', 'C19_NE24F4P']
            }
            let data4Chart = [];
            Object.entries(dataList4Chart).forEach((value) => {
                data4Chart.push(contenuOnglet.dataINSEE4Chart(value[1], valDisplayedPop.tabPopulation))
            })

            // ----- Generate HTML text ----- //
            textHtml += contenuOnglet.generateAccordionItem("Status_15_ans+", 'status');
            textHtml += contenuOnglet.generateAccordionItem("Repartion_pop_15_ans+", 'repartition');
            textHtml += contenuOnglet.generateAccordionItem("Nombre_famille_enfants_-25ans", 'enfant');

            htmlTest.innerHTML += textHtml;

            // Create charts
            addChart('status', data4Chart[0], 'name', 'value', 'Nombre de personnes');
            addChart('repartition', data4Chart[1], 'name', 'value', "Nombre d'individus");
            addChart('enfant', data4Chart[2], 'name', 'value', 'Nombre de familles');

            return valDisplayedPop;
        })
    return valDisplay2
}

