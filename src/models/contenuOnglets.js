// ------------------------------ functions ------------------------------ //
export function dataINSEE4Chart(attributeList, attributeSlicingNumber, dataValues) {

    /*
        
        Prepares INSEE data for generating a chart 
        
    */

    let result = [];
    attributeList.filter(function (attribute) {
        result.push({ name: attribute.slice(attributeSlicingNumber), value: dataValues[attribute] })
    });
    return result;
}

export function generateAccordionItem(idHTML, idChart) {

    /*
    
        Generates a HTML-bootstrap accordion item
        
    */

    let divAccordion = '<div class="accordion-item">';
    divAccordion += '<h2 class="accordion-header" id="flush-' + idHTML + '">';
    divAccordion += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse' + idHTML + '" aria-expanded="false" aria-controls="flush-collapse' + idHTML + '">';
    divAccordion += idHTML;
    divAccordion += '</button></h2>';
    divAccordion += '<div id="flush-collapse' + idHTML + '" class="accordion-collapse collapse" aria-labelledby="flush-heading' + idHTML + '" data-bs-parent="#accordionFlushExample">';
    divAccordion += '<div class="accordion-body" style="width:100%;"><canvas id="' + idChart + '"></canvas></div></div></div>'
    return divAccordion;
}

export function getKeyByValue(object, value) {

    /*
    
        Retrieve a key from a dictionary from its value
        
    */

    return Object.keys(object).find(key => object[key] === value);
}

