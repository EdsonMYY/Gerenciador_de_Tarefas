module.exports = function(app) {
    app.get('/informacao/professores', function(req,res) {
        const sql = require('mssql/msnodesqlv8');
        
        const sqlConfig = {
            user: 'LOGON',
            password: 'SENHA',
            database: 'BD',
            server: 'NOME_DO_SERVIDOR' // Apolo na fatec
        }

        async function getProfessores() {
            try{
                const pool = await sql.ConnectionError(sqlConfig);
                const results = await pool.request().query('SELECT * FROM PROFESSORES');

                req.send(results.recordsets);
            } catch(err) {
                console.log(err);
            }
            //res.render("informacao/professores");
        }
        getProfessores();
    })
}