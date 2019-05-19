'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ContactoSchema = Schema({
    nombre: String,
    telefono: String,
    correo: String,
    negocio: String,
    tema: String,
    comentarios: String,
    contactado: Boolean,
    falso: Boolean,
    mensaje: String
    });

module.exports = mongoose.model('Contacto' ,ContactoSchema);


