var idade = 0, idadeTotal= 0, numF = 0, numM = 0, qtd = 0, qtdP = 0, qtdP2 = 0, idadeVelha = 0, idadeJovem = 0, media = 0;
var sexo, opiniao;

for(var cont = 1; cont <= 4; cont++){
    idade = parseInt(prompt("Digite sua idade: "));
    if(idadeVelha == 0 && idadeJovem == 0) {
        idadeVelha = idade;
        idadeJovem = idade;
    }
    if(idadeVelha < idade) {
        idadeVelha = idade;
    }
    if(idadeJovem > idade) {
        idadeJovem = idade;
    }
    idadeTotal += idade;
    media = idadeTotal / cont;

    sexo = prompt("Sexo: \nM - Mascúlino F - Feminino");
    if(sexo == "M") {
        numM ++;
    }
    else if(sexo == "F") {
        numF++;
    }

    opiniao = parseInt(prompt("Qual foi sua opinião sobre o filme: \n1-Péssimo \n2-Regular \n3-Bom \n4-Ótimo \n(De uma nota de 1 a 4)"));
    if(opiniao == 1) {
        qtdP++;
    }
    if(opiniao == 3 || opiniao == 4) {
        qtdP2++;
    }
    qtd++
    alert("Pesquisa Concluída")
    alert("Próximo")
}

alert("Média das idades: " + media);
alert("Idade mais velha: " + idadeVelha);
alert("Idade mais nova: " + idadeJovem);
alert("Quantidade de pessoas que avaliaram o filme como péssimo: " + qtdP);
alert("Porcentagem de pessoas que valiaram o filme como bom ou ótimo: " + (qtdP2/qtd) * 100 + "%");
alert("Quantidade de Mulheres que responderam: " + numF + "\nQuantidade de Homens que responderam: " + numM);
