const vendorAuthController = require('../../controllers/vendorControllers/auth')
const authMiddlewares = require('../../middlewares/auth_middlewares')

const express = require('express')
const router = express.Router()


router.get('/login',vendorAuthController.getLogin)
router.post('/login', vendorAuthController.postLogin)
// ------------

router.get('/signup',vendorAuthController.getSignUp)
router.post('/signup',vendorAuthController.postSignUp)
// ------------


module.exports = router