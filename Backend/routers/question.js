'use strict'

var express = require('express');
var QuestionController = require('../controllers/question');
var api = express.Router(); //Para que funcionen tambien las rutas post, get...
var md_auth = require('../middlewares/authenticated');

//mirar en cuales require autenticacion
api.get('/question/:id', QuestionController.getQuestion);  
api.post('/question', md_auth.ensureAuth, QuestionController.saveQuestion);  //requiere autenticacion
api.get('/questions/:Idform?', QuestionController.getQuestions);
api.put('/question/:id', md_auth.ensureAuth, QuestionController.updateQuestion);  //requiere autenticacion
api.delete('/question/:id', md_auth.ensureAuth, QuestionController.deleteQuestion); //require autenticacion
api.get('/nextQuestion/:ids', QuestionController.getNextQuestion);

module.exports = api;