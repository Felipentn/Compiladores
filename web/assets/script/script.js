

eel.expose(renderizefront)
function renderizefront(id, message){
    document.getElementById(id).value = message;

}

function clear_input(){
    document.getElementById('return_calcule').value = '...';
    document.getElementById('id_valid').value = '...';

}
