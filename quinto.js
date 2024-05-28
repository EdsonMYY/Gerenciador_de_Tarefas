var eventos = require('events');

// Atribuição da classe EventEmitter a uma variavel
var EmissorEventos = eventos.EventEmitter;

var ee = new EmissorEventos();

// É registrado um ouvinte (listener) para o evento 'dados
// Quando o evento é emitido
ee.on('dados', function(fecha) {
    console.log(fecha);
})

setInterval(function() {
    ee.emit('dados', Date.now());
}, 500);