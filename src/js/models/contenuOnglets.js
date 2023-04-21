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

    return result;
}

export function generateAccordionItem(idHTML, idChart) {

    /*
    
        Generates a HTML-bootstrap accordion item
        
    */

    let divAccordion = '<div class="accordion-item">';
    divAccordion += '<h2 class="accordion-header" id="panelsStayOpen-heading' + idHTML + '">';
    divAccordion += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse' + idHTML + '" aria-expanded="false" aria-controls="panelsStayOpen-collapse' + idHTML + '">';
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

function createAccParent(id) {
    let accParent = document.createElement("div")
    accParent.className = "accordion"
    accParent.id = id

    return accParent
}

function createAccChild(id, header, body) {
    let accChild = document.createElement("div")
    accChild.className = "accordion-item"
    accChild.id = id

    accChild.id = id
    accChild.innerHTML += `<h2 class="accordion-header" id="panelsStayOpen-heading${id}">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        data-bs-target="#panelsStayOpen-collapse${id}" aria-expanded="false"
        aria-controls="panelsStayOpen-collapse${id}">
        ${header}
    </button>
</h2>
<div id="panelsStayOpen-collapse${id}" class="accordion-collapse collapse"
    aria-labelledby="panelsStayOpen-heading${id}">
    <div class="accordion-body">
    ${body}
    </div>
</div>`

    return accChild
}

export function createAccordion(idParent, header, body) {
    let divParent = createAccParent(idParent)
    let divChild = createAccChild(idParent + 'child', header, body)
    divParent.appendChild(divChild)
    return divParent
}

export function createAccordionForListAttributes(listAttributes, isForIndividuals = false) {
    let body = '';
    listAttributes.forEach((value) => {
        if (value) {
            if (isForIndividuals) {
                body += value.name4User + ": " + value.val + '<br>'
            } else {

                body += createAccordion(value.attribute, value.name4User, value.val).outerHTML
            }

        }
    })
    return body
}