'use strict'

var express = require('express');
var FastCotizacionController = require('../controllers/fastCotizacion');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/negocios' });
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

api.post('/send-fast/', FastCotizacionController.sendFast);



module.exports = api;