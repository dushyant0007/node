const shopAuthController = require('../../controllers/shopControllers/auth');

const express = require('express');
const router = express.Router();


router.get('/login',shopAuthController.getLogin)
router.post('/login', shopAuthController.postLogin)
// ------------

router.get('/signup',shopAuthController.getSignUp)
router.post('/signup',shopAuthController.postSignUp)
// ------------

module.exports = router;