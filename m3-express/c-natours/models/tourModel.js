const mongoose = require("mongoose");


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have name'],
        unique: true
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour should have a difficulty']
    },
    ratingAverage: {
        type: Number,
        default: 0
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
    },
    priceDiscount: Number,

    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour should have a summery']
    },

    description: {
        type:String,
        trim:true,
    },

    imageCover:{
        type:String,
        required: [true,'A tour must have a cover image']
    },

    image: [String],

    createdAt: {
        type: Date,
        default: Date.now(),
        select:false // this will be excluded automatically in query result
    },

    startDates:[Date]

})

//'Tour'/name of the collection (which internally gets converted to a lowercase and pluralized collection name)
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