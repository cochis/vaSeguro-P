'use strict'
var mongoose = require('mongoose');
var bcript = require('bcrypt-nodejs');
var Contacto = require('../models/contacto');
var FastCotizacion = require('../models/fastCotizacion');
var fs = require('fs');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var path = require('path');
var nodemailer = require('nodemailer');
// var template = require('email-templates').EmailTemplate;
//registro cotizacion

function sendMail(req, res) {
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //            user: 'ing.oarrs@gmail.com',
    //            pass: '.Garcia20.'
    //        }
    //    });
    //    const mailOptions = {
    //     from: 'ing.oarrs@gmail.com', // sender address
    //     to: 'ing.oarrs@gmail.com', // list of receivers
    //     subject: 'Subject of your email', // Subject line
    //     html: '<p>Your html here</p>'// plain text body
    //   };
    //   transporter.sendMail(mailOptions, function (err, info) {
    //     if(err)
    //       console.log(err)
    //     else
    //       console.log(info);
    //  });
    var params = req.body;
    var contacto = new Contacto();

    // console.log(params);
    //si existen los datos 
    if (params.nombre && params.correo && params.mensaje) {
        //seteamos variables
        contacto.nombre = params.nombre;
        contacto.correo = params.correo;
        contacto.tema = params.tema;
        contacto.mensaje = params.mensaje;
        contacto.telefono = params.telefono;
        contacto.negocio = params.negocio;

        contacto.save((err, contactoStored) => {

            if (err) return res.status(500).send({ message: 'Error al guardar el registro del contacto' });
            if (contactoStored) {


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
                let mes = contacto.nombre + '  ' + contacto.correo + ' ' + contacto.telefono + ' ' + contacto.negocio + ' ' + contacto.mensaje + ' ';
                let HelperOptions = {
                    from: contacto.correo,
                    to: 'ing.oarrs@gmail.com',
                    subject: contacto.tema,
                    // text: contacto.comentarios
                    text: mes

                };




                transporter.sendMail(HelperOptions, (error, info) => {
                    if (error) {

                        res.send(error);
                    } else {
                        res.status(200).send({
                            contacto: contactoStored,
                            message: 'Mail enviado'
                        });
                    }

                });

            } else {
                res.status(404).send({ message: 'No se ha registrado el registro del contacto' });
            }
        });










    } else {

        res.status(200).send({ message: 'Envia todos los campos necesarios !!' });
    }




    //




}


function sendFast(req, res) {
    console.log('entro');
    console.log(req.body);
    var params = req.body;
    var fastCotizacion = new FastCotizacion();

    // console.log(params);
    //si existen los datos 
    if (params.cp && params.marca && params.modelo && params.version && params.subversion) {
        //seteamos variables
        fastCotizacion.cp = params.cp;
        fastCotizacion.marca = params.marca;
        fastCotizacion.modelo = params.modelo;
        fastCotizacion.version = params.version;
        fastCotizacion.subversion = params.subversion;


        fastCotizacion.save((err, fastCotizacionStored) => {

            if (err) return res.status(500).send({ message: 'Error al guardar el registro del contacto' });
            if (fastCotizacionStored) {


                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    secure: false,
                    port: 25,
                    auth: {
                        user: 'ing.oarrs@gmail.com',
                        pass: '.Garcia20.'
                            // user: 'Colegiolibam@gmail.com',
                            // pass: 'ColegioLibam2000'

                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                let mes = fastCotizacion.cp + '  ' + fastCotizacion.marca + ' ' + fastCotizacion.modelo + ' ' + fastCotizacion.version + ' ' + fastCotizacion.subversion + ' ';
                let HelperOptions = {
                    from: 'Cotizacion Rapida',
                    to: 'ing.oarrs@gmail.com',
                    subject: 'Cotizacion rapida',
                    // text: contacto.comentarios
                    text: mes

                };




                transporter.sendMail(HelperOptions, (error, info) => {
                    if (error) {

                        res.send(error);
                    } else {
                        console.log('enciado');
                        res.status(200).send({
                            fastCotizacion: fastCotizacionStored,
                            message: 'Mail enviado'
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




    //




}



function saveContacto(req, res) {
    var params = req.body;
    var contacto = new Contacto();

    if (params.nombre &&
        params.telefono &&
        params.correo) {
        contacto.nombre = params.nombre;
        contacto.telefono = params.telefono;
        contacto.correo = params.correo;
        contacto.negocio = params.negocio;
        contacto.comentarios = params.comentarios;
        contacto.contactado = false;
        contacto.falso = false;

        //Controlar el usuario duplicado
        contacto.save((err, contactoStored) => {
            if (err) return res.status(500).send({ message: 'Error al hacer el contacto' });
            if (contactoStored) {
                res.status(200).send({ contacto: contactoStored });
            } else {
                res.status(404).send({ message: 'No se ha registrado el contacto' })
            }
        });



    } else {

        res.status(200).send({
            message: 'Envia todos los campos necesarios !!!'
        });
    }
}


// //buscar un Cotizacion

function getContacto(req, res) {
    var contactoId = req.params.id;
    Contacto.findById(contactoId, (err, contacto) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion!!' });
        if (!contacto) return res.status(404).send({ message: 'El contacto no existe!!' });
        return res.status(200).send({ contacto });
    });
}

// //Buscar todos las cotozaciones

function getContactos(req, res) {
    var identity_usuario_id = req.usuario.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 100;

    Contacto.find().sort('_id').paginate(page, itemsPerPage, (err, contactos, total) => {
        if (err) return res.status(500).send({
            message: 'Error en la peticion'
        });
        if (!contactos) return res.status(404).send({
            message: 'No hay contactos disponibles'
        });

        return res.status(200).send({
            contactos,
            total,
            pages: Math.ceil(total / itemsPerPage)
        });


    });
}

function updateContacto(req, res) {
    var contactoId = req.params.id;
    var update = req.body;

    Contacto.findOneAndUpdate(contactoId, update, { new: true }, (err, ContactoUpdated) => {
        if (err) return res.status(500).send({ message: 'Error de la peticion' });
        if (!ContactoUpdated) return res.status(404).send({ message: 'No se ha podido actualizar el contacto' });

        return res.status(200).send({ contacto: ContactoUpdated });

    });

}


module.exports = {
    saveContacto,
    getContacto,
    getContactos,
    updateContacto,
    sendMail,
    sendFast


}