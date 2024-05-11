// Atividade 14
function transformarTexto() {
    var texto = document.getElementById("texto").value;
    var checkboxMaiusculas = document.getElementById("maiusculas");
    var checkboxMinusculas = document.getElementById("minusculas");

    if (checkboxMaiusculas.checked) {
        texto = texto.toUpperCase();
    }

    if (checkboxMinusculas.checked) {
        texto = texto.toLowerCase();
    }

    document.getElementById("texto").value = texto;
}