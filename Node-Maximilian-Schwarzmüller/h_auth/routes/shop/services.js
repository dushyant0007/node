const shopServicesController = require('../../controllers/shopControllers/services');

const express = require('express');
const router = express.Router();

router.get('/',shopServicesController.getServices);
router.get('/:serviceId',shopServicesController.getService);
router.get('/:serviceId/dates',shopServicesController.getDates);
router.post('/book',shopServicesController.postBook)


module.exports = router;