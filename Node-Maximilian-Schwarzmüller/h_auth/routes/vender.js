const venderAuthController = require('../controllers/venderControllers/auth')
const venderDashboardController = require('../controllers/venderControllers/dashboard')
const venderProfileController = require('../controllers/venderControllers/profile')

const express = require('express')
const router = express.Router()

router.get('/login',venderAuthController.getLogin)
router.post('/login',venderAuthController.postLogin)

router.get('/signup',venderAuthController.getSignUp)
router.post('/signup',venderAuthController.postSignUp)

router.get('/dashboard',venderDashboardController.getDashboard)
router.post('/addService',venderDashboardController.postAddService)
router.post('/addService/:serviceType',venderDashboardController.postAddServiceServiceName)

router.get('/profile',venderProfileController.getProfile)
router.post('/profile/editName',venderProfileController.postEditName)
router.post('/profile/editEmail',venderProfileController.postEditEmail)
router.post('/profile/editPhoneNumber',venderProfileController.postEditPhoneNumber)
router.post('/profile/editAddress',venderProfileController.postEditAddress)



module.exports = router