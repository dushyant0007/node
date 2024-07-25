

const vendorDashboardController = require('../../controllers/vendorControllers/dashboard')
const fileUploadMiddlewares = require('../../middlewares/file_upload_middlewares')
const authMiddlewares = require('../../middlewares/auth_middlewares')

const express = require('express')
const router = express.Router()


router.get('/',authMiddlewares.isVenderAuthenticated, vendorDashboardController.getDashboard)

router.post('/add-new-service',authMiddlewares.isVenderAuthenticated, vendorDashboardController.postAddNewService)
router.get('/edit-service/:serviceId',authMiddlewares.isVenderAuthenticated, vendorDashboardController.getEditService)
router.post('/edit-service',authMiddlewares.isVenderAuthenticated, vendorDashboardController.postUpdateService)

router.get('/edit-albums/:serviceId',authMiddlewares.isVenderAuthenticated, vendorDashboardController.getEditAlbums)
router.post('/update-album',authMiddlewares.isVenderAuthenticated,fileUploadMiddlewares.updateAlbum(),vendorDashboardController.postUpdateAlbum)

//fileName should be in query string
router.get('/get-file-from-album',authMiddlewares.isVenderAuthenticated,vendorDashboardController.getResource)


module.exports = router;