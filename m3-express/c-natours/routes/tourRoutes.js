const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// param to make middleware only run for specified parameters
// param('para',(req,res,next,val)=>{})
// router.param('id', tourController.checkID);


//Aliasing
router.route('/top-5-cheap')
	// tourController.aliasTopTours as a middleware
	.get(tourController.aliasTopTours,tourController.getAllTours)


router
	.route('/')
	.get(tourController.getAllTours)

	//multiple middleware fun
	.post(tourController.createTour);

router
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);


module.exports = router;
