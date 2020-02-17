'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var questionSchema = Schema({
    title : String,
    text: String,
    questionBefore: String,
    answerBefore: String, 
    Idform: {type : Schema.ObjectId, ref: 'Form'}
});

module.exports = mongoose.model('Question', questionSchema);