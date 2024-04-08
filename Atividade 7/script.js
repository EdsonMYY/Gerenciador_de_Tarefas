var voce, v, escolhaComp;

do {
voce = prompt("Escolha:");
v = Math.random();

if(v < 0.33) {
    escolhaComp = "pedra";
}
else if(v < 0.66) {
    escolhaComp = "papel";
}
else if(v < 0.99) {
    escolhaComp = "tesoura";
}

alert("Você escolheu: " + voce);
alert("Escolha do Computador: " + escolhaComp);

if(voce == "pedra" && escolhaComp == "papel") {
    alert("Papel vence pedra.");
    alert("Computador venceu.");
}
else if(voce == "pedra" && escolhaComp == "tesoura") {
    alert("Pedra vence tesoura.");
    alert("Você venceu.");
}

else if(voce == "papel" && escolhaComp == "tesoura") {
    alert("Tesoura vence papel.")
    alert("Computador venceu.");
}
else if(voce == "papel" && escolhaComp == "pedra") {
    alert("Papel vence pedra.");
    alert("Você venceu.");
}

else if(voce == "tesoura" && escolhaComp == "pedra") {
    alert("Pedra vence tesoura.");
    alert("Computador venceu.");
}
else if(voce == "tesoura" && escolhaComp == "papel") {
    alert("Tesoura vence papel.");
    alert("Você venceu");
}
else if(voce != "pedra" && voce != "papel" && voce != "tesoura") {
    alert("Inválido")
}

else {
    alert("Empate");
}
}while(voce != 0);


