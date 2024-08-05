const shopController = require('../../controllers/shopControllers/shop');

const express = require('express');
const router = express.Router();

router.get('/home',shopController.getHome);


router.get('/services',shopController.getServices);
router.get('/services/:serviceId',shopController.getService);
router.get('/services/:serviceId/dates',shopController.getDates);




module.exports = router;