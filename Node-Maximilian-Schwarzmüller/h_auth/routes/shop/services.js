const shopServicesController = require('../../controllers/shopControllers/services');

const express = require('express');
const router = express.Router();

router.get('/',shopServicesController.getServices);
router.get('/:serviceId',shopServicesController.getService);



module.exports = router;