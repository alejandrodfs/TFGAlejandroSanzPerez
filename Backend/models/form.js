'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var formSchema = Schema({
    title : String,
    level: String
});

module.exports = mongoose.model('Form', formSchema);