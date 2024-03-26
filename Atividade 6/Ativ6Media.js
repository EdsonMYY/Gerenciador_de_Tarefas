var nome, nota1, nota2, nota3, media;

do {
    nome = prompt("Qual é o seu nome?");
}while(!confirm("Esse é seu nome?"));

nota1 = prompt("Insira a nota 1:");
nota2 = prompt("Insira a nota 2:");
nota3 = prompt("Insira a nota 3:");

media = (parseFloat(nota1) + parseFloat(nota2) + parseFloat(nota3)) / 3;

alert("Nome: " + nome + "\nNota 1: " + nota1 + "\nNota 2: " + nota2 + "\nNota 3: " + nota3 + "\nMédia: " + media);


