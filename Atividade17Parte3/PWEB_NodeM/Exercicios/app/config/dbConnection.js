const sql = require('mssql'); // Importação correta do módulo
 
module.exports = function () {
    const sqlConfig = {
        user: 'BD2221041', //'LOGON',

        password: 'A12345678a', //'SENHA',

        database: 'BD', //'site_fatec',

        server: 'APOLO', //'NOME_DO_SERVIDOR',
        options: {
            encrypt: false,
            trustServerCertificate: true // se você não tiver um certificado de servidor configurado
        }
    }
    return sql.connect(sqlConfig);
}