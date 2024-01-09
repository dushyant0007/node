const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

//param middleware only run for specified parameters
// param('para',(req,res,next,val)=>{})
router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)

  //multiple middleware fun
  .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
