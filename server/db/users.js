
var mongoose = require('mongoose');


var UsuarioSchema = new mongoose.Schema({
    nome: String,
    login: String,
    senha: String
});



UsuarioSchema.statics.findById = function (id , callback) {
      var User = this;
      
      return User.findOne({_id : id}).then((user) => {
         if(!user){
             return callback(null,null);
         } 
         return callback(null,user);
         
      
          
      });
      
      
};

UsuarioSchema.statics.findByLogin = function (login , callback) {
      var User = this;
        User.find().then((user) => {
          console.log(user);
        });
      
       User.findOne({nome : login}).then((user) => {
         if(!user){
          console.log("sem usuarios");
             return callback(null,null);
         } 
         console.log(user);
         console.log(user.senha);
         return callback(null,user);
         
      
          
      });
      
      
};
var Users = mongoose.model('User',UsuarioSchema);

module.exports = {Users};
