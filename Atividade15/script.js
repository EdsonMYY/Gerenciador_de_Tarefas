// Atividade 15
function validateForm() {
    var nome = document.mainForm.elements["nome"].value;
    var email = document.mainForm.elements["email"].value;
    var comentario = document.mainForm.elements["comentario"].value;
    var visita = document.querySelector('input[name="visita"]:checked');

    if (nome.length < 10) {
        alert("O nome deve ter pelo menos 10 caracteres.");
        return false;
    }

    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        alert("Por favor, insira um endereço de e-mail válido.");
        return false;
    }

    if (comentario.length < 20) {
        alert("O comentário deve ter no mínimo 20 caracteres.");
        return false;
    }

    if (!visita) {
        alert("Por favor, selecione uma opção na pesquisa.");
        return false;
    } else {
        if (visita.value === "sim") {
            alert("Volte sempre à esta página!");
            document.getElementById(nome).focus();
        } else {
            alert("Que bom que você voltou a visitar esta página!");
            document.getElementById(nome).focus();
        }
    }

    return true; 
}