'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var answerSchema = Schema({ 
    text: String, 
    numselect: Number,
    finalQuestion: Boolean,
    Idquestion: {type : Schema.ObjectId, ref: 'Question'}
});

module.exports = mongoose.model('Answer', answerSchema);