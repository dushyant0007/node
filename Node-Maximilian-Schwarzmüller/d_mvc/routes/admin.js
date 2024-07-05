const router = require("express").Router()
const path = require('path')
const productController = require('../controllers/product')



router.get('/add-product',productController.get_addProduct) 

router.post('/add-product',productController.post_addProduct)



module.exports = router
