allAccess = new Map()

function initPage() {
    users = Array()
    passwords = Array()
    let allUsers = document.getElementsByName("user")
    let allPasswords = document.getElementsByName("password")

    for (user of allUsers) {
        users.push(user.id)
    }
    for (password of allPasswords) {
        passwords.push(password.id)
    }
}

function loadAccess() {
    initPage()
    users.forEach(element => {
        $("#" + element).val(localStorage.getItem(element))
    })
    passwords.forEach(element => {
        $("#" + element).val(localStorage.getItem(element))
    })
}

function saveAccess() {
    initPage()
    users.forEach(element => {
        localStorage.setItem(element, $("#" + element).val())
    })
    passwords.forEach(element => {
        localStorage.setItem(element, $("#" + element).val())
    })
}

function newCardSettings(
    key,
    legend,
    idUser,
    idPassword,
    maxLenght,
    cols,
    placeholder
) {
    allAccess.set(key, [legend, idUser, idPassword])

    if (cols == undefined) {
        cols = '4'
    }

    if (placeholder == undefined) {
        placeholder = 'Usuário'
    }

    return `<div id="${idUser}-parent" class="col-md-${cols} col-sm-6 col-12">
                <form>
                    <fieldset class="form-user">
                        <legend class="legend-text text-nowrap">${legend}</legend>
                        <div class="form-row">
                            ${
                                idUser
                                ?
                                `
                                <div class="form-group col-md-12">
                                    <label for="userp1">${placeholder}</label>
                                    <input type="text" class="form-control col-11" name="user" id="${idUser}" placeholder="${placeholder}" maxlength="${maxLenght[0]}" autocomplete="off" onchange="saveAccess()">
                                </div>                        
                                `
                                :
                                ''
                            }
                            ${
                                idPassword
                                ?
                                `
                                <div class="form-group col-md-12">
                                    <label for="passwordp1">Senha</label>

                                    <div class="d-flex align-items-center">
                                    
                                        <input type="password" class="form-control col-11" name="password" id="${idPassword}" placeholder="Senha" maxlength="${maxLenght[1]}" autocomplete="off">
                                        
                                        <div style="position: flex: 1;position: relative;left: -2.3vw;">
                                            <img id="${idPassword}-eyes" src="../assets/images/eyes.png"/>
                                        </div> 
                                    </div>    
                                                                
                                </div>
                                <script>
                                    var ${idPassword} = $('#${idPassword}');
                                    var ${idPassword}eyes= $("#${idPassword}-eyes");
                                    
                                    ${idPassword}eyes.mousedown(function() {
                                        ${idPassword}.attr("type", "text");
                                    });
                                    
                                    ${idPassword}eyes.mouseup(function() {
                                        ${idPassword}.attr("type", "password");
                                    });
                    
                                    $( "#${idPassword}-eyes" ).mouseout(function() { 
                                        $("#${idPassword}").attr("type", "password");
                                    });            
                                </script>                                  
                                `
                                :
                                ''
                            }
                        </div>
                    </fieldset>
                </form>
            </div>
            `
}

function getUser(access) {
    let users = new Object()
    users[access] = {
        "legend": allAccess.get(access)[0],
        "user": localStorage.getItem(allAccess.get(access)[1]),
        
    }
    let idPassword = allAccess.get(access)[2]

    if (idPassword) {
        users[access]["password"] = localStorage.getItem(idPassword)
    } else {
        users[access]["password"] = "NÃO CONSTA"
    }

    if (users[access]["user"] == null ||
        users[access]["password"] == null ||
        users[access]["user"].replaceAll(" ", "") == "" ||
        users[access]["password"].replaceAll(" ", "") == "") {
        console.log(users[access])
        return false
    }
    return users[access]
}

function pythonUsers(func, access, args, btnValue) {
    console.log("pythonUsers :: INIT")
    if (typeof access == "string") {
        access = access.split(",")
    }
    if (typeof args == "string" && args != 'undefined') {
        args = args.split(",")
    }
    if (typeof func == "string") {
        func = window['eel'][func]
    }
    let users = {}
    console.log(access)
    for (const key of access) {
        const user = getUser(key)
        if (!user) {
            showModal(`erroUser${key}`, `Favor Incluir Usuário e Senha  ${allAccess.get(key)[0]}!`, "exclamation-triangle", "Atenção")
            return
        }
        users[key] = user
    }
    if (args == undefined || args == 'undefined' || args == null || args == 'null') {
        func(users, btnValue)
    } else {
        func(users, args, btnValue)
    }
}
