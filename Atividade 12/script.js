class Retangulo {
    constructor(base, altura) {
        this.base = base;
        this.altura = altura;
    }

    calcularArea() {
        return this.base * this.altura;
    }
}

var retangulo1 = new Retangulo(10, 5);
var area = retangulo1.calcularArea();
alert("Área do Retângulo: " + area);

class Conta {
    constructor(nomeCorrentista, banco, numeroConta, saldo) {
        this.nomeCorrentista = nomeCorrentista;
        this.banco = banco;
        this.numeroConta = numeroConta;
        this.saldo = saldo;
    }

    getNomeCorrentista() { 
        return this.nomeCorrentista;
    }
    setNomeCorrentista(nome) { 
        this.nomeCorrentista = nome;
    }

    getBanco() { 
        return this.banco;
    }
    setBanco(banco) { 
        this.banco = banco;
    }

    getNumeroConta() { 
        return this.numeroConta; 
    }
    setNumeroConta(numero) { 
        this.numeroConta = numero; 
    }

    getSaldo() { 
        return this.saldo; 
    }
    setSaldo(saldo) { 
        this.saldo = saldo; 
    }
}

class ContaCorrente extends Conta {
    constructor(nomeCorrentista, banco, numeroConta, saldo, saldoEspecial) {
        super(nomeCorrentista, banco, numeroConta, saldo);
        this.saldoEspecial = saldoEspecial;
    }

    getSaldoEspecial() { 
        return this.saldoEspecial; 
    }
    setSaldoEspecial(saldo) { 
        this.saldoEspecial = saldo; 
    }
}

class ContaPoupanca extends Conta {
    constructor(nomeCorrentista, banco, numeroConta, saldo, juros, dataVencimento) {
        super(nomeCorrentista, banco, numeroConta, saldo);
        this.juros = juros;
        this.dataVencimento = dataVencimento;
    }

    getJuros() { 
        return this.juros; 
    }
    setJuros(juros) { 
        this.juros = juros; 
    }

    getDataVencimento() { 
        return this.dataVencimento; 
    }
    setDataVencimento(data) { 
        this.dataVencimento = data; 
    }
}

var nomeCorrentista = prompt("Nome do correntista:");
var banco = prompt("Banco:");
var numeroConta = prompt("Número da conta:");
var saldoInicial = parseFloat(prompt("Saldo inicial:"));

var contaCorrente = new ContaCorrente(nomeCorrentista, banco, numeroConta, saldoInicial, 500);
var contaPoupanca = new ContaPoupanca(nomeCorrentista, banco, numeroConta, saldoInicial, 0.05, "05/07/2027");

alert("\nConta Corrente:");
alert("Nome: " + contaCorrente.getNomeCorrentista());
alert("Banco: " + contaCorrente.getBanco());
alert("Número da conta: " + contaCorrente.getNumeroConta());
alert("Saldo: " + contaCorrente.getSaldo());
alert("Saldo Especial: " + contaCorrente.getSaldoEspecial());

alert("\nConta Poupança:");
alert("Nome: " + contaPoupanca.getNomeCorrentista());
alert("Banco: " + contaPoupanca.getBanco());
alert("Número da conta: " + contaPoupanca.getNumeroConta());
alert("Saldo: " + contaPoupanca.getSaldo());
alert("Juros: " + contaPoupanca.getJuros());
alert("Data de Vencimento: " + contaPoupanca.getDataVencimento());