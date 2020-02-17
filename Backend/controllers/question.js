'use strict'

var path = require('path'); //esta dos lineas son para acceder al sistema de ficheros, imagenes y demas
var fs = require('fs');
var mongoosePaginate = require ('mongoose-pagination'); 

var Form = require('../models/form');
var Question = require('../models/question');
var Answer = require('../models/answer');

function getQuestion( req, res){
    var QuestionID = req.params.id;
    
    Question.findById(QuestionID).populate({path: 'Idform'}).exec((err, question)=> {
        if(err){
            res.status(500).send({message:'Error en la peticion'});
        }else{
            if(!question){
                res.status(404).send({message:'El album no existe'});
            }else{
                res.status(200).send({question})
            }
        }
    });
}

function saveQuestion(req, res){
    var question = new Question();

    var params = req.body;
    question.title = params.title;
    question.text = params.text;
    question.questionBefore = params.questionBefore;
    question.answerBefore = params.answerBefore; 
    question.Idform = params.Idform;
    question.finalQuestion = params.finalQuestion;
    question.save((err, questionStored) =>{
        if(err){
            res.status(500).send({message: "Error guardar la pregunta"});
        }else{
            if(!questionStored){
                res.status(404).send({message: "No se ha guardado la pregunta"});
            }else{
                res.status(200).send({question: questionStored});
            }
        }
    });
}

function getQuestions(req, res){

    var formID = req.params.Idform;
    

    if(!formID){ //Get all questions
        var find = Question.find({});
        

    }else{ //Get questions with formID
        var find = Question.find({Idform : formID});
        
    }
    find.populate({path:'Idform'}).exec((err, questions)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!questions){
                res.status(404).send({message: 'No hay preguntas'});
            }else{
                res.status(200).send({questions});
            }
        }

    });
}
function updateQuestion(req, res){
    var questionId = req.params.id;
    var update = req.body;
    
    Question.findByIdAndUpdate(questionId, update, (err,questionUpdated )=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!questionUpdated){
                res.status(404).send({message: 'No se ha actualizado la pregunta'});
            }else{
                res.status(200).send({question : questionUpdated});
            }
        }

    });
}

function deleteQuestion(req, res){
    var questionId = req.params.id;


    Question.findByIdAndRemove(questionId,(err, questionRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar la pregunta'});
        }else{
            if(!questionRemoved){
                res.status(404).send({message: 'La pregunta no ha sido eliminado'});
            }else{

                Answer.find({question: questionRemoved._id}).remove((err, answerRemoved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar la respuesta'});
                    }else{
                        if(!answerRemoved){
                            res.status(404).send({message: 'La respuesta no ha sido eliminado'});
                        }else{
                            res.status(200).send({question: questionRemoved});
                       
                     } 
                    }
                });
              }  
            }
    });
}

function getNextQuestion(req, res){
    var parameters = req.params.ids.split(' ');
    var idQuestion = parameters[0];
    var idAnswer = parameters[1];

    Question.findOne({questionBefore: idQuestion, answerBefore: idAnswer}, (err, nextquestion)=>{
        if(err){
            res.status(500).send({ message: 'Error en la petición'});
        }else{
            if(!nextquestion){
                res.status(404).send({ message: 'El usuario no existe'});
            }else{
                res.status(200).send({question: nextquestion});
            }
        }
    });
}

module.exports = {
   getQuestion, 
   saveQuestion, 
   getQuestions, 
   updateQuestion, 
   deleteQuestion,
   getNextQuestion
};