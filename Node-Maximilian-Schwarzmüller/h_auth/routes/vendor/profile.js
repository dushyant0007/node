

const vendorProfileController = require('../../controllers/vendorControllers/profile')

const express = require('express')
const router = express.Router()

router.get('/',vendorProfileController.getProfile)
router.post('/edit-name',vendorProfileController.postEditName)
router.post('/edit-email',vendorProfileController.postEditEmail)
router.post('/edit-phone-number',vendorProfileController.postEditPhoneNumber)
router.post('/edit-address',vendorProfileController.postEditAddress)
router.post('/reset-password',vendorProfileController.postResetPassword)


module.exports = router