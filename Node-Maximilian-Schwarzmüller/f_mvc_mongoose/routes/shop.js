const route = require('express').Router()
const path = require('path')
const adminData = require('./admin.js')
const shopController = require('../controllers/shop.js')

route.get('/',shopController.getIndex);


route.get('/cart',shopController.getCart)
route.post('/cart',shopController.postCart)
route.post('/cart/reduce-qty',shopController.postRecedeCartQty)

route.get('/orders',shopController.getOrders)
route.post('/orders',shopController.postOrder)

route.get('/checkout',shopController.getCheckout) 

route.get('/products',shopController.getProducts)
route.get('/products/:productId',shopController.getProduct)

module.exports = route;