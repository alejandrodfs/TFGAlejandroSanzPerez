'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    email: String,
    password: String
});

module.exports = mongoose.model('User', userSchema);