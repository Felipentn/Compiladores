let elementPages = document.getElementById("principal").querySelectorAll("div")
let pages = Array()
let scrollHabilit = true

window.onbeforeunload = function () { return false }

eel.show_app_name()

eel.expose(setProjectName)
function setProjectName(project_name) {
    $('title').html(project_name)
}

function formatCurrency(amount) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    return formatter.format(amount)
}

for (const id of elementPages) {
    if (id.id == "footer") {
        break
    }
    if (id.id != "") {
        pages.push(id.id)
        $("#" + id.id).load(`assets/html/${id.id}.html`)
    }
}

$(window).bind('resize', function () {
    // resize $('.container').width() based on $(window).width()
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
});

document.addEventListener("scroll", (event) => {
    if (!scrollHabilit) {
        return
    }
    let position = window.scrollY
    if (position >= 50) {
        changeNavDark()
    }
    else {
        changeInsertBanner()
    }
})

$('.nav-mylink').mouseup(function () {
    dropdownRemoveFilter()
    $(this).toggleClass("rotate")
})

function switchScreen(idPage) {
    if (idPage == undefined) {
        pages.forEach(page => {
            if ($(page).attr("class") == "d-none") {
                idPage = page
            }
        })
    }

    saveAccess()
    let main = false
    if (!$("#" + idPage).hasClass("d-none") && idPage != "mainPage" || idPage == "mainPage") {
        idPage = "mainPage"
        changeNavDark()
        exitPage()
        dropdownRemoveFilter()
        main = true
    }

    pages.forEach(page => {
        $("#" + page).addClass("d-none")
    })

    $("#" + idPage).removeClass("d-none")
    if (!main) {
        changeNavLigth()
        enterPage()
    }

    if (idPage == 'accessPage') {
        changeNavDark()
        changeInsertBanner()
        dropdownRemoveFilter()
        scrollHabilit = true
    }
    $('.collapse').collapse('hide')
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
}

function dropdownRemoveFilter() {
    let elementPages = document.getElementsByClassName("rotate")
    for (const id of elementPages) {
        id.classList.remove("rotate")
    }
}

function enterPage() {
    scrollHabilit = false
    $(window).scrollTop(0)
    $('#principal').scrollTop(0)
    $("#principal").addClass("principal")
    $("#principal").css("overflow-x", "hidden")
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
}

function exitPage() {
    scrollHabilit = false
    $(window).scrollTop(0)
    $('#principal').scrollTop(0)
    $("#principal").addClass("principal")
    $("#principal").css("overflow", "auto")
    $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
}

function changeInsertBanner() {
    $(".navbar").css("background-color", "transparent")
    $(".bg-navbar").css("background-color", "transparent")
    $("#principal").removeClass("principal")
}

function logoLight() {
    $(".logo").css("filter", "brightness(0) invert(1)")
    $(".logo").hover(function () {
        $(this).css("filter", "brightness(1) invert(0)")
    }, function () {
        $(this).css("filter", "brightness(0) invert(1)")
    })
}

function logoColor() {
    $(".logo").css("filter", "brightness(1) invert(0)")
    $(".logo").hover(function () {
    }, function () {
        $(this).css("filter", "brightness(1) invert(0)")
    })
}

function changeNavLigth() {
    $(".navbar").css("background-color", "#f2f4f8")
    $(".bg-navbar").css("background-color", "#f2f4f8")
    $(".nav-mylink").css("color", "#000")
    $(".nav-mylink").hover(function () {
        $(this).css("color", "#4bcd3e")
    }, function () {
        $(this).css("color", "#000")
    })
    logoColor()
    $("#btnAcess").removeClass("btn-outline-light")
    $(".navbar").removeClass("navbar-dark")
    $(".navbar").addClass("navbar-light")
    $("#btnAcess").addClass("btn-outline-dark")
}

function changeNavDark() {
    $(".navbar").css("background-color", "#090825")
    $(".bg-navbar").css("background-color", "#090825")
    $(".nav-mylink").css("color", "#fff")
    $(".nav-mylink").hover(function () {
        $(this).css("color", "#4bcd3e")
    }, function () {
        $(this).css("color", "#fff")
    })
    logoLight()
    $("#btnAcess").removeClass("btn-outline-dark")
    $(".navbar").removeClass("navbar-light")
    $(".navbar").addClass("navbar-dark")
    $("#btnAcess").addClass("btn-outline-light")
}

function convertTerminalText(text) {
    const buffer = new Uint8Array(text.length);
    for (let i = 0; i < text.length; i++) {
        buffer[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder('ISO-8859-1');
    const utf8Text = decoder.decode(buffer);
    return utf8Text;
}

function inputNumbers(idInput) {
    $("#" + idInput).on("input", function () {
        const text = convertTerminalText(this.value);
        this.value = text.replace(/[^\d ]/g, "").replace(/\s/g, "")
    })
    $("#" + idInput).on("paste", function () {
        const text = convertTerminalText(this.value);
        this.value = text.replace(/[^\d ]/g, "").replace(/\s/g, "")
    })
}
