const authMiddlewares = require('../middlewares/auth_middlewares');
const vendorAuthRoutes = require('./vendor/auth');
const vendorDashboardRoutes = require('./vendor/dashboard');
const vendorProfileRoutes = require('./vendor/profile');

const express = require('express');
const router = express.Router();

router.use('/auth',authMiddlewares.isVenderNotAuthenticated,vendorAuthRoutes);

const {getLogout} = require('../controllers/vendorControllers/auth')
router.get('/logout',getLogout)

router.use('/dashboard',authMiddlewares.isVenderAuthenticated,vendorDashboardRoutes);
router.use('/profile',authMiddlewares.isVenderAuthenticated,vendorProfileRoutes);
router.use('/bookings',authMiddlewares.isVenderAuthenticated,(req,res)=> res.json('In development'));


module.exports = router;