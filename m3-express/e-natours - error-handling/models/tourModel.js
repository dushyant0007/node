const mongoose = require("mongoose");
const validator = require("validator");

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        //validates
        maxLength: [40, "Name can't be more than 40 characters"],
        required: [true, 'A tour must have name'],
        minLength:[10,"A tour name must have more or equal then 10 chars"],

        // in strings we have match validators in order check if the input matches a input regular expression
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
        required: [true, 'A tour should have a difficulty'],

        //validators
        enum: {
            values:['easy','medium','difficult'],
            message: "Difficulty can be either: easy/medium/difficult "
        }
    },
    ratingsAverage: {
        type: Number,
        default: 0,

        //validators
        // min/max  also work with dates
        min:[1,"Rating must be above 1"],
        max:[5,"Rating must be no be above 5 "]
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: true,
    },

    priceDiscount: {
        type:Number,

        //custom validator
        // there are also cupule of libraries on npm for data validation, ex - validator lib
        validate: function(userInpVal){
            //this points to current doc when we a creating a new doc
            // means this function is not going to work on update
            return userInpVal < this.price;
        },

        // we have access to the userInpVal - this is a functionality of mongoose
        message: 'Discount price ({VALUE}) should be below the regular price'
    },

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

}, {toJSON : {virtuals:true},toObject: {virtuals:true}});

//to add derived attributes in the collection
//this vertical property will be created each time when we get some data out of db / its not part of db / so we cant query this property
// this property will be calculated by the function which we pass in the get();
tourSchema.virtual('durationWeeks').get(function(){return (this.duration/7).toFixed(2)})


//'Tour'/name of the collection (which internally gets converted to a lowercase and pluralized collection name)
const Tour = mongoose.model('Tour', tourSchema);

//-----------------------------------------------
//-----------------------------------------------

/*
    Just like express mongoose also have concept of middleware /
    we can use mongoose middleware to make something happen between two events
*/
//  type document/query/aggregate/model  middleware

// 1) document middleware - happen on currently processed middleware
//run before .save() and .create() only (a doc is saved) but not on .insertMany()
tourSchema.pre('save', function(next){
    // this refers to currently processed document
    next();
});

//run after all the per middleware functions
tourSchema.post('save',function(doc,next){

    // ...func body
    next();

});

/////////////

//query middleware - run fun before/after a certain query is executed
// this - fun for all the queries start with find
tourSchema.pre(/^find/,function(next){

    // this points to current query obj
    this.start = Date.now();
    next();
});

//docs -  are all the docs returned by the query
tourSchema.post(/^find/,function(docs,next){

    console.log(`Time to finish the query ${Date.now() - this.start}`);

    next();
});

// aggregation middleware 
// next for calling the next middleware
tourSchema.pre('aggregate',function(next){
    // this points to current agnation object

    // this.pipeline(); //array of all the stages
    //this.pipeline().unshift({$match : {secretTour: {$ne : true}}}) // adding at state in front of pipeline

    next();
});


//-----------------------------------------------
//-----------------------------------------------


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