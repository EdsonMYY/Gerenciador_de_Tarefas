module.exports = function(){
 
    this.getProfessores = function(connection, callback){
         connection.query('select * from professores', callback);
    }
   
    this.getProfessor = function(connection, callback){
         connection.query('select * from professores WHERE id_professor=1', callback);
    }
   
     return this;
   
  }