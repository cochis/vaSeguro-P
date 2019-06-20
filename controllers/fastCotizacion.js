'use strict'
var mongoose = require('mongoose');
var bcript = require('bcrypt-nodejs');
var FastCotizacion = require('../models/fastCotizacion');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var path = require('path');
var nodemailer = require('nodemailer');
// var template = require('email-templates').EmailTemplate;
//registro cotizacion


function sendFast(req, res) {
    var params = req.body;
    var fastCotizacion = new FastCotizacion();
    if (params.cp && params.marca && params.modelo && params.version && params.subversion) {
        //seteamos variables
        fastCotizacion.nombre = params.nombre;
        fastCotizacion.telefono = params.telefono;
        fastCotizacion.cp = params.cp;
        fastCotizacion.marca = params.marca;
        fastCotizacion.modelo = params.modelo;
        fastCotizacion.version = params.version;
        fastCotizacion.subversion = params.subversion;


        fastCotizacion.save((err, fastCotizacionStored) => {

            if (err) return res.status(500).send({ message: 'Error al guardar el registro de la cotizacion rapida' });
            if (fastCotizacionStored) {
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    port: 25,
                    auth: {
                        user: 'ing.oarrs@gmail.com',
                        pass: '.Yarel20.'
                            // user: 'Colegiolibam@gmail.com',
                            // pass: 'ColegioLibam2000'
                    },
                    tls: {
                        rejectUnauthorized: false
                    }

                });
                let mes = fastCotizacion.nombre + '  ' + fastCotizacion.telefono + '  ' + fastCotizacion.cp + '  ' + fastCotizacion.marca + ' ' + fastCotizacion.modelo + ' ' + fastCotizacion.version + ' ' + fastCotizacion.subversion + ' ';
                let HelperOptions = {
                    from: 'Cotizacion Rapida',
                    to: 'ing.oarrs@gmail.com, gggseguros@yahoo.com.mx, efrainantonio@ideashappy.com,ggaribay@vaseguro.mx, oramirez@vaseguro.com, vaseguro@vaseguro.mx',
                    subject: 'Cotizacion rapida',
                    // text: contacto.comentarios
                    text: mes
                };
                transporter.sendMail(HelperOptions, (error, info) => {
                    if (error) {
                        res.send(error);
                    } else {
                        res.status(200).send({
                            fastCotizacion: fastCotizacionStored,
                            message: 'Cotizacion enviada'
                        });
                    }
                });
            } else {
                res.status(404).send({ message: 'No se ha registrado el registro del contizacion rapida' });
            }
        });
    } else {
        res.status(200).send({ message: 'Envia todos los campos necesarios !!' });
    }
}


function saveFastCotizacion(req, res) {
    var params = req.body;
    var fastCotizacion = new FastCotizacion();

    if (params.cp && params.marca && params.modelo && params.version && params.subversion) {
        fastCotizacion.cp = params.cp;
        fastCotizacion.marca = params.marca;
        fastCotizacion.modelo = params.modelo;
        fastCotizacion.version = params.version;
        fastCotizacion.subversion = params.subversion;
        fastCotizacion.enviado = params.enviado;
        fastCotizacion.contacto = params.contacto;
        fastCotizacion.falso = params.falso;

        //Controlar el usuario duplicado
        fastCotizacion.save((err, fastCotizacionStored) => {
            if (err) return res.status(500).send({ message: 'Error al hacer el contacto' });
            if (fastCotizacionStored) {
                res.status(200).send({ fastCotizacion: fastCotizacionStored });
            } else {
                res.status(404).send({ message: 'No se ha registrado la cotizacion' })
            }
        });



    } else {

        res.status(200).send({
            message: 'Envia todos los campos necesarios !!!'
        });
    }
}


// //buscar un Cotizacion

function getFastCotizacion(req, res) {
    var fastCotizacionId = req.params.id;
    FastCotizacion.findById(fastCotizacionId, (err, fastCotizacion) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion!!' });
        if (!fastCotizacion) return res.status(404).send({ message: 'La cotizacion no existe!!' });
        return res.status(200).send({ fastCotizacion });
    });
}

// //Buscar todos las cotozaciones

function getFastCotizaciones(req, res) {
    var identity_usuario_id = req.usuario.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 100;

    FastCotizacion.find().sort('_id').paginate(page, itemsPerPage, (err, fastCotizacions, total) => {
        if (err) return res.status(500).send({
            message: 'Error en la peticion'
        });
        if (!fastCotizacions) return res.status(404).send({
            message: 'No hay cotizaciones disponibles'
        });

        return res.status(200).send({
            fastCotizacions,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });


    });
}

function updateFastCotizaciones(req, res) {
    var fastCotizacionId = req.params.id;
    var update = req.body;

    FastCotizacion.findOneAndUpdate(fastCotizacionId, update, { new: true }, (err, FastCotizacionUpdated) => {
        if (err) return res.status(500).send({ message: 'Error de la peticion' });
        if (!FastCotizacionUpdated) return res.status(404).send({ message: 'No se ha podido actualizar la cotizacion' });

        return res.status(200).send({ contacto: FastCotizacionUpdated });

    });

}


module.exports = {
    sendFast,
    saveFastCotizacion,
    getFastCotizacion,
    getFastCotizaciones,
    updateFastCotizaciones


}