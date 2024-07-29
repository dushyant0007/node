

const shopHomeRoutes = require('./shop/home');
const servicesHomeRoutes = require('./shop/services');

const express = require('express');
const router = express.Router();

router.use('/home',shopHomeRoutes);
router.use('/services',servicesHomeRoutes);

module.exports = router;