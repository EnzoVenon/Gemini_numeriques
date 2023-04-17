// ------------------------------ functions ------------------------------ //
export function dataINSEE4Chart(attributeList, popValues) {

    /*
        
        Prepares INSEE data for generating a chart 
        
    */

    let result = [];
    Object.entries(popValues).forEach(([key, value]) => {
        if (attributeList.includes(value.attribut)) {
            console.log(key)
            result.push({ name: value.name4User, value: value.val })
        }
    })
    // attributeList.filter(function (attribute) {

    //     result.push({ name: attribute.name4User, value: attribute.val })
    // });
    return result;
}

export function generateAccordionItem(idHTML, idChart) {

    /*
    
        Generates a HTML-bootstrap accordion item
        
    */

    let divAccordion = '<div class="accordion-item">';
    divAccordion += '<h2 class="accordion-header" id="panelsStayOpen-heading' + idHTML + '">';
    divAccordion += '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse' + idHTML + '" aria-expanded="false" aria-controls="panelsStayOpen-collapse' + idHTML + '">';
    divAccordion += idHTML;
    divAccordion += '</button></h2>';
    divAccordion += '<div id="panelsStayOpen-collapse' + idHTML + '" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading' + idHTML + '">';
    divAccordion += '<div class="accordion-body" style="width:100%;"><canvas id="' + idChart + '"></canvas></div></div></div>'
    return divAccordion;
}

export function getKeyByValue(object, value) {

    /*
    
        Retrieve a key from a dictionary from its value
        
    */

    return Object.keys(object).find(key => object[key] === value);
}

