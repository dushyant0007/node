const vendorAuthController = require('../../controllers/vendorControllers/auth')
const authMiddlewares = require('../../middlewares/auth_middlewares')

const express = require('express')
const router = express.Router()


router.get('/login',authMiddlewares.isVenderNotAuthenticated,vendorAuthController.getLogin)
router.post('/login',authMiddlewares.isVenderNotAuthenticated, vendorAuthController.postLogin)
// ------------

router.get('/signup',authMiddlewares.isVenderNotAuthenticated,vendorAuthController.getSignUp)
router.post('/signup',authMiddlewares.isVenderNotAuthenticated,vendorAuthController.postSignUp)


module.exports = router