var altura = parseFloat(prompt("Digite a sua altura: "));
var peso = parseFloat(prompt("Digite seu peso: "));

function calcularIMC(altura, peso) {
    var imc = peso / Math.pow(altura, 2);

    if (imc < 18.5) {
        return `Seu IMC é ${imc.toFixed(2)}. Você está abaixo do peso.`;
      } else if (imc < 25) {
        return `Seu IMC é ${imc.toFixed(2)}. Você está no peso normal.`;
      } else if (imc < 30) {
        return `Seu IMC é ${imc.toFixed(2)}. Você está com sobrepeso, grau I.`;
      } else if (imc < 40) {
        return `Seu IMC é ${imc.toFixed(2)}. Você está com obesidade, grau II.`;
      } else {
        return `Seu IMC é ${imc.toFixed(2)}. Você está com obesidade grave, grau III.`;
      }
}

var resultado = calcularIMC(altura, peso);

alert(resultado);
