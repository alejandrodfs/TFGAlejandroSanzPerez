'use strict'

var express = require('express');
var AnswerController = require('../controllers/answer');
var api = express.Router(); //Para que funcionen tambien las rutas post, get...
var md_auth = require('../middlewares/authenticated');

//mirar en cuales require autenticacion
api.get('/answer/:id', AnswerController.getAnswer);  
api.post('/answer',md_auth.ensureAuth, AnswerController.saveAnswer);  //requiere autenticacion
api.get('/answers/:Idquestion?', AnswerController.getAnswers);
api.put('/answer/:id', AnswerController.updateAnswer); //requiere autenticacion
api.delete('/answer/:id',md_auth.ensureAuth, AnswerController.deleteAnswer); //requiere autenticacion

module.exports = api;