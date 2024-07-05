const route = require('express').Router()
const path = require('path')
const adminData = require('./admin.js')
const productController = require('../controllers/product.js')

route.get('/',productController.get_getProducts);

module.exports = route;