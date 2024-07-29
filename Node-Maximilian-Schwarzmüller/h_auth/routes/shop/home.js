const shopHomeController = require('../../controllers/shopControllers/home');

const express = require('express');
const router = express.Router();

router.get('/',shopHomeController.getHome);



module.exports = router;