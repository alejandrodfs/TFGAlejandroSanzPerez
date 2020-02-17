'use strict'

var path = require('path'); //esta dos lineas son para acceder al sistema de ficheros, imagenes y demas
var fs = require('fs');
var mongoosePaginate = require ('mongoose-pagination'); 

var Form = require('../models/form');
var Question = require('../models/question');
var Answer = require('../models/answer');

function getForm( req, res){

    var formID = req.params.id;

    Form.findById(formID, (err, form) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
            if(!form){
                res.status(404).send({message: 'El formulario no existe'});
            }else{
                res.status(200).send({form});
            }
        }
    });

    
}

function saveForm(req, res){
    var form = new Form();

    var params = req.body;

    form.title = params.title;
    form.level = params.level;

    form.save((err, formStored)=> {
        if(err){
            res.status(500).send({message: 'Error al guardar el formulario'});
        }else{
            if(!formStored){
                res.status(404).send({message: 'El formulario no ha sido guardado'});
            }else{
                res.status(200).send({form : formStored});
            }
        }
    });


}

function getForms (req, res){
    
    var parameters = req.params.page.split(' ');
    var Level =parameters[1];   
    if(req.params.page){
        var page = parameters[0];
    }else{
        var page = 1;
    }
    var itemsPerPage = 4;//numero de items por pagina
    var find = Form.find({level : Level});

    find.sort('title').paginate( page, itemsPerPage, function(err, forms, totalItems){
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!forms){
                res.status(404).send({message: 'No hay artistas'});
            }else{
                return res.status(200).send({
                    totalItems : totalItems,
                    forms : forms
                });

            }
        }
    });

}

function updateForms (req, res){
    var formsID = req.params.id;
    var update = req.body;
    
    Form.findByIdAndUpdate(formsID, update, (err, formUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error al guardar el artista'});
        }else{
            if(!formUpdated){
                res.status(404).send({message: 'El formulario no ha sido actualizado'});
            }else{
                res.status(200).send({form: formUpdated});
            }
        }
    });
}
function deleteForm(req, res){

    var formsID = req.params.id;

    Form.findByIdAndRemove(formsID, (err, formRemoved) =>{
        if(err){
            res.status(500).send({message: 'Error al eliminar el formulario'});
        }else{
            if(!formRemoved){
                res.status(404).send({message: 'El formulario no ha sido eliminado'});
            }else{
                
                Question.find({form: formRemoved._id}).remove((err, questionRemoved)=>{
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
                                        res.status(200).send({form: formRemoved});
                                   
                                 } 
                                }
                            });
                          }  
                        }
                });
             }
        }
    });
}


module.exports = {
    getForm,
    saveForm, 
    getForms, 
    updateForms, 
    deleteForm
};