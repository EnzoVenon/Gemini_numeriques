/**
 * update a selection div from array
 * @param {String} idSelect - id of the select html tag
 * @param {*} listOptions 
 */
export function updateSelectOptionFromList(idSelect, listOptions) {
    // Récupération de l'élément HTML de sélection
    const selectElement = document.getElementById(idSelect);
    console.log(selectElement)
    selectElement.innerHTML = "";

    // Boucle pour ajouter chaque valeur à la sélection
    listOptions.forEach(value => {
        // Création d'un élément d'option
        const option = document.createElement('option');
        // Ajout de la valeur de l'option
        option.text = value;
        // Ajout de la valeur de l'option en tant que valeur d'attribut
        option.value = value;
        // Ajout de l'option à l'élément de sélection
        selectElement.add(option);
    });


    console.log(listOptions)
}