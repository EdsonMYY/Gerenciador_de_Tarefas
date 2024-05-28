var app = require('./app/config/server');

var rotaHome = require('./app/routes/home');
rotaHome(app);

var rotaAdicionarUsuario = require('./app/routes/adicionar_usuario');
rotaAdicionarUsuario(app);

var rotaHistoria = require('./app/routes/historia')(app);

var rotaCursos = require('./app/routes/cursos');
rotaCursos(app);

var rotaProfessores = require('./app/routes/professores');
rotaProfessores(app);

app.listen(3000, function() {
    console.log("Servidor Iniciado");
});