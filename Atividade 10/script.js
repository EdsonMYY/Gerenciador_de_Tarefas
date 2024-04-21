var num = new Array(3);

for(let i=0; i<=2; i++) {
    num[i] = parseInt(prompt("Digite o " + (i+1) + "º número: "));
}

alert("Maior número: " + MaiorNum(num));

alert("Ordenado: " + ordenacao(num));

function MaiorNum(num) {
    alert("1ª");
    return Math.max(...num);
}

function ordenacao(num) {
    alert("2ª");
    num.sort((a, b) => a - b);
    return num;
}
var text;
text = prompt("Digite uma frase: ");

function palindromo(text) {
    const textMaiusculo = text.toUpperCase().replace(/\s+/g, "");
    const reverso = textMaiusculo.split("").reverse().join("");
    return textMaiusculo === reverso;
}

if(palindromo(text) == true) {
    alert("É palíndromo");
}
else {
    alert("Não é palíndromo");
}

function Triangulo(num) {
    if((num[0] + num[1]) >= num[2] && (num[0] + num[2]) >= num[1] && (num[1] + num[2]) > num[0]) {
        if(num[0] === num[1] && num[1] === num[2]) {
            return "É um triângulo equilátero";
        } else if(num[0] === num[1] || num[1] === num[2] || num[0] === num[2]) {
            return "É um triângulo isósceles";
        } else {
            return "É um triângulo escaleno";
        }
    }
    else {
        return "Não é um Triângulo";
    }
}
var triangulo = Triangulo(num);
alert("Resultado: " + triangulo);