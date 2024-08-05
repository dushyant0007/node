const shopProfileController = require('../../controllers/shopControllers/profile');

const express = require('express');
const router = express.Router();

router.get('/',shopProfileController.getProfile);
router.post('/checkout/:serviceId',shopProfileController.getCheckout);
router.get('/checkout/success/:sessionId',shopProfileController.getSuccess);
router.get('/checkout/cancel',shopProfileController.getCancel);
router.get('/bookings',shopProfileController.getBookings);
router.get('/bookings/:bookingId',shopProfileController.getBooking);
router.post('/bookings/:bookingId/review',shopProfileController.postReview);




module.exports = router;