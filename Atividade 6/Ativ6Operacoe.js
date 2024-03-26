var valor1, valor2, soma, subtracao, produto, divisao, restoDiv;

valor1 = prompt("Insira o valor 1:");
valor2 = prompt("Insira o valor 2:");

soma = parseInt(valor1)+parseInt(valor2); // testei se existia parseInt, então usei

alert("Soma: " + soma);

subtracao = parseInt(valor1)-parseInt(valor2);

alert("Subtração: " + subtracao);

produto = parseInt(valor1)*parseInt(valor2);

alert("Produto: " + produto);

divisao = parseInt(valor1)/parseInt(valor2);

alert("Divisão: " + divisao);

restoDiv = parseInt(valor1)%parseInt(valor2);

alert("Resto da divisão: " + restoDiv);