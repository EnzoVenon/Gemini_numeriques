/**
 * Prepares INSEE data for generating a chart 
 * @param {Array} attributeList List of the raw attributes used for the chart                  
 * @param {*} popValues List of the values as follow:
 *                  [ { attribut: ..., name4User: ..., val: ..., source: ... },
 *                    { attribut: ..., name4User: ..., val: ..., source: ... }, ... ]
 * @returns {Array} List of dictionaries as follow
 *                      [ {name: ..., value: ...},
 *                        {name: ..., value: ...}, ...]
 */
export function dataINSEE4Chart(attributeList, popValues) {
    let result = [];
    Object.entries(popValues).forEach((value) => {
        if (attributeList.includes(value[1].attribut)) {
            result.push({ name: value[1].name4User, value: value[1].val })
        }
    })

    return result;
}


/**
 * Generates a HTML-bootstrap accordion item
 * @param {String} idHTML HTML id for the accordion
 * @param {String} idChart div id in which the chart will be 
 * @returns {String} html text to generate the accordion
 */
export function generateAccordionItem(idHTML, idChart) {
    let divAccordion = '<div class="accordion-item">';
    divAccordion += '<h2 class="accordion-header" id="panelsStayOpen-heading' + idHTML + '">';
    divAccordion += '<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse' + idHTML + '" aria-expanded="false" aria-controls="panelsStayOpen-collapse' + idHTML + '">';
    divAccordion += idHTML;
    divAccordion += '</button></h2>';
    divAccordion += '<div id="panelsStayOpen-collapse' + idHTML + '" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading' + idHTML + '">';
    divAccordion += '<div class="accordion-body" style="width:100%;"><canvas id="' + idChart + '"></canvas></div></div></div>'
    return divAccordion;
}


/**
 * Generates interlocked accordion-items if isForIndiviuals is false.
 * Otherwise, it generates all data for an individual
 * @param {Array} listValues List of values as follow:
 *                  [ { attribut: ..., name4User: ..., val: ..., source: ... },
 *                    { attribut: ..., name4User: ..., val: ..., source: ... }, ... ]
 * @param {String} key Key name of household or individual
 * @param {Boolean} isForIndividuals Default false. If true, does not create an accordion HTML
 * @returns {String} content for accordion-item body
 */
export function createAccordionForListValues(listValues, key, isForIndividuals = false, doNotAddInfo = false) {
    let body = '';
    listValues.forEach((value) => {
        if (value) {
            if (isForIndividuals) {
                body += value.name4User + ": " + value.val + '<br>'
            } else {
                body += createAccordion(value.attribut + key, value.name4User, value.val, doNotAddInfo).outerHTML
            }
        }
    })
    return body
}


/**
 * Generates an Accordion div
 * @param {String} id HTMl id for the accordion div
 * @returns HTML accordion element
 */
function createAccParent(id) {
    let accParent = document.createElement("div")
    accParent.className = "accordion"
    accParent.id = id

    return accParent
}


/**
 * Adds an accorion-item HTML element to an accordion div
 * @param {String} idParent HTML id for the accordion div
 * @param {String} header Name displayed on the accordion
 * @param {String} body Content of the accordion once collapsed
 * @returns HTML accordion div with an accordion-item child div
 */
export function createAccordion(idParent, header, body, doNotAddInfo = false) {
    let divParent = createAccParent(idParent)
    let divChild = createAccChild(idParent + 'child', header, body, doNotAddInfo)
    divParent.appendChild(divChild)
    return divParent
}


/**
 * Generates accordion-item div
 * @param {String} id HTMl id for the accordion-item div
 * @param {String} header Name displayed on the accordion
 * @param {String} body Content of the accordion once collapsed
 * @returns HTML accordion-item element
 */
function createAccChild(id, header, body, doNotAddInfo = false) {
    let accChild = document.createElement("div")
    let bodyAccordion;
    if (doNotAddInfo) {
        bodyAccordion = body
    } else {
        bodyAccordion = body + `<a href="#" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-custom-class="custom-tooltip" data-bs-title="Donnée issue de simulation ICI" style="padding-left: 25%;>
        info
        </a>`
    }
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

    ${bodyAccordion}

    </div>
</div>`


    console.log(accChild)
    return accChild
}