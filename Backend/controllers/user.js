'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

function pruebas(req, res){
    res.status(200).send({
        message: 'Prueba del controlador user'
    });

}

function saveUser( req, res){

    var user = new User();

    var params = req.body;

    user.email = params.email;

    if(params.password){
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.email != null){
                user.save((err, userStored)=> {
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha guardado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Introduce el email'});
            }
        });
    }else{
        res.status(200).send({message: 'Introduce la contraseña'});
    }
    
}

function loginUser(req, res){

    var params = req.body;
    var email = params.email;
    var password = params. password;
    
   // User.findOne({email: email.toLowerCase()}, (err, user)=>{
    User.findOne({email: email}, (err, user)=>{
        if(err){
            res.status(500).send({ message: 'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({ message: 'El usuario no existe'});
            }else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        if(params.getHash){
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({ message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    
    
    });

}

function updateUser(req, res){
    var userId = req.params.id;
    var update  =req.body;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para actualizar este usuario'});
    }
    User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});

        }else{
            if(!userUpdated){
                res.status(404).send({message:'No se ha podido actualizar'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }


    });
}

module.exports = {
    pruebas,
    saveUser, 
    loginUser,
    updateUser
};