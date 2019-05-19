'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FastCotizacionSchema = Schema({
    cp: Number,
    marca: String,
    modelo: String,
    version: String,
    subversion: String,
    enviado: String,
    contactado: Boolean,
    falso: Boolean
});


module.exports = mongoose.model('FastCotizacion', FastCotizacionSchema);