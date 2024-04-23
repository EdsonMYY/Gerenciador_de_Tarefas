//Atividade 11

var aluno1 = {
    ra: "1234567",
    nome: "João"
};

function Aluno2(RA, Nome) {
    this.ra = RA;
    this.nome = Nome;
}
var aluno2 = new Aluno2("1234", "Mario");

class Aluno3 {
    constructor(RA, Nome) {
        this.ra = RA;
        this.nome = Nome;
    }
}
var aluno3 = new Aluno3("7654321", "Daniel");

alert("RA: " + aluno1.ra + "\nNome: " + aluno1.nome);
alert("RA: " + aluno2.ra + "\nNome: " + aluno2.nome);
alert("RA: " + aluno3.ra + "\nNome: " + aluno3.nome);