import { getUniquePropNames } from "../utile/getUniquePropertiesNamesFromGeojson"
import { updateSelectOptionFromList } from "./updateSelectOptionFromList"
export function updateSelectOption(idSelectDrop2d, geojson) {
    // créer un tableau des clés uniques
    const uniquePropNames = getUniquePropNames(geojson)
    // Récupération de l'élément HTML de sélection
    const selectElement = document.getElementById(idSelectDrop2d);
    selectElement.innerHTML = "";
    // Boucle pour ajouter chaque valeur à la sélection
    updateSelectOptionFromList(idSelectDrop2d, uniquePropNames)
}