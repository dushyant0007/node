const mongoose = require("mongoose");


const tourSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      unique: true
    },
    rating: {
      type: Number,
      default: 4.5
    },
    price: {
      type: Number,
      required: true,
    }
  })

  const Tour = mongoose.model('Tour', tourSchema);

  module.exports = Tour;

  {
    /*
    const testTour = new Tour({
        name: 'The Forest Hike',
        rating: 3.8,
        price: 495
      })
      testTour.save().then(doc => console.log(doc)).catch(err => console.log('😕', err));
    */
  }