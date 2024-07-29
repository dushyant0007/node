

const vendorDashboardController = require('../../controllers/vendorControllers/dashboard')
const fileUploadMiddlewares = require('../../middlewares/file_upload_middlewares')
const authMiddlewares = require('../../middlewares/auth_middlewares')

const express = require('express')
const router = express.Router()



router.get('/', vendorDashboardController.getDashboard)

router.post('/add-new-service', vendorDashboardController.postAddNewService)

router.get('/edit-service/:serviceId', vendorDashboardController.getEditService)
router.post('/edit-service', fileUploadMiddlewares.uploadServiceProfilePicture(), vendorDashboardController.postUpdateService)
router.post('/edit-service-profile-picture/:serviceId', fileUploadMiddlewares.uploadServiceProfilePicture(),vendorDashboardController.getServiceProfilePicture)

router.get('/edit-albums/:serviceId', vendorDashboardController.getEditAlbums)
router.post('/update-album', fileUploadMiddlewares.updateAlbum(), vendorDashboardController.postUpdateAlbum)
router.delete('/update-album', vendorDashboardController.deleteAlbumItem)

//fileName should be in query string
router.get('/get-albums/:serviceId', vendorDashboardController.getAlbums)


module.exports = router;