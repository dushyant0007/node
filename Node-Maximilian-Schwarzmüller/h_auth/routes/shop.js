
const shopAuthRoutes = require('./shop/auth');
const shopHomeRoutes = require('./shop/shop');
const shopProfileRoutes = require('./shop/profile');

const authMiddlewares = require('../middlewares/auth_middlewares');
const {getLogout} = require('../controllers/shopControllers/auth');

const express = require('express');
const router = express.Router();


router.use('/',shopHomeRoutes);

//------------

router.use('/auth',authMiddlewares.isCustomerNotAuthenticated,shopAuthRoutes);
router.get('/logout',getLogout);

//------------

router.use('/profile',authMiddlewares.isCustomerAuthenticated,shopProfileRoutes)


module.exports = router;