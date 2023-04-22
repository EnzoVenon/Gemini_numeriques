/**
 * update a selection div from array
 * @param {String} idSelect - id of the select html tag
 * @param {*} listOptions 
 */
export function updateSelectOptionFromList(idSelect, listOptions, selected = "") {
    // get the dom element 
    const selectElement = document.getElementById(idSelect);
    console.log(selectElement)
    selectElement.innerHTML = "";

    // add each value to selecteion
    listOptions.forEach(value => {
        // create option element
        const option = document.createElement('option');
        option.text = value;
        option.value = value;
        if (value === selected) {
            option.selected = true
        }
        selectElement.add(option);
    });
}