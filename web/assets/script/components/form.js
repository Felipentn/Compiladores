eel.expose(createFormHTML)
function createFormHTML(
    self,
    idForm,
    tbName,
    columns,
    submitFunction,
    access,
    btnsHTML,
    btnsCols,
    btnsTypes,
    icons,
    maxLength,
    minlength,
    inputCol,
    requiredInputs,
    readonlyInputs,
    bootstrapCols,
    invisibleCols,
    placeholderCols,
    defaultValues,
    defaultSelected,
    spanMinLengh,
    typeOfInputs,
    notButton,
    pattern,
    legend,
    idElements,
    args,
    onchangeOptions,
    sendSelf,
) {

    console.log("createFormHTML :: INIT")
    let inputHTML = ""
    columnsSend = Array()

    columns.forEach((column, i) => {
        let idColumn = `${idForm}_${column.replace(/[^A-Za-z]+/g, '')}`

        if (invisibleCols.includes(column)) {
            requiredHTML = ''
        } else if (requiredInputs[i]) {
            requiredHTML = `required oninvalid="this.setCustomValidity('Campo obrigatório')" 
            onchange="try{setCustomValidity('')}catch(e){}"`
        } else {
            requiredHTML = ''
        }

        let numbers = false
        let pattern_html = ''

        if (typeOfInputs[column] == 'number') {
            typeOfInputs[column] = false
            pattern_html = pattern ? pattern : `[0-9]{${minlength[i]}}[0-9]*`
            numbers = true
        }

        if (typeof defaultValues[column] == 'object') {
            let optionsHTML = ''
            defaultValues[column].forEach((option, i) => {
                optionsHTML += `<option ${defaultSelected == option?'selected':''}>${option}</option>`
            })

            inputHTML += `
            <div class="input-group input-group-sm col-sm-${inputCol[i]} col-12 ${invisibleCols.includes(column) ? 'd-none' : ''} mb-3">
                ${!Object.values(placeholderCols).includes(column)?`<div class="input-group-prepend">
                <span class="input-group-text" ${spanMinLengh ? `style="min-width:${spanMinLengh}px"` : ''}>${column}</span>
                </div>`:''}            
                <select class="form-control form-control-sm" id="${idColumn}" ${onchangeOptions[column]?`onchange="callOnchangeOptions(${self}, '${idColumn}', '${access}', '${onchangeOptions[column]}', ${sendSelf})"` : ''}>
                    ${optionsHTML}
                </select>
            </div>
            `
        } else if (typeOfInputs[column] == 'textarea') {
            inputHTML += `
            <div class="input-group input-group-sm col-sm-${inputCol[i]} col-12 ${invisibleCols.includes(column) ? 'd-none' : ''} mb-3">
                ${!Object.values(placeholderCols).includes(column)?`<div class="input-group-prepend">
                <span class="input-group-text" ${spanMinLengh ? `style="min-width:${spanMinLengh}px"` : ''} style="min-width: 150px">${column}</span>
                </div>`:''}
                <textarea id="${idColumn}" class="form-control" rows="20" spellcheck="false" ${readonlyInputs[i] ? `readonly` : ''}${onchangeOptions[column]?`onchange="callOnchangeOptions(${self}, '${idColumn}', '${access}', '${onChange}', ${sendSelf})"` : ''} ${Object.values(placeholderCols).includes(column)?`placeholder="${column}"`: ''}> ${defaultValues[column] ? defaultValues[column] : ''}</textarea>
            </div>
            `
        } else {
            inputHTML += `
            <div class="input-group input-group-sm col-sm-${inputCol[i]} col-12 ${invisibleCols.includes(column) ? 'd-none' : ''} mb-3">
                
                ${!Object.values(placeholderCols).includes(column)?`<div class="input-group-prepend">
                <span class="input-group-text" ${spanMinLengh ? `style="min-width:${spanMinLengh}px"` : ''}>${column}</span>
                </div>`:''}
                
                <input type="${typeOfInputs[column] ? typeOfInputs[column] : 'text'}" 
                ${Object.values(placeholderCols).includes(column)?`placeholder="${column}"`: ''}
                ${pattern_html ? `pattern="${pattern_html}"` : ''}class="form-control valid-pattern" ${minlength[i] ? 'minlength=' + minlength[i] : ''} ${maxLength[i] ? 'maxLength=' + maxLength[i] : ''} id="${idColumn}"
                "  
                ${numbers
                    ?
                    `
                        onclick="inputNumbers('${idColumn}')" 
                    `
                    :
                    ''
                }
                ${onchangeOptions[column]?`onchange="callOnchangeOptions(${self}, '${idColumn}', '${access}', '${onChange}', ${sendSelf})"` : ''}
                ${requiredHTML ? requiredHTML : ''} ${defaultValues[column] ? 'value=`' + defaultValues[column] + '"' : ''} ${readonlyInputs[i] ? `readonly onclick="copyToClipboard('${idColumn}')` : ''}>
            </div>
            `
        }
        columnsSend.push(column)
    })

    let buttonsHTML = ''

    btnsHTML.forEach((btn, i) => {
        buttonsHTML += `
        <div class="p-2 mt-3 col-12 col-sm-${btnsCols[i]}">
        <button type="submit" name="action" value="${btn}" class="btn btn-${btnsTypes[i]} col-12" style="min-width: 140px">
            <i class="fa fa-${icons[i]} mr-2" aria-hidden="true"></i>${btn}
        </button>
        </div>
        `
    })
        
    let formHTML = `<div class="col-sm-${bootstrapCols} col-12 mt-3">
                        ${
                            legend
                            ?
                            `
                            <div class="col text-center mb-5">
                                <h2>${legend}</h2>
                            </div>
                            `
                            :
                            ''
                        }
                        <form id="${idForm}-main" onsubmit="formSubmitRow(${self}, '${idForm}', '${tbName}', '${columnsSend}', '${submitFunction}', '${access}', '${idElements}', '${args}', ${sendSelf}, event.submitter.value);$('#${idForm}-main')[0].reset();$('#${idForm}-parent').modal('hide');return false;" class="row">
                            ${inputHTML}
                            ${
                                !notButton ?
                                `
                                    ${buttonsHTML}
                                `
                                : 
                                ''
                            }
                        </form>
                    </div>
                    `
    $("#" + idForm).append(formHTML)
}

eel.expose(createOptionsHTML)
function createOptionsHTML(
    self,
    id,
    idSelect,
    legend,
    options,
    onChange,
    access,
    defaut,
    append,
    index,
    sendSelf,
) {
    console.log("createOptionsHTML :: INIT")
    let optionsHTML = `<option></option>`

    if (index) {
        options.forEach((option, i) => {
            optionsHTML += `<option ${defaut == option ? 'selected' : ''}>${i + 1} - ${option}</option>`
        })
    } else {
        options.forEach((option, i) => {
            optionsHTML += `<option ${defaut == option ? 'selected' : ''}>${option}</option>`
        })
    }

    let formHTML =
        `
        <div class="input-group input-group-sm col-12 mt-1 mb-3">
            <div class="input-group-prepend">
                <span class="input-group-text">${legend}</span>
            </div>
            <select class="form-control form-control-sm" id="${idSelect}" ${onChange ? `onchange="callOnchangeOptions(${self}, '${idSelect}', '${access}', '${onChange}', ${sendSelf})"` : ''}>
                ${optionsHTML}
            </select>
        </div>
        `
    if (append) {
        $('#' + id).append(formHTML)
    } else {
        $('#' + id).html(formHTML)
    }
}

function callOnchangeOptions(self, idSelect, access, func, sendSelf) {
    let option = $("#" + idSelect).find(':selected').val()
    if (access) {
        pythonUsers(func, access, String(option))
    } else if (sendSelf) {
        window['eel'][func](self, String(option))
    } else {
        window['eel'][func](String(option))
    }
}

eel.expose(createExportForm)
function createExportForm(idComponent) {
    let exportFormHTML =
        `
            <form class="form-inline bd-highlight">
                <div class="bd-highlight" id="${idComponent}-add"></div>
                <div class="col-sm-4 col-12 bd-highlight" id="${idComponent}-layout"></div>
                <div class="ml-auto bd-highlight row">
                    <div id="${idComponent}-del"></div>
                    <div id="${idComponent}-export"></div>
                </div>
            </form>
        `
    $('#' + idComponent).html(exportFormHTML)
}

eel.expose(createFormDataClientHTML)
function createFormDataClientHTML(
    idTable,
    columns,
    values,
    readonly
) {
    console.log("createFormDataClientHTML :: INIT")

    let idForm = idTable + '_data_form'
    let inputHTML = ""

    columns.forEach((column, i) => {
        if (values[i] != '') {
            inputHTML +=
                `
                    <label class="col-1 col-form-label">${column}:</label>
                    <div class="col-3">
                        <div class="input-group ">
                            <input type="text" value="${values[i]}" class="form-control form-control-sm" ${readonly ? 'readonly' : ''}>
                        </div>
                    </div>        
                `
        }
    })
    let formHTML =
        `
    <form id="${idForm}" class="form-inline mt-3 border rounded">
    <div class="container-fluid form-group justify-content-between">
        <div class="form-group col-9">
            ${inputHTML}
        </div>

        <div id="${idForm}_options" class="form-group col-3"></div>
        </div>
    </form>
    `

    $('#' + idForm).html(formHTML)
}

function checkRadioButtons(columnGroup, msgError) {
    if ($(`input[name="${columnGroup}_radio"]:checked`).length > 0) {
        return true
    } else {
        showModal('radioError', msgError)
        return false
    }
}

function getArgsCallPython(func, access, args, idElements, btnValue) {
    console.log('getArgsCallPython :: INIT')

    let values = Array()
    idElements = idElements.split(',')
    if (idElements != undefined && idElements != '') {
        for (const property in idElements) {
            try {
                values.push($('#' + idElements[property]).val())
            } catch (error) {
                console.log('ERRO :: getArgsCallPython' + error)
            }
        }
    }
    try {
        if (args && access) {
            values = args + "," + values.toString()
        } else {
            values = values.toString()
        }

        if (typeof args == 'string') {
            if (args.split(',').length > 1) {
                args = args.split(',')
            }
        }
    
        if (typeof values == 'string') {
            if (values.split(',').length > 1) {
                values = values.split(',')
            }
        }
    } catch (error) {
        console.log(error)
    }


    if (access && values.toString() != '') {
        
        pythonUsers(func, access, values, btnValue)

    } else if (access) {

        pythonUsers(func, access, btnValue)

    } else if (        
        args != undefined &&
        args != 'undefined' && 
        args != null && 
        args != 'null'
    ) {
        
        if (values.toString() != '') {

            window['eel'][func](args, values, btnValue)

        } else {

            window['eel'][func](args, btnValue)
        }

    } else {

        if (values.toString() != '') {
            
            window['eel'][func](values, btnValue)

        } else {

            window['eel'][func](btnValue)
        }

    }

}


function formSubmitRow(
    self,
    idForm,
    tbName,
    columns,
    funcPy,
    access,
    idElements,
    args,
    sendSelf,
    btnValue
) {
    console.log("formSubmitRow :: INIT")
    columns = columns.split(',')
    let registers = Array()
    for (let column of columns) {
        let idColumn = `${idForm}_${column.replace(/[^A-Za-z]+/g, '')}`
        registers.push($(`#${idColumn}`).val().replaceAll("\\", "\\\\"))
    }

    if (args) {
        try {
            registers.push(args)
        } catch (error) {
            console.log(error)
        }
    }

    if (access) {

        getArgsCallPython(funcPy, access, registers, idElements, btnValue)

    } else if(sendSelf && tbName != 'null' && tbName != null){

        window['eel'][funcPy](self, tbName, registers, btnValue)

    } else if (sendSelf) {

        window['eel'][funcPy](self, registers, btnValue)

    } else if (tbName != 'null' && tbName != null) {

        window['eel'][funcPy](tbName, registers, btnValue)

    } else {
        
        window['eel'][funcPy](registers, btnValue)

    }
}

eel.expose(createButton)
function createButton(
    id,
    btnText,
    icon,
    func,
    access,
    btnType,
    args,
    idElements,
    append,
    cols,
    margin,
    self,
) {
    console.log('INIT :: insertButton')

    let idElementsArray = ''
    try {
        for (var prop in idElements) {
            idElementsArray += idElements[prop] + ","
        }
        if (self) {
            let func = window['eel'][func]
        } else {
            let func = getArgsCallPython
        }
        let buttonHTML =
            `   <div class="container-fluid form-group justify-content-between mb-3 col-12 ${cols ? 'col-sm-' + cols : ''}">
                    <button type="button" class="btn btn-${btnType} btn-sm ${margin ? 'm-' + margin : ''} mt-1 text-nowrap" style="min-width:150px"
                        onclick="getArgsCallPython('${func}', ${access ? "'" + access + "'" + ',' : 'false, '} ${args ? "'" + args + "'" + ',' : 'false, '} '${idElementsArray}', '${btnText}')">
                        <i class="fa fa-${icon} mr-2" aria-hidden="true"></i>${btnText}
                    </button>
                </div>
            `

        
        if (append) {
            $('#' + id).append(buttonHTML)
        } else {
            $('#' + id).html(buttonHTML)
        }        
    } catch (error) {
        console.log(error)
    }

}

eel.expose(setCardSettings)
function setCardSettings(
    id,
    key,
    legend,
    idConfig,
    idPassword,
    maxLenght,
    cols,
    placeholder,
) {
    let htmlCard = newCardSettings(
        key,
        legend,
        idConfig,
        idPassword,
        maxLenght,
        cols,
        placeholder,
    )
    var card = $(`#${idConfig}-parent`)
    if (card.length > 0) {
        card.remove()
    }
    $(`#${id}`).append(htmlCard)
    loadAccess()
}
