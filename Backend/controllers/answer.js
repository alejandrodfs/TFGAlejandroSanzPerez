'use strict'

var path = require('path'); //esta dos lineas son para acceder al sistema de ficheros, imagenes y demas
var fs = require('fs');
var mongoosePaginate = require ('mongoose-pagination'); 

var Form = require('../models/form');
var Question = require('../models/question');
var Answer = require('../models/answer');

function getAnswer(req, res){
    var answerId = req.params.id;

    Answer.findById(answerId).populate({path: 'Idquestion'}).exec((err, answer)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!answer){
                res.status(404).send({message: 'La respuesta no existe'});
            }else{
                res.status(200).send({answer});
            }
        }

    });
    
}

function saveAnswer(req, res){
    var answer = new Answer();

    var params = req.body;
    answer.text = params.text;
    answer.numselect = params.numselect;
    answer.Idquestion = params.Idquestion;
    answer.finalQuestion = params.finalQuestion;

    answer.save((err, answerStored) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!answerStored){
                res.status(404).send({message: 'No ha sido guardada la respuesta'});
            }else{
                res.status(200).send({answer: answerStored});
            }
        }
    });
}

function getAnswers(req, res){
    var questionId = req.params.Idquestion;
  
    if(!questionId){ //Get all questions
        var find = Answer.find({});
        

    }else{ //Get questions with formID
        var find = Answer.find({Idquestion : questionId});
        
    }
    find.populate({
        path:'Idquestion',
        populate: {
            path: 'Idform',
            model: 'Form'
        }
    }).exec((err, answers)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!answers){
                res.status(404).send({message: 'No hay respuestas'});
            }else{
                res.status(200).send({answers});
            }
        }

    });
}
function updateAnswer(req, res){
   
    var answerId = req.params.id;
    var update = req.body;
    
    Answer.findByIdAndUpdate(answerId, update, (err, answerupdated)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!answerupdated){
                res.status(404).send({message: 'No hay respuestas'});
            }else{
                res.status(200).send({answer: answerupdated});
            }
        }
    });
}
function deleteAnswer(req, res){
    var answerId = req.params.id;

    Answer.findByIdAndRemove(answerId, (err, answerRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!answerRemoved){
                res.status(404).send({message: 'No se ha eliminado la respuesta'});
            }else{
                res.status(200).send({answer: answerRemoved});
            }
        }
    });
}

module.exports = {
    getAnswer, 
    saveAnswer, 
    getAnswers,
    updateAnswer,
    deleteAnswer
 };