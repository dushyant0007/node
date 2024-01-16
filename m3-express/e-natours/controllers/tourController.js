
const Tour = require(`${__dirname}/../models/tourModel`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`)
const catchAsync = require(`${__dirname}/../utils/catchAsync.js`)
const AppError = require(`${__dirname}/../utils/appError.js`)

exports.aliasTopTours = catchAsync((req, res, next) => {
    // ?limit=5&sort=price,-ratingAverage
    req.query.limit = '5';
    req.query.sort = 'price,-ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,summery,difficulty'

    next();
});


exports.getAllTours = catchAsync (async (req, res,next) => {

        // req.query -> return obj containing data form query string  [?duration=1&difficulty=easy&page=2]
        //console.log(req.query)

        //^ BUILD QUERY
        /*
        the sorting,filtering,selecting operation is performed by MongoDB itself when executing 
        the query against the database.
        */

        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitingFields()
            .pagination();


        //^ EXECUTING QUERY
        //query.sort().select().skip(),limit();
        const tours = await features.query;


        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        });
});

exports.getTour = catchAsync(async (req, res,next) => {
    console.log('bal bla bla-------------------------');

        try{
            const tour = await Tour.findById(req.params.id);
        }
        catch(err){ 
            next(new AppError("No tour fount with that id",404));
            return  
        }

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
});


exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour
        }
    });
});

exports.updateTour = catchAsync (async (req, res,next) => {

        const tour = await Tour
            .findByIdAndUpdate(req.params.id, req.body, {
                new: true,  // new:true / new update document is returned
                runValidators: true // to run the validators of schema
            });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

});

exports.deleteTour =catchAsync(async (req, res,next) => {

        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });


});

// Aggregation pipeline
exports.getTourStats = catchAsync ( async (req, res,next) => {

        //document pass through each stage one by one, step by step in the defined sequence
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    // grouping results by there difficulty
                    _id: '$difficulty',
                    //defining new field
                    numTours: { $sum: 1 },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            {
                $match: { _id: { $ne: 'easy' } }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: { stats }
        });
});

//finding busiest month of given year
exports.getMonthlyPlan = catchAsync(async (req, res,next) => {
    
        const year = +req.params.year;

        const plan = await Tour.aggregate([
            {
                /*
                    unwind deconstruct an array field form input document and output one document 
                    for each element of the array
                */
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: { $gte: new Date(`${year}`), $lt: new Date(`${year + 1}`) }
                }
            },
            {
                $group: {
                    //going to accetrect the month from the startDates property
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: { month: '$_id' }
            },

            {   // _id : 0/1 to exclude/include
                $project: { _id: 0 }
            },
            {
                $sort: { numTourStarts: -1 }
            }
            // {
            //     //just keeps the first 6 results form past stage
            //      $limit : 6
            // }
        ]);

        res.status(200).json({
            status: 'success',
            data: plan
        });
    

    

});