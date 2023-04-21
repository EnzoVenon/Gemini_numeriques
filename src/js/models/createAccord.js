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
                body += value.name4User + ": " + value.val + '\n'
            }
            body += createAccordion(value.attribute, value.name4User, value.val).outerHTML

        }
    })
    return body
}