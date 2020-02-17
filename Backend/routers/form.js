'use strict'

var express = require('express');
var FormController = require('../controllers/form');
var api = express.Router(); //Para que funcionen tambien las rutas post, get...
var md_auth = require('../middlewares/authenticated');

//mirar en cuales require autenticacion
api.get('/form/:id', FormController.getForm); //para coger un formulario no hace falta autenticacion
api.post('/form', md_auth.ensureAuth, FormController.saveForm); //para guardar un formulario si 
api.get('/forms/:page?', FormController.getForms);
api.put('/form/:id',md_auth.ensureAuth, FormController.updateForms);//require autenticacion
api.delete('/form/:id',md_auth.ensureAuth, FormController.deleteForm);//requiere autenticacion


module.exports = api;