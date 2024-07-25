const authMiddlewares = require('../middlewares/auth_middlewares')

const vendorAuthRoutes = require('./vendor/auth')
const vendorDashboardRoutes = require('./vendor/dashboard')
const vendorProfileRoutes = require('./vendor/profile')

const express = require('express')
const router = express.Router()


router.use('/auth',authMiddlewares.isVenderNotAuthenticated,vendorAuthRoutes)
router.use('/dashboard',authMiddlewares.isVenderAuthenticated,vendorDashboardRoutes)
router.use('/profile',authMiddlewares.isVenderAuthenticated,vendorProfileRoutes)


module.exports = router