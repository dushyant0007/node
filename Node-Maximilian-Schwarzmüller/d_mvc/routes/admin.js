const router = require("express").Router()
const path = require('path')
const adminController = require('../controllers/admin')



router.get('/add-product',adminController.getAddProduct) 
router.post('/add-product',adminController.postAddProduct)

router.get('/listed-products',adminController.getListedProducts)
router.get('/edit-product/:productId',adminController.getEditProduct)
router.post('/edit-product',adminController.postEditProduct)





module.exports = router
