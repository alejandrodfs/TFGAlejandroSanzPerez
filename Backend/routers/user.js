'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticated'); //Esto se pone siempre entre medias cuando requiere que el usuario este logueado

api.get('/probando-controlador',md_auth.ensureAuth,UserController.pruebas);
api.post('/register',md_auth.ensureAuth,UserController.saveUser);
api.post('/login',UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);

module.exports = api;