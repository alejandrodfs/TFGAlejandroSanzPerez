'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.Promise = global.Promise;    
mongoose.connect('mongodb://localhost:27017/tfgDB',{ useNewUrlParser: true , useUnifiedTopology: true},(err, res) => {

    if(err){
        throw err;
    }else{
        console.log("La conexion a la base de datos esta funcionando correctamente");
        app.listen(port, function(){
           console.log("Server del api rest escuchando");
        });
    }
})
