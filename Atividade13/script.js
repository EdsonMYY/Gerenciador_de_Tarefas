//Atividade 13
function abrirJanela() {
    document.getElementById("janela").src = "Imagens/JanelaAberta.jpg";
    document.querySelector("h1").textContent = "Janela Aberta";
}
function fecharJanela() {
    document.getElementById("janela").src = "Imagens/JanelaFechada.jpg";
    document.querySelector("h1").textContent = "Janela Fechada";
}
function quebrarJanela() {
    document.getElementById("janela").src = "Imagens/JanelaQuebrada.jpg";
    document.querySelector("h1").textContent = "Janela Quebrada";
}