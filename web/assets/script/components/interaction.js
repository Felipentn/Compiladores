eel.expose(reload)
function reload() {
    location.reload()
}

eel.expose(removeElement)
function removeElement(id) {
    try {
        $(`#${id}`).empty()
    } catch (error) {
        console.log(error)
    }
}

eel.expose(setLocalStorage)
function setLocalStorage(key, value) {
    console.log('setLocalStorage :: INIT')
    localStorage.setItem(key, value)
}

eel.expose(getLocalStorage)
function getLocalStorage(key) {
    console.log('getLocalStorage :: INIT')
    return localStorage.getItem(key)
}

eel.expose(showModalLoading)
function showModalLoading() {
    let modalHTML = `<div class="modal fade" id="loading-modal" tabindex="-1" aria-labelledby="loading-modal-label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body text-center">
          <div class="spinner-border text-primary" role="status">
          </div>
          <h5 class="modal-title mt-3" id="loading-modal-label">Carregando...</h5>
        </div>
      </div>
    </div>
    </div>`
    $("body").append(modalHTML)
    $('#loading-modal').modal({ backdrop: 'static', keyboard: false })
}

eel.expose(showFullScreenModal)
function showFullScreenModal(
    title,
    idsElements,
    pythonFunction
) {
    console.log(idsElements)
    let id_screen = title.replace(/[^A-Za-z]+/g, '')

    let HTMLElements = ""

    for (const elements of idsElements) {
        HTMLElements += `<div id="${elements}"></div>`
    }

    let fullScreenModal = `
    <div class="modal modal-fullscreen" id="modal-fullscreen-${id_screen}" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #090825;color: #fff;">
          <h5 class="modal-title" style="font-family: 'TitilliumWeb';">${title}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true" style="color: #fff;">&times;</span>
          </button>
        </div>
        <div class="modal-body page-enter main-content">
            ${HTMLElements}
        </div>
        <div class="modal-footer"></div>
      </div>
    </div>
  </div>
    `
    try {
        $("body").append(fullScreenModal)
        $(`#modal-fullscreen-${id_screen}`).modal("show")
    
        window['eel'][pythonFunction]()
    } catch (error) {
        console.log(error)
    }

}

eel.expose(setLinkOption)
function setLinkOption(
    title,
    idsElements,
    pythonFunction,
) {
    console.log('INIT :: setLinkOption')
    try {
        let id_screen = title.replace(/[^A-Za-z0-9]+/g, '')
        var link = $("#" + id_screen)
        if (link.length > 0) {
            link.remove()
        }
        let htmlLinkOption = `
        <div id='${id_screen}' class="col-12 col-md-3 col-sm-6 d-flex p-1 pr-3 link-option">
            <span class="col-11" onclick="showFullScreenModal(
                '${title}', ['${idsElements.join("', '")}'], '${pythonFunction}'
            )">${title}</span>
            <span class="col icon-arrow">&#10095;</span>
        </div>
        `
        $("#link-options").append(htmlLinkOption)
    } catch (error) {
        console.log(error)  
    }    
}

eel.expose(closeModal)
function closeModal(idModal) {
    $("#" + idModal).modal("toggle")
}

eel.expose(showModal)
function showModal(idModal, text, icon, title, static, scroll, backgroundColor, closeButton) {
    console.log("showModal :: INIT")
    if (icon == undefined) {
        icon = "exclamation-triangle"
    }
    if (title == undefined) {
        title = "Atenção"
    }
    if (backgroundColor == undefined) {
        backgroundColor = `#e9ecef`
    }
    if (closeButton == undefined) {
        closeButton = true
    }
    var modal = $("#" + idModal)

    title_icon = title + `<i class="fa fa-${icon} ml-2" aria-hidden="true" style="font-size:16px"></i>` 
    // Verifica se o modal já existe
    if (modal.length > 0) {

        modal.find(".modal-title").html(title_icon)
        modal.find(".modal-body").html(text)

    } else {
        let newModal = `
        <div class="modal fade" id="${idModal}" tabindex="-1" role="dialog" aria-labelledby="ModalCenterTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered ${scroll ? 'modal-fixed' : ''}" role="document">
                <div class="modal-content border" >

                    ${
                        title ? 
                        `
                        <div class="modal-header" style="background-color:${backgroundColor}">
                            <h6 class='modal-title col text-center ml-3'>
                                ${title_icon}
                            </h5>
                                ${
                                    closeButton?
                                    "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>"
                                    :
                                    ""
                                }
                        </div>
                        `
                        :
                        ""
                    }

                    <div class="modal-body ${scroll ? 'modal-scroll' : ''} text-center h4 justify-content-center p-4" id="${idModal}-content">
                        ${text}
                    </div>
                </div>
            </div>
        </div>
    `
        $("body").append(newModal)
    }
    if (static) {
        $('#' + idModal).modal({ backdrop: 'static', keyboard: false })
    }
    $('#' + idModal).modal("show")
}

eel.expose(showFormModal)
function showFormModal(
        idModal,
        text,
        icon,
        title,
        static,
        scroll,
        backgroundColor,
        closeButton,
) {
    let formHTML = `
        <div class="modal-body">${text}</div>
        <div id="${idModal}" class="${text?'modal-footer':''}justify-content-center"></div>
    `
    showModal(
        idModal + '-parent',
        formHTML,
        icon,
        title,
        static,
        scroll,
        backgroundColor,
        closeButton
    )
}

eel.expose(showConfirmModal)
function showConfirmModal(
        idModal,
        text,
        icon,
        title,
        func,
        access,
        args,
        idElements,
) {
    console.log(title)
    if (text == undefined || text == "") {
        text = 'Você confirma esta ação?'
    }
    if (title == undefined || title == "") {
        title = 'Confirmação'
    }
    if (icon == undefined || icon == "") {
        icon = 'check-circle'
    }
    let formHTML = `
        <div class="modal-body">
            <h5>${text}</h5>
            <div class="modal-footer justify-content-center">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" 
                onclick="getArgsCallPython('${func}', ${access ? "'" + access + "'" + ',' : 'false, '} ${args ? "'" + String(args).replaceAll("\n", "") + "'" + ',' : 'false, '} '${idElements}')">
                    Confirmar
                </button>
            </div>
        </div>
    `
    showModal(idModal, formHTML, icon, title)
}

eel.expose(showToast)
function showToast(message) {
    const toast = $(`
      <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" style="position:fixed; bottom:30; right:10; margin-bottom: 1rem;">
        <div class="toast-header d-flex" style="background-color:#fff;border:solid #c3c3c3 1px">
          <strong class="mr-auto">${message}</strong>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    `)
    $('.toast').remove()
    $('body').append(toast)
    toast.toast({ autohide: false }).toast('show')
}

eel.expose(removeToast)
function removeToast() {
    $('.toast').remove()
}

eel.expose(updateStatusBar)
function updateStatusBar(textStatus) {
    $("#statusBar").html(textStatus)
}

eel.expose(updateProgressValue)
function updateProgressValue(porcent) {
    $("#d-progressValue").removeClass("d-none")
    $("#progressValue").attr("arial-valuenow", porcent).css("width", porcent + "%")
    $("#progressValue").html(porcent + "%")
}

eel.expose(hiddenProgressValue)
function hiddenProgressValue() {
    $("#d-progressValue").addClass("d-none")
}

function copyToClipboard(elementId) {
    var copyText = document.getElementById(elementId);
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(copyText.value)
}   